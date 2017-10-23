"use strict";
var marker = class {

  constructor(map, name, scale, location, color){
    this.map = map;
    this.name = name;
    this.label = name.charAt(0);
    this.scale = scale;
    // this.latlng = {lat: location.lat, lng: location.lng};
    this.latlng = new google.maps.LatLng(location.lat, location.lng);
    this.accuracy = location.accuracy;
    this.color = color;
    this.mark = new google.maps.Marker({
      position: {lat: location.lat, lng: location.lng},
      label: {
        text: this.label
      },
      scale: this.scale,
      animation: google.maps.Animation.DROP,
      map: this.map,
      opacity: 1
    });
    this.radius = new google.maps.Circle({
      center: this.latlng,
      fillColor: this.color,
      fillOpacity: 0.2,
      radius: this.accuracy,
      strokeColor: this.color,
      strokeOpacity: 1.0,
      strokePosition: google.maps.StrokePosition.INSIDE,
      atrokeWeight: 1,
      map: this.map
    });
    this.infowindow = new google.maps.InfoWindow({
      content: '<h5>' + this.name + '</h5>'
    });

  }

  addInfowindow(infowindow, map, mark){
    this.mark.addListener('click', function(){
      infowindow.open(map, mark);
    });
  }

  updateLocation(location){
    this.latlng = {lat: location.coords.latitude, lng: location.coords.longitude};
    this.accuracy = location.coords.accuracy;
  }

  updateName(name){
    this.name = name;
    this.label = name.charAt(0);
  }

  updateInfoWindowContent(lastSeen){
    console.log('marker.class updateInfoWindowContent().');
    lastSeen = ( Date.now() - lastSeen ) / 1000;

    var html = '<h5>' + this.name + '</h5>';

    if (lastSeen < 5){
      html += '<p>Online</p>';
    }else if( lastSeen < 60 ){
      html += '<p>Last seen: ' + Math.floor(lastSeen) + ' seconds ago.</p>';
    }else if( lastSeen < 3600 ){
      html += '<p>Last seen: ' + Math.floor(lastSeen/60) + ' mins ago.</p>';
    }else if( lastSeen < 86400){
      html += '<p>Last seen: ' + Math.floor(( lastSeen/60 ) /24) + ' hours ago.</p>';
    }else{
      html += '<p>Offline</p>';
    }
    this.infowindow.setContent(html);
  }

  updateOnMap(){
    this.infowindow.setPosition(this.latlng);
    this.mark.setPosition(this.latlng);
    this.radius.setCenter(this.latlng);
    this.radius.setRadius(this.accuracy);
  };

  fadeMarker(fade){
    this.mark.setOpacity(fade);
  }

  removeFromMap(){
    this.mark.setMap(null);
    this.radius.setMap(null);
  }

}
