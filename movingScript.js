function deleteMarker(marker)
{
		webmap.removeLayer(marker);
};

function addMarker(marker, coords)
{
		var myIcon = L.icon({
		iconUrl: 'Images/plane.png',
		iconSize: [20, 27],
		iconAnchor: [coords[0]-48, coords[1]],
		popupAnchor: coords,
	});
	    marker = L.marker(coords, { icon: myIcon }).addTo(webmap);
		return marker;
};

function moveMarker(marker, coords)
{
	deleteMarker(marker);
	marker = addMarker(marker, coords);
	return marker;
};

function makeTextPopUpOnMarker(marker, str)
{
	var popup_5deecb525dae45f4933ad13864d615c4 = L.popup({"maxWidth": "100%"});
	var html_76c86b9bcf4f4a2b883ca84ba9396b50 = $(`<div id="html_76c86b9bcf4f4a2b883ca84ba9396b50" style="width: 100.0%; height: 100.0%;">`+str+`</div>`)[0];
	popup_5deecb525dae45f4933ad13864d615c4.setContent(html_76c86b9bcf4f4a2b883ca84ba9396b50);


	marker.bindPopup(popup_5deecb525dae45f4933ad13864d615c4);
	
	return marker;
};

function drawTrajectory (latlngs) // latlngs - массив точек
{
//	var trajectoryLayer = L.canvas({ padding: 0.5 }); Canvas не нужен для нанесения линий.
	

	var trajectory = L.polyline(latlngs, {color: 'red'}).addTo(webmap)
};

function deleteTrajectory ()
{
	trajectory.remove();
};

function drawDashTrajectory (lat1, lng1, lat2, lng2){
	var latlngs = [
		[lat1, lng1],
		[lat2, lng2],
	];
	var polylineOptions = {color: 'red', dashArray: '10, 10', dashOffset: '10'};
	var dashTrajectory = L.polyline(latlngs, polylineOptions).addTo(webmap);
};

function delDashTrajectory (){
	dashTrajectory.remove();
};
function updateInfoAboutPlanes(data)
{
	//alert("Success");
	for(item of flights)
	{
		deleteMarker(item[1]);
	}
	flights.clear();
	for(let i = 0; i < data.result.length; i++)
	{
		flights.set(data.result[i].flight, addMarker(flights[data.result[i].flight], 
												  [data.result[i].latitude, data.result[i].longitude]
												   ));
	};
};
		
function readFile(filename) 
{
	$.ajax({ 
		type: "GET", 
		url: filename, 
		//data: "data", 
		dataType: "json",
		success: updateInfoAboutPlanes,
		error: function(response)
		{
			console.log(response);
			//alert("Fail");
		}
	});
};

	
var flights = new Map();

var tile_layer_93dd622128d8481fa64fdfdefbba6b3b = L.tileLayer(
	"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	{"attribution": "Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
).addTo(webmap);

flights["SU321"] = L.marker(
	[54.890049, 20.59263],
	{}
).addTo(webmap);


var icon_0b034235dc104986b7cddce47052427b = L.AwesomeMarkers.icon(
	{"extraClasses": "fa-rotate-0", "icon": "info-sign", "iconColor": "white", "markerColor": "orange", "prefix": "glyphicon"}
);
flights["SU321"].setIcon(icon_0b034235dc104986b7cddce47052427b);


var popup_5deecb525dae45f4933ad13864d615c4 = L.popup({"maxWidth": "100%"});


var html_76c86b9bcf4f4a2b883ca84ba9396b50 = $(`<div id="html_76c86b9bcf4f4a2b883ca84ba9396b50" style="width: 100.0%; height: 100.0%;">Hrabrovo</div>`)[0];
popup_5deecb525dae45f4933ad13864d615c4.setContent(html_76c86b9bcf4f4a2b883ca84ba9396b50);
	

flights["SU321"].bindPopup(popup_5deecb525dae45f4933ad13864d615c4)
$(document).ready(function () 
{
	//var i = 0;
	setInterval(readFile.bind(null, "nowPlanesInfo.json"), 3000);
/*	$("#test").bind("click", function()
	{

	//	flights.set("SU321", moveMarker(flights["SU321"], [54.890049, 20.59263+i]));
		//flights.set("SU321", makeTextPopUpOnMarker(flights["SU321"], "Hrabrovo"));
		readFile("nowPlanesInfo.json");
		i=i+1;
	});*/
		

	
});
