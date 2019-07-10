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
		if(lastClick !== ids.get(String(e.target._leaflet_id)))
		{
			console.log("set 0");
			wasClick.set(lastClick, 0);
			lastClick = ids.get(String(e.target._leaflet_id));
		}
			
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
		if(points.length % 2 === 0)
		{
			points.push(latlngs[latlngs.length - 1]);

		}		
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


function delDashTrajectory (){
	dashTrajectory.remove();
};


function updateTrajectory(data)
{
	delDashTrajectory();
	deleteTrajectory();
	data = data['result'];
//	drawTrajectory(data['trail']);
	if(typeof data['trail'] === "undefined")
	{
		return;
	}
	if(data['coordsAirportArrival']  !== null)
	{
		drawDashTrajectory(data['trail'][data['trail'].length-1][0], data['trail'][data['trail'].length-1][1], data['coordsAirportArrival'][0], data['coordsAirportArrival'][1]);
	}
	drawTrajectoryBezier(data['trail']);
	decodeIndexAvito = ['#first', '#second', '#third', '#fourth', '#fifth', '#sixth', '#seventh', '#eighth', '#ninth','#tenth'];
	if(data['avito'] !== null && data['avito'].length > 0)
	{
		var select = document.querySelector('#topName');
		select.innerHTML = '<span value="">Топ-'+String(data['avito'].length)+' авто в городе:</option>';
		
		for(let i = 0; i < data['avito'].length	; i++)
		{
			var select = document.querySelector(decodeIndexAvito[i]);
			select.innerHTML = '<span value="">'+String(i+1)+'. '+data['avito'][i]['mark']+' '+data['avito'][i]['model']+'(В продаже: '+data['avito'][i]['number']+')</option>';
		}
	}
	else
	{
		var select = document.querySelector('#topName');
		select.innerHTML = '<span value"">Топ-10 авто в городе:</option>';
		
		var select = document.querySelector('#first');
		select.innerHTML = '<span value="">            Нет информации в этом регионе</option>';
		var select = document.querySelector('#second');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#third');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#fourth');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#fifth');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#sixth');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#seventh');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#eighth');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#ninth');
		select.innerHTML = '<span value=""></option>';
		var select = document.querySelector('#tenth');
		select.innerHTML = '<span value=""></option>';
	};
	
	var select = document.querySelector('#airline');
	select.innerHTML = '<span value="">Авиакомпания : '+data['airline']+'</option>';
	
	var select = document.querySelector('#aircraftID');
	select.innerHTML = '<span value="">Идентификатор судна : '+data['aircraftID']+'</option>';
	
	select = document.querySelector('#aircraftModel');
	select.innerHTML = '<span value="">Модель судна : '+data['aircraftModel']+'</option>';
	
	select = document.querySelector('#numberFlight');
	select.innerHTML = '<span value="">Номер рейса : '+data['flightNumber']+'</option>';
	
	select = document.querySelector('#city');
	select.innerHTML = '<span value="">Пролетает над : '+data['city']+'</option>';
	
	select = document.querySelector('#aircraftSpeed');
	select.innerHTML = '<span value="">Скорость : '+data['speed']+' миль/ч</option>';
	
	select = document.querySelector('#aircraftHeight');
	select.innerHTML = '<span value="">Высота : '+data['height']+' ф.</option>';
	
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
	var newFlight = [];

	for (var i = 0; i < data.result.length; i++) {
  		newFlight.push(data.result[i].flight);
	}
	
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
			deleteMarker(flights.get(data.result[i].flight));
			flights.set(data.result[i].flight, marker);
		};
		ids.set(String(marker._leaflet_id), data.result[i].id);
		if(typeof wasClick.get(data.result[i].id) === "undefined")
		{
			wasClick.set(data.result[i].id, 0);	
		};
	};
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
  	readTrajectory();
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
var lastClick;


$(document).ready(function ()
{
	setInterval(readFile.bind(null, "nowPlanesInfo.json"), 3000);
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