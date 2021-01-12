
# house.2018 <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/House/house_2018.csv")
	
# 	house.2018 <- data.frame(year="2018", state=house.2018$state, district=house.2018$district, dem=house.2018$dem, rep=house.2018$rep, other=house.2018$other)
# 	head(house.2018)
# house.2020 <- getHouse2020()
# house.2020$rep[house.2020$state %in% "Florida" & house.2020$district %in% "25"] <- 1
# house.2020 <- data.frame(year= rep("2020", length(house.2020[,1])), house.2020[,1:5])
# 	head(house.2020)


# houseCD <- read.csv("https://raw.githubusercontent.com/jcervas/Data/master/Elections/House/elections1971_2016.csv")
# 	house.elections <- data.frame(year=houseCD$year, state=houseCD$state, district=houseCD$district, dem=houseCD$dem, rep=houseCD$rep, other=houseCD$other)
# head(house.elections)


# # House Data 1971-2020
# house <- do.call(rbind, list(house.elections, house.2018, house.2020))
# 	house$district[house$district %in% "99"] <- 1
# write.csv(house, "/Users/user/Google Drive/GitHub/Data/Elections/House/house_1971_2020.csv", row.names=F)