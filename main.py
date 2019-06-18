
import folium



if __name__ == "__main__":
	map = folium.Map(location=[54.89, 20.59], zoom_start=13)
	folium.Marker(location=[54.890049, 20.59263], popup="Hrabrovo", icon=folium.Icon(color='orange')).add_to(map)
	map.save("map1.html")