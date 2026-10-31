#!/usr/bin/env node
// Fetch precinct results from the two top-25 Texas counties behind Cloudflare
// (Hays, McLennan). Every scripted HTTP client is served "Attention Required",
// and so is plain headless Chrome -- but headless Chrome with
// --disable-blink-features=AutomationControlled and a real user agent passes.
//
// Zero dependencies: system Chrome driven over the DevTools Protocol using the
// WebSocket built into Node 22+.
//
//   node browser_fetch.mjs                      # discover, print what is there
//   node browser_fetch.mjs --download           # save the files
//   node browser_fetch.mjs hays --download
//   node browser_fetch.mjs --url "https://..."  # any Cloudflare-blocked page
//   node browser_fetch.mjs --json              # machine-readable, for fetch_all.py

import { spawn } from "node:child_process";
import { mkdtemp, readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" +
           " (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  process.env.CHROME_PATH,
].filter(Boolean);

// Which documents we care about, per county.
const COUNTIES = {
  hays: {
    index: "https://www.hayscountytx.gov/Archive.aspx?AMID=53",
    // The archive index links one page per election; follow the 2026 ones.
    electionLink: /Archive\.aspx\?ADID=\d+/i,
    electionText: /^20(2[5-9]|3\d)/,
    doc: /precinct|canvass|cvrexport|results reports/i,
  },
  // Brazos puts every election's PDFs on one page, so there are no per-election
  // pages to walk: flat tells the loop to treat the index as the only one.
  brazos: {
    index: "https://elections.brazoscountytx.gov/results/",
    flat: true,
    doc: /precinct|canvass|cumulative/i,
  },
  mclennan: {
    // The bare ArchiveMasterID page renders no list; the search form's own URL
    // does. Keep both and fall through.
    index: "https://www.mclennan.gov/Archive.aspx?ysnExecuteSearch=1&txtKeywords=" +
           "&lngArchiveMasterID=66&txtDateRange=&dtiStartDate=1%2F1%2F24&dtiEndDate=12%2F31%2F26",
    fallback: "https://www.mclennan.gov/Archive.aspx?lngArchiveMasterID=66",
    electionLink: /Archive\.aspx\?ADID=\d+/i,
    electionText: /^\w+ \d+, 20\d\d|20\d\d/,
    doc: /precinct|canvass/i,
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) throw new Error("no Chrome found; set CHROME_PATH");
  return hit;
}

async function launch() {
  const dir = await mkdtemp(join(tmpdir(), "tx-enr-"));
  const child = spawn(findChrome(), [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    // The flag that gets us past Cloudflare's managed challenge:
    "--disable-blink-features=AutomationControlled",
    `--user-agent=${UA}`,
    "--window-size=1440,900",
    "--lang=en-US",
    "--remote-debugging-port=0",
    `--user-data-dir=${dir}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "ignore"] });

  for (let i = 0; i < 100; i++) {
    await sleep(150);
    try {
      const port = (await readFile(join(dir, "DevToolsActivePort"), "utf8")).split("\n")[0].trim();
      if (port) {
        const r = await fetch(`http://127.0.0.1:${port}/json/version`);
        return { child, ws: (await r.json()).webSocketDebuggerUrl };
      }
    } catch { /* not up yet */ }
  }
  child.kill();
  throw new Error("Chrome did not expose a debugging port");
}

class CDP {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.sock = new WebSocket(url);
    this.ready = new Promise((res, rej) => {
      this.sock.addEventListener("open", res, { once: true });
      this.sock.addEventListener("error", rej, { once: true });
    });
    this.sock.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      const slot = this.pending.get(msg.id);
      if (!slot) return;
      this.pending.delete(msg.id);
      msg.error ? slot.rej(new Error(msg.error.message)) : slot.res(msg.result);
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.sock.send(JSON.stringify({ id, method, params, sessionId }));
      setTimeout(() => {
        if (this.pending.delete(id)) rej(new Error(`${method} timed out`));
      }, 90_000);
    });
  }
  close() { try { this.sock.close(); } catch {} }
}

async function newPage(cdp) {
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  return sessionId;
}

async function evaluate(cdp, sessionId, expression) {
  const r = await cdp.send("Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text || "eval failed");
  return r.result.value;
}

async function goto(cdp, sessionId, url) {
  await cdp.send("Page.navigate", { url }, sessionId);
  // Cloudflare's interstitial can bounce once; settle, then confirm.
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    const state = await evaluate(cdp, sessionId,
      "document.readyState + '|' + (document.title||'')");
    if (state.startsWith("complete")) {
      if (/Attention Required|Just a moment/i.test(state)) continue;  // still challenged
      return;
    }
  }
}

const LINKS = `Array.from(document.querySelectorAll('a[href]')).map(a =>
  ({ text: (a.textContent||'').replace(/\\s+/g,' ').trim(), href: a.href }))`;

// Same-origin fetch from inside the page: Cloudflare's cookies ride along.
const asBase64 = (url) => `
  (async () => {
    let r;
    try {
      r = await fetch(${JSON.stringify(url)}, { credentials: 'include' });
    } catch (e) { return { error: 'network: ' + e.message }; }
    if (!r.ok) return { error: r.status };
    const b = new Uint8Array(await r.arrayBuffer());
    let s = '';
    for (let i = 0; i < b.length; i += 0x8000)
      s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return { b64: btoa(s), n: b.length };
  })()`;

// CivicPlus URLs carry no extension and the real type is in the link label
// ("... (ZIP)"), so take it from there and verify against the magic bytes --
// a CVR export saved as .pdf is a trap for whatever reads the directory next.
function extFor(text, bytes) {
  if (bytes) {
    const head = bytes.subarray(0, 4).toString("latin1");
    if (head.startsWith("PK")) return ".zip";
    if (head === "%PDF") return ".pdf";
  }
  const m = /\((zip|pdf|csv|xlsx?|txt)\)\s*$/i.exec((text || "").trim());
  return m ? "." + m[1].toLowerCase() : ".bin";
}

const taken = new Set();

// McLennan labels every link just "Canvass (.pdf)" / "Precinct (.pdf)", so the
// label alone collapses dozens of documents onto one filename. Its URL slug is
// descriptive ("Democratic-Party-Canvass-Report-6-2-2026..."), so prefer that,
// and qualify with the election page plus a counter so nothing overwrites.
function nameFor(county, url, text, bytes, election) {
  const slug = decodeURIComponent(url.split("?")[0].split("/").pop() || "");
  const useSlug = slug.length > 8 && !/^\d+$/.test(slug);
  let base = (useSlug ? slug : (text || slug || "download"))
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!useSlug && election)
    base = election.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
             .slice(0, 48) + "_" + base;
  base = base.slice(0, 120);
  const ext = /\.[a-z0-9]{2,4}$/i.test(base) ? "" : extFor(text, bytes);
  let name = `${county}_${base}${ext}`;
  for (let i = 2; taken.has(name); i++)
    name = `${county}_${base}_${i}${ext}`;
  taken.add(name);
  return name;
}

async function run() {
  const argv = process.argv.slice(2);
  const download = argv.includes("--download");
  const asJson = argv.includes("--json");
  const rows = [];
  const say = (...a) => { if (!asJson) console.log(...a); };
  const outIdx = argv.indexOf("--out");
  const outDir = outIdx >= 0 ? argv[outIdx + 1] : "browser_out";
  const urlIdx = argv.indexOf("--url");
  const valueSlots = new Set();
  if (outIdx >= 0) valueSlots.add(outIdx + 1);
  if (urlIdx >= 0) valueSlots.add(urlIdx + 1);
  const names = argv.filter((a, i) => !a.startsWith("--") && !valueSlots.has(i));
  const wanted = names.length ? names : Object.keys(COUNTIES);

  const { child, ws } = await launch();
  const cdp = new CDP(ws);
  await cdp.ready;
  const page = await newPage(cdp);

  let originNow = null;
  const save = async (county, url, text, election) => {
    // The in-page fetch must be same-origin. McLennan's archive lives on
    // mclennan.gov but its documents on tx-mclennancounty.civicplus.com, so
    // hop to the file's own origin (also Cloudflare-fronted) before fetching.
    const origin = new URL(url).origin;
    if (origin !== originNow) {
      await goto(cdp, page, origin + "/");
      originNow = origin;
    }
    const got = await evaluate(cdp, page, asBase64(url));
    if (!got || got.error)
      return { error: String(got && got.error), note: `fetch failed (${got && got.error})` };
    await mkdir(outDir, { recursive: true });
    const bytes = Buffer.from(got.b64, "base64");
    const path = join(outDir, nameFor(county, url, text, bytes, election));
    await writeFile(path, bytes);
    return { path, bytes: got.n, note: `saved ${got.n.toLocaleString()}b -> ${path}` };
  };

  try {
    if (urlIdx >= 0) {
      const url = argv[urlIdx + 1];
      await goto(cdp, page, url);
      const links = await evaluate(cdp, page, LINKS);
      const docs = links.filter((l) => /\.(pdf|zip|csv|xlsx?)$/i.test(l.href)
                                     || /DocumentCenter/i.test(l.href));
      say(`${url}\n  ${links.length} link(s)`);
      for (const l of docs) say(`  ${l.text.slice(0, 50).padEnd(52)}${l.href}`);
      if (asJson) console.log(JSON.stringify(docs, null, 1));
      return;
    }

    for (const county of wanted) {
      const spec = COUNTIES[county];
      if (!spec) { console.log(`${county.padEnd(11)} unknown county`); continue; }
      const pick = (links) => links
        .filter((l) => spec.electionLink.test(l.href) && spec.electionText.test(l.text));
      await goto(cdp, page, spec.index);
      originNow = new URL(spec.index).origin;
      let elections = spec.flat
        ? [{ text: "all elections", href: spec.index }]
        : pick(await evaluate(cdp, page, LINKS));
      if (!elections.length && !spec.flat && spec.fallback) {
        await goto(cdp, page, spec.fallback);
        originNow = new URL(spec.fallback).origin;
        elections = pick(await evaluate(cdp, page, LINKS));
      }
      const seen = new Set();
      const pages = elections.filter((l) => !seen.has(l.href) && seen.add(l.href));
      say(`${county.padEnd(11)} ${pages.length} election page(s) via Cloudflare`);

      for (const ev of pages.slice(0, 6)) {
        await goto(cdp, page, ev.href);
        originNow = new URL(ev.href).origin;
        const docs = (await evaluate(cdp, page, LINKS))
          .filter((l) => spec.doc.test(l.text) && /DocumentCenter|\.(pdf|zip)/i.test(l.href));
        say(`${"".padEnd(11)} ${ev.text.slice(0, 44).padEnd(46)}${docs.length} doc(s)`);
        for (const d of docs) {
          let note = "", saved = null;
          if (download) {
            saved = await save(county, d.href, d.text, ev.text);
            note = "  " + saved.note;
          }
          say(`${"".padEnd(13)} ${d.text.slice(0, 52).padEnd(54)}${d.href}${note}`);
          rows.push({
            county, election: ev.text, label: d.text, url: d.href,
            path: saved && saved.path, bytes: saved && saved.bytes,
            error: saved && saved.error,
          });
        }
      }
    }
    if (asJson) console.log(JSON.stringify(rows, null, 1));
  } finally {
    cdp.close();
    child.kill();
  }
}

run().catch((e) => { console.error("error:", e.message); process.exit(1); });
