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

function addMarker(marker, coords, angle, iconName)
{
	var myIcon = L.icon({
	iconUrl: 'Images/' + iconName,
	iconSize: [25, 18],
	iconAnchor: [12.5,9],
	popupAnchor: [0, 0],
	});

	marker = L.marker(coords, { icon: myIcon,  rotationAngle: angle}, ).addTo(webmap);
	//marker = makeTextPopUpOnMarker(marker, "Info about plane");
	
	marker.on('click', function(e){

		if(wasClick.get(ids.get(String(e.target._leaflet_id))) == 0){
			chooseNewPlane(ids.get(String(e.target._leaflet_id)));
			wasClick.set(ids.get(String(e.target._leaflet_id)), 1);
		}
		else
		{
			chooseNewPlane("stop");	
			wasClick.set(ids.get(String(e.target._leaflet_id)), 0);
		};
	});
	return marker;
};

function moveMarker(marker, coords, angle)
{
	deleteMarker(marker);
	marker = addMarker(marker, coords, angle);
	return marker;
};

function drawTrajectory (latlngs) // latlngs - массив точек
{
//	var trajectoryLayer = L.canvas({ padding: 0.5 }); Canvas не нужен для нанесения линий.

	trajectory = L.polyline(latlngs, {color: 'red'}).addTo(webmap)
};

function drawTrajectoryBezier (latlngs) // latlngs - массив точек
{
		var points = new Array();
		points.push('M', latlngs[0], 'Q');
		for(let i = 1; i < latlngs.length-1; i++)
		{
			points.push(latlngs[i]);
		};
		points.push(latlngs[latlngs.length - 1]);
		trajectory = L.curve(points,{color:'red'}).addTo(webmap);
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
	polylineOptions = {color: 'red', dashArray: '10, 10', dashOffset: '10'};
	dashTrajectory = L.polyline(latlngs, polylineOptions).addTo(webmap);
};

/*function drawDashTrajectoryBezier(lat1, lng1, lat2, lng2)
{
	trajectory = L.curve(  ['M',[lat1 ,lng1],
						    'C',[lat2 ,lng2],
							    [ ,],
							    [ ,],
							    [ ,],'Z'],
						{color:'red', dashArray: '10, 10', dashOffset: '10', fill:true}).addTo(webmap)		
};

function drawDashTrajectoryBezier(lat1, lng1, lat2, lng2)
{
	trajectory = L.curve(  ['M',[lat1 ,lng1],
						    'Q',[lat2 ,lng2],
								[ ,],
							    [ ,],
							    [ ,],'Z'],
						{color:'red', dashArray: '10, 10', dashOffset: '10', fill:true}).addTo(webmap)		
};

function drawDashTrajectoryBezier(lat1, lng1, lat2, lng2)
{
	trajectory = L.curve(  ['M',[lat1 ,lng1],
						    'H',[lat1],
							'V',[lng1],
							'H',[lat2],
							'V',[lng2],'Z'],
						{color:'red', dashArray: '10, 10', dashOffset: '10', fill:true}).addTo(webmap)		
};*/



function delDashTrajectory (){
	dashTrajectory.remove();
};


function updateTrajectory(data)
{
	delDashTrajectory();
	deleteTrajectory();
	data = data['result'];
	//drawTrajectory(data['trail']);
	drawTrajectoryBezier(data['trail']);
	drawDashTrajectory(data['trail'][data['trail'].length-1][0], data['trail'][data['trail'].length-1][1], data['coordsAirportArrival'][0], data['coordsAirportArrival'][1]);
	//drawDashTrajectoryBezier(data['trail'][data['trail'].length-1][0], data['trail'][data['trail'].length-1][1], data['coordsAirportArrival'][0], data['coordsAirportArrival'][1]);
	var select = document.querySelector('#airline');
	select.innerHTML = '<span value="">Авиакомпания : '+data['airline']+'</option>';
	
	var select = document.querySelector('#aircraftID');
	select.innerHTML = '<span value="">Идентификатор судна : '+data['aircraftID']+'</option>';
	
	select = document.querySelector('#aircraftModel');
	select.innerHTML = '<span value="">Модель судна : '+data['aircraftModel']+'</option>';
	
	select = document.querySelector('#numberFlight');
	select.innerHTML = '<span value="">Номер рейса : '+data['flightNumber']+'</option>';
	
	select = document.querySelector('#aircraftSpeed');
	select.innerHTML = '<span value="">Скорость : '+data['speed']+' км/ч</option>';
	
	select = document.querySelector('#aircraftHeight');
	select.innerHTML = '<span value="">Высота : '+data['height']+' м.</option>';
	
	select = document.querySelector('#scheduledDeparture');
	select.innerHTML = '<span value="">Время вылета по расписанию : '+data['scheduledDeparture']+'</option>';
	
	select = document.querySelector('#realDeparture');
	select.innerHTML = '<span value="">Время вылета фактическое : '+data['realDeparture']+'</option>';
	
	select = document.querySelector('#airportDeparture');
	select.innerHTML = '<span value="">Аэропорт отправления : '+data['airportDeparture']+'</option>';
	
	select = document.querySelector('#scheduledArrival');
	select.innerHTML = '<span value="">Время прибытия по расписанию : '+data['scheduledArrival']+'</option>';
	
	select = document.querySelector('#estimatedArrival');
	select.innerHTML = '<span value="">Время прибытия ожидаемое : '+data['estimatedArrival']+'</option>';
	
	select = document.querySelector('#airportArrival');
	select.innerHTML = '<span value="">Аэропорт прибытия : '+data['airportArrival']+'</option>';
}
function readTrajectory()
{
	$.ajax({
		type: "GET",
		url: "trajectoryInfo.json",
		dataType: "json",
		success: updateTrajectory,
		error: function(response)
		{
			console.log(response);
			//alert("Fail");
		}
	});
};

function chooseNewPlane(id)
{
	var dictForWriting = {"result":id};
	$.ajax({
        type: 'POST',
        url: 'writeChoosenFlight.php',
        data: dictForWriting,
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            // console.log('error');            
        }
    });
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
	};
	flights.clear();
	ids.clear();
  var filter =$('#menu');
    filter = filter.serializeArray();
	var count = 0;
	if(filter[0].value != ""){
		count = 1;
  }
  for(let i = 0; i < data.result.length; i++)
	{
    var color = "plane.png";
		filter.forEach(function(item, j, filter){
		if(item['name'] == 'Airlines[]' && item['value'] == data.result[i].airline){ 
			var jcount = count +  j;
			color = "plane" + jcount + ".png";
		}
	});
		marker = addMarker(flights[data.result[i].flight],
			[data.result[i].latitude, data.result[i].longitude],
			 data.result[i].direction, color
		   );
		if(typeof flights.get(data.result[i].flight) === "undefined")
		{
			flights.set(data.result[i].flight, marker);
		}
		else
		{
			deleteMarker(marker);
		};
		ids.set(String(marker._leaflet_id), data.result[i].id);
		if(typeof wasClick.get(data.result[i].id) === "undefined")
		{
			wasClick.set(data.result[i].id, 0);	
		};
	};
	//var select = document.querySelector('.flight_number');
	//select.innerHTML = newFlight.map(n => `<option value=${n}>${n}</option>`).join('');
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
	readTrajectory()
};

function choosePlaneColorbyFilter (msg){ // msg - массив, созданный фильтром
	var count = 0;
	msg.forEach(function(item, i, msg){
		if(item['name'] == 'Airlines' && item['value'] != ""){ 
			count = count + 1;
		}
	});
	var planeNumber = "plane" + count + ".png";
	if (count != 0){
		return planeNumber;
	}
	else{						// Случай, если не выбраны авиакомпании, самолеты серые.
		return "plane.png";
	}
};


var flights = new Map();
var ids = new Map();
var wasClick = new Map();
var	trajectory = L.polyline([[0,0]], {color: 'red'}).addTo(webmap);
var polylineOptions = {color: 'red', dashArray: '10, 10', dashOffset: '10'};
var dashTrajectory = L.polyline([[0,0]], polylineOptions).addTo(webmap);

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
        url: 'writeFilters.php',
		data: msg,
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            // console.log('error');            
        }
    });
});