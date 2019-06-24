function deleteMarker(marker)
{
	webmap.removeLayer(marker);
};

function makeTextPopUpOnMarker(marker, str)
{
	var popup_5deecb525dae45f4933ad13864d615c4 = L.popup({"maxWidth": "100%"});
	var html_76c86b9bcf4f4a2b883ca84ba9396b50 = $(`<div id="html_76c86b9bcf4f4a2b883ca84ba9396b50" style="width: 100.0%; height: 100.0%;">`+str+`</div>`)[0];
	popup_5deecb525dae45f4933ad13864d615c4.setContent(html_76c86b9bcf4f4a2b883ca84ba9396b50);

	marker.bindPopup(popup_5deecb525dae45f4933ad13864d615c4);

	return marker;
};

function addMarker(marker, coords)
{
	var myIcon = L.icon({
	iconUrl: 'Images/plane.png',
	iconSize: [25, 18],
	iconAnchor: [0,0],
	popupAnchor: [12, 9],
	});

	marker = L.marker(coords, { icon: myIcon }).addTo(webmap);
	marker = makeTextPopUpOnMarker(marker, "Info about plane");
	return marker;
};

function moveMarker(marker, coords)
{
	deleteMarker(marker);
	marker = addMarker(marker, coords);
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


function updateInfoAboutPlanes(data)
{
	// var event = JSON.parse(data.result, function(key, value) {
	// 	if (key == 'fligt') return new Flight(value);
	// 	return value;
	// });

	var newFlight = [];

	for (var i = 0; i < data.result.length; i++) {
  		newFlight.push(data.result[i].flight);
	}

	// myJsonString = JSON.stringify(newFlight);

	// console.log(event.flight.getFlight());
	// console.log(myJsonString)

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
		// $('.flight_number').append('<option value="'+data.result[i].flight+'">'+data.result[i].flight+'</option>');
	};
	var select = document.querySelector('.flight_number');
	select.innerHTML = newFlight.map(n => `<option value=${n}>${n}</option>`).join('');
};

function readFile(filename)
{
	$.ajax({
		type: "GET",
		url: filename,
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
	/*$("#test").toggle( function()
	{
	//	flights.set("SU321", moveMarker(flights["SU321"], [54.890049, 20.59263+i]));
		//flights.set("SU321", makeTextPopUpOnMarker(flights["SU321"], "Hrabrovo"));
		readFile("nowPlanesInfo.json");
		i=i+1;
	});
		*/


});

$('#btn-send').on('click', function() {
    var msg =$('#menu');
	
    msg = msg.serializeArray();


    $.ajax({
        type: 'POST',
        url: 'getData.php',
        data: msg,
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            // console.log('error');            
        }
    });
});
