
import folium
 
map = folium.Map(location=[54.890049,20.59263], zoom_start = 8, tiles= "CartoDB dark_matter")
 
for coordinates in [[54.890049,20.59263]]:
    folium.Marker(location=coordinates, icon=folium.Icon(color = 'orange')).add_to(map)
 
map.save("map1.html")
