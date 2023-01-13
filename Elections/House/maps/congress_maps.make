mapshaper -i '/Volumes/GoogleDrive/My Drive/GitHub/Data Files/GIS/Cartographic/nation/nation.shp' name=nation \
-i '/Volumes/GoogleDrive/My Drive/GitHub/Data/Elections/Congress/maps/congress_2022_2020.json' name=congress_2022_2020 \
-clip nation \
-each target=congress_2022_2020 'BIDEN_2020 = DemPct/(DemPct + RepPct)' \
-each map="2022" \
-each 'NAME="00" + NAME' \
-each 'District=NAME.substr(NAME.length-2) \
-each 'CODE=ST + "-" + District' \
-filter-fields ST,District,CODE,map,DEM2020 \
-o target=congress_2022_2020 '/Users/cervas/Library/Mobile Documents/com~apple~CloudDocs/Downloads/US_Congress_2022_2020.json'


-proj target=congress_2022_2020,nation albersusa \
-dissolve target=congress_2022_2020 field=ST + name=states -innerlines \
-style target=states stroke=#fff stroke-width=0.5 \
-style target=nation fill=none stroke=#000 stroke-width=1.5 \
-classify target=congress_2022_2020 field=DEM2020 save-as=fill colors=RdBu breaks=0.40,0.45,0.5,0.55,0.6 \
-o target="congress_2022_2020,states,nation" '/Users/cervas/Library/Mobile Documents/com~apple~CloudDocs/Downloads/DEM2022_2020.svg' combine-layers \