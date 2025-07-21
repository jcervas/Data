// https://www.nytimes.com/interactive/2020/11/07/us/elections/pennsylvania-counties-battleground-state.html
import { l as linear, s as sqrt, t as tsvParse, f as max, g as color } from './chunks/index.aae73710.js';
import './chunks/index.026efa19.js';
import { S as SvelteComponent, i as init, s as safe_not_equal, e as element, t as text, a as space, b as svg_element, c as claim_element, d as children, f as claim_text, g as detach, h as claim_space, j as attr, k as set_style, l as insert, m as append, n as noop, o as empty, p as create_component, q as claim_component, r as mount_component, u as transition_in, v as transition_out, w as destroy_component, x as group_outros, y as check_outros, z as destroy_each, A as onMount, B as tick, C as binding_callbacks, D as set_data, E as xlink_attr, F as add_resize_listener, G as add_render_callback } from './chunks/index.304b573f.js';
import { g as geoAlbersUsa, a as geoTransverseMercator, b as geoConicConformal, c as geoPath } from './chunks/index.e452f006.js';

const ramps = {
  oranges: ['#EEEEEE', '#F2A60D'],
  purples: ['#EDCCE1', '#A86A94', '#663777'],
  grayishPurples: ['#E0D3DC', '#917889', '#56445D']
};

const colors = {
  base: '#ffffff',
  nullColor: '#f4f4f4',
  blue: '#006b9e',
  red: '#ae4544',
  tossup: '#e7d459',
  ramps: {
    turnout: ramps.oranges,
    covidDeaths: ramps.grayishPurples
  },
  rawRamps: ramps
};

var cityCentroids = {"New York":[-74.0059413,40.7127837],"Los Angeles":[-118.2436849,34.0522342],"Chicago":[-87.6297982,41.8781136],"Houston":[-95.3698028,29.7604267],"Philadelphia":[-75.1652215,39.9525839],"Phoenix":[-112.0740373,33.4483771],"San Antonio":[-98.4936282,29.4241219],"San Diego":[-117.1610838,32.715738],"Dallas":[-96.7969879,32.7766642],"San Jose":[-121.8863286,37.3382082],"Austin":[-97.7430608,30.267153],"Indianapolis":[-86.158068,39.768403],"Jacksonville":[-81.655651,30.3321838],"San Francisco":[-122.4194155,37.7749295],"Columbus":[-84.9877094,32.4609764],"Charlotte":[-80.8431267,35.2270869],"Fort Worth":[-97.3307658,32.7554883],"Detroit":[-83.0457538,42.331427],"El Paso":[-106.4424559,31.7775757],"Memphis":[-90.0489801,35.1495343],"Seattle":[-122.3320708,47.6062095],"Denver":[-104.990251,39.7392358],"Washington":[-77.0368707,38.9071923],"Boston":[-71.0588801,42.3600825],"Nashville-Davidson":[-86.7816016,36.1626638],"Baltimore":[-76.6121893,39.2903848],"Oklahoma City":[-97.5164276,35.4675602],"Louisville/Jefferson County":[-85.7584557,38.2526647],"Portland":[-122.6764816,45.5230622],"Las Vegas":[-115.1398296,36.1699412],"Milwaukee":[-87.9064736,43.0389025],"Albuquerque":[-106.6055534,35.0853336],"Tucson":[-110.926479,32.2217429],"Fresno":[-119.7725868,36.7468422],"Sacramento":[-121.4943996,38.5815719],"Long Beach":[-118.1937395,33.7700504],"Kansas City":[-94.6274636,39.114053],"Mesa":[-111.8314724,33.4151843],"Virginia Beach":[-75.977985,36.8529263],"Atlanta":[-84.3879824,33.7489954],"Colorado Springs":[-104.8213634,38.8338816],"Omaha":[-95.9979883,41.2523634],"Raleigh":[-78.6381787,35.7795897],"Miami":[-80.1917902,25.7616798],"Oakland":[-122.2711137,37.8043637],"Minneapolis":[-93.2650108,44.977753],"Tulsa":[-95.992775,36.1539816],"Cleveland":[-81.6943605,41.49932],"Wichita":[-97.336111,37.688889],"Arlington":[-97.1080656,32.735687],"New Orleans":[-90.0715323,29.9510658],"Bakersfield":[-119.0187125,35.3732921],"Tampa":[-82.4571776,27.950575],"Honolulu":[-157.8583333,21.3069444],"Aurora":[-88.3200715,41.7605849],"Anaheim":[-117.9145036,33.8352932],"Santa Ana":[-117.8678338,33.7455731],"St. Louis":[-90.1994042,38.6270025],"Riverside":[-117.3961564,33.9533487],"Corpus Christi":[-97.396381,27.8005828],"Lexington-Fayette":[-84.5037164,38.0405837],"Pittsburgh":[-79.9958864,40.4406248],"Anchorage":[-149.9002778,61.2180556],"Stockton":[-121.2907796,37.9577016],"Cincinnati":[-84.5120196,39.1031182],"St. Paul":[-93.0899578,44.9537029],"Toledo":[-83.555212,41.6639383],"Greensboro":[-79.7919754,36.0726354],"Newark":[-74.1723667,40.735657],"Plano":[-96.6988856,33.0198431],"Henderson":[-114.9817213,36.0395247],"Lincoln":[-96.6851982,40.8257625],"Buffalo":[-78.8783689,42.8864468],"Jersey City":[-74.0776417,40.7281575],"Chula Vista":[-117.0841955,32.6400541],"Fort Wayne":[-85.1393513,41.079273],"Orlando":[-81.3792365,28.5383355],"St. Petersburg":[-82.64,27.773056],"Chandler":[-111.8412502,33.3061605],"Laredo":[-99.4803241,27.5305671],"Norfolk":[-76.2858726,36.8507689],"Durham":[-78.898619,35.9940329],"Madison":[-89.4012302,43.0730517],"Lubbock":[-101.8551665,33.5778631],"Irvine":[-117.7946942,33.6839473],"Winston-Salem":[-80.244216,36.0998596],"Glendale":[-118.255075,34.1425078],"Garland":[-96.6388833,32.912624],"Hialeah":[-80.2781057,25.8575963],"Reno":[-119.8138027,39.5296329],"Chesapeake":[-76.2874927,36.7682088],"Gilbert":[-111.789027,33.3528264],"Baton Rouge":[-91.1403196,30.4582829],"Irving":[-96.9488945,32.8140177],"Scottsdale":[-111.9260519,33.4941704],"North Las Vegas":[-115.1175013,36.1988592],"Fremont":[-121.9885719,37.5482697],"Boise City":[-116.2146068,43.6187102],"Richmond":[-122.3477486,37.9357576],"San Bernardino":[-117.2897652,34.1083449],"Birmingham":[-86.80249,33.5206608],"Spokane":[-117.4260466,47.6587802],"Rochester":[-92.4801989,44.0121221],"Des Moines":[-93.6091064,41.6005448],"Modesto":[-120.9968782,37.6390972],"Fayetteville":[-78.8783585,35.0526641],"Tacoma":[-122.4442906,47.2528768],"Oxnard":[-119.1770516,34.1975048],"Fontana":[-117.435048,34.0922335],"Montgomery":[-86.2999689,32.3668052],"Moreno Valley":[-117.2296717,33.9424658],"Shreveport":[-93.7501789,32.5251516],"Yonkers":[-73.8987469,40.9312099],"Akron":[-81.5190053,41.0814447],"Huntington Beach":[-117.9992265,33.660297],"Little Rock":[-92.2895948,34.7464809],"Augusta-Richmond County":[-82.0105148,33.4734978],"Amarillo":[-101.8312969,35.2219971],"Mobile":[-88.0398912,30.6953657],"Grand Rapids":[-85.6680863,42.9633599],"Salt Lake City":[-111.8910474,40.7607793],"Tallahassee":[-84.2807329,30.4382559],"Huntsville":[-86.5861037,34.7303688],"Grand Prairie":[-96.9977846,32.7459645],"Knoxville":[-83.9207392,35.9606384],"Worcester":[-71.8022934,42.2625932],"Newport News":[-76.4730122,37.0870821],"Brownsville":[-97.4974838,25.9017472],"Overland Park":[-94.6707917,38.9822282],"Santa Clarita":[-118.542586,34.3916641],"Providence":[-71.4128343,41.8239891],"Garden Grove":[-117.9414477,33.7739053],"Chattanooga":[-85.3096801,35.0456297],"Oceanside":[-117.3794834,33.1958696],"Jackson":[-90.1848103,32.2987573],"Fort Lauderdale":[-80.1373174,26.1224386],"Santa Rosa":[-122.7140548,38.440429],"Rancho Cucamonga":[-117.5931084,34.1063989],"Port St. Lucie":[-80.3582261,27.2730492],"Tempe":[-111.9400054,33.4255104],"Ontario":[-117.6508876,34.0633443],"Vancouver":[-122.6614861,45.6387281],"Cape Coral":[-81.9495331,26.5628537],"Sioux Falls":[-96.7311034,43.5445959],"Springfield":[-89.6501481,39.7817213],"Peoria":[-89.5889864,40.6936488],"Pembroke Pines":[-80.2962555,26.007765],"Elk Grove":[-121.3716178,38.4087993],"Salem":[-123.0350963,44.9428975],"Lancaster":[-118.1541632,34.6867846],"Corona":[-117.5664384,33.8752935],"Eugene":[-123.0867536,44.0520691],"Palmdale":[-118.1164613,34.5794343],"Salinas":[-121.6555013,36.6777372],"Pasadena":[-118.1445155,34.1477849],"Fort Collins":[-105.084423,40.5852602],"Hayward":[-122.0807964,37.6688205],"Pomona":[-117.7499909,34.055103],"Cary":[-78.7811169,35.79154],"Rockford":[-89.0939952,42.2711311],"Alexandria":[-77.0469214,38.8048355],"Escondido":[-117.086421,33.1192068],"McKinney":[-96.6397822,33.1972465],"Joliet":[-88.0817251,41.525031],"Sunnyvale":[-122.0363496,37.36883],"Torrance":[-118.3406288,33.8358492],"Bridgeport":[-73.1951767,41.1865478],"Lakewood":[-105.0813734,39.7047095],"Hollywood":[-80.1494901,26.0112014],"Paterson":[-74.171811,40.9167654],"Naperville":[-88.1535352,41.7508391],"Syracuse":[-76.1474244,43.0481221],"Mesquite":[-96.5991593,32.7667955],"Dayton":[-84.1916069,39.7589478],"Savannah":[-81.0998342,32.0835407],"Clarksville":[-87.3594528,36.5297706],"Orange":[-117.8531119,33.7877944],"Fullerton":[-117.9242966,33.8703596],"Killeen":[-97.7277959,31.1171194],"Frisco":[-96.8236116,33.1506744],"Hampton":[-76.3452218,37.0298687],"McAllen":[-98.2300124,26.2034071],"Warren":[-83.0146526,42.5144566],"Bellevue":[-122.2006786,47.610377],"West Valley City":[-112.0010501,40.6916132],"Columbia":[-92.3340724,38.9517053],"Olathe":[-94.8191285,38.8813958],"Sterling Heights":[-83.0302033,42.5803122],"New Haven":[-72.9278835,41.308274],"Miramar":[-80.3035602,25.9860762],"Waco":[-97.1466695,31.549333],"Thousand Oaks":[-118.8375937,34.1705609],"Cedar Rapids":[-91.6656232,41.9778795],"Charleston":[-79.9310512,32.7764749],"Visalia":[-119.2920585,36.3302284],"Topeka":[-95.6890185,39.0558235],"Elizabeth":[-74.2107006,40.6639916],"Gainesville":[-82.3248262,29.6516344],"Thornton":[-104.9719243,39.8680412],"Roseville":[-121.2880059,38.7521235],"Carrollton":[-96.8899636,32.9756415],"Coral Springs":[-80.2706044,26.271192],"Stamford":[-73.5387341,41.0534302],"Simi Valley":[-118.781482,34.2694474],"Concord":[-122.0310733,37.9779776],"Hartford":[-72.6850932,41.7637111],"Kent":[-122.2348431,47.3809335],"Lafayette":[-92.0198427,30.2240897],"Midland":[-102.0779146,31.9973456],"Surprise":[-112.3679279,33.6292337],"Denton":[-97.1330683,33.2148412],"Victorville":[-117.2927641,34.5362184],"Evansville":[-87.5710898,37.9715592],"Santa Clara":[-121.9552356,37.3541079],"Abilene":[-99.7331439,32.4487364],"Athens-Clarke County":[-83.357567,33.9519347],"Vallejo":[-122.2566367,38.1040864],"Allentown":[-75.4901833,40.6084305],"Norman":[-97.4394777,35.2225668],"Beaumont":[-94.1265562,30.080174],"Independence":[-94.4155068,39.0911161],"Murfreesboro":[-86.39027,35.8456213],"Ann Arbor":[-83.7430378,42.2808256],"Berkeley":[-122.272747,37.8715926],"Provo":[-111.6585337,40.2338438],"El Monte":[-118.0275667,34.0686206],"Lansing":[-84.5555347,42.732535],"Fargo":[-96.7898034,46.8771863],"Downey":[-118.1331593,33.9401088],"Costa Mesa":[-117.9186689,33.6411316],"Wilmington":[-77.9447102,34.2257255],"Arvada":[-105.0874842,39.8027644],"Inglewood":[-118.3531311,33.9616801],"Miami Gardens":[-80.2456045,25.9420377],"Carlsbad":[-117.3505939,33.1580933],"Westminster":[-105.0372046,39.8366528],"Odessa":[-102.3676431,31.8456816],"Manchester":[-71.4547891,42.9956397],"Elgin":[-88.2825668,42.0354084],"West Jordan":[-111.9391031,40.6096698],"Round Rock":[-97.678896,30.5082551],"Clearwater":[-82.8001026,27.9658533],"Waterbury":[-73.0514965,41.5581525],"Gresham":[-122.4302013,45.5001357],"Fairfield":[-122.0399663,38.2493581],"Billings":[-108.5006904,45.7832856],"Lowell":[-71.3161718,42.6334247],"San Buenaventura (Ventura)":[-119.2290316,34.274646],"Pueblo":[-104.6091409,38.2544472],"High Point":[-80.0053176,35.9556923],"West Covina":[-117.9389526,34.0686208],"Murrieta":[-117.2139232,33.5539143],"Cambridge":[-71.1097335,42.3736158],"Antioch":[-121.805789,38.0049214],"Temecula":[-117.1483648,33.4936391],"Norwalk":[-118.081733,33.9022367],"Centennial":[-104.8771726,39.5807452],"Everett":[-122.2020794,47.9789848],"Palm Bay":[-80.5886646,28.0344621],"Wichita Falls":[-98.4933873,33.9137085],"Green Bay":[-88.019826,44.519159],"Daly City":[-122.4702079,37.6879241],"Burbank":[-118.3089661,34.1808392],"Richardson":[-96.7298519,32.9483335],"Pompano Beach":[-80.1247667,26.2378597],"North Charleston":[-79.9748103,32.8546197],"Broken Arrow":[-95.7974526,36.060949],"Boulder":[-105.2705456,40.0149856],"West Palm Beach":[-80.0533746,26.7153424],"Santa Maria":[-120.4357191,34.9530337],"El Cajon":[-116.9625269,32.7947731],"Davenport":[-90.5776367,41.5236437],"Rialto":[-117.3703235,34.1064001],"Las Cruces":[-106.7636538,32.3199396],"San Mateo":[-122.3255254,37.5629917],"Lewisville":[-96.994174,33.046233],"South Bend":[-86.2519898,41.6763545],"Lakeland":[-81.9498042,28.0394654],"Erie":[-80.085059,42.1292241],"Tyler":[-95.3010624,32.3512601],"Pearland":[-95.2860474,29.5635666],"College Station":[-96.3344068,30.627977]};

/* src/components/stateMap/arrowKey.svelte generated by Svelte v3.29.4 */

function create_fragment(ctx) {
	let div6;
	let div5;
	let div0;
	let t0;
	let t1;
	let div1;
	let t2;
	let t3;
	let svg;
	let g0;
	let polygon0;
	let line0;
	let g1;
	let polygon1;
	let line1;
	let t4;
	let div4;
	let div2;
	let t5;
	let t6;
	let div3;
	let t7;
	let div6_class_value;

	return {
		c() {
			div6 = element("div");
			div5 = element("div");
			div0 = element("div");
			t0 = text("Shift from 2016");
			t1 = space();
			div1 = element("div");
			t2 = text("In counties that have reported almost all of their votes");
			t3 = space();
			svg = svg_element("svg");
			g0 = svg_element("g");
			polygon0 = svg_element("polygon");
			line0 = svg_element("line");
			g1 = svg_element("g");
			polygon1 = svg_element("polygon");
			line1 = svg_element("line");
			t4 = space();
			div4 = element("div");
			div2 = element("div");
			t5 = text("More Democratic");
			t6 = space();
			div3 = element("div");
			t7 = text("More Republican");
			this.h();
		},
		l(nodes) {
			div6 = claim_element(nodes, "DIV", { class: true });
			var div6_nodes = children(div6);
			div5 = claim_element(div6_nodes, "DIV", { class: true });
			var div5_nodes = children(div5);
			div0 = claim_element(div5_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t0 = claim_text(div0_nodes, "Shift from 2016");
			div0_nodes.forEach(detach);
			t1 = claim_space(div5_nodes);
			div1 = claim_element(div5_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			t2 = claim_text(div1_nodes, "In counties that have reported almost all of their votes");
			div1_nodes.forEach(detach);
			t3 = claim_space(div5_nodes);

			svg = claim_element(
				div5_nodes,
				"svg",
				{
					xmlns: true,
					width: true,
					height: true,
					viewBox: true,
					style: true,
					class: true
				},
				1
			);

			var svg_nodes = children(svg);
			g0 = claim_element(svg_nodes, "g", {}, 1);
			var g0_nodes = children(g0);
			polygon0 = claim_element(g0_nodes, "polygon", { points: true, fill: true }, 1);
			children(polygon0).forEach(detach);

			line0 = claim_element(
				g0_nodes,
				"line",
				{
					x1: true,
					y1: true,
					x2: true,
					y2: true,
					fill: true,
					stroke: true,
					"stroke-miterlimit": true,
					"stroke-width": true
				},
				1
			);

			children(line0).forEach(detach);
			g0_nodes.forEach(detach);
			g1 = claim_element(svg_nodes, "g", {}, 1);
			var g1_nodes = children(g1);
			polygon1 = claim_element(g1_nodes, "polygon", { points: true, fill: true }, 1);
			children(polygon1).forEach(detach);

			line1 = claim_element(
				g1_nodes,
				"line",
				{
					x1: true,
					y1: true,
					x2: true,
					y2: true,
					fill: true,
					stroke: true,
					"stroke-miterlimit": true,
					"stroke-width": true
				},
				1
			);

			children(line1).forEach(detach);
			g1_nodes.forEach(detach);
			svg_nodes.forEach(detach);
			t4 = claim_space(div5_nodes);
			div4 = claim_element(div5_nodes, "DIV", { class: true });
			var div4_nodes = children(div4);
			div2 = claim_element(div4_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			t5 = claim_text(div2_nodes, "More Democratic");
			div2_nodes.forEach(detach);
			t6 = claim_space(div4_nodes);
			div3 = claim_element(div4_nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			t7 = claim_text(div3_nodes, "More Republican");
			div3_nodes.forEach(detach);
			div4_nodes.forEach(detach);
			div5_nodes.forEach(detach);
			div6_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(div0, "class", "e-arrow-map-title svelte-i4c0xm");
			attr(div1, "class", "e-arrow-map-desc svelte-i4c0xm");
			attr(polygon0, "points", "0 0 14.956 14.021 20.49 0.665 0 0");
			attr(polygon0, "fill", "#006b9e");
			attr(line0, "x1", "16.9904");
			attr(line0, "y1", "7.0394");
			attr(line0, "x2", "42.8784");
			attr(line0, "y2", "17.7652");
			attr(line0, "fill", "none");
			attr(line0, "stroke", "#006b9e");
			attr(line0, "stroke-miterlimit", "10");
			attr(line0, "stroke-width", "4");
			attr(polygon1, "points", "100 0 85.044 14.021 79.51 0.665 100 0");
			attr(polygon1, "fill", "#ae4544");
			attr(line1, "x1", "83.0096");
			attr(line1, "y1", "7.0394");
			attr(line1, "x2", "57.1216");
			attr(line1, "y2", "17.7652");
			attr(line1, "fill", "none");
			attr(line1, "stroke", "#ae4544");
			attr(line1, "stroke-miterlimit", "10");
			attr(line1, "stroke-width", "4");
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "width", "100");
			attr(svg, "height", "19.6129");
			attr(svg, "viewBox", "0 0 100 19.6129");
			set_style(svg, "opacity", "0.8");
			attr(svg, "class", "svelte-i4c0xm");
			attr(div2, "class", "e-key-text e-key-text-democratic svelte-i4c0xm");
			attr(div3, "class", "e-key-text e-key-text-republican svelte-i4c0xm");
			attr(div4, "class", "e-key-text-wrapper");
			attr(div5, "class", "e-map-key e-map-key-arrow svelte-i4c0xm");
			attr(div6, "class", div6_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-i4c0xm");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div5);
			append(div5, div0);
			append(div0, t0);
			append(div5, t1);
			append(div5, div1);
			append(div1, t2);
			append(div5, t3);
			append(div5, svg);
			append(svg, g0);
			append(g0, polygon0);
			append(g0, line0);
			append(svg, g1);
			append(g1, polygon1);
			append(g1, line1);
			append(div5, t4);
			append(div5, div4);
			append(div4, div2);
			append(div2, t5);
			append(div4, t6);
			append(div4, div3);
			append(div3, t7);
		},
		p(ctx, [dirty]) {
			if (dirty & /*keyClass*/ 1 && div6_class_value !== (div6_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-i4c0xm")) {
				attr(div6, "class", div6_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div6);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { keyClass } = $$props;

	$$self.$$set = $$props => {
		if ("keyClass" in $$props) $$invalidate(0, keyClass = $$props.keyClass);
	};

	return [keyClass];
}

class ArrowKey extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { keyClass: 0 });
	}
}

/* src/components/stateMap/bubbleMarginKey.svelte generated by Svelte v3.29.4 */

function create_fragment$1(ctx) {
	let div3;
	let div2;
	let div1;
	let p0;
	let t0;
	let t1;
	let div0;
	let t2;
	let t3;
	let p1;
	let span0;
	let t4;
	let span1;
	let t5;
	let t6;
	let p2;
	let span2;
	let t7;
	let span3;
	let t8;
	let div3_class_value;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div1 = element("div");
			p0 = element("p");
			t0 = text("Margin in 2020");
			t1 = space();
			div0 = element("div");
			t2 = text("Circles show the size of lead in each county.");
			t3 = space();
			p1 = element("p");
			span0 = element("span");
			t4 = space();
			span1 = element("span");
			t5 = text("Biden");
			t6 = space();
			p2 = element("p");
			span2 = element("span");
			t7 = space();
			span3 = element("span");
			t8 = text("Trump");
			this.h();
		},
		l(nodes) {
			div3 = claim_element(nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			p0 = claim_element(div1_nodes, "P", { class: true });
			var p0_nodes = children(p0);
			t0 = claim_text(p0_nodes, "Margin in 2020");
			p0_nodes.forEach(detach);
			t1 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t2 = claim_text(div0_nodes, "Circles show the size of lead in each county.");
			div0_nodes.forEach(detach);
			t3 = claim_space(div1_nodes);
			p1 = claim_element(div1_nodes, "P", { class: true });
			var p1_nodes = children(p1);
			span0 = claim_element(p1_nodes, "SPAN", { class: true, style: true });
			children(span0).forEach(detach);
			t4 = claim_space(p1_nodes);
			span1 = claim_element(p1_nodes, "SPAN", { class: true });
			var span1_nodes = children(span1);
			t5 = claim_text(span1_nodes, "Biden");
			span1_nodes.forEach(detach);
			p1_nodes.forEach(detach);
			t6 = claim_space(div1_nodes);
			p2 = claim_element(div1_nodes, "P", { class: true });
			var p2_nodes = children(p2);
			span2 = claim_element(p2_nodes, "SPAN", { class: true, style: true });
			children(span2).forEach(detach);
			t7 = claim_space(p2_nodes);
			span3 = claim_element(p2_nodes, "SPAN", { class: true });
			var span3_nodes = children(span3);
			t8 = claim_text(span3_nodes, "Trump");
			span3_nodes.forEach(detach);
			p2_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			div3_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(p0, "class", "e-label svelte-8750y0");
			attr(div0, "class", "e-map-key svelte-8750y0");
			attr(span0, "class", "e-swatch e-democrat svelte-8750y0");
			set_style(span0, "background-color", hexa(/*blue*/ ctx[1], 0.7));
			set_style(span0, "border-color", /*blue*/ ctx[1]);
			attr(span1, "class", "e-last-name");
			attr(p1, "class", "e-candidate svelte-8750y0");
			attr(span2, "class", "e-swatch e-republican svelte-8750y0");
			set_style(span2, "background-color", hexa(/*red*/ ctx[2], 0.7));
			set_style(span2, "border-color", /*red*/ ctx[2]);
			attr(span3, "class", "e-last-name");
			attr(p2, "class", "e-candidate svelte-8750y0");
			attr(div1, "class", "e-map-key e-map-key-results svelte-8750y0");
			attr(div2, "class", "e-map-key e-map-key-bubbles e-note svelte-8750y0");
			attr(div3, "class", div3_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-8750y0");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div1);
			append(div1, p0);
			append(p0, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, t2);
			append(div1, t3);
			append(div1, p1);
			append(p1, span0);
			append(p1, t4);
			append(p1, span1);
			append(span1, t5);
			append(div1, t6);
			append(div1, p2);
			append(p2, span2);
			append(p2, t7);
			append(p2, span3);
			append(span3, t8);
		},
		p(ctx, [dirty]) {
			if (dirty & /*keyClass*/ 1 && div3_class_value !== (div3_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-8750y0")) {
				attr(div3, "class", div3_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div3);
		}
	};
}

function hexa(hex, opacity) {
	hex = hex.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
	return result;
}

function instance$1($$self, $$props, $$invalidate) {
	const { blue, red, nullColor } = colors;
	let { keyClass } = $$props;

	$$self.$$set = $$props => {
		if ("keyClass" in $$props) $$invalidate(0, keyClass = $$props.keyClass);
	};

	return [keyClass, blue, red];
}

class BubbleMarginKey extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { keyClass: 0 });
	}
}

/* src/components/stateMap/turnoutKey.svelte generated by Svelte v3.29.4 */

function create_fragment$2(ctx) {
	let div3;
	let div2;
	let div1;
	let p0;
	let t0;
	let t1;
	let div0;
	let t2;
	let t3;
	let p1;
	let span0;
	let t4;
	let t5;
	let span1;
	let t6;
	let span2;
	let t7;
	let div3_class_value;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div1 = element("div");
			p0 = element("p");
			t0 = text("Turnout in 2020");
			t1 = space();
			div0 = element("div");
			t2 = text("Colors show total votes compared with 2016.");
			t3 = space();
			p1 = element("p");
			span0 = element("span");
			t4 = text("100%");
			t5 = space();
			span1 = element("span");
			t6 = space();
			span2 = element("span");
			t7 = text("125%");
			this.h();
		},
		l(nodes) {
			div3 = claim_element(nodes, "DIV", { class: true });
			var div3_nodes = children(div3);
			div2 = claim_element(div3_nodes, "DIV", { class: true });
			var div2_nodes = children(div2);
			div1 = claim_element(div2_nodes, "DIV", { class: true });
			var div1_nodes = children(div1);
			p0 = claim_element(div1_nodes, "P", { class: true });
			var p0_nodes = children(p0);
			t0 = claim_text(p0_nodes, "Turnout in 2020");
			p0_nodes.forEach(detach);
			t1 = claim_space(div1_nodes);
			div0 = claim_element(div1_nodes, "DIV", { class: true });
			var div0_nodes = children(div0);
			t2 = claim_text(div0_nodes, "Colors show total votes compared with 2016.");
			div0_nodes.forEach(detach);
			t3 = claim_space(div1_nodes);
			p1 = claim_element(div1_nodes, "P", { class: true });
			var p1_nodes = children(p1);
			span0 = claim_element(p1_nodes, "SPAN", { class: true });
			var span0_nodes = children(span0);
			t4 = claim_text(span0_nodes, "100%");
			span0_nodes.forEach(detach);
			t5 = claim_space(p1_nodes);
			span1 = claim_element(p1_nodes, "SPAN", { class: true, style: true });
			children(span1).forEach(detach);
			t6 = claim_space(p1_nodes);
			span2 = claim_element(p1_nodes, "SPAN", { class: true });
			var span2_nodes = children(span2);
			t7 = claim_text(span2_nodes, "125%");
			span2_nodes.forEach(detach);
			p1_nodes.forEach(detach);
			div1_nodes.forEach(detach);
			div2_nodes.forEach(detach);
			div3_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(p0, "class", "e-label svelte-nakm5o");
			attr(div0, "class", "e-map-key svelte-nakm5o");
			attr(span0, "class", "e-last-name svelte-nakm5o");
			attr(span1, "class", "e-swatch svelte-nakm5o");
			set_style(span1, "background-image", "linear-gradient(90deg, " + /*colorRamp*/ ctx[1][0] + ", " + /*colorRamp*/ ctx[1][1] + ")");
			attr(span2, "class", "e-last-name svelte-nakm5o");
			attr(p1, "class", "e-keyRow svelte-nakm5o");
			attr(div1, "class", "e-map-key e-map-key-results svelte-nakm5o");
			attr(div2, "class", "e-map-key e-map-key-bubbles e-note svelte-nakm5o");
			attr(div3, "class", div3_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-nakm5o");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div1);
			append(div1, p0);
			append(p0, t0);
			append(div1, t1);
			append(div1, div0);
			append(div0, t2);
			append(div1, t3);
			append(div1, p1);
			append(p1, span0);
			append(span0, t4);
			append(p1, t5);
			append(p1, span1);
			append(p1, t6);
			append(p1, span2);
			append(span2, t7);
		},
		p(ctx, [dirty]) {
			if (dirty & /*keyClass*/ 1 && div3_class_value !== (div3_class_value = "keyWrap " + /*keyClass*/ ctx[0] + " svelte-nakm5o")) {
				attr(div3, "class", div3_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div3);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { keyClass } = $$props;
	const colorRamp = colors.ramps.turnout;

	$$self.$$set = $$props => {
		if ("keyClass" in $$props) $$invalidate(0, keyClass = $$props.keyClass);
	};

	return [keyClass, colorRamp];
}

class TurnoutKey extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { keyClass: 0 });
	}
}

/* src/components/stateMap/SwingArrow.svelte generated by Svelte v3.29.4 */

function create_if_block(ctx) {
	let g;
	let line;
	let line_marker_end_value;
	let line_x__value;
	let line_y__value;
	let line_x__value_1;
	let line_y__value_1;
	let g_class_value;
	let g_transform_value;

	return {
		c() {
			g = svg_element("g");
			line = svg_element("line");
			this.h();
		},
		l(nodes) {
			g = claim_element(
				nodes,
				"g",
				{
					class: true,
					transform: true,
					style: true
				},
				1
			);

			var g_nodes = children(g);

			line = claim_element(
				g_nodes,
				"line",
				{
					class: true,
					"marker-end": true,
					style: true,
					x1: true,
					y1: true,
					x2: true,
					y2: true
				},
				1
			);

			children(line).forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(line, "class", "marker svelte-1g46v39");
			attr(line, "marker-end", line_marker_end_value = "url(#arrowhead-" + /*colorClass*/ ctx[2] + ")");
			set_style(line, "stroke-width", /*widthScale*/ ctx[6](/*arrow*/ ctx[1].length));
			attr(line, "x1", line_x__value = /*arrow*/ ctx[1].stem.x1);
			attr(line, "y1", line_y__value = /*arrow*/ ctx[1].stem.y1);
			attr(line, "x2", line_x__value_1 = /*arrow*/ ctx[1].stem.x2);
			attr(line, "y2", line_y__value_1 = /*arrow*/ ctx[1].stem.y2);
			attr(g, "class", g_class_value = "swingArrow yellow " + /*colorClass*/ ctx[2] + " " + /*d*/ ctx[0].name + " svelte-1g46v39");
			attr(g, "transform", g_transform_value = "translate(" + /*x*/ ctx[4] + " " + /*y*/ ctx[5] + ")");
			set_style(g, "--color", /*color*/ ctx[3]);
			set_style(g, "stroke", /*color*/ ctx[3]);
			set_style(g, "fill", /*color*/ ctx[3]);
			set_style(g, "opacity", "0.8");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, line);
		},
		p(ctx, dirty) {
			if (dirty & /*colorClass*/ 4 && line_marker_end_value !== (line_marker_end_value = "url(#arrowhead-" + /*colorClass*/ ctx[2] + ")")) {
				attr(line, "marker-end", line_marker_end_value);
			}

			if (dirty & /*arrow*/ 2) {
				set_style(line, "stroke-width", /*widthScale*/ ctx[6](/*arrow*/ ctx[1].length));
			}

			if (dirty & /*arrow*/ 2 && line_x__value !== (line_x__value = /*arrow*/ ctx[1].stem.x1)) {
				attr(line, "x1", line_x__value);
			}

			if (dirty & /*arrow*/ 2 && line_y__value !== (line_y__value = /*arrow*/ ctx[1].stem.y1)) {
				attr(line, "y1", line_y__value);
			}

			if (dirty & /*arrow*/ 2 && line_x__value_1 !== (line_x__value_1 = /*arrow*/ ctx[1].stem.x2)) {
				attr(line, "x2", line_x__value_1);
			}

			if (dirty & /*arrow*/ 2 && line_y__value_1 !== (line_y__value_1 = /*arrow*/ ctx[1].stem.y2)) {
				attr(line, "y2", line_y__value_1);
			}

			if (dirty & /*colorClass, d*/ 5 && g_class_value !== (g_class_value = "swingArrow yellow " + /*colorClass*/ ctx[2] + " " + /*d*/ ctx[0].name + " svelte-1g46v39")) {
				attr(g, "class", g_class_value);
			}

			if (dirty & /*x, y*/ 48 && g_transform_value !== (g_transform_value = "translate(" + /*x*/ ctx[4] + " " + /*y*/ ctx[5] + ")")) {
				attr(g, "transform", g_transform_value);
			}

			if (dirty & /*color*/ 8) {
				set_style(g, "--color", /*color*/ ctx[3]);
			}

			if (dirty & /*color*/ 8) {
				set_style(g, "stroke", /*color*/ ctx[3]);
			}

			if (dirty & /*color*/ 8) {
				set_style(g, "fill", /*color*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

function create_fragment$3(ctx) {
	let if_block_anchor;
	let if_block = /*arrow*/ ctx[1].length && create_if_block(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l(nodes) {
			if (if_block) if_block.l(nodes);
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (/*arrow*/ ctx[1].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

const baseMaxArrowLength = 35;
const baseMaxArrowStrokeWidth = 6;

// const swing16to20 = +d.margin20  - +d.margin16
function toRad(a) {
	return a * Math.PI / 180;
}

function instance$3($$self, $$props, $$invalidate) {
	let { d } = $$props;
	let { xy } = $$props;
	let { w } = $$props;
	const getMaxLength = linear().domain([200, 375, 400]).range([2 / 4 * 0.7, 0.8, 1]).clamp(true);
	const getMaxStroke = linear().domain([200, 375, 600]).range([2 / 6, 0.8, 1]).clamp(true);

	// clamp(w/400, 0.4, 1.2)
	const maxArrowLength = getMaxLength(w) * baseMaxArrowLength;

	const maxArrowStrokeWidth = getMaxStroke(w) * baseMaxArrowStrokeWidth;
	const lengthScale = linear().domain([0, 10]).range([0, maxArrowLength]); // Math.abs(margin2020)

	// .clamp(true)
	const widthScale = linear().domain(lengthScale.range()).range([0, maxArrowStrokeWidth]).clamp(true);

	const { blue, red, tossup } = colors;
	const swing16to20 = +d.shift;

	function getArrow() {
		const arrowLength = lengthScale(Math.abs(swing16to20)) || 0;
		const angle = 20 + Math.random() * 2;
		const dx = arrowLength * Math.sign(swing16to20);
		const dy = -Math.abs(dx) * Math.sin(toRad(angle));

		const blankArrow = {
			stem: { x1: 0, y1: 0, x2: 0, y2: 0 },
			head: ""
		};

		if (!dx) return blankArrow;
		const stem = [[0, 0], [dx, dy]];

		return {
			stem: {
				x1: stem[0][0],
				y1: stem[0][1],
				x2: stem[1][0],
				y2: stem[1][1]
			},
			length: arrowLength
		};
	}

	$$self.$$set = $$props => {
		if ("d" in $$props) $$invalidate(0, d = $$props.d);
		if ("xy" in $$props) $$invalidate(7, xy = $$props.xy);
		if ("w" in $$props) $$invalidate(8, w = $$props.w);
	};

	let arrow;
	let colorClass;
	let color;
	let x;
	let y;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*xy, d*/ 129) {
			 $$invalidate(4, x = xy(d).x);
		}

		if ($$self.$$.dirty & /*xy, d*/ 129) {
			 $$invalidate(5, y = xy(d).y);
		}
	};

	 $$invalidate(1, arrow = getArrow());
	 $$invalidate(2, colorClass = swing16to20 < 0 ? "blue" : "red");
	 $$invalidate(3, color = swing16to20 < 0 ? blue : red);
	return [d, arrow, colorClass, color, x, y, widthScale, xy, w];
}

class SwingArrow extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { d: 0, xy: 7, w: 8 });
	}
}

function identity(x) {
  return x;
}

function transform(transform) {
  if (transform == null) return identity;
  var x0,
      y0,
      kx = transform.scale[0],
      ky = transform.scale[1],
      dx = transform.translate[0],
      dy = transform.translate[1];
  return function(input, i) {
    if (!i) x0 = y0 = 0;
    var j = 2, n = input.length, output = new Array(n);
    output[0] = (x0 += input[0]) * kx + dx;
    output[1] = (y0 += input[1]) * ky + dy;
    while (j < n) output[j] = input[j], ++j;
    return output;
  };
}

function reverse(array, n) {
  var t, j = array.length, i = j - n;
  while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
}

function feature(topology, o) {
  return o.type === "GeometryCollection"
      ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
      : feature$1(topology, o);
}

function feature$1(topology, o) {
  var id = o.id,
      bbox = o.bbox,
      properties = o.properties == null ? {} : o.properties,
      geometry = object(topology, o);
  return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
      : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
      : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
}

function object(topology, o) {
  var transformPoint = transform(topology.transform),
      arcs = topology.arcs;

  function arc(i, points) {
    if (points.length) points.pop();
    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
      points.push(transformPoint(a[k], k));
    }
    if (i < 0) reverse(points, n);
  }

  function point(p) {
    return transformPoint(p);
  }

  function line(arcs) {
    var points = [];
    for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
    if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
    return points;
  }

  function ring(arcs) {
    var points = line(arcs);
    while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
    return points;
  }

  function polygon(arcs) {
    return arcs.map(ring);
  }

  function geometry(o) {
    var type = o.type, coordinates;
    switch (type) {
      case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
      case "Point": coordinates = point(o.coordinates); break;
      case "MultiPoint": coordinates = o.coordinates.map(point); break;
      case "LineString": coordinates = line(o.arcs); break;
      case "MultiLineString": coordinates = o.arcs.map(line); break;
      case "Polygon": coordinates = polygon(o.arcs); break;
      case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
      default: return null;
    }
    return {type: type, coordinates: coordinates};
  }

  return geometry(o);
}

function stitch(topology, arcs) {
  var stitchedArcs = {},
      fragmentByStart = {},
      fragmentByEnd = {},
      fragments = [],
      emptyIndex = -1;

  // Stitch empty arcs first, since they may be subsumed by other arcs.
  arcs.forEach(function(i, j) {
    var arc = topology.arcs[i < 0 ? ~i : i], t;
    if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
      t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
    }
  });

  arcs.forEach(function(i) {
    var e = ends(i),
        start = e[0],
        end = e[1],
        f, g;

    if (f = fragmentByEnd[start]) {
      delete fragmentByEnd[f.end];
      f.push(i);
      f.end = end;
      if (g = fragmentByStart[end]) {
        delete fragmentByStart[g.start];
        var fg = g === f ? f : f.concat(g);
        fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else if (f = fragmentByStart[end]) {
      delete fragmentByStart[f.start];
      f.unshift(i);
      f.start = start;
      if (g = fragmentByEnd[start]) {
        delete fragmentByEnd[g.end];
        var gf = g === f ? f : g.concat(f);
        fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
      } else {
        fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
      }
    } else {
      f = [i];
      fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
    }
  });

  function ends(i) {
    var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
    if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
    else p1 = arc[arc.length - 1];
    return i < 0 ? [p1, p0] : [p0, p1];
  }

  function flush(fragmentByEnd, fragmentByStart) {
    for (var k in fragmentByEnd) {
      var f = fragmentByEnd[k];
      delete fragmentByStart[f.start];
      delete f.start;
      delete f.end;
      f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
      fragments.push(f);
    }
  }

  flush(fragmentByEnd, fragmentByStart);
  flush(fragmentByStart, fragmentByEnd);
  arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

  return fragments;
}

function planarRingArea(ring) {
  var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
  while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
  return Math.abs(area); // Note: doubled area!
}

function merge(topology) {
  return object(topology, mergeArcs.apply(this, arguments));
}

function mergeArcs(topology, objects) {
  var polygonsByArc = {},
      polygons = [],
      groups = [];

  objects.forEach(geometry);

  function geometry(o) {
    switch (o.type) {
      case "GeometryCollection": o.geometries.forEach(geometry); break;
      case "Polygon": extract(o.arcs); break;
      case "MultiPolygon": o.arcs.forEach(extract); break;
    }
  }

  function extract(polygon) {
    polygon.forEach(function(ring) {
      ring.forEach(function(arc) {
        (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
      });
    });
    polygons.push(polygon);
  }

  function area(ring) {
    return planarRingArea(object(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
  }

  polygons.forEach(function(polygon) {
    if (!polygon._) {
      var group = [],
          neighbors = [polygon];
      polygon._ = 1;
      groups.push(group);
      while (polygon = neighbors.pop()) {
        group.push(polygon);
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
              if (!polygon._) {
                polygon._ = 1;
                neighbors.push(polygon);
              }
            });
          });
        });
      }
    }
  });

  polygons.forEach(function(polygon) {
    delete polygon._;
  });

  return {
    type: "MultiPolygon",
    arcs: groups.map(function(polygons) {
      var arcs = [], n;

      // Extract the exterior (unique) arcs.
      polygons.forEach(function(polygon) {
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
              arcs.push(arc);
            }
          });
        });
      });

      // Stitch the arcs into one or more rings.
      arcs = stitch(topology, arcs);

      // If more than one ring is returned,
      // at most one of these rings can be the exterior;
      // choose the one with the greatest absolute area.
      if ((n = arcs.length) > 1) {
        for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
          if ((ki = area(arcs[i])) > k) {
            t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
          }
        }
      }

      return arcs;
    })
  };
}

/* src/components/stateMap/SwingArrowsLayer.svelte generated by Svelte v3.29.4 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	child_ctx[12] = i;
	return child_ctx;
}

// (25:0) {#if unfilteredCountyGeometries.length > 0}
function create_if_block_1(ctx) {
	let g;
	let path;
	let path_d_value;

	return {
		c() {
			g = svg_element("g");
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);
			path = claim_element(g_nodes, "path", { d: true }, 1);
			children(path).forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[2](/*negativeMesh*/ ctx[7]));
			attr(g, "class", "nullCountiesOutline svelte-jjjh5i");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, path);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 4 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[2](/*negativeMesh*/ ctx[7]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

// (31:0) {#if isFiltered}
function create_if_block$1(ctx) {
	let g;
	let path;
	let path_d_value;

	return {
		c() {
			g = svg_element("g");
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);
			path = claim_element(g_nodes, "path", { d: true }, 1);
			children(path).forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[2](/*mesh*/ ctx[6]));
			attr(g, "class", "countiesOutline svelte-jjjh5i");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, path);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 4 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[2](/*mesh*/ ctx[6]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

// (39:1) {#each data.voteData as d, i}
function create_each_block(ctx) {
	let swingarrow;
	let current;

	swingarrow = new SwingArrow({
			props: {
				d: /*d*/ ctx[10],
				xy: /*xy*/ ctx[1],
				w: /*w*/ ctx[4]
			}
		});

	return {
		c() {
			create_component(swingarrow.$$.fragment);
		},
		l(nodes) {
			claim_component(swingarrow.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(swingarrow, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const swingarrow_changes = {};
			if (dirty & /*data*/ 1) swingarrow_changes.d = /*d*/ ctx[10];
			if (dirty & /*xy*/ 2) swingarrow_changes.xy = /*xy*/ ctx[1];
			if (dirty & /*w*/ 16) swingarrow_changes.w = /*w*/ ctx[4];
			swingarrow.$set(swingarrow_changes);
		},
		i(local) {
			if (current) return;
			transition_in(swingarrow.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(swingarrow.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(swingarrow, detaching);
		}
	};
}

function create_fragment$4(ctx) {
	let t0;
	let t1;
	let g;
	let current;
	let if_block0 = /*unfilteredCountyGeometries*/ ctx[5].length > 0 && create_if_block_1(ctx);
	let if_block1 = /*isFiltered*/ ctx[3] && create_if_block$1(ctx);
	let each_value = /*data*/ ctx[0].voteData;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			if (if_block0) if_block0.l(nodes);
			t0 = claim_space(nodes);
			if (if_block1) if_block1.l(nodes);
			t1 = claim_space(nodes);
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g, "class", "swingArrows");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (/*unfilteredCountyGeometries*/ ctx[5].length > 0) if_block0.p(ctx, dirty);

			if (/*isFiltered*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$1(ctx);
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*data, xy, w*/ 19) {
				each_value = /*data*/ ctx[0].voteData;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(g, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t0);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(t1);
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { xy } = $$props;
	let { theGeoPath } = $$props;
	let { isFiltered } = $$props;
	let { w } = $$props;
	const countyGeometries = data.topojson.objects.counties.geometries;
	const unfilteredCountyGeometries = [];

	const filteredCountyGeometries = countyGeometries.filter(feature => {
		const foundVoteData = data.voteData.find(d => d.fips === feature.properties.GEOID);
		if (!foundVoteData) unfilteredCountyGeometries.push(feature);
		return !!foundVoteData;
	});

	const mesh = merge(data.topojson, filteredCountyGeometries);
	const negativeMesh = merge(data.topojson, unfilteredCountyGeometries);

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("xy" in $$props) $$invalidate(1, xy = $$props.xy);
		if ("theGeoPath" in $$props) $$invalidate(2, theGeoPath = $$props.theGeoPath);
		if ("isFiltered" in $$props) $$invalidate(3, isFiltered = $$props.isFiltered);
		if ("w" in $$props) $$invalidate(4, w = $$props.w);
	};

	return [
		data,
		xy,
		theGeoPath,
		isFiltered,
		w,
		unfilteredCountyGeometries,
		mesh,
		negativeMesh
	];
}

class SwingArrowsLayer extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			data: 0,
			xy: 1,
			theGeoPath: 2,
			isFiltered: 3,
			w: 4
		});
	}
}

/* src/components/stateMap/PrecinctMarginsLayer.svelte generated by Svelte v3.29.4 */

function create_fragment$5(ctx) {
	let canvas_1;
	let canvas_1_width_value;
	let canvas_1_height_value;

	return {
		c() {
			canvas_1 = element("canvas");
			this.h();
		},
		l(nodes) {
			canvas_1 = claim_element(nodes, "CANVAS", { width: true, height: true, class: true });
			children(canvas_1).forEach(detach);
			this.h();
		},
		h() {
			attr(canvas_1, "width", canvas_1_width_value = /*w*/ ctx[0] * DPR);
			attr(canvas_1, "height", canvas_1_height_value = /*w*/ ctx[0] * /*aspectRatio*/ ctx[1] * DPR);
			attr(canvas_1, "class", "svelte-1nk28fv");
		},
		m(target, anchor) {
			insert(target, canvas_1, anchor);
			/*canvas_1_binding*/ ctx[7](canvas_1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*w*/ 1 && canvas_1_width_value !== (canvas_1_width_value = /*w*/ ctx[0] * DPR)) {
				attr(canvas_1, "width", canvas_1_width_value);
			}

			if (dirty & /*w, aspectRatio*/ 3 && canvas_1_height_value !== (canvas_1_height_value = /*w*/ ctx[0] * /*aspectRatio*/ ctx[1] * DPR)) {
				attr(canvas_1, "height", canvas_1_height_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(canvas_1);
			/*canvas_1_binding*/ ctx[7](null);
		}
	};
}

const DPR = 2;

function crunchPrecinctData(retrieved) {
	const result = retrieved.centroids.map(c => {
		const found = retrieved.precinctData.find(pd => pd.geo === c.GEOID);
		return Object.assign({}, found, c);
	});

	result.sort((a, b) => {
		if (!a.margin) return -1;
		const am = Math.abs(+a.margin);
		const bm = Math.abs(+b.margin);
		return bm - am;
	});

	return result;
}

function drawCircle(ctx, x, y, r) {
	ctx.beginPath();
	ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
}

function instance$5($$self, $$props, $$invalidate) {
	const { blue, red, nullColor } = colors;
	let { w } = $$props;
	let { aspectRatio } = $$props;
	let { theGeoPath } = $$props;
	let { proj } = $$props;
	let { xy } = $$props;
	let { data } = $$props;
	let canvas;
	let precincts;
	let ready = false;
	const colorScale = linear().domain([-50, 50]).range([blue, red]).clamp(true);

	const maxSymbolSizeScale = linear().domain([300, 1000]).range([6, 20]).clamp(true); // width
	// r

	const rScale = sqrt().clamp(true);

	async function getPrecinctData() {
		const precinctDataResponse = await fetch(`https://static01.nyt.com/newsgraphics/2020/10/29/election-early-battlegrounds/45579f3932d462157f286aa871565b51188d8426/${data.state}-precincts.json`);
		const precinctData = await precinctDataResponse.json();
		const centroidsResponse = await fetch(`https://static01.nyt.com/newsgraphics/2020/10/29/election-early-battlegrounds/45579f3932d462157f286aa871565b51188d8426/${data.state.toLowerCase()}-precinct-centroids.tsv`);
		const centroids = tsvParse(await centroidsResponse.text());

		centroids.forEach(c => {
			c.lon = +c.cx;
			c.lat = +c.cy;
		});

		return { precinctData, centroids };
	}

	async function render() {
		await tick(); // so that we know the canvas finished initializing after state change
		const marginVotesMax = max(precincts.map(m => m.marginVotes));
		rScale.domain([0, marginVotesMax]).range([0, maxSymbolSizeScale(w)]);
		const ctx = canvas.getContext("2d");

		precincts.forEach(d => {
			const loc = xy(d);
			loc.x *= DPR;
			loc.y *= DPR;
			const r = d.marginVotes ? rScale(Math.abs(+d.marginVotes)) : 3;
			const color$1 = d.margin ? colorScale(+d.margin) : nullColor;
			ctx.fillStyle = color(color$1).copy({ opacity: 0.3 });
			ctx.strokeStyle = color$1;
			ctx.lineWidth = 1;
			drawCircle(ctx, loc.x, loc.y, r);
			ctx.fill();
			ctx.stroke();
		});
	}

	onMount(async () => {
		await tick();
		const retrieved = await getPrecinctData();
		precincts = crunchPrecinctData(retrieved);
		$$invalidate(9, ready = true);
	});

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(2, canvas);
		});
	}

	$$self.$$set = $$props => {
		if ("w" in $$props) $$invalidate(0, w = $$props.w);
		if ("aspectRatio" in $$props) $$invalidate(1, aspectRatio = $$props.aspectRatio);
		if ("theGeoPath" in $$props) $$invalidate(3, theGeoPath = $$props.theGeoPath);
		if ("proj" in $$props) $$invalidate(4, proj = $$props.proj);
		if ("xy" in $$props) $$invalidate(5, xy = $$props.xy);
		if ("data" in $$props) $$invalidate(6, data = $$props.data);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*ready, xy, w*/ 545) {
			 if (ready && xy && w) render();
		}
	};

	return [w, aspectRatio, canvas, theGeoPath, proj, xy, data, canvas_1_binding];
}

class PrecinctMarginsLayer extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			w: 0,
			aspectRatio: 1,
			theGeoPath: 3,
			proj: 4,
			xy: 5,
			data: 6
		});
	}
}

var fracking = [ { id:"019-21456",
    lat:"39.721900999999804",
    lon:"-79.96171700000001" },
  { id:"019-21456",
    lat:"39.72228200000125",
    lon:"-79.95445700000268" },
  { id:"019-21456",
    lat:"39.72201799999978",
    lon:"-79.98107599999999" },
  { id:"019-21456",
    lat:"39.72388699999979",
    lon:"-79.994379" },
  { id:"019-21456",
    lat:"39.724378999999786",
    lon:"-79.987551" },
  { id:"019-21456",
    lat:"39.72627299999979",
    lon:"-80.041661" },
  { id:"019-21456",
    lat:"39.74359422149541",
    lon:"-79.35761036903095" },
  { id:"019-21456",
    lat:"39.7332498269385",
    lon:"-79.80095880355728" },
  { id:"019-21456",
    lat:"39.72511499999981",
    lon:"-80.010918" },
  { id:"019-21456",
    lat:"39.72596799999979",
    lon:"-79.997212" },
  { id:"019-21456",
    lat:"39.72645899999979",
    lon:"-79.990384" },
  { id:"019-21456",
    lat:"39.727178999999786",
    lon:"-79.981042" },
  { id:"019-21456",
    lat:"39.746491563503",
    lon:"-79.52956368340338" },
  { id:"019-21456",
    lat:"39.73938999999981",
    lon:"-79.83315099999999" },
  { id:"019-21456",
    lat:"39.73908197567781",
    lon:"-79.84474045380294" },
  { id:"019-21456",
    lat:"39.73646999999979",
    lon:"-80.008393" },
  { id:"019-21456",
    lat:"39.73860099999981",
    lon:"-79.9634" },
  { id:"019-21456",
    lat:"39.73329200000324",
    lon:"-80.33272199999418" },
  { id:"019-21456",
    lat:"39.733347999999786",
    lon:"-79.96583099999998" },
  { id:"019-21456",
    lat:"39.73253672420304",
    lon:"-79.95788810316564" },
  { id:"019-21456",
    lat:"39.732506999999806",
    lon:"-80.01317899999998" },
  { id:"019-21456",
    lat:"39.7328899999998",
    lon:"-80.00222100000002" },
  { id:"019-21456",
    lat:"39.7337569999998",
    lon:"-79.98741500000001" },
  { id:"019-21456",
    lat:"39.73509522917827",
    lon:"-80.3785099159173" },
  { id:"019-21456",
    lat:"39.74877599999981",
    lon:"-79.844685" },
  { id:"019-21456",
    lat:"39.75776490839107",
    lon:"-79.35656965583597" },
  { id:"019-21456",
    lat:"39.752531999094145",
    lon:"-79.81144449576617" },
  { id:"019-21456",
    lat:"39.747927999999796",
    lon:"-79.877925" },
  { id:"019-21456",
    lat:"39.74321700003281",
    lon:"-80.43878900001411" },
  { id:"019-21456",
    lat:"39.73891399743793",
    lon:"-80.50321398932495" },
  { id:"019-21456",
    lat:"39.74030550008059",
    lon:"-80.49474299993255" },
  { id:"019-21456",
    lat:"39.76155550611075",
    lon:"-80.00719149476464" },
  { id:"019-21456",
    lat:"39.7533559999998",
    lon:"-80.48264699999999" },
  { id:"019-21456",
    lat:"39.76918099999981",
    lon:"-79.80784199999998" },
  { id:"019-21456",
    lat:"39.76950899999981",
    lon:"-79.80234700000001" },
  { id:"019-21456",
    lat:"39.76922650000123",
    lon:"-80.00527099999663" },
  { id:"019-21456",
    lat:"39.76909499999982",
    lon:"-79.89023099999999" },
  { id:"019-21456",
    lat:"39.78148099999981",
    lon:"-79.86009900000002" },
  { id:"019-21456",
    lat:"39.7750439999998",
    lon:"-80.00048300000002" },
  { id:"019-21456",
    lat:"39.78505404377538",
    lon:"-80.02883848044645" },
  { id:"019-21456",
    lat:"39.79401399999981",
    lon:"-79.84352400000002" },
  { id:"019-21456",
    lat:"39.788691999999806",
    lon:"-80.185897" },
  { id:"019-21456",
    lat:"39.77168899999981",
    lon:"-80.02713599999998" },
  { id:"019-21456",
    lat:"39.7724709999999",
    lon:"-80.00621649999876" },
  { id:"019-21456",
    lat:"39.7689829999998",
    lon:"-80.235675" },
  { id:"019-21456",
    lat:"39.7740079999998",
    lon:"-79.996728" },
  { id:"019-21456",
    lat:"39.74274857564878",
    lon:"-79.98918505960168" },
  { id:"019-21456",
    lat:"39.738306999581646",
    lon:"-80.19163650793597" },
  { id:"019-21456",
    lat:"39.74336250579437",
    lon:"-80.01197602356596" },
  { id:"019-21456",
    lat:"39.74696699185757",
    lon:"-79.85852949634562" },
  { id:"019-21456",
    lat:"39.79947499999981",
    lon:"-79.86827999999998" },
  { id:"019-21456",
    lat:"39.78733452495973",
    lon:"-80.50956252489502" },
  { id:"019-21456",
    lat:"39.799757999999805",
    lon:"-79.891334" },
  { id:"019-21456",
    lat:"39.79647202869043",
    lon:"-80.11232901242285" },
  { id:"019-21456",
    lat:"39.792372098179015",
    lon:"-80.50288893305527" },
  { id:"019-21456",
    lat:"39.81069399999981",
    lon:"-79.967405" },
  { id:"019-21456",
    lat:"39.8021669999998",
    lon:"-80.00490400000001" },
  { id:"019-21456",
    lat:"39.80405599999981",
    lon:"-79.968267" },
  { id:"019-21456",
    lat:"39.80252614723136",
    lon:"-80.04682630904455" },
  { id:"019-21456",
    lat:"39.80222355546579",
    lon:"-80.5017085024453" },
  { id:"019-21456",
    lat:"39.80649702346109",
    lon:"-80.23051275300051" },
  { id:"019-21456",
    lat:"39.78927650705153",
    lon:"-80.48128197606697" },
  { id:"019-21456",
    lat:"39.7929419999998",
    lon:"-80.33206899999999" },
  { id:"019-21456",
    lat:"39.79281399999983",
    lon:"-80.371497" },
  { id:"019-21456",
    lat:"39.7939609999998",
    lon:"-80.335969" },
  { id:"019-21456",
    lat:"39.807403999999806",
    lon:"-80.41575899999998" },
  { id:"019-21456",
    lat:"39.8152279999998",
    lon:"-80.038328" },
  { id:"019-21456",
    lat:"39.81884399999981",
    lon:"-79.976686" },
  { id:"019-21456",
    lat:"39.814387304652996",
    lon:"-80.17388198403681" },
  { id:"019-21456",
    lat:"39.818855500009164",
    lon:"-80.0360900000155" },
  { id:"019-21456",
    lat:"39.81366113311258",
    lon:"-80.47731717973157" },
  { id:"019-21456",
    lat:"39.8272139999998",
    lon:"-79.910145" },
  { id:"019-21456",
    lat:"39.825268999999814",
    lon:"-79.95473300000002" },
  { id:"019-21456",
    lat:"39.819200641059794",
    lon:"-80.3430873780135" },
  { id:"019-21456",
    lat:"39.824588999999825",
    lon:"-80.059617" },
  { id:"019-21456",
    lat:"39.8257359999998",
    lon:"-80.039366" },
  { id:"019-21456",
    lat:"39.8233919999998",
    lon:"-79.97408599999999" },
  { id:"019-21456",
    lat:"39.822999999999794",
    lon:"-80.02263899999997" },
  { id:"019-21456",
    lat:"39.81536226671408",
    lon:"-80.40244992989216" },
  { id:"019-21456",
    lat:"39.8189649740224",
    lon:"-80.28772202247102" },
  { id:"019-21456",
    lat:"39.815116499999824",
    lon:"-80.00455300000039" },
  { id:"019-21456",
    lat:"39.807796000400735",
    lon:"-80.30122096516361" },
  { id:"019-21456",
    lat:"39.79040310183921",
    lon:"-80.20211586440014" },
  { id:"019-21456",
    lat:"39.794905456177645",
    lon:"-80.0545197037623" },
  { id:"019-21456",
    lat:"39.8368329999998",
    lon:"-79.876055" },
  { id:"019-21456",
    lat:"39.82681190014538",
    lon:"-80.27924964308782" },
  { id:"019-21456",
    lat:"39.83548050951928",
    lon:"-79.88480551784754" },
  { id:"019-21456",
    lat:"39.82535455113279",
    lon:"-80.49679467896337" },
  { id:"019-21456",
    lat:"39.83938599999982",
    lon:"-79.860907" },
  { id:"019-21456",
    lat:"39.82835057089618",
    lon:"-80.32337945657395" },
  { id:"019-21456",
    lat:"39.83836599999981",
    lon:"-79.880994" },
  { id:"019-21456",
    lat:"39.83414299999997",
    lon:"-80.02405199999966" },
  { id:"019-21456",
    lat:"39.8372299999998",
    lon:"-79.97098" },
  { id:"019-21456",
    lat:"39.84205499999981",
    lon:"-79.975403" },
  { id:"019-21456",
    lat:"39.84631299999982",
    lon:"-79.85760400000001" },
  { id:"019-21456",
    lat:"39.84845550621845",
    lon:"-79.87856950292263" },
  { id:"019-21456",
    lat:"39.849676999999815",
    lon:"-79.88655500000002" },
  { id:"019-21456",
    lat:"39.85071899999981",
    lon:"-79.96304399999998" },
  { id:"019-21456",
    lat:"39.84815002605409",
    lon:"-79.97093595545189" },
  { id:"019-21456",
    lat:"39.845382999999806",
    lon:"-79.88599699999999" },
  { id:"019-21456",
    lat:"39.84568799999979",
    lon:"-79.88091099999997" },
  { id:"019-21456",
    lat:"39.83647498681594",
    lon:"-80.2774161637272" },
  { id:"019-21456",
    lat:"39.8413569999994",
    lon:"-80.08616449999796" },
  { id:"019-21456",
    lat:"39.83339822512607",
    lon:"-80.47540063082052" },
  { id:"019-21456",
    lat:"39.84100166097891",
    lon:"-80.46861872150747" },
  { id:"019-21456",
    lat:"39.8520769999998",
    lon:"-79.968358" },
  { id:"019-21456",
    lat:"39.834343404496416",
    lon:"-80.21682113853556" },
  { id:"019-21456",
    lat:"39.82813889547406",
    lon:"-80.47799666637442" },
  { id:"019-21456",
    lat:"39.83241927391239",
    lon:"-80.25024933563972" },
  { id:"019-21456",
    lat:"39.83824999334458",
    lon:"-80.05054302498078" },
  { id:"019-21456",
    lat:"39.85563500002437",
    lon:"-80.04212350002342" },
  { id:"019-21456",
    lat:"39.85704699999978",
    lon:"-79.98673599999996" },
  { id:"019-21456",
    lat:"39.86369399999981",
    lon:"-79.83011700000002" },
  { id:"019-21456",
    lat:"39.858621999999805",
    lon:"-79.997373" },
  { id:"019-21456",
    lat:"39.852323050180736",
    lon:"-80.42500211101071" },
  { id:"019-21456",
    lat:"39.85828497230983",
    lon:"-80.24866916846112" },
  { id:"019-21456",
    lat:"39.857923495142536",
    lon:"-80.45043348038575" },
  { id:"019-21456",
    lat:"39.8650429999998",
    lon:"-79.98390099999999" },
  { id:"019-21456",
    lat:"39.86422892883577",
    lon:"-80.02759424457125" },
  { id:"019-21456",
    lat:"39.86488350000043",
    lon:"-80.05270949999635" },
  { id:"019-21456",
    lat:"39.8525632689937",
    lon:"-80.34127166917682" },
  { id:"019-21456",
    lat:"39.859511082694496",
    lon:"-80.08836497165284" },
  { id:"019-21456",
    lat:"39.86029399999982",
    lon:"-79.97705799999999" },
  { id:"019-21456",
    lat:"39.85353332281006",
    lon:"-80.3611363628532" },
  { id:"019-21456",
    lat:"39.862050014528634",
    lon:"-80.03860167574392" },
  { id:"019-21456",
    lat:"39.86941100977519",
    lon:"-80.05570298320897" },
  { id:"019-21456",
    lat:"39.87626696103094",
    lon:"-79.9114096088473" },
  { id:"019-21456",
    lat:"39.87210500000744",
    lon:"-80.00360649998942" },
  { id:"019-21456",
    lat:"39.8731739999998",
    lon:"-79.96518600000002" },
  { id:"019-21456",
    lat:"39.87142399999979",
    lon:"-80.05873600000001" },
  { id:"019-21456",
    lat:"39.872815000002944",
    lon:"-80.0132454999984" },
  { id:"019-21456",
    lat:"39.87450799999981",
    lon:"-79.969727" },
  { id:"019-21456",
    lat:"39.867690543041135",
    lon:"-79.9627680015639" },
  { id:"019-21456",
    lat:"39.863713581522696",
    lon:"-80.20870535319388" },
  { id:"019-21456",
    lat:"39.8612414999997",
    lon:"-80.24529750000343" },
  { id:"019-21456",
    lat:"39.87003499999981",
    lon:"-79.95146300000002" },
  { id:"019-21456",
    lat:"39.86375554786719",
    lon:"-80.27443202083417" },
  { id:"019-21456",
    lat:"39.86913837636914",
    lon:"-80.01277910991888" },
  { id:"019-21456",
    lat:"39.86852399999982",
    lon:"-79.99295" },
  { id:"019-21456",
    lat:"39.86917399999981",
    lon:"-79.985196" },
  { id:"019-21456",
    lat:"39.86717199999981",
    lon:"-80.04850199999998" },
  { id:"019-21456",
    lat:"39.85139635749767",
    lon:"-80.11330307901186" },
  { id:"019-21456",
    lat:"39.85176101705215",
    lon:"-80.06727352829176" },
  { id:"019-21456",
    lat:"39.84599250769736",
    lon:"-80.40624177043948" },
  { id:"019-21456",
    lat:"39.85346801496059",
    lon:"-80.09052099423337" },
  { id:"019-21456",
    lat:"39.83006792900905",
    lon:"-80.0077899034577" },
  { id:"019-21456",
    lat:"39.83083299999981",
    lon:"-79.983258" },
  { id:"019-21456",
    lat:"39.83077799999981",
    lon:"-80.02307400000001" },
  { id:"019-21456",
    lat:"39.827991308964435",
    lon:"-80.15916468206487" },
  { id:"019-21456",
    lat:"39.8698829999998",
    lon:"-80.502956" },
  { id:"019-21456",
    lat:"39.88172699999979",
    lon:"-80.00377" },
  { id:"019-21456",
    lat:"39.88587399999981",
    lon:"-80.00738399999999" },
  { id:"019-21456",
    lat:"39.87891761682317",
    lon:"-80.38214127641888" },
  { id:"019-21456",
    lat:"39.88627799999981",
    lon:"-80.044306" },
  { id:"019-21456",
    lat:"39.88274325945574",
    lon:"-80.34740615568516" },
  { id:"019-21456",
    lat:"39.90508099999981",
    lon:"-79.27879900000002" },
  { id:"019-21456",
    lat:"39.8925489999998",
    lon:"-79.98517799999999" },
  { id:"019-21456",
    lat:"39.891060999999794",
    lon:"-80.074014" },
  { id:"019-21456",
    lat:"39.89126899999983",
    lon:"-80.005395" },
  { id:"019-21456",
    lat:"39.88412270556693",
    lon:"-80.3652331719871" },
  { id:"019-21456",
    lat:"39.89301503661995",
    lon:"-80.01446646824331" },
  { id:"019-21456",
    lat:"39.88638398760558",
    lon:"-80.3357597611466" },
  { id:"019-21456",
    lat:"39.877174999999795",
    lon:"-80.30765299999999" },
  { id:"019-21456",
    lat:"39.88348499999981",
    lon:"-79.98199699999999" },
  { id:"019-21456",
    lat:"39.883059828040885",
    lon:"-79.9887470522845" },
  { id:"019-21456",
    lat:"39.883389097321086",
    lon:"-80.04924852242776" },
  { id:"019-21456",
    lat:"39.88511099936033",
    lon:"-80.01939009000115" },
  { id:"019-21456",
    lat:"39.8839599999998",
    lon:"-80.026615" },
  { id:"019-21456",
    lat:"39.884186245798865",
    lon:"-80.04536347867055" },
  { id:"019-21456",
    lat:"39.904034999999794",
    lon:"-79.82027500000001" },
  { id:"019-21456",
    lat:"39.89641700044399",
    lon:"-80.06948098001342" },
  { id:"019-21456",
    lat:"39.89162402807845",
    lon:"-80.29795936533354" },
  { id:"019-21456",
    lat:"39.89594439986753",
    lon:"-80.10076957222287" },
  { id:"019-21456",
    lat:"39.89052199999981",
    lon:"-80.38604200000002" },
  { id:"019-21456",
    lat:"39.89830199999981",
    lon:"-80.01723700000001" },
  { id:"019-21456",
    lat:"39.8978109999998",
    lon:"-80.029117" },
  { id:"019-21456",
    lat:"39.89623553563085",
    lon:"-80.12480183453444" },
  { id:"019-21456",
    lat:"39.891083541955844",
    lon:"-80.50182198331599" },
  { id:"019-21456",
    lat:"39.897012384943594",
    lon:"-80.31757404505669" },
  { id:"019-21456",
    lat:"39.90352699999982",
    lon:"-79.96006900000002" },
  { id:"019-21456",
    lat:"39.897657999999815",
    lon:"-80.343434" },
  { id:"019-21456",
    lat:"39.89828299999983",
    lon:"-80.291813" },
  { id:"019-21456",
    lat:"39.89884999999979",
    lon:"-80.27869" },
  { id:"019-21456",
    lat:"39.90642899999981",
    lon:"-79.945243" },
  { id:"019-21456",
    lat:"39.902227999999816",
    lon:"-80.139214" },
  { id:"019-21456",
    lat:"39.892515569149985",
    lon:"-80.28580302582463" },
  { id:"019-21456",
    lat:"39.89341899999981",
    lon:"-80.29576" },
  { id:"019-21456",
    lat:"39.90456964254872",
    lon:"-79.85822289948176" },
  { id:"019-21456",
    lat:"39.90284050091121",
    lon:"-79.90873745729162" },
  { id:"019-21456",
    lat:"39.902359999999824",
    lon:"-79.955649" },
  { id:"019-21456",
    lat:"39.895788087471196",
    lon:"-80.28628449135303" },
  { id:"019-21456",
    lat:"39.90013434788562",
    lon:"-80.0667160947801" },
  { id:"019-21456",
    lat:"39.9111750000106",
    lon:"-79.91124699998963" },
  { id:"019-21456",
    lat:"39.903336864746315",
    lon:"-80.41095589676223" },
  { id:"019-21456",
    lat:"39.90654188280847",
    lon:"-80.29977974950573" },
  { id:"019-21456",
    lat:"39.91375800000064",
    lon:"-79.95236100000233" },
  { id:"019-21456",
    lat:"39.916264999999804",
    lon:"-79.86850199999999" },
  { id:"019-21456",
    lat:"39.913506999999775",
    lon:"-80.00107049999967" },
  { id:"019-21456",
    lat:"39.90287081736468",
    lon:"-80.3463761326796" },
  { id:"019-21456",
    lat:"39.91357899999979",
    lon:"-79.85966299999998" },
  { id:"019-21456",
    lat:"39.90359645572231",
    lon:"-80.30181555809033" },
  { id:"019-21456",
    lat:"39.90990199999982",
    lon:"-80.01498999999998" },
  { id:"019-21456",
    lat:"39.9110629999998",
    lon:"-79.95841899999998" },
  { id:"019-21456",
    lat:"39.911162500000806",
    lon:"-79.99015399999719" },
  { id:"019-21456",
    lat:"39.9140164735968",
    lon:"-79.88335249922902" },
  { id:"019-21456",
    lat:"39.91257699999981",
    lon:"-79.96185200000001" },
  { id:"019-21456",
    lat:"39.91399999999982",
    lon:"-79.93744700000002" },
  { id:"019-21456",
    lat:"39.90394517790721",
    lon:"-80.17006030209009" },
  { id:"019-21456",
    lat:"39.905912999999806",
    lon:"-79.996356" },
  { id:"019-21456",
    lat:"39.906492999999806",
    lon:"-79.98991099999999" },
  { id:"019-21456",
    lat:"39.90170199999983",
    lon:"-80.294199" },
  { id:"019-21456",
    lat:"39.90895399999981",
    lon:"-79.95198" },
  { id:"019-21456",
    lat:"39.90978499999982",
    lon:"-79.968522" },
  { id:"019-21456",
    lat:"39.90767899999983",
    lon:"-80.012179" },
  { id:"019-21456",
    lat:"39.90329300000149",
    lon:"-80.20141649999795" },
  { id:"019-21456",
    lat:"39.90496350004317",
    lon:"-80.14467600005271" },
  { id:"019-21456",
    lat:"39.902799999999814",
    lon:"-80.28654" },
  { id:"019-21456",
    lat:"39.908081018413036",
    lon:"-80.05539861672817" },
  { id:"019-21456",
    lat:"39.9085429598928",
    lon:"-80.03535683106966" },
  { id:"019-21456",
    lat:"39.883918762312234",
    lon:"-80.48096553803018" },
  { id:"019-21456",
    lat:"39.894806999999815",
    lon:"-80.000037" },
  { id:"019-21456",
    lat:"39.8978805194417",
    lon:"-79.87783322899091" },
  { id:"019-21456",
    lat:"39.8878719999998",
    lon:"-80.29379100000001" },
  { id:"019-21456",
    lat:"39.894261070065575",
    lon:"-80.00310553493428" },
  { id:"019-21456",
    lat:"39.8865609999998",
    lon:"-80.41473099999999" },
  { id:"019-21456",
    lat:"39.890447942211175",
    lon:"-80.24788462360267" },
  { id:"019-21456",
    lat:"39.8898469999998",
    lon:"-80.28142799999999" },
  { id:"019-21456",
    lat:"39.896687598512315",
    lon:"-79.99579991262709" },
  { id:"019-21456",
    lat:"39.93320999999982",
    lon:"-79.00114299999998" },
  { id:"019-21456",
    lat:"39.92573199999981",
    lon:"-79.858826" },
  { id:"019-21456",
    lat:"39.91387938188947",
    lon:"-80.33784116367777" },
  { id:"019-21456",
    lat:"39.911172999999806",
    lon:"-80.47962000000001" },
  { id:"019-21456",
    lat:"39.91166705954011",
    lon:"-80.50064217231895" },
  { id:"019-21456",
    lat:"39.91914999999982",
    lon:"-79.97746699999999" },
  { id:"019-21456",
    lat:"39.913386178875285",
    lon:"-80.27220942825961" },
  { id:"019-21456",
    lat:"39.918793999999814",
    lon:"-80.01723100000001" },
  { id:"019-21456",
    lat:"39.91313081161041",
    lon:"-80.24420682229075" },
  { id:"019-21456",
    lat:"39.919342999999806",
    lon:"-80.007365" },
  { id:"019-21456",
    lat:"39.92240699999981",
    lon:"-79.885516" },
  { id:"019-21456",
    lat:"39.91393584138566",
    lon:"-80.30301834572256" },
  { id:"019-21456",
    lat:"39.923564999999826",
    lon:"-80.00315900000001" },
  { id:"019-21456",
    lat:"39.9243039999998",
    lon:"-79.96691299999999" },
  { id:"019-21456",
    lat:"39.913325454164145",
    lon:"-80.49722689748495" },
  { id:"019-21456",
    lat:"39.91395651376338",
    lon:"-80.47798312970885" },
  { id:"019-21456",
    lat:"39.94496799999981",
    lon:"-78.89462000000002" },
  { id:"019-21456",
    lat:"39.94140199999981",
    lon:"-79.22957600000001" },
  { id:"019-21456",
    lat:"39.920891426433066",
    lon:"-80.45026129873266" },
  { id:"019-21456",
    lat:"39.93532299999982",
    lon:"-79.841856" },
  { id:"019-21456",
    lat:"39.935230500005574",
    lon:"-79.85358299999109" },
  { id:"019-21456",
    lat:"39.93341799999981",
    lon:"-79.859338" },
  { id:"019-21456",
    lat:"39.92379485892245",
    lon:"-80.33730330269469" },
  { id:"019-21456",
    lat:"39.93303099062777",
    lon:"-79.90296801597442" },
  { id:"019-21456",
    lat:"39.9340209999998",
    lon:"-79.863496" },
  { id:"019-21456",
    lat:"39.93327399999981",
    lon:"-79.96874900000002" },
  { id:"019-21456",
    lat:"39.9342029749928",
    lon:"-79.89563304186814" },
  { id:"019-21456",
    lat:"39.9194835047465",
    lon:"-80.42715499822087" },
  { id:"019-21456",
    lat:"39.92900299999982",
    lon:"-80.020489" },
  { id:"019-21456",
    lat:"39.92941799999981",
    lon:"-80.004806" },
  { id:"019-21456",
    lat:"39.9302569999998",
    lon:"-79.990031" },
  { id:"019-21456",
    lat:"39.927969000072515",
    lon:"-79.91885549999982" },
  { id:"019-21456",
    lat:"39.926492999999816",
    lon:"-79.99439200000002" },
  { id:"019-21456",
    lat:"39.92196693222372",
    lon:"-80.21826252581792" },
  { id:"019-21456",
    lat:"39.91636496191046",
    lon:"-80.46748531215478" },
  { id:"019-21456",
    lat:"39.92300600025655",
    lon:"-80.158959083517" },
  { id:"019-21456",
    lat:"39.92390239427304",
    lon:"-80.0939692528635" },
  { id:"019-21456",
    lat:"39.9375199999998",
    lon:"-79.469236" },
  { id:"019-21456",
    lat:"39.940731999999805",
    lon:"-79.24667399999998" },
  { id:"019-21456",
    lat:"39.92702599999981",
    lon:"-80.009387" },
  { id:"019-21456",
    lat:"39.92802899999981",
    lon:"-79.96231299999998" },
  { id:"019-21456",
    lat:"39.930247999999814",
    lon:"-79.85145099999998" },
  { id:"019-21456",
    lat:"39.93000899999982",
    lon:"-79.85714900000002" },
  { id:"019-21456",
    lat:"39.929316513019856",
    lon:"-79.90879998547041" },
  { id:"019-21456",
    lat:"39.924511430703625",
    lon:"-80.1298259996611" },
  { id:"019-21456",
    lat:"39.920188390744286",
    lon:"-80.3800812770266" },
  { id:"019-21456",
    lat:"39.922651624869744",
    lon:"-80.26974594922763" },
  { id:"019-21456",
    lat:"39.9285679999998",
    lon:"-79.971838" },
  { id:"019-21456",
    lat:"39.930897999999814",
    lon:"-79.87271299999999" },
  { id:"019-21456",
    lat:"39.909210999999814",
    lon:"-80.30743000000001" },
  { id:"019-21456",
    lat:"39.91908788911964",
    lon:"-79.85475461703888" },
  { id:"019-21456",
    lat:"39.9140164912917",
    lon:"-80.0843375143247" },
  { id:"019-21456",
    lat:"39.91335572864632",
    lon:"-80.1341556038938" },
  { id:"019-21456",
    lat:"39.90979846264287",
    lon:"-80.26026901494723" },
  { id:"019-21456",
    lat:"39.915048999999804",
    lon:"-79.99016100000001" },
  { id:"019-21456",
    lat:"39.910843999999834",
    lon:"-80.30081600000001" },
  { id:"019-21456",
    lat:"39.91955100000068",
    lon:"-79.84636499999999" },
  { id:"019-21456",
    lat:"39.91046116313371",
    lon:"-80.27914393436662" },
  { id:"019-21456",
    lat:"39.87409786091556",
    lon:"-80.20575961026833" },
  { id:"019-21456",
    lat:"39.8693887907152",
    lon:"-80.42754540483241" },
  { id:"019-21456",
    lat:"39.8793249999998",
    lon:"-79.970056" },
  { id:"019-21456",
    lat:"39.87934399999981",
    lon:"-79.983839" },
  { id:"019-21456",
    lat:"39.88201201429291",
    lon:"-79.89613438207074" },
  { id:"019-21456",
    lat:"39.93188081245283",
    lon:"-80.32874856424604" },
  { id:"019-21456",
    lat:"39.94084799999981",
    lon:"-79.95573500000002" },
  { id:"019-21456",
    lat:"39.93680557314868",
    lon:"-80.15631393503529" },
  { id:"019-21456",
    lat:"39.93929999999982",
    lon:"-80.04692200000001" },
  { id:"019-21456",
    lat:"39.93747899999981",
    lon:"-79.96211000000001" },
  { id:"019-21456",
    lat:"39.9402339999998",
    lon:"-79.83552599999999" },
  { id:"019-21456",
    lat:"39.93196410327928",
    lon:"-80.25639457205574" },
  { id:"019-21456",
    lat:"39.938531999999796",
    lon:"-79.966805" },
  { id:"019-21456",
    lat:"39.93709050006156",
    lon:"-80.04282499960108" },
  { id:"019-21456",
    lat:"39.94150899999981",
    lon:"-79.863682" },
  { id:"019-21456",
    lat:"39.94831499999965",
    lon:"-79.830656" },
  { id:"019-21456",
    lat:"39.94536499999982",
    lon:"-79.98046600000004" },
  { id:"019-21456",
    lat:"39.94242416458612",
    lon:"-80.13063834697944" },
  { id:"019-21456",
    lat:"39.94463999999981",
    lon:"-80.03097399999999" },
  { id:"019-21456",
    lat:"39.94410726126298",
    lon:"-80.0662041948058" },
  { id:"019-21456",
    lat:"39.95375899999979",
    lon:"-79.68581499999998" },
  { id:"019-21456",
    lat:"39.94138663955176",
    lon:"-80.26431265912507" },
  { id:"019-21456",
    lat:"39.94813750001299",
    lon:"-79.95694850000122" },
  { id:"019-21456",
    lat:"39.93694975943847",
    lon:"-80.48675716826862" },
  { id:"019-21456",
    lat:"39.94584041940469",
    lon:"-79.71991949752702" },
  { id:"019-21456",
    lat:"39.93359351239116",
    lon:"-80.39432150624442" },
  { id:"019-21456",
    lat:"39.934627139053966",
    lon:"-80.3546260308578" },
  { id:"019-21456",
    lat:"39.93357559877611",
    lon:"-80.3172696517576" },
  { id:"019-21456",
    lat:"39.94424400000195",
    lon:"-79.874364" },
  { id:"019-21456",
    lat:"39.947001500018",
    lon:"-79.74350849996694" },
  { id:"019-21456",
    lat:"39.94410100105934",
    lon:"-79.90152803365802" },
  { id:"019-21456",
    lat:"39.94158999999981",
    lon:"-80.02989899999999" },
  { id:"019-21456",
    lat:"39.941734999999824",
    lon:"-80.02514300000001" },
  { id:"019-21456",
    lat:"39.935806953083606",
    lon:"-80.30784551882512" },
  { id:"019-21456",
    lat:"39.93642755091782",
    lon:"-80.29474835692555" },
  { id:"019-21456",
    lat:"39.94449799999979",
    lon:"-79.971944" },
  { id:"019-21456",
    lat:"39.95701100000079",
    lon:"-79.76122500000967" },
  { id:"019-21456",
    lat:"39.95862299999981",
    lon:"-79.83427" },
  { id:"019-21456",
    lat:"39.94634466377348",
    lon:"-80.38650726374635" },
  { id:"019-21456",
    lat:"39.95331823496059",
    lon:"-80.09300048502061" },
  { id:"019-21456",
    lat:"39.953383845823524",
    lon:"-80.10188947509512" },
  { id:"019-21456",
    lat:"39.958592499999675",
    lon:"-79.84036849999924" },
  { id:"019-21456",
    lat:"39.95401899999981",
    lon:"-79.942361" },
  { id:"019-21456",
    lat:"39.953520281999516",
    lon:"-80.18974096023656" },
  { id:"019-21456",
    lat:"39.94768287555635",
    lon:"-80.47141019814293" },
  { id:"019-21456",
    lat:"39.95323694276511",
    lon:"-80.27662457030468" },
  { id:"019-21456",
    lat:"39.955010999998976",
    lon:"-80.45552650000326" },
  { id:"019-21456",
    lat:"39.95880699934971",
    lon:"-80.31073601233261" },
  { id:"019-21456",
    lat:"39.97198399999982",
    lon:"-79.654545" },
  { id:"019-21456",
    lat:"39.96907952215582",
    lon:"-79.83864600031029" },
  { id:"019-21456",
    lat:"39.9671585047063",
    lon:"-79.80971249571506" },
  { id:"019-21456",
    lat:"39.958554662278566",
    lon:"-80.24159690841748" },
  { id:"019-21456",
    lat:"39.96040599999979",
    lon:"-80.160419" },
  { id:"019-21456",
    lat:"39.96377514223418",
    lon:"-79.99144178346826" },
  { id:"019-21456",
    lat:"39.963623487558216",
    lon:"-80.01766661257895" },
  { id:"019-21456",
    lat:"39.96869150000168",
    lon:"-79.83420149999922" },
  { id:"019-21456",
    lat:"39.96803999999654",
    lon:"-80.11088149999922" },
  { id:"019-21456",
    lat:"39.96892198605207",
    lon:"-79.96894480160026" },
  { id:"019-21456",
    lat:"39.96737651094603",
    lon:"-79.67911004453893" },
  { id:"019-21456",
    lat:"39.95373462778542",
    lon:"-80.3584125975995" },
  { id:"019-21456",
    lat:"39.96437651129419",
    lon:"-79.82385548150566" },
  { id:"019-21456",
    lat:"39.96695299999981",
    lon:"-79.691506" },
  { id:"019-21456",
    lat:"39.9561445811405",
    lon:"-80.20485474929036" },
  { id:"019-21456",
    lat:"39.96291797106095",
    lon:"-79.94679088034616" },
  { id:"019-21456",
    lat:"39.96090171666909",
    lon:"-80.09454791737365" },
  { id:"019-21456",
    lat:"39.961541514435254",
    lon:"-80.03074748718275" },
  { id:"019-21456",
    lat:"39.94779975170803",
    lon:"-80.12061146316888" },
  { id:"019-21456",
    lat:"39.94522593736506",
    lon:"-80.23985185311908" },
  { id:"019-21456",
    lat:"39.9447901886212",
    lon:"-80.26495613102632" },
  { id:"019-21456",
    lat:"39.94952557733694",
    lon:"-80.05219702902703" },
  { id:"019-21456",
    lat:"39.95433849876397",
    lon:"-79.84942905167055" },
  { id:"019-21456",
    lat:"39.94736986688935",
    lon:"-80.22333974897231" },
  { id:"019-21456",
    lat:"39.950466686520414",
    lon:"-80.08248950661181" },
  { id:"019-21456",
    lat:"39.9676855134602",
    lon:"-80.38589650061756" },
  { id:"019-21456",
    lat:"39.98161649509151",
    lon:"-79.83883751845357" },
  { id:"019-21456",
    lat:"39.98486399999981",
    lon:"-79.69096099999999" },
  { id:"019-21456",
    lat:"39.971055990156906",
    lon:"-80.37798648960123" },
  { id:"019-21456",
    lat:"39.97818165910421",
    lon:"-80.06988550851814" },
  { id:"019-21456",
    lat:"39.97847822010379",
    lon:"-80.09403076737097" },
  { id:"019-21456",
    lat:"39.97832225637131",
    lon:"-79.84462732716099" },
  { id:"019-21456",
    lat:"39.97716599999981",
    lon:"-79.96384500000002" },
  { id:"019-21456",
    lat:"39.976061999999814",
    lon:"-79.99678400000002" },
  { id:"019-21456",
    lat:"39.971586178586676",
    lon:"-80.26471392230027" },
  { id:"019-21456",
    lat:"39.97518877235107",
    lon:"-80.15453617024247" },
  { id:"019-21456",
    lat:"39.97382445595532",
    lon:"-80.07790717155702" },
  { id:"019-21456",
    lat:"39.97440453743099",
    lon:"-80.50723760508205" },
  { id:"019-21456",
    lat:"39.99128099999982",
    lon:"-79.80131900000003" },
  { id:"019-21456",
    lat:"39.9910279999998",
    lon:"-79.80707499999998" },
  { id:"019-21456",
    lat:"39.98917906028946",
    lon:"-79.81640643604996" },
  { id:"019-21456",
    lat:"39.98875899999982",
    lon:"-79.85392299999998" },
  { id:"019-21456",
    lat:"39.978734126133986",
    lon:"-80.45478100852722" },
  { id:"019-21456",
    lat:"39.98517900005449",
    lon:"-80.11802100002332" },
  { id:"019-21456",
    lat:"39.98994199999981",
    lon:"-79.90263100000001" },
  { id:"019-21456",
    lat:"39.9826480000247",
    lon:"-80.2951290001099" },
  { id:"019-21456",
    lat:"39.97892519802934",
    lon:"-80.28910992792699" },
  { id:"019-21456",
    lat:"39.97578202489291",
    lon:"-80.42401391909716" },
  { id:"019-21456",
    lat:"39.97764064619927",
    lon:"-80.36600583760082" },
  { id:"019-21456",
    lat:"39.97864319577939",
    lon:"-80.32577342165109" },
  { id:"019-21456",
    lat:"39.974612582263404",
    lon:"-80.3687821265649" },
  { id:"019-21456",
    lat:"39.978725809699675",
    lon:"-80.19629407940842" },
  { id:"019-21456",
    lat:"39.99977799999981",
    lon:"-79.660925" },
  { id:"019-21456",
    lat:"39.98279563774767",
    lon:"-80.50387644536598" },
  { id:"019-21456",
    lat:"39.99239847643674",
    lon:"-80.0417959568248" },
  { id:"019-21456",
    lat:"39.98403763796919",
    lon:"-80.49671394511111" },
  { id:"019-21456",
    lat:"39.990536091792244",
    lon:"-80.17765980550212" },
  { id:"019-21456",
    lat:"39.996822488982",
    lon:"-80.060069504028" },
  { id:"019-21456",
    lat:"39.99233887309714",
    lon:"-80.28739709535218" },
  { id:"019-21456",
    lat:"39.99512376090088",
    lon:"-80.20634325153011" },
  { id:"019-21456",
    lat:"40.000952999999804",
    lon:"-79.70059599999999" },
  { id:"019-21456",
    lat:"39.99856699999981",
    lon:"-79.807175" },
  { id:"019-21456",
    lat:"40.00244489894347",
    lon:"-79.6823023759895" },
  { id:"019-21456",
    lat:"40.00946599999983",
    lon:"-79.62848300000002" },
  { id:"019-21456",
    lat:"40.00827447312287",
    lon:"-79.64995296722296" },
  { id:"019-21456",
    lat:"39.997195763999024",
    lon:"-80.30107822670402" },
  { id:"019-21456",
    lat:"40.01098599999981",
    lon:"-79.63181000000002" },
  { id:"019-21456",
    lat:"40.01190449999991",
    lon:"-79.87992650000128" },
  { id:"019-21456",
    lat:"40.005860999999825",
    lon:"-80.13399400000003" },
  { id:"019-21456",
    lat:"40.00626830054065",
    lon:"-80.15567835025138" },
  { id:"019-21456",
    lat:"40.00807499999981",
    lon:"-80.074436" },
  { id:"019-21456",
    lat:"40.01013299999982",
    lon:"-79.67262200000002" },
  { id:"019-21456",
    lat:"39.999080242021655",
    lon:"-80.29040828312945" },
  { id:"019-21456",
    lat:"40.03361374753511",
    lon:"-79.18489177486094" },
  { id:"019-21456",
    lat:"40.0161139999998",
    lon:"-80.07341900000003" },
  { id:"019-21456",
    lat:"40.01289789550751",
    lon:"-80.27763457870637" },
  { id:"019-21456",
    lat:"40.010824997606036",
    lon:"-80.21712484892143" },
  { id:"019-21456",
    lat:"40.0095102253995",
    lon:"-80.28624989111853" },
  { id:"019-21456",
    lat:"40.02053600003576",
    lon:"-79.67823200000001" },
  { id:"019-21456",
    lat:"40.00821400593332",
    lon:"-80.29923750062228" },
  { id:"019-21456",
    lat:"40.0216439999998",
    lon:"-79.675569" },
  { id:"019-21456",
    lat:"40.00856390925118",
    lon:"-80.39320561339179" },
  { id:"019-21456",
    lat:"40.0172719999998",
    lon:"-79.65972" },
  { id:"019-21456",
    lat:"40.0051225100019",
    lon:"-80.28854209931839" },
  { id:"019-21456",
    lat:"40.010321999999825",
    lon:"-80.018461" },
  { id:"019-21456",
    lat:"40.01918899999981",
    lon:"-79.656761" },
  { id:"019-21456",
    lat:"40.004331445922006",
    lon:"-80.3994930325" },
  { id:"019-21456",
    lat:"40.00667858964429",
    lon:"-80.24438299036923" },
  { id:"019-21456",
    lat:"40.0178859999998",
    lon:"-79.73058000000002" },
  { id:"019-21456",
    lat:"39.9920947574786",
    lon:"-80.41084972063415" },
  { id:"019-21456",
    lat:"40.003898500002265",
    lon:"-79.81427950000334" },
  { id:"019-21456",
    lat:"39.995220305080714",
    lon:"-80.22220644220195" },
  { id:"019-21456",
    lat:"39.99914394141011",
    lon:"-80.10671983700341" },
  { id:"019-21456",
    lat:"39.99114192039268",
    lon:"-80.48866354253384" },
  { id:"019-21456",
    lat:"39.99580002178093",
    lon:"-80.2783454905892" },
  { id:"019-21456",
    lat:"40.00651699999982",
    lon:"-79.80540799999999" },
  { id:"019-21456",
    lat:"39.99469600770635",
    lon:"-79.8001125249328" },
  { id:"019-21456",
    lat:"39.98811584600236",
    lon:"-80.10939624302299" },
  { id:"019-21456",
    lat:"39.98628559052929",
    lon:"-80.13748269452998" },
  { id:"019-21456",
    lat:"39.98741628937954",
    lon:"-80.18652413663801" },
  { id:"019-21456",
    lat:"39.982245774579404",
    lon:"-80.41088422107751" },
  { id:"019-21456",
    lat:"39.986445906063615",
    lon:"-80.2805280385486" },
  { id:"019-21456",
    lat:"39.98447100008974",
    lon:"-80.37239452098886" },
  { id:"019-21456",
    lat:"39.960035812514505",
    lon:"-80.50546546335082" },
  { id:"019-21456",
    lat:"39.96886183307611",
    lon:"-80.11819539104955" },
  { id:"019-21456",
    lat:"39.9732449999998",
    lon:"-79.99253600000002" },
  { id:"019-21456",
    lat:"39.96317073309367",
    lon:"-80.45476701926208" },
  { id:"019-21456",
    lat:"39.97555511903077",
    lon:"-79.92384223423939" },
  { id:"019-21456",
    lat:"40.02012500000311",
    lon:"-80.2854165000058" },
  { id:"019-21456",
    lat:"40.01960699999978",
    lon:"-80.26888500000096" },
  { id:"019-21456",
    lat:"40.02295362827115",
    lon:"-80.19736501266682" },
  { id:"019-21456",
    lat:"40.03540400617518",
    lon:"-79.77340697788388" },
  { id:"019-21456",
    lat:"40.021655001392794",
    lon:"-80.50460348502929" },
  { id:"019-21456",
    lat:"40.019992888734485",
    lon:"-80.4960783770967" },
  { id:"019-21456",
    lat:"40.03135799999981",
    lon:"-80.068236" },
  { id:"019-21456",
    lat:"40.029414934107216",
    lon:"-80.21419158656053" },
  { id:"019-21456",
    lat:"40.030831499955774",
    lon:"-80.15243800000002" },
  { id:"019-21456",
    lat:"40.031809999999815",
    lon:"-80.14084000000001" },
  { id:"019-21456",
    lat:"40.03890799999982",
    lon:"-79.811022" },
  { id:"019-21456",
    lat:"40.034613999999806",
    lon:"-80.05178599999999" },
  { id:"019-21456",
    lat:"40.01706081589463",
    lon:"-80.47871540206731" },
  { id:"019-21456",
    lat:"40.02935848558402",
    lon:"-79.95560550533365" },
  { id:"019-21456",
    lat:"40.02327930701007",
    lon:"-80.2424195524587" },
  { id:"019-21456",
    lat:"40.02851250000259",
    lon:"-80.04736699999832" },
  { id:"019-21456",
    lat:"40.02393187887073",
    lon:"-80.26664127501066" },
  { id:"019-21456",
    lat:"40.05028849999975",
    lon:"-79.57331400000002" },
  { id:"019-21456",
    lat:"40.04925700000064",
    lon:"-79.63687200000379" },
  { id:"019-21456",
    lat:"40.03954992798699",
    lon:"-80.06729562163488" },
  { id:"019-21456",
    lat:"40.03638585362839",
    lon:"-80.33695005943673" },
  { id:"019-21456",
    lat:"40.03844151291502",
    lon:"-80.29137199546832" },
  { id:"019-21456",
    lat:"40.04029108180914",
    lon:"-80.35243429334504" },
  { id:"019-21456",
    lat:"40.050818490426956",
    lon:"-80.08712892365126" },
  { id:"019-21456",
    lat:"40.045464256407556",
    lon:"-80.25156230981335" },
  { id:"019-21456",
    lat:"40.050640499999936",
    lon:"-80.09902499999862" },
  { id:"019-21456",
    lat:"40.050245483390775",
    lon:"-80.4108234308308" },
  { id:"019-21456",
    lat:"40.05589314485069",
    lon:"-80.23082541458399" },
  { id:"019-21456",
    lat:"40.0513681776929",
    lon:"-80.28531440378724" },
  { id:"019-21456",
    lat:"40.05556253536189",
    lon:"-80.13459198572167" },
  { id:"019-21456",
    lat:"40.05157393345651",
    lon:"-80.31914482292387" },
  { id:"019-21456",
    lat:"40.043630500002536",
    lon:"-80.12134450002297" },
  { id:"019-21456",
    lat:"40.044176565277944",
    lon:"-80.16177423569391" },
  { id:"019-21456",
    lat:"40.04647508832497",
    lon:"-80.1008983355118" },
  { id:"019-21456",
    lat:"40.03123744415355",
    lon:"-80.26915849787702" },
  { id:"019-21456",
    lat:"40.03479613497915",
    lon:"-80.1315828167664" },
  { id:"019-21456",
    lat:"40.03235481332249",
    lon:"-80.1877014011191" },
  { id:"019-21456",
    lat:"40.032100487082836",
    lon:"-80.3189479639135" },
  { id:"019-21456",
    lat:"40.042713999999826",
    lon:"-79.812238" },
  { id:"019-21456",
    lat:"40.038082999999816",
    lon:"-80.050981" },
  { id:"019-21456",
    lat:"40.07277100000197",
    lon:"-79.5773029999967" },
  { id:"019-21456",
    lat:"40.06627100000509",
    lon:"-79.94668450000205" },
  { id:"019-21456",
    lat:"40.059087885688854",
    lon:"-80.31130230000865" },
  { id:"019-21456",
    lat:"40.06334850000476",
    lon:"-80.20426949999522" },
  { id:"019-21456",
    lat:"40.06419240204894",
    lon:"-80.27581153991676" },
  { id:"019-21456",
    lat:"40.063646824429185",
    lon:"-80.43822450974761" },
  { id:"019-21456",
    lat:"40.06758842633065",
    lon:"-80.30403353020951" },
  { id:"019-21456",
    lat:"40.06738306381973",
    lon:"-80.39672497523493" },
  { id:"019-21456",
    lat:"40.06627344645374",
    lon:"-80.38030702182213" },
  { id:"019-21456",
    lat:"40.070962029720924",
    lon:"-80.06964658177178" },
  { id:"019-21456",
    lat:"40.08762792154147",
    lon:"-79.79249856080604" },
  { id:"019-21456",
    lat:"40.07570957076959",
    lon:"-80.24575575614375" },
  { id:"019-21456",
    lat:"40.08477099999981",
    lon:"-79.81188300000001" },
  { id:"019-21456",
    lat:"40.077403519432025",
    lon:"-80.1841748335942" },
  { id:"019-21456",
    lat:"40.07250710988842",
    lon:"-80.51189995862781" },
  { id:"019-21456",
    lat:"40.08020792690972",
    lon:"-80.29599852962819" },
  { id:"019-21456",
    lat:"40.09149899999982",
    lon:"-79.810824" },
  { id:"019-21456",
    lat:"40.088159000000424",
    lon:"-79.97414349999194" },
  { id:"019-21456",
    lat:"40.08877649129138",
    lon:"-79.99819303096884" },
  { id:"019-21456",
    lat:"40.08083783096872",
    lon:"-80.36873667697579" },
  { id:"019-21456",
    lat:"40.07457959246968",
    lon:"-80.34662551533651" },
  { id:"019-21456",
    lat:"40.07840056091479",
    lon:"-80.22454269876519" },
  { id:"019-21456",
    lat:"40.086232999999794",
    lon:"-79.83635" },
  { id:"019-21456",
    lat:"40.0817225694387",
    lon:"-80.02068486261501" },
  { id:"019-21456",
    lat:"40.08192646982866",
    lon:"-80.04390547202341" },
  { id:"019-21456",
    lat:"40.08795700000195",
    lon:"-79.8012890000033" },
  { id:"019-21456",
    lat:"40.083250617265236",
    lon:"-80.03439041756276" },
  { id:"019-21456",
    lat:"40.07780488921983",
    lon:"-80.3028107010523" },
  { id:"019-21456",
    lat:"40.07724134727548",
    lon:"-80.06282306369678" },
  { id:"019-21456",
    lat:"40.07292908220279",
    lon:"-80.19798787853391" },
  { id:"019-21456",
    lat:"40.08425699999983",
    lon:"-79.70901800000001" },
  { id:"019-21456",
    lat:"40.08260199999981",
    lon:"-79.83443100000002" },
  { id:"019-21456",
    lat:"40.084840478091394",
    lon:"-80.43543891696079" },
  { id:"019-21456",
    lat:"40.091405921639485",
    lon:"-80.2279532937332" },
  { id:"019-21456",
    lat:"40.09158986881519",
    lon:"-80.14793982336768" },
  { id:"019-21456",
    lat:"40.102812500003644",
    lon:"-79.79347350001038" },
  { id:"019-21456",
    lat:"40.0965632008945",
    lon:"-80.29041262239411" },
  { id:"019-21456",
    lat:"40.0993956231258",
    lon:"-80.17954863351109" },
  { id:"019-21456",
    lat:"40.096455874482444",
    lon:"-80.05720427815417" },
  { id:"019-21456",
    lat:"40.09223326545311",
    lon:"-80.29851310664719" },
  { id:"019-21456",
    lat:"40.0971197513597",
    lon:"-80.09950832923498" },
  { id:"019-21456",
    lat:"40.097524251256424",
    lon:"-80.13092509781981" },
  { id:"019-21456",
    lat:"40.108971999999824",
    lon:"-80.06452200000001" },
  { id:"019-21456",
    lat:"40.11521599999979",
    lon:"-79.81734100000001" },
  { id:"019-21456",
    lat:"40.11861951203821",
    lon:"-79.7865805529893" },
  { id:"019-21456",
    lat:"40.11563799999981",
    lon:"-79.799468" },
  { id:"019-21456",
    lat:"40.11702899999982",
    lon:"-79.821569" },
  { id:"019-21456",
    lat:"40.11212278517354",
    lon:"-80.10051262937512" },
  { id:"019-21456",
    lat:"40.11958999999982",
    lon:"-79.815463" },
  { id:"019-21456",
    lat:"40.10792489607126",
    lon:"-80.44511931518986" },
  { id:"019-21456",
    lat:"40.1075288688642",
    lon:"-80.39353754586838" },
  { id:"019-21456",
    lat:"40.11667550400546",
    lon:"-80.07457495852914" },
  { id:"019-21456",
    lat:"40.12033199999981",
    lon:"-79.80197399999999" },
  { id:"019-21456",
    lat:"40.11529599978724",
    lon:"-80.19033349099631" },
  { id:"019-21456",
    lat:"40.101411548312655",
    lon:"-80.1262704153178" },
  { id:"019-21456",
    lat:"40.09553922241242",
    lon:"-80.47259731816159" },
  { id:"019-21456",
    lat:"40.0837854341031",
    lon:"-80.37815355115103" },
  { id:"019-21456",
    lat:"40.0959409999998",
    lon:"-79.806738" },
  { id:"019-21456",
    lat:"40.08831633151869",
    lon:"-80.18583022448352" },
  { id:"019-21456",
    lat:"40.09316853355487",
    lon:"-79.96814338571738" },
  { id:"019-21456",
    lat:"40.088634646738164",
    lon:"-80.21250917748488" },
  { id:"019-21456",
    lat:"40.06556815127257",
    lon:"-79.82482898862517" },
  { id:"019-21456",
    lat:"40.0631552226874",
    lon:"-79.98898096043538" },
  { id:"019-21456",
    lat:"40.070820999999825",
    lon:"-79.627838" },
  { id:"019-21456",
    lat:"40.02719700002353",
    lon:"-79.65559850004315" },
  { id:"019-21456",
    lat:"40.01858699999979",
    lon:"-80.168672" },
  { id:"019-21456",
    lat:"40.02152299999982",
    lon:"-80.032626" },
  { id:"019-21456",
    lat:"40.02004850000151",
    lon:"-80.16606350000131" },
  { id:"019-21456",
    lat:"40.02131950725195",
    lon:"-80.1022566812548" },
  { id:"019-21456",
    lat:"39.93347399999981",
    lon:"-80.004034" },
  { id:"019-21456",
    lat:"39.925045571949035",
    lon:"-80.40346467022479" },
  { id:"019-21456",
    lat:"39.925421891253464",
    lon:"-80.39387106580912" },
  { id:"019-21456",
    lat:"39.936980427415264",
    lon:"-79.87323602944745" },
  { id:"019-21456",
    lat:"39.93403999999981",
    lon:"-80.02957400000001" },
  { id:"019-21456",
    lat:"40.12880599999981",
    lon:"-79.77775" },
  { id:"019-21456",
    lat:"40.114732000008985",
    lon:"-80.50753750000683" },
  { id:"019-21456",
    lat:"40.124665432959645",
    lon:"-79.99384155236052" },
  { id:"019-21456",
    lat:"40.119171999999814",
    lon:"-80.49303900000001" },
  { id:"019-21456",
    lat:"40.13738900000729",
    lon:"-79.76340249963799" },
  { id:"019-21456",
    lat:"40.121255724347655",
    lon:"-80.43411977254276" },
  { id:"019-21456",
    lat:"40.13045947030991",
    lon:"-80.12383445620821" },
  { id:"019-21456",
    lat:"40.12622574660957",
    lon:"-80.04941406796247" },
  { id:"019-21456",
    lat:"40.122722869339334",
    lon:"-80.21603879458115" },
  { id:"019-21456",
    lat:"40.12432640140491",
    lon:"-80.09223963860283" },
  { id:"019-21456",
    lat:"40.1192653640195",
    lon:"-80.38269293990766" },
  { id:"019-21456",
    lat:"40.12464982138815",
    lon:"-80.13365175925803" },
  { id:"019-21456",
    lat:"40.140709691448244",
    lon:"-79.93984841977222" },
  { id:"019-21456",
    lat:"40.135608940861616",
    lon:"-80.50089406226948" },
  { id:"019-21456",
    lat:"40.14118734628795",
    lon:"-80.2617262943527" },
  { id:"019-21456",
    lat:"40.14210293633424",
    lon:"-80.22063790451426" },
  { id:"019-21456",
    lat:"40.136655509957215",
    lon:"-80.4620526359816" },
  { id:"019-21456",
    lat:"40.13167705510909",
    lon:"-80.43089417195687" },
  { id:"019-21456",
    lat:"40.133610008626654",
    lon:"-80.32539849145233" },
  { id:"019-21456",
    lat:"40.14049826698762",
    lon:"-80.04499401482867" },
  { id:"019-21456",
    lat:"40.13903518844553",
    lon:"-80.17988274082086" },
  { id:"019-21456",
    lat:"40.1547779999998",
    lon:"-79.74938899999998" },
  { id:"019-21456",
    lat:"40.15345550950301",
    lon:"-80.04162249782024" },
  { id:"019-21456",
    lat:"40.145545662679076",
    lon:"-80.42402348623455" },
  { id:"019-21456",
    lat:"40.15604200000887",
    lon:"-80.09251949998443" },
  { id:"019-21456",
    lat:"40.151361007806806",
    lon:"-80.41583347632597" },
  { id:"019-21456",
    lat:"40.151213972189694",
    lon:"-80.25272080268871" },
  { id:"019-21456",
    lat:"40.16156645863657",
    lon:"-80.02129842472026" },
  { id:"019-21456",
    lat:"40.15973645075199",
    lon:"-80.17798881706801" },
  { id:"019-21456",
    lat:"40.16118630588926",
    lon:"-80.11179420003619" },
  { id:"019-21456",
    lat:"40.16475516737206",
    lon:"-79.94444411569496" },
  { id:"019-21456",
    lat:"40.148265497490925",
    lon:"-80.02166012685949" },
  { id:"019-21456",
    lat:"40.14763750003167",
    lon:"-80.11349999990958" },
  { id:"019-21456",
    lat:"40.14323052585646",
    lon:"-80.38936962122604" },
  { id:"019-21456",
    lat:"40.13094747804395",
    lon:"-80.1880221970466" },
  { id:"019-21456",
    lat:"40.12760518416449",
    lon:"-80.34495532064277" },
  { id:"019-21456",
    lat:"40.128363651281596",
    lon:"-80.36211265214568" },
  { id:"019-21456",
    lat:"40.17669409549914",
    lon:"-79.70201544792293" },
  { id:"019-21456",
    lat:"40.179272999999824",
    lon:"-79.72268199999998" },
  { id:"019-21456",
    lat:"40.16987765008385",
    lon:"-80.1683338898973" },
  { id:"019-21456",
    lat:"40.17713399999982",
    lon:"-79.737758" },
  { id:"019-21456",
    lat:"40.18002299999982",
    lon:"-79.73784100000002" },
  { id:"019-21456",
    lat:"40.17344285819926",
    lon:"-80.05303783109593" },
  { id:"019-21456",
    lat:"40.18481700000192",
    lon:"-79.72133900000364" },
  { id:"019-21456",
    lat:"40.184986999999815",
    lon:"-79.72647399999998" },
  { id:"019-21456",
    lat:"40.18421699999981",
    lon:"-79.73625799999999" },
  { id:"019-21456",
    lat:"40.172794640742055",
    lon:"-80.46642923611827" },
  { id:"019-21456",
    lat:"40.18475910720802",
    lon:"-80.02796128284626" },
  { id:"019-21456",
    lat:"40.182828851689244",
    lon:"-80.0904759049736" },
  { id:"019-21456",
    lat:"40.17936694046338",
    lon:"-80.29312509711482" },
  { id:"019-21456",
    lat:"40.1871804999998",
    lon:"-79.718" },
  { id:"019-21456",
    lat:"40.18743999999982",
    lon:"-79.747619" },
  { id:"019-21456",
    lat:"40.18810599999981",
    lon:"-79.73664699999999" },
  { id:"019-21456",
    lat:"40.16933683417296",
    lon:"-80.3506896240957" },
  { id:"019-21456",
    lat:"40.17701849968289",
    lon:"-80.00249153353649" },
  { id:"019-21456",
    lat:"40.182439999999815",
    lon:"-79.74284099999998" },
  { id:"019-21456",
    lat:"40.17874553651743",
    lon:"-79.97604596355255" },
  { id:"019-21456",
    lat:"40.19483908030436",
    lon:"-79.74299444319394" },
  { id:"019-21456",
    lat:"40.18077755989911",
    lon:"-80.4532170607207" },
  { id:"019-21456",
    lat:"40.18218999169494",
    lon:"-80.36098153127689" },
  { id:"019-21456",
    lat:"40.19230099999984",
    lon:"-79.71275700000001" },
  { id:"019-21456",
    lat:"40.17896899999982",
    lon:"-80.41094600000002" },
  { id:"019-21456",
    lat:"40.19274499999981",
    lon:"-79.716729" },
  { id:"019-21456",
    lat:"40.189361454210754",
    lon:"-79.93751312062332" },
  { id:"019-21456",
    lat:"40.19429999999981",
    lon:"-79.720834" },
  { id:"019-21456",
    lat:"40.183866866533215",
    lon:"-80.49928782388612" },
  { id:"019-21456",
    lat:"40.20088399999981",
    lon:"-79.73011900000002" },
  { id:"019-21456",
    lat:"40.20263399999983",
    lon:"-79.74123" },
  { id:"019-21456",
    lat:"40.19004299999417",
    lon:"-80.4021679999975" },
  { id:"019-21456",
    lat:"40.197652375451185",
    lon:"-80.18996633993264" },
  { id:"019-21456",
    lat:"40.202177512141986",
    lon:"-79.88834703226459" },
  { id:"019-21456",
    lat:"40.18583306384364",
    lon:"-80.42978643880619" },
  { id:"019-21456",
    lat:"40.186383321511045",
    lon:"-80.44302227053137" },
  { id:"019-21456",
    lat:"40.187585000004965",
    lon:"-80.41317500000297" },
  { id:"019-21456",
    lat:"40.21133899999982",
    lon:"-79.702417" },
  { id:"019-21456",
    lat:"40.194614000000165",
    lon:"-80.5110329999937" },
  { id:"019-21456",
    lat:"40.19923876430028",
    lon:"-80.47828506726098" },
  { id:"019-21456",
    lat:"40.2111459999998",
    lon:"-79.712002" },
  { id:"019-21456",
    lat:"40.19761102638493",
    lon:"-80.39175105304984" },
  { id:"019-21456",
    lat:"40.21318199887421",
    lon:"-79.70646099478455" },
  { id:"019-21456",
    lat:"40.20283588592857",
    lon:"-80.44252523795024" },
  { id:"019-21456",
    lat:"40.20548210608461",
    lon:"-80.42976790901137" },
  { id:"019-21456",
    lat:"40.20555253803506",
    lon:"-80.41911312600226" },
  { id:"019-21456",
    lat:"40.20316043964401",
    lon:"-80.33244545924167" },
  { id:"019-21456",
    lat:"40.20111695173093",
    lon:"-80.4680788761636" },
  { id:"019-21456",
    lat:"40.21708299999982",
    lon:"-79.70336100000002" },
  { id:"019-21456",
    lat:"40.2159169999998",
    lon:"-79.70933300000002" },
  { id:"019-21456",
    lat:"40.19616568327542",
    lon:"-80.35173435042573" },
  { id:"019-21456",
    lat:"40.20935599999982",
    lon:"-79.708673" },
  { id:"019-21456",
    lat:"40.20956045282381",
    lon:"-80.39923160274773" },
  { id:"019-21456",
    lat:"40.210714906815845",
    lon:"-80.35280971754688" },
  { id:"019-21456",
    lat:"40.215510708395584",
    lon:"-80.31471768942622" },
  { id:"019-21456",
    lat:"40.2459169999998",
    lon:"-78.10241699999999" },
  { id:"019-21456",
    lat:"40.22834299904545",
    lon:"-79.68839603183159" },
  { id:"019-21456",
    lat:"40.226521999999825",
    lon:"-79.69361700000002" },
  { id:"019-21456",
    lat:"40.22799499999982",
    lon:"-79.70422899999998" },
  { id:"019-21456",
    lat:"40.22793899999982",
    lon:"-79.71272900000001" },
  { id:"019-21456",
    lat:"40.22334299999982",
    lon:"-79.69594700000096" },
  { id:"019-21456",
    lat:"40.214376204972744",
    lon:"-80.1457435739766" },
  { id:"019-21456",
    lat:"40.21183624199848",
    lon:"-80.29196154109687" },
  { id:"019-21456",
    lat:"40.21719048536053",
    lon:"-80.12862098724766" },
  { id:"019-21456",
    lat:"40.21744551673259",
    lon:"-80.08729313725436" },
  { id:"019-21456",
    lat:"40.22449499999981",
    lon:"-79.71320099999998" },
  { id:"019-21456",
    lat:"40.219977010250844",
    lon:"-79.92557707039728" },
  { id:"019-21456",
    lat:"40.22411099999982",
    lon:"-79.75066699999999" },
  { id:"019-21456",
    lat:"40.20688343781748",
    lon:"-80.36722138976907" },
  { id:"019-21456",
    lat:"40.20711873948793",
    lon:"-80.38629361839138" },
  { id:"019-21456",
    lat:"40.222438999999824",
    lon:"-79.710312" },
  { id:"019-21456",
    lat:"40.196913997950986",
    lon:"-79.74832106649892" },
  { id:"019-21456",
    lat:"40.19772991649447",
    lon:"-79.70748433263006" },
  { id:"019-21456",
    lat:"40.190180338762495",
    lon:"-80.163853682832" },
  { id:"019-21456",
    lat:"40.23247350001295",
    lon:"-79.73292650000121" },
  { id:"019-21456",
    lat:"40.229078074658986",
    lon:"-80.03187987392866" },
  { id:"019-21456",
    lat:"40.230990500036974",
    lon:"-79.98654000017636" },
  { id:"019-21456",
    lat:"40.23363299999981",
    lon:"-79.75673" },
  { id:"019-21456",
    lat:"40.22205826112801",
    lon:"-80.41841362864756" },
  { id:"019-21456",
    lat:"40.22677675491319",
    lon:"-80.2407568086349" },
  { id:"019-21456",
    lat:"40.228284372231506",
    lon:"-79.9574756834997" },
  { id:"019-21456",
    lat:"40.21747643068566",
    lon:"-80.45765699658526" },
  { id:"019-21456",
    lat:"40.22638499999982",
    lon:"-80.516255" },
  { id:"019-21456",
    lat:"40.24380550000057",
    lon:"-79.68181949999439" },
  { id:"019-21456",
    lat:"40.22640754792417",
    lon:"-80.44585370223297" },
  { id:"019-21456",
    lat:"40.233824545335665",
    lon:"-80.11664562245694" },
  { id:"019-21456",
    lat:"40.242907000011634",
    lon:"-79.69224300003602" },
  { id:"019-21456",
    lat:"40.24238299999982",
    lon:"-79.75459100000002" },
  { id:"019-21456",
    lat:"40.2306084560889",
    lon:"-80.2775945052189" },
  { id:"019-21456",
    lat:"40.23441547454552",
    lon:"-80.17385371909039" },
  { id:"019-21456",
    lat:"40.23080799999983",
    lon:"-80.341348" },
  { id:"019-21456",
    lat:"40.24277799999983",
    lon:"-79.78197199999998" },
  { id:"019-21456",
    lat:"40.24602199999982",
    lon:"-79.755925" },
  { id:"019-21456",
    lat:"40.232798346544755",
    lon:"-80.337833565761" },
  { id:"019-21456",
    lat:"40.23217132355836",
    lon:"-80.35140185037127" },
  { id:"019-21456",
    lat:"40.23177669065432",
    lon:"-80.48359135191241" },
  { id:"019-21456",
    lat:"40.24627199999981",
    lon:"-79.74789699999998" },
  { id:"019-21456",
    lat:"40.243437262111925",
    lon:"-79.90441738814899" },
  { id:"019-21456",
    lat:"40.23838299999982",
    lon:"-79.73100700000002" },
  { id:"019-21456",
    lat:"40.22270549999999",
    lon:"-80.50179750000531" },
  { id:"019-21456",
    lat:"40.237827999999816",
    lon:"-79.74686899999998" },
  { id:"019-21456",
    lat:"40.23779999999983",
    lon:"-79.75750799999999" },
  { id:"019-21456",
    lat:"40.23582884327025",
    lon:"-79.91259880950696" },
  { id:"019-21456",
    lat:"40.22618327952437",
    lon:"-80.37939079479492" },
  { id:"019-21456",
    lat:"40.22907550888981",
    lon:"-80.32255798596518" },
  { id:"019-21456",
    lat:"40.232947968365956",
    lon:"-80.14469444109717" },
  { id:"019-21456",
    lat:"40.2402609268208",
    lon:"-80.46444642672725" },
  { id:"019-21456",
    lat:"40.243354000216165",
    lon:"-80.23496701407288" },
  { id:"019-21456",
    lat:"40.240620810452455",
    lon:"-80.44131974704727" },
  { id:"019-21456",
    lat:"40.25499399999982",
    lon:"-79.76049399999998" },
  { id:"019-21456",
    lat:"40.243959558414794",
    lon:"-80.3095587557393" },
  { id:"019-21456",
    lat:"40.241208498773965",
    lon:"-80.365389" },
  { id:"019-21456",
    lat:"40.24382900000067",
    lon:"-80.27920600000002" },
  { id:"019-21456",
    lat:"40.24323200000061",
    lon:"-80.32129050000286" },
  { id:"019-21456",
    lat:"40.24380099999981",
    lon:"-80.347111" },
  { id:"019-21456",
    lat:"40.25565147799539",
    lon:"-79.7457859963497" },
  { id:"019-21456",
    lat:"40.245033971858746",
    lon:"-80.48334849697498" },
  { id:"019-21456",
    lat:"40.24841199999981",
    lon:"-80.32855500000001" },
  { id:"019-21456",
    lat:"40.266143026985894",
    lon:"-79.75112100071452" },
  { id:"019-21456",
    lat:"40.25446799999981",
    lon:"-80.248274" },
  { id:"019-21456",
    lat:"40.25420400001342",
    lon:"-80.32094350001168" },
  { id:"019-21456",
    lat:"40.256990619761694",
    lon:"-80.23635763816549" },
  { id:"019-21456",
    lat:"40.26992799999983",
    lon:"-79.77750000000002" },
  { id:"019-21456",
    lat:"40.26003700000066",
    lon:"-80.33751300000296" },
  { id:"019-21456",
    lat:"40.2616619999998",
    lon:"-80.27210800000002" },
  { id:"019-21456",
    lat:"40.26389502978975",
    lon:"-80.2173993015032" },
  { id:"019-21456",
    lat:"40.25481444699992",
    lon:"-80.37798775455452" },
  { id:"019-21456",
    lat:"40.25861299999981",
    lon:"-80.24824799999999" },
  { id:"019-21456",
    lat:"40.267147500006644",
    lon:"-79.78454350002171" },
  { id:"019-21456",
    lat:"40.2577449999998",
    lon:"-80.31024799999999" },
  { id:"019-21456",
    lat:"40.25084269046869",
    lon:"-80.29491305880317" },
  { id:"019-21456",
    lat:"40.250995999999816",
    lon:"-80.367778" },
  { id:"019-21456",
    lat:"40.244034848479785",
    lon:"-80.41102113368605" },
  { id:"019-21456",
    lat:"40.25618899999983",
    lon:"-79.841811" },
  { id:"019-21456",
    lat:"40.24243222815189",
    lon:"-80.45419598807102" },
  { id:"019-21456",
    lat:"40.2442814170817",
    lon:"-80.3416383034452" },
  { id:"019-21456",
    lat:"40.24625726653708",
    lon:"-80.27030637493777" },
  { id:"019-21456",
    lat:"40.24862845518852",
    lon:"-80.26306037238632" },
  { id:"019-21456",
    lat:"40.257066422855296",
    lon:"-79.80187289487182" },
  { id:"019-21456",
    lat:"40.24626984474788",
    lon:"-80.39134135153064" },
  { id:"019-21456",
    lat:"40.246673528237324",
    lon:"-80.38129404355209" },
  { id:"019-21456",
    lat:"40.24966784544261",
    lon:"-79.71995031295809" },
  { id:"019-21456",
    lat:"40.23424600000319",
    lon:"-80.41764100001184" },
  { id:"019-21456",
    lat:"40.24771699999984",
    lon:"-79.76073" },
  { id:"019-21456",
    lat:"40.24941099999981",
    lon:"-79.74473" },
  { id:"019-21456",
    lat:"40.248674728599745",
    lon:"-79.81952295312172" },
  { id:"019-21456",
    lat:"40.23665474522326",
    lon:"-80.41182033061628" },
  { id:"019-21456",
    lat:"40.229833000003175",
    lon:"-79.7350555" },
  { id:"019-21456",
    lat:"40.21759104001823",
    lon:"-80.26893501047252" },
  { id:"019-21456",
    lat:"40.228736000003266",
    lon:"-79.76374999999413" },
  { id:"019-21456",
    lat:"40.214863500015326",
    lon:"-80.4945515000274" },
  { id:"019-21456",
    lat:"40.230037374302995",
    lon:"-79.74384058242347" },
  { id:"019-21456",
    lat:"40.21552940631038",
    lon:"-80.46300307991072" },
  { id:"019-21456",
    lat:"40.21808894447243",
    lon:"-80.33152079522135" },
  { id:"019-21456",
    lat:"40.22409990149455",
    lon:"-80.07715816410234" },
  { id:"019-21456",
    lat:"40.16676841905349",
    lon:"-79.98111858133261" },
  { id:"019-21456",
    lat:"40.16647406351746",
    lon:"-80.00501155652474" },
  { id:"019-21456",
    lat:"40.16596151378232",
    lon:"-80.03858579027133" },
  { id:"019-21456",
    lat:"40.1713839999998",
    lon:"-79.75723099999998" },
  { id:"019-21456",
    lat:"40.15587782582013",
    lon:"-80.49658696742162" },
  { id:"019-21456",
    lat:"40.160057834354554",
    lon:"-80.32876539891522" },
  { id:"019-21456",
    lat:"40.16414436573976",
    lon:"-80.15854311564387" },
  { id:"019-21456",
    lat:"40.263429715267456",
    lon:"-80.4653471618123" },
  { id:"019-21456",
    lat:"40.278971999999804",
    lon:"-79.759583" },
  { id:"019-21456",
    lat:"40.263528689414564",
    lon:"-80.40872788550442" },
  { id:"019-21456",
    lat:"40.26542988789024",
    lon:"-80.36268193404322" },
  { id:"019-21456",
    lat:"40.27111400005037",
    lon:"-80.25221500003222" },
  { id:"019-21456",
    lat:"40.26680549999974",
    lon:"-80.354778" },
  { id:"019-21456",
    lat:"40.269605999999825",
    lon:"-80.30177599999999" },
  { id:"019-21456",
    lat:"40.27000854692655",
    lon:"-80.50018323534323" },
  { id:"019-21456",
    lat:"40.273999999999816",
    lon:"-80.318361" },
  { id:"019-21456",
    lat:"40.27184308068662",
    lon:"-80.43121422133639" },
  { id:"019-21456",
    lat:"40.28839595582161",
    lon:"-79.63759650132606" },
  { id:"019-21456",
    lat:"40.276493105667626",
    lon:"-80.23973378286779" },
  { id:"019-21456",
    lat:"40.276536999999806",
    lon:"-80.24983000000002" },
  { id:"019-21456",
    lat:"40.286530500010436",
    lon:"-79.76445700001217" },
  { id:"019-21456",
    lat:"40.28694350001667",
    lon:"-79.756503000035" },
  { id:"019-21456",
    lat:"40.2691339999998",
    lon:"-80.39039000000001" },
  { id:"019-21456",
    lat:"40.277662360962104",
    lon:"-80.02737679869732" },
  { id:"019-21456",
    lat:"40.27031500000315",
    lon:"-80.30835949999421" },
  { id:"019-21456",
    lat:"40.26941199999982",
    lon:"-80.38500099999999" },
  { id:"019-21456",
    lat:"40.27182899999982",
    lon:"-80.29822" },
  { id:"019-21456",
    lat:"40.27319299681521",
    lon:"-80.25836516560723" },
  { id:"019-21456",
    lat:"40.27425187397049",
    lon:"-80.2164578698606" },
  { id:"019-21456",
    lat:"40.28444399999982",
    lon:"-79.702153" },
  { id:"019-21456",
    lat:"40.27241199999984",
    lon:"-80.30863700000002" },
  { id:"019-21456",
    lat:"40.27441200000317",
    lon:"-80.2536075" },
  { id:"019-21456",
    lat:"40.278447356364026",
    lon:"-80.48572768068252" },
  { id:"019-21456",
    lat:"40.2780624211695",
    lon:"-80.45533038436639" },
  { id:"019-21456",
    lat:"40.277833000013054",
    lon:"-80.47222249997417" },
  { id:"019-21456",
    lat:"40.30390086162346",
    lon:"-79.21672270642938" },
  { id:"019-21456",
    lat:"40.28300009315775",
    lon:"-80.38639739144278" },
  { id:"019-21456",
    lat:"40.2846899999998",
    lon:"-80.346527" },
  { id:"019-21456",
    lat:"40.28772545082381",
    lon:"-80.21578745564658" },
  { id:"019-21456",
    lat:"40.29435999999981",
    lon:"-79.62532900000001" },
  { id:"019-21456",
    lat:"40.29415902193166",
    lon:"-79.64706558355734" },
  { id:"019-21456",
    lat:"40.29562048486643",
    lon:"-79.65902193661503" },
  { id:"019-21456",
    lat:"40.28046699999983",
    lon:"-80.361167" },
  { id:"019-21456",
    lat:"40.283554397035324",
    lon:"-80.22719693725507" },
  { id:"019-21456",
    lat:"40.28113399999982",
    lon:"-80.36594500000001" },
  { id:"019-21456",
    lat:"40.29645999999984",
    lon:"-79.62915899999999" },
  { id:"019-21456",
    lat:"40.283800999999805",
    lon:"-80.297748" },
  { id:"019-21456",
    lat:"40.29690699999983",
    lon:"-79.63614600000001" },
  { id:"019-21456",
    lat:"40.293082999999825",
    lon:"-79.85995300000002" },
  { id:"019-21456",
    lat:"40.290564999999816",
    lon:"-79.63684399999998" },
  { id:"019-21456",
    lat:"40.276911999999825",
    lon:"-80.286303" },
  { id:"019-21456",
    lat:"40.277129837018244",
    lon:"-80.34978527951466" },
  { id:"019-21456",
    lat:"40.279116506571285",
    lon:"-80.26435549427123" },
  { id:"019-21456",
    lat:"40.30995599999988",
    lon:"-79.17973899999812" },
  { id:"019-21456",
    lat:"40.31471099999982",
    lon:"-79.166547" },
  { id:"019-21456",
    lat:"40.29328865528622",
    lon:"-80.39089067319358" },
  { id:"019-21456",
    lat:"40.2928305819896",
    lon:"-80.4610187075134" },
  { id:"019-21456",
    lat:"40.29658753895409",
    lon:"-80.4117403959816" },
  { id:"019-21456",
    lat:"40.29160599999981",
    lon:"-80.31183200000001" },
  { id:"019-21456",
    lat:"40.29246699999982",
    lon:"-80.298387" },
  { id:"019-21456",
    lat:"40.30587374477085",
    lon:"-80.23416466711271" },
  { id:"019-21456",
    lat:"40.302278671727564",
    lon:"-80.47366546150687" },
  { id:"019-21456",
    lat:"40.30441954875824",
    lon:"-80.32735254449418" },
  { id:"019-21456",
    lat:"40.30529979565486",
    lon:"-80.36086214532133" },
  { id:"019-21456",
    lat:"40.30270550001741",
    lon:"-80.26196100006071" },
  { id:"019-21456",
    lat:"40.29896458175632",
    lon:"-80.37917030848254" },
  { id:"019-21456",
    lat:"40.299287224552415",
    lon:"-80.40742848046378" },
  { id:"019-21456",
    lat:"40.31499283006746",
    lon:"-79.63810336082402" },
  { id:"019-21456",
    lat:"40.33202799999983",
    lon:"-79.09597200000002" },
  { id:"019-21456",
    lat:"40.32790299999981",
    lon:"-79.48812800000002" },
  { id:"019-21456",
    lat:"40.33102695611748",
    lon:"-79.33589567544365" },
  { id:"019-21456",
    lat:"40.336324000001035",
    lon:"-79.15532750000175" },
  { id:"019-21456",
    lat:"40.31220199226067",
    lon:"-80.49485625431876" },
  { id:"019-21456",
    lat:"40.34199849999977",
    lon:"-79.0889849999992" },
  { id:"019-21456",
    lat:"40.34029849586697",
    lon:"-79.36344298236659" },
  { id:"019-21456",
    lat:"40.322111657713506",
    lon:"-80.47348777295213" },
  { id:"019-21456",
    lat:"40.33883599999981",
    lon:"-79.13172499999999" },
  { id:"019-21456",
    lat:"40.33718482618314",
    lon:"-79.36011520000908" },
  { id:"019-21456",
    lat:"40.32037731949071",
    lon:"-80.3022484062309" },
  { id:"019-21456",
    lat:"40.34137400000033",
    lon:"-79.14565500000299" },
  { id:"019-21456",
    lat:"40.35325155528693",
    lon:"-78.56585150142877" },
  { id:"019-21456",
    lat:"40.33010600000318",
    lon:"-80.28171950000001" },
  { id:"019-21456",
    lat:"40.32889000442038",
    lon:"-80.2185359823167" },
  { id:"019-21456",
    lat:"40.32547548018751",
    lon:"-80.37292462386561" },
  { id:"019-21456",
    lat:"40.32810657559465",
    lon:"-80.29597100091843" },
  { id:"019-21456",
    lat:"40.30791387790654",
    lon:"-80.36985257661433" },
  { id:"019-21456",
    lat:"40.310275103547944",
    lon:"-80.3027872026969" },
  { id:"019-21456",
    lat:"40.30942214915975",
    lon:"-80.40685014265625" },
  { id:"019-21456",
    lat:"40.2833440543516",
    lon:"-80.44664526161813" },
  { id:"019-21456",
    lat:"40.285017784336155",
    lon:"-80.43141698750716" },
  { id:"019-21456",
    lat:"40.287090875800196",
    lon:"-80.41568817836814" },
  { id:"019-21456",
    lat:"40.29112814637146",
    lon:"-80.24775867501587" },
  { id:"019-21456",
    lat:"40.3348584946373",
    lon:"-80.27527057340774" },
  { id:"019-21456",
    lat:"40.360577999999826",
    lon:"-78.555903" },
  { id:"019-21456",
    lat:"40.353926500001315",
    lon:"-79.33478750000572" },
  { id:"019-21456",
    lat:"40.36260799999983",
    lon:"-78.549922" },
  { id:"019-21456",
    lat:"40.354759093861226",
    lon:"-79.3060531587038" },
  { id:"019-21456",
    lat:"40.3362190249448",
    lon:"-80.34886633811486" },
  { id:"019-21456",
    lat:"40.337298556869726",
    lon:"-80.4439789314177" },
  { id:"019-21456",
    lat:"40.3706669999998",
    lon:"-78.53600000000002" },
  { id:"019-21456",
    lat:"40.34362207015834",
    lon:"-80.43184848451358" },
  { id:"019-21456",
    lat:"40.34813277244273",
    lon:"-80.37021810179446" },
  { id:"019-21456",
    lat:"40.34992226647699",
    lon:"-80.29542080209718" },
  { id:"019-21456",
    lat:"40.36541179350892",
    lon:"-79.48058483113007" },
  { id:"019-21456",
    lat:"40.36769399999983",
    lon:"-79.32927799999999" },
  { id:"019-21456",
    lat:"40.34299177305791",
    lon:"-80.40536627336274" },
  { id:"019-21456",
    lat:"40.36306949999981",
    lon:"-79.331639" },
  { id:"019-21456",
    lat:"40.36381801731652",
    lon:"-79.29974045183779" },
  { id:"019-21456",
    lat:"40.34427589768659",
    lon:"-80.39425344841229" },
  { id:"019-21456",
    lat:"40.35295494525336",
    lon:"-80.33413331666644" },
  { id:"019-21456",
    lat:"40.371574999999815",
    lon:"-79.33216099999999" },
  { id:"019-21456",
    lat:"40.37121999999983",
    lon:"-79.33961800000002" },
  { id:"019-21456",
    lat:"40.35447105998317",
    lon:"-80.2803698141788" },
  { id:"019-21456",
    lat:"40.37665835495766",
    lon:"-79.28037187936548" },
  { id:"019-21456",
    lat:"40.37533624167528",
    lon:"-79.28655161599642" },
  { id:"019-21456",
    lat:"40.372824999999814",
    lon:"-79.32893800000001" },
  { id:"019-21456",
    lat:"40.35130949873064",
    lon:"-80.50231806526533" },
  { id:"019-21456",
    lat:"40.36970999999981",
    lon:"-79.496993" },
  { id:"019-21456",
    lat:"40.379769999999844",
    lon:"-79.471832" },
  { id:"019-21456",
    lat:"40.36287915391571",
    lon:"-80.26911407826984" },
  { id:"019-21456",
    lat:"40.36248092838225",
    lon:"-80.30758626703027" },
  { id:"019-21456",
    lat:"40.380824999999824",
    lon:"-79.32832700000002" },
  { id:"019-21456",
    lat:"40.381675000005195",
    lon:"-79.29259600001639" },
  { id:"019-21456",
    lat:"40.369241999999815",
    lon:"-79.33511099999998" },
  { id:"019-21456",
    lat:"40.370527999999815",
    lon:"-79.34366699999998" },
  { id:"019-21456",
    lat:"40.36911036378716",
    lon:"-80.43793222468675" },
  { id:"019-21456",
    lat:"40.37817159762125",
    lon:"-80.29313198472978" },
  { id:"019-21456",
    lat:"40.40331799999983",
    lon:"-78.87488400000001" },
  { id:"019-21456",
    lat:"40.39026724876136",
    lon:"-79.73485902329003" },
  { id:"019-21456",
    lat:"40.38913250001485",
    lon:"-79.5816609999639" },
  { id:"019-21456",
    lat:"40.38488198217574",
    lon:"-80.27818210799599" },
  { id:"019-21456",
    lat:"40.39318099999982",
    lon:"-79.84633599999998" },
  { id:"019-21456",
    lat:"40.39996649999977",
    lon:"-79.604453" },
  { id:"019-21456",
    lat:"40.39631894690756",
    lon:"-79.66870491172514" },
  { id:"019-21456",
    lat:"40.39483062001029",
    lon:"-79.59233180168206" },
  { id:"019-21456",
    lat:"40.38094888040611",
    lon:"-80.25648866724298" },
  { id:"019-21456",
    lat:"40.40093653791063",
    lon:"-79.27591298120613" },
  { id:"019-21456",
    lat:"40.3921070964508",
    lon:"-80.40394150001732" },
  { id:"019-21456",
    lat:"40.40542342891014",
    lon:"-80.38995872812667" },
  { id:"019-21456",
    lat:"40.40569850004119",
    lon:"-80.46315300005048" },
  { id:"019-21456",
    lat:"40.433544999999825",
    lon:"-79.07053500000002" },
  { id:"019-21456",
    lat:"40.40756136085904",
    lon:"-80.36306329120157" },
  { id:"019-21456",
    lat:"40.421360999999806",
    lon:"-79.55019199999997" },
  { id:"019-21456",
    lat:"40.403694741918066",
    lon:"-80.37658180581313" },
  { id:"019-21456",
    lat:"40.40572035823064",
    lon:"-80.32655422631362" },
  { id:"019-21456",
    lat:"40.41420137846539",
    lon:"-80.42438703039417" },
  { id:"019-21456",
    lat:"40.416667976319125",
    lon:"-80.31435408060044" },
  { id:"019-21456",
    lat:"40.43181099999982",
    lon:"-79.52498100000001" },
  { id:"019-21456",
    lat:"40.418759814909016",
    lon:"-80.35075044228873" },
  { id:"019-21456",
    lat:"40.4179512878079",
    lon:"-80.40314857477154" },
  { id:"019-21456",
    lat:"40.43543899999982",
    lon:"-79.584499" },
  { id:"019-21456",
    lat:"40.44544600000102",
    lon:"-79.07727950000276" },
  { id:"019-21456",
    lat:"40.44387799999983",
    lon:"-79.609867" },
  { id:"019-21456",
    lat:"40.43020799999982",
    lon:"-80.498967" },
  { id:"019-21456",
    lat:"40.452105499999774",
    lon:"-79.42051799999957" },
  { id:"019-21456",
    lat:"40.44266800341423",
    lon:"-80.33817639858489" },
  { id:"019-21456",
    lat:"40.45040999999981",
    lon:"-80.34061000000003" },
  { id:"019-21456",
    lat:"40.482912500000815",
    lon:"-79.14374299999852" },
  { id:"019-21456",
    lat:"40.47476650472302",
    lon:"-79.56925649565075" },
  { id:"019-21456",
    lat:"40.46190550066489",
    lon:"-80.25677088934283" },
  { id:"019-21456",
    lat:"40.43370799999982",
    lon:"-79.07623300000002" },
  { id:"019-21456",
    lat:"40.39162492800628",
    lon:"-80.29770790630839" },
  { id:"019-21456",
    lat:"40.392019129727416",
    lon:"-80.32565860000669" },
  { id:"019-21456",
    lat:"40.36780002892112",
    lon:"-80.35804087518177" },
  { id:"019-21456",
    lat:"40.38452799999977",
    lon:"-79.50080599999998" },
  { id:"019-21456",
    lat:"40.384012499999834",
    lon:"-79.62416400000093" },
  { id:"019-21456",
    lat:"40.3273144988921",
    lon:"-80.45643856811844" },
  { id:"019-21456",
    lat:"40.32895289574477",
    lon:"-80.35931768220162" },
  { id:"019-21456",
    lat:"40.33340841765814",
    lon:"-80.20659744485363" },
  { id:"019-21456",
    lat:"40.34902612131895",
    lon:"-79.34715280899373" },
  { id:"019-21456",
    lat:"40.34903200178197",
    lon:"-79.35851099291365" },
  { id:"019-21456",
    lat:"40.47976199999982",
    lon:"-79.57489300000003" },
  { id:"019-21456",
    lat:"40.46466699999982",
    lon:"-80.477889" },
  { id:"019-21456",
    lat:"40.47298748806583",
    lon:"-80.25481254057293" },
  { id:"019-21456",
    lat:"40.465977646998766",
    lon:"-80.35976000177118" },
  { id:"019-21456",
    lat:"40.4938475792162",
    lon:"-79.5658510387753" },
  { id:"019-21456",
    lat:"40.48975010129521",
    lon:"-79.57872504971834" },
  { id:"019-21456",
    lat:"40.47510701688209",
    lon:"-80.38223757102635" },
  { id:"019-21456",
    lat:"40.479895503474424",
    lon:"-80.23721127604698" },
  { id:"019-21456",
    lat:"40.47451549918424",
    lon:"-80.45930254490756" },
  { id:"019-21456",
    lat:"40.47987535127877",
    lon:"-80.41684319196936" },
  { id:"019-21456",
    lat:"40.48461250205093",
    lon:"-80.32546249609037" },
  { id:"019-21456",
    lat:"40.48412345011142",
    lon:"-80.34931644854564" },
  { id:"019-21456",
    lat:"40.51064299999983",
    lon:"-79.186639" },
  { id:"019-21456",
    lat:"40.5046722635809",
    lon:"-80.32811085432087" },
  { id:"019-21456",
    lat:"40.52460249953098",
    lon:"-79.19807805792175" },
  { id:"019-21456",
    lat:"40.508045940177226",
    lon:"-79.54591241221729" },
  { id:"019-21456",
    lat:"40.508297120862686",
    lon:"-79.55881032890905" },
  { id:"019-21456",
    lat:"40.50391463147067",
    lon:"-79.56064581401921" },
  { id:"019-21456",
    lat:"40.503923592248945",
    lon:"-79.57283279446843" },
  { id:"019-21456",
    lat:"40.518207498362294",
    lon:"-80.35418621428714" },
  { id:"019-21456",
    lat:"40.54165599999983",
    lon:"-79.032822" },
  { id:"019-21456",
    lat:"40.53144705001592",
    lon:"-80.35349155342858" },
  { id:"019-21456",
    lat:"40.56202499999982",
    lon:"-79.25629699999999" },
  { id:"019-21456",
    lat:"40.5312165567215",
    lon:"-80.30968355448576" },
  { id:"019-21456",
    lat:"40.53144216157589",
    lon:"-79.76702927746123" },
  { id:"019-21456",
    lat:"40.53663500027202",
    lon:"-79.52335549978137" },
  { id:"019-21456",
    lat:"40.54466700596469",
    lon:"-80.38298065852135" },
  { id:"019-21456",
    lat:"40.57678899999982",
    lon:"-79.24695800000002" },
  { id:"019-21456",
    lat:"40.56517211836405",
    lon:"-79.6293945608473" },
  { id:"019-21456",
    lat:"40.57276547124579",
    lon:"-79.80700219767466" },
  { id:"019-21456",
    lat:"40.581457535253875",
    lon:"-79.38327333368585" },
  { id:"019-21456",
    lat:"40.58435829281912",
    lon:"-79.85154999321483" },
  { id:"019-21456",
    lat:"40.59419300000123",
    lon:"-79.41214299999592" },
  { id:"019-21456",
    lat:"40.60462799999982",
    lon:"-78.960689" },
  { id:"019-21456",
    lat:"40.57924028866095",
    lon:"-79.6687364140456" },
  { id:"019-21456",
    lat:"40.53465562508463",
    lon:"-79.19895419523816" },
  { id:"019-21456",
    lat:"40.616174925900424",
    lon:"-79.7865792025083" },
  { id:"019-21456",
    lat:"40.629368999999826",
    lon:"-79.10119100000001" },
  { id:"019-21456",
    lat:"40.6177320015875",
    lon:"-79.8035255824157" },
  { id:"019-21456",
    lat:"40.629999999999825",
    lon:"-79.366969" },
  { id:"019-21456",
    lat:"40.61343200564735",
    lon:"-80.1664695976026" },
  { id:"019-21456",
    lat:"40.62514967896007",
    lon:"-79.78354710016782" },
  { id:"019-21456",
    lat:"40.64105499999983",
    lon:"-79.02190499999999" },
  { id:"019-21456",
    lat:"40.634324172939955",
    lon:"-79.75367265687633" },
  { id:"019-21456",
    lat:"40.64666699999982",
    lon:"-79.386925" },
  { id:"019-21456",
    lat:"40.63949195831067",
    lon:"-80.17966246743576" },
  { id:"019-21456",
    lat:"40.66018600346832",
    lon:"-78.96391687592414" },
  { id:"019-21456",
    lat:"40.648636000002796",
    lon:"-79.77764749997262" },
  { id:"019-21456",
    lat:"40.634698594807006",
    lon:"-80.20351947335969" },
  { id:"019-21456",
    lat:"40.65452479153081",
    lon:"-79.7751321393438" },
  { id:"019-21456",
    lat:"40.657900999999846",
    lon:"-79.78108500000002" },
  { id:"019-21456",
    lat:"40.64888899999982",
    lon:"-80.454111" },
  { id:"019-21456",
    lat:"40.677698999999826",
    lon:"-78.985937" },
  { id:"019-21456",
    lat:"40.67792203241788",
    lon:"-79.38150852118409" },
  { id:"019-21456",
    lat:"40.658416999999815",
    lon:"-80.490944" },
  { id:"019-21456",
    lat:"40.67217846702863",
    lon:"-79.80598742368635" },
  { id:"019-21456",
    lat:"40.65347199999982",
    lon:"-80.44519400000001" },
  { id:"019-21456",
    lat:"40.677196199465406",
    lon:"-79.78218448991899" },
  { id:"019-21456",
    lat:"40.67959199999983",
    lon:"-79.590531" },
  { id:"019-21456",
    lat:"40.67601499999982",
    lon:"-79.746348" },
  { id:"019-21456",
    lat:"40.67505350003195",
    lon:"-79.75121149996426" },
  { id:"019-21456",
    lat:"40.677485999999824",
    lon:"-79.59782500000001" },
  { id:"019-21456",
    lat:"40.6683609999998",
    lon:"-80.41480600000001" },
  { id:"019-21456",
    lat:"40.68087299999983",
    lon:"-79.75668199999998" },
  { id:"019-21456",
    lat:"40.69456650052886",
    lon:"-78.91510445734592" },
  { id:"019-21456",
    lat:"40.68736147910838",
    lon:"-79.3662984590081" },
  { id:"019-21456",
    lat:"40.680821999999836",
    lon:"-79.57583300000002" },
  { id:"019-21456",
    lat:"40.67873099999982",
    lon:"-79.75058699999998" },
  { id:"019-21456",
    lat:"40.68089199999983",
    lon:"-79.594746" },
  { id:"019-21456",
    lat:"40.679417000000136",
    lon:"-79.76609750000144" },
  { id:"019-21456",
    lat:"40.69874200000125",
    lon:"-79.48184900000383" },
  { id:"019-21456",
    lat:"40.68632052373928",
    lon:"-80.17031452320592" },
  { id:"019-21456",
    lat:"40.68930344101369",
    lon:"-79.79729115142098" },
  { id:"019-21456",
    lat:"40.68745550001263",
    lon:"-79.96596000000206" },
  { id:"019-21456",
    lat:"40.70585400000087",
    lon:"-79.40924349999436" },
  { id:"019-21456",
    lat:"40.68763899999981",
    lon:"-80.403028" },
  { id:"019-21456",
    lat:"40.698233003011744",
    lon:"-79.85620899714341" },
  { id:"019-21456",
    lat:"40.69250406027523",
    lon:"-80.19728048514168" },
  { id:"019-21456",
    lat:"40.70519999999982",
    lon:"-79.549475" },
  { id:"019-21456",
    lat:"40.708857959458776",
    lon:"-79.6266783893422" },
  { id:"019-21456",
    lat:"40.70648851315919",
    lon:"-79.85722799513307" },
  { id:"019-21456",
    lat:"40.71700146595393",
    lon:"-79.47569522631527" },
  { id:"019-21456",
    lat:"40.71595472122214",
    lon:"-79.62157588808866" },
  { id:"019-21456",
    lat:"40.710885999999824",
    lon:"-79.65291100000003" },
  { id:"019-21456",
    lat:"40.71099999999982",
    lon:"-79.64838100000001" },
  { id:"019-21456",
    lat:"40.708468000005546",
    lon:"-79.81546400000055" },
  { id:"019-21456",
    lat:"40.712077999999835",
    lon:"-79.64339999999999" },
  { id:"019-21456",
    lat:"40.702674903639874",
    lon:"-79.81658373525512" },
  { id:"019-21456",
    lat:"40.695166222040136",
    lon:"-80.21414249609626" },
  { id:"019-21456",
    lat:"40.70487499999983",
    lon:"-79.64250800000002" },
  { id:"019-21456",
    lat:"40.70105599999982",
    lon:"-80.500083" },
  { id:"019-21456",
    lat:"40.71872648739271",
    lon:"-79.80772099848465" },
  { id:"019-21456",
    lat:"40.71965799999984",
    lon:"-79.865942" },
  { id:"019-21456",
    lat:"40.71576699999983",
    lon:"-80.489797" },
  { id:"019-21456",
    lat:"40.7217030001441",
    lon:"-80.16477799802281" },
  { id:"019-21456",
    lat:"40.72800993492377",
    lon:"-79.90634600550874" },
  { id:"019-21456",
    lat:"40.72330999999983",
    lon:"-79.823958" },
  { id:"019-21456",
    lat:"40.715973702551906",
    lon:"-80.17755243484015" },
  { id:"019-21456",
    lat:"40.72124850002794",
    lon:"-79.96813200000184" },
  { id:"019-21456",
    lat:"40.72792499999983",
    lon:"-79.61635200000002" },
  { id:"019-21456",
    lat:"40.73340999999982",
    lon:"-79.86095000000002" },
  { id:"019-21456",
    lat:"40.745810027506764",
    lon:"-79.41125551325506" },
  { id:"019-21456",
    lat:"40.75153999999983",
    lon:"-79.04410999999999" },
  { id:"019-21456",
    lat:"40.73842199999984",
    lon:"-79.598222" },
  { id:"019-21456",
    lat:"40.732318000002564",
    lon:"-79.9484889999962" },
  { id:"019-21456",
    lat:"40.739713999999836",
    lon:"-79.601408" },
  { id:"019-21456",
    lat:"40.73464999999983",
    lon:"-79.8912" },
  { id:"019-21456",
    lat:"40.73892499999983",
    lon:"-79.6836545000003" },
  { id:"019-21456",
    lat:"40.737060900430784",
    lon:"-79.51474999369718" },
  { id:"019-21456",
    lat:"40.72373762312504",
    lon:"-80.2299542142009" },
  { id:"019-21456",
    lat:"40.71810299999985",
    lon:"-79.610317" },
  { id:"019-21456",
    lat:"40.71491899999983",
    lon:"-79.809897" },
  { id:"019-21456",
    lat:"40.72213195545098",
    lon:"-79.4134834613194" },
  { id:"019-21456",
    lat:"40.72288409433273",
    lon:"-79.42105806571867" },
  { id:"019-21456",
    lat:"40.726238999999836",
    lon:"-80.510225" },
  { id:"019-21456",
    lat:"40.73460046461237",
    lon:"-80.20140846602193" },
  { id:"019-21456",
    lat:"40.7401790000011",
    lon:"-79.99083900000387" },
  { id:"019-21456",
    lat:"40.74502499999983",
    lon:"-79.766672" },
  { id:"019-21456",
    lat:"40.74446749778765",
    lon:"-79.85407360959007" },
  { id:"019-21456",
    lat:"40.735943999999805",
    lon:"-80.443547" },
  { id:"019-21456",
    lat:"40.74758374043713",
    lon:"-79.90509172479778" },
  { id:"019-21456",
    lat:"40.73761099999984",
    lon:"-80.385444" },
  { id:"019-21456",
    lat:"40.74776399999982",
    lon:"-79.71573299999999" },
  { id:"019-21456",
    lat:"40.73961399997138",
    lon:"-80.16908935055666" },
  { id:"019-21456",
    lat:"40.745066177514225",
    lon:"-79.86663058365988" },
  { id:"019-21456",
    lat:"40.752848999999834",
    lon:"-79.50974800000002" },
  { id:"019-21456",
    lat:"40.74734299876049",
    lon:"-79.83742099951621" },
  { id:"019-21456",
    lat:"40.75075899999981",
    lon:"-80.03243499999999" },
  { id:"019-21456",
    lat:"40.76284550000473",
    lon:"-79.49131150000127" },
  { id:"019-21456",
    lat:"40.75908299999982",
    lon:"-79.654672" },
  { id:"019-21456",
    lat:"40.756609463953154",
    lon:"-79.80005103177186" },
  { id:"019-21456",
    lat:"40.75851631471491",
    lon:"-79.70409781605348" },
  { id:"019-21456",
    lat:"40.74741649999989",
    lon:"-80.0217735000023" },
  { id:"019-21456",
    lat:"40.75501899999984",
    lon:"-79.65409199999999" },
  { id:"019-21456",
    lat:"40.75330597892385",
    lon:"-79.72367338877379" },
  { id:"019-21456",
    lat:"40.746441598618574",
    lon:"-80.15090704302949" },
  { id:"019-21456",
    lat:"40.75589999999981",
    lon:"-79.66606899999998" },
  { id:"019-21456",
    lat:"40.753552999999826",
    lon:"-79.783327" },
  { id:"019-21456",
    lat:"40.75460299999984",
    lon:"-79.725996" },
  { id:"019-21456",
    lat:"40.75403599999983",
    lon:"-79.789611" },
  { id:"019-21456",
    lat:"40.75439580725704",
    lon:"-79.78058376045023" },
  { id:"019-21456",
    lat:"40.73049549906265",
    lon:"-80.21857253522569" },
  { id:"019-21456",
    lat:"40.745737982482964",
    lon:"-79.50802345763451" },
  { id:"019-21456",
    lat:"40.74262199999983",
    lon:"-79.61079200000002" },
  { id:"019-21456",
    lat:"40.742905999999834",
    lon:"-79.67040600000001" },
  { id:"019-21456",
    lat:"40.72689399999983",
    lon:"-80.459556" },
  { id:"019-21456",
    lat:"40.74353625479733",
    lon:"-79.6466349051701" },
  { id:"019-21456",
    lat:"40.74444999999982",
    lon:"-79.61775600000001" },
  { id:"019-21456",
    lat:"40.68685550831623",
    lon:"-79.68136399668141" },
  { id:"019-21456",
    lat:"40.67283299999983",
    lon:"-80.431639" },
  { id:"019-21456",
    lat:"40.686074514999625",
    lon:"-79.81553160086992" },
  { id:"019-21456",
    lat:"40.25990022249726",
    lon:"-80.47450050335536" },
  { id:"019-21456",
    lat:"40.26099617372863",
    lon:"-80.39078012303351" },
  { id:"019-21456",
    lat:"40.261779528559025",
    lon:"-80.37247322185169" },
  { id:"019-21456",
    lat:"40.277301999999814",
    lon:"-79.646568" },
  { id:"019-21456",
    lat:"40.26282900000318",
    lon:"-80.3880285" },
  { id:"019-21456",
    lat:"40.275676478890915",
    lon:"-79.76506946004727" },
  { id:"019-21456",
    lat:"40.764638999999825",
    lon:"-79.64372800000001" },
  { id:"019-21456",
    lat:"40.748888999999835",
    lon:"-80.51072199999997" },
  { id:"019-21456",
    lat:"40.75745986787939",
    lon:"-80.0459238190215" },
  { id:"019-21456",
    lat:"40.76190299999983",
    lon:"-79.837028" },
  { id:"019-21456",
    lat:"40.75202799999983",
    lon:"-80.495778" },
  { id:"019-21456",
    lat:"40.76494999999983",
    lon:"-79.74374" },
  { id:"019-21456",
    lat:"40.76407599999985",
    lon:"-79.839321" },
  { id:"019-21456",
    lat:"40.77411399999982",
    lon:"-79.568856" },
  { id:"019-21456",
    lat:"40.76278200160343",
    lon:"-80.13360700328263" },
  { id:"019-21456",
    lat:"40.768572999999826",
    lon:"-80.04443000000002" },
  { id:"019-21456",
    lat:"40.768883957095404",
    lon:"-79.97693813020456" },
  { id:"019-21456",
    lat:"40.77543899999983",
    lon:"-79.61414700000002" },
  { id:"019-21456",
    lat:"40.775360999999826",
    lon:"-79.619472" },
  { id:"019-21456",
    lat:"40.768807992885804",
    lon:"-79.85290102686879" },
  { id:"019-21456",
    lat:"40.775377999999826",
    lon:"-79.58686699999998" },
  { id:"019-21456",
    lat:"40.76842899999981",
    lon:"-79.900111" },
  { id:"019-21456",
    lat:"40.77279999999984",
    lon:"-79.72357999999997" },
  { id:"019-21456",
    lat:"40.77037199999984",
    lon:"-79.50999999999999" },
  { id:"019-21456",
    lat:"40.75880544978091",
    lon:"-80.2178739035235" },
  { id:"019-21456",
    lat:"40.76056099917542",
    lon:"-80.0870935315149" },
  { id:"019-21456",
    lat:"40.764315500777336",
    lon:"-79.94585400007871" },
  { id:"019-21456",
    lat:"40.75553899999983",
    lon:"-80.384639" },
  { id:"019-21456",
    lat:"40.772988999999825",
    lon:"-79.50798299999998" },
  { id:"019-21456",
    lat:"40.76018647311367",
    lon:"-80.16710648699464" },
  { id:"019-21456",
    lat:"40.771905999999845",
    lon:"-79.625458" },
  { id:"019-21456",
    lat:"40.77117641806788",
    lon:"-80.10356349809251" },
  { id:"019-21456",
    lat:"40.792263999999825",
    lon:"-78.62044099999999" },
  { id:"019-21456",
    lat:"40.78783599999985",
    lon:"-79.50427500000002" },
  { id:"019-21456",
    lat:"40.786724999999834",
    lon:"-79.552539" },
  { id:"019-21456",
    lat:"40.77497213008849",
    lon:"-80.18473516167835" },
  { id:"019-21456",
    lat:"40.77714999999983",
    lon:"-80.038142" },
  { id:"019-21456",
    lat:"40.78169999999984",
    lon:"-79.788219" },
  { id:"019-21456",
    lat:"40.78418599999984",
    lon:"-79.67322199999998" },
  { id:"019-21456",
    lat:"40.77837350000024",
    lon:"-79.99888750000181" },
  { id:"019-21456",
    lat:"40.78298258540132",
    lon:"-79.75327840714901" },
  { id:"019-21456",
    lat:"40.78611699999983",
    lon:"-79.645578" },
  { id:"019-21456",
    lat:"40.782820999999856",
    lon:"-79.50492" },
  { id:"019-21456",
    lat:"40.773552999999836",
    lon:"-80.08304200000003" },
  { id:"019-21456",
    lat:"40.78140299999983",
    lon:"-79.62093299999998" },
  { id:"019-21456",
    lat:"40.78264999999982",
    lon:"-79.594275" },
  { id:"019-21456",
    lat:"40.776047418081085",
    lon:"-79.72953460556373" },
  { id:"019-21456",
    lat:"40.77792199999982",
    lon:"-79.70615000000001" },
  { id:"019-21456",
    lat:"40.779916999999834",
    lon:"-79.54277499999999" },
  { id:"019-21456",
    lat:"40.77760855139928",
    lon:"-79.69378050138975" },
  { id:"019-21456",
    lat:"40.77879999999983",
    lon:"-79.62659199999997" },
  { id:"019-21456",
    lat:"40.77990799999985",
    lon:"-79.573575" },
  { id:"019-21456",
    lat:"40.78020599999983",
    lon:"-79.561142" },
  { id:"019-21456",
    lat:"40.779827999999846",
    lon:"-79.59886099999999" },
  { id:"019-21456",
    lat:"40.79265599999983",
    lon:"-79.542133" },
  { id:"019-21456",
    lat:"40.780128000145034",
    lon:"-80.2157719980228" },
  { id:"019-21456",
    lat:"40.78977200000541",
    lon:"-79.851408" },
  { id:"019-21456",
    lat:"40.77686099999983",
    lon:"-80.47058300000003" },
  { id:"019-21456",
    lat:"40.80562499999982",
    lon:"-78.939935" },
  { id:"019-21456",
    lat:"40.78709199999984",
    lon:"-80.228503" },
  { id:"019-21456",
    lat:"40.799796999999806",
    lon:"-79.59136099999999" },
  { id:"019-21456",
    lat:"40.796699999999845",
    lon:"-79.719525" },
  { id:"019-21456",
    lat:"40.79970999999983",
    lon:"-79.59780400000001" },
  { id:"019-21456",
    lat:"40.79382499999983",
    lon:"-79.73987500000001" },
  { id:"019-21456",
    lat:"40.789046999999826",
    lon:"-79.99961999999998" },
  { id:"019-21456",
    lat:"40.796899999999816",
    lon:"-79.58933100000002" },
  { id:"019-21456",
    lat:"40.79168199836025",
    lon:"-79.90518349288155" },
  { id:"019-21456",
    lat:"40.79350599999983",
    lon:"-79.82905600000002" },
  { id:"019-21456",
    lat:"40.79708899999982",
    lon:"-79.63380800000002" },
  { id:"019-21456",
    lat:"40.79684700000327",
    lon:"-80.08152799999402" },
  { id:"019-21456",
    lat:"40.78847499999983",
    lon:"-80.46498899999999" },
  { id:"019-21456",
    lat:"40.810710999999834",
    lon:"-79.490994" },
  { id:"019-21456",
    lat:"40.807699999999826",
    lon:"-79.59229700000002" },
  { id:"019-21456",
    lat:"40.804127999999835",
    lon:"-79.550142" },
  { id:"019-21456",
    lat:"40.79777099999984",
    lon:"-79.9049874999992" },
  { id:"019-21456",
    lat:"40.80253099999983",
    lon:"-79.656464" },
  { id:"019-21456",
    lat:"40.80263599999982",
    lon:"-79.66126300000002" },
  { id:"019-21456",
    lat:"40.800435999999884",
    lon:"-79.84360400000085" },
  { id:"019-21456",
    lat:"40.7971555014756",
    lon:"-80.0342109945637" },
  { id:"019-21456",
    lat:"40.792888999999825",
    lon:"-80.50886099999998" },
  { id:"019-21456",
    lat:"40.812617999999816",
    lon:"-79.57503100000001" },
  { id:"019-21456",
    lat:"40.81147499999983",
    lon:"-79.59864200000003" },
  { id:"019-21456",
    lat:"40.80322200000314",
    lon:"-80.0621665" },
  { id:"019-21456",
    lat:"40.800310031107855",
    lon:"-80.09686250158882" },
  { id:"019-21456",
    lat:"40.80876099999985",
    lon:"-79.574847" },
  { id:"019-21456",
    lat:"40.80978299999983",
    lon:"-79.585653" },
  { id:"019-21456",
    lat:"40.80606099999983",
    lon:"-79.876314" },
  { id:"019-21456",
    lat:"40.80316349999996",
    lon:"-80.02989450000165" },
  { id:"019-21456",
    lat:"40.80785199999984",
    lon:"-79.727219" },
  { id:"019-21456",
    lat:"40.808567020988335",
    lon:"-79.70714053808561" },
  { id:"019-21456",
    lat:"40.80962199999982",
    lon:"-79.650211" },
  { id:"019-21456",
    lat:"40.79175550712561",
    lon:"-80.08041803080323" },
  { id:"019-21456",
    lat:"40.79821599999982",
    lon:"-79.767998" },
  { id:"019-21456",
    lat:"40.79619399999983",
    lon:"-79.88194200000001" },
  { id:"019-21456",
    lat:"40.798885999999854",
    lon:"-79.661131" },
  { id:"019-21456",
    lat:"40.79780240004094",
    lon:"-79.73574410480089" },
  { id:"019-21456",
    lat:"40.80025299999982",
    lon:"-79.63895599999998" },
  { id:"019-21456",
    lat:"40.79094872376872",
    lon:"-80.17214699320564" },
  { id:"019-21456",
    lat:"40.794959990599715",
    lon:"-79.9673845062838" },
  { id:"019-21456",
    lat:"40.793409978529006",
    lon:"-80.06393532745759" },
  { id:"019-21456",
    lat:"40.80351699999985",
    lon:"-79.556114" },
  { id:"019-21456",
    lat:"40.78896699999983",
    lon:"-79.549481" },
  { id:"019-21456",
    lat:"40.786438999999824",
    lon:"-79.720008" },
  { id:"019-21456",
    lat:"40.78771099999982",
    lon:"-79.65215" },
  { id:"019-21456",
    lat:"40.78764699999983",
    lon:"-79.59695800000001" },
  { id:"019-21456",
    lat:"40.78030700001005",
    lon:"-80.01810450003627" },
  { id:"019-21456",
    lat:"40.770460999999834",
    lon:"-80.504561" },
  { id:"019-21456",
    lat:"40.77111099999983",
    lon:"-80.49344400000001" },
  { id:"019-21456",
    lat:"40.77158299999983",
    lon:"-80.48147199999998" },
  { id:"019-21456",
    lat:"40.79140999999983",
    lon:"-79.49161100000002" },
  { id:"019-21456",
    lat:"40.790782999999834",
    lon:"-79.53894399999997" },
  { id:"019-21456",
    lat:"40.78964699999984",
    lon:"-79.600097" },
  { id:"019-21456",
    lat:"40.78220659097734",
    lon:"-79.9926009393171" },
  { id:"019-21456",
    lat:"40.78478899999982",
    lon:"-79.86003600000001" },
  { id:"019-21456",
    lat:"40.77873950078124",
    lon:"-80.17051196474942" },
  { id:"019-21456",
    lat:"40.81244750000103",
    lon:"-79.87371950000137" },
  { id:"019-21456",
    lat:"40.829110999999834",
    lon:"-78.63811900000002" },
  { id:"019-21456",
    lat:"40.82285900000008",
    lon:"-79.32749250000295" },
  { id:"019-21456",
    lat:"40.81819999999985",
    lon:"-79.6522" },
  { id:"019-21456",
    lat:"40.82450073643095",
    lon:"-79.44722388999968" },
  { id:"019-21456",
    lat:"40.82443799999983",
    lon:"-79.45375000000001" },
  { id:"019-21456",
    lat:"40.825097334603576",
    lon:"-79.47554980629344" },
  { id:"019-21456",
    lat:"40.816421999999825",
    lon:"-80.129603" },
  { id:"019-21456",
    lat:"40.84011899999983",
    lon:"-78.479486" },
  { id:"019-21456",
    lat:"40.8225125000007",
    lon:"-80.10657500000397" },
  { id:"019-21456",
    lat:"40.82585150000002",
    lon:"-79.69061250000203" },
  { id:"019-21456",
    lat:"40.823305500010605",
    lon:"-79.8484624999958" },
  { id:"019-21456",
    lat:"40.820323509378746",
    lon:"-80.0082834666502" },
  { id:"019-21456",
    lat:"40.82159450000176",
    lon:"-79.96338200000972" },
  { id:"019-21456",
    lat:"40.82225699893",
    lon:"-79.94011149501229" },
  { id:"019-21456",
    lat:"40.82763299999982",
    lon:"-79.65016099999998" },
  { id:"019-21456",
    lat:"40.82734299999982",
    lon:"-79.66579199999998" },
  { id:"019-21456",
    lat:"40.825394500001266",
    lon:"-79.82982600000068" },
  { id:"019-21456",
    lat:"40.82631949999983",
    lon:"-80.04933299999999" },
  { id:"019-21456",
    lat:"40.85031687798824",
    lon:"-78.66001574565722" },
  { id:"019-21456",
    lat:"40.83186599999983",
    lon:"-80.038332" },
  { id:"019-21456",
    lat:"40.83769299999984",
    lon:"-79.687643" },
  { id:"019-21456",
    lat:"40.83806799999983",
    lon:"-79.68172599999998" },
  { id:"019-21456",
    lat:"40.83389399999982",
    lon:"-79.640439" },
  { id:"019-21456",
    lat:"40.82994942776485",
    lon:"-79.88845169333287" },
  { id:"019-21456",
    lat:"40.83398799999984",
    lon:"-79.673209" },
  { id:"019-21456",
    lat:"40.83395499999983",
    lon:"-79.683859" },
  { id:"019-21456",
    lat:"40.83104855057798",
    lon:"-79.84848448769723" },
  { id:"019-21456",
    lat:"40.83331099999984",
    lon:"-79.72813099999999" },
  { id:"019-21456",
    lat:"40.83136099999983",
    lon:"-79.60354199999999" },
  { id:"019-21456",
    lat:"40.82363299999984",
    lon:"-80.045522" },
  { id:"019-21456",
    lat:"40.82942099999983",
    lon:"-79.673912" },
  { id:"019-21456",
    lat:"40.830970501173866",
    lon:"-79.67233950544394" },
  { id:"019-21456",
    lat:"40.834553955015735",
    lon:"-79.47480841465475" },
  { id:"019-21456",
    lat:"40.83170199999982",
    lon:"-79.688409" },
  { id:"019-21456",
    lat:"40.81593050000069",
    lon:"-80.04595799999711" },
  { id:"019-21456",
    lat:"40.820005499999844",
    lon:"-79.90020699999982" },
  { id:"019-21456",
    lat:"40.822293999999836",
    lon:"-79.68044499999999" },
  { id:"019-21456",
    lat:"40.82324399999982",
    lon:"-79.638861" },
  { id:"019-21456",
    lat:"40.82277101655806",
    lon:"-79.7524639932747" },
  { id:"019-21456",
    lat:"40.82453859264389",
    lon:"-79.71186156694196" },
  { id:"019-21456",
    lat:"40.834181999999856",
    lon:"-80.08895449999952" },
  { id:"019-21456",
    lat:"40.8365859991288",
    lon:"-80.08180154261284" },
  { id:"019-21456",
    lat:"40.85322500041323",
    lon:"-79.0330040002704" },
  { id:"019-21456",
    lat:"40.84081399999984",
    lon:"-79.789553" },
  { id:"019-21456",
    lat:"40.8369804383747",
    lon:"-79.95030464213818" },
  { id:"019-21456",
    lat:"40.84716399999983",
    lon:"-79.612275" },
  { id:"019-21456",
    lat:"40.84796699999983",
    lon:"-79.62056700000001" },
  { id:"019-21456",
    lat:"40.84077505411145",
    lon:"-79.84872500193572" },
  { id:"019-21456",
    lat:"40.84035952832416",
    lon:"-79.94361100104965" },
  { id:"019-21456",
    lat:"40.83865399999993",
    lon:"-80.05494849999897" },
  { id:"019-21456",
    lat:"40.84309307810775",
    lon:"-79.83131496864014" },
  { id:"019-21456",
    lat:"40.86487199999982",
    lon:"-78.42688899999999" },
  { id:"019-21456",
    lat:"40.860835999999836",
    lon:"-79.078464" },
  { id:"019-21456",
    lat:"40.846578000001266",
    lon:"-79.93511499999998" },
  { id:"019-21456",
    lat:"40.837138999999844",
    lon:"-80.46852800000002" },
  { id:"019-21456",
    lat:"40.85872599999984",
    lon:"-79.50425000000001" },
  { id:"019-21456",
    lat:"40.8480735000029",
    lon:"-80.1137345000006" },
  { id:"019-21456",
    lat:"40.84646650001284",
    lon:"-80.03221250000458" },
  { id:"019-21456",
    lat:"40.855057999999836",
    lon:"-79.554928" },
  { id:"019-21456",
    lat:"40.85454699999982",
    lon:"-79.60313100000002" },
  { id:"019-21456",
    lat:"40.85171356711519",
    lon:"-79.82361135637431" },
  { id:"019-21456",
    lat:"40.84924450000956",
    lon:"-79.61374999997038" },
  { id:"019-21456",
    lat:"40.84175150000279",
    lon:"-80.05351800000061" },
  { id:"019-21456",
    lat:"40.84162095188877",
    lon:"-80.06893347853448" },
  { id:"019-21456",
    lat:"40.85129453085191",
    lon:"-79.54439301506685" },
  { id:"019-21456",
    lat:"40.842665423399296",
    lon:"-80.03391649472132" },
  { id:"019-21456",
    lat:"40.85198750047188",
    lon:"-79.55824446726338" },
  { id:"019-21456",
    lat:"40.84756899999984",
    lon:"-79.83717800000001" },
  { id:"019-21456",
    lat:"40.863203999999826",
    lon:"-79.49851999999998" },
  { id:"019-21456",
    lat:"40.86033899999983",
    lon:"-79.72121100000001" },
  { id:"019-21456",
    lat:"40.86303499999984",
    lon:"-79.53821800000001" },
  { id:"019-21456",
    lat:"40.86710099999983",
    lon:"-79.548496" },
  { id:"019-21456",
    lat:"40.85879999847265",
    lon:"-79.99678199989019" },
  { id:"019-21456",
    lat:"40.864501999999845",
    lon:"-79.707546" },
  { id:"019-21456",
    lat:"40.85863749999982",
    lon:"-80.14797949999955" },
  { id:"019-21456",
    lat:"40.87134999999982",
    lon:"-79.452719" },
  { id:"019-21456",
    lat:"40.87107499999983",
    lon:"-79.504658" },
  { id:"019-21456",
    lat:"40.87109399999982",
    lon:"-79.516972" },
  { id:"019-21456",
    lat:"40.859044500001225",
    lon:"-80.09889900001058" },
  { id:"019-21456",
    lat:"40.869221000025505",
    lon:"-79.56593050006329" },
  { id:"019-21456",
    lat:"40.86562948687068",
    lon:"-79.78393354777806" },
  { id:"019-21456",
    lat:"40.87056799999984",
    lon:"-79.563194" },
  { id:"019-21456",
    lat:"40.85288599999983",
    lon:"-80.14630000000001" },
  { id:"019-21456",
    lat:"40.85604081485703",
    lon:"-80.02122998857536" },
  { id:"019-21456",
    lat:"40.855537499999855",
    lon:"-80.08243749999954" },
  { id:"019-21456",
    lat:"40.86518899999982",
    lon:"-79.604103" },
  { id:"019-21456",
    lat:"40.86239099999985",
    lon:"-79.77289799999998" },
  { id:"019-21456",
    lat:"40.85971379264138",
    lon:"-79.584078544093" },
  { id:"019-21456",
    lat:"40.85950099999985",
    lon:"-79.55462200000001" },
  { id:"019-21456",
    lat:"40.86109199999986",
    lon:"-79.593592" },
  { id:"019-21456",
    lat:"40.860644211380595",
    lon:"-79.53930377928833" },
  { id:"019-21456",
    lat:"40.84073099999982",
    lon:"-79.62213900000002" },
  { id:"019-21456",
    lat:"40.843032917836",
    lon:"-79.47306367868816" },
  { id:"019-21456",
    lat:"40.83666800001218",
    lon:"-79.8844430000008" },
  { id:"019-21456",
    lat:"40.83566454197692",
    lon:"-79.99782843239733" },
  { id:"019-21456",
    lat:"40.81273299999982",
    lon:"-79.65157800000001" },
  { id:"019-21456",
    lat:"40.80248599999984",
    lon:"-80.215917" },
  { id:"019-21456",
    lat:"40.8024722251758",
    lon:"-80.21260627347708" },
  { id:"019-21456",
    lat:"40.807422000000365",
    lon:"-79.94832500000184" },
  { id:"019-21456",
    lat:"40.806299999999815",
    lon:"-80.044013" },
  { id:"019-21456",
    lat:"40.80484699999984",
    lon:"-80.049338" },
  { id:"019-21456",
    lat:"40.808379001474975",
    lon:"-79.97853150685215" },
  { id:"019-21456",
    lat:"40.81557799999984",
    lon:"-79.58642800000001" },
  { id:"019-21456",
    lat:"40.81115799999983",
    lon:"-79.791725" },
  { id:"019-21456",
    lat:"40.81322479576504",
    lon:"-79.72481404843022" },
  { id:"019-21456",
    lat:"40.877685999999834",
    lon:"-79.516817" },
  { id:"019-21456",
    lat:"40.87762599999982",
    lon:"-79.52114300000002" },
  { id:"019-21456",
    lat:"40.86820299999983",
    lon:"-80.137522" },
  { id:"019-21456",
    lat:"40.88488899999984",
    lon:"-79.18355" },
  { id:"019-21456",
    lat:"40.87416094645696",
    lon:"-79.76104599815261" },
  { id:"019-21456",
    lat:"40.87595899999983",
    lon:"-79.513248" },
  { id:"019-21456",
    lat:"40.87511950000604",
    lon:"-80.12607349998251" },
  { id:"019-21456",
    lat:"40.87724050000002",
    lon:"-80.03486249999769" },
  { id:"019-21456",
    lat:"40.874760999445655",
    lon:"-80.01395550108415" },
  { id:"019-21456",
    lat:"40.88294699999983",
    lon:"-79.555619" },
  { id:"019-21456",
    lat:"40.885841999999826",
    lon:"-79.421103" },
  { id:"019-21456",
    lat:"40.88048099999984",
    lon:"-79.97813249999989" },
  { id:"019-21456",
    lat:"40.88904699999983",
    lon:"-79.47442500000001" },
  { id:"019-21456",
    lat:"40.88257650045846",
    lon:"-79.74967097926897" },
  { id:"019-21456",
    lat:"40.888821999999834",
    lon:"-79.421797" },
  { id:"019-21456",
    lat:"40.887941999999825",
    lon:"-79.45149199999999" },
  { id:"019-21456",
    lat:"40.88343499999987",
    lon:"-79.72569100000003" },
  { id:"019-21456",
    lat:"40.88846899999983",
    lon:"-79.50248600000002" },
  { id:"019-21456",
    lat:"40.87189700000291",
    lon:"-80.04858750000001" },
  { id:"019-21456",
    lat:"40.880338999999815",
    lon:"-79.59528600000002" },
  { id:"019-21456",
    lat:"40.885988999999825",
    lon:"-79.269467" },
  { id:"019-21456",
    lat:"40.87242650000177",
    lon:"-80.081242999996" },
  { id:"019-21456",
    lat:"40.89172899999983",
    lon:"-79.511573" },
  { id:"019-21456",
    lat:"40.889724999999835",
    lon:"-79.65792499999999" },
  { id:"019-21456",
    lat:"40.889941999999834",
    lon:"-79.645017" },
  { id:"019-21456",
    lat:"40.879898499999875",
    lon:"-80.18132500000094" },
  { id:"019-21456",
    lat:"40.88701800000039",
    lon:"-80.09916699999697" },
  { id:"019-21456",
    lat:"40.89672799999983",
    lon:"-79.53923600000002" },
  { id:"019-21456",
    lat:"40.8851515000333",
    lon:"-80.0083539999979" },
  { id:"019-21456",
    lat:"40.89075699999982",
    lon:"-79.792232" },
  { id:"019-21456",
    lat:"40.89886399999984",
    lon:"-79.645594" },
  { id:"019-21456",
    lat:"40.89168499999997",
    lon:"-80.07173649999824" },
  { id:"019-21456",
    lat:"40.904593999999825",
    lon:"-79.4523" },
  { id:"019-21456",
    lat:"40.902744499999834",
    lon:"-79.76451250000031" },
  { id:"019-21456",
    lat:"40.89837349970173",
    lon:"-79.77920149394251" },
  { id:"019-21456",
    lat:"40.89519699999984",
    lon:"-79.97121700000001" },
  { id:"019-21456",
    lat:"40.894710026422615",
    lon:"-80.05261650578029" },
  { id:"019-21456",
    lat:"40.904618999999826",
    lon:"-79.498269" },
  { id:"019-21456",
    lat:"40.89792499999983",
    lon:"-79.53135299999998" },
  { id:"019-21456",
    lat:"40.89710999999984",
    lon:"-79.655815" },
  { id:"019-21456",
    lat:"40.88153499999982",
    lon:"-79.98012399999999" },
  { id:"019-21456",
    lat:"40.888621999999835",
    lon:"-79.539222" },
  { id:"019-21456",
    lat:"40.89211099999984",
    lon:"-79.418181" },
  { id:"019-21456",
    lat:"40.889746999999836",
    lon:"-79.61363100000003" },
  { id:"019-21456",
    lat:"40.89032499999983",
    lon:"-79.55772199999998" },
  { id:"019-21456",
    lat:"40.87283749993434",
    lon:"-79.57974300515237" },
  { id:"019-21456",
    lat:"40.87504299999983",
    lon:"-79.44671000000002" },
  { id:"019-21456",
    lat:"40.87377900329105",
    lon:"-79.53609436882252" },
  { id:"019-21456",
    lat:"40.90919999999983",
    lon:"-79.48654700000002" },
  { id:"019-21456",
    lat:"40.892969192986605",
    lon:"-80.41146396251429" },
  { id:"019-21456",
    lat:"40.913755999999836",
    lon:"-79.36879400000001" },
  { id:"019-21456",
    lat:"40.91397355154616",
    lon:"-79.37329450062293" },
  { id:"019-21456",
    lat:"40.912090500001256",
    lon:"-79.47819000000642" },
  { id:"019-21456",
    lat:"40.90069300000124",
    lon:"-80.13830700001101" },
  { id:"019-21456",
    lat:"40.904105474482016",
    lon:"-79.95842747466838" },
  { id:"019-21456",
    lat:"40.91519699999983",
    lon:"-79.48626700000001" },
  { id:"019-21456",
    lat:"40.91302600001192",
    lon:"-79.74834149999442" },
  { id:"019-21456",
    lat:"40.91823599999984",
    lon:"-79.579797" },
  { id:"019-21456",
    lat:"40.914439000005395",
    lon:"-80.01540299999834" },
  { id:"019-21456",
    lat:"40.91602346725438",
    lon:"-79.82344046991336" },
  { id:"019-21456",
    lat:"40.92159199999983",
    lon:"-79.58620300000001" },
  { id:"019-21456",
    lat:"40.94566699999982",
    lon:"-78.193408" },
  { id:"019-21456",
    lat:"40.920721999999834",
    lon:"-80.190058" },
  { id:"019-21456",
    lat:"40.92696949999984",
    lon:"-79.74854700000002" },
  { id:"019-21456",
    lat:"40.928809999999864",
    lon:"-79.661121" },
  { id:"019-21456",
    lat:"40.94790701030721",
    lon:"-78.4648305936008" },
  { id:"019-21456",
    lat:"40.93465899999984",
    lon:"-79.60198699999998" },
  { id:"019-21456",
    lat:"40.933546999999834",
    lon:"-79.73733900000002" },
  { id:"019-21456",
    lat:"40.94138099999983",
    lon:"-79.36243899999998" },
  { id:"019-21456",
    lat:"40.92914399999984",
    lon:"-80.15242200000002" },
  { id:"019-21456",
    lat:"40.929347342886174",
    lon:"-79.80002753922003" },
  { id:"019-21456",
    lat:"40.927279079948555",
    lon:"-79.96164458200941" },
  { id:"019-21456",
    lat:"40.919798499999835",
    lon:"-79.85311249999954" },
  { id:"019-21456",
    lat:"40.92560799999982",
    lon:"-79.544933" },
  { id:"019-21456",
    lat:"40.92620799999984",
    lon:"-79.528344" },
  { id:"019-21456",
    lat:"40.916956988063795",
    lon:"-80.11475654650444" },
  { id:"019-21456",
    lat:"40.918165500000164",
    lon:"-80.00200549999838" },
  { id:"019-21456",
    lat:"40.94668899829962",
    lon:"-79.78107808506628" },
  { id:"019-21456",
    lat:"40.95006699999983",
    lon:"-79.429158" },
  { id:"019-21456",
    lat:"40.95317499999983",
    lon:"-79.292819" },
  { id:"019-21456",
    lat:"40.947696012723135",
    lon:"-79.87117101409535" },
  { id:"019-21456",
    lat:"40.948978001331376",
    lon:"-79.93583592381859" },
  { id:"019-21456",
    lat:"40.954723500000654",
    lon:"-79.87188050000829" },
  { id:"019-21456",
    lat:"40.95184491907238",
    lon:"-79.90579336692917" },
  { id:"019-21456",
    lat:"40.97439700000476",
    lon:"-78.8481525000056" },
  { id:"019-21456",
    lat:"40.9458212044612",
    lon:"-80.47190122916265" },
  { id:"019-21456",
    lat:"40.96298530849208",
    lon:"-79.84920926484459" },
  { id:"019-21456",
    lat:"40.96367499999984",
    lon:"-79.96512000000001" },
  { id:"019-21456",
    lat:"40.977316999999836",
    lon:"-79.165158" },
  { id:"019-21456",
    lat:"40.967840000002916",
    lon:"-79.86110949999718" },
  { id:"019-21456",
    lat:"40.97818299999983",
    lon:"-79.406622" },
  { id:"019-21456",
    lat:"40.976707000026835",
    lon:"-79.89285550000484" },
  { id:"019-21456",
    lat:"40.981676500002905",
    lon:"-79.87022349999938" },
  { id:"019-21456",
    lat:"40.99733299999983",
    lon:"-78.859911" },
  { id:"019-21456",
    lat:"41.00069199999984",
    lon:"-78.857186" },
  { id:"019-21456",
    lat:"41.00662099999984",
    lon:"-77.96078000000001" },
  { id:"019-21456",
    lat:"40.99970100008984",
    lon:"-79.4479784999175" },
  { id:"019-21456",
    lat:"41.00363899999983",
    lon:"-79.26230800000002" },
  { id:"019-21456",
    lat:"40.95597354313905",
    lon:"-79.84838351083799" },
  { id:"019-21456",
    lat:"40.96428599999985",
    lon:"-79.413413" },
  { id:"019-21456",
    lat:"40.93994001234068",
    lon:"-79.86918045600525" },
  { id:"019-21456",
    lat:"40.94332100000052",
    lon:"-79.71477349999812" },
  { id:"019-21456",
    lat:"40.95575132764964",
    lon:"-78.85731066061575" },
  { id:"019-21456",
    lat:"40.98702799999983",
    lon:"-80.44975799999997" },
  { id:"019-21456",
    lat:"41.02042500594742",
    lon:"-78.05666502418111" },
  { id:"019-21456",
    lat:"41.003373500568294",
    lon:"-79.86885847268472" },
  { id:"019-21456",
    lat:"40.991117939216245",
    lon:"-80.43250960036708" },
  { id:"019-21456",
    lat:"41.029480999999805",
    lon:"-78.053911" },
  { id:"019-21456",
    lat:"41.026385500001105",
    lon:"-78.81710500000116" },
  { id:"019-21456",
    lat:"41.0183960448264",
    lon:"-79.84794294297636" },
  { id:"019-21456",
    lat:"41.01973099999983",
    lon:"-78.761284" },
  { id:"019-21456",
    lat:"41.03911099999984",
    lon:"-78.06325000000001" },
  { id:"019-21456",
    lat:"41.04180450007119",
    lon:"-77.86626949984976" },
  { id:"019-21456",
    lat:"41.032433000001284",
    lon:"-79.45410400001072" },
  { id:"019-21456",
    lat:"41.040577517608746",
    lon:"-78.99179853419942" },
  { id:"019-21456",
    lat:"41.05058599999984",
    lon:"-77.90847499999998" },
  { id:"019-21456",
    lat:"41.042499999999826",
    lon:"-78.08422199999998" },
  { id:"019-21456",
    lat:"41.043610999999835",
    lon:"-78.07713899999999" },
  { id:"019-21456",
    lat:"41.03794399999985",
    lon:"-78.06713899999998" },
  { id:"019-21456",
    lat:"41.04303300001859",
    lon:"-79.45551250002498" },
  { id:"019-21456",
    lat:"41.05974199999986",
    lon:"-77.82672799999999" },
  { id:"019-21456",
    lat:"41.04860300000599",
    lon:"-79.23395949999829" },
  { id:"019-21456",
    lat:"41.029438999999854",
    lon:"-80.447033" },
  { id:"019-21456",
    lat:"41.05102799999986",
    lon:"-79.44048299999999" },
  { id:"019-21456",
    lat:"41.048718999999835",
    lon:"-79.36850599999998" },
  { id:"019-21456",
    lat:"41.074603041907324",
    lon:"-77.80120858103132" },
  { id:"019-21456",
    lat:"41.07391550574665",
    lon:"-77.98093842745487" },
  { id:"019-21456",
    lat:"41.04883148263043",
    lon:"-80.4751459215148" },
  { id:"019-21456",
    lat:"41.05375697451546",
    lon:"-80.39455297056435" },
  { id:"019-21456",
    lat:"41.07151550000551",
    lon:"-79.19436399999918" },
  { id:"019-21456",
    lat:"41.066270776770416",
    lon:"-77.90433185411173" },
  { id:"019-21456",
    lat:"41.05140999999985",
    lon:"-79.60580000000002" },
  { id:"019-21456",
    lat:"41.05354687849551",
    lon:"-80.49639857461983" },
  { id:"019-21456",
    lat:"41.07887499999984",
    lon:"-79.377286" },
  { id:"019-21456",
    lat:"41.09237631846657",
    lon:"-77.95552078696592" },
  { id:"019-21456",
    lat:"41.06233719191254",
    lon:"-80.5108301472779" },
  { id:"019-21456",
    lat:"41.0872040000009",
    lon:"-79.49753749999574" },
  { id:"019-21456",
    lat:"41.07813299999966",
    lon:"-79.65209999999698" },
  { id:"019-21456",
    lat:"41.08374199999983",
    lon:"-79.064272" },
  { id:"019-21456",
    lat:"41.09114500000126",
    lon:"-77.96934999999695" },
  { id:"019-21456",
    lat:"41.10622499999984",
    lon:"-77.77255600000001" },
  { id:"019-21456",
    lat:"41.075200000004955",
    lon:"-80.4214414999647" },
  { id:"019-21456",
    lat:"41.074705999999836",
    lon:"-80.40718100000001" },
  { id:"019-21456",
    lat:"41.09110300000151",
    lon:"-79.63913350000415" },
  { id:"019-21456",
    lat:"41.10524199999984",
    lon:"-78.38758099999998" },
  { id:"019-21456",
    lat:"41.089911300199816",
    lon:"-79.80196452014049" },
  { id:"019-21456",
    lat:"41.077285990757794",
    lon:"-80.43728453240348" },
  { id:"019-21456",
    lat:"41.0930283260013",
    lon:"-79.75547125717509" },
  { id:"019-21456",
    lat:"41.10413899999984",
    lon:"-78.97207100000001" },
  { id:"019-21456",
    lat:"41.07883750002611",
    lon:"-80.44373349997812" },
  { id:"019-21456",
    lat:"41.08442400000121",
    lon:"-78.01976549999358" },
  { id:"019-21456",
    lat:"41.086879003226294",
    lon:"-80.42567354028778" },
  { id:"019-21456",
    lat:"41.121049999999826",
    lon:"-77.966594" },
  { id:"019-21456",
    lat:"41.1217209125604",
    lon:"-78.42606098611758" },
  { id:"019-21456",
    lat:"41.12126799999985",
    lon:"-78.342497" },
  { id:"019-21456",
    lat:"41.11878999999985",
    lon:"-78.060441" },
  { id:"019-21456",
    lat:"41.117324996928886",
    lon:"-78.43295551257582" },
  { id:"019-21456",
    lat:"41.125070999999856",
    lon:"-78.48523300000002" },
  { id:"019-21456",
    lat:"41.12113099999985",
    lon:"-78.967469" },
  { id:"019-21456",
    lat:"41.12680500000991",
    lon:"-78.35301799998533" },
  { id:"019-21456",
    lat:"41.09986400000443",
    lon:"-80.41378350003761" },
  { id:"019-21456",
    lat:"41.13093399999985",
    lon:"-78.04724" },
  { id:"019-21456",
    lat:"41.133441271638375",
    lon:"-78.47351314430642" },
  { id:"019-21456",
    lat:"41.12822100000141",
    lon:"-78.47484200001759" },
  { id:"019-21456",
    lat:"41.128935995865525",
    lon:"-78.45204151568413" },
  { id:"019-21456",
    lat:"41.136012509322015",
    lon:"-78.44462051714763" },
  { id:"019-21456",
    lat:"41.12514851088001",
    lon:"-79.7479209643075" },
  { id:"019-21456",
    lat:"41.14404624842565",
    lon:"-78.4747775632169" },
  { id:"019-21456",
    lat:"41.11634998218127",
    lon:"-80.47730952576667" },
  { id:"019-21456",
    lat:"41.124892849725235",
    lon:"-79.64777665779962" },
  { id:"019-21456",
    lat:"41.12735449932219",
    lon:"-79.59170149636495" },
  { id:"019-21456",
    lat:"41.125839990160024",
    lon:"-80.4549570260944" },
  { id:"019-21456",
    lat:"41.158191999999836",
    lon:"-78.45367799999998" },
  { id:"019-21456",
    lat:"41.159106500000746",
    lon:"-78.46933850001328" },
  { id:"019-21456",
    lat:"41.155307000006616",
    lon:"-78.4737180000364" },
  { id:"019-21456",
    lat:"41.150354000012825",
    lon:"-79.2158349998016" },
  { id:"019-21456",
    lat:"41.16238250000445",
    lon:"-78.31405950000175" },
  { id:"019-21456",
    lat:"41.16200399999985",
    lon:"-78.32859800000001" },
  { id:"019-21456",
    lat:"41.133169467182",
    lon:"-80.48774700101855" },
  { id:"019-21456",
    lat:"41.15948301988707",
    lon:"-78.47208917169199" },
  { id:"019-21456",
    lat:"41.16125950000217",
    lon:"-78.4658565000191" },
  { id:"019-21456",
    lat:"41.17009299999984",
    lon:"-78.449767" },
  { id:"019-21456",
    lat:"41.1414473843254",
    lon:"-80.43728167057638" },
  { id:"019-21456",
    lat:"41.168286999999836",
    lon:"-78.453073" },
  { id:"019-21456",
    lat:"41.16746399999983",
    lon:"-79.23521000000001" },
  { id:"019-21456",
    lat:"41.17509100003438",
    lon:"-78.44026099999726" },
  { id:"019-21456",
    lat:"41.17536399999985",
    lon:"-78.428853" },
  { id:"019-21456",
    lat:"41.175374999999846",
    lon:"-78.436544" },
  { id:"019-21456",
    lat:"41.17556899999986",
    lon:"-78.43248299999999" },
  { id:"019-21456",
    lat:"41.17164799999983",
    lon:"-78.447156" },
  { id:"019-21456",
    lat:"41.17309299999985",
    lon:"-78.443461" },
  { id:"019-21456",
    lat:"41.15786800000043",
    lon:"-79.74654450000264" },
  { id:"019-21456",
    lat:"41.1736790768595",
    lon:"-78.57265442652427" },
  { id:"019-21456",
    lat:"41.16710599999985",
    lon:"-79.21414499999999" },
  { id:"019-21456",
    lat:"41.14895125856056",
    lon:"-79.72466808497768" },
  { id:"019-21456",
    lat:"41.16226196599818",
    lon:"-78.46312187799535" },
  { id:"019-21456",
    lat:"41.16267900000583",
    lon:"-78.45322150006372" },
  { id:"019-21456",
    lat:"41.16378699999984",
    lon:"-78.46023999999998" },
  { id:"019-21456",
    lat:"41.14983200002546",
    lon:"-78.47430549996376" },
  { id:"019-21456",
    lat:"41.14201399999985",
    lon:"-79.23244899999999" },
  { id:"019-21456",
    lat:"41.12030395071658",
    lon:"-80.46346101368755" },
  { id:"019-21456",
    lat:"41.146427500033234",
    lon:"-78.93258150004094" },
  { id:"019-21456",
    lat:"41.17208999999985",
    lon:"-79.24722000000001" },
  { id:"019-21456",
    lat:"41.175380999999845",
    lon:"-78.97622199999998" },
  { id:"019-21456",
    lat:"41.19283199999984",
    lon:"-77.59172800000002" },
  { id:"019-21456",
    lat:"41.19806599999983",
    lon:"-77.68818100000001" },
  { id:"019-21456",
    lat:"41.19488397380958",
    lon:"-78.78451943621683" },
  { id:"019-21456",
    lat:"41.19505184385376",
    lon:"-77.6877019587343" },
  { id:"019-21456",
    lat:"41.196703000001044",
    lon:"-77.68300850000176" },
  { id:"019-21456",
    lat:"41.19969399999984",
    lon:"-76.632069" },
  { id:"019-21456",
    lat:"41.17757050000243",
    lon:"-80.27393199998625" },
  { id:"019-21456",
    lat:"41.20132999999985",
    lon:"-79.214501" },
  { id:"019-21456",
    lat:"41.205602999999854",
    lon:"-76.642556" },
  { id:"019-21456",
    lat:"41.21090403938238",
    lon:"-76.62260948264003" },
  { id:"019-21456",
    lat:"41.215209994236005",
    lon:"-78.81272187571068" },
  { id:"019-21456",
    lat:"41.215278999999846",
    lon:"-78.71164" },
  { id:"019-21456",
    lat:"41.19537499999984",
    lon:"-79.21306999999997" },
  { id:"019-21456",
    lat:"41.19314872413403",
    lon:"-80.33217052731493" },
  { id:"019-21456",
    lat:"41.22154100001251",
    lon:"-76.62966750005704" },
  { id:"019-21456",
    lat:"41.22831899999985",
    lon:"-78.72297199999997" },
  { id:"019-21456",
    lat:"41.230568785834414",
    lon:"-77.46764427825251" },
  { id:"019-21456",
    lat:"41.22155005743804",
    lon:"-78.68848571238631" },
  { id:"019-21456",
    lat:"41.23399999999984",
    lon:"-77.33386000000002" },
  { id:"019-21456",
    lat:"41.2338975000069",
    lon:"-76.63369599998144" },
  { id:"019-21456",
    lat:"41.23406399999984",
    lon:"-76.658758" },
  { id:"019-21456",
    lat:"41.234179503863956",
    lon:"-76.64406548314626" },
  { id:"019-21456",
    lat:"41.2377245000029",
    lon:"-77.37964849999221" },
  { id:"019-21456",
    lat:"41.23940958903601",
    lon:"-77.45347767204886" },
  { id:"019-21456",
    lat:"41.232200000012774",
    lon:"-77.46589850000002" },
  { id:"019-21456",
    lat:"41.233081000000325",
    lon:"-77.7576955000057" },
  { id:"019-21456",
    lat:"41.2222265238581",
    lon:"-77.70774152210414" },
  { id:"019-21456",
    lat:"41.21822500000269",
    lon:"-78.7939139999831" },
  { id:"019-21456",
    lat:"41.23779162752859",
    lon:"-76.6005218029942" },
  { id:"019-21456",
    lat:"41.243860999999846",
    lon:"-77.95682800000002" },
  { id:"019-21456",
    lat:"41.239482999999844",
    lon:"-76.67199699999999" },
  { id:"019-21456",
    lat:"41.23957799377274",
    lon:"-76.63861702564209" },
  { id:"019-21456",
    lat:"41.24665599999984",
    lon:"-77.474664" },
  { id:"019-21456",
    lat:"41.24231250000006",
    lon:"-76.54373500000135" },
  { id:"019-21456",
    lat:"41.24733250000095",
    lon:"-76.64938149999398" },
  { id:"019-21456",
    lat:"41.249802999999844",
    lon:"-76.500594" },
  { id:"019-21456",
    lat:"41.232699053229204",
    lon:"-80.33778134608335" },
  { id:"019-21456",
    lat:"41.25956371139968",
    lon:"-76.577746971371" },
  { id:"019-21456",
    lat:"41.25946899999985",
    lon:"-76.565942" },
  { id:"019-21456",
    lat:"41.25511950000419",
    lon:"-76.64486249998141" },
  { id:"019-21456",
    lat:"41.25547650006319",
    lon:"-76.60438850345693" },
  { id:"019-21456",
    lat:"41.250279870220076",
    lon:"-76.63056083387573" },
  { id:"019-21456",
    lat:"41.26208451106789",
    lon:"-76.61889300524498" },
  { id:"019-21456",
    lat:"41.26893850002378",
    lon:"-77.29795700003432" },
  { id:"019-21456",
    lat:"41.26479630626806",
    lon:"-76.62787447833581" },
  { id:"019-21456",
    lat:"41.26718750000314",
    lon:"-78.91819149999937" },
  { id:"019-21456",
    lat:"41.270562500026024",
    lon:"-77.27888050001474" },
  { id:"019-21456",
    lat:"41.26599399712095",
    lon:"-77.35602249742229" },
  { id:"019-21456",
    lat:"41.081754003096506",
    lon:"-80.48407501434767" },
  { id:"019-21456",
    lat:"41.11309200000397",
    lon:"-78.40672149998369" },
  { id:"019-21456",
    lat:"41.114007907428",
    lon:"-78.46993440323011" },
  { id:"019-21456",
    lat:"41.27407300000525",
    lon:"-76.56568200001125" },
  { id:"019-21456",
    lat:"41.252693000000285",
    lon:"-80.26574449999687" },
  { id:"019-21456",
    lat:"41.27568926723271",
    lon:"-76.65017980192894" },
  { id:"019-21456",
    lat:"41.28123099991003",
    lon:"-76.63117077790659" },
  { id:"019-21456",
    lat:"41.2579110000029",
    lon:"-80.3659205" },
  { id:"019-21456",
    lat:"41.28377051786498",
    lon:"-76.58979748182107" },
  { id:"019-21456",
    lat:"41.29272859101271",
    lon:"-77.38918393707752" },
  { id:"019-21456",
    lat:"41.287758544938185",
    lon:"-77.30249699861639" },
  { id:"019-21456",
    lat:"41.28586061649386",
    lon:"-76.91195551034107" },
  { id:"019-21456",
    lat:"41.288128588082195",
    lon:"-77.31161466551579" },
  { id:"019-21456",
    lat:"41.28382616650721",
    lon:"-77.53300715568903" },
  { id:"019-21456",
    lat:"41.28215749414083",
    lon:"-77.25217324457094" },
  { id:"019-21456",
    lat:"41.282637490716496",
    lon:"-77.39435545782072" },
  { id:"019-21456",
    lat:"41.28122470773041",
    lon:"-78.62046300831983" },
  { id:"019-21456",
    lat:"41.28410802691955",
    lon:"-77.71246105387382" },
  { id:"019-21456",
    lat:"41.28464299133498",
    lon:"-77.35208199190846" },
  { id:"019-21456",
    lat:"41.29322199999984",
    lon:"-76.625583" },
  { id:"019-21456",
    lat:"41.285857000061654",
    lon:"-79.48800900004728" },
  { id:"019-21456",
    lat:"41.29502899999986",
    lon:"-78.91387900000001" },
  { id:"019-21456",
    lat:"41.300528634840745",
    lon:"-77.32545781516994" },
  { id:"019-21456",
    lat:"41.29845105348384",
    lon:"-76.60633597608283" },
  { id:"019-21456",
    lat:"41.306016500010735",
    lon:"-77.20218099998726" },
  { id:"019-21456",
    lat:"41.30519575827303",
    lon:"-77.29559521357908" },
  { id:"019-21456",
    lat:"41.31010316323915",
    lon:"-77.42525894898836" },
  { id:"019-21456",
    lat:"41.31037650000349",
    lon:"-76.911879000002" },
  { id:"019-21456",
    lat:"41.31244677546396",
    lon:"-76.88926796665815" },
  { id:"019-21456",
    lat:"41.28800197635828",
    lon:"-80.31043577440771" },
  { id:"019-21456",
    lat:"41.304409999999834",
    lon:"-79.34884900000002" },
  { id:"019-21456",
    lat:"41.31298750005187",
    lon:"-77.17433350015655" },
  { id:"019-21456",
    lat:"41.31458750000028",
    lon:"-77.18946949999444" },
  { id:"019-21456",
    lat:"41.309085002568466",
    lon:"-77.28787696387475" },
  { id:"019-21456",
    lat:"41.299198516824056",
    lon:"-76.83499702906032" },
  { id:"019-21456",
    lat:"41.30106309524977",
    lon:"-77.21078310722521" },
  { id:"019-21456",
    lat:"41.30041099999984",
    lon:"-77.002889" },
  { id:"019-21456",
    lat:"41.30261214515617",
    lon:"-77.38372038343833" },
  { id:"019-21456",
    lat:"41.302378551350564",
    lon:"-77.33982070156794" },
  { id:"019-21456",
    lat:"41.3022662712447",
    lon:"-77.30644984044608" },
  { id:"019-21456",
    lat:"41.30395251770493",
    lon:"-77.41258600783294" },
  { id:"019-21456",
    lat:"41.302568576830076",
    lon:"-77.3178667021268" },
  { id:"019-21456",
    lat:"41.30255700000128",
    lon:"-77.03801800000417" },
  { id:"019-21456",
    lat:"41.291578500021075",
    lon:"-78.61806350007409" },
  { id:"019-21456",
    lat:"41.29234199999984",
    lon:"-78.621939" },
  { id:"019-21456",
    lat:"41.2942461238861",
    lon:"-77.07686006004289" },
  { id:"019-21456",
    lat:"41.29067400064173",
    lon:"-78.90450599999998" },
  { id:"019-21456",
    lat:"41.29610787178118",
    lon:"-77.2204617097956" },
  { id:"019-21456",
    lat:"41.317145000003904",
    lon:"-76.67701950000234" },
  { id:"019-21456",
    lat:"41.31838850000007",
    lon:"-78.765194" },
  { id:"019-21456",
    lat:"41.32172699999984",
    lon:"-77.29795099999998" },
  { id:"019-21456",
    lat:"41.32588463908437",
    lon:"-77.37577232372193" },
  { id:"019-21456",
    lat:"41.328268158713534",
    lon:"-77.37226858896047" },
  { id:"019-21456",
    lat:"41.32406399999983",
    lon:"-76.568928" },
  { id:"019-21456",
    lat:"41.326116500003266",
    lon:"-76.87435000000107" },
  { id:"019-21456",
    lat:"41.32659999999984",
    lon:"-77.17731400000001" },
  { id:"019-21456",
    lat:"41.32854346422627",
    lon:"-77.26909281401277" },
  { id:"019-21456",
    lat:"41.32197500000315",
    lon:"-77.34458349999875" },
  { id:"019-21456",
    lat:"41.32314626165914",
    lon:"-77.29161302899729" },
  { id:"019-21456",
    lat:"41.319985000002546",
    lon:"-76.76157499999846" },
  { id:"019-21456",
    lat:"41.32368152721284",
    lon:"-77.31845418369399" },
  { id:"019-21456",
    lat:"41.329168115711795",
    lon:"-76.82630696218638" },
  { id:"019-21456",
    lat:"41.330581000002894",
    lon:"-76.96498749999999" },
  { id:"019-21456",
    lat:"41.33294983810527",
    lon:"-77.29147186966527" },
  { id:"019-21456",
    lat:"41.33445406527532",
    lon:"-77.34942049248424" },
  { id:"019-21456",
    lat:"41.32956599999984",
    lon:"-77.16742799999999" },
  { id:"019-21456",
    lat:"41.330380500002065",
    lon:"-77.03231650000399" },
  { id:"019-21456",
    lat:"41.33161323724696",
    lon:"-77.28223997148424" },
  { id:"019-21456",
    lat:"41.341221000001966",
    lon:"-76.60381099999293" },
  { id:"019-21456",
    lat:"41.343883575376886",
    lon:"-77.25878936956781" },
  { id:"019-21456",
    lat:"41.341743999999835",
    lon:"-76.84468600000001" },
  { id:"019-21456",
    lat:"41.343722000001385",
    lon:"-77.14450700001083" },
  { id:"019-21456",
    lat:"41.336479916218615",
    lon:"-76.99008101276647" },
  { id:"019-21456",
    lat:"41.337372000000386",
    lon:"-77.15811399999812" },
  { id:"019-21456",
    lat:"41.33822285216989",
    lon:"-77.21652823369918" },
  { id:"019-21456",
    lat:"41.33916715532338",
    lon:"-77.2926916109874" },
  { id:"019-21456",
    lat:"41.32071899999986",
    lon:"-80.21746100000001" },
  { id:"019-21456",
    lat:"41.34711407272739",
    lon:"-77.37743063518523" },
  { id:"019-21456",
    lat:"41.34643425641766",
    lon:"-76.95876945067631" },
  { id:"019-21456",
    lat:"41.3489920025451",
    lon:"-77.32731400058455" },
  { id:"019-21456",
    lat:"41.344999530715306",
    lon:"-77.26782755328944" },
  { id:"019-21456",
    lat:"41.343461008012106",
    lon:"-76.97351249644817" },
  { id:"019-21456",
    lat:"41.343149999999845",
    lon:"-76.714369" },
  { id:"019-21456",
    lat:"41.33508499965365",
    lon:"-77.22382649972519" },
  { id:"019-21456",
    lat:"41.3352960000052",
    lon:"-77.1646430000054" },
  { id:"019-21456",
    lat:"41.33472348860558",
    lon:"-77.01528350340605" },
  { id:"019-21456",
    lat:"41.334029972277726",
    lon:"-76.92882539406433" },
  { id:"019-21456",
    lat:"41.33724850886751",
    lon:"-77.33051548369505" },
  { id:"019-21456",
    lat:"41.33690326973733",
    lon:"-77.30051859082455" },
  { id:"019-21456",
    lat:"41.337062447166545",
    lon:"-77.3183929336251" },
  { id:"019-21456",
    lat:"41.31542392152097",
    lon:"-77.2750514651835" },
  { id:"019-21456",
    lat:"41.31732341176977",
    lon:"-77.32424853770782" },
  { id:"019-21456",
    lat:"41.350813999999836",
    lon:"-78.539714" },
  { id:"019-21456",
    lat:"41.35412749670556",
    lon:"-77.13927090174735" },
  { id:"019-21456",
    lat:"41.355233039049885",
    lon:"-77.39426185750297" },
  { id:"019-21456",
    lat:"41.35769700006555",
    lon:"-77.38813899749015" },
  { id:"019-21456",
    lat:"41.35875545788699",
    lon:"-77.30917249878492" },
  { id:"019-21456",
    lat:"41.3551489495959",
    lon:"-77.2873609947457" },
  { id:"019-21456",
    lat:"41.355723500655024",
    lon:"-77.04640100022465" },
  { id:"019-21456",
    lat:"41.36020299999984",
    lon:"-77.106683" },
  { id:"019-21456",
    lat:"41.361791539965054",
    lon:"-77.26241650064937" },
  { id:"019-21456",
    lat:"41.36255847406587",
    lon:"-77.24614702481743" },
  { id:"019-21456",
    lat:"41.36396263074316",
    lon:"-77.37831399991066" },
  { id:"019-21456",
    lat:"41.369832000000194",
    lon:"-77.5879960000043" },
  { id:"019-21456",
    lat:"41.3675661022012",
    lon:"-76.99425579434717" },
  { id:"019-21456",
    lat:"41.36929384227338",
    lon:"-77.55944541362295" },
  { id:"019-21456",
    lat:"41.36932500030386",
    lon:"-77.30377096375746" },
  { id:"019-21456",
    lat:"41.370258466428226",
    lon:"-77.58072496903822" },
  { id:"019-21456",
    lat:"41.36915549237944",
    lon:"-77.16224107358494" },
  { id:"019-21456",
    lat:"41.36952384494963",
    lon:"-77.16876800685084" },
  { id:"019-21456",
    lat:"41.369634540699",
    lon:"-77.27881100007973" },
  { id:"019-21456",
    lat:"41.36581547564378",
    lon:"-77.51782351060378" },
  { id:"019-21456",
    lat:"41.36320650010992",
    lon:"-77.09976650021419" },
  { id:"019-21456",
    lat:"41.364071080722404",
    lon:"-77.28574299907977" },
  { id:"019-21456",
    lat:"41.36181099999984",
    lon:"-76.716639" },
  { id:"019-21456",
    lat:"41.36707502758952",
    lon:"-77.67051111934128" },
  { id:"019-21456",
    lat:"41.3643090120368",
    lon:"-77.02521698088061" },
  { id:"019-21456",
    lat:"41.366390000015684",
    lon:"-77.23673200000016" },
  { id:"019-21456",
    lat:"41.366555503239404",
    lon:"-77.3722249940474" },
  { id:"019-21456",
    lat:"41.366658679954625",
    lon:"-77.2099658897069" },
  { id:"019-21456",
    lat:"41.37366500007406",
    lon:"-77.10436949988511" },
  { id:"019-21456",
    lat:"41.374778905974914",
    lon:"-77.15903595868367" },
  { id:"019-21456",
    lat:"41.37464300000075",
    lon:"-77.13448699999394" },
  { id:"019-21456",
    lat:"41.37737506528133",
    lon:"-77.12726096184575" },
  { id:"019-21456",
    lat:"41.378288922701174",
    lon:"-77.2297920710414" },
  { id:"019-21456",
    lat:"41.37671115609503",
    lon:"-77.1373911573988" },
  { id:"019-21456",
    lat:"41.37738200000325",
    lon:"-77.20965300000172" },
  { id:"019-21456",
    lat:"41.35738899999984",
    lon:"-80.14914700000001" },
  { id:"019-21456",
    lat:"41.38136300000863",
    lon:"-76.89675499998967" },
  { id:"019-21456",
    lat:"41.38663604201378",
    lon:"-77.49076142070449" },
  { id:"019-21456",
    lat:"41.38161701445828",
    lon:"-76.97738201434242" },
  { id:"019-21456",
    lat:"41.38562498866942",
    lon:"-77.54645104430331" },
  { id:"019-21456",
    lat:"41.385849999623105",
    lon:"-77.51199998410645" },
  { id:"019-21456",
    lat:"41.38529610404859",
    lon:"-76.97417558719513" },
  { id:"019-21456",
    lat:"41.38013049435921",
    lon:"-77.555311022175" },
  { id:"019-21456",
    lat:"41.379672000040465",
    lon:"-77.12252350014754" },
  { id:"019-21456",
    lat:"41.380737463470275",
    lon:"-77.52193901372709" },
  { id:"019-21456",
    lat:"41.37846699999983",
    lon:"-77.179283" },
  { id:"019-21456",
    lat:"41.381355654333674",
    lon:"-77.52768813200844" },
  { id:"019-21456",
    lat:"41.38106350000946",
    lon:"-77.16826399998583" },
  { id:"019-21456",
    lat:"41.39061899999985",
    lon:"-76.947833" },
  { id:"019-21456",
    lat:"41.39506947184362",
    lon:"-77.48764049947889" },
  { id:"019-21456",
    lat:"41.36552799999984",
    lon:"-80.46355100000001" },
  { id:"019-21456",
    lat:"41.39141899999984",
    lon:"-79.01695800000002" },
  { id:"019-21456",
    lat:"41.393147466112055",
    lon:"-77.38303343720129" },
  { id:"019-21456",
    lat:"41.39165299999984",
    lon:"-77.015983" },
  { id:"019-21456",
    lat:"41.40087799999984",
    lon:"-76.959233" },
  { id:"019-21456",
    lat:"41.4001000155889",
    lon:"-77.09513998592548" },
  { id:"019-21456",
    lat:"41.400922053553316",
    lon:"-77.16791094817496" },
  { id:"019-21456",
    lat:"41.4064295000003",
    lon:"-77.62771800000192" },
  { id:"019-21456",
    lat:"41.40723608046935",
    lon:"-77.36434850023414" },
  { id:"019-21456",
    lat:"41.405142000047896",
    lon:"-77.571986" },
  { id:"019-21456",
    lat:"41.40305521802055",
    lon:"-77.07302628157431" },
  { id:"019-21456",
    lat:"41.40416899999984",
    lon:"-76.98354400000001" },
  { id:"019-21456",
    lat:"41.40478999998409",
    lon:"-77.15635000035766" },
  { id:"019-21456",
    lat:"41.40566950270802",
    lon:"-77.22079749626901" },
  { id:"019-21456",
    lat:"41.39735699448491",
    lon:"-77.18528600048901" },
  { id:"019-21456",
    lat:"41.39756717410109",
    lon:"-77.17557537708802" },
  { id:"019-21456",
    lat:"41.39668350434366",
    lon:"-77.00796250418412" },
  { id:"019-21456",
    lat:"41.399310000358696",
    lon:"-77.20583600895196" },
  { id:"019-21456",
    lat:"41.388672971997465",
    lon:"-77.18676230700474" },
  { id:"019-21456",
    lat:"41.387840060288546",
    lon:"-77.07770298541739" },
  { id:"019-21456",
    lat:"41.387890595421254",
    lon:"-76.97668348854003" },
  { id:"019-21456",
    lat:"41.388928471115044",
    lon:"-77.03436935903996" },
  { id:"019-21456",
    lat:"41.370676011907975",
    lon:"-77.11187984161415" },
  { id:"019-21456",
    lat:"41.371358950409785",
    lon:"-77.56586900097018" },
  { id:"019-21456",
    lat:"41.37132065518662",
    lon:"-77.14579553354453" },
  { id:"019-21456",
    lat:"41.349652999999854",
    lon:"-77.31285" },
  { id:"019-21456",
    lat:"41.34906500000255",
    lon:"-77.07442500000154" },
  { id:"019-21456",
    lat:"41.348669453615635",
    lon:"-76.94590995804337" },
  { id:"019-21456",
    lat:"41.34646699999995",
    lon:"-76.63005300000114" },
  { id:"019-21456",
    lat:"41.35240300000504",
    lon:"-77.6735625000074" },
  { id:"019-21456",
    lat:"41.35192942162096",
    lon:"-77.37025850092323" },
  { id:"019-21456",
    lat:"41.270231801011256",
    lon:"-76.60772672635181" },
  { id:"019-21456",
    lat:"41.27448149928036",
    lon:"-77.26694247475187" },
  { id:"019-21456",
    lat:"41.27391399287115",
    lon:"-77.54310410703101" },
  { id:"019-21456",
    lat:"41.27623351558844",
    lon:"-77.28685400266082" },
  { id:"019-21456",
    lat:"41.27084800000344",
    lon:"-76.65971900001887" },
  { id:"019-21456",
    lat:"41.27218864065686",
    lon:"-76.6365482368382" },
  { id:"019-21456",
    lat:"40.759302501880256",
    lon:"-79.76615500773893" },
  { id:"019-21456",
    lat:"40.75833599999984",
    lon:"-79.83081399999999" },
  { id:"019-21456",
    lat:"40.75850299999982",
    lon:"-79.85151400000001" },
  { id:"019-21456",
    lat:"40.75424050668078",
    lon:"-79.99385402815004" },
  { id:"019-21456",
    lat:"40.76453299999983",
    lon:"-79.513014" },
  { id:"019-21456",
    lat:"40.74752799999984",
    lon:"-80.41150000000002" },
  { id:"019-21456",
    lat:"40.755411999999836",
    lon:"-80.03300700000003" },
  { id:"019-21456",
    lat:"40.12556001030223",
    lon:"-79.76103049050343" },
  { id:"019-21456",
    lat:"40.11671400162078",
    lon:"-80.2282441089013" },
  { id:"019-21456",
    lat:"40.113833257926366",
    lon:"-80.26783024862442" },
  { id:"019-21456",
    lat:"40.12353999999983",
    lon:"-79.80501" },
  { id:"019-21456",
    lat:"40.11642578840222",
    lon:"-80.14958069754586" },
  { id:"019-21456",
    lat:"40.118773433359486",
    lon:"-80.17919397971767" },
  { id:"019-21456",
    lat:"40.12122653630023",
    lon:"-80.02609444892047" },
  { id:"019-21456",
    lat:"40.12107272067539",
    lon:"-80.06294772667633" },
  { id:"019-21456",
    lat:"41.409380519011094",
    lon:"-76.93330402082609" },
  { id:"019-21456",
    lat:"41.41251250029636",
    lon:"-76.9562555273228" },
  { id:"019-21456",
    lat:"41.412324998603104",
    lon:"-77.20457899996556" },
  { id:"019-21456",
    lat:"41.41309300018682",
    lon:"-76.96592499616087" },
  { id:"019-21456",
    lat:"41.411314950204705",
    lon:"-77.14251840868191" },
  { id:"019-21456",
    lat:"41.41719897818103",
    lon:"-77.09575914104298" },
  { id:"019-21456",
    lat:"41.387745999999844",
    lon:"-80.51265300000001" },
  { id:"019-21456",
    lat:"41.41615549883616",
    lon:"-77.11353849237703" },
  { id:"019-21456",
    lat:"41.41490109170663",
    lon:"-77.37907508996513" },
  { id:"019-21456",
    lat:"41.4152110040457",
    lon:"-77.13416655298667" },
  { id:"019-21456",
    lat:"41.418661000007624",
    lon:"-79.09820249996626" },
  { id:"019-21456",
    lat:"41.42525800018541",
    lon:"-78.29908899999998" },
  { id:"019-21456",
    lat:"41.422389000047986",
    lon:"-77.18776650522555" },
  { id:"019-21456",
    lat:"41.42263100002765",
    lon:"-77.1660710000957" },
  { id:"019-21456",
    lat:"41.422645989759786",
    lon:"-77.127213960028" },
  { id:"019-21456",
    lat:"41.4165723477147",
    lon:"-79.45909917407472" },
  { id:"019-21456",
    lat:"41.4266290093774",
    lon:"-76.86918900205987" },
  { id:"019-21456",
    lat:"41.42993906181486",
    lon:"-77.05815729337644" },
  { id:"019-21456",
    lat:"41.42863600969397",
    lon:"-76.94530654056295" },
  { id:"019-21456",
    lat:"41.433265533359915",
    lon:"-77.20864394316442" },
  { id:"019-21456",
    lat:"41.4193082548033",
    lon:"-77.05938542352365" },
  { id:"019-21456",
    lat:"41.41981239081504",
    lon:"-76.95110095630814" },
  { id:"019-21456",
    lat:"41.440122077651324",
    lon:"-77.11031399985085" },
  { id:"019-21456",
    lat:"41.43864883572533",
    lon:"-77.03027574077379" },
  { id:"019-21456",
    lat:"41.44384450001883",
    lon:"-76.91670450002779" },
  { id:"019-21456",
    lat:"41.44647904984461",
    lon:"-76.8375850471754" },
  { id:"019-21456",
    lat:"41.44995450001137",
    lon:"-77.16994850000997" },
  { id:"019-21456",
    lat:"41.45272049657619",
    lon:"-77.18581946086513" },
  { id:"019-21456",
    lat:"41.45401000000566",
    lon:"-76.9027435000299" },
  { id:"019-21456",
    lat:"41.4564295428275",
    lon:"-76.91302349915189" },
  { id:"019-21456",
    lat:"41.45775299999983",
    lon:"-76.83477499999998" },
  { id:"019-21456",
    lat:"41.444243146421336",
    lon:"-76.86481145326572" },
  { id:"019-21456",
    lat:"41.445067000003256",
    lon:"-76.93017799999998" },
  { id:"019-21456",
    lat:"41.44631521332375",
    lon:"-77.01054459255393" },
  { id:"019-21456",
    lat:"41.43430945383097",
    lon:"-77.03916282633723" },
  { id:"019-21456",
    lat:"41.43469300000035",
    lon:"-76.89994599999555" },
  { id:"019-21456",
    lat:"41.43539008611791",
    lon:"-76.93474060230467" },
  { id:"019-21456",
    lat:"41.43835410929336",
    lon:"-77.18795700306168" },
  { id:"019-21456",
    lat:"41.438241500000004",
    lon:"-77.11657049999904" },
  { id:"019-21456",
    lat:"41.459805999999844",
    lon:"-79.30066599999999" },
  { id:"019-21456",
    lat:"41.46846401739556",
    lon:"-76.86933748316018" },
  { id:"019-21456",
    lat:"41.47308344921392",
    lon:"-77.0614414746228" },
  { id:"019-21456",
    lat:"41.47421397688623",
    lon:"-77.24530478602205" },
  { id:"019-21456",
    lat:"41.47515550004045",
    lon:"-78.92160049994587" },
  { id:"019-21456",
    lat:"41.47551901225323",
    lon:"-78.93548158514773" },
  { id:"019-21456",
    lat:"41.48418099999985",
    lon:"-77.11518099999999" },
  { id:"019-21456",
    lat:"41.4874971022896",
    lon:"-77.27866857712714" },
  { id:"019-21456",
    lat:"41.48360738286052",
    lon:"-77.17169755590481" },
  { id:"019-21456",
    lat:"41.484409971539435",
    lon:"-77.18578352942858" },
  { id:"019-21456",
    lat:"41.47557285922282",
    lon:"-77.09369359052755" },
  { id:"019-21456",
    lat:"41.47451935638723",
    lon:"-77.15746932431571" },
  { id:"019-21456",
    lat:"41.47480997005068",
    lon:"-77.07364900069665" },
  { id:"019-21456",
    lat:"41.47528050761412",
    lon:"-77.02796649248472" },
  { id:"019-21456",
    lat:"41.477723399179744",
    lon:"-77.12101426572346" },
  { id:"019-21456",
    lat:"41.46539999999985",
    lon:"-78.64561400000001" },
  { id:"019-21456",
    lat:"41.467247447654316",
    lon:"-77.00457645228687" },
  { id:"019-21456",
    lat:"41.46868340117179",
    lon:"-77.167545094102" },
  { id:"019-21456",
    lat:"41.466681759332765",
    lon:"-76.90182299261669" },
  { id:"019-21456",
    lat:"41.46937249947093",
    lon:"-77.14810692828577" },
  { id:"019-21456",
    lat:"41.489416999999854",
    lon:"-77.13749399999999" },
  { id:"019-21456",
    lat:"41.49121950001934",
    lon:"-78.71953900002318" },
  { id:"019-21456",
    lat:"41.49923428839108",
    lon:"-77.10329744948996" },
  { id:"019-21456",
    lat:"41.506498500001555",
    lon:"-76.35056650000705" },
  { id:"019-21456",
    lat:"41.506064915126345",
    lon:"-78.71732061290962" },
  { id:"019-21456",
    lat:"41.50057800000633",
    lon:"-78.42304899998307" },
  { id:"019-21456",
    lat:"41.50160228374498",
    lon:"-77.02384044924123" },
  { id:"019-21456",
    lat:"41.48783299999986",
    lon:"-80.334978" },
  { id:"019-21456",
    lat:"41.49803599999984",
    lon:"-79.74645300000002" },
  { id:"019-21456",
    lat:"41.51265649660842",
    lon:"-76.9798155014135" },
  { id:"019-21456",
    lat:"41.51374999999983",
    lon:"-76.974592" },
  { id:"019-21456",
    lat:"41.46237653206504",
    lon:"-77.03421248468" },
  { id:"019-21456",
    lat:"41.46147200000978",
    lon:"-76.88545800005234" },
  { id:"019-21456",
    lat:"41.46448099999985",
    lon:"-77.217625" },
  { id:"019-21456",
    lat:"41.4649180000148",
    lon:"-77.20896950010645" },
  { id:"019-21456",
    lat:"41.51783899999986",
    lon:"-76.106742" },
  { id:"019-21456",
    lat:"41.522139000001175",
    lon:"-76.44531950000987" },
  { id:"019-21456",
    lat:"41.522012385690296",
    lon:"-76.41424156062172" },
  { id:"019-21456",
    lat:"41.52233899999985",
    lon:"-76.37044199999998" },
  { id:"019-21456",
    lat:"41.526308500000006",
    lon:"-76.67398499999831" },
  { id:"019-21456",
    lat:"41.525616999999855",
    lon:"-76.53870599999998" },
  { id:"019-21456",
    lat:"41.53184850000059",
    lon:"-78.7175544999949" },
  { id:"019-21456",
    lat:"41.53439699999985",
    lon:"-77.00413699999999" },
  { id:"019-21456",
    lat:"41.529021000002906",
    lon:"-76.24537349999838" },
  { id:"019-21456",
    lat:"41.53021399999986",
    lon:"-79.18429199999999" },
  { id:"019-21456",
    lat:"41.53245300000325",
    lon:"-76.71157799999871" },
  { id:"019-21456",
    lat:"41.5302380000019",
    lon:"-76.41092749999308" },
  { id:"019-21456",
    lat:"41.531777999999846",
    lon:"-76.51118299999999" },
  { id:"019-21456",
    lat:"41.531256002855436",
    lon:"-76.46295779269833" },
  { id:"019-21456",
    lat:"41.53094399999984",
    lon:"-76.428967" },
  { id:"019-21456",
    lat:"41.533399999999844",
    lon:"-76.60129400000001" },
  { id:"019-21456",
    lat:"41.53499699999987",
    lon:"-76.754753" },
  { id:"019-21456",
    lat:"41.52943599999985",
    lon:"-76.68317800000001" },
  { id:"019-21456",
    lat:"41.52646163366086",
    lon:"-76.34944418521448" },
  { id:"019-21456",
    lat:"41.52973355346742",
    lon:"-76.82667102202224" },
  { id:"019-21456",
    lat:"41.5306779999999",
    lon:"-76.04442500000064" },
  { id:"019-21456",
    lat:"41.530855202976035",
    lon:"-76.14886954470292" },
  { id:"019-21456",
    lat:"41.53782500001036",
    lon:"-76.76627199998714" },
  { id:"019-21456",
    lat:"41.53534399999986",
    lon:"-76.591906" },
  { id:"019-21456",
    lat:"41.53588099999985",
    lon:"-76.61201100000001" },
  { id:"019-21456",
    lat:"41.53779199999985",
    lon:"-76.735272" },
  { id:"019-21456",
    lat:"41.53091354569707",
    lon:"-76.11552358266253" },
  { id:"019-21456",
    lat:"41.533692603982125",
    lon:"-76.33035874325951" },
  { id:"019-21456",
    lat:"41.53326650000032",
    lon:"-76.23012899999702" },
  { id:"019-21456",
    lat:"41.54474399999985",
    lon:"-76.57654200000002" },
  { id:"019-21456",
    lat:"41.54589699999983",
    lon:"-76.694553" },
  { id:"019-21456",
    lat:"41.54446500097632",
    lon:"-76.14426649620302" },
  { id:"019-21456",
    lat:"41.55095552546175",
    lon:"-76.49138609617113" },
  { id:"019-21456",
    lat:"41.54982718400922",
    lon:"-76.37554442121022" },
  { id:"019-21456",
    lat:"41.55306900000545",
    lon:"-78.71730799999999" },
  { id:"019-21456",
    lat:"41.5532985906783",
    lon:"-76.82386511941515" },
  { id:"019-21456",
    lat:"41.55386802453943",
    lon:"-76.76011254491713" },
  { id:"019-21456",
    lat:"41.554419457501766",
    lon:"-76.80842643664224" },
  { id:"019-21456",
    lat:"41.54525550000127",
    lon:"-76.27256100001006" },
  { id:"019-21456",
    lat:"41.54776899999987",
    lon:"-76.51461100000002" },
  { id:"019-21456",
    lat:"41.54771399999985",
    lon:"-76.48438900000001" },
  { id:"019-21456",
    lat:"41.55200599999985",
    lon:"-76.7372" },
  { id:"019-21456",
    lat:"41.540765000005486",
    lon:"-76.16232200000387" },
  { id:"019-21456",
    lat:"41.550576838226874",
    lon:"-77.16020753173757" },
  { id:"019-21456",
    lat:"41.54449562705766",
    lon:"-76.29594814673993" },
  { id:"019-21456",
    lat:"41.545162531168046",
    lon:"-76.38536652995845" },
  { id:"019-21456",
    lat:"41.55094193651136",
    lon:"-78.53119266036516" },
  { id:"019-21456",
    lat:"41.54571699999983",
    lon:"-76.49305" },
  { id:"019-21456",
    lat:"41.54587036853281",
    lon:"-76.42694597989883" },
  { id:"019-21456",
    lat:"41.54862352185597",
    lon:"-76.6493374912796" },
  { id:"019-21456",
    lat:"41.54374699999985",
    lon:"-78.685744" },
  { id:"019-21456",
    lat:"41.54203899999985",
    lon:"-76.533111" },
  { id:"019-21456",
    lat:"41.53893813543635",
    lon:"-76.2591691988952" },
  { id:"019-21456",
    lat:"41.54531072899311",
    lon:"-77.178770861122" },
  { id:"019-21456",
    lat:"41.547382092576605",
    lon:"-76.97339701822597" },
  { id:"019-21456",
    lat:"41.54231508189419",
    lon:"-76.40361785248984" },
  { id:"019-21456",
    lat:"41.54774273418474",
    lon:"-78.54173384652174" },
  { id:"019-21456",
    lat:"41.51182499999987",
    lon:"-76.419369" },
  { id:"019-21456",
    lat:"41.514441508883756",
    lon:"-76.67980096081429" },
  { id:"019-21456",
    lat:"41.51716123211795",
    lon:"-78.56007750701593" },
  { id:"019-21456",
    lat:"41.549766999999854",
    lon:"-76.05749700000001" },
  { id:"019-21456",
    lat:"41.55984040641474",
    lon:"-78.51776979122471" },
  { id:"019-21456",
    lat:"41.55797799999984",
    lon:"-76.681225" },
  { id:"019-21456",
    lat:"41.56100008100083",
    lon:"-77.06920400627241" },
  { id:"019-21456",
    lat:"41.55972199999986",
    lon:"-76.705917" },
  { id:"019-21456",
    lat:"41.55558299999986",
    lon:"-76.36857500000002" },
  { id:"019-21456",
    lat:"41.556630610577784",
    lon:"-76.40311248382922" },
  { id:"019-21456",
    lat:"41.55957650221179",
    lon:"-76.27504849269886" },
  { id:"019-21456",
    lat:"41.56708199995965",
    lon:"-76.99822800203047" },
  { id:"019-21456",
    lat:"41.564203511833895",
    lon:"-76.606937546216" },
  { id:"019-21456",
    lat:"41.56033369296351",
    lon:"-76.26392831890563" },
  { id:"019-21456",
    lat:"41.56302199999986",
    lon:"-76.468525" },
  { id:"019-21456",
    lat:"41.56575799999986",
    lon:"-76.72660799999998" },
  { id:"019-21456",
    lat:"41.56382733220178",
    lon:"-77.15306488299316" },
  { id:"019-21456",
    lat:"41.55639355558344",
    lon:"-76.22283336817901" },
  { id:"019-21456",
    lat:"41.55539899874062",
    lon:"-76.24234750808809" },
  { id:"019-21456",
    lat:"41.558863518228435",
    lon:"-76.57045699587505" },
  { id:"019-21456",
    lat:"41.558878478727586",
    lon:"-76.4500026447553" },
  { id:"019-21456",
    lat:"41.56068099999985",
    lon:"-76.61454200000001" },
  { id:"019-21456",
    lat:"41.55940988082987",
    lon:"-76.64000514204808" },
  { id:"019-21456",
    lat:"41.564864131650204",
    lon:"-78.50562300395973" },
  { id:"019-21456",
    lat:"41.56212921778471",
    lon:"-76.67401538464547" },
  { id:"019-21456",
    lat:"41.561675027296694",
    lon:"-76.6313774904142" },
  { id:"019-21456",
    lat:"41.557337495240205",
    lon:"-76.18868898128898" },
  { id:"019-21456",
    lat:"41.552967999999844",
    lon:"-80.061419" },
  { id:"019-21456",
    lat:"41.56822900000125",
    lon:"-76.54870400000416" },
  { id:"019-21456",
    lat:"41.569077999999855",
    lon:"-76.62531400000003" },
  { id:"019-21456",
    lat:"41.565383188149944",
    lon:"-76.28622236010463" },
  { id:"019-21456",
    lat:"41.56559133158122",
    lon:"-76.10097853384201" },
  { id:"019-21456",
    lat:"41.57794050001191",
    lon:"-77.2706054999696" },
  { id:"019-21456",
    lat:"41.577306528987855",
    lon:"-76.79082901155365" },
  { id:"019-21456",
    lat:"41.58159773260218",
    lon:"-77.10100526282064" },
  { id:"019-21456",
    lat:"41.58021003171816",
    lon:"-77.06295853407002" },
  { id:"019-21456",
    lat:"41.57272800001179",
    lon:"-76.17095849999113" },
  { id:"019-21456",
    lat:"41.56864876937664",
    lon:"-76.18156297620295" },
  { id:"019-21456",
    lat:"41.56919112142872",
    lon:"-76.21934318446834" },
  { id:"019-21456",
    lat:"41.578577472758894",
    lon:"-77.11670964964645" },
  { id:"019-21456",
    lat:"41.56973699999986",
    lon:"-76.47388499999998" },
  { id:"019-21456",
    lat:"41.56832909733185",
    lon:"-76.34782499202215" },
  { id:"019-21456",
    lat:"41.57338626716271",
    lon:"-77.1307506320047" },
  { id:"019-21456",
    lat:"41.57089612473035",
    lon:"-76.74152077815383" },
  { id:"019-21456",
    lat:"41.5732026176057",
    lon:"-77.05153438454653" },
  { id:"019-21456",
    lat:"41.57458131754312",
    lon:"-78.50290221220646" },
  { id:"019-21456",
    lat:"41.56570450051599",
    lon:"-76.1429296729645" },
  { id:"019-21456",
    lat:"41.571611503601716",
    lon:"-76.59088646115256" },
  { id:"019-21456",
    lat:"41.576289001088576",
    lon:"-77.03102905677702" },
  { id:"019-21456",
    lat:"41.5601815614602",
    lon:"-76.1548990226357" },
  { id:"019-21456",
    lat:"41.57084336081573",
    lon:"-78.35136622399621" },
  { id:"019-21456",
    lat:"41.5623125151956",
    lon:"-76.25405702714696" },
  { id:"019-21456",
    lat:"41.56217749957815",
    lon:"-76.30165650055973" },
  { id:"019-21456",
    lat:"41.5641365961328",
    lon:"-76.4241971554304" },
  { id:"019-21456",
    lat:"41.56604399999984",
    lon:"-76.71563100000002" },
  { id:"019-21456",
    lat:"41.56427508945309",
    lon:"-76.51339776882892" },
  { id:"019-21456",
    lat:"41.562087021421476",
    lon:"-76.11142799281143" },
  { id:"019-21456",
    lat:"41.562019500001696",
    lon:"-76.19784849999574" },
  { id:"019-21456",
    lat:"41.56396899999986",
    lon:"-76.32050000000001" },
  { id:"019-21456",
    lat:"41.57119421481538",
    lon:"-78.39804073428411" },
  { id:"019-21456",
    lat:"41.56459300173626",
    lon:"-76.33346400709267" },
  { id:"019-21456",
    lat:"41.57182000000207",
    lon:"-75.97217950000312" },
  { id:"019-21456",
    lat:"41.58506099999984",
    lon:"-78.93954699999999" },
  { id:"019-21456",
    lat:"41.57870100000158",
    lon:"-75.98917900000248" },
  { id:"019-21456",
    lat:"41.57942383230936",
    lon:"-76.07637078854245" },
  { id:"019-21456",
    lat:"41.57963100000186",
    lon:"-76.05607949999998" },
  { id:"019-21456",
    lat:"41.590471911646105",
    lon:"-77.1604027914401" },
  { id:"019-21456",
    lat:"41.58416299999984",
    lon:"-78.821292" },
  { id:"019-21456",
    lat:"41.58278348558811",
    lon:"-76.53496944518155" },
  { id:"019-21456",
    lat:"41.58740877957998",
    lon:"-78.37410605315372" },
  { id:"019-21456",
    lat:"41.58529850000324",
    lon:"-76.98063899999936" },
  { id:"019-21456",
    lat:"41.57611450002406",
    lon:"-75.99978649999825" },
  { id:"019-21456",
    lat:"41.587588255401435",
    lon:"-78.49234624199619" },
  { id:"019-21456",
    lat:"41.5879750299548",
    lon:"-78.54320388173412" },
  { id:"019-21456",
    lat:"41.57707510616334",
    lon:"-76.04442539872029" },
  { id:"019-21456",
    lat:"41.583138999999846",
    lon:"-76.514292" },
  { id:"019-21456",
    lat:"41.588448796691694",
    lon:"-78.42815396898739" },
  { id:"019-21456",
    lat:"41.57811850000021",
    lon:"-76.02724749999771" },
  { id:"019-21456",
    lat:"41.58698746373002",
    lon:"-76.8599639842142" },
  { id:"019-21456",
    lat:"41.58733899999986",
    lon:"-79.090422" },
  { id:"019-21456",
    lat:"41.58332290278549",
    lon:"-76.01971067940813" },
  { id:"019-21456",
    lat:"41.594403000043386",
    lon:"-77.04531100003842" },
  { id:"019-21456",
    lat:"41.586664457874186",
    lon:"-76.22493846239682" },
  { id:"019-21456",
    lat:"41.59020657101651",
    lon:"-76.45498762337883" },
  { id:"019-21456",
    lat:"41.58724600002052",
    lon:"-76.20280699996633" },
  { id:"019-21456",
    lat:"41.58748649949869",
    lon:"-76.27121796281251" },
  { id:"019-21456",
    lat:"41.586899445525056",
    lon:"-76.21202246420665" },
  { id:"019-21456",
    lat:"41.58669277585424",
    lon:"-76.08957278512761" },
  { id:"019-21456",
    lat:"41.597503749888624",
    lon:"-78.36240929998363" },
  { id:"019-21456",
    lat:"41.59283906166668",
    lon:"-76.70060314179457" },
  { id:"019-21456",
    lat:"41.588618999999845",
    lon:"-76.289433" },
  { id:"019-21456",
    lat:"41.589441999999835",
    lon:"-76.33509700000002" },
  { id:"019-21456",
    lat:"41.59362500001501",
    lon:"-76.66023900008851" },
  { id:"019-21456",
    lat:"41.58915799999984",
    lon:"-76.24816099999998" },
  { id:"019-21456",
    lat:"41.59694600000103",
    lon:"-77.0181044999907" },
  { id:"019-21456",
    lat:"41.593380450515106",
    lon:"-76.5961625007307" },
  { id:"019-21456",
    lat:"41.58643600000176",
    lon:"-76.41081499999551" },
  { id:"019-21456",
    lat:"41.5905095095837",
    lon:"-76.84938046140554" },
  { id:"019-21456",
    lat:"41.59252200000433",
    lon:"-77.24764300000689" },
  { id:"019-21456",
    lat:"41.58671250000313",
    lon:"-76.47710849999811" },
  { id:"019-21456",
    lat:"41.590121000002945",
    lon:"-76.82272800002306" },
  { id:"019-21456",
    lat:"41.59203467369969",
    lon:"-77.96808620348564" },
  { id:"019-21456",
    lat:"41.58581402043105",
    lon:"-76.50706950893976" },
  { id:"019-21456",
    lat:"41.59051394187482",
    lon:"-76.71780389916108" },
  { id:"019-21456",
    lat:"41.589294500104515",
    lon:"-76.68469600004522" },
  { id:"019-21456",
    lat:"41.58650799999986",
    lon:"-76.39456099999998" },
  { id:"019-21456",
    lat:"41.58364047703503",
    lon:"-76.13448847872034" },
  { id:"019-21456",
    lat:"41.58927999999985",
    lon:"-76.6015" },
  { id:"019-21456",
    lat:"41.59098898133552",
    lon:"-76.67506099449395" },
  { id:"019-21456",
    lat:"41.58888899999985",
    lon:"-76.48693100000001" },
  { id:"019-21456",
    lat:"41.588412500000324",
    lon:"-76.43706099999501" },
  { id:"019-21456",
    lat:"41.571831540401476",
    lon:"-76.01879532272307" },
  { id:"019-21456",
    lat:"41.572597999999864",
    lon:"-76.031757" },
  { id:"019-21456",
    lat:"41.57399999999985",
    lon:"-76.23081699999999" },
  { id:"019-21456",
    lat:"41.578192256093885",
    lon:"-76.58546782565149" },
  { id:"019-21456",
    lat:"41.5762250000026",
    lon:"-76.35770800001346" },
  { id:"019-21456",
    lat:"41.57936099999984",
    lon:"-76.569139" },
  { id:"019-21456",
    lat:"41.57818599999986",
    lon:"-76.520728" },
  { id:"019-21456",
    lat:"41.58414289259888",
    lon:"-78.47665181246553" },
  { id:"019-21456",
    lat:"41.58482650001325",
    lon:"-77.25658850001328" },
  { id:"019-21456",
    lat:"41.5844811705386",
    lon:"-78.47173584737747" },
  { id:"019-21456",
    lat:"41.58474232665029",
    lon:"-76.99797464467582" },
  { id:"019-21456",
    lat:"41.55034399999984",
    lon:"-79.16449200000001" },
  { id:"019-21456",
    lat:"41.55437703828963",
    lon:"-76.58911203118205" },
  { id:"019-21456",
    lat:"41.55877245243752",
    lon:"-77.13864051985368" },
  { id:"019-21456",
    lat:"41.557837462054",
    lon:"-77.07898450250308" },
  { id:"019-21456",
    lat:"41.55761099999984",
    lon:"-78.70805000000001" },
  { id:"019-21456",
    lat:"41.55153049959202",
    lon:"-76.20999150084185" },
  { id:"019-21456",
    lat:"41.554993999999844",
    lon:"-76.467794" },
  { id:"019-21456",
    lat:"41.55931399780331",
    lon:"-77.02910699987105" },
  { id:"019-21456",
    lat:"41.6020025001167",
    lon:"-78.36305400057417" },
  { id:"019-21456",
    lat:"41.59537500000178",
    lon:"-76.40676500000451" },
  { id:"019-21456",
    lat:"41.601450000003126",
    lon:"-76.99274450000001" },
  { id:"019-21456",
    lat:"41.59904158929077",
    lon:"-76.62743753852578" },
  { id:"019-21456",
    lat:"41.601735509503285",
    lon:"-76.94749171212653" },
  { id:"019-21456",
    lat:"41.59668599999986",
    lon:"-76.381422" },
  { id:"019-21456",
    lat:"41.597707000000774",
    lon:"-79.34825800000559" },
  { id:"019-21456",
    lat:"41.60757164771854",
    lon:"-78.52906599969" },
  { id:"019-21456",
    lat:"41.597782926959496",
    lon:"-75.98595264781922" },
  { id:"019-21456",
    lat:"41.60072099212838",
    lon:"-76.01468277388952" },
  { id:"019-21456",
    lat:"41.6112240000004",
    lon:"-76.98012199999694" },
  { id:"019-21456",
    lat:"41.601635332553755",
    lon:"-76.13449120521557" },
  { id:"019-21456",
    lat:"41.606291500001284",
    lon:"-76.50585999999544" },
  { id:"019-21456",
    lat:"41.610593255687455",
    lon:"-76.8412485017267" },
  { id:"019-21456",
    lat:"41.59757923891149",
    lon:"-76.03896917659027" },
  { id:"019-21456",
    lat:"41.608136000005466",
    lon:"-77.18312799999998" },
  { id:"019-21456",
    lat:"41.59933599999985",
    lon:"-76.215933" },
  { id:"019-21456",
    lat:"41.602793999999854",
    lon:"-76.47138600000001" },
  { id:"019-21456",
    lat:"41.6001265000002",
    lon:"-76.24567499999674" },
  { id:"019-21456",
    lat:"41.6021655000013",
    lon:"-76.40074600000428" },
  { id:"019-21456",
    lat:"41.60072499999985",
    lon:"-76.23073899999997" },
  { id:"019-21456",
    lat:"41.601491999999865",
    lon:"-76.278242" },
  { id:"019-21456",
    lat:"41.60528650000057",
    lon:"-76.56743150000376" },
  { id:"019-21456",
    lat:"41.602094500000106",
    lon:"-76.26764149999718" },
  { id:"019-21456",
    lat:"41.60436991580765",
    lon:"-75.95549038101069" },
  { id:"019-21456",
    lat:"41.61478013182497",
    lon:"-77.87646178855546" },
  { id:"019-21456",
    lat:"41.60135147616413",
    lon:"-75.97318201106236" },
  { id:"019-21456",
    lat:"41.6083500000029",
    lon:"-76.37351250000245" },
  { id:"019-21456",
    lat:"41.61513300018272",
    lon:"-77.1465834997296" },
  { id:"019-21456",
    lat:"41.60504998138384",
    lon:"-75.99347222541513" },
  { id:"019-21456",
    lat:"41.604096735201516",
    lon:"-76.00546440307727" },
  { id:"019-21456",
    lat:"41.608741999999836",
    lon:"-76.38949999999998" },
  { id:"019-21456",
    lat:"41.61381899999984",
    lon:"-76.79491100000001" },
  { id:"019-21456",
    lat:"41.61138199995263",
    lon:"-76.548339" },
  { id:"019-21456",
    lat:"41.60578450025484",
    lon:"-76.07970000812142" },
  { id:"019-21456",
    lat:"41.621271282562375",
    lon:"-78.5040325403379" },
  { id:"019-21456",
    lat:"41.618886032732995",
    lon:"-76.53157894218431" },
  { id:"019-21456",
    lat:"41.61488599999985",
    lon:"-76.296158" },
  { id:"019-21456",
    lat:"41.62177050000167",
    lon:"-76.89740850001125" },
  { id:"019-21456",
    lat:"41.61453750000292",
    lon:"-75.83279549999936" },
  { id:"019-21456",
    lat:"41.62644600241561",
    lon:"-78.71174446921084" },
  { id:"019-21456",
    lat:"41.618051518688205",
    lon:"-76.0126180751581" },
  { id:"019-21456",
    lat:"41.62558851377332",
    lon:"-76.47662249378114" },
  { id:"019-21456",
    lat:"41.62580300001168",
    lon:"-76.49415300000881" },
  { id:"019-21456",
    lat:"41.61816209193457",
    lon:"-76.09381038831037" },
  { id:"019-21456",
    lat:"41.62753051207048",
    lon:"-76.92785600534157" },
  { id:"019-21456",
    lat:"41.61968346902392",
    lon:"-76.19555954984534" },
  { id:"019-21456",
    lat:"41.62812299999985",
    lon:"-76.853965" },
  { id:"019-21456",
    lat:"41.62433535011515",
    lon:"-76.91525389753367" },
  { id:"019-21456",
    lat:"41.6233844413717",
    lon:"-76.82515558090064" },
  { id:"019-21456",
    lat:"41.61715450000697",
    lon:"-76.28882350000778" },
  { id:"019-21456",
    lat:"41.61485799999984",
    lon:"-76.021011" },
  { id:"019-21456",
    lat:"41.626274999999865",
    lon:"-77.125542" },
  { id:"019-21456",
    lat:"41.62048600000114",
    lon:"-76.46086400000443" },
  { id:"019-21456",
    lat:"41.62571659855438",
    lon:"-77.04566769892647" },
  { id:"019-21456",
    lat:"41.620994500002574",
    lon:"-76.48158599999674" },
  { id:"019-21456",
    lat:"41.62624439573142",
    lon:"-78.41608877339121" },
  { id:"019-21456",
    lat:"41.621722500000004",
    lon:"-76.4497584999987" },
  { id:"019-21456",
    lat:"41.61326800000257",
    lon:"-76.36720600000268" },
  { id:"019-21456",
    lat:"41.616233437412674",
    lon:"-76.6518557469666" },
  { id:"019-21456",
    lat:"41.61748737215453",
    lon:"-78.44797019682373" },
  { id:"019-21456",
    lat:"41.60751918718934",
    lon:"-76.02821397848886" },
  { id:"019-21456",
    lat:"41.61585297957538",
    lon:"-76.6850204619043" },
  { id:"019-21456",
    lat:"41.61931829108898",
    lon:"-78.43235819543861" },
  { id:"019-21456",
    lat:"41.608502256541165",
    lon:"-75.97332904409159" },
  { id:"019-21456",
    lat:"41.61923200835922",
    lon:"-76.9358775410515" },
  { id:"019-21456",
    lat:"41.61912753627047",
    lon:"-76.88503301582273" },
  { id:"019-21456",
    lat:"41.610940500003245",
    lon:"-76.05821400000065" },
  { id:"019-21456",
    lat:"41.61276749920739",
    lon:"-76.31240567912516" },
  { id:"019-21456",
    lat:"41.61341685808844",
    lon:"-76.33666319417102" },
  { id:"019-21456",
    lat:"41.61652250000114",
    lon:"-76.56107500000432" },
  { id:"019-21456",
    lat:"41.61617400000278",
    lon:"-76.49978199999721" },
  { id:"019-21456",
    lat:"41.636703487551884",
    lon:"-78.39989141393994" },
  { id:"019-21456",
    lat:"41.63736250775182",
    lon:"-78.36993425887962" },
  { id:"019-21456",
    lat:"41.62504639060443",
    lon:"-75.9379226041007" },
  { id:"019-21456",
    lat:"41.6254080000276",
    lon:"-75.96040399990642" },
  { id:"019-21456",
    lat:"41.62607664812024",
    lon:"-75.98777067774343" },
  { id:"019-21456",
    lat:"41.63017499999985",
    lon:"-76.555567" },
  { id:"019-21456",
    lat:"41.62622650000365",
    lon:"-76.18805400001538" },
  { id:"019-21456",
    lat:"41.62686797236232",
    lon:"-76.25126550031261" },
  { id:"019-21456",
    lat:"41.62695300001165",
    lon:"-76.17742499998879" },
  { id:"019-21456",
    lat:"41.62783899999983",
    lon:"-76.28237499999997" },
  { id:"019-21456",
    lat:"41.62842650000003",
    lon:"-76.27191649999827" },
  { id:"019-21456",
    lat:"41.62858697703619",
    lon:"-76.21008950483163" },
  { id:"019-21456",
    lat:"41.62782354748811",
    lon:"-76.07394270342651" },
  { id:"019-21456",
    lat:"41.62928028182706",
    lon:"-76.12944433248576" },
  { id:"019-21456",
    lat:"41.637932999999855",
    lon:"-78.863731" },
  { id:"019-21456",
    lat:"41.628877500000065",
    lon:"-75.878097" },
  { id:"019-21456",
    lat:"41.63928599999985",
    lon:"-78.72450000000002" },
  { id:"019-21456",
    lat:"41.628959507797916",
    lon:"-75.92445953022657" },
  { id:"019-21456",
    lat:"41.63217816221298",
    lon:"-76.05502480729588" },
  { id:"019-21456",
    lat:"41.64533998728293",
    lon:"-77.29056164492815" },
  { id:"019-21456",
    lat:"41.64051399999985",
    lon:"-76.767236" },
  { id:"019-21456",
    lat:"41.63384699999984",
    lon:"-76.16110599999999" },
  { id:"019-21456",
    lat:"41.63450299999986",
    lon:"-75.873264" },
  { id:"019-21456",
    lat:"41.64116000000325",
    lon:"-76.35108600000173" },
  { id:"019-21456",
    lat:"41.641600000000075",
    lon:"-76.3834875000019" },
  { id:"019-21456",
    lat:"41.645252999999855",
    lon:"-76.82976399999998" },
  { id:"019-21456",
    lat:"41.64194550000313",
    lon:"-76.36038049999938" },
  { id:"019-21456",
    lat:"41.63861950000058",
    lon:"-76.09875650000374" },
  { id:"019-21456",
    lat:"41.63928020815117",
    lon:"-75.97334061501572" },
  { id:"019-21456",
    lat:"41.65126400008543",
    lon:"-77.06527499975198" },
  { id:"019-21456",
    lat:"41.64166470416658",
    lon:"-76.01556312282428" },
  { id:"019-21456",
    lat:"41.64600549999989",
    lon:"-76.32279399999999" },
  { id:"019-21456",
    lat:"41.64987718380073",
    lon:"-77.26522809228501" },
  { id:"019-21456",
    lat:"41.64444600000988",
    lon:"-76.54419400003002" },
  { id:"019-21456",
    lat:"41.64259710085782",
    lon:"-76.3740066853092" },
  { id:"019-21456",
    lat:"41.647412499864735",
    lon:"-76.65005549916613" },
  { id:"019-21456",
    lat:"41.63055251546988",
    lon:"-75.89067643122438" },
  { id:"019-21456",
    lat:"41.64354699999985",
    lon:"-77.07610299999999" },
  { id:"019-21456",
    lat:"41.64360599999986",
    lon:"-76.946411" },
  { id:"019-21456",
    lat:"41.63036538117535",
    lon:"-75.90309588872141" },
  { id:"019-21456",
    lat:"41.63391764958445",
    lon:"-76.11763349334893" },
  { id:"019-21456",
    lat:"41.632770031598504",
    lon:"-76.0405301951608" },
  { id:"019-21456",
    lat:"41.634495685288215",
    lon:"-76.10783642271683" },
  { id:"019-21456",
    lat:"41.64575996310014",
    lon:"-77.25599351037555" },
  { id:"019-21456",
    lat:"41.63310697332681",
    lon:"-75.91575391472335" },
  { id:"019-21456",
    lat:"41.64280599999985",
    lon:"-76.78555300000001" },
  { id:"019-21456",
    lat:"41.642657999999855",
    lon:"-76.75786899999999" },
  { id:"019-21456",
    lat:"41.639517988137634",
    lon:"-76.39523647913914" },
  { id:"019-21456",
    lat:"41.63111800000128",
    lon:"-76.16806800000415" },
  { id:"019-21456",
    lat:"41.64058021916397",
    lon:"-78.32351105779668" },
  { id:"019-21456",
    lat:"41.63443650000028",
    lon:"-76.40491549999714" },
  { id:"019-21456",
    lat:"41.63440550000312",
    lon:"-76.41534149999895" },
  { id:"019-21456",
    lat:"41.63800591794213",
    lon:"-76.71170447298478" },
  { id:"019-21456",
    lat:"41.63069200000177",
    lon:"-76.15244299999549" },
  { id:"019-21456",
    lat:"41.631782999999864",
    lon:"-76.24495300000001" },
  { id:"019-21456",
    lat:"41.639931017234716",
    lon:"-77.11320857415892" },
  { id:"019-21456",
    lat:"41.63953761894998",
    lon:"-77.08882033573029" },
  { id:"019-21456",
    lat:"41.641403909329696",
    lon:"-78.36315954055087" },
  { id:"019-21456",
    lat:"41.64177498398852",
    lon:"-77.03655799338091" },
  { id:"019-21456",
    lat:"41.63209179237457",
    lon:"-76.06342638800498" },
  { id:"019-21456",
    lat:"41.62611699999986",
    lon:"-76.43947200000001" },
  { id:"019-21456",
    lat:"41.620647000140686",
    lon:"-75.946092" },
  { id:"019-21456",
    lat:"41.621509001702876",
    lon:"-75.99469877976956" },
  { id:"019-21456",
    lat:"41.633393694516336",
    lon:"-77.1216882795889" },
  { id:"019-21456",
    lat:"41.62725000000003",
    lon:"-76.4271775000016" },
  { id:"019-21456",
    lat:"41.59828899999986",
    lon:"-79.209489" },
  { id:"019-21456",
    lat:"41.59583993724444",
    lon:"-76.12037211119159" },
  { id:"019-21456",
    lat:"41.60520326666431",
    lon:"-78.47090854814894" },
  { id:"019-21456",
    lat:"41.604756529095035",
    lon:"-78.45464125740413" },
  { id:"019-21456",
    lat:"41.60364446073012",
    lon:"-76.91749211226697" },
  { id:"019-21456",
    lat:"41.600435999999846",
    lon:"-76.53322800000001" },
  { id:"019-21456",
    lat:"41.605119038298106",
    lon:"-78.35125007488527" },
  { id:"019-21456",
    lat:"41.60591254146725",
    lon:"-77.19174451911289" },
  { id:"019-21456",
    lat:"41.60044988245685",
    lon:"-76.61689561396952" },
  { id:"019-21456",
    lat:"41.596896999999814",
    lon:"-76.17435799999998" },
  { id:"019-21456",
    lat:"41.60483599999987",
    lon:"-76.85511900000003" },
  { id:"019-21456",
    lat:"41.59678429804291",
    lon:"-76.15225182827677" },
  { id:"019-21456",
    lat:"41.597447531156504",
    lon:"-76.19525049696372" },
  { id:"019-21456",
    lat:"41.59685520047346",
    lon:"-76.16227468550058" },
  { id:"019-21456",
    lat:"41.59793159668773",
    lon:"-76.1432334126249" },
  { id:"019-21456",
    lat:"41.59996400003354",
    lon:"-77.2394045000672" },
  { id:"019-21456",
    lat:"41.590121999999845",
    lon:"-76.18202499999998" },
  { id:"019-21456",
    lat:"41.59198099999985",
    lon:"-76.315875" },
  { id:"019-21456",
    lat:"41.591899999999846",
    lon:"-76.42615300000001" },
  { id:"019-21456",
    lat:"41.59248899999986",
    lon:"-76.448011" },
  { id:"019-21456",
    lat:"41.59904055307965",
    lon:"-77.20771849906271" },
  { id:"019-21456",
    lat:"41.59680662685033",
    lon:"-78.53220702112162" },
  { id:"019-21456",
    lat:"41.59000950001135",
    lon:"-76.06124549998772" },
  { id:"019-21456",
    lat:"41.592399999999856",
    lon:"-76.32561899999999" },
  { id:"019-21456",
    lat:"41.59277199999984",
    lon:"-76.303067" },
  { id:"019-21456",
    lat:"41.592629533613646",
    lon:"-76.28227899960298" },
  { id:"019-21456",
    lat:"41.60041250577011",
    lon:"-77.22434753661551" },
  { id:"019-21456",
    lat:"41.59430245493934",
    lon:"-76.34600942217911" },
  { id:"019-21456",
    lat:"41.60120675515509",
    lon:"-78.33788823816359" },
  { id:"019-21456",
    lat:"41.596805500345305",
    lon:"-76.58130292714634" },
  { id:"019-21456",
    lat:"41.64943450000323",
    lon:"-76.30754699999935" },
  { id:"019-21456",
    lat:"41.65360299999984",
    lon:"-76.63397799999998" },
  { id:"019-21456",
    lat:"41.654336457021344",
    lon:"-76.69318358197481" },
  { id:"019-21456",
    lat:"41.65838899999986",
    lon:"-76.808778" },
  { id:"019-21456",
    lat:"41.65369450000008",
    lon:"-76.29559300000064" },
  { id:"019-21456",
    lat:"41.65333994694106",
    lon:"-76.5391109037038" },
  { id:"019-21456",
    lat:"41.64699854777251",
    lon:"-75.96187833460746" },
  { id:"019-21456",
    lat:"41.65015700173938",
    lon:"-76.21231700709025" },
  { id:"019-21456",
    lat:"41.662405999999834",
    lon:"-76.71637799999998" },
  { id:"019-21456",
    lat:"41.65079619967368",
    lon:"-76.04260275839245" },
  { id:"019-21456",
    lat:"41.65316100000056",
    lon:"-76.08447500000712" },
  { id:"019-21456",
    lat:"41.65248102826108",
    lon:"-76.03298628899863" },
  { id:"019-21456",
    lat:"41.65147499708977",
    lon:"-75.93268482347177" },
  { id:"019-21456",
    lat:"41.652105687316634",
    lon:"-75.90947135399689" },
  { id:"019-21456",
    lat:"41.658950875540214",
    lon:"-76.50735647603972" },
  { id:"019-21456",
    lat:"41.6605419576774",
    lon:"-76.679088926641" },
  { id:"019-21456",
    lat:"41.66737400000546",
    lon:"-78.47289699999611" },
  { id:"019-21456",
    lat:"41.66642499999987",
    lon:"-76.709769" },
  { id:"019-21456",
    lat:"41.66735599999985",
    lon:"-76.740831" },
  { id:"019-21456",
    lat:"41.66957808313625",
    lon:"-77.00757924759641" },
  { id:"019-21456",
    lat:"41.66020599999987",
    lon:"-75.75538300000001" },
  { id:"019-21456",
    lat:"41.66023900070975",
    lon:"-75.89062654262331" },
  { id:"019-21456",
    lat:"41.659798739378296",
    lon:"-75.86057198771401" },
  { id:"019-21456",
    lat:"41.671178999999846",
    lon:"-78.253747" },
  { id:"019-21456",
    lat:"41.66079262121608",
    lon:"-75.9968791575265" },
  { id:"019-21456",
    lat:"41.66201500000056",
    lon:"-76.16652049999654" },
  { id:"019-21456",
    lat:"41.671398696805056",
    lon:"-77.10740849713879" },
  { id:"019-21456",
    lat:"41.67315850047732",
    lon:"-77.60590799882982" },
  { id:"019-21456",
    lat:"41.66914399999987",
    lon:"-76.70064999999998" },
  { id:"019-21456",
    lat:"41.673412500004616",
    lon:"-78.2645890000094" },
  { id:"019-21456",
    lat:"41.66735299999984",
    lon:"-76.49932800000002" },
  { id:"019-21456",
    lat:"41.66323344764787",
    lon:"-76.1597611364668" },
  { id:"019-21456",
    lat:"41.67276434803238",
    lon:"-76.96978803125033" },
  { id:"019-21456",
    lat:"41.67144199999985",
    lon:"-76.78515000000003" },
  { id:"019-21456",
    lat:"41.67139199999984",
    lon:"-76.77476400000002" },
  { id:"019-21456",
    lat:"41.66862637526705",
    lon:"-76.46105621665963" },
  { id:"019-21456",
    lat:"41.65166350180032",
    lon:"-75.8372259925821" },
  { id:"019-21456",
    lat:"41.6679405001626",
    lon:"-77.61474400080631" },
  { id:"019-21456",
    lat:"41.66558750000222",
    lon:"-76.98893350001298" },
  { id:"019-21456",
    lat:"41.66289150000011",
    lon:"-76.72608199999789" },
  { id:"019-21456",
    lat:"41.66607400037518",
    lon:"-76.98032800895119" },
  { id:"019-21456",
    lat:"41.65341095857724",
    lon:"-75.867589" },
  { id:"019-21456",
    lat:"41.65570791448951",
    lon:"-76.01220268498994" },
  { id:"019-21456",
    lat:"41.6580390007905",
    lon:"-76.20745157594308" },
  { id:"019-21456",
    lat:"41.65796500000042",
    lon:"-76.27543599999696" },
  { id:"019-21456",
    lat:"41.658052500002555",
    lon:"-76.28674399999674" },
  { id:"019-21456",
    lat:"41.65554367882437",
    lon:"-75.96037731393234" },
  { id:"019-21456",
    lat:"41.66847200001282",
    lon:"-77.41571650002581" },
  { id:"019-21456",
    lat:"41.658452515795986",
    lon:"-76.17839749242393" },
  { id:"019-21456",
    lat:"41.66258934384887",
    lon:"-76.52810446501019" },
  { id:"019-21456",
    lat:"41.65973836030934",
    lon:"-76.18850849856852" },
  { id:"019-21456",
    lat:"41.660416503219466",
    lon:"-76.24593901279383" },
  { id:"019-21456",
    lat:"41.67939399999985",
    lon:"-78.502183" },
  { id:"019-21456",
    lat:"41.67898200015097",
    lon:"-78.49834149982783" },
  { id:"019-21456",
    lat:"41.66562903600079",
    lon:"-75.89520401511881" },
  { id:"019-21456",
    lat:"41.66905230410335",
    lon:"-76.11053045780368" },
  { id:"019-21456",
    lat:"41.672489500003046",
    lon:"-76.36447549998594" },
  { id:"019-21456",
    lat:"41.684103999999834",
    lon:"-78.32666600000002" },
  { id:"019-21456",
    lat:"41.685577506615864",
    lon:"-77.60381451627204" },
  { id:"019-21456",
    lat:"41.684861000075244",
    lon:"-77.41825949270117" },
  { id:"019-21456",
    lat:"41.67180950000326",
    lon:"-76.01677200000066" },
  { id:"019-21456",
    lat:"41.67049254676571",
    lon:"-75.9327087044106" },
  { id:"019-21456",
    lat:"41.68220700334232",
    lon:"-76.9586455001664" },
  { id:"019-21456",
    lat:"41.682465562869496",
    lon:"-76.96547502376738" },
  { id:"019-21456",
    lat:"41.67143900003546",
    lon:"-75.95225950006576" },
  { id:"019-21456",
    lat:"41.67272184427472",
    lon:"-75.98865424924047" },
  { id:"019-21456",
    lat:"41.68042799999984",
    lon:"-76.66728099999999" },
  { id:"019-21456",
    lat:"41.67267099532462",
    lon:"-76.23820450464018" },
  { id:"019-21456",
    lat:"41.67404014989894",
    lon:"-76.3779708396513" },
  { id:"019-21456",
    lat:"41.680805008759855",
    lon:"-77.13744501604914" },
  { id:"019-21456",
    lat:"41.674968999999855",
    lon:"-76.39167800000001" },
  { id:"019-21456",
    lat:"41.668811000002265",
    lon:"-75.89702950000398" },
  { id:"019-21456",
    lat:"41.68145143930895",
    lon:"-77.0003693917096" },
  { id:"019-21456",
    lat:"41.67909699605824",
    lon:"-76.67515852895532" },
  { id:"019-21456",
    lat:"41.672329500051745",
    lon:"-75.76569849999747" },
  { id:"019-21456",
    lat:"41.686793999999864",
    lon:"-78.624101" },
  { id:"019-21456",
    lat:"41.69035700001692",
    lon:"-77.57504200008755" },
  { id:"019-21456",
    lat:"41.69051899999985",
    lon:"-77.631875" },
  { id:"019-21456",
    lat:"41.68422100000278",
    lon:"-76.2912180000028" },
  { id:"019-21456",
    lat:"41.69009450246337",
    lon:"-76.85266505603457" },
  { id:"019-21456",
    lat:"41.682440000042966",
    lon:"-76.13854303399262" },
  { id:"019-21456",
    lat:"41.678651500012485",
    lon:"-75.87768500000125" },
  { id:"019-21456",
    lat:"41.691178091028675",
    lon:"-76.95606246527277" },
  { id:"019-21456",
    lat:"41.674440000012574",
    lon:"-75.83861500024666" },
  { id:"019-21456",
    lat:"41.681755500002275",
    lon:"-76.34400149999585" },
  { id:"019-21456",
    lat:"41.68162279382975",
    lon:"-76.26076668879817" },
  { id:"019-21456",
    lat:"41.677231496118324",
    lon:"-75.83552498383025" },
  { id:"019-21456",
    lat:"41.67908500000004",
    lon:"-76.04739149999824" },
  { id:"019-21456",
    lat:"41.679631000014005",
    lon:"-76.06932400002194" },
  { id:"019-21456",
    lat:"41.69130556890528",
    lon:"-77.11248356497454" },
  { id:"019-21456",
    lat:"41.69062098337307",
    lon:"-77.08718620466423" },
  { id:"019-21456",
    lat:"41.67812799999985",
    lon:"-75.90934799999998" },
  { id:"019-21456",
    lat:"41.683153808069044",
    lon:"-76.32229782004573" },
  { id:"019-21456",
    lat:"41.68679399999984",
    lon:"-76.64411399999999" },
  { id:"019-21456",
    lat:"41.684067000003395",
    lon:"-76.35695099998493" },
  { id:"019-21456",
    lat:"41.68418749999992",
    lon:"-76.33630699999968" },
  { id:"019-21456",
    lat:"41.67156089714615",
    lon:"-75.80851130196939" },
  { id:"019-21456",
    lat:"41.67161100000325",
    lon:"-75.8555" },
  { id:"019-21456",
    lat:"41.68321250000258",
    lon:"-76.65604400000251" },
  { id:"019-21456",
    lat:"41.683666499793546",
    lon:"-76.83392904246243" },
  { id:"019-21456",
    lat:"41.67463119150792",
    lon:"-76.00252288057494" },
  { id:"019-21456",
    lat:"41.672373501709764",
    lon:"-75.79973200495802" },
  { id:"019-21456",
    lat:"41.688848999999855",
    lon:"-77.66127100000001" },
  { id:"019-21456",
    lat:"41.67571116360638",
    lon:"-76.03238583613319" },
  { id:"019-21456",
    lat:"41.6756419584353",
    lon:"-75.97288607978233" },
  { id:"019-21456",
    lat:"41.687086136230405",
    lon:"-77.12742111552298" },
  { id:"019-21456",
    lat:"41.68754549887183",
    lon:"-77.07893075256197" },
  { id:"019-21456",
    lat:"41.68953653336779",
    lon:"-77.56087640608521" },
  { id:"019-21456",
    lat:"41.68759445149988",
    lon:"-76.99535952431047" },
  { id:"019-21456",
    lat:"41.68346302426573",
    lon:"-76.50620049377902" },
  { id:"019-21456",
    lat:"41.68102650000256",
    lon:"-76.31092499999636" },
  { id:"019-21456",
    lat:"41.67450499999986",
    lon:"-78.506517" },
  { id:"019-21456",
    lat:"41.67539399999986",
    lon:"-78.50285" },
  { id:"019-21456",
    lat:"41.66688749340053",
    lon:"-76.14901247298447" },
  { id:"019-21456",
    lat:"41.67784099999988",
    lon:"-77.581231" },
  { id:"019-21456",
    lat:"41.67542889423004",
    lon:"-76.97833145357157" },
  { id:"019-21456",
    lat:"41.662434226228186",
    lon:"-75.81929998402609" },
  { id:"019-21456",
    lat:"41.66233599999985",
    lon:"-75.848922" },
  { id:"019-21456",
    lat:"41.67347799999985",
    lon:"-76.689286" },
  { id:"019-21456",
    lat:"41.66682393513335",
    lon:"-76.0949223966839" },
  { id:"019-21456",
    lat:"41.66552782621489",
    lon:"-76.12653284482334" },
  { id:"019-21456",
    lat:"41.662480999999836",
    lon:"-75.77676699999999" },
  { id:"019-21456",
    lat:"41.68004316076092",
    lon:"-77.58037669391571" },
  { id:"019-21456",
    lat:"41.67887199999984",
    lon:"-77.43804999999998" },
  { id:"019-21456",
    lat:"41.669566999999866",
    lon:"-76.22265" },
  { id:"019-21456",
    lat:"41.67318299999985",
    lon:"-76.524672" },
  { id:"019-21456",
    lat:"41.67919003686029",
    lon:"-77.38771939596965" },
  { id:"019-21456",
    lat:"41.67812101787534",
    lon:"-77.0378710817808" },
  { id:"019-21456",
    lat:"41.69907982856083",
    lon:"-77.54843957929086" },
  { id:"019-21456",
    lat:"41.682463999999854",
    lon:"-75.728392" },
  { id:"019-21456",
    lat:"41.68223151192456",
    lon:"-75.78325704399604" },
  { id:"019-21456",
    lat:"41.682749041926414",
    lon:"-75.7991667046914" },
  { id:"019-21456",
    lat:"41.683951000023015",
    lon:"-75.9057499999243" },
  { id:"019-21456",
    lat:"41.68592132443105",
    lon:"-76.06172724010423" },
  { id:"019-21456",
    lat:"41.694666524802535",
    lon:"-76.84268754766978" },
  { id:"019-21456",
    lat:"41.69189699149669",
    lon:"-76.46602353802301" },
  { id:"019-21456",
    lat:"41.698052393815",
    lon:"-76.96490688391135" },
  { id:"019-21456",
    lat:"41.69525799999985",
    lon:"-76.77861400000002" },
  { id:"019-21456",
    lat:"41.68406250005172",
    lon:"-75.87475150000253" },
  { id:"019-21456",
    lat:"41.68589799999987",
    lon:"-75.71342299999999" },
  { id:"019-21456",
    lat:"41.70406600215641",
    lon:"-77.56171599988002" },
  { id:"019-21456",
    lat:"41.70255700006603",
    lon:"-76.805704000028" },
  { id:"019-21456",
    lat:"41.68719399999988",
    lon:"-75.74731399999999" },
  { id:"019-21456",
    lat:"41.688478004380876",
    lon:"-75.79452649710994" },
  { id:"019-21456",
    lat:"41.70521248455084",
    lon:"-77.53114596753677" },
  { id:"019-21456",
    lat:"41.70179540654591",
    lon:"-76.97225771149654" },
  { id:"019-21456",
    lat:"41.69448496890902",
    lon:"-76.17648200017612" },
  { id:"019-21456",
    lat:"41.70326797270447",
    lon:"-76.94834981776029" },
  { id:"019-21456",
    lat:"41.683862358961996",
    lon:"-75.74087095852848" },
  { id:"019-21456",
    lat:"41.69741650000023",
    lon:"-76.74744849999671" },
  { id:"019-21456",
    lat:"41.690766999999866",
    lon:"-76.185386" },
  { id:"019-21456",
    lat:"41.688776038563255",
    lon:"-75.97065228659382" },
  { id:"019-21456",
    lat:"41.68605897876231",
    lon:"-75.90503682277688" },
  { id:"019-21456",
    lat:"41.69683599999984",
    lon:"-76.59853099999998" },
  { id:"019-21456",
    lat:"41.68840204078251",
    lon:"-75.92170591618392" },
  { id:"019-21456",
    lat:"41.69710149446245",
    lon:"-76.58809648927604" },
  { id:"019-21456",
    lat:"41.689490500002265",
    lon:"-75.98811250000345" },
  { id:"019-21456",
    lat:"41.696346999999854",
    lon:"-76.479019" },
  { id:"019-21456",
    lat:"41.69739199999985",
    lon:"-76.56536400000002" },
  { id:"019-21456",
    lat:"41.69369450000204",
    lon:"-76.21538049999603" },
  { id:"019-21456",
    lat:"41.69424543422067",
    lon:"-76.23781978762054" },
  { id:"019-21456",
    lat:"41.69124998361171",
    lon:"-76.01979997030135" },
  { id:"019-21456",
    lat:"41.70912750000084",
    lon:"-78.73308049999017" },
  { id:"019-21456",
    lat:"41.69481251003685",
    lon:"-75.81511947724579" },
  { id:"019-21456",
    lat:"41.710277500004715",
    lon:"-77.5263555000274" },
  { id:"019-21456",
    lat:"41.708680316874215",
    lon:"-77.02556966507693" },
  { id:"019-21456",
    lat:"41.69660550000146",
    lon:"-75.92552499999603" },
  { id:"019-21456",
    lat:"41.70583299999985",
    lon:"-76.540242" },
  { id:"019-21456",
    lat:"41.69665599999985",
    lon:"-75.90718099999997" },
  { id:"019-21456",
    lat:"41.694051500047564",
    lon:"-75.96414599988181" },
  { id:"019-21456",
    lat:"41.69676503465844",
    lon:"-76.10763046629245" },
  { id:"019-21456",
    lat:"41.705349500030806",
    lon:"-76.99152650003447" },
  { id:"019-21456",
    lat:"41.69585850000042",
    lon:"-76.1594970000033" },
  { id:"019-21456",
    lat:"41.69448783622495",
    lon:"-75.93833794739123" },
  { id:"019-21456",
    lat:"41.70559136123625",
    lon:"-76.93460793201218" },
  { id:"019-21456",
    lat:"41.704019500000065",
    lon:"-76.72212499999821" },
  { id:"019-21456",
    lat:"41.69454949396857",
    lon:"-75.92702650282001" },
  { id:"019-21456",
    lat:"41.70173599999987",
    lon:"-76.442658" },
  { id:"019-21456",
    lat:"41.70243876563214",
    lon:"-76.4552264847975" },
  { id:"019-21456",
    lat:"41.701021236822456",
    lon:"-75.88692095934" },
  { id:"019-21456",
    lat:"41.700827999999866",
    lon:"-75.88981700000001" },
  { id:"019-21456",
    lat:"41.70811699999985",
    lon:"-76.393275" },
  { id:"019-21456",
    lat:"41.70239850001855",
    lon:"-75.95525949997317" },
  { id:"019-21456",
    lat:"41.703901310771",
    lon:"-76.04674549552904" },
  { id:"019-21456",
    lat:"41.703263999999855",
    lon:"-75.75159200000002" },
  { id:"019-21456",
    lat:"41.70544199999986",
    lon:"-75.866018" },
  { id:"019-21456",
    lat:"41.72039899999986",
    lon:"-78.372937" },
  { id:"019-21456",
    lat:"41.71820658416283",
    lon:"-76.85543644194959" },
  { id:"019-21456",
    lat:"41.714324999999846",
    lon:"-76.42263300000002" },
  { id:"019-21456",
    lat:"41.711966999999845",
    lon:"-76.32027499999998" },
  { id:"019-21456",
    lat:"41.70851254453885",
    lon:"-76.0242124781135" },
  { id:"019-21456",
    lat:"41.71246699999984",
    lon:"-76.29918299999999" },
  { id:"019-21456",
    lat:"41.7076281710297",
    lon:"-75.92896312088274" },
  { id:"019-21456",
    lat:"41.708754701470696",
    lon:"-76.01490252946955" },
  { id:"019-21456",
    lat:"41.70351699999985",
    lon:"-75.92003399999999" },
  { id:"019-21456",
    lat:"41.709720999999874",
    lon:"-76.369085" },
  { id:"019-21456",
    lat:"41.70293050000581",
    lon:"-75.90744199997356" },
  { id:"019-21456",
    lat:"41.717119500006696",
    lon:"-77.89988499995346" },
  { id:"019-21456",
    lat:"41.70337199999984",
    lon:"-75.874872" },
  { id:"019-21456",
    lat:"41.703812500005235",
    lon:"-75.8813699999889" },
  { id:"019-21456",
    lat:"41.7028013568084",
    lon:"-75.78657953447467" },
  { id:"019-21456",
    lat:"41.70645150000771",
    lon:"-75.66255850003468" },
  { id:"019-21456",
    lat:"41.72803031713616",
    lon:"-78.16829188976554" },
  { id:"019-21456",
    lat:"41.710009544090575",
    lon:"-75.65435611475276" },
  { id:"019-21456",
    lat:"41.72601144382075",
    lon:"-77.92780390911629" },
  { id:"019-21456",
    lat:"41.725558162913615",
    lon:"-77.4057561369569" },
  { id:"019-21456",
    lat:"41.71206800000331",
    lon:"-75.86455149998511" },
  { id:"019-21456",
    lat:"41.71164699999986",
    lon:"-75.88686399999999" },
  { id:"019-21456",
    lat:"41.711870500005816",
    lon:"-75.90089999997299" },
  { id:"019-21456",
    lat:"41.72294749321122",
    lon:"-76.79945449743947" },
  { id:"019-21456",
    lat:"41.712807000006116",
    lon:"-75.94667600000587" },
  { id:"019-21456",
    lat:"41.72701848605653",
    lon:"-77.15800600014111" },
  { id:"019-21456",
    lat:"41.71646900000057",
    lon:"-76.13567849999653" },
  { id:"019-21456",
    lat:"41.720031988718645",
    lon:"-76.41265048012376" },
  { id:"019-21456",
    lat:"41.71564750002484",
    lon:"-75.97233199999356" },
  { id:"019-21456",
    lat:"41.72020550000044",
    lon:"-76.2838749999967" },
  { id:"019-21456",
    lat:"41.72442096658739",
    lon:"-76.81969697905636" },
  { id:"019-21456",
    lat:"41.71311899999985",
    lon:"-75.87107399999998" },
  { id:"019-21456",
    lat:"41.71315299999984",
    lon:"-75.87792699999997" },
  { id:"019-21456",
    lat:"41.72423491643096",
    lon:"-76.81150012595711" },
  { id:"019-21456",
    lat:"41.71850950000223",
    lon:"-76.27405149999656" },
  { id:"019-21456",
    lat:"41.724499999999864",
    lon:"-76.805756" },
  { id:"019-21456",
    lat:"41.724869739573606",
    lon:"-76.78277456670239" },
  { id:"019-21456",
    lat:"41.71685800000256",
    lon:"-76.076531" },
  { id:"019-21456",
    lat:"41.717356999999915",
    lon:"-76.14753750000048" },
  { id:"019-21456",
    lat:"41.71468899999997",
    lon:"-75.88469850000067" },
  { id:"019-21456",
    lat:"41.717889295292544",
    lon:"-76.09719957803831" },
  { id:"019-21456",
    lat:"41.7191264999999",
    lon:"-76.12773749999953" },
  { id:"019-21456",
    lat:"41.72252199999985",
    lon:"-76.341614" },
  { id:"019-21456",
    lat:"41.71648499582524",
    lon:"-75.96174452054309" },
  { id:"019-21456",
    lat:"41.71711950000921",
    lon:"-75.9438075000061" },
  { id:"019-21456",
    lat:"41.70603200124037",
    lon:"-75.71236814196317" },
  { id:"019-21456",
    lat:"41.710888000120356",
    lon:"-76.08409750014609" },
  { id:"019-21456",
    lat:"41.71301949709595",
    lon:"-76.20958897223801" },
  { id:"019-21456",
    lat:"41.71498050000029",
    lon:"-76.36638749999717" },
  { id:"019-21456",
    lat:"41.71531100000153",
    lon:"-76.35577250000419" },
  { id:"019-21456",
    lat:"41.70799999999984",
    lon:"-75.87125599999999" },
  { id:"019-21456",
    lat:"41.70852999999985",
    lon:"-75.88008300000001" },
  { id:"019-21456",
    lat:"41.714709999999926",
    lon:"-76.29068199999968" },
  { id:"019-21456",
    lat:"41.71534056495896",
    lon:"-76.34108830332" },
  { id:"019-21456",
    lat:"41.70942800000991",
    lon:"-75.91856549993946" },
  { id:"019-21456",
    lat:"41.71607199999985",
    lon:"-76.31220299999998" },
  { id:"019-21456",
    lat:"41.70962192904968",
    lon:"-75.90643930819661" },
  { id:"019-21456",
    lat:"41.721820925883996",
    lon:"-76.82542790197898" },
  { id:"019-21456",
    lat:"41.72534399999986",
    lon:"-77.702339" },
  { id:"019-21456",
    lat:"41.69511698914038",
    lon:"-75.7541944545229" },
  { id:"019-21456",
    lat:"41.7133290005078",
    lon:"-77.91270549806816" },
  { id:"019-21456",
    lat:"41.69796481265144",
    lon:"-75.83061255993898" },
  { id:"019-21456",
    lat:"41.69763151259744",
    lon:"-75.84005995903064" },
  { id:"019-21456",
    lat:"41.69762497578897",
    lon:"-75.85503198062968" },
  { id:"019-21456",
    lat:"41.71044281466669",
    lon:"-76.9858719712736" },
  { id:"019-21456",
    lat:"41.70545700000256",
    lon:"-76.4337559999973" },
  { id:"019-21456",
    lat:"41.69843200000746",
    lon:"-75.89273050002566" },
  { id:"019-21456",
    lat:"41.69884700663127",
    lon:"-75.91048225149859" },
  { id:"019-21456",
    lat:"41.69964647713613",
    lon:"-75.94402349029366" },
  { id:"019-21456",
    lat:"41.70934699999985",
    lon:"-76.926167" },
  { id:"019-21456",
    lat:"41.69849321009359",
    lon:"-75.9590654036353" },
  { id:"019-21456",
    lat:"41.70458899999985",
    lon:"-76.403325" },
  { id:"019-21456",
    lat:"41.69728900000682",
    lon:"-75.86558149995477" },
  { id:"019-21456",
    lat:"41.706750000000675",
    lon:"-76.558730499992" },
  { id:"019-21456",
    lat:"41.70129300000058",
    lon:"-76.12153299999322" },
  { id:"019-21456",
    lat:"41.69650950154657",
    lon:"-75.7231805835967" },
  { id:"019-21456",
    lat:"41.71416899999985",
    lon:"-78.145144" },
  { id:"019-21456",
    lat:"41.711162523125914",
    lon:"-76.83822910220427" },
  { id:"019-21456",
    lat:"41.710068999999855",
    lon:"-76.69489000000002" },
  { id:"019-21456",
    lat:"41.709192500003105",
    lon:"-76.68250350000191" },
  { id:"019-21456",
    lat:"41.70647399510899",
    lon:"-76.42142249176167" },
  { id:"019-21456",
    lat:"41.706118999999866",
    lon:"-76.38176900000002" },
  { id:"019-21456",
    lat:"41.70816399999986",
    lon:"-76.51229399999998" },
  { id:"019-21456",
    lat:"41.708910974675774",
    lon:"-76.52698588165035" },
  { id:"019-21456",
    lat:"41.70183634234205",
    lon:"-75.98531723303243" },
  { id:"019-21456",
    lat:"41.708885999999865",
    lon:"-76.519282" },
  { id:"019-21456",
    lat:"41.70212248873657",
    lon:"-75.9756864006407" },
  { id:"019-21456",
    lat:"41.69327798593999",
    lon:"-77.12108224143266" },
  { id:"019-21456",
    lat:"41.693720500005114",
    lon:"-77.03130150004604" },
  { id:"019-21456",
    lat:"41.68301064699558",
    lon:"-76.08063574878183" },
  { id:"019-21456",
    lat:"41.68887799999986",
    lon:"-76.63014700000001" },
  { id:"019-21456",
    lat:"41.693090068812026",
    lon:"-76.98132094703216" },
  { id:"019-21456",
    lat:"41.686246999999845",
    lon:"-76.30224699999998" },
  { id:"019-21456",
    lat:"41.68394207662551",
    lon:"-76.12148885238076" },
  { id:"019-21456",
    lat:"41.68611699999986",
    lon:"-76.28118599999999" },
  { id:"019-21456",
    lat:"41.69375159890021",
    lon:"-76.99473059715241" },
  { id:"019-21456",
    lat:"41.68423851749143",
    lon:"-76.09170299169148" },
  { id:"019-21456",
    lat:"41.68871399999985",
    lon:"-76.41719700000002" },
  { id:"019-21456",
    lat:"41.68253200000041",
    lon:"-75.93641700000306" },
  { id:"019-21456",
    lat:"41.69148750000514",
    lon:"-76.6067680000008" },
  { id:"019-21456",
    lat:"41.71534606708258",
    lon:"-75.64211104130035" },
  { id:"019-21456",
    lat:"41.736417999999865",
    lon:"-77.90569900000001" },
  { id:"019-21456",
    lat:"41.71882875357363",
    lon:"-75.63524728438591" },
  { id:"019-21456",
    lat:"41.72327999999987",
    lon:"-75.884552" },
  { id:"019-21456",
    lat:"41.723399999999856",
    lon:"-75.87833000000002" },
  { id:"019-21456",
    lat:"41.71691250001229",
    lon:"-75.68630000003698" },
  { id:"019-21456",
    lat:"41.73480256275234",
    lon:"-77.37408777910707" },
  { id:"019-21456",
    lat:"41.73386250728414",
    lon:"-77.14089751515937" },
  { id:"019-21456",
    lat:"41.732626628467806",
    lon:"-76.81758149769988" },
  { id:"019-21456",
    lat:"41.72958899999985",
    lon:"-76.56941700000002" },
  { id:"019-21456",
    lat:"41.73527646427847",
    lon:"-77.16533080198897" },
  { id:"019-21456",
    lat:"41.72600550000228",
    lon:"-76.17853750000417" },
  { id:"019-21456",
    lat:"41.73493307390291",
    lon:"-76.79292655864126" },
  { id:"019-21456",
    lat:"41.73020704153732",
    lon:"-76.33050554262628" },
  { id:"019-21456",
    lat:"41.73936090045102",
    lon:"-77.89992453130081" },
  { id:"019-21456",
    lat:"41.73279699999986",
    lon:"-76.49637199999998" },
  { id:"019-21456",
    lat:"41.72283884002691",
    lon:"-75.72944830434471" },
  { id:"019-21456",
    lat:"41.72428600000662",
    lon:"-75.871390499972" },
  { id:"019-21456",
    lat:"41.73067050001317",
    lon:"-76.31918650000127" },
  { id:"019-21456",
    lat:"41.725325000211726",
    lon:"-75.90913499982904" },
  { id:"019-21456",
    lat:"41.73208299999987",
    lon:"-76.38244700000001" },
  { id:"019-21456",
    lat:"41.744885000013944",
    lon:"-77.91974099994724" },
  { id:"019-21456",
    lat:"41.72780700000926",
    lon:"-75.68747900003035" },
  { id:"019-21456",
    lat:"41.73350414650255",
    lon:"-76.08323309365306" },
  { id:"019-21456",
    lat:"41.72917199999984",
    lon:"-75.87199299999999" },
  { id:"019-21456",
    lat:"41.73005270448253",
    lon:"-75.90852263559954" },
  { id:"019-21456",
    lat:"41.74268174910327",
    lon:"-77.12044244858623" },
  { id:"019-21456",
    lat:"41.731767000004496",
    lon:"-76.01006749995288" },
  { id:"019-21456",
    lat:"41.73115000955562",
    lon:"-75.92150992725783" },
  { id:"019-21456",
    lat:"41.73119399999984",
    lon:"-75.89140200000001" },
  { id:"019-21456",
    lat:"41.74364550000313",
    lon:"-77.01750850000064" },
  { id:"019-21456",
    lat:"41.73287198963413",
    lon:"-75.9882319908726" },
  { id:"019-21456",
    lat:"41.73116399999985",
    lon:"-75.67428099999998" },
  { id:"019-21456",
    lat:"41.73280399999994",
    lon:"-75.74751950000079" },
  { id:"019-21456",
    lat:"41.746990453476215",
    lon:"-76.81325551954544" },
  { id:"019-21456",
    lat:"41.73798899738984",
    lon:"-75.98752099999538" },
  { id:"019-21456",
    lat:"41.73902547063641",
    lon:"-76.05384143568749" },
  { id:"019-21456",
    lat:"41.73653997628421",
    lon:"-75.86284304784407" },
  { id:"019-21456",
    lat:"41.74689399999986",
    lon:"-76.64488800000002" },
  { id:"019-21456",
    lat:"41.738950250345994",
    lon:"-76.02941722313408" },
  { id:"019-21456",
    lat:"41.746438867542054",
    lon:"-77.20128895439892" },
  { id:"019-21456",
    lat:"41.73368900006467",
    lon:"-75.94074000013592" },
  { id:"019-21456",
    lat:"41.73325950001068",
    lon:"-75.88622199999884" },
  { id:"019-21456",
    lat:"41.73802800000289",
    lon:"-76.26846549999999" },
  { id:"019-21456",
    lat:"41.735390500145755",
    lon:"-76.06096651118833" },
  { id:"019-21456",
    lat:"41.74497275098153",
    lon:"-77.15373722182916" },
  { id:"019-21456",
    lat:"41.733038500004035",
    lon:"-75.95174799999737" },
  { id:"019-21456",
    lat:"41.73885599999985",
    lon:"-76.396097" },
  { id:"019-21456",
    lat:"41.735213499999915",
    lon:"-76.09542950000046" },
  { id:"019-21456",
    lat:"41.73366951280988",
    lon:"-75.98078452296922" },
  { id:"019-21456",
    lat:"41.74670868493212",
    lon:"-77.13717586434021" },
  { id:"019-21456",
    lat:"41.73294299830017",
    lon:"-75.77381800825101" },
  { id:"019-21456",
    lat:"41.732917008885295",
    lon:"-75.82212953253358" },
  { id:"019-21456",
    lat:"41.7328625000004",
    lon:"-75.84088349999466" },
  { id:"019-21456",
    lat:"41.742968999999874",
    lon:"-76.62087100000001" },
  { id:"019-21456",
    lat:"41.74383350000973",
    lon:"-76.70805849998352" },
  { id:"019-21456",
    lat:"41.734332999999864",
    lon:"-75.869335" },
  { id:"019-21456",
    lat:"41.74822903794573",
    lon:"-77.18881390392431" },
  { id:"019-21456",
    lat:"41.74580575368128",
    lon:"-76.78641864875169" },
  { id:"019-21456",
    lat:"41.74062837864891",
    lon:"-77.90567652128124" },
  { id:"019-21456",
    lat:"41.739109874116515",
    lon:"-77.15994248973485" },
  { id:"019-21456",
    lat:"41.739216750772705",
    lon:"-77.10456040582412" },
  { id:"019-21456",
    lat:"41.730551500001894",
    lon:"-76.22663500000954" },
  { id:"019-21456",
    lat:"41.72767426311949",
    lon:"-75.98925513422196" },
  { id:"019-21456",
    lat:"41.72639750000694",
    lon:"-75.89327050000345" },
  { id:"019-21456",
    lat:"41.72634450001764",
    lon:"-75.90303900003019" },
  { id:"019-21456",
    lat:"41.73951150773076",
    lon:"-76.95976356118574" },
  { id:"019-21456",
    lat:"41.73332499999986",
    lon:"-76.403075" },
  { id:"019-21456",
    lat:"41.727433950773985",
    lon:"-75.92424234262842" },
  { id:"019-21456",
    lat:"41.725415458393044",
    lon:"-75.7185346563878" },
  { id:"019-21456",
    lat:"41.74101417947584",
    lon:"-77.15267348692986" },
  { id:"019-21456",
    lat:"41.72830799999986",
    lon:"-75.885294" },
  { id:"019-21456",
    lat:"41.728213999999845",
    lon:"-75.879091" },
  { id:"019-21456",
    lat:"41.72869300007237",
    lon:"-75.94264700015768" },
  { id:"019-21456",
    lat:"41.73667099999986",
    lon:"-76.603662" },
  { id:"019-21456",
    lat:"41.735918999999846",
    lon:"-76.51844399999999" },
  { id:"019-21456",
    lat:"41.74102350000204",
    lon:"-77.03693049999566" },
  { id:"019-21456",
    lat:"41.72707213928285",
    lon:"-75.78810174868195" },
  { id:"019-21456",
    lat:"41.757920500003245",
    lon:"-77.32445300000064" },
  { id:"019-21456",
    lat:"41.739225671633015",
    lon:"-75.71036833106658" },
  { id:"019-21456",
    lat:"41.739390020506306",
    lon:"-75.76630399087712" },
  { id:"019-21456",
    lat:"41.739985625343536",
    lon:"-75.80955802672743" },
  { id:"019-21456",
    lat:"41.75187199999986",
    lon:"-76.74462499999998" },
  { id:"019-21456",
    lat:"41.754050000003986",
    lon:"-76.98600000001545" },
  { id:"019-21456",
    lat:"41.74186650000025",
    lon:"-75.91037499999617" },
  { id:"019-21456",
    lat:"41.74287651175662",
    lon:"-75.96657745469797" },
  { id:"019-21456",
    lat:"41.748269500001086",
    lon:"-76.28997250000421" },
  { id:"019-21456",
    lat:"41.74379750000012",
    lon:"-75.95333899999807" },
  { id:"019-21456",
    lat:"41.74423500000003",
    lon:"-75.62389150000176" },
  { id:"019-21456",
    lat:"41.7451097646398",
    lon:"-75.67445301793418" },
  { id:"019-21456",
    lat:"41.76267151819055",
    lon:"-77.14190900007904" },
  { id:"019-21456",
    lat:"41.750414999999904",
    lon:"-76.07897649999951" },
  { id:"019-21456",
    lat:"41.75255400000265",
    lon:"-76.26185700001705" },
  { id:"019-21456",
    lat:"41.75273600000256",
    lon:"-76.2515779999969" },
  { id:"019-21456",
    lat:"41.761327999999864",
    lon:"-77.037197" },
  { id:"019-21456",
    lat:"41.754036500000474",
    lon:"-76.30678050000347" },
  { id:"019-21456",
    lat:"41.75252899999992",
    lon:"-76.132183" },
  { id:"019-21456",
    lat:"41.75400847139735",
    lon:"-76.17648093663786" },
  { id:"019-21456",
    lat:"41.74959479676142",
    lon:"-75.87459682149496" },
  { id:"019-21456",
    lat:"41.741132000070145",
    lon:"-75.69895850005668" },
  { id:"019-21456",
    lat:"41.74451099999986",
    lon:"-75.87961400000002" },
  { id:"019-21456",
    lat:"41.75601818813504",
    lon:"-76.8268428242353" },
  { id:"019-21456",
    lat:"41.744723961306505",
    lon:"-75.9223718789482" },
  { id:"019-21456",
    lat:"41.75376249999996",
    lon:"-76.72537499999905" },
  { id:"019-21456",
    lat:"41.75751899999986",
    lon:"-76.928689" },
  { id:"019-21456",
    lat:"41.75368299999987",
    lon:"-76.567267" },
  { id:"019-21456",
    lat:"41.75069699999985",
    lon:"-76.28388599999998" },
  { id:"019-21456",
    lat:"41.749963500002885",
    lon:"-76.14212650000225" },
  { id:"019-21456",
    lat:"41.75183100000004",
    lon:"-75.59994000000154" },
  { id:"019-21456",
    lat:"41.771926026388776",
    lon:"-77.31923189593765" },
  { id:"019-21456",
    lat:"41.75215490100975",
    lon:"-75.6478447019224" },
  { id:"019-21456",
    lat:"41.75880150001096",
    lon:"-75.96412200003742" },
  { id:"019-21456",
    lat:"41.76920545703618",
    lon:"-77.29809142915883" },
  { id:"019-21456",
    lat:"41.766163999999854",
    lon:"-76.687319" },
  { id:"019-21456",
    lat:"41.76426899999985",
    lon:"-76.54490000000001" },
  { id:"019-21456",
    lat:"41.76930450000288",
    lon:"-76.99844049999939" },
  { id:"019-21456",
    lat:"41.76672050000112",
    lon:"-76.71104750000673" },
  { id:"019-21456",
    lat:"41.766688123289676",
    lon:"-76.69826289680158" },
  { id:"019-21456",
    lat:"41.76941512834422",
    lon:"-76.85977350139783" },
  { id:"019-21456",
    lat:"41.75581486644299",
    lon:"-76.0285212941113" },
  { id:"019-21456",
    lat:"41.76534149424414",
    lon:"-76.81338749469309" },
  { id:"019-21456",
    lat:"41.762043025767504",
    lon:"-76.49808601033399" },
  { id:"019-21456",
    lat:"41.76344299534018",
    lon:"-76.53401647386646" },
  { id:"019-21456",
    lat:"41.759646895431814",
    lon:"-76.2129961016226" },
  { id:"019-21456",
    lat:"41.76343057752928",
    lon:"-76.51018933117746" },
  { id:"019-21456",
    lat:"41.763241999999856",
    lon:"-76.460642" },
  { id:"019-21456",
    lat:"41.76541799999992",
    lon:"-76.67519550000048" },
  { id:"019-21456",
    lat:"41.763455999999856",
    lon:"-77.116394" },
  { id:"019-21456",
    lat:"41.7488370536457",
    lon:"-75.75893356846433" },
  { id:"019-21456",
    lat:"41.75109418460574",
    lon:"-75.8679700234024" },
  { id:"019-21456",
    lat:"41.752254999999856",
    lon:"-76.00126700000001" },
  { id:"019-21456",
    lat:"41.75743899999985",
    lon:"-76.38645300000002" },
  { id:"019-21456",
    lat:"41.7514015000127",
    lon:"-75.94497650000379" },
  { id:"019-21456",
    lat:"41.76237200030164",
    lon:"-76.88266537430572" },
  { id:"019-21456",
    lat:"41.762131500007875",
    lon:"-76.80904000000832" },
  { id:"019-21456",
    lat:"41.7626805471861",
    lon:"-76.80229551989436" },
  { id:"019-21456",
    lat:"41.74907199999985",
    lon:"-75.661789" },
  { id:"019-21456",
    lat:"41.76649349278045",
    lon:"-77.1760045285217" },
  { id:"019-21456",
    lat:"41.74994819735753",
    lon:"-75.68975714480092" },
  { id:"019-21456",
    lat:"41.752647403473496",
    lon:"-75.83503896317025" },
  { id:"019-21456",
    lat:"41.75234300000008",
    lon:"-75.903053" },
  { id:"019-21456",
    lat:"41.76565547587221",
    lon:"-77.13029149068218" },
  { id:"019-21456",
    lat:"41.753230999999865",
    lon:"-75.93817499999999" },
  { id:"019-21456",
    lat:"41.765064301425326",
    lon:"-77.09402315605895" },
  { id:"019-21456",
    lat:"41.75351673964255",
    lon:"-75.98270877306376" },
  { id:"019-21456",
    lat:"41.759841503136656",
    lon:"-76.46731499860506" },
  { id:"019-21456",
    lat:"41.76192057888559",
    lon:"-76.55836403780334" },
  { id:"019-21456",
    lat:"41.76108599999986",
    lon:"-76.47941699999998" },
  { id:"019-21456",
    lat:"41.75339027404184",
    lon:"-77.33836338638996" },
  { id:"019-21456",
    lat:"41.75016958860189",
    lon:"-76.8504139802404" },
  { id:"019-21456",
    lat:"41.75026192458895",
    lon:"-76.83868501814246" },
  { id:"019-21456",
    lat:"41.738702500020146",
    lon:"-75.87898150001115" },
  { id:"019-21456",
    lat:"41.74499199999986",
    lon:"-76.360753" },
  { id:"019-21456",
    lat:"41.749421000002776",
    lon:"-76.77550700000279" },
  { id:"019-21456",
    lat:"41.738848500024474",
    lon:"-75.8854915000111" },
  { id:"019-21456",
    lat:"41.74217346399306",
    lon:"-76.10303444100256" },
  { id:"019-21456",
    lat:"41.74903907872277",
    lon:"-76.80646249707725" },
  { id:"019-21456",
    lat:"41.74958896753215",
    lon:"-76.83331948792912" },
  { id:"019-21456",
    lat:"41.75500523255734",
    lon:"-77.36835118690952" },
  { id:"019-21456",
    lat:"41.752230999999846",
    lon:"-77.03227000000001" },
  { id:"019-21456",
    lat:"41.73970000001603",
    lon:"-75.90025800002927" },
  { id:"019-21456",
    lat:"41.75172650000129",
    lon:"-76.75301000000432" },
  { id:"019-21456",
    lat:"41.74028901186888",
    lon:"-75.83785004771623" },
  { id:"019-21456",
    lat:"41.75021699999985",
    lon:"-76.63202200000003" },
  { id:"019-21456",
    lat:"41.7512400000029",
    lon:"-76.73580950000164" },
  { id:"019-21456",
    lat:"41.74479199999985",
    lon:"-76.150328" },
  { id:"019-21456",
    lat:"41.78009799999986",
    lon:"-78.14296800000001" },
  { id:"019-21456",
    lat:"41.769470720336905",
    lon:"-76.13743978625901" },
  { id:"019-21456",
    lat:"41.7756930000029",
    lon:"-76.65968749999713" },
  { id:"019-21456",
    lat:"41.766437016477454",
    lon:"-75.90961843201515" },
  { id:"019-21456",
    lat:"41.77902791858472",
    lon:"-77.09077100008662" },
  { id:"019-21456",
    lat:"41.77221893065617",
    lon:"-76.22538902908217" },
  { id:"019-21456",
    lat:"41.769770880869785",
    lon:"-76.04113419162071" },
  { id:"019-21456",
    lat:"41.77750800000052",
    lon:"-77.86798499999686" },
  { id:"019-21456",
    lat:"41.76397199999986",
    lon:"-75.97313299999999" },
  { id:"019-21456",
    lat:"41.77394761579844",
    lon:"-76.87355304334052" },
  { id:"019-21456",
    lat:"41.765658513259815",
    lon:"-76.09599598611035" },
  { id:"019-21456",
    lat:"41.773563876616016",
    lon:"-76.80308200835269" },
  { id:"019-21456",
    lat:"41.765931800405696",
    lon:"-76.10372966843713" },
  { id:"019-21456",
    lat:"41.77614799999988",
    lon:"-77.14500200000002" },
  { id:"019-21456",
    lat:"41.77301800000289",
    lon:"-76.66860450000165" },
  { id:"019-21456",
    lat:"41.76532999999985",
    lon:"-76.01149999999998" },
  { id:"019-21456",
    lat:"41.765654163472036",
    lon:"-76.06083122410826" },
  { id:"019-21456",
    lat:"41.766730686960464",
    lon:"-76.14362478272862" },
  { id:"019-21456",
    lat:"41.76838411653281",
    lon:"-76.23444031903564" },
  { id:"019-21456",
    lat:"41.76604999999985",
    lon:"-76.07501399999997" },
  { id:"019-21456",
    lat:"41.766027111872276",
    lon:"-76.04836629801062" },
  { id:"019-21456",
    lat:"41.76413500000046",
    lon:"-75.86230549999681" },
  { id:"019-21456",
    lat:"41.763826143929414",
    lon:"-75.79975782169922" },
  { id:"019-21456",
    lat:"41.77133651389428",
    lon:"-77.15600049263641" },
  { id:"019-21456",
    lat:"41.76616400000256",
    lon:"-76.49221400000309" },
  { id:"019-21456",
    lat:"41.76287259137341",
    lon:"-76.1988829613979" },
  { id:"019-21456",
    lat:"41.763637500003114",
    lon:"-76.24525550000064" },
  { id:"019-21456",
    lat:"41.770292828316784",
    lon:"-76.84055700278708" },
  { id:"019-21456",
    lat:"41.77236948504186",
    lon:"-77.03769600035788" },
  { id:"019-21456",
    lat:"41.758042994004335",
    lon:"-75.7860565004403" },
  { id:"019-21456",
    lat:"41.77364434953453",
    lon:"-77.2430827316211" },
  { id:"019-21456",
    lat:"41.75949850001045",
    lon:"-75.86882899996502" },
  { id:"019-21456",
    lat:"41.772600000013014",
    lon:"-77.02370000000002" },
  { id:"019-21456",
    lat:"41.761401500000225",
    lon:"-75.97766349999658" },
  { id:"019-21456",
    lat:"41.72988299999987",
    lon:"-77.06812499999998" },
  { id:"019-21456",
    lat:"41.72904750000901",
    lon:"-76.8367350000039" },
  { id:"019-21456",
    lat:"41.72687199999985",
    lon:"-76.70024999999998" },
  { id:"019-21456",
    lat:"41.7170860003441",
    lon:"-75.83585702841573" },
  { id:"019-21456",
    lat:"41.71729099999984",
    lon:"-75.87904100000002" },
  { id:"019-21456",
    lat:"41.719484999999935",
    lon:"-76.05218449999951" },
  { id:"019-21456",
    lat:"41.720757773219624",
    lon:"-76.16053523580308" },
  { id:"019-21456",
    lat:"41.71952678709434",
    lon:"-76.06268689944774" },
  { id:"019-21456",
    lat:"41.72176299768685",
    lon:"-76.20153637009983" },
  { id:"019-21456",
    lat:"41.723311679120265",
    lon:"-76.24625418195804" },
  { id:"019-21456",
    lat:"41.72226807664202",
    lon:"-76.18862102867566" },
  { id:"019-21456",
    lat:"41.71970815346654",
    lon:"-75.98819701763377" },
  { id:"019-21456",
    lat:"41.73381299999986",
    lon:"-77.399627" },
  { id:"019-21456",
    lat:"41.73111801072443",
    lon:"-77.05069445547159" },
  { id:"019-21456",
    lat:"41.71836399999985",
    lon:"-75.88596599999998" },
  { id:"019-21456",
    lat:"41.71868899999985",
    lon:"-75.899219" },
  { id:"019-21456",
    lat:"41.73072352030164",
    lon:"-76.8525140357792" },
  { id:"019-21456",
    lat:"41.72160100150652",
    lon:"-76.11303450003051" },
  { id:"019-21456",
    lat:"41.72496250000298",
    lon:"-76.2567954999892" },
  { id:"019-21456",
    lat:"41.77301958357779",
    lon:"-76.02990177955417" },
  { id:"019-21456",
    lat:"41.785638999999854",
    lon:"-78.54580600000001" },
  { id:"019-21456",
    lat:"41.787141999999854",
    lon:"-78.16743600000001" },
  { id:"019-21456",
    lat:"41.76905133236462",
    lon:"-75.60827665974068" },
  { id:"019-21456",
    lat:"41.76930550000092",
    lon:"-75.63832649999601" },
  { id:"019-21456",
    lat:"41.76819849596157",
    lon:"-75.72069183105387" },
  { id:"019-21456",
    lat:"41.78657899046077",
    lon:"-77.28694903719828" },
  { id:"019-21456",
    lat:"41.779337500001304",
    lon:"-76.3683400000043" },
  { id:"019-21456",
    lat:"41.773823418494835",
    lon:"-76.01843817168275" },
  { id:"019-21456",
    lat:"41.77139692564232",
    lon:"-75.69996399184492" },
  { id:"019-21456",
    lat:"41.785310999999844",
    lon:"-76.98728499999999" },
  { id:"019-21456",
    lat:"41.782427999999854",
    lon:"-76.63087499999999" },
  { id:"019-21456",
    lat:"41.78466399999985",
    lon:"-76.891781" },
  { id:"019-21456",
    lat:"41.77162645195594",
    lon:"-75.78151418280052" },
  { id:"019-21456",
    lat:"41.77396100002832",
    lon:"-75.95121950007578" },
  { id:"019-21456",
    lat:"41.78369699999998",
    lon:"-76.74356100000001" },
  { id:"019-21456",
    lat:"41.78686600416176",
    lon:"-77.18474051263775" },
  { id:"019-21456",
    lat:"41.779085516369406",
    lon:"-76.28120693652724" },
  { id:"019-21456",
    lat:"41.788061117546896",
    lon:"-77.21524990651109" },
  { id:"019-21456",
    lat:"41.78314999999986",
    lon:"-76.602236" },
  { id:"019-21456",
    lat:"41.7809100000029",
    lon:"-76.36165950000287" },
  { id:"019-21456",
    lat:"41.77339537304216",
    lon:"-75.83001495245779" },
  { id:"019-21456",
    lat:"41.77210133916239",
    lon:"-75.74202622626902" },
  { id:"019-21456",
    lat:"41.789282981240696",
    lon:"-77.27753992108033" },
  { id:"019-21456",
    lat:"41.77196221284453",
    lon:"-75.67602750081831" },
  { id:"019-21456",
    lat:"41.78116500000255",
    lon:"-76.3501499999973" },
  { id:"019-21456",
    lat:"41.785069500000006",
    lon:"-76.69537649999866" },
  { id:"019-21456",
    lat:"41.77586550000223",
    lon:"-75.94648350001302" },
  { id:"019-21456",
    lat:"41.78007371504077",
    lon:"-75.76185703299676" },
  { id:"019-21456",
    lat:"41.78070249958267",
    lon:"-75.84715697224144" },
  { id:"019-21456",
    lat:"41.79159699999986",
    lon:"-76.68825599999998" },
  { id:"019-21456",
    lat:"41.78284449943869",
    lon:"-75.9654384546571" },
  { id:"019-21456",
    lat:"41.78412342980751",
    lon:"-76.19249139143666" },
  { id:"019-21456",
    lat:"41.79366715159954",
    lon:"-76.98453761501871" },
  { id:"019-21456",
    lat:"41.78176399011804",
    lon:"-75.9343585449761" },
  { id:"019-21456",
    lat:"41.78404450000697",
    lon:"-76.09610950000844" },
  { id:"019-21456",
    lat:"41.78885000000326",
    lon:"-76.53760000000128" },
  { id:"019-21456",
    lat:"41.78705250000018",
    lon:"-76.4005389999976" },
  { id:"019-21456",
    lat:"41.78426743961355",
    lon:"-76.14312298177586" },
  { id:"019-21456",
    lat:"41.785369499196165",
    lon:"-76.16523201419162" },
  { id:"019-21456",
    lat:"41.798339405607244",
    lon:"-77.97669139386024" },
  { id:"019-21456",
    lat:"41.78227800000124",
    lon:"-75.92527750000993" },
  { id:"019-21456",
    lat:"41.786710077287914",
    lon:"-76.23083629060352" },
  { id:"019-21456",
    lat:"41.794239368121644",
    lon:"-76.84869130642011" },
  { id:"019-21456",
    lat:"41.79317288551156",
    lon:"-76.8417991535878" },
  { id:"019-21456",
    lat:"41.78772274143059",
    lon:"-76.25334753989787" },
  { id:"019-21456",
    lat:"41.79069600000055",
    lon:"-76.49200649999655" },
  { id:"019-21456",
    lat:"41.77742383139086",
    lon:"-75.87921482982827" },
  { id:"019-21456",
    lat:"41.79118533357013",
    lon:"-77.26570092090284" },
  { id:"019-21456",
    lat:"41.782621000000134",
    lon:"-76.32095099999773" },
  { id:"019-21456",
    lat:"41.78292100000096",
    lon:"-76.3309265000043" },
  { id:"019-21456",
    lat:"41.7755384923785",
    lon:"-75.85400703157254" },
  { id:"019-21456",
    lat:"41.78957427025286",
    lon:"-77.20465242740518" },
  { id:"019-21456",
    lat:"41.78860550000473",
    lon:"-77.01887350000827" },
  { id:"019-21456",
    lat:"41.78189262513559",
    lon:"-76.26837144716573" },
  { id:"019-21456",
    lat:"41.790360999999855",
    lon:"-78.545111" },
  { id:"019-21456",
    lat:"41.791944999999856",
    lon:"-78.16723300000001" },
  { id:"019-21456",
    lat:"41.79283353266345",
    lon:"-77.19537890767246" },
  { id:"019-21456",
    lat:"41.79181700000078",
    lon:"-77.15543699999276" },
  { id:"019-21456",
    lat:"41.77960955802231",
    lon:"-76.01120819114857" },
  { id:"019-21456",
    lat:"41.78409050000258",
    lon:"-76.31105800000367" },
  { id:"019-21456",
    lat:"41.78223751051061",
    lon:"-76.19906252229724" },
  { id:"019-21456",
    lat:"41.78489199999986",
    lon:"-76.342897" },
  { id:"019-21456",
    lat:"41.790471025993945",
    lon:"-76.83104298831496" },
  { id:"019-21456",
    lat:"41.78392100020836",
    lon:"-75.69383201443755" },
  { id:"019-21456",
    lat:"41.79422799999984",
    lon:"-76.41544200000001" },
  { id:"019-21456",
    lat:"41.79568299999987",
    lon:"-76.516186" },
  { id:"019-21456",
    lat:"41.796896999999845",
    lon:"-76.610908" },
  { id:"019-21456",
    lat:"41.80009399999988",
    lon:"-76.96820999999998" },
  { id:"019-21456",
    lat:"41.78516546981395",
    lon:"-75.60003193148782" },
  { id:"019-21456",
    lat:"41.787351445630996",
    lon:"-75.65175151218291" },
  { id:"019-21456",
    lat:"41.794762999999854",
    lon:"-76.02943100000002" },
  { id:"019-21456",
    lat:"41.79488604256405",
    lon:"-75.9780405702929" },
  { id:"019-21456",
    lat:"41.79494562287214",
    lon:"-76.03207599920877" },
  { id:"019-21456",
    lat:"41.81081899999985",
    lon:"-77.69726099999998" },
  { id:"019-21456",
    lat:"41.80876725707715",
    lon:"-77.33191397688829" },
  { id:"019-21456",
    lat:"41.8053735924686",
    lon:"-76.95395477374997" },
  { id:"019-21456",
    lat:"41.798000025779935",
    lon:"-76.24301551141565" },
  { id:"019-21456",
    lat:"41.80336899999987",
    lon:"-76.63828300000002" },
  { id:"019-21456",
    lat:"41.79810298654701",
    lon:"-76.16231402831716" },
  { id:"019-21456",
    lat:"41.80631400845513",
    lon:"-76.92197099193497" },
  { id:"019-21456",
    lat:"41.80404399999986",
    lon:"-76.56600800000002" },
  { id:"019-21456",
    lat:"41.78418313114192",
    lon:"-75.63964040669956" },
  { id:"019-21456",
    lat:"41.789009471487816",
    lon:"-75.86316128257076" },
  { id:"019-21456",
    lat:"41.78825869268919",
    lon:"-75.91259401532794" },
  { id:"019-21456",
    lat:"41.8005585000258",
    lon:"-77.01734850001974" },
  { id:"019-21456",
    lat:"41.79522649999993",
    lon:"-76.42706800000033" },
  { id:"019-21456",
    lat:"41.794617766367445",
    lon:"-76.22419172046996" },
  { id:"019-21456",
    lat:"41.803288999999864",
    lon:"-77.149142" },
  { id:"019-21456",
    lat:"41.79216587847696",
    lon:"-75.98693653598059" },
  { id:"019-21456",
    lat:"41.790097502231745",
    lon:"-75.81837248924374" },
  { id:"019-21456",
    lat:"41.789920501273585",
    lon:"-75.80474567561652" },
  { id:"019-21456",
    lat:"41.79557750000094",
    lon:"-75.55530149999603" },
  { id:"019-21456",
    lat:"41.79535942244293",
    lon:"-75.56829836589527" },
  { id:"019-21456",
    lat:"41.794903998641395",
    lon:"-75.59313744742238" },
  { id:"019-21456",
    lat:"41.79949700002585",
    lon:"-75.90955850002635" },
  { id:"019-21456",
    lat:"41.81004598740889",
    lon:"-76.7729345582182" },
  { id:"019-21456",
    lat:"41.797802418309644",
    lon:"-75.78633216371418" },
  { id:"019-21456",
    lat:"41.80979399999985",
    lon:"-76.697886" },
  { id:"019-21456",
    lat:"41.79945550000032",
    lon:"-75.85240699999551" },
  { id:"019-21456",
    lat:"41.80896800000324",
    lon:"-76.54024699999826" },
  { id:"019-21456",
    lat:"41.81805537706458",
    lon:"-77.36775775262805" },
  { id:"019-21456",
    lat:"41.79894399999984",
    lon:"-75.577669" },
  { id:"019-21456",
    lat:"41.81540950000017",
    lon:"-76.83113050000294" },
  { id:"019-21456",
    lat:"41.81679745897313",
    lon:"-77.01204312128043" },
  { id:"019-21456",
    lat:"41.81340243692283",
    lon:"-76.87869450355099" },
  { id:"019-21456",
    lat:"41.798301500001784",
    lon:"-75.70490400000504" },
  { id:"019-21456",
    lat:"41.79720852210819",
    lon:"-75.63648753795128" },
  { id:"019-21456",
    lat:"41.79759268118098",
    lon:"-75.62321054540404" },
  { id:"019-21456",
    lat:"41.81249054135632",
    lon:"-76.91173654037722" },
  { id:"019-21456",
    lat:"41.80906699999987",
    lon:"-76.52926900000001" },
  { id:"019-21456",
    lat:"41.811318999999855",
    lon:"-76.511306" },
  { id:"019-21456",
    lat:"41.81316899999985",
    lon:"-76.652978" },
  { id:"019-21456",
    lat:"41.81260599999985",
    lon:"-76.578578" },
  { id:"019-21456",
    lat:"41.81349853499922",
    lon:"-76.81687246402288" },
  { id:"019-21456",
    lat:"41.80103795168729",
    lon:"-76.18976493716953" },
  { id:"019-21456",
    lat:"41.80215299999985",
    lon:"-76.304192" },
  { id:"019-21456",
    lat:"41.807743628837294",
    lon:"-76.75071913282711" },
  { id:"019-21456",
    lat:"41.79955000986626",
    lon:"-76.12883444966324" },
  { id:"019-21456",
    lat:"41.80143899999985",
    lon:"-76.28753100000002" },
  { id:"019-21456",
    lat:"41.80832575431005",
    lon:"-76.93360501639889" },
  { id:"019-21456",
    lat:"41.81085008989808",
    lon:"-76.94577844965214" },
  { id:"019-21456",
    lat:"41.80842350000743",
    lon:"-76.79368050001702" },
  { id:"019-21456",
    lat:"41.80880400204841",
    lon:"-76.83419598960919" },
  { id:"019-21456",
    lat:"41.79553949236221",
    lon:"-75.73512775265826" },
  { id:"019-21456",
    lat:"41.80349744096999",
    lon:"-76.26330743276581" },
  { id:"019-21456",
    lat:"41.80357360864076",
    lon:"-76.22349214509329" },
  { id:"019-21456",
    lat:"41.78223751111215",
    lon:"-75.72709149461656" },
  { id:"019-21456",
    lat:"41.796835298133544",
    lon:"-76.99599231283167" },
  { id:"019-21456",
    lat:"41.795877751887616",
    lon:"-76.86191096445232" },
  { id:"019-21456",
    lat:"41.79685530379998",
    lon:"-76.97653513614412" },
  { id:"019-21456",
    lat:"41.788985736254396",
    lon:"-76.26073594164244" },
  { id:"019-21456",
    lat:"41.79213599999986",
    lon:"-76.50349699999998" },
  { id:"019-21456",
    lat:"41.797296035742896",
    lon:"-77.24433496354672" },
  { id:"019-21456",
    lat:"41.7874637613296",
    lon:"-76.17879724956666" },
  { id:"019-21456",
    lat:"41.80020490602026",
    lon:"-77.95958953311805" },
  { id:"019-21456",
    lat:"41.7974320047966",
    lon:"-76.96580547924374" },
  { id:"019-21456",
    lat:"41.79452499999984",
    lon:"-76.551028" },
  { id:"019-21456",
    lat:"41.794015500002075",
    lon:"-76.57149450000432" },
  { id:"019-21456",
    lat:"41.787382003419005",
    lon:"-75.95782750649734" },
  { id:"019-21456",
    lat:"41.79389850000108",
    lon:"-76.43672249999607" },
  { id:"019-21456",
    lat:"41.790460124211016",
    lon:"-76.12928458014812" },
  { id:"019-21456",
    lat:"41.79580000000256",
    lon:"-76.58451700000232" },
  { id:"019-21456",
    lat:"41.82134152798337",
    lon:"-76.8748859686759" },
  { id:"019-21456",
    lat:"41.82007500000165",
    lon:"-76.73584999998401" },
  { id:"019-21456",
    lat:"41.81904150001156",
    lon:"-76.73021400005979" },
  { id:"019-21456",
    lat:"41.818019499999984",
    lon:"-76.60904049999937" },
  { id:"019-21456",
    lat:"41.80909703084418",
    lon:"-75.94628148264269" },
  { id:"019-21456",
    lat:"41.811932999999854",
    lon:"-76.11368299999998" },
  { id:"019-21456",
    lat:"41.81333600016113",
    lon:"-76.21108300007671" },
  { id:"019-21456",
    lat:"41.81609999999985",
    lon:"-76.345167" },
  { id:"019-21456",
    lat:"41.815871999999864",
    lon:"-76.32205600000002" },
  { id:"019-21456",
    lat:"41.82844966454821",
    lon:"-77.86869186377527" },
  { id:"019-21456",
    lat:"41.82517603775967",
    lon:"-77.01041800196305" },
  { id:"019-21456",
    lat:"41.812313304557065",
    lon:"-75.86048189873921" },
  { id:"019-21456",
    lat:"41.82520698883654",
    lon:"-76.99197104439847" },
  { id:"019-21456",
    lat:"41.818824999999876",
    lon:"-76.305292" },
  { id:"019-21456",
    lat:"41.826267609416405",
    lon:"-76.98406584992703" },
  { id:"019-21456",
    lat:"41.824157999999855",
    lon:"-76.72270299999998" },
  { id:"019-21456",
    lat:"41.80903050002202",
    lon:"-75.8277595000301" },
  { id:"019-21456",
    lat:"41.82181262854473",
    lon:"-76.78973853343933" },
  { id:"019-21456",
    lat:"41.81284000392882",
    lon:"-76.07590149248523" },
  { id:"019-21456",
    lat:"41.81662429651818",
    lon:"-76.22364202853156" },
  { id:"019-21456",
    lat:"41.81745799999985",
    lon:"-76.26438099999999" },
  { id:"019-21456",
    lat:"41.81449699999846",
    lon:"-76.02854300001007" },
  { id:"019-21456",
    lat:"41.8134295425569",
    lon:"-75.9552864986675" },
  { id:"019-21456",
    lat:"41.81199850000131",
    lon:"-75.56377400000433" },
  { id:"019-21456",
    lat:"41.821973599528775",
    lon:"-75.98761802102219" },
  { id:"019-21456",
    lat:"41.82319699999986",
    lon:"-76.280975" },
  { id:"019-21456",
    lat:"41.81340356380919",
    lon:"-75.61694145925749" },
  { id:"019-21456",
    lat:"41.828937499999924",
    lon:"-76.65575" },
  { id:"019-21456",
    lat:"41.827713999999844",
    lon:"-76.55647200000001" },
  { id:"019-21456",
    lat:"41.82646099999986",
    lon:"-76.54595600000002" },
  { id:"019-21456",
    lat:"41.824046999999865",
    lon:"-76.29638600000001" },
  { id:"019-21456",
    lat:"41.84299650000054",
    lon:"-77.74720500000342" },
  { id:"019-21456",
    lat:"41.84118603279126",
    lon:"-77.74307947671754" },
  { id:"019-21456",
    lat:"41.831464672572146",
    lon:"-76.24559301460411" },
  { id:"019-21456",
    lat:"41.842519000011464",
    lon:"-77.74035149997144" },
  { id:"019-21456",
    lat:"41.82450299999986",
    lon:"-75.61955800000001" },
  { id:"019-21456",
    lat:"41.824775000000876",
    lon:"-75.59600299999178" },
  { id:"019-21456",
    lat:"41.84257199999985",
    lon:"-77.006516" },
  { id:"019-21456",
    lat:"41.8303555029456",
    lon:"-75.8936595017441" },
  { id:"019-21456",
    lat:"41.83948750000256",
    lon:"-76.59551099999749" },
  { id:"019-21456",
    lat:"41.822812503796094",
    lon:"-75.64447050618797" },
  { id:"019-21456",
    lat:"41.82645450022476",
    lon:"-75.85130402928715" },
  { id:"019-21456",
    lat:"41.83100589887874",
    lon:"-76.13095938057555" },
  { id:"019-21456",
    lat:"41.83255167390977",
    lon:"-76.19035906841506" },
  { id:"019-21456",
    lat:"41.83904591172271",
    lon:"-76.84635549933292" },
  { id:"019-21456",
    lat:"41.827597424377245",
    lon:"-75.74240825802111" },
  { id:"019-21456",
    lat:"41.8261460633393",
    lon:"-75.7471479067064" },
  { id:"019-21456",
    lat:"41.83613299999985",
    lon:"-76.405258" },
  { id:"019-21456",
    lat:"41.837134269180844",
    lon:"-77.7319471579165" },
  { id:"019-21456",
    lat:"41.82634000002351",
    lon:"-76.06339799999199" },
  { id:"019-21456",
    lat:"41.83450405559528",
    lon:"-76.96464221451315" },
  { id:"019-21456",
    lat:"41.826683379534884",
    lon:"-76.20071699728562" },
  { id:"019-21456",
    lat:"41.829152999999856",
    lon:"-76.25754199999999" },
  { id:"019-21456",
    lat:"41.83396399999984",
    lon:"-76.66717199999998" },
  { id:"019-21456",
    lat:"41.83394250013976",
    lon:"-76.64841200005417" },
  { id:"019-21456",
    lat:"41.83689450007069",
    lon:"-76.89273350005422" },
  { id:"019-21456",
    lat:"41.81296099550142",
    lon:"-75.75177899358017" },
  { id:"019-21456",
    lat:"41.812661196878715",
    lon:"-75.78670435025131" },
  { id:"019-21456",
    lat:"41.81955450245882",
    lon:"-76.14145549023257" },
  { id:"019-21456",
    lat:"41.82899859379881",
    lon:"-77.50328880100349" },
  { id:"019-21456",
    lat:"41.819791279821615",
    lon:"-76.24863157054946" },
  { id:"019-21456",
    lat:"41.826296769015094",
    lon:"-76.85647145910964" },
  { id:"019-21456",
    lat:"41.824652500000106",
    lon:"-76.67876550000098" },
  { id:"019-21456",
    lat:"41.822288999999856",
    lon:"-76.446667" },
  { id:"019-21456",
    lat:"41.81510949354453",
    lon:"-75.90294701645983" },
  { id:"019-21456",
    lat:"41.816807984726914",
    lon:"-76.00620953032693" },
  { id:"019-21456",
    lat:"41.8192209983173",
    lon:"-76.1571234430318" },
  { id:"019-21456",
    lat:"41.823573500001984",
    lon:"-76.45273900000424" },
  { id:"019-21456",
    lat:"41.823910990864704",
    lon:"-76.48252899147512" },
  { id:"019-21456",
    lat:"41.82893997669017",
    lon:"-76.97633500060515" },
  { id:"019-21456",
    lat:"41.82506099999985",
    lon:"-76.57461899999998" },
  { id:"019-21456",
    lat:"41.827714329964884",
    lon:"-76.8338176435442" },
  { id:"019-21456",
    lat:"41.8146029651146",
    lon:"-75.76625174996857" },
  { id:"019-21456",
    lat:"41.82769999999985",
    lon:"-76.70292799999999" },
  { id:"019-21456",
    lat:"41.817831453173625",
    lon:"-75.93535667609032" },
  { id:"019-21456",
    lat:"41.84724948978893",
    lon:"-78.15684819657928" },
  { id:"019-21456",
    lat:"41.831511316966925",
    lon:"-75.76917714638493" },
  { id:"019-21456",
    lat:"41.83192500281453",
    lon:"-75.58200848631138" },
  { id:"019-21456",
    lat:"41.84443099999983",
    lon:"-79.283394" },
  { id:"019-21456",
    lat:"41.849615739148554",
    lon:"-76.94892452285208" },
  { id:"019-21456",
    lat:"41.85236100011517",
    lon:"-77.29379349979166" },
  { id:"019-21456",
    lat:"41.83631644554594",
    lon:"-75.76047005307097" },
  { id:"019-21456",
    lat:"41.85061699999984",
    lon:"-76.918672" },
  { id:"019-21456",
    lat:"41.85331899999985",
    lon:"-78.829381" },
  { id:"019-21456",
    lat:"41.84685599999986",
    lon:"-76.312972" },
  { id:"019-21456",
    lat:"41.84264250002199",
    lon:"-76.05342950002375" },
  { id:"019-21456",
    lat:"41.83624590526166",
    lon:"-75.61364714787791" },
  { id:"019-21456",
    lat:"41.830589703908956",
    lon:"-75.61716697298193" },
  { id:"019-21456",
    lat:"41.83087510631133",
    lon:"-75.63998612536395" },
  { id:"019-21456",
    lat:"41.830455236349145",
    lon:"-75.67657554381091" },
  { id:"019-21456",
    lat:"41.83041301514148",
    lon:"-75.69979876507931" },
  { id:"019-21456",
    lat:"41.832501985251604",
    lon:"-75.81419665773156" },
  { id:"019-21456",
    lat:"41.849581426549925",
    lon:"-78.14623023524709" },
  { id:"019-21456",
    lat:"41.84367499999986",
    lon:"-76.57177499999999" },
  { id:"019-21456",
    lat:"41.83830590843086",
    lon:"-76.11280549420212" },
  { id:"019-21456",
    lat:"41.83208056269445",
    lon:"-75.73224001338924" },
  { id:"019-21456",
    lat:"41.84245999999992",
    lon:"-76.38367049999951" },
  { id:"019-21456",
    lat:"41.84757792371275",
    lon:"-76.92388188587275" },
  { id:"019-21456",
    lat:"41.84177105018509",
    lon:"-76.28262582212278" },
  { id:"019-21456",
    lat:"41.83768500000288",
    lon:"-75.96976250000162" },
  { id:"019-21456",
    lat:"41.84774450002113",
    lon:"-76.81789699988653" },
  { id:"019-21456",
    lat:"41.85758993731741",
    lon:"-76.83432668272674" },
  { id:"019-21456",
    lat:"41.85453899999985",
    lon:"-76.591192" },
  { id:"019-21456",
    lat:"41.85906099999985",
    lon:"-78.822611" },
  { id:"019-21456",
    lat:"41.85797099999985",
    lon:"-76.69206700000001" },
  { id:"019-21456",
    lat:"41.85560799999986",
    lon:"-76.519544" },
  { id:"019-21456",
    lat:"41.85675398297286",
    lon:"-76.62474606299317" },
  { id:"019-21456",
    lat:"41.847774005982224",
    lon:"-75.64392933490893" },
  { id:"019-21456",
    lat:"41.8673389648764",
    lon:"-77.33996353396965" },
  { id:"019-21456",
    lat:"41.86208899999987",
    lon:"-76.560553" },
  { id:"019-21456",
    lat:"41.86251899999986",
    lon:"-76.76706899999998" },
  { id:"019-21456",
    lat:"41.85129859042475",
    lon:"-75.63575274658102" },
  { id:"019-21456",
    lat:"41.857966487973364",
    lon:"-76.0773419564645" },
  { id:"019-21456",
    lat:"41.86454999999987",
    lon:"-76.74861900000003" },
  { id:"019-21456",
    lat:"41.86468299999986",
    lon:"-76.743958" },
  { id:"019-21456",
    lat:"41.86589699999986",
    lon:"-76.740358" },
  { id:"019-21456",
    lat:"41.86560299999985",
    lon:"-76.640819" },
  { id:"019-21456",
    lat:"41.86384900000089",
    lon:"-77.31280399999582" },
  { id:"019-21456",
    lat:"41.85003240615546",
    lon:"-75.99668232356989" },
  { id:"019-21456",
    lat:"41.85703899999985",
    lon:"-76.57251099999999" },
  { id:"019-21456",
    lat:"41.84584431868548",
    lon:"-75.67827973259624" },
  { id:"019-21456",
    lat:"41.860142999999866",
    lon:"-76.711781" },
  { id:"019-21456",
    lat:"41.85852099999985",
    lon:"-76.68744200000002" },
  { id:"019-21456",
    lat:"41.850930000005235",
    lon:"-76.04711999999724" },
  { id:"019-21456",
    lat:"41.85915699999987",
    lon:"-76.67862500000001" },
  { id:"019-21456",
    lat:"41.858888500000084",
    lon:"-76.58126249999806" },
  { id:"019-21456",
    lat:"41.86308562428972",
    lon:"-76.88172647156401" },
  { id:"019-21456",
    lat:"41.84774161245744",
    lon:"-75.75709392483508" },
  { id:"019-21456",
    lat:"41.846159315171874",
    lon:"-75.66503952430817" },
  { id:"019-21456",
    lat:"41.861746222378464",
    lon:"-76.84760355664265" },
  { id:"019-21456",
    lat:"41.860456999999855",
    lon:"-76.684475" },
  { id:"019-21456",
    lat:"41.86166699999986",
    lon:"-76.81907499999998" },
  { id:"019-21456",
    lat:"41.86061499999987",
    lon:"-76.677019" },
  { id:"019-21456",
    lat:"41.85944699999988",
    lon:"-76.53196100000001" },
  { id:"019-21456",
    lat:"41.850783500028534",
    lon:"-75.87513749999685" },
  { id:"019-21456",
    lat:"41.85529449501932",
    lon:"-76.99126002210852" },
  { id:"019-21456",
    lat:"41.85271699999985",
    lon:"-76.65530299999999" },
  { id:"019-21456",
    lat:"41.84455694677458",
    lon:"-75.95958200114679" },
  { id:"019-21456",
    lat:"41.83832167130657",
    lon:"-75.69379043924938" },
  { id:"019-21456",
    lat:"41.857328999999865",
    lon:"-77.73506000000002" },
  { id:"019-21456",
    lat:"41.844318065349675",
    lon:"-76.03277221530863" },
  { id:"019-21456",
    lat:"41.84091799999997",
    lon:"-75.81779999999902" },
  { id:"019-21456",
    lat:"41.83861747094021",
    lon:"-75.60415788886026" },
  { id:"019-21456",
    lat:"41.849600000006554",
    lon:"-76.29443900001867" },
  { id:"019-21456",
    lat:"41.85437299999986",
    lon:"-76.69922300000002" },
  { id:"019-21456",
    lat:"41.85196399999986",
    lon:"-76.40116400000001" },
  { id:"019-21456",
    lat:"41.845239023772116",
    lon:"-75.90994604680242" },
  { id:"019-21456",
    lat:"41.82964594906802",
    lon:"-75.82381102280092" },
  { id:"019-21456",
    lat:"41.843667000079705",
    lon:"-76.958592" },
  { id:"019-21456",
    lat:"41.83494399999985",
    lon:"-76.177936" },
  { id:"019-21456",
    lat:"41.834604499409096",
    lon:"-76.14085551332953" },
  { id:"019-21456",
    lat:"41.83157804010247",
    lon:"-75.92854390388933" },
  { id:"019-21456",
    lat:"41.83657244630298",
    lon:"-76.23873627396864" },
  { id:"019-21456",
    lat:"41.83713112806456",
    lon:"-76.22588257129401" },
  { id:"019-21456",
    lat:"41.84115799999985",
    lon:"-76.51006900000003" },
  { id:"019-21456",
    lat:"41.84399900000075",
    lon:"-76.7696780000039" },
  { id:"019-21456",
    lat:"41.841701465812655",
    lon:"-76.53266648534215" },
  { id:"019-21456",
    lat:"41.829413333536834",
    lon:"-75.71460553428997" },
  { id:"019-21456",
    lat:"41.802482470300866",
    lon:"-75.76616208469098" },
  { id:"019-21456",
    lat:"41.80206551609351",
    lon:"-75.6559945273677" },
  { id:"019-21456",
    lat:"41.81729299961073",
    lon:"-76.80952353759793" },
  { id:"019-21456",
    lat:"41.80276827061694",
    lon:"-75.68103684332203" },
  { id:"019-21456",
    lat:"41.81659447040867",
    lon:"-76.89537089000042" },
  { id:"019-21456",
    lat:"41.811893584207795",
    lon:"-76.27986851926755" },
  { id:"019-21456",
    lat:"41.81537500000018",
    lon:"-76.45681099999763" },
  { id:"019-21456",
    lat:"41.81425000000277",
    lon:"-76.3750819999988" },
  { id:"019-21456",
    lat:"41.813224999999875",
    lon:"-76.36445799999998" },
  { id:"019-21456",
    lat:"41.81289450000206",
    lon:"-76.35478349999602" },
  { id:"019-21456",
    lat:"41.80888599999986",
    lon:"-76.039061" },
  { id:"019-21456",
    lat:"41.81436699999985",
    lon:"-76.332931" },
  { id:"019-21456",
    lat:"41.854407055982506",
    lon:"-75.58067446489083" },
  { id:"019-21456",
    lat:"41.87164443785387",
    lon:"-78.62947404172915" },
  { id:"019-21456",
    lat:"41.86191250000852",
    lon:"-76.01888049998108" },
  { id:"019-21456",
    lat:"41.876798550191516",
    lon:"-76.87880709250746" },
  { id:"019-21456",
    lat:"41.87461799999987",
    lon:"-76.72605700000001" },
  { id:"019-21456",
    lat:"41.86168306405282",
    lon:"-75.71494297080584" },
  { id:"019-21456",
    lat:"41.8618208639853",
    lon:"-75.7305102531811" },
  { id:"019-21456",
    lat:"41.86681899999985",
    lon:"-76.05859300000002" },
  { id:"019-21456",
    lat:"41.86550995945546",
    lon:"-75.93044042728401" },
  { id:"019-21456",
    lat:"41.86476840445865",
    lon:"-75.63654395138532" },
  { id:"019-21456",
    lat:"41.865741652449884",
    lon:"-75.68204209897063" },
  { id:"019-21456",
    lat:"41.88274327167935",
    lon:"-78.6133938715909" },
  { id:"019-21456",
    lat:"41.88307981939912",
    lon:"-77.41787579783949" },
  { id:"019-21456",
    lat:"41.87577250000256",
    lon:"-76.36813299999672" },
  { id:"019-21456",
    lat:"41.8769804944374",
    lon:"-76.83614749476666" },
  { id:"019-21456",
    lat:"41.87641899999984",
    lon:"-76.65283599999998" },
  { id:"019-21456",
    lat:"41.86622161324521",
    lon:"-75.91962581962122" },
  { id:"019-21456",
    lat:"41.86560634296905",
    lon:"-75.78395874511186" },
  { id:"019-21456",
    lat:"41.87932152069819",
    lon:"-76.86537750141542" },
  { id:"019-21456",
    lat:"41.87598299999984",
    lon:"-76.54644199999998" },
  { id:"019-21456",
    lat:"41.87374399999987",
    lon:"-76.32005600000001" },
  { id:"019-21456",
    lat:"41.87190516476409",
    lon:"-76.80227272926963" },
  { id:"019-21456",
    lat:"41.87139799999986",
    lon:"-76.692417" },
  { id:"019-21456",
    lat:"41.871806999999855",
    lon:"-76.68736099999998" },
  { id:"019-21456",
    lat:"41.872555999999854",
    lon:"-76.707081" },
  { id:"019-21456",
    lat:"41.86279193486998",
    lon:"-75.96447812557247" },
  { id:"019-21456",
    lat:"41.86311800000043",
    lon:"-75.98700299999695" },
  { id:"019-21456",
    lat:"41.85938956330475",
    lon:"-75.70235475709985" },
  { id:"019-21456",
    lat:"41.87347499999986",
    lon:"-76.72923300000001" },
  { id:"019-21456",
    lat:"41.86178348757157",
    lon:"-75.80996550019752" },
  { id:"019-21456",
    lat:"41.87164199999985",
    lon:"-76.55565800000001" },
  { id:"019-21456",
    lat:"41.86445298287086",
    lon:"-75.94490447300845" },
  { id:"019-21456",
    lat:"41.87313699999985",
    lon:"-76.684314" },
  { id:"019-21456",
    lat:"41.87356999999988",
    lon:"-76.68026899999997" },
  { id:"019-21456",
    lat:"41.87029399999986",
    lon:"-75.57621099999999" },
  { id:"019-21456",
    lat:"41.88829399999985",
    lon:"-76.779042" },
  { id:"019-21456",
    lat:"41.88281399999986",
    lon:"-76.539011" },
  { id:"019-21456",
    lat:"41.88269699999985",
    lon:"-76.423344" },
  { id:"019-21456",
    lat:"41.87203742111891",
    lon:"-75.66532786173599" },
  { id:"019-21456",
    lat:"41.87786416449027",
    lon:"-75.65974969462043" },
  { id:"019-21456",
    lat:"41.89570808151805",
    lon:"-77.37966334136007" },
  { id:"019-21456",
    lat:"41.89340887992991",
    lon:"-77.41031867448287" },
  { id:"019-21456",
    lat:"41.887997203278886",
    lon:"-76.5317583194702" },
  { id:"019-21456",
    lat:"41.87774599999985",
    lon:"-75.88791799999998" },
  { id:"019-21456",
    lat:"41.877447000011436",
    lon:"-75.82066549997771" },
  { id:"019-21456",
    lat:"41.8773018731023",
    lon:"-75.75530163981195" },
  { id:"019-21456",
    lat:"41.87746651851235",
    lon:"-75.73815648209575" },
  { id:"019-21456",
    lat:"41.88916899999985",
    lon:"-76.520975" },
  { id:"019-21456",
    lat:"41.895225023006084",
    lon:"-77.39152951229833" },
  { id:"019-21456",
    lat:"41.88017799999986",
    lon:"-75.55745" },
  { id:"019-21456",
    lat:"41.89000499999985",
    lon:"-75.938138" },
  { id:"019-21456",
    lat:"41.88528599999985",
    lon:"-75.688892" },
  { id:"019-21456",
    lat:"41.88141423922412",
    lon:"-75.60700750541056" },
  { id:"019-21456",
    lat:"41.89349399999985",
    lon:"-76.46101900000001" },
  { id:"019-21456",
    lat:"41.89481399999987",
    lon:"-76.581389" },
  { id:"019-21456",
    lat:"41.89857117447592",
    lon:"-76.8952525064651" },
  { id:"019-21456",
    lat:"41.897018999999865",
    lon:"-76.71680300000001" },
  { id:"019-21456",
    lat:"41.88768748885461",
    lon:"-75.94123049524858" },
  { id:"019-21456",
    lat:"41.89130358735822",
    lon:"-75.76949339063465" },
  { id:"019-21456",
    lat:"41.90512499999986",
    lon:"-76.615483" },
  { id:"019-21456",
    lat:"41.90039450000061",
    lon:"-76.39985650000376" },
  { id:"019-21456",
    lat:"41.89651099999985",
    lon:"-75.967458" },
  { id:"019-21456",
    lat:"41.89592499928532",
    lon:"-75.98941945994034" },
  { id:"019-21456",
    lat:"41.90038599999985",
    lon:"-76.26147499999999" },
  { id:"019-21456",
    lat:"41.89179160280076",
    lon:"-76.00444440255622" },
  { id:"019-21456",
    lat:"41.902371965961876",
    lon:"-76.85583595600797" },
  { id:"019-21456",
    lat:"41.88625700000232",
    lon:"-75.57611250000768" },
  { id:"019-21456",
    lat:"41.906805500008275",
    lon:"-77.50606799996321" },
  { id:"019-21456",
    lat:"41.90033599999987",
    lon:"-76.57341099999998" },
  { id:"019-21456",
    lat:"41.88899500728671",
    lon:"-75.70365225645655" },
  { id:"019-21456",
    lat:"41.88863299999984",
    lon:"-75.66152800000002" },
  { id:"019-21456",
    lat:"41.904096999999844",
    lon:"-76.866467" },
  { id:"019-21456",
    lat:"41.89295995251666",
    lon:"-75.92065302329387" },
  { id:"019-21456",
    lat:"41.87833275999197",
    lon:"-75.59171764056676" },
  { id:"019-21456",
    lat:"41.89862750000695",
    lon:"-77.54186400003336" },
  { id:"019-21456",
    lat:"41.87818218890876",
    lon:"-75.62709012246302" },
  { id:"019-21456",
    lat:"41.88259799999986",
    lon:"-75.89478" },
  { id:"019-21456",
    lat:"41.88413890203783",
    lon:"-75.99238345976178" },
  { id:"019-21456",
    lat:"41.89732490721102",
    lon:"-77.3681551535448" },
  { id:"019-21456",
    lat:"41.88058450000594",
    lon:"-75.74364350000089" },
  { id:"019-21456",
    lat:"41.88002002721035",
    lon:"-75.70666460080541" },
  { id:"019-21456",
    lat:"41.89363450000312",
    lon:"-76.60049449999937" },
  { id:"019-21456",
    lat:"41.879763164555044",
    lon:"-75.61610338584025" },
  { id:"019-21456",
    lat:"41.88110299999986",
    lon:"-76.62437800000001" },
  { id:"019-21456",
    lat:"41.87778850000289",
    lon:"-76.30934850000224" },
  { id:"019-21456",
    lat:"41.88597654176376",
    lon:"-77.30487250002642" },
  { id:"019-21456",
    lat:"41.876605500000146",
    lon:"-76.27675399999787" },
  { id:"019-21456",
    lat:"41.88019999999986",
    lon:"-76.63850599999999" },
  { id:"019-21456",
    lat:"41.88175599999986",
    lon:"-76.748819" },
  { id:"019-21456",
    lat:"41.88310299999983",
    lon:"-76.81968299999998" },
  { id:"019-21456",
    lat:"41.86823416852915",
    lon:"-75.63099091163275" },
  { id:"019-21456",
    lat:"41.87862100000153",
    lon:"-76.34765549999548" },
  { id:"019-21456",
    lat:"41.87974150705875",
    lon:"-76.44151250271713" },
  { id:"019-21456",
    lat:"41.879215000009665",
    lon:"-76.35930549998457" },
  { id:"019-21456",
    lat:"41.88167799999986",
    lon:"-76.505258" },
  { id:"019-21456",
    lat:"41.89632499999985",
    lon:"-75.563647" },
  { id:"019-21456",
    lat:"41.91381699999987",
    lon:"-76.89079700000002" },
  { id:"019-21456",
    lat:"41.91503899999986",
    lon:"-76.83656100000002" },
  { id:"019-21456",
    lat:"41.912160999999855",
    lon:"-76.55457199999996" },
  { id:"019-21456",
    lat:"41.90997499999986",
    lon:"-76.608106" },
  { id:"019-21456",
    lat:"41.89778744794041",
    lon:"-75.6989791312115" },
  { id:"019-21456",
    lat:"41.8979656440954",
    lon:"-75.68902989382266" },
  { id:"019-21456",
    lat:"41.90278100009168",
    lon:"-75.9595809997417" },
  { id:"019-21456",
    lat:"41.89977199999985",
    lon:"-75.63763100000001" },
  { id:"019-21456",
    lat:"41.89997919016726",
    lon:"-75.68049669397946" },
  { id:"019-21456",
    lat:"41.910460999999856",
    lon:"-76.337417" },
  { id:"019-21456",
    lat:"41.923281989193626",
    lon:"-77.38965154693385" },
  { id:"019-21456",
    lat:"41.918770999999865",
    lon:"-76.923163" },
  { id:"019-21456",
    lat:"41.92608219573579",
    lon:"-76.95415131041463" },
  { id:"019-21456",
    lat:"41.90999529568575",
    lon:"-75.6561087322263" },
  { id:"019-21456",
    lat:"41.91893899999987",
    lon:"-76.282761" },
  { id:"019-21456",
    lat:"41.91952900034528",
    lon:"-76.29207089940851" },
  { id:"019-21456",
    lat:"41.907720535888295",
    lon:"-75.6626955872765" },
  { id:"019-21456",
    lat:"41.918216999999856",
    lon:"-76.26811700000002" },
  { id:"019-21456",
    lat:"41.91428599999986",
    lon:"-76.19989200000002" },
  { id:"019-21456",
    lat:"41.91206514248672",
    lon:"-75.6489250654253" },
  { id:"019-21456",
    lat:"41.91483298670721",
    lon:"-75.72573499463434" },
  { id:"019-21456",
    lat:"41.932715999999864",
    lon:"-77.066257" },
  { id:"019-21456",
    lat:"41.91839443756765",
    lon:"-75.80252789313688" },
  { id:"019-21456",
    lat:"41.92991799999985",
    lon:"-77.041317" },
  { id:"019-21456",
    lat:"41.923551926834804",
    lon:"-76.35010683709264" },
  { id:"019-21456",
    lat:"41.925382999999854",
    lon:"-76.444703" },
  { id:"019-21456",
    lat:"41.92090848315463",
    lon:"-76.17168053407318" },
  { id:"019-21456",
    lat:"41.91573001080081",
    lon:"-75.81326455974859" },
  { id:"019-21456",
    lat:"41.91721558055469",
    lon:"-75.83273499734244" },
  { id:"019-21456",
    lat:"41.93145399999987",
    lon:"-76.99295399999998" },
  { id:"019-21456",
    lat:"41.93056799999987",
    lon:"-76.94451099999999" },
  { id:"019-21456",
    lat:"41.92727499999985",
    lon:"-76.488467" },
  { id:"019-21456",
    lat:"41.90097674497444",
    lon:"-75.57533420902051" },
  { id:"019-21456",
    lat:"41.91059699999986",
    lon:"-76.183111" },
  { id:"019-21456",
    lat:"41.913482999999864",
    lon:"-76.457722" },
  { id:"019-21456",
    lat:"41.911727999999854",
    lon:"-76.35920599999999" },
  { id:"019-21456",
    lat:"41.89959372089654",
    lon:"-75.59608004491679" },
  { id:"019-21456",
    lat:"41.90005700000035",
    lon:"-75.61400400000467" },
  { id:"019-21456",
    lat:"41.905940500135486",
    lon:"-75.9220580547405" },
  { id:"019-21456",
    lat:"41.904778429182954",
    lon:"-75.83833221044355" },
  { id:"019-21456",
    lat:"41.90264399999987",
    lon:"-75.624417" },
  { id:"019-21456",
    lat:"41.90359611814158",
    lon:"-75.67126557042577" },
  { id:"019-21456",
    lat:"41.912882999999866",
    lon:"-76.22251099999998" },
  { id:"019-21456",
    lat:"41.92437358176403",
    lon:"-75.87292749468328" },
  { id:"019-21456",
    lat:"41.942986000000154",
    lon:"-77.378417" },
  { id:"019-21456",
    lat:"41.94309150002154",
    lon:"-77.35631250004852" },
  { id:"019-21456",
    lat:"41.93620399999986",
    lon:"-77.019411" },
  { id:"019-21456",
    lat:"41.93194399999986",
    lon:"-76.409753" },
  { id:"019-21456",
    lat:"41.93647800006556",
    lon:"-76.86764299993094" },
  { id:"019-21456",
    lat:"41.934199999999855",
    lon:"-76.60647499999999" },
  { id:"019-21456",
    lat:"41.92812445394468",
    lon:"-75.61413925254683" },
  { id:"019-21456",
    lat:"41.93438200003983",
    lon:"-76.19488350021807" },
  { id:"019-21456",
    lat:"41.93482800000324",
    lon:"-75.8541250000013" },
  { id:"019-21456",
    lat:"41.93185152403925",
    lon:"-75.63653243439745" },
  { id:"019-21456",
    lat:"41.94248899999987",
    lon:"-76.314972" },
  { id:"019-21456",
    lat:"41.93927499999988",
    lon:"-76.363247" },
  { id:"019-21456",
    lat:"41.93110201982812",
    lon:"-75.86712349940557" },
  { id:"019-21456",
    lat:"41.93076399999985",
    lon:"-75.83131700000003" },
  { id:"019-21456",
    lat:"41.94086699999986",
    lon:"-76.436303" },
  { id:"019-21456",
    lat:"41.94702299999985",
    lon:"-76.97726799999998" },
  { id:"019-21456",
    lat:"41.94014750000257",
    lon:"-76.39461099999671" },
  { id:"019-21456",
    lat:"41.92905075758682",
    lon:"-75.65058774796661" },
  { id:"019-21456",
    lat:"41.95235699999985",
    lon:"-76.954072" },
  { id:"019-21456",
    lat:"41.94583599999985",
    lon:"-76.09858300000002" },
  { id:"019-21456",
    lat:"41.951963999999855",
    lon:"-76.851878" },
  { id:"019-21456",
    lat:"41.949587355214085",
    lon:"-76.07169994923649" },
  { id:"019-21456",
    lat:"41.95391699999984",
    lon:"-76.189681" },
  { id:"019-21456",
    lat:"41.95746199999986",
    lon:"-76.936888" },
  { id:"019-21456",
    lat:"41.95320268517838",
    lon:"-75.93215044437201" },
  { id:"019-21456",
    lat:"41.96442799999987",
    lon:"-76.654308" },
  { id:"019-21456",
    lat:"41.96838199999986",
    lon:"-77.02621599999999" },
  { id:"019-21456",
    lat:"41.95878599999986",
    lon:"-76.040292" },
  { id:"019-21456",
    lat:"41.96058295403401",
    lon:"-76.25641882950275" },
  { id:"019-21456",
    lat:"41.959010004695976",
    lon:"-75.91237095191804" },
  { id:"019-21456",
    lat:"41.95490899999986",
    lon:"-80.00169" },
  { id:"019-21456",
    lat:"41.974871999999856",
    lon:"-77.56043899999999" },
  { id:"019-21456",
    lat:"41.96151399999987",
    lon:"-76.06101399999999" },
  { id:"019-21456",
    lat:"41.96499699999985",
    lon:"-76.27999400000002" },
  { id:"019-21456",
    lat:"41.963755999999854",
    lon:"-76.38808899999998" },
  { id:"019-21456",
    lat:"41.96185299999986",
    lon:"-76.117208" },
  { id:"019-21456",
    lat:"41.97020599999985",
    lon:"-76.896506" },
  { id:"019-21456",
    lat:"41.953112500005496",
    lon:"-76.02085000001144" },
  { id:"019-21456",
    lat:"41.96709399999984",
    lon:"-77.59866900000003" },
  { id:"019-21456",
    lat:"41.96347599999987",
    lon:"-77.00006" },
  { id:"019-21456",
    lat:"41.95658247203095",
    lon:"-76.16517609963779" },
  { id:"019-21456",
    lat:"41.966684999999856",
    lon:"-77.038261" },
  { id:"019-21456",
    lat:"41.948475999999864",
    lon:"-78.79231400000002" },
  { id:"019-21456",
    lat:"41.94017799999986",
    lon:"-76.11042500000002" },
  { id:"019-21456",
    lat:"41.94511099999986",
    lon:"-76.409086" },
  { id:"019-21456",
    lat:"41.9426119826668",
    lon:"-76.16198395680179" },
  { id:"019-21456",
    lat:"41.95041099999985",
    lon:"-76.89956100000002" },
  { id:"019-21456",
    lat:"41.94451399999986",
    lon:"-76.25246400000003" },
  { id:"019-21456",
    lat:"41.945846999999844",
    lon:"-76.33452199999999" },
  { id:"019-21456",
    lat:"41.897180999999875",
    lon:"-75.896722" },
  { id:"019-21456",
    lat:"41.89659470341301",
    lon:"-75.81842592933133" },
  { id:"019-21456",
    lat:"41.90353899999985",
    lon:"-76.38929199999998" },
  { id:"019-21456",
    lat:"41.89508600001317",
    lon:"-75.65478050001207" },
  { id:"019-21456",
    lat:"41.90354699999986",
    lon:"-76.22714699999999" },
  { id:"019-21456",
    lat:"41.899405563174284",
    lon:"-75.92780852448169" },
  { id:"019-21456",
    lat:"41.90863899999986",
    lon:"-76.592494" },
  { id:"019-21456",
    lat:"41.96544700001162",
    lon:"-75.83602799998869" },
  { id:"019-21456",
    lat:"41.96981699999984",
    lon:"-75.887829" },
  { id:"019-21456",
    lat:"41.97151734882211",
    lon:"-76.08724976279588" },
  { id:"019-21456",
    lat:"41.97559399999984",
    lon:"-76.46640799999999" },
  { id:"019-21456",
    lat:"41.98742499999987",
    lon:"-77.502322" },
  { id:"019-21456",
    lat:"41.96929300000545",
    lon:"-75.62224700000223" },
  { id:"019-21456",
    lat:"41.97137418031159",
    lon:"-75.8238748358898" },
  { id:"019-21456",
    lat:"41.9890614338713",
    lon:"-77.35344576263945" },
  { id:"019-21456",
    lat:"41.97299999999984",
    lon:"-75.79996100000001" },
  { id:"019-21456",
    lat:"41.977169500000194",
    lon:"-76.04576399999806" },
  { id:"019-21456",
    lat:"41.98796199999986",
    lon:"-77.051578" },
  { id:"019-21456",
    lat:"41.98833850003565",
    lon:"-77.01506600779642" },
  { id:"019-21456",
    lat:"41.978976500007846",
    lon:"-76.09744299999169" },
  { id:"019-21456",
    lat:"41.98262799999986",
    lon:"-76.426683" },
  { id:"019-21456",
    lat:"41.98840250004859",
    lon:"-76.99079400002316" },
  { id:"019-21456",
    lat:"41.98413399999986",
    lon:"-77.02633300000001" },
  { id:"019-21456",
    lat:"41.97526423852184",
    lon:"-76.13475192439702" },
  { id:"019-21456",
    lat:"41.98053599999986",
    lon:"-76.43792499999999" },
  { id:"019-21456",
    lat:"41.97577955430607",
    lon:"-75.7002069983224" },
  { id:"019-21456",
    lat:"41.974610999999854",
    lon:"-75.60850800000001" },
  { id:"019-21456",
    lat:"41.97564999999985",
    lon:"-75.65460299999998" },
  { id:"019-21456",
    lat:"41.97544699999985",
    lon:"-75.64237200000001" },
  { id:"019-21456",
    lat:"41.995943999999845",
    lon:"-77.54255599999999" },
  { id:"019-21456",
    lat:"41.98728299999985",
    lon:"-76.31303599999998" },
  { id:"019-21456",
    lat:"41.98671699999986",
    lon:"-76.26533600000002" },
  { id:"019-21456",
    lat:"41.97940000000255",
    lon:"-75.8724810000031" },
  { id:"019-21456",
    lat:"41.98548599999986",
    lon:"-76.250061" },
  { id:"019-21456",
    lat:"41.9837250000008",
    lon:"-76.11209049999243" },
  { id:"019-21456",
    lat:"41.98342499999984",
    lon:"-76.06248100000002" },
  { id:"019-21456",
    lat:"41.98393450000545",
    lon:"-75.67433300000083" },
  { id:"019-21456",
    lat:"41.99530599999985",
    lon:"-76.42399199999997" },
  { id:"019-21456",
    lat:"41.996671116824686",
    lon:"-75.7154171765183" },
  { id:"019-21456",
    lat:"41.98310150000179",
    lon:"-75.77332099999593" },
  { id:"019-21456",
    lat:"41.99099999999986",
    lon:"-76.29308900000001" },
  { id:"019-21456",
    lat:"41.98196100002261",
    lon:"-75.68288900005975" },
  { id:"019-21456",
    lat:"41.972426500005916",
    lon:"-75.63170950000085" },
  { id:"019-21456",
    lat:"41.98924799999987",
    lon:"-76.97956199999999" },
  { id:"019-21456",
    lat:"41.97822350000024",
    lon:"-76.03217349999719" },
  { id:"019-21456",
    lat:"41.985678999999976",
    lon:"-76.45302199999901" },
  { id:"019-21456",
    lat:"41.97682749930254",
    lon:"-75.77997645836088" },
  { id:"019-21456",
    lat:"41.97738200001201",
    lon:"-75.85435000001476" },
  { id:"019-21456",
    lat:"41.98095178671404",
    lon:"-76.07718157130434" },
  { id:"019-21456",
    lat:"41.96520000000747",
    lon:"-76.0555610000091" },
  { id:"019-21456",
    lat:"41.97405799999984",
    lon:"-76.73514399999999" },
  { id:"019-21456",
    lat:"41.970697000002275",
    lon:"-76.47377649999599" },
  { id:"019-21456",
    lat:"41.966918999999855",
    lon:"-76.146314" },
  { id:"019-21456",
    lat:"41.872009999999854",
    lon:"-77.916805" },
  { id:"019-21456",
    lat:"41.85493538835285",
    lon:"-75.7474128147808" },
  { id:"019-21456",
    lat:"41.86689999999985",
    lon:"-76.620425" },
  { id:"019-21456",
    lat:"41.87171400002192",
    lon:"-77.28888348578921" },
  { id:"019-21456",
    lat:"41.86908449957815",
    lon:"-76.85854848941865" },
  { id:"019-21456",
    lat:"41.856570864959416",
    lon:"-75.82077678366505" },
  { id:"019-21456",
    lat:"41.85347370204189",
    lon:"-75.73631911088944" },
  { id:"019-21456",
    lat:"41.86590799999987",
    lon:"-76.61046700000001" },
  { id:"019-21456",
    lat:"41.861845198683135",
    lon:"-76.15086896809365" },
  { id:"019-21456",
    lat:"41.85368813078958",
    lon:"-75.59619366934417" },
  { id:"019-21456",
    lat:"41.85334004345549",
    lon:"-75.6072450224343" },
  { id:"019-21456",
    lat:"41.85461035152925",
    lon:"-75.66131679109732" },
  { id:"019-21456",
    lat:"41.858673391226525",
    lon:"-75.84835724180826" },
  { id:"019-21456",
    lat:"41.781424999999864",
    lon:"-77.130154" },
  { id:"019-21456",
    lat:"41.77811899999984",
    lon:"-76.681639" },
  { id:"019-21456",
    lat:"41.770063999999856",
    lon:"-75.98357500000002" },
  { id:"019-21456",
    lat:"41.77299144868583",
    lon:"-76.206975597601" },
  { id:"019-21456",
    lat:"41.776585999999874",
    lon:"-76.46704399999999" },
  { id:"019-21456",
    lat:"41.768871000000125",
    lon:"-75.96537499999815" },
  { id:"019-21456",
    lat:"41.77907200001398",
    lon:"-76.65045099997802" },
  { id:"019-21456",
    lat:"41.77110876089579",
    lon:"-75.93271501535831" },
  { id:"019-21456",
    lat:"41.774723800817455",
    lon:"-76.17222346177421" },
  { id:"019-21456",
    lat:"41.77401118870113",
    lon:"-76.17870951399097" },
  { id:"019-21456",
    lat:"41.780127999999856",
    lon:"-76.64075800000002" },
  { id:"019-21456",
    lat:"41.65498155132087",
    lon:"-77.27651782646063" },
  { id:"019-21456",
    lat:"41.640246999999846",
    lon:"-75.82493099999999" },
  { id:"019-21456",
    lat:"41.640825000200316",
    lon:"-75.83276003715058" },
  { id:"019-21456",
    lat:"41.64287500000547",
    lon:"-75.94386700000001" },
  { id:"019-21456",
    lat:"41.64936100000325",
    lon:"-76.3390219999987" },
  { id:"019-21456",
    lat:"41.40925300003214",
    lon:"-77.56490800006198" },
  { id:"019-21456",
    lat:"41.40967250898212",
    lon:"-77.62105698094351" },
  { id:"019-21456",
    lat:"41.40786507063826",
    lon:"-77.35008352919722" },
  { id:"019-21456",
    lat:"41.40847497239822",
    lon:"-77.11847647379058" },
  { id:"019-21456",
    lat:"41.40930000004787",
    lon:"-77.09925000000995" } ];

/* src/components/stateMap/FrackingLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (19:2) {#each fracking as d, i}
function create_each_block$1(ctx) {
	let circle;
	let circle_cx_value;
	let circle_cy_value;

	return {
		c() {
			circle = svg_element("circle");
			this.h();
		},
		l(nodes) {
			circle = claim_element(nodes, "circle", { cx: true, cy: true, r: true, class: true }, 1);
			children(circle).forEach(detach);
			this.h();
		},
		h() {
			attr(circle, "cx", circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[4]).x);
			attr(circle, "cy", circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[4]).y);
			attr(circle, "r", "2.0");
			attr(circle, "class", "svelte-lbyzkz");
		},
		m(target, anchor) {
			insert(target, circle, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*xy*/ 1 && circle_cx_value !== (circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[4]).x)) {
				attr(circle, "cx", circle_cx_value);
			}

			if (dirty & /*xy*/ 1 && circle_cy_value !== (circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[4]).y)) {
				attr(circle, "cy", circle_cy_value);
			}
		},
		d(detaching) {
			if (detaching) detach(circle);
		}
	};
}

function create_fragment$6(ctx) {
	let g;
	let text_1;
	let tspan0;
	let t0;
	let t1;
	let tspan1;
	let t2;
	let text_1_transform_value;
	let each_value = fracking;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text_1 = svg_element("text");
			tspan0 = svg_element("tspan");
			t0 = text("Each dot is an active");
			t1 = space();
			tspan1 = svg_element("tspan");
			t2 = text("fracking well.");
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			text_1 = claim_element(
				g_nodes,
				"text",
				{
					x: true,
					y: true,
					transform: true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			tspan0 = claim_element(text_1_nodes, "tspan", { x: true, y: true }, 1);
			var tspan0_nodes = children(tspan0);
			t0 = claim_text(tspan0_nodes, "Each dot is an active");
			tspan0_nodes.forEach(detach);
			t1 = claim_space(text_1_nodes);
			tspan1 = claim_element(text_1_nodes, "tspan", { x: true, y: true, dy: true }, 1);
			var tspan1_nodes = children(tspan1);
			t2 = claim_text(tspan1_nodes, "fracking well.");
			tspan1_nodes.forEach(detach);
			text_1_nodes.forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(tspan0, "x", "0");
			attr(tspan0, "y", "0");
			attr(tspan1, "x", "0");
			attr(tspan1, "y", "0");
			attr(tspan1, "dy", "17px");
			attr(text_1, "x", "0");
			attr(text_1, "y", "0");
			attr(text_1, "transform", text_1_transform_value = "translate(" + /*xy*/ ctx[0](/*labelLoc*/ ctx[1]).x + "," + /*xy*/ ctx[0](/*labelLoc*/ ctx[1]).y + ")");
			attr(text_1, "class", "svelte-lbyzkz");
			attr(g, "class", "frackingDots");
		},
		m(target, anchor) {
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}

			append(g, text_1);
			append(text_1, tspan0);
			append(tspan0, t0);
			append(text_1, t1);
			append(text_1, tspan1);
			append(tspan1, t2);
		},
		p(ctx, [dirty]) {
			if (dirty & /*xy, fracking*/ 1) {
				each_value = fracking;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g, text_1);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*xy*/ 1 && text_1_transform_value !== (text_1_transform_value = "translate(" + /*xy*/ ctx[0](/*labelLoc*/ ctx[1]).x + "," + /*xy*/ ctx[0](/*labelLoc*/ ctx[1]).y + ")")) {
				attr(text_1, "transform", text_1_transform_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let { xy } = $$props;
	let { data } = $$props;
	const labelLoc = { lat: 41, lon: -77.5 };
	let rScale = sqrt().domain([0, 50000]).range([0, 30]);

	$$self.$$set = $$props => {
		if ("xy" in $$props) $$invalidate(0, xy = $$props.xy);
		if ("data" in $$props) $$invalidate(2, data = $$props.data);
	};

	return [xy, labelLoc, data];
}

class FrackingLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { xy: 0, data: 2 });
	}
}

let projections = {
	'US' : geoAlbersUsa(),
	'Alabama' : geoTransverseMercator().rotate([87 + 30 / 60, -30]),
	'Alaska' : geoTransverseMercator().rotate([150, -54]),
	'Arizona' : geoTransverseMercator().rotate([111 + 55 / 60, -31]),
	'Arkansas' : geoConicConformal().parallels([33 + 18 / 60, 34 + 46 / 60]).rotate([92, 0]),
	'California' : geoConicConformal().parallels([37 + 4 / 60, 38 + 26 / 60]).rotate([120 + 30 / 60, 0]),
	'Colorado' : geoConicConformal().parallels([38 + 27 / 60, 39 + 45 / 60]).rotate([105 + 30 / 60, 0]),
	'Connecticut' : geoConicConformal().parallels([41 + 12 / 60, 41 + 52 / 60]).rotate([72 + 45 / 60, 0]),
	'Delaware' : geoTransverseMercator().rotate([75 + 25 / 60, -38]),
	// 'Florida' : geoTransverseMercator().rotate([82, -24 - 20 / 60]),
	'Florida' : geoConicConformal().parallels([29 + 35 / 60, 30 + 45 / 60]).rotate([84 + 30 / 60, 0]),
	'Georgia' : geoTransverseMercator().rotate([84 + 10 / 60, -30]),
	'Hawaii' : geoTransverseMercator().rotate([158, -21 - 10 / 60]),
	'Idaho' : geoTransverseMercator().rotate([114, -41 - 40 / 60]),
	'Illinois' : geoTransverseMercator().rotate([90 + 10 / 60, -36 - 40 / 60]),
	'Indiana' : geoTransverseMercator().rotate([85 + 40 / 60, -37 - 30 / 60]),
	'Iowa' : geoConicConformal().parallels([42 + 4 / 60, 43 + 16 / 60]).rotate([93 + 30 / 60, 0]),
	'Kansas' : geoConicConformal().parallels([38 + 43 / 60, 39 + 47 / 60]).rotate([98, 0]),
	'Kentucky' : geoConicConformal().parallels([36 + 44 / 60, 37 + 56 / 60]).rotate([85 + 45 / 60, 0]),
	'Louisiana' : geoConicConformal().parallels([31 + 10 / 60, 32 + 40 / 60]).rotate([92 + 30 / 60, 0]),
	'Maine' : geoTransverseMercator().rotate([70 + 10 / 60, -42 - 50 / 60]),
	'Maryland' : geoConicConformal().parallels([38 + 18 / 60, 39 + 27 / 60]).rotate([77, 0]),
	'Massachusetts' : geoConicConformal().parallels([41 + 43 / 60, 42 + 41 / 60]).rotate([71 + 30 / 60, 0]),
	'Michigan' : geoConicConformal().parallels([42 + 6 / 60, 43 + 40 / 60]).rotate([84 + 22 / 60, 0]),
	'Minnesota' : geoConicConformal().parallels([43 + 47 / 60, 45 + 13 / 60]).rotate([94, 0]),
	'Mississippi' : geoTransverseMercator().rotate([88 + 50 / 60, -29 - 30 / 60]),
	'Missouri' : geoTransverseMercator().rotate([92 + 30 / 60, -35 - 50 / 60]),
	'Montana' : geoConicConformal().parallels([45, 49]).rotate([109 + 30 / 60, 0]),
	'Nebraska' : geoConicConformal().parallels([40, 43]).rotate([100, 0]),
	'Nevada' : geoTransverseMercator().rotate([116 + 40 / 60, -34 - 45 / 60]),
	'New Hampshire' : geoTransverseMercator().rotate([71 + 40 / 60, -42 - 30 / 60]),
	'New Jersey' : geoTransverseMercator().rotate([74 + 30 / 60, -38 - 50 / 60]),
	'New Mexico' : geoTransverseMercator().rotate([106 + 15 / 60, -31]),
	'New York' : geoTransverseMercator().rotate([76 + 35 / 60, -40]),
	'North Carolina' : geoConicConformal().parallels([34 + 20 / 60, 36 + 10 / 60]).rotate([79, 0]),
	'North Dakota' : geoConicConformal().parallels([47 + 26 / 60, 48 + 44 / 60]).rotate([100 + 30 / 60, 0]),
	'Ohio' : geoConicConformal().parallels([40 + 26 / 60, 41 + 42 / 60]).rotate([82 + 30 / 60, 0]),
	'Oklahoma' : geoConicConformal().parallels([35 + 34 / 60, 36 + 46 / 60]).rotate([98, 0]),
	'Oregon' : geoConicConformal().parallels([42 + 20 / 60, 44]).rotate([120 + 30 / 60, 0]),
	'Pennsylvania' : geoConicConformal().parallels([40 + 53 / 60, 41 + 57 / 60]).rotate([77 + 45 / 60, 0]),
	'Rhode Island' : geoTransverseMercator().rotate([71 + 30 / 60, -41 - 5 / 60]),
	'South Carolina' : geoConicConformal().parallels([32 + 30 / 60, 34 + 50 / 60]).rotate([81, 0]),
	'South Dakota' : geoConicConformal().parallels([44 + 25 / 60, 45 + 41 / 60]).rotate([100, 0]),
	'Tennessee' : geoConicConformal().parallels([35 + 15 / 60, 36 + 25 / 60]).rotate([86, 0]),
	'Texas' : geoConicConformal().parallels([30 + 7 / 60, 31 + 53 / 60]).rotate([100 + 20 / 60, 0]),
	'Utah' : geoConicConformal().parallels([39 + 1 / 60, 40 + 39 / 60]).rotate([111 + 30 / 60, 0]),
	'Vermont' : geoTransverseMercator().rotate([72 + 30 / 60, -42 - 30 / 60]),
	'Virginia' : geoConicConformal().parallels([36 + 46 / 60, 37 + 58 / 60]).rotate([78 + 30 / 60, 0]),
	'Washington' : geoConicConformal().parallels([47 + 30 / 60, 48 + 44 / 60]).rotate([120 + 50 / 60, 0]),
	'West Virginia' : geoConicConformal().parallels([39, 40 + 15 / 60]).rotate([79 + 30 / 60, 0]),
	'Wisconsin' : geoConicConformal().parallels([42 + 44 / 60, 44 + 4 / 60]).rotate([90, 0]),
	'Wyoming' : geoTransverseMercator().rotate([107 + 20 / 60, -40 - 30 / 60])
};

let getProjection = (state) => {
	return projections[state]
};

/* src/components/stateMap/ChoroplethLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (23:4) {#each data.countiesGeo.features as county, i}
function create_each_block$2(ctx) {
	let path;
	let path_d_value;
	let path_fill_value;
	let path_stroke_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(
				nodes,
				"path",
				{
					d: true,
					fill: true,
					stroke: true,
					class: true
				},
				1
			);

			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]));
			attr(path, "fill", path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "stroke", path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "class", "svelte-1cjs3xl");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 3 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]))) {
				attr(path, "d", path_d_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_fill_value !== (path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "fill", path_fill_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_stroke_value !== (path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "stroke", path_stroke_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$7(ctx) {
	let g1;
	let g0;
	let each_value = /*data*/ ctx[0].countiesGeo.features;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	return {
		c() {
			g1 = svg_element("g");
			g0 = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g1 = claim_element(nodes, "g", { class: true }, 1);
			var g1_nodes = children(g1);
			g0 = claim_element(g1_nodes, "g", { class: true }, 1);
			var g0_nodes = children(g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g0_nodes);
			}

			g0_nodes.forEach(detach);
			g1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g0, "class", "choro-counties");
			attr(g1, "class", "choropleth");
		},
		m(target, anchor) {
			insert(target, g1, anchor);
			append(g1, g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g0, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*theGeoPath, data, getColor*/ 7) {
				each_value = /*data*/ ctx[0].countiesGeo.features;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g1);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { theGeoPath } = $$props;
	const colorRamp = colors.rawRamps.oranges;
	let colorScale = linear().domain([0, 0.5, 1]).range(colorRamp);

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(1, theGeoPath = $$props.theGeoPath);
	};

	let getColor;

	 $$invalidate(2, getColor = (d, i) => {
		return colorScale(Math.abs(Math.sin(i)));
	});

	return [data, theGeoPath, getColor];
}

class ChoroplethLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 0, theGeoPath: 1 });
	}
}

/* src/components/stateMap/TurnoutChoroplethLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (28:4) {#each data.countiesGeo.features as county, i}
function create_each_block$3(ctx) {
	let path;
	let path_d_value;
	let path_fill_value;
	let path_stroke_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(
				nodes,
				"path",
				{
					d: true,
					fill: true,
					stroke: true,
					class: true
				},
				1
			);

			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]));
			attr(path, "fill", path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "stroke", path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "class", "svelte-10mya3g");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 3 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]))) {
				attr(path, "d", path_d_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_fill_value !== (path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "fill", path_fill_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_stroke_value !== (path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "stroke", path_stroke_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$8(ctx) {
	let g1;
	let g0;
	let each_value = /*data*/ ctx[0].countiesGeo.features;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	return {
		c() {
			g1 = svg_element("g");
			g0 = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g1 = claim_element(nodes, "g", { class: true }, 1);
			var g1_nodes = children(g1);
			g0 = claim_element(g1_nodes, "g", { class: true }, 1);
			var g0_nodes = children(g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g0_nodes);
			}

			g0_nodes.forEach(detach);
			g1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g0, "class", "choro-counties");
			attr(g1, "class", "choropleth");
		},
		m(target, anchor) {
			insert(target, g1, anchor);
			append(g1, g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g0, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*theGeoPath, data, getColor*/ 7) {
				each_value = /*data*/ ctx[0].countiesGeo.features;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g1);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { theGeoPath } = $$props;
	const colorRamp = colors.ramps.turnout;
	let colorScale = linear().domain([1, 1.25]).range(colorRamp).clamp(true);

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(1, theGeoPath = $$props.theGeoPath);
	};

	let getColor;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data*/ 1) {
			 $$invalidate(2, getColor = (feature, i) => {
				const fips = feature.properties.GEOID;
				const vd = data.voteData.find(d => d.fips === fips);
				if (!vd) return colors.nullColor;
				const turnout20Vs16 = +vd.pct16_turnout / 100;
				const shouldUse = vd.use_results_for_analysis === "y";
				return shouldUse ? colorScale(turnout20Vs16) : "#f4f4f4";
			});
		}
	};

	return [data, theGeoPath, getColor];
}

class TurnoutChoroplethLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { data: 0, theGeoPath: 1 });
	}
}

/* src/components/stateMap/CovidDeathsChoroplethLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

// (29:4) {#each data.countiesGeo.features as county, i}
function create_each_block$4(ctx) {
	let path;
	let path_d_value;
	let path_fill_value;
	let path_stroke_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(
				nodes,
				"path",
				{
					d: true,
					fill: true,
					stroke: true,
					class: true
				},
				1
			);

			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]));
			attr(path, "fill", path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "stroke", path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]));
			attr(path, "class", "svelte-1cjs3xl");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 3 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[1](/*county*/ ctx[5]))) {
				attr(path, "d", path_d_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_fill_value !== (path_fill_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "fill", path_fill_value);
			}

			if (dirty & /*getColor, data*/ 5 && path_stroke_value !== (path_stroke_value = /*getColor*/ ctx[2](/*county*/ ctx[5], /*i*/ ctx[7]))) {
				attr(path, "stroke", path_stroke_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$9(ctx) {
	let g1;
	let g0;
	let each_value = /*data*/ ctx[0].countiesGeo.features;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	return {
		c() {
			g1 = svg_element("g");
			g0 = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g1 = claim_element(nodes, "g", { class: true }, 1);
			var g1_nodes = children(g1);
			g0 = claim_element(g1_nodes, "g", { class: true }, 1);
			var g0_nodes = children(g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g0_nodes);
			}

			g0_nodes.forEach(detach);
			g1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g0, "class", "choro-counties");
			attr(g1, "class", "choropleth");
		},
		m(target, anchor) {
			insert(target, g1, anchor);
			append(g1, g0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g0, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*theGeoPath, data, getColor*/ 7) {
				each_value = /*data*/ ctx[0].countiesGeo.features;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g0, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g1);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$9($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { theGeoPath } = $$props;
	const colorRamp = colors.ramps.covidDeaths;
	let colorScale = linear().domain([0, 100]).range(colorRamp).clamp(true);

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(1, theGeoPath = $$props.theGeoPath);
	};

	let getColor;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*data*/ 1) {
			 $$invalidate(2, getColor = (feature, i) => {
				const fips = feature.properties.GEOID;
				const vd = data.voteData.find(d => d.fips === fips);
				if (!vd) return colors.null;
				const deathsPerCapita = +vd.covid_deaths_percap;
				const shouldUse = vd.use_results_for_analysis === "y";

				return shouldUse
				? colorScale(deathsPerCapita)
				: colors.nullColor;
			});
		}
	};

	return [data, theGeoPath, getColor];
}

class CovidDeathsChoroplethLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$9, create_fragment$9, safe_not_equal, { data: 0, theGeoPath: 1 });
	}
}

/* src/components/stateMap/SomeCirclesLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	child_ctx[5] = i;
	return child_ctx;
}

// (13:2) {#each data.voteData as d, i}
function create_each_block$5(ctx) {
	let circle;
	let circle_cx_value;
	let circle_cy_value;
	let circle_r_value;

	return {
		c() {
			circle = svg_element("circle");
			this.h();
		},
		l(nodes) {
			circle = claim_element(nodes, "circle", { cx: true, cy: true, r: true, class: true }, 1);
			children(circle).forEach(detach);
			this.h();
		},
		h() {
			attr(circle, "cx", circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[3]).x);
			attr(circle, "cy", circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[3]).y);
			attr(circle, "r", circle_r_value = /*rScale*/ ctx[2](Math.random() * 10000));
			attr(circle, "class", "svelte-q9ur5v");
		},
		m(target, anchor) {
			insert(target, circle, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*xy, data*/ 3 && circle_cx_value !== (circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[3]).x)) {
				attr(circle, "cx", circle_cx_value);
			}

			if (dirty & /*xy, data*/ 3 && circle_cy_value !== (circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[3]).y)) {
				attr(circle, "cy", circle_cy_value);
			}
		},
		d(detaching) {
			if (detaching) detach(circle);
		}
	};
}

function create_fragment$a(ctx) {
	let g;
	let each_value = /*data*/ ctx[1].voteData;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	return {
		c() {
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g, "class", "returnedCircles");
		},
		m(target, anchor) {
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*xy, data, rScale, Math*/ 7) {
				each_value = /*data*/ ctx[1].voteData;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$a($$self, $$props, $$invalidate) {
	let { xy } = $$props;
	let { data } = $$props;
	let rScale = sqrt().domain([0, 50000]).range([0, 30]);

	$$self.$$set = $$props => {
		if ("xy" in $$props) $$invalidate(0, xy = $$props.xy);
		if ("data" in $$props) $$invalidate(1, data = $$props.data);
	};

	return [xy, data, rScale];
}

class SomeCirclesLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$a, create_fragment$a, safe_not_equal, { xy: 0, data: 1 });
	}
}

/* src/components/stateMap/TestCanvasLayer.svelte generated by Svelte v3.29.4 */

function create_fragment$b(ctx) {
	let canvas_1;
	let canvas_1_height_value;

	return {
		c() {
			canvas_1 = element("canvas");
			this.h();
		},
		l(nodes) {
			canvas_1 = claim_element(nodes, "CANVAS", { width: true, height: true, class: true });
			children(canvas_1).forEach(detach);
			this.h();
		},
		h() {
			attr(canvas_1, "width", /*w*/ ctx[0]);
			attr(canvas_1, "height", canvas_1_height_value = /*w*/ ctx[0] * /*aspectRatio*/ ctx[1]);
			attr(canvas_1, "class", "svelte-1uemn3y");
		},
		m(target, anchor) {
			insert(target, canvas_1, anchor);
			/*canvas_1_binding*/ ctx[5](canvas_1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*w*/ 1) {
				attr(canvas_1, "width", /*w*/ ctx[0]);
			}

			if (dirty & /*w, aspectRatio*/ 3 && canvas_1_height_value !== (canvas_1_height_value = /*w*/ ctx[0] * /*aspectRatio*/ ctx[1])) {
				attr(canvas_1, "height", canvas_1_height_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(canvas_1);
			/*canvas_1_binding*/ ctx[5](null);
		}
	};
}

function instance$b($$self, $$props, $$invalidate) {
	let { w } = $$props;
	let { aspectRatio } = $$props;
	let { xy } = $$props;
	let { data } = $$props;
	let canvas;

	onMount(() => {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "yellow";
		ctx.fillRect(50, 100, 200, 30);
	});

	function canvas_1_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			canvas = $$value;
			$$invalidate(2, canvas);
		});
	}

	$$self.$$set = $$props => {
		if ("w" in $$props) $$invalidate(0, w = $$props.w);
		if ("aspectRatio" in $$props) $$invalidate(1, aspectRatio = $$props.aspectRatio);
		if ("xy" in $$props) $$invalidate(3, xy = $$props.xy);
		if ("data" in $$props) $$invalidate(4, data = $$props.data);
	};

	return [w, aspectRatio, canvas, xy, data, canvas_1_binding];
}

class TestCanvasLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$b, create_fragment$b, safe_not_equal, { w: 0, aspectRatio: 1, xy: 3, data: 4 });
	}
}

/* src/components/stateMap/OutlineFlipsLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[3] = list[i];
	child_ctx[5] = i;
	return child_ctx;
}

// (21:1) {#each flips as county, i}
function create_each_block$6(ctx) {
	let path;
	let path_d_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(nodes, "path", { d: true, class: true }, 1);
			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[0](/*county*/ ctx[3]));
			attr(path, "class", "svelte-1bboczp");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 1 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[0](/*county*/ ctx[3]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$c(ctx) {
	let g;
	let each_value = /*flips*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	return {
		c() {
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g, "class", "flipped-counties");
		},
		m(target, anchor) {
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*theGeoPath, flips*/ 3) {
				each_value = /*flips*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$c($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { theGeoPath } = $$props;

	const flips = data.countiesGeo.features.filter(feature => {
		const fips = feature.properties.GEOID;
		const vd = data.voteData.find(d => d.fips === fips);
		if (!vd) return false;
		const shouldUse = vd.use_results_for_analysis === "y";
		return shouldUse && vd.flip === "YES";
	});

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(2, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(0, theGeoPath = $$props.theGeoPath);
	};

	return [theGeoPath, flips, data];
}

class OutlineFlipsLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$c, create_fragment$c, safe_not_equal, { data: 2, theGeoPath: 0 });
	}
}

/* src/components/stateMap/RawMarginCirclesLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[18] = list[i];
	child_ctx[20] = i;
	return child_ctx;
}

// (64:0) {#if unfilteredCountyGeometries.length > 0}
function create_if_block_1$1(ctx) {
	let g;
	let path;
	let path_d_value;

	return {
		c() {
			g = svg_element("g");
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);
			path = claim_element(g_nodes, "path", { d: true }, 1);
			children(path).forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[2](/*negativeMesh*/ ctx[9]));
			attr(g, "class", "nullCountiesOutline svelte-11kvbxc");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, path);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 4 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[2](/*negativeMesh*/ ctx[9]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

// (71:0) {#if isFiltered}
function create_if_block$2(ctx) {
	let g;
	let path;
	let path_d_value;

	return {
		c() {
			g = svg_element("g");
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);
			path = claim_element(g_nodes, "path", { d: true }, 1);
			children(path).forEach(detach);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[2](/*mesh*/ ctx[8]));
			attr(g, "class", "countiesOutline svelte-11kvbxc");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, path);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 4 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[2](/*mesh*/ ctx[8]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
		}
	};
}

// (78:2) {#each data.voteData as d, i}
function create_each_block$7(ctx) {
	let circle;
	let circle_cx_value;
	let circle_cy_value;
	let circle_r_value;
	let circle_fill_value;
	let circle_stroke_value;

	return {
		c() {
			circle = svg_element("circle");
			this.h();
		},
		l(nodes) {
			circle = claim_element(
				nodes,
				"circle",
				{
					cx: true,
					cy: true,
					r: true,
					fill: true,
					stroke: true
				},
				1
			);

			children(circle).forEach(detach);
			this.h();
		},
		h() {
			attr(circle, "cx", circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[18]).x);
			attr(circle, "cy", circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[18]).y);
			attr(circle, "r", circle_r_value = /*rScale*/ ctx[6](/*d*/ ctx[18].marginVotesAbs));
			attr(circle, "fill", circle_fill_value = /*fillColor*/ ctx[4](/*d*/ ctx[18].margin20));
			attr(circle, "stroke", circle_stroke_value = /*strokeColor*/ ctx[5](/*d*/ ctx[18].margin20));
		},
		m(target, anchor) {
			insert(target, circle, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*xy, data*/ 3 && circle_cx_value !== (circle_cx_value = /*xy*/ ctx[0](/*d*/ ctx[18]).x)) {
				attr(circle, "cx", circle_cx_value);
			}

			if (dirty & /*xy, data*/ 3 && circle_cy_value !== (circle_cy_value = /*xy*/ ctx[0](/*d*/ ctx[18]).y)) {
				attr(circle, "cy", circle_cy_value);
			}

			if (dirty & /*data*/ 2 && circle_r_value !== (circle_r_value = /*rScale*/ ctx[6](/*d*/ ctx[18].marginVotesAbs))) {
				attr(circle, "r", circle_r_value);
			}

			if (dirty & /*data*/ 2 && circle_fill_value !== (circle_fill_value = /*fillColor*/ ctx[4](/*d*/ ctx[18].margin20))) {
				attr(circle, "fill", circle_fill_value);
			}

			if (dirty & /*data*/ 2 && circle_stroke_value !== (circle_stroke_value = /*strokeColor*/ ctx[5](/*d*/ ctx[18].margin20))) {
				attr(circle, "stroke", circle_stroke_value);
			}
		},
		d(detaching) {
			if (detaching) detach(circle);
		}
	};
}

function create_fragment$d(ctx) {
	let t0;
	let t1;
	let g;
	let if_block0 = /*unfilteredCountyGeometries*/ ctx[7].length > 0 && create_if_block_1$1(ctx);
	let if_block1 = /*isFiltered*/ ctx[3] && create_if_block$2(ctx);
	let each_value = /*data*/ ctx[1].voteData;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			if (if_block0) if_block0.l(nodes);
			t0 = claim_space(nodes);
			if (if_block1) if_block1.l(nodes);
			t1 = claim_space(nodes);
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g, "class", "returnedCircles");
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}
		},
		p(ctx, [dirty]) {
			if (/*unfilteredCountyGeometries*/ ctx[7].length > 0) if_block0.p(ctx, dirty);

			if (/*isFiltered*/ ctx[3]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block$2(ctx);
					if_block1.c();
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*xy, data, rScale, fillColor, strokeColor*/ 115) {
				each_value = /*data*/ ctx[1].voteData;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t0);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(t1);
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function hexa$1(hex, opacity) {
	hex = hex.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const result = "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
	return result;
}

function instance$d($$self, $$props, $$invalidate) {
	const { blue, red, nullColor } = colors;
	let { w } = $$props;
	let { xy } = $$props;
	let { data } = $$props;
	let { theGeoPath } = $$props;
	let { isFiltered } = $$props;

	data.voteData.forEach(d => {
		d.marginVotes = +d.margin_votes20;
		d.marginVotesAbs = Math.abs(d.marginVotes);
	});

	const marginVotesMax = max(data.voteData.map(d => d.marginVotesAbs));
	const fillColor = linear().domain([-0.01, 0.01]).range([hexa$1(blue, 0.7), hexa$1(red, 0.7)]).clamp(true);
	const strokeColor = linear().domain([-10, 10]).range([blue, red]).clamp(true);

	const maxSymbolSizeScale = linear().domain([300, 1000]).range([15, 50]).clamp(true); // width
	// r

	const rScale = sqrt().clamp(true).domain([0, marginVotesMax]).range([0, maxSymbolSizeScale(w)]);
	const countyGeometries = data.topojson.objects.counties.geometries;
	const unfilteredCountyGeometries = [];

	const filteredCountyGeometries = countyGeometries.filter(feature => {
		const foundVoteData = data.voteData.find(d => d.fips === feature.properties.GEOID);
		if (!foundVoteData) unfilteredCountyGeometries.push(feature);
		return !!foundVoteData;
	});

	const mesh = merge(data.topojson, filteredCountyGeometries);
	const negativeMesh = merge(data.topojson, unfilteredCountyGeometries);

	$$self.$$set = $$props => {
		if ("w" in $$props) $$invalidate(10, w = $$props.w);
		if ("xy" in $$props) $$invalidate(0, xy = $$props.xy);
		if ("data" in $$props) $$invalidate(1, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(2, theGeoPath = $$props.theGeoPath);
		if ("isFiltered" in $$props) $$invalidate(3, isFiltered = $$props.isFiltered);
	};

	return [
		xy,
		data,
		theGeoPath,
		isFiltered,
		fillColor,
		strokeColor,
		rScale,
		unfilteredCountyGeometries,
		mesh,
		negativeMesh,
		w
	];
}

class RawMarginCirclesLayer extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			w: 10,
			xy: 0,
			data: 1,
			theGeoPath: 2,
			isFiltered: 3
		});
	}
}

/* src/components/stateMap/cityDots.svelte generated by Svelte v3.29.4 */

function get_each_context$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (15:1) {#if dot.layout === 'ne'}
function create_if_block_7(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(nodes, "text", { x: true, y: true, class: true }, 1);
			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "4");
			attr(text_1, "y", "-4");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (19:1) {#if dot.layout === 'e'}
function create_if_block_6(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"alignment-baseline": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "6");
			attr(text_1, "y", "0");
			attr(text_1, "alignment-baseline", "middle");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (23:1) {#if dot.layout === 'se'}
function create_if_block_5(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"alignment-baseline": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "6");
			attr(text_1, "y", "0");
			attr(text_1, "alignment-baseline", "text-before-edge");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (27:1) {#if dot.layout === 'nw'}
function create_if_block_4(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"text-anchor": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "-4");
			attr(text_1, "y", "-4");
			attr(text_1, "text-anchor", "end");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (31:1) {#if dot.layout === 'w'}
function create_if_block_3(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"text-anchor": true,
					"alignment-baseline": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "-6");
			attr(text_1, "y", "0");
			attr(text_1, "text-anchor", "end");
			attr(text_1, "alignment-baseline", "middle");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (35:1) {#if dot.layout === 'sw'}
function create_if_block_2(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"text-anchor": true,
					"alignment-baseline": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "-6");
			attr(text_1, "y", "0");
			attr(text_1, "text-anchor", "end");
			attr(text_1, "alignment-baseline", "text-before-edge");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (39:1) {#if dot.layout === 'n'}
function create_if_block_1$2(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"text-anchor": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "0");
			attr(text_1, "y", "-6");
			attr(text_1, "text-anchor", "middle");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (43:1) {#if dot.layout === 's'}
function create_if_block$3(ctx) {
	let text_1;
	let t_value = /*dot*/ ctx[2].name + "";
	let t;

	return {
		c() {
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					"text-anchor": true,
					"alignment-baseline": true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(text_1, "x", "0");
			attr(text_1, "y", "6");
			attr(text_1, "text-anchor", "middle");
			attr(text_1, "alignment-baseline", "text-before-edge");
			attr(text_1, "class", "svelte-kb07df");
		},
		m(target, anchor) {
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*cities*/ 2 && t_value !== (t_value = /*dot*/ ctx[2].name + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(text_1);
		}
	};
}

// (10:0) {#each cities as dot}
function create_each_block$8(ctx) {
	let g;
	let circle;
	let if_block0_anchor;
	let if_block1_anchor;
	let if_block2_anchor;
	let if_block3_anchor;
	let if_block4_anchor;
	let if_block5_anchor;
	let if_block6_anchor;
	let g_class_value;
	let g_transform_value;
	let if_block0 = /*dot*/ ctx[2].layout === "ne" && create_if_block_7(ctx);
	let if_block1 = /*dot*/ ctx[2].layout === "e" && create_if_block_6(ctx);
	let if_block2 = /*dot*/ ctx[2].layout === "se" && create_if_block_5(ctx);
	let if_block3 = /*dot*/ ctx[2].layout === "nw" && create_if_block_4(ctx);
	let if_block4 = /*dot*/ ctx[2].layout === "w" && create_if_block_3(ctx);
	let if_block5 = /*dot*/ ctx[2].layout === "sw" && create_if_block_2(ctx);
	let if_block6 = /*dot*/ ctx[2].layout === "n" && create_if_block_1$2(ctx);
	let if_block7 = /*dot*/ ctx[2].layout === "s" && create_if_block$3(ctx);

	return {
		c() {
			g = svg_element("g");
			circle = svg_element("circle");
			if (if_block0) if_block0.c();
			if_block0_anchor = empty();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			if (if_block3) if_block3.c();
			if_block3_anchor = empty();
			if (if_block4) if_block4.c();
			if_block4_anchor = empty();
			if (if_block5) if_block5.c();
			if_block5_anchor = empty();
			if (if_block6) if_block6.c();
			if_block6_anchor = empty();
			if (if_block7) if_block7.c();
			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true, transform: true }, 1);
			var g_nodes = children(g);
			circle = claim_element(g_nodes, "circle", { cx: true, xy: true, r: true, class: true }, 1);
			children(circle).forEach(detach);
			if (if_block0) if_block0.l(g_nodes);
			if_block0_anchor = empty();
			if (if_block1) if_block1.l(g_nodes);
			if_block1_anchor = empty();
			if (if_block2) if_block2.l(g_nodes);
			if_block2_anchor = empty();
			if (if_block3) if_block3.l(g_nodes);
			if_block3_anchor = empty();
			if (if_block4) if_block4.l(g_nodes);
			if_block4_anchor = empty();
			if (if_block5) if_block5.l(g_nodes);
			if_block5_anchor = empty();
			if (if_block6) if_block6.l(g_nodes);
			if_block6_anchor = empty();
			if (if_block7) if_block7.l(g_nodes);
			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(circle, "cx", "0");
			attr(circle, "xy", "0");
			attr(circle, "r", "3");
			attr(circle, "class", "svelte-kb07df");
			attr(g, "class", g_class_value = "cityDot " + /*dot*/ ctx[2].class + " svelte-kb07df");
			attr(g, "transform", g_transform_value = "translate(" + /*xy*/ ctx[0](/*dot*/ ctx[2]).x + "," + /*xy*/ ctx[0](/*dot*/ ctx[2]).y + ")");
		},
		m(target, anchor) {
			insert(target, g, anchor);
			append(g, circle);
			if (if_block0) if_block0.m(g, null);
			append(g, if_block0_anchor);
			if (if_block1) if_block1.m(g, null);
			append(g, if_block1_anchor);
			if (if_block2) if_block2.m(g, null);
			append(g, if_block2_anchor);
			if (if_block3) if_block3.m(g, null);
			append(g, if_block3_anchor);
			if (if_block4) if_block4.m(g, null);
			append(g, if_block4_anchor);
			if (if_block5) if_block5.m(g, null);
			append(g, if_block5_anchor);
			if (if_block6) if_block6.m(g, null);
			append(g, if_block6_anchor);
			if (if_block7) if_block7.m(g, null);
		},
		p(ctx, dirty) {
			if (/*dot*/ ctx[2].layout === "ne") {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_7(ctx);
					if_block0.c();
					if_block0.m(g, if_block0_anchor);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*dot*/ ctx[2].layout === "e") {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_6(ctx);
					if_block1.c();
					if_block1.m(g, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*dot*/ ctx[2].layout === "se") {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_5(ctx);
					if_block2.c();
					if_block2.m(g, if_block2_anchor);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*dot*/ ctx[2].layout === "nw") {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_4(ctx);
					if_block3.c();
					if_block3.m(g, if_block3_anchor);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (/*dot*/ ctx[2].layout === "w") {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block_3(ctx);
					if_block4.c();
					if_block4.m(g, if_block4_anchor);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}

			if (/*dot*/ ctx[2].layout === "sw") {
				if (if_block5) {
					if_block5.p(ctx, dirty);
				} else {
					if_block5 = create_if_block_2(ctx);
					if_block5.c();
					if_block5.m(g, if_block5_anchor);
				}
			} else if (if_block5) {
				if_block5.d(1);
				if_block5 = null;
			}

			if (/*dot*/ ctx[2].layout === "n") {
				if (if_block6) {
					if_block6.p(ctx, dirty);
				} else {
					if_block6 = create_if_block_1$2(ctx);
					if_block6.c();
					if_block6.m(g, if_block6_anchor);
				}
			} else if (if_block6) {
				if_block6.d(1);
				if_block6 = null;
			}

			if (/*dot*/ ctx[2].layout === "s") {
				if (if_block7) {
					if_block7.p(ctx, dirty);
				} else {
					if_block7 = create_if_block$3(ctx);
					if_block7.c();
					if_block7.m(g, null);
				}
			} else if (if_block7) {
				if_block7.d(1);
				if_block7 = null;
			}

			if (dirty & /*cities*/ 2 && g_class_value !== (g_class_value = "cityDot " + /*dot*/ ctx[2].class + " svelte-kb07df")) {
				attr(g, "class", g_class_value);
			}

			if (dirty & /*xy, cities*/ 3 && g_transform_value !== (g_transform_value = "translate(" + /*xy*/ ctx[0](/*dot*/ ctx[2]).x + "," + /*xy*/ ctx[0](/*dot*/ ctx[2]).y + ")")) {
				attr(g, "transform", g_transform_value);
			}
		},
		d(detaching) {
			if (detaching) detach(g);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			if (if_block6) if_block6.d();
			if (if_block7) if_block7.d();
		}
	};
}

function create_fragment$e(ctx) {
	let each_1_anchor;
	let each_value = /*cities*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		l(nodes) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(nodes);
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (dirty & /*cities, xy*/ 3) {
				each_value = /*cities*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$8(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$e($$self, $$props, $$invalidate) {
	let { xy } = $$props;
	let { cities } = $$props;

	$$self.$$set = $$props => {
		if ("xy" in $$props) $$invalidate(0, xy = $$props.xy);
		if ("cities" in $$props) $$invalidate(1, cities = $$props.cities);
	};

	return [xy, cities];
}

class CityDots extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$e, create_fragment$e, safe_not_equal, { xy: 0, cities: 1 });
	}
}

/* src/components/stateMap/HighlightCountyLayer.svelte generated by Svelte v3.29.4 */

function get_each_context$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[4] = list[i];
	child_ctx[6] = i;
	return child_ctx;
}

// (26:2) {#each highlightedCounties as county, i}
function create_each_block$9(ctx) {
	let path;
	let path_d_value;
	let text_1;
	let t_value = /*county*/ ctx[4].properties.NAME + "" + "";
	let t;
	let text_1_transform_value;

	return {
		c() {
			path = svg_element("path");
			text_1 = svg_element("text");
			t = text(t_value);
			this.h();
		},
		l(nodes) {
			path = claim_element(nodes, "path", { d: true }, 1);
			children(path).forEach(detach);

			text_1 = claim_element(
				nodes,
				"text",
				{
					x: true,
					y: true,
					transform: true,
					class: true
				},
				1
			);

			var text_1_nodes = children(text_1);
			t = claim_text(text_1_nodes, t_value);
			text_1_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[0](/*county*/ ctx[4]));
			attr(text_1, "x", "0");
			attr(text_1, "y", "0");
			attr(text_1, "transform", text_1_transform_value = "translate(" + /*county*/ ctx[4].labelLoc.join(",") + ")");
			attr(text_1, "class", "svelte-vw3wl4");
		},
		m(target, anchor) {
			insert(target, path, anchor);
			insert(target, text_1, anchor);
			append(text_1, t);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath*/ 1 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[0](/*county*/ ctx[4]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
			if (detaching) detach(text_1);
		}
	};
}

function create_fragment$f(ctx) {
	let g;
	let each_value = /*highlightedCounties*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
	}

	return {
		c() {
			g = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			this.h();
		},
		l(nodes) {
			g = claim_element(nodes, "g", { class: true }, 1);
			var g_nodes = children(g);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g_nodes);
			}

			g_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g, "class", "highlightedCounties svelte-vw3wl4");
		},
		m(target, anchor) {
			insert(target, g, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*highlightedCounties, theGeoPath*/ 3) {
				each_value = /*highlightedCounties*/ ctx[1];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$9(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$9(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(g);
			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$f($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { theGeoPath } = $$props;
	let { highlight } = $$props;

	const highlightedCounties = data.countiesGeo.features.filter(feature => {
		const name = feature.properties.NAME;
		return highlight.split(",").map(d => d.trim()).includes(name);
	});

	highlightedCounties.forEach(county => {
		const [min, max] = theGeoPath.bounds(county);
		const [minX, minY] = min;
		const [maxX, maxY] = max;
		const h = maxY - minY;
		county.labelLoc = [maxX + 5, minY + h / 2];
	});

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(2, data = $$props.data);
		if ("theGeoPath" in $$props) $$invalidate(0, theGeoPath = $$props.theGeoPath);
		if ("highlight" in $$props) $$invalidate(3, highlight = $$props.highlight);
	};

	return [theGeoPath, highlightedCounties, data, highlight];
}

class HighlightCountyLayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$f, create_fragment$f, safe_not_equal, { data: 2, theGeoPath: 0, highlight: 3 });
	}
}

/* src/components/stateMap/index.svelte generated by Svelte v3.29.4 */

function get_each_context$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	child_ctx[22] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[20] = list[i];
	child_ctx[22] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	child_ctx[22] = i;
	return child_ctx;
}

// (106:1) {#if ready}
function create_if_block_6$1(ctx) {
	let defs;
	let g0;
	let g0_id_value;
	let g0_height_value;
	let marker0;
	let path0;
	let marker1;
	let path1;
	let g6;
	let g1;
	let use0;
	let use0_xlink_href_value;
	let g2;
	let use1;
	let use1_xlink_href_value;
	let g3;
	let current_block_type_index;
	let if_block0;
	let g4;
	let g5;
	let use2;
	let use2_xlink_href_value;
	let g7;
	let current_block_type_index_1;
	let if_block1;
	let if_block1_anchor;
	let if_block2_anchor;
	let current;
	let each_value_2 = /*data*/ ctx[0].stateOutlineGeo.features;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_2.length; i += 1) {
		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
	}

	const if_block_creators = [create_if_block_13, create_if_block_14, create_if_block_15, create_if_block_16];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*mode*/ ctx[1] === "choropleth") return 0;
		if (/*mode*/ ctx[1] === "turnout-choropleth") return 1;
		if (/*mode*/ ctx[1] === "covid-deaths") return 2;
		if (/*isFiltered*/ ctx[13] && (/*mode*/ ctx[1] === "swing" || /*mode*/ ctx[1] === "margin" || /*mode*/ ctx[1] === "margin-flips")) return 3;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	let each_value = /*data*/ ctx[0].countiesGeo.features;
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
	}

	const if_block_creators_1 = [create_if_block_9, create_if_block_10, create_if_block_11, create_if_block_12];
	const if_blocks_1 = [];

	function select_block_type_1(ctx, dirty) {
		if (/*mode*/ ctx[1] === "swing") return 0;
		if (/*mode*/ ctx[1] === "some-circles") return 1;
		if (/*mode*/ ctx[1] === "fracking") return 2;
		if (/*mode*/ ctx[1] === "margin-flips") return 3;
		return -1;
	}

	if (~(current_block_type_index_1 = select_block_type_1(ctx))) {
		if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
	}

	let if_block2 = (/*mode*/ ctx[1] === "margin" || /*mode*/ ctx[1] === "margin-flips") && create_if_block_8(ctx);
	let if_block3 = /*highlight*/ ctx[2] && create_if_block_7$1(ctx);

	return {
		c() {
			defs = svg_element("defs");
			g0 = svg_element("g");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			marker0 = svg_element("marker");
			path0 = svg_element("path");
			marker1 = svg_element("marker");
			path1 = svg_element("path");
			g6 = svg_element("g");
			g1 = svg_element("g");
			use0 = svg_element("use");
			g2 = svg_element("g");
			use1 = svg_element("use");
			g3 = svg_element("g");
			if (if_block0) if_block0.c();
			g4 = svg_element("g");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			g5 = svg_element("g");
			use2 = svg_element("use");
			g7 = svg_element("g");
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
			if (if_block3) if_block3.c();
			this.h();
		},
		l(nodes) {
			defs = claim_element(nodes, "defs", {}, 1);
			var defs_nodes = children(defs);
			g0 = claim_element(defs_nodes, "g", { id: true, width: true, height: true }, 1);
			var g0_nodes = children(g0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].l(g0_nodes);
			}

			g0_nodes.forEach(detach);

			marker0 = claim_element(
				defs_nodes,
				"marker",
				{
					id: true,
					viewBox: true,
					refX: true,
					refY: true,
					markerUnits: true,
					markerWidth: true,
					markerHeight: true,
					orient: true
				},
				1
			);

			var marker0_nodes = children(marker0);
			path0 = claim_element(marker0_nodes, "path", { d: true, style: true, class: true }, 1);
			children(path0).forEach(detach);
			marker0_nodes.forEach(detach);

			marker1 = claim_element(
				defs_nodes,
				"marker",
				{
					id: true,
					viewBox: true,
					refX: true,
					refY: true,
					markerUnits: true,
					markerWidth: true,
					markerHeight: true,
					orient: true
				},
				1
			);

			var marker1_nodes = children(marker1);
			path1 = claim_element(marker1_nodes, "path", { d: true, style: true, class: true }, 1);
			children(path1).forEach(detach);
			marker1_nodes.forEach(detach);
			defs_nodes.forEach(detach);
			g6 = claim_element(nodes, "g", { class: true }, 1);
			var g6_nodes = children(g6);
			g1 = claim_element(g6_nodes, "g", { class: true }, 1);
			var g1_nodes = children(g1);
			use0 = claim_element(g1_nodes, "use", { "xlink:href": true }, 1);
			children(use0).forEach(detach);
			g1_nodes.forEach(detach);
			g2 = claim_element(g6_nodes, "g", { class: true }, 1);
			var g2_nodes = children(g2);
			use1 = claim_element(g2_nodes, "use", { "xlink:href": true }, 1);
			children(use1).forEach(detach);
			g2_nodes.forEach(detach);
			g3 = claim_element(g6_nodes, "g", { class: true }, 1);
			var g3_nodes = children(g3);
			if (if_block0) if_block0.l(g3_nodes);
			g3_nodes.forEach(detach);
			g4 = claim_element(g6_nodes, "g", { class: true }, 1);
			var g4_nodes = children(g4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(g4_nodes);
			}

			g4_nodes.forEach(detach);
			g5 = claim_element(g6_nodes, "g", { class: true }, 1);
			var g5_nodes = children(g5);
			use2 = claim_element(g5_nodes, "use", { "xlink:href": true }, 1);
			children(use2).forEach(detach);
			g5_nodes.forEach(detach);
			g6_nodes.forEach(detach);
			g7 = claim_element(nodes, "g", { class: true }, 1);
			var g7_nodes = children(g7);
			if (if_block1) if_block1.l(g7_nodes);
			if_block1_anchor = empty();
			if (if_block2) if_block2.l(g7_nodes);
			if_block2_anchor = empty();
			if (if_block3) if_block3.l(g7_nodes);
			g7_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(g0, "id", g0_id_value = "" + (/*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9]));
			attr(g0, "width", /*w*/ ctx[9]);
			attr(g0, "height", g0_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11]);
			attr(path0, "d", "M 0 3 L 10 5 L 0 7 z");
			set_style(path0, "fill", colors.blue);
			attr(path0, "class", "svelte-vyon6o");
			attr(marker0, "id", "arrowhead-blue");
			attr(marker0, "viewBox", "0 0 10 10");
			attr(marker0, "refX", "1");
			attr(marker0, "refY", "5");
			attr(marker0, "markerUnits", "strokeWidth");
			attr(marker0, "markerWidth", "6");
			attr(marker0, "markerHeight", "6");
			attr(marker0, "orient", "auto");
			attr(path1, "d", "M 0 3 L 10 5 L 0 7 z");
			set_style(path1, "fill", colors.red);
			attr(path1, "class", "svelte-vyon6o");
			attr(marker1, "id", "arrowhead-red");
			attr(marker1, "viewBox", "0 0 10 10");
			attr(marker1, "refX", "1");
			attr(marker1, "refY", "5");
			attr(marker1, "markerUnits", "strokeWidth");
			attr(marker1, "markerWidth", "6");
			attr(marker1, "markerHeight", "6");
			attr(marker1, "orient", "auto");
			xlink_attr(use0, "xlink:href", use0_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9]);
			attr(g1, "class", "stateGlow");
			xlink_attr(use1, "xlink:href", use1_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9]);
			attr(g2, "class", "stateFill");
			attr(g3, "class", "countyFill");
			attr(g4, "class", "countyStroke");
			xlink_attr(use2, "xlink:href", use2_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9]);
			attr(g5, "class", "stateOutline");
			attr(g6, "class", "baseLayers");
			attr(g7, "class", "overlayLayers");
		},
		m(target, anchor) {
			insert(target, defs, anchor);
			append(defs, g0);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(g0, null);
			}

			append(defs, marker0);
			append(marker0, path0);
			append(defs, marker1);
			append(marker1, path1);
			insert(target, g6, anchor);
			append(g6, g1);
			append(g1, use0);
			append(g6, g2);
			append(g2, use1);
			append(g6, g3);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(g3, null);
			}

			append(g6, g4);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(g4, null);
			}

			append(g6, g5);
			append(g5, use2);
			insert(target, g7, anchor);

			if (~current_block_type_index_1) {
				if_blocks_1[current_block_type_index_1].m(g7, null);
			}

			append(g7, if_block1_anchor);
			if (if_block2) if_block2.m(g7, null);
			append(g7, if_block2_anchor);
			if (if_block3) if_block3.m(g7, null);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 1025) {
				each_value_2 = /*data*/ ctx[0].stateOutlineGeo.features;
				let i;

				for (i = 0; i < each_value_2.length; i += 1) {
					const child_ctx = get_each_context_2(ctx, each_value_2, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(g0, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_2.length;
			}

			if (!current || dirty & /*w*/ 512 && g0_id_value !== (g0_id_value = "" + (/*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9]))) {
				attr(g0, "id", g0_id_value);
			}

			if (!current || dirty & /*w*/ 512) {
				attr(g0, "width", /*w*/ ctx[9]);
			}

			if (!current || dirty & /*w, aspectRatio*/ 2560 && g0_height_value !== (g0_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11])) {
				attr(g0, "height", g0_height_value);
			}

			if (!current || dirty & /*w*/ 512 && use0_xlink_href_value !== (use0_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9])) {
				xlink_attr(use0, "xlink:href", use0_xlink_href_value);
			}

			if (!current || dirty & /*w*/ 512 && use1_xlink_href_value !== (use1_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9])) {
				xlink_attr(use1, "xlink:href", use1_xlink_href_value);
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block0) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block0 = if_blocks[current_block_type_index];

					if (!if_block0) {
						if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block0.c();
					}

					transition_in(if_block0, 1);
					if_block0.m(g3, null);
				} else {
					if_block0 = null;
				}
			}

			if (dirty & /*theGeoPath, data*/ 1025) {
				each_value = /*data*/ ctx[0].countiesGeo.features;
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$a(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$a(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(g4, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*w*/ 512 && use2_xlink_href_value !== (use2_xlink_href_value = "#" + /*state*/ ctx[15] + "-stateShapes-" + /*w*/ ctx[9])) {
				xlink_attr(use2, "xlink:href", use2_xlink_href_value);
			}

			let previous_block_index_1 = current_block_type_index_1;
			current_block_type_index_1 = select_block_type_1(ctx);

			if (current_block_type_index_1 === previous_block_index_1) {
				if (~current_block_type_index_1) {
					if_blocks_1[current_block_type_index_1].p(ctx, dirty);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
						if_blocks_1[previous_block_index_1] = null;
					});

					check_outros();
				}

				if (~current_block_type_index_1) {
					if_block1 = if_blocks_1[current_block_type_index_1];

					if (!if_block1) {
						if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
						if_block1.c();
					}

					transition_in(if_block1, 1);
					if_block1.m(g7, if_block1_anchor);
				} else {
					if_block1 = null;
				}
			}

			if (/*mode*/ ctx[1] === "margin" || /*mode*/ ctx[1] === "margin-flips") {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*mode*/ 2) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_8(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(g7, if_block2_anchor);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (/*highlight*/ ctx[2]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*highlight*/ 4) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block_7$1(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(g7, null);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(if_block3);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(if_block3);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(defs);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach(g6);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			destroy_each(each_blocks, detaching);
			if (detaching) detach(g7);

			if (~current_block_type_index_1) {
				if_blocks_1[current_block_type_index_1].d();
			}

			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
		}
	};
}

// (110:4) {#each data.stateOutlineGeo.features as state, i}
function create_each_block_2(ctx) {
	let path;
	let path_d_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(nodes, "path", { d: true, class: true }, 1);
			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[10](/*state*/ ctx[15]));
			attr(path, "class", "svelte-vyon6o");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 1025 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[10](/*state*/ ctx[15]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (149:95) 
function create_if_block_16(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[0].countiesGeo.features;
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		l(nodes) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].l(nodes);
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data, countyFill*/ 17409) {
				each_value_1 = /*data*/ ctx[0].countiesGeo.features;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

// (147:38) 
function create_if_block_15(ctx) {
	let coviddeathschoroplethlayer;
	let current;

	coviddeathschoroplethlayer = new CovidDeathsChoroplethLayer({
			props: {
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(coviddeathschoroplethlayer.$$.fragment);
		},
		l(nodes) {
			claim_component(coviddeathschoroplethlayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(coviddeathschoroplethlayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const coviddeathschoroplethlayer_changes = {};
			if (dirty & /*theGeoPath*/ 1024) coviddeathschoroplethlayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) coviddeathschoroplethlayer_changes.data = /*data*/ ctx[0];
			coviddeathschoroplethlayer.$set(coviddeathschoroplethlayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(coviddeathschoroplethlayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(coviddeathschoroplethlayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(coviddeathschoroplethlayer, detaching);
		}
	};
}

// (145:44) 
function create_if_block_14(ctx) {
	let turnoutchoroplethlayer;
	let current;

	turnoutchoroplethlayer = new TurnoutChoroplethLayer({
			props: {
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(turnoutchoroplethlayer.$$.fragment);
		},
		l(nodes) {
			claim_component(turnoutchoroplethlayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(turnoutchoroplethlayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const turnoutchoroplethlayer_changes = {};
			if (dirty & /*theGeoPath*/ 1024) turnoutchoroplethlayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) turnoutchoroplethlayer_changes.data = /*data*/ ctx[0];
			turnoutchoroplethlayer.$set(turnoutchoroplethlayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(turnoutchoroplethlayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(turnoutchoroplethlayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(turnoutchoroplethlayer, detaching);
		}
	};
}

// (143:4) {#if mode === 'choropleth'}
function create_if_block_13(ctx) {
	let choroplethlayer;
	let current;

	choroplethlayer = new ChoroplethLayer({
			props: {
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(choroplethlayer.$$.fragment);
		},
		l(nodes) {
			claim_component(choroplethlayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(choroplethlayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const choroplethlayer_changes = {};
			if (dirty & /*theGeoPath*/ 1024) choroplethlayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) choroplethlayer_changes.data = /*data*/ ctx[0];
			choroplethlayer.$set(choroplethlayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(choroplethlayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(choroplethlayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(choroplethlayer, detaching);
		}
	};
}

// (150:5) {#each data.countiesGeo.features as county, i}
function create_each_block_1(ctx) {
	let path;
	let path_d_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(nodes, "path", { d: true, style: true, class: true }, 1);
			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[10](/*county*/ ctx[20]));
			set_style(path, "fill", /*countyFill*/ ctx[14](/*county*/ ctx[20]));
			attr(path, "class", "svelte-vyon6o");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 1025 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[10](/*county*/ ctx[20]))) {
				attr(path, "d", path_d_value);
			}

			if (dirty & /*data*/ 1) {
				set_style(path, "fill", /*countyFill*/ ctx[14](/*county*/ ctx[20]));
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (157:4) {#each data.countiesGeo.features as county, i}
function create_each_block$a(ctx) {
	let path;
	let path_d_value;

	return {
		c() {
			path = svg_element("path");
			this.h();
		},
		l(nodes) {
			path = claim_element(nodes, "path", { d: true, class: true }, 1);
			children(path).forEach(detach);
			this.h();
		},
		h() {
			attr(path, "d", path_d_value = /*theGeoPath*/ ctx[10](/*county*/ ctx[20]));
			attr(path, "class", "svelte-vyon6o");
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*theGeoPath, data*/ 1025 && path_d_value !== (path_d_value = /*theGeoPath*/ ctx[10](/*county*/ ctx[20]))) {
				attr(path, "d", path_d_value);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

// (174:37) 
function create_if_block_12(ctx) {
	let outlineflipslayer;
	let current;

	outlineflipslayer = new OutlineFlipsLayer({
			props: {
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(outlineflipslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(outlineflipslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(outlineflipslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const outlineflipslayer_changes = {};
			if (dirty & /*theGeoPath*/ 1024) outlineflipslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) outlineflipslayer_changes.data = /*data*/ ctx[0];
			outlineflipslayer.$set(outlineflipslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(outlineflipslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(outlineflipslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(outlineflipslayer, detaching);
		}
	};
}

// (172:33) 
function create_if_block_11(ctx) {
	let frackinglayer;
	let current;

	frackinglayer = new FrackingLayer({
			props: {
				xy: /*xy*/ ctx[12],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(frackinglayer.$$.fragment);
		},
		l(nodes) {
			claim_component(frackinglayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(frackinglayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const frackinglayer_changes = {};
			if (dirty & /*xy*/ 4096) frackinglayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) frackinglayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) frackinglayer_changes.data = /*data*/ ctx[0];
			frackinglayer.$set(frackinglayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(frackinglayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(frackinglayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(frackinglayer, detaching);
		}
	};
}

// (170:37) 
function create_if_block_10(ctx) {
	let somecircleslayer;
	let current;

	somecircleslayer = new SomeCirclesLayer({
			props: {
				xy: /*xy*/ ctx[12],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(somecircleslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(somecircleslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(somecircleslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const somecircleslayer_changes = {};
			if (dirty & /*xy*/ 4096) somecircleslayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) somecircleslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) somecircleslayer_changes.data = /*data*/ ctx[0];
			somecircleslayer.$set(somecircleslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(somecircleslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(somecircleslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(somecircleslayer, detaching);
		}
	};
}

// (168:3) {#if mode === 'swing'}
function create_if_block_9(ctx) {
	let swingarrowslayer;
	let current;

	swingarrowslayer = new SwingArrowsLayer({
			props: {
				w: /*w*/ ctx[9],
				isFiltered: /*isFiltered*/ ctx[13],
				xy: /*xy*/ ctx[12],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(swingarrowslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(swingarrowslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(swingarrowslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const swingarrowslayer_changes = {};
			if (dirty & /*w*/ 512) swingarrowslayer_changes.w = /*w*/ ctx[9];
			if (dirty & /*xy*/ 4096) swingarrowslayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) swingarrowslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) swingarrowslayer_changes.data = /*data*/ ctx[0];
			swingarrowslayer.$set(swingarrowslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(swingarrowslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(swingarrowslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(swingarrowslayer, detaching);
		}
	};
}

// (178:3) {#if mode === 'margin' || mode === 'margin-flips'}
function create_if_block_8(ctx) {
	let rawmargincircleslayer;
	let current;

	rawmargincircleslayer = new RawMarginCirclesLayer({
			props: {
				w: /*w*/ ctx[9],
				xy: /*xy*/ ctx[12],
				isFiltered: /*isFiltered*/ ctx[13],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(rawmargincircleslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(rawmargincircleslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(rawmargincircleslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const rawmargincircleslayer_changes = {};
			if (dirty & /*w*/ 512) rawmargincircleslayer_changes.w = /*w*/ ctx[9];
			if (dirty & /*xy*/ 4096) rawmargincircleslayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) rawmargincircleslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) rawmargincircleslayer_changes.data = /*data*/ ctx[0];
			rawmargincircleslayer.$set(rawmargincircleslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(rawmargincircleslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(rawmargincircleslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(rawmargincircleslayer, detaching);
		}
	};
}

// (182:3) {#if highlight}
function create_if_block_7$1(ctx) {
	let highlightcountylayer;
	let current;

	highlightcountylayer = new HighlightCountyLayer({
			props: {
				highlight: /*highlight*/ ctx[2],
				data: /*data*/ ctx[0],
				theGeoPath: /*theGeoPath*/ ctx[10]
			}
		});

	return {
		c() {
			create_component(highlightcountylayer.$$.fragment);
		},
		l(nodes) {
			claim_component(highlightcountylayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(highlightcountylayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const highlightcountylayer_changes = {};
			if (dirty & /*highlight*/ 4) highlightcountylayer_changes.highlight = /*highlight*/ ctx[2];
			if (dirty & /*data*/ 1) highlightcountylayer_changes.data = /*data*/ ctx[0];
			if (dirty & /*theGeoPath*/ 1024) highlightcountylayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			highlightcountylayer.$set(highlightcountylayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(highlightcountylayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(highlightcountylayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(highlightcountylayer, detaching);
		}
	};
}

// (193:39) 
function create_if_block_5$1(ctx) {
	let precinctmarginslayer;
	let current;

	precinctmarginslayer = new PrecinctMarginsLayer({
			props: {
				w: /*w*/ ctx[9],
				aspectRatio: /*aspectRatio*/ ctx[11],
				xy: /*xy*/ ctx[12],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(precinctmarginslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(precinctmarginslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(precinctmarginslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const precinctmarginslayer_changes = {};
			if (dirty & /*w*/ 512) precinctmarginslayer_changes.w = /*w*/ ctx[9];
			if (dirty & /*aspectRatio*/ 2048) precinctmarginslayer_changes.aspectRatio = /*aspectRatio*/ ctx[11];
			if (dirty & /*xy*/ 4096) precinctmarginslayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) precinctmarginslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) precinctmarginslayer_changes.data = /*data*/ ctx[0];
			precinctmarginslayer.$set(precinctmarginslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(precinctmarginslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(precinctmarginslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(precinctmarginslayer, detaching);
		}
	};
}

// (191:1) {#if mode === 'test-canvas'}
function create_if_block_4$1(ctx) {
	let testcanvaslayer;
	let current;

	testcanvaslayer = new TestCanvasLayer({
			props: {
				w: /*w*/ ctx[9],
				aspectRatio: /*aspectRatio*/ ctx[11],
				xy: /*xy*/ ctx[12],
				theGeoPath: /*theGeoPath*/ ctx[10],
				data: /*data*/ ctx[0]
			}
		});

	return {
		c() {
			create_component(testcanvaslayer.$$.fragment);
		},
		l(nodes) {
			claim_component(testcanvaslayer.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(testcanvaslayer, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const testcanvaslayer_changes = {};
			if (dirty & /*w*/ 512) testcanvaslayer_changes.w = /*w*/ ctx[9];
			if (dirty & /*aspectRatio*/ 2048) testcanvaslayer_changes.aspectRatio = /*aspectRatio*/ ctx[11];
			if (dirty & /*xy*/ 4096) testcanvaslayer_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*theGeoPath*/ 1024) testcanvaslayer_changes.theGeoPath = /*theGeoPath*/ ctx[10];
			if (dirty & /*data*/ 1) testcanvaslayer_changes.data = /*data*/ ctx[0];
			testcanvaslayer.$set(testcanvaslayer_changes);
		},
		i(local) {
			if (current) return;
			transition_in(testcanvaslayer.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(testcanvaslayer.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(testcanvaslayer, detaching);
		}
	};
}

// (198:2) {#if citiesToLabel}
function create_if_block_3$1(ctx) {
	let citydots;
	let current;

	citydots = new CityDots({
			props: {
				xy: /*xy*/ ctx[12],
				cities: /*cities*/ ctx[7]
			}
		});

	return {
		c() {
			create_component(citydots.$$.fragment);
		},
		l(nodes) {
			claim_component(citydots.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(citydots, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const citydots_changes = {};
			if (dirty & /*xy*/ 4096) citydots_changes.xy = /*xy*/ ctx[12];
			if (dirty & /*cities*/ 128) citydots_changes.cities = /*cities*/ ctx[7];
			citydots.$set(citydots_changes);
		},
		i(local) {
			if (current) return;
			transition_in(citydots.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(citydots.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(citydots, detaching);
		}
	};
}

// (203:1) {#if mode === 'swing' && arrowKey}
function create_if_block_2$1(ctx) {
	let arrowkey;
	let current;
	arrowkey = new ArrowKey({ props: { keyClass: /*arrowKey*/ ctx[3] } });

	return {
		c() {
			create_component(arrowkey.$$.fragment);
		},
		l(nodes) {
			claim_component(arrowkey.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(arrowkey, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const arrowkey_changes = {};
			if (dirty & /*arrowKey*/ 8) arrowkey_changes.keyClass = /*arrowKey*/ ctx[3];
			arrowkey.$set(arrowkey_changes);
		},
		i(local) {
			if (current) return;
			transition_in(arrowkey.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(arrowkey.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(arrowkey, detaching);
		}
	};
}

// (207:1) {#if (mode === 'margin' || mode==='margin-flips') && bubbleMarginKey}
function create_if_block_1$3(ctx) {
	let bubblemarginkey;
	let current;

	bubblemarginkey = new BubbleMarginKey({
			props: { keyClass: /*bubbleMarginKey*/ ctx[4] }
		});

	return {
		c() {
			create_component(bubblemarginkey.$$.fragment);
		},
		l(nodes) {
			claim_component(bubblemarginkey.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(bubblemarginkey, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const bubblemarginkey_changes = {};
			if (dirty & /*bubbleMarginKey*/ 16) bubblemarginkey_changes.keyClass = /*bubbleMarginKey*/ ctx[4];
			bubblemarginkey.$set(bubblemarginkey_changes);
		},
		i(local) {
			if (current) return;
			transition_in(bubblemarginkey.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(bubblemarginkey.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(bubblemarginkey, detaching);
		}
	};
}

// (211:1) {#if mode === 'turnout-choropleth' && turnoutKey}
function create_if_block$4(ctx) {
	let turnoutkey;
	let current;

	turnoutkey = new TurnoutKey({
			props: { keyClass: /*turnoutKey*/ ctx[5] }
		});

	return {
		c() {
			create_component(turnoutkey.$$.fragment);
		},
		l(nodes) {
			claim_component(turnoutkey.$$.fragment, nodes);
		},
		m(target, anchor) {
			mount_component(turnoutkey, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const turnoutkey_changes = {};
			if (dirty & /*turnoutKey*/ 32) turnoutkey_changes.keyClass = /*turnoutKey*/ ctx[5];
			turnoutkey.$set(turnoutkey_changes);
		},
		i(local) {
			if (current) return;
			transition_in(turnoutkey.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(turnoutkey.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(turnoutkey, detaching);
		}
	};
}

function create_fragment$g(ctx) {
	let div;
	let svg0;
	let svg0_class_value;
	let svg0_height_value;
	let t0;
	let current_block_type_index;
	let if_block1;
	let t1;
	let svg1;
	let svg1_height_value;
	let t2;
	let t3;
	let t4;
	let div_class_value;
	let div_resize_listener;
	let current;
	let if_block0 = /*ready*/ ctx[8] && create_if_block_6$1(ctx);
	const if_block_creators = [create_if_block_4$1, create_if_block_5$1];
	const if_blocks = [];

	function select_block_type_2(ctx, dirty) {
		if (/*mode*/ ctx[1] === "test-canvas") return 0;
		if (/*mode*/ ctx[1] === "precinct-margins") return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type_2(ctx))) {
		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	let if_block2 = /*citiesToLabel*/ ctx[6] && create_if_block_3$1(ctx);
	let if_block3 = /*mode*/ ctx[1] === "swing" && /*arrowKey*/ ctx[3] && create_if_block_2$1(ctx);
	let if_block4 = (/*mode*/ ctx[1] === "margin" || /*mode*/ ctx[1] === "margin-flips") && /*bubbleMarginKey*/ ctx[4] && create_if_block_1$3(ctx);
	let if_block5 = /*mode*/ ctx[1] === "turnout-choropleth" && /*turnoutKey*/ ctx[5] && create_if_block$4(ctx);

	return {
		c() {
			div = element("div");
			svg0 = svg_element("svg");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			svg1 = svg_element("svg");
			if (if_block2) if_block2.c();
			t2 = space();
			if (if_block3) if_block3.c();
			t3 = space();
			if (if_block4) if_block4.c();
			t4 = space();
			if (if_block5) if_block5.c();
			this.h();
		},
		l(nodes) {
			div = claim_element(nodes, "DIV", { class: true });
			var div_nodes = children(div);
			svg0 = claim_element(div_nodes, "svg", { class: true, width: true, height: true }, 1);
			var svg0_nodes = children(svg0);
			if (if_block0) if_block0.l(svg0_nodes);
			svg0_nodes.forEach(detach);
			t0 = claim_space(div_nodes);
			if (if_block1) if_block1.l(div_nodes);
			t1 = claim_space(div_nodes);
			svg1 = claim_element(div_nodes, "svg", { class: true, width: true, height: true }, 1);
			var svg1_nodes = children(svg1);
			if (if_block2) if_block2.l(svg1_nodes);
			svg1_nodes.forEach(detach);
			t2 = claim_space(div_nodes);
			if (if_block3) if_block3.l(div_nodes);
			t3 = claim_space(div_nodes);
			if (if_block4) if_block4.l(div_nodes);
			t4 = claim_space(div_nodes);
			if (if_block5) if_block5.l(div_nodes);
			div_nodes.forEach(detach);
			this.h();
		},
		h() {
			attr(svg0, "class", svg0_class_value = "stateMap-svg stateMap-svg-" + /*state*/ ctx[15] + " svelte-vyon6o");
			attr(svg0, "width", /*w*/ ctx[9]);
			attr(svg0, "height", svg0_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11]);
			attr(svg1, "class", "overlayLabels svelte-vyon6o");
			attr(svg1, "width", /*w*/ ctx[9]);
			attr(svg1, "height", svg1_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11]);
			attr(div, "class", div_class_value = "stateMap mode-" + /*mode*/ ctx[1] + " svelte-vyon6o");
			add_render_callback(() => /*div_elementresize_handler*/ ctx[17].call(div));
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, svg0);
			if (if_block0) if_block0.m(svg0, null);
			append(div, t0);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			append(div, t1);
			append(div, svg1);
			if (if_block2) if_block2.m(svg1, null);
			append(div, t2);
			if (if_block3) if_block3.m(div, null);
			append(div, t3);
			if (if_block4) if_block4.m(div, null);
			append(div, t4);
			if (if_block5) if_block5.m(div, null);
			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[17].bind(div));
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*ready*/ ctx[8]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*ready*/ 256) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_6$1(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(svg0, null);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*w*/ 512) {
				attr(svg0, "width", /*w*/ ctx[9]);
			}

			if (!current || dirty & /*w, aspectRatio*/ 2560 && svg0_height_value !== (svg0_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11])) {
				attr(svg0, "height", svg0_height_value);
			}

			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_2(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block1) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block1 = if_blocks[current_block_type_index];

					if (!if_block1) {
						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block1.c();
					}

					transition_in(if_block1, 1);
					if_block1.m(div, t1);
				} else {
					if_block1 = null;
				}
			}

			if (/*citiesToLabel*/ ctx[6]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*citiesToLabel*/ 64) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block_3$1(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(svg1, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*w*/ 512) {
				attr(svg1, "width", /*w*/ ctx[9]);
			}

			if (!current || dirty & /*w, aspectRatio*/ 2560 && svg1_height_value !== (svg1_height_value = /*w*/ ctx[9] * /*aspectRatio*/ ctx[11])) {
				attr(svg1, "height", svg1_height_value);
			}

			if (/*mode*/ ctx[1] === "swing" && /*arrowKey*/ ctx[3]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);

					if (dirty & /*mode, arrowKey*/ 10) {
						transition_in(if_block3, 1);
					}
				} else {
					if_block3 = create_if_block_2$1(ctx);
					if_block3.c();
					transition_in(if_block3, 1);
					if_block3.m(div, t3);
				}
			} else if (if_block3) {
				group_outros();

				transition_out(if_block3, 1, 1, () => {
					if_block3 = null;
				});

				check_outros();
			}

			if ((/*mode*/ ctx[1] === "margin" || /*mode*/ ctx[1] === "margin-flips") && /*bubbleMarginKey*/ ctx[4]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);

					if (dirty & /*mode, bubbleMarginKey*/ 18) {
						transition_in(if_block4, 1);
					}
				} else {
					if_block4 = create_if_block_1$3(ctx);
					if_block4.c();
					transition_in(if_block4, 1);
					if_block4.m(div, t4);
				}
			} else if (if_block4) {
				group_outros();

				transition_out(if_block4, 1, 1, () => {
					if_block4 = null;
				});

				check_outros();
			}

			if (/*mode*/ ctx[1] === "turnout-choropleth" && /*turnoutKey*/ ctx[5]) {
				if (if_block5) {
					if_block5.p(ctx, dirty);

					if (dirty & /*mode, turnoutKey*/ 34) {
						transition_in(if_block5, 1);
					}
				} else {
					if_block5 = create_if_block$4(ctx);
					if_block5.c();
					transition_in(if_block5, 1);
					if_block5.m(div, null);
				}
			} else if (if_block5) {
				group_outros();

				transition_out(if_block5, 1, 1, () => {
					if_block5 = null;
				});

				check_outros();
			}

			if (!current || dirty & /*mode*/ 2 && div_class_value !== (div_class_value = "stateMap mode-" + /*mode*/ ctx[1] + " svelte-vyon6o")) {
				attr(div, "class", div_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			transition_in(if_block3);
			transition_in(if_block4);
			transition_in(if_block5);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			transition_out(if_block3);
			transition_out(if_block4);
			transition_out(if_block5);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (if_block0) if_block0.d();

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			if (if_block5) if_block5.d();
			div_resize_listener();
		}
	};
}

function instance$g($$self, $$props, $$invalidate) {
	let { data } = $$props;
	let { mode } = $$props;
	let { filter } = $$props;
	let { highlight } = $$props;
	let { arrowKey } = $$props;
	let { bubbleMarginKey } = $$props;
	let { turnoutKey } = $$props;
	const state = data.stateName;
	data.countiesGeo = feature(data.topojson, data.topojson.objects.counties);
	data.stateOutlineGeo = feature(data.topojson, data.topojson.objects.stateOutline);
	let { citiesToLabel } = $$props;
	let cities = null;

	if (citiesToLabel) {
		cities = [];

		citiesToLabel.forEach(d => {
			let p = d.split("...");
			let coords = cityCentroids[p[0]];

			// console.log(p[0])
			cities.push({
				"name": p[0],
				"layout": p[1] ? p[1] : "ne",
				"class": p[2] ? p[2] : "",
				"lon": coords[0],
				"lat": coords[1]
			});
		});
	}

	if (filter) {
		// console.log(filter, data.voteData.length);
		let filterFunction = arr => {
			return arr.filter(d => eval(filter));
		};

		const filteredData = filterFunction(data.voteData);
		data.voteData = filteredData;
	}

	const isFiltered = !!filter;

	function countyFill(feature) {
		const isInVoteData = data.voteData.find(d => d.fips === feature.properties.GEOID);
		return isInVoteData ? colors.base : colors.nullColor;
	}

	let ready = false;
	let w;
	if (!w) w = 600;

	onMount(() => {
		$$invalidate(8, ready = true);
	});

	function div_elementresize_handler() {
		w = this.clientWidth;
		$$invalidate(9, w);
	}

	$$self.$$set = $$props => {
		if ("data" in $$props) $$invalidate(0, data = $$props.data);
		if ("mode" in $$props) $$invalidate(1, mode = $$props.mode);
		if ("filter" in $$props) $$invalidate(16, filter = $$props.filter);
		if ("highlight" in $$props) $$invalidate(2, highlight = $$props.highlight);
		if ("arrowKey" in $$props) $$invalidate(3, arrowKey = $$props.arrowKey);
		if ("bubbleMarginKey" in $$props) $$invalidate(4, bubbleMarginKey = $$props.bubbleMarginKey);
		if ("turnoutKey" in $$props) $$invalidate(5, turnoutKey = $$props.turnoutKey);
		if ("citiesToLabel" in $$props) $$invalidate(6, citiesToLabel = $$props.citiesToLabel);
	};

	let proj;
	let theGeoPath;
	let bounds;
	let aspectRatio;
	let xy;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*w, data*/ 513) {
			 $$invalidate(18, proj = getProjection(state).fitWidth(w, data.stateOutlineGeo));
		}

		if ($$self.$$.dirty & /*proj*/ 262144) {
			 $$invalidate(10, theGeoPath = geoPath().projection(proj));
		}

		if ($$self.$$.dirty & /*theGeoPath, data*/ 1025) {
			 $$invalidate(19, bounds = theGeoPath.bounds(data.stateOutlineGeo));
		}

		if ($$self.$$.dirty & /*bounds*/ 524288) {
			 $$invalidate(11, aspectRatio = (bounds[1][1] - bounds[0][1]) / (bounds[1][0] - bounds[0][0]));
		}

		if ($$self.$$.dirty & /*proj*/ 262144) {
			 $$invalidate(12, xy = d => {
				// const detectWidthChange = !!w // force update when width changes?
				const xy = proj([d.lon, d.lat]);

				const x = xy[0];
				const y = xy[1];
				return { x, y };
			});
		}
	};

	return [
		data,
		mode,
		highlight,
		arrowKey,
		bubbleMarginKey,
		turnoutKey,
		citiesToLabel,
		cities,
		ready,
		w,
		theGeoPath,
		aspectRatio,
		xy,
		isFiltered,
		countyFill,
		state,
		filter,
		div_elementresize_handler
	];
}

class StateMap extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
			data: 0,
			mode: 1,
			filter: 16,
			highlight: 2,
			arrowKey: 3,
			bubbleMarginKey: 4,
			turnoutKey: 5,
			citiesToLabel: 6
		});
	}
}

export default StateMap;
//# sourceMappingURL=stateMap.js.map
