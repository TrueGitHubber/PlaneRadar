function deleteMarker(marker)
{
		webmap.removeLayer(flights["SU321"]);
};

function addMarker(marker, coords)
{
		marker = L.marker( coords, {} ).addTo(webmap);
		var icon_0b034235dc104986b7cddce47052427b = L.AwesomeMarkers.icon(
		{"extraClasses": "fa-rotate-0", "icon": "info-sign", "iconColor": "white", "markerColor": "orange", "prefix": "glyphicon"}
		);
		marker.setIcon(icon_0b034235dc104986b7cddce47052427b);
		return marker;
};

function moveMarker(marker, coords)
{
	deleteMarker(marker);
	marker = addMarker(marker, coords);
	/*
	
	*/
	return marker;
}

function makeTextPopUpOnMarker(marker, str)
{
	var popup_5deecb525dae45f4933ad13864d615c4 = L.popup({"maxWidth": "100%"});
	var html_76c86b9bcf4f4a2b883ca84ba9396b50 = $(`<div id="html_76c86b9bcf4f4a2b883ca84ba9396b50" style="width: 100.0%; height: 100.0%;">`+str+`</div>`)[0];
	popup_5deecb525dae45f4933ad13864d615c4.setContent(html_76c86b9bcf4f4a2b883ca84ba9396b50);


	marker.bindPopup(popup_5deecb525dae45f4933ad13864d615c4);
	
	return marker;
};

function readFile(filename) 
{
	jQuery.getJSON(filename,function( json ) 
	{
		alert(1);
	});
}
var webmap = L.map
		(
			"webmap",
			{
				center: [54.89, 20.59],
				crs: L.CRS.EPSG3857,
				zoom: 5,
				zoomControl: true,
				preferCanvas: false,
			}
		);

	
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
	var i = 0;
	$("#test").bind("click", function()
	{
		readFile("nowPlanesInfo.json");
		flights["SU321"] = moveMarker(flights["SU321"], [54.890049, 20.59263+i]);
		//flights["SU321"] = makeTextPopUpOnMarker(flights["SU321"], "Hrabrovo");
		i=i+1;
	});
	
});

        
    