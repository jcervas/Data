



rm(x.i)
x.i <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/Senate/Ari/117th%20votes.csv")
  x.i$total <- x.i$democrat+x.i$republican
  x.i$dem <- x.i$democrat/x.i$total
  x.i$dwin <- ifelse(x.i$dem>0.5, 1,0)
  x.i



sim <- seq(-0.1,0.1,.001)
S.i <- V.i <- rep(NA, length(sim))
dem.center <- x.i$dem + (0.5 - mean.w(x.i$dem,x.i$total))
for (i in 1:length(sim)) {
  tmp <- dem.center + sim[i]
  V.i[i] <- mean.w(tmp, x.i$total)
  S.i[i] <- sum(find.winner(tmp)/length(tmp))
}
write.csv(
data.frame(votes=V.i, seats=S.i),
"/Users/user/Google Drive/GitHub/Data/Elections/Senate/Ari/117th-Senate-sv.csv")

pdf("/Users/user/Google Drive/GitHub/Data/Elections/Senate/Ari/117th-Senate-sv.pdf", width=6, height=6)
  par(pty="s", mar=c(4,3,2,1))
  plot(V.i,S.i, 
    ylim=c(0.1,0.9), xlim=c(0.35,0.65), type="n", cex=1, pch=19, col=paste0("#000000", opacity[40]), ylab="Democratic Seats", xlab="% Democratic vote" , main="", bty="n", axes=F, xaxs="i", yaxs="i")
    points(mean.w(x.i$dem, x.i$total), sum(find.winner(x.i$dem)/length(x.i$dem)), cex=1, pch=19, col="black")
    lines(V.i,S.i, cex=2, col="#55555555")
    axis(side=1, at=seq(0.35, 0.65, 0.1), labels=F)
    axis(side=1, at=seq(0.4, 0.6, 0.1), labels=paste0(seq(0.4, 0.60, 0.1)*100))
    axis(side=1, at=seq(0.35, 0.65, 0.01), labels=F, lwd.ticks=0.2, tck=-0.01)
    axis(side=1, at=seq(0.35, 0.65, 0.05), labels=F, lwd.ticks=0.4, tck=-0.02)
    axis(side=2, las=2, at=seq(0.1,0.9, 0.1), labels=paste0(seq(0.1, 0.9, 0.1)*100))
    axis(side=2, las=2, at=seq(0.1,0.9, 0.01), labels=F, lwd.ticks=0.2, tck=-0.01)
    axis(side=2, las=2, at=seq(0.1,0.9, 0.05), labels=F, lwd.ticks=0.4, tck=-0.02)
    abline(v=.5, lty=3, col="#55555555")
    abline(h=.5, lty=3, col="#55555555")
      abline(h=.6, lty=3, col="#88888888")
      abline(h=.4, lty=3, col="#88888888")
    # abline(lm(S.i~V.i))
    plot(function (x) logodds(S.i, V.i), from=0.0, to=1, add=TRUE, lwd=2, col="gray40")
    # abline(0,1, lty=2, col="gray90")
dev.off()


summary(reg <- lm(log(sv(S.i)) ~ log(sv(V.i))))




