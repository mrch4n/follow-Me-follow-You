"use strict";
var dheight = (window.outerHeight > 0) ? window.outerHeight : window.innerHeight;
var watchId = ''; //global-scoped variable for stop function to work.
var mapDiv = document.getElementById("map");
var uPosition = {};
var groupid = '';
var jgrpid = '';
var cgrpid = document.getElementById("peerid").innerHTML;
var peerid = document.getElementById("peerid").innerHTML;
var domainUrl = document.getElementById("domainUrl").innerHTML;
var intervalQueryPeers;
var gmap;
var highAccuracy = $('#highAccuracy').prop('checked');
var updateFrequency = 5;
var autoClosePanelModal = false;
var noOfPeer = 0;
var divNoOfPeer = document.getElementById("noOfPeer");
var markers = [];
var peers = '{}';
peers = JSON.parse(peers);
console.debug('[DEBUG] peers: ', peers);

// var marker = require('./marker.class.js');

// document.getElementById("myCodeBox").innerHTML = groupid;

// document.getElementById("myCodeBox").value = groupid;
// console.log("[Log] myCode: "+ groupid);

dheight = dheight - 40 ;

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

function updateMarkersOnMap(){
  for (var key in markers){
    markers[key].updateOnMap();
  }
}

function updateMarkers(){
  for (var key in peers){
    if (!peers.hasOwnProperty(key)) continue;
    if (! (key in markers) ){
      console.log('updateMarkers() New marker created: ', key );
      markers[key] = new marker(gmap, peers[key]["name"], 20, {lat: peers[key]["latlng"]["lat"], lng: peers[key]["latlng"]["lng"], accuracy: peers[key]["accuracy"]}, "#000");
      markers[key].addInfowindow(markers[key].infowindow, gmap, markers[key].mark);
    }else{
      uPosition = {coords:{accuracy: peers[key]["accuracy"], latitude: peers[key]["latlng"]["lat"], longitude: peers[key]["latlng"]["lng"]}};
      markers[key].updateLocation(uPosition);
      markers[key].updateName(peers[key]["name"]);
      markers[key].updateInfoWindowContent(peers[key]["last_seen"]);
    }
    // console.debug('updateMarkers markers: ', markers);
  }
}

function removeMarkers(){
  for (var key in markers){
    if (!markers.hasOwnProperty(key)) continue;
    // console.debug('removeMarkers markers[key]: ', markers[key]);
    markers[key].removeFromMap();
    // console.debug('removeMarkers markers: ', markers);
  }
}

function updateNoOfPeer( peer ){
  noOfPeer = typeof peer !== 'undefined' ? peer : Object.keys(peers).length;
  divNoOfPeer.innerHTML = noOfPeer;
}

function queryPeers(){
  // console.debug('[DEBUG]queryPeers peers: ', peers);

  $.ajax({
    type: "POST",
    url: "fmfu.php",
    data: {
      action: 'queryPeers',
      groupid: groupid,
      peerid: peerid
    },
    success: function(result){
      // console.debug("[DEBUG]queryPeers success result: ", result);

      result = JSON.parse(result);
      // console.debug("[DEBUG]queryPeers success result parased: ", result);



      // combine ajax result(JSON) into local 'peers'(JSON).
      $.extend(peers, result);
      // console.debug('peers: ', peers);
      updateNoOfPeer();
      updateMarkers();
      updateMarkersOnMap();


      for (var key in peers){
        if (!result.hasOwnProperty(key)) continue;
        // console.debug('removeMarkers result[key]: ', result[key]);

        if ( Date.now() - peers[key]['last_seen'] > 15*60000){
          markers[key].fadeMarker(0.5);
        }else{
          markers[key].fadeMarker(1)
        }
        //markers[key].updateInfoWindowContent(peers[key]['last_seen']);
        // console.debug( "last_seen: ", peers[key]['last_seen']);
        // result[key].removeFromMap();
        // console.debug('removeMarkers result: ', result);
      }
    },
    error: function(error){
      // console.debug("[DEBUG]queryPeers error: ", error);
    }
  });
}

function startLocation(){
  autoClosePanelModal = true;
  highAccuracy = $('#highAccuracy').prop('checked');
  if(navigator.geolocation){
    markers[peerid] = new marker(gmap, " ", 20, {lat: 0, lng: 0, accuracy: 1000}, "#000");
    markers[peerid].addInfowindow(markers[peerid].infowindow, gmap, markers[peerid].mark);
    // console.debug('startLocation markers: ', markers);
    watchId = navigator.geolocation.watchPosition(updateLocation,
       function(error){
         if(error.code == 1){
           watchId = null;
           alert('Please enable Location Service and try again');
           $("#startPButton").prop('disabled', false);
         }else if(error.code == 2){
           alert('Position is currently unavailable.');
           $("#startPButton").prop('disabled', false);
           watchId = null;
         }else if(error.code == 3){
           alert('Position timeout.');
           watchId = null;
        };
        return;
       },
       {
         enableHighAccuracy : highAccuracy,
         maximumAge : 1// In millisecond. In case of a watchPosition(), the maximumAge refers to the first position object returned by the implementation.
       });
    // console.debug("[DEBUG]watchId: ", watchId);
  }else{
    alert("Please enable location service or location service is not supported on your device.");
    return;
  }

  intervalQueryPeers = setInterval(function(){
      queryPeers();
  }, updateFrequency * 1000 );
};

// updateLocation() toggled when system position update.
function updateLocation(position){
  if(autoClosePanelModal){
    $('#panelFmfu').modal('close');
    autoClosePanelModal = false;
  }
  markers[peerid].updateLocation(position);
  markers[peerid].updateOnMap();

  // console.debug("[DEGUB]position: ", position);
  $.ajax({
    type: "POST",
    url: "fmfu.php",
    data: {
      action: 'updateLocation',
      peerid: peerid,
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    },
    success: function(result){
      if(result == "success"){
        //nothing to do.
      }
    },
    error: function(error){
      console.debug("[DEBUG]updateLocation error: ", error);
    }
  });
};

function stopLocation(){
  clearInterval(intervalQueryPeers);
  $("#startPButton").prop('disabled', false);
  $('#jgrpid').prop('disabled', false);
  $('.inputName').prop('disabled', false);
  removeMarkers();
  updateNoOfPeer(0);

  // console.log("Log: Stopped");
  navigator.geolocation.clearWatch(watchId);
  // console.log('stopLocation() watchId: ', watchId);
}

function startPos(){
  if($('div.carousel-item.active').attr('id') === 'panelCreateGroup'){
    var action = 'createGroup';
    groupid = cgrpid;
  }else{
    var action = 'joinGroup';
    groupid = jgrpid;
  }

  $.ajax({
    type: "POST",
    url: "fmfu.php",
    data: {
      action: action,
      peerid: groupid,
      name: name,
      groupid: groupid
    },
    success(result){
      // console.log('success: ', result);
      if(result == 'success'){
        $("#startPButton").prop('disabled', true);
        $('#jgrpid').prop('disabled', true);
        $('.inputName').prop('disabled', true);
      }else{
        $("#startPButton").prop('disabled', false);
        $('#jgrpid').prop('disabled', false);
        $('.inputName').prop('disabled', false);
        removeMarkers();
        // if startLocation() started at the moment, stop it.
        if(watchId != ""){
          navigator.geolocation.clearWatch(watchId);
          clearInterval(intervalQueryPeers);
        };
      }
    }
  });
  // startLocatino() cannot put into ajax success response, google map violation.
  startLocation();
}

function updateShareBtn(){
  $('#shareWhap').attr('href', 'whatsapp://send?text=' + domainUrl + '?g=' +  jgrpid);
  $('#shareLine').attr('href', 'http://line.me/R/msg/text/?' + domainUrl + '?g=' + jgrpid);
}

$('#highAccuracy').change(function(){
  highAccuracy = $('#highAccuracy').prop('checked');
  // console.debug('highAcc: ', highAccuracy + watchId);

  if(watchId != ''){
    navigator.geolocation.clearWatch(watchId);
    clearInterval(intervalQueryPeers);
    startLocation();
    console.log('highAccuracy location restarted.');
  };
});

$('#jgrpid').change(function() {
  if ($('#jgrpid').val() != ''){
    jgrpid = $('#jgrpid').val();
    updateShareBtn();
  }else{
    jgrpid = groupid;
    updateShareBtn();
  }
});

$('#jgrpname').change(function(){
  name = $('#jgrpname').val();
  $('#cgrpname').val(name);
  // console.log('#jgrpname: ', name);
})

$('#cgrpname').change(function(){
  name = $('#cgrpname').val();
  $('#jgrpname').val(name);
  // console.log('#cgrpname: ', name);
})

$.getScript("https://maps.googleapis.com/maps/api/js?key="+gMapKey+"&callback=initMap");
$('#updateFrequency').html($('#updateFrequency-fill').val());

//copy function
$(document).on('click', '#copyBtn', function(e){
  e.preventDefault();
  var t = document.createElement('textarea');
  t.id = 't';
  t.style.height = 0;
  document.body.appendChild(t);
  t.value = $('#peerid')[0].innerHTML;
  var selector = document.querySelector('#t');
  selector.select();
  document.execCommand('copy');
  document.body.removeChild(t);
});

$(document).ready(function(){
  document.getElementById("highAccuracy").checked = true;
  $('#panelFmfu').modal({
    opacity: .2
  });
  $('#panelFmfu').modal('open');
  $('#cgrpid').val(peerid);
  $('ul.tabs').tabs();
  $('ul.tabs').tabs({
    swipeable: true
    // onShow: function(para){
    //   console.debug('tabs change: ', para);
    // }
  });
  jgrpid = $('#jgrpid').val();

  if(jgrpid != ''){
    $('ul.tabs').tabs('select_tab', 'panelJoinGroup');
    // $('#jgrpname').focus();
    updateShareBtn();
  }
  // console.debug('jgrpid: ', jgrpid);
  // document.body.webkitRequestFullscreen();















  // $('#updateFrequency-fill').change(function() {
  //   // $('#updateFrequency').html($('#updateFrequency-fill').val());
  //   updateFrequency = $('#updateFrequency-fill').val();
  //   console.debug('updateFrequency: ', updateFrequency + watchId);
  //
  //   if(watchId != ""){
  //     navigator.geolocation.clearWatch(watchId);
  //     clearInterval(intervalQueryPeers);
  //     startLocation();
  //     console.log('updateFrequency location restarted.');
  //   };
  // });












  // function updateUMarkers(uCode, uPosition){
  //   if (typeof uMarkers[uCode] === "undefined"){
  //     uMarkers[uCode] = new marker(gmap, uCode, 1, uPosition, "#00F");
  //     console.debug("[DEBUG]update-U-Marker created: ", uMarkers[uCode] );
  //     // console.debug("[DEBUG]updateUMarkers jsonObject", uPosition.lat);
  //     // console.debug("[DEBUG]updateUMarkers typeof: ", typeof(uMarkers[uCode] ));
  //     // uMarkers[uCode].setMap(gmap);
  //   }else{
  //     uMarkers[uCode].updateLocation(uPosition);
  //     uMarkers[uCode].updateOnMap();
  //     console.debug("[DEGUB]update-U-Marker updated: ", uMarkers[uCode]);
  //   }
  // }
})
