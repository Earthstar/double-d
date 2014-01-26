$(function() {
  var start;
  var mapOnScreen = false;

  var elementsToToggleOnMapAppearance = "#map-creation-bar *, .place-tag-container, .place-tag-container > *";

  cambridge  = new google.maps.LatLng(42.356448, -71.108212);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: cambridge,
    zoom: 2
  });
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  // Hack to get google map to appear.
  $(".carousel-control").click(function() {
    setTimeout(function() {
    }, 100)
  })

  // Constantly updates whether map on screen?
  // Triggers events?
  // TODO make event triggers better
  setInterval(function() {
    console.log("in polling function");
    var mapOnScreenNow = isMapOnScreen()
    if ((mapOnScreen) && (!mapOnScreenNow)) {
      // Map no longer on screen, trigger mapoff event
      console.log("trigger mapdisappear")
      $(elementsToToggleOnMapAppearance).trigger("mapdisappear")
    } else if ((!mapOnScreen) && (mapOnScreenNow)) {
      console.log("trigger mapappear")
      $(elementsToToggleOnMapAppearance).trigger("mapappear")
      // refresh map
      google.maps.event.trigger(map, 'resize')
    }
    mapOnScreen = mapOnScreenNow;
  },500)

  function isMapOnScreen() {
    return ($("#map-container").offset().top > 0)
  }

  // If the map is on the screen, trigger the resize event and pull down the menu
  // If the map is not on the screen, pull up the menu
  $(elementsToToggleOnMapAppearance).on("mapappear", function() {
    $(elementsToToggleOnMapAppearance).slideDown("fast");
    // Hide the checkbox
    $("[hidden]").hide();
  }).on("mapdisappear", function() {
      $(this).slideUp("fast")
  })

  $(elementsToToggleOnMapAppearance).hide("fast")


})