var marker = class {

  constructor(map, name, scale, location, color){
    // console.debug("[DEBUG]Constructor: ", location);
    this.map = map;
    this.name = name;
    this.label = name.charAt(0);
    this.scale = scale;
    // this.latlng = {lat: location.lat, lng: location.lng};
    this.latlng = new google.maps.LatLng(location.lat, location.lng);
    this.accuracy = location.accuracy;
    this.color = color;
    // this.markIcon = {
    //   path: 'M 323.329 205.56 C 323.329 232.337 315.466 274.634 301.411 308.64 C 291.041 333.73 275.681 353.491 261.344 372.618 C 241.763 398.741 207.392 413.169 207.392 413.169 C 207.392 413.169 164.408 372.804 158.714 364.77 C 144.589 344.839 135.961 322.261 128.744 299.163 C 119.538 269.698 114.28 242 113.693 205.56 C 112.581 136.493 159.51 74.673 217.399 74.673 C 275.288 74.673 323.329 132.045 323.329 205.56 Z',
    //   fillColor: 'blue',
    //   scale: 15,
    //   strokeColor: 'black',
    //   strokeWeight: 50
    // }
    this.mark = new google.maps.Marker({
      position: {lat: location.lat, lng: location.lng},
      // label: this.label,
      label: {
        text: this.label
      },
      // icon: this.markIcon,
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
      // position: this.marker.getPosition(),
      // map: this.map
    });

    // this.infowindow.open(this.map, this.marker);
  }

  // createOnMap(map){
  //   this.marker.setMap(map);
  //   this.radius.setMap(map);
  // };
  addInfowindow(infowindow, map, mark){
    this.mark.addListener('click', function(){
      infowindow.open(map, mark);
    });
  }

  updateLocation(location){
    this.latlng = {lat: location.coords.latitude, lng: location.coords.longitude};
    this.accuracy = location.coords.accuracy;
    // if( location.name != null){
    //   this.name = location.name;
    //   // this.label = this.name.charAt(0);
    // }else{
    //   // this.name = '';
    // }
    // this.name = typeof location.name !== 'undefined' ? location.name : 'M';
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
    // this.label = this.name.charAt(0);
    // if(this.name != ''){
      // this.mark.setLabel(this.label);
    // };
    this.mark.setPosition(this.latlng);
    this.radius.setCenter(this.latlng);
    this.radius.setRadius(this.accuracy);
  };

  fade(fade){
    this.mark.setOpacity(fade);
  }

  removeFromMap(){
    this.mark.setMap(null);
    this.radius.setMap(null);
  }

  // aging
}
