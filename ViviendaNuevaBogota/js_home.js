var markersTraffic = [];
var linesTraffic = [];
var flagTraffic = 0;

var markersSchools = [];
var flagSchools = 0;

var markersFire = [];
var flagFire = 0;

var map;
$(document).ready(function(){

	/*__________________________________________Creacion del mapa__________________________________________*/
	var Bogota = new google.maps.LatLng(4.622794, -74.0402);
	var mapOptions = { center: Bogota, zoom:11 };
	map = new google.maps.Map(document.getElementById("map"),mapOptions);

	/*____________________________Crea un marcador por cada proyecto de vivienda___________________________*/
	$.ajax({
		url: "https://www.datos.gov.co/resource/x6a6-8tab.json",
		type: "GET",
		dataType: "json",
		data:{"$$app_token" : "HUjUGsr4YSMjvcwZejaYLHoBl"}	,
		success: function(proyects){
			for(var i=0; i<proyects.length; i++){
				proyect = proyects[i];
				console.log(proyect.latitudcoordenadareal);
				console.log(proyect.longitudcoordenadareal);

				marker = new google.maps.Marker({
					position: new google.maps.LatLng(proyect.latitudcoordenadareal, proyect.longitudcoordenadareal),
					//title: data.data[i][14] + " \n" + data.data[i][8],
					//icon: pinImageTraffic,
					//map: map,
				});
				marker.setMap(map);

				/*var pareja = [];

				point = new google.maps.LatLng(data.data[i][12] ,data.data[i][10]);
				pareja.push(point);
				point = new google.maps.LatLng(data.data[i][13] ,data.data[i][11]);
				pareja.push(point);

				line = new google.maps.Polyline({
						path: pareja,
						geodesic: true,
						strokeColor: '#009688',
						strokeOpacity: 1.0,
						strokeWeight: 1,
						//map: map,
				});
				linesTraffic.push(line);

				marker6 = new google.maps.Marker({
					position: new google.maps.LatLng(data.data[i][12] ,data.data[i][10]),
					title: data.data[i][14] + " \n" + data.data[i][8],
					icon: pinImageTraffic,
					//map: map,
				});
				markersTraffic.push(marker6);*/
			}
		}
	});
})

function traffic(){
	if(flagTraffic == 0){
		for(i in markersTraffic){
			markersTraffic[i].setMap(map);
			linesTraffic[i].setMap(map);
		}
		flagTraffic = 1;
	}
	else{
		for(i in markersTraffic){
			markersTraffic[i].setMap(null);
			linesTraffic[i].setMap(null);
		}
		flagTraffic = 0;
	}
}

function schools(){
	if(flagSchools == 0){
		for(i in markersSchools)
			markersSchools[i].setMap(map);
		flagSchools = 1;
	}
	else{
		for(i in markersSchools)
			markersSchools[i].setMap(null);
		flagSchools = 0;
	}
}

function fire(){
	if(flagFire == 0){
		for(i in markersFire)
			markersFire[i].setMap(map);
		flagFire = 1;
	}
	else{
		for(i in markersFire)
			markersFire[i].setMap(null);
		flagFire = 0;
	}
}
