"use strict";
var gMapKey = 'YOUR_GOOGLE_MAP_JAVASCRIPT_API_KEY';
var dheight = (window.innerHeight > 0) ? window.innerHeight : scree.height;
var watchId = {}; //global-scoped variable for stop function to work.
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

document.getElementById("myCodeBox").innerHTML = myCode;

$("#uCodeInput").change(function(){
  uCode = $("#uCodeInput").val();
})

dheight = dheight -30;

var marker = class{
  constructor(map, name, scale, location, color){
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
      zoom: 4,
      streetViewControl: false,
      mapTypeControl: false,
    }
  );
};

function queryUpdateUCode(){
  if (uCode != {}){
    $.ajax({
      type: "POST",
      url: "fmfu.php",
      data: {
        youCode: uCode
      },
      success: function(result){
        if(result != ""){
          result = JSON.parse(result);
          result = {coords:{accuracy: result.accuracy, latitude: result.lat, longitude: result.lng}};
          updateUMarkers(uCode, result);
        }
      },
      error: function(error){
      }
    });
  }
}

function startLocation(){
  if(navigator.geolocation){
    me = new marker(gmap, "M", 20, {lat: 0, lng: 0, accuracy: 1000}, "#000");
    var watchId = navigator.geolocation.watchPosition(updateMPosition,
      function(error){
        if(error.code == 1){
          alert('Please enable Location Service and try again');
          $("#startPButton").prop('disabled', false);
        }else if(error.code == 2){
          alert('Position is currently unavailable, please turn on WiFi and/or GPS.');
          $("#startPButton").prop('disabled', false);
        }else if(error.code == 3){
          alert('Position timeout.');
        }
      },{
        enableHighAccuracy : highAccuracy,
        maximumAge : 0
      }
    );
  }else{
    alert("Please enable location service or location service is not supported on your device.");
  }
  uCode = document.getElementById("uCodeInput").value;
  queryUCode = setInterval(function(){
    if(uCode != ''){
      queryUpdateUCode();
    }
  }, updateFrequency*1000 );
};

function updateMPosition(position){
  me.updateLocation(position);
  me.updateOnMap();
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
      if(result != ""){
        result = JSON.parse(result);
        result = {coords:{accuracy: result.accuracy, latitude: result.lat, longitude: result.lng}};
        updateUMarkers(uCode, result);
      }
    },
    error: function(error){
      console.debug("[DEBUG]121 error: ", error);
    }
  });
}

function updateUMarkers(uCode, uPosition){
  if (typeof uMarkers[uCode] === "undefined"){
    uMarkers[uCode] = new marker(gmap, uCode, 1, uPosition, "#00F");
  }else{
    uMarkers[uCode].updateLocation(uPosition);
    uMarkers[uCode].updateOnMap();
  }
}

function stopLocation(){
  clearInterval(queryUCode);
  $("#startPButton").prop('disabled', false);
  navigator.geolocation.clearWatch(watchId);
}

function startPos(){
  $("#startPButton").prop('disabled', true);
  startLocation();
}

$('#highAccuracy').change(function(){
  highAccuracy = $('#highAccuracy').val();
  navigator.geolocation.clearWatch(watchId);
  clearInterval(queryUCode);
  startLocation();
});

$('#updateFrequency-fill').change(function() {
  $('#updateFrequency').html($('#updateFrequency-fill').val());
  navigator.geolocation.clearWatch(watchId);
  clearInterval(queryUCode);
  startLocation();
});

$.getScript("https://maps.googleapis.com/maps/api/js?key="+gMapKey+"&callback=initMap");
$('#updateFrequency').html($('#updateFrequency-fill').val());
$('.panelFmfu').modal('show');
