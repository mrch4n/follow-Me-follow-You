var watchId = {}; //global-scoped variable for stop function to work.
var mapDiv = document.getElementById("map");
var uCode = {};
var uPosition = {};
var myCode = document.getElementById("sessionid").innerHTML;
var myPosition = {};
var myMarker;
var uMarker;
var gMapKey = 'YOUR_GOOGLE_MAP_JAVASCRIPT_API_KEY';

myCode = myCode.substr(myCode.length-6);
document.getElementById("myCodeBox").innerHTML = myCode;

function initMap(){
  gmap = new google.maps.Map(mapDiv, {
    center: {lat: 22.284, lng: 114.149},
    zoom: 9
  });
}

function startLocation(){
  if(navigator.geolocation){
    var watchId = navigator.geolocation.watchPosition(updateMPosition);
  } else{
    box.innerHTML = "Geolocation is not supported on your device.";
  }

  uCode = document.getElementById("uCodeInput").value;
};

function updateMPosition(position){
  myPosition = {lat: position.coords.latitude, lng: position.coords.longitude};
  console.debug("[DEGUB]position: ", position);
  $.ajax({
    type: "POST",
    url: "fmfu.php",
    data: {mCode: myCode, mlatitude: position.coords.latitude, mlongitude: position.coords.longitude, youCode: uCode},
    success: function(result){
      result = JSON.parse(result);
      createUMarker(uCode, result);
    },
    error: function(error){
      console.debug("[DEBUG]121 error: ", error);
    }

  });
  updateMyMarker();
}

function updateMyMarker(){

  if (myMarker == null){
    myMarker = new google.maps.Marker({
      position: myPosition,
      label: 'M'
    });
    myMarker.setMap(gmap);
    gmap.setCenter(myMarker.getPosition());
  }else{
    myMarker.setPosition(myPosition);
  }
}

function createUMarker(uId, uPosition = {lat: -34.397, lng: 150.644}){
  if (uId != ""){
    uId = new google.maps.Circle({
      center: uPosition,
      fillColor: "#F50",
      fillOpacity: 0.5,
      radius: 2381,
      strokeColor: "#F50",
      strokeOpacity: 0.9,
    });
    uId.setMap(gmap);
  }
}

function stopLocation(){
  $("#startPButton").prop('disabled', false);
  navigator.geolocation.clearWatch(watchId);
}

function startPos(){
  $("#startPButton").prop('disabled', true);
  startLocation();
}

$.getScript("https://maps.googleapis.com/maps/api/js?key="+gMapKey+"&callback=initMap");
