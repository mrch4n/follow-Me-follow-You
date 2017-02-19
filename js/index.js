"use strict";
var dheight = (window.innerHeight > 0) ? window.innerHeight : scree.height;
var watchId = ''; //global-scoped variable for stop function to work.
var mapDiv = document.getElementById("map");
var uCode = 0;
var uPosition = {};
var myCode = document.getElementById("sessionid").innerHTML;
var me;
var uMarkers = [];
var queryUCode;
var gmap;
var highAccuracy = $('#highAccuracy').val();
var updateFrequency = $('#updateFrequency-fill').val();
var autoClosePanelModal = false;

document.getElementById("myCodeBox").innerHTML = myCode;

$("#uCodeInput").change(function(){
  uCode = $("#uCodeInput").val();
  // console.debug("[DEBUG]uCode: ", uCode);
})
// document.getElementById("myCodeBox").value = myCode;
// console.log("[Log] myCode: "+ myCode);

dheight = dheight -30;

var marker = class {
  constructor(map, name, scale, location, color){
    // console.debug("[DEBUG]Constructor: ", location);
    this.map = map;
    this.name = name;
    this.scale = scale;
    this.latlng = {lat: location.lat, lng: location.lng};
    this.accuracy = location.accuracy;
    this.color = color;

    this.marker = new google.maps.Marker({
      position: {lat: location.lat, lng: location.lng},
      label: this.name,
      scale: this.scale,
      animation: google.maps.Animation.DROP,
      map: this.map
    });

    this.radius = new google.maps.Circle({
      center: this.latlng,
      fillColor: this.color,
      fillOpacity: 0.4,
      radius: this.accuracy,
      strokeColor: this.color,
      strokeOpacity: 1.0,
      strokePosition: google.maps.StrokePosition.INSIDE,
      atrokeWeight: 1,
      map: this.map
    });
  }

  // createOnMap(map){
  //   this.marker.setMap(map);
  //   this.radius.setMap(map);
  // };

  updateLocation(location){
    this.latlng = {lat: location.coords.latitude, lng: location.coords.longitude};
    this.accuracy = location.coords.accuracy;
  }

  updateOnMap(){
    this.marker.setPosition(this.latlng);
    this.radius.setCenter(this.latlng);
    this.radius.setRadius(this.accuracy);
  };

  removeFromMap(){
    this.marker.setMap(null);
    this.radius.setMap(null);
  }
}

function initMap(){
  $("#map").height(dheight);
  gmap = new google.maps.Map(
    mapDiv,
     {
       center: {lat: 22.284, lng: 114.149},
       zoom: 11,
       streetViewControl: false,
       mapTypeControl: false,
     });
};

function queryUpdateUCode(){
  if (uCode != {}){
    console.debug("[DEGUB]queryUpdate-U-Code uCode: ", uCode);
    $.ajax({
      type: "POST",
      url: "fmfu.php",
      data: {
        youCode: uCode
      },
      success: function(result){
        // console.debug("[DEBUG]queryUpdate-U-Code success result: ", result);
        if(result != ""){
          result = JSON.parse(result);
          console.debug("[DEBUG]queryUpdate-U-Code success JSON.result: ", result);
          result = {coords:{accuracy: result.accuracy, latitude: result.lat, longitude: result.lng}};
          updateUMarkers(uCode, result);
        }
      },
      error: function(error){
        console.debug("[DEBUG]queryUpdateUCode error: ", error);
      }
    });
  }
}

function startLocation(){
  autoClosePanelModal = true;
  if(navigator.geolocation){
    // console.debug("Log: Started");
    me = new marker(gmap, "M", 20, {lat: 0, lng: 0, accuracy: 1000}, "#000");
    watchId = navigator.geolocation.watchPosition(updateMPosition,
       function(error){
         if(error.code == 1){
           watchId = null;
           alert('Please enable Location Service and try again');
           $("#startPButton").prop('disabled', false);

          //  return;
         }else if(error.code == 2){
           alert('Position is currently unavailable, please turn on WiFi and/or GPS.');
           $("#startPButton").prop('disabled', false);
           watchId = null;
          //  return;
         }else if(error.code == 3){
           alert('Position timeout.');
           watchId = null;
          //  return;
        };
        return;
       },
       {
         enableHighAccuracy : highAccuracy,
         maximumAge : 0
       });
    // console.debug("[DEBUG]watchId: ", watchId);
  }else{
    alert("Please enable location service or location service is not supported on your device.");
    return;
  }
  console.log('startLocation>1if watchId: ', watchId);

  uCode = document.getElementById("uCodeInput").value;
  queryUCode = setInterval(function(){
    if(uCode != ''){
      queryUpdateUCode();
    }
  }, updateFrequency*1000 );
  console.log('startLocation>2if watchId: ', watchId);
};

function updateMPosition(position){
  if(autoClosePanelModal){
    $('.panelFmfu').modal('hide');
    autoClosePanelModal = false;
  }
  console.debug('updateMPosition me: ', me);
  me.updateLocation(position);
  me.updateOnMap();
  console.debug("[DEGUB]position: ", position);
  $.ajax({
    type: "POST",
    url: "fmfu.php",
    data: {mCode: myCode,
      mlatitude: position.coords.latitude,
      mlongitude: position.coords.longitude,
      maccuracy: position.coords.accuracy,
      youCode: uCode
    },
    success: function(result){
      // console.debug("[DEBUG]121 success result: ", result);
      if(result != ""){
        result = JSON.parse(result);
        // console.debug("[DEBUG]121 success JSON.result: ", result);
        result = {coords:{accuracy: result.accuracy, latitude: result.lat, longitude: result.lng}};
        updateUMarkers(uCode, result);
      }
    },
    error: function(error){
      console.debug("[DEBUG]121 error: ", error);
    }
  });
  // updateMyMarker();
};

function updateUMarkers(uCode, uPosition){
  if (typeof uMarkers[uCode] === "undefined"){
    uMarkers[uCode] = new marker(gmap, uCode, 1, uPosition, "#00F");
    console.debug("[DEBUG]update-U-Marker created: ", uMarkers[uCode] );
    // console.debug("[DEBUG]updateUMarkers jsonObject", uPosition.lat);
    // console.debug("[DEBUG]updateUMarkers typeof: ", typeof(uMarkers[uCode] ));
    // uMarkers[uCode].setMap(gmap);
  }else{
    uMarkers[uCode].updateLocation(uPosition);
    uMarkers[uCode].updateOnMap();
    console.debug("[DEGUB]update-U-Marker updated: ", uMarkers[uCode]);
  }
}

function stopLocation(){
  clearInterval(queryUCode);
  $("#startPButton").prop('disabled', false);
  // console.log("Log: Stopped");
  navigator.geolocation.clearWatch(watchId);
  console.log('stopLocation() watchId: ', watchId);
}

function startPos(){
	$("#startPButton").prop('disabled', true);
  startLocation();
}

$('#highAccuracy').change(function(){
  highAccuracy = $('#highAccuracy').val();
  console.debug('highAcc: ', highAccuracy + watchId);

  if(watchId != ""){
    navigator.geolocation.clearWatch(watchId);
    clearInterval(queryUCode);
    startLocation();
    console.log('highAccuracy location restarted.');

  };
});

$('#updateFrequency-fill').change(function() {
  $('#updateFrequency').html($('#updateFrequency-fill').val());
  updateFrequency = $('#updateFrequency-fill').val();
  console.debug('updateFrequency: ', updateFrequency + watchId);

  if(watchId != ""){
    navigator.geolocation.clearWatch(watchId);
    clearInterval(queryUCode);
    startLocation();
    console.log('updateFrequency location restarted.');
  };
});

$.getScript("https://maps.googleapis.com/maps/api/js?key="+gMapKey+"&callback=initMap");
$('#updateFrequency').html($('#updateFrequency-fill').val());
$('.panelFmfu').modal('show');
console.log('watchId: ', watchId);
