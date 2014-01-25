$(function() {
  var start;
  function initialize() {
    cambridge  = new google.maps.LatLng(42.356448, -71.108212);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: cambridge,
      zoom: 2
    });
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);

    // Hack to get google map to appear. Problem: map must be on screen to see.
    // Actually, do we even need the map?
    // It would be really cool if the top bar "slid down". Can I do that?
    // Lol 1 page app.
    setTimeout(function() {
      // Need to set trigger such that it activates when view sees map page
      // fire custom trigger?
      google.maps.event.trigger(map, 'resize');
      map.setCenter(cambridge);
      console.log("resize")
    }, 5000)

  }

  initialize()
})