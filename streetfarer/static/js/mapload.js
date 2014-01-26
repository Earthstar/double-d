$(function() {
  var map;
  var infowindow;
  var directionsService = new google.maps.DirectionsService();
  var geocodeService = new google.maps.Geocoder();
  var placesService;
  var DISTANCE_CONSTANT = 2.6*3.14159;

  // Inputs for map generation, should be changed upon genRoute
  var start = new google.maps.LatLng(0, 0);
  var distance = 0;
  var tags = [];
  var pathStatus = null;

  var pathList = [] //used to store the ids of places in stored paths

  //Searchbox variables
  var sbMarkers = [];

  // CSRF stuff using jQuery
  function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  var csrftoken = getCookie('csrftoken');

  function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
      crossDomain: false, // obviates need for sameOrigin test
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type)) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });

  function initialize() {
    cambridge  = new google.maps.LatLng(42.356448, -71.108212);
    formatTagTitles();
    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: cambridge,
      zoom: 2
    });

     // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    if(input)
      searchboxInit(input);

    var refreshButton = document.getElementById('refresh-btn');
    if (refreshButton) {
      refreshButton.addEventListener("click", function(event){
        event.preventDefault();
        //var inputStart = document.getElementById('pac-input').value; //Don't need this
        var inputStart = start;
        var inputTime = document.getElementById('distance_slider_value').value;
        var inputWalking = document.getElementById('walking_check').checked;
        var inputDist = 0;
        if(inputWalking){
          inputDist = inputTime/60*3*1609.344;
        }
        else{
          inputDist = inputTime/60*5*1609.344;
        }

        genRoute(inputStart, inputDist, getActiveTags())
        return true;
      });
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    infowindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);
    //genRoute(cambridge, 5000, ['park', 'restaurant', 'cafe']);
  }

  function searchboxInit(inputBox){
    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(inputBox));
    inputBox.removeAttribute("hidden");

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
    if(places.length>0){
      for (var i = 0, marker; marker = sbMarkers[i]; i++) {
        marker.setMap(null);
      }
      // For each place, get the icon, place name, and location.
      sbMarkers = [];
      var bounds = new google.maps.LatLngBounds();
      //for (var i = 0, place; place = places[i]; i++) { //UNCOMMENT FOR SHOWING ALL RESULTS
      var sbPlace = places[0];

       inputBox.value = sbPlace.formatted_address;
       start = sbPlace.geometry.location;

        var image = {
          url: sbPlace.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: sbPlace.name,
          position: sbPlace.geometry.location
        });

        sbMarkers.push(marker);

        bounds.extend(sbPlace.geometry.location);


      map.fitBounds(bounds);
      map.setZoom(15);
  }
  });
  // [END region_getplaces]

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });


  }

  function geocodingCallback(results, status, distance, tags){
    if (status == google.maps.GeocoderStatus.OK) {
      genRoute(results[0].geometry.location, distance, tags);
    }
  }


  function genRoute(startParam, distanceParam, tagsParam) {
    if(startParam != null)
      start = startParam;
    if(distanceParam != null)
      distance = distanceParam;
    if(tagsParam != null)
      tags = tagsParam;
    console.log(tags)
    var modDist = distance/DISTANCE_CONSTANT;
    var request = {
      location: start,
      radius: modDist,
      types: tags,
    };
    placesService.nearbySearch(request, placesSearchCallback);
  }

  function placesSearchCallback(results, status) {
    // results is a list of PlaceResult objects
    if (status == google.maps.places.PlacesServiceStatus.OK) {
       var waypoints = new Array();
       var length = results.length;
       cachePlaces(results);
       pathList = [];
       for(var i = 0; i<8; i++){
          var ran = Math.floor(Math.random()*length);
          var randomPlace = results[ran];
          pathList.push({lat:randomPlace.geometry.location.lat(), lng:randomPlace.geometry.location.lng(), id:randomPlace.id});
          waypoints.push({location:randomPlace.geometry.location, stopover:true});
          results.splice(ran, 1);
          length--;
          if(length==0)
            break;
      }
      calcRoute(start, waypoints);
   }
  }

  function cachePlaces(points){
    // points is a list of objects which we need to turn into json strings
    // Is there a better way?
    var points_json = JSON.stringify(points)
    $.ajax({
      type: 'POST',
      url: '/saveplace/',
      data: {'results': points_json},
    });
  }

  function cachePath(name) {
    // Caches a path object in our database
    // Reminder: clear pathPlaceIds
    var startJSON = JSON.stringify(start);
    var pathListJSON = JSON.stringify(pathList);
    $.ajax({
      type: 'POST',
      url: '/path/',
      data: {'start': startJSON,
      'end': startJSON,
      'name': name,
      'waypoints': pathListJSON}
    });

    pathList = [];

  }

  function getPathFromID(pathName) {
    $.ajax({
      type: 'GET',
      url: '/path/',
      data: {'path-name': pathName},
      success: renderPath,
      error: displayError
    });
  }

  // Assumes that start and end are always the same
  function calcRoute(start, points) {
    request = {
      origin:start,
      destination:start,
      waypoints:points,
      optimizeWaypoints:true,
      travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        pathStatus = status;
        directionsDisplay.setDirections(response);
      } else {
      }
    });
  }

  function getActiveTags() {
    // returns a list of strings of active tags
    var activeTags = [];
    $(".place-tag.active").each(function() {
      activeTags.push($(this).attr("value"));
    })
    return activeTags;
  }

  function formatTagTitles(){
    $(".place-tag").each(function(){
      var title = $(this).html();
      var splitTitle = title.split('');
      var firstLetter = true;
      for(var i = 0; i<splitTitle.length; i++){
        if(firstLetter){
          splitTitle[i] = splitTitle[i].toUpperCase();
          firstLetter = false;
        }
        if(splitTitle[i] == '_'){
          splitTitle[i] = ' ';
          firstLetter = true;
        }
      }
      title = splitTitle.join('');
      $(this).html(title);

    });
  }

  function renderPath(data) {
    // Namespace collision?
    var _start  = new google.maps.LatLng(data.start.lat, data.start.lng);
    var json_waypoints = data.waypoints
    var waypoints = []
    for (var i = 0; i < json_waypoints.length; i++) {
      var waypointLatLng = new google.maps.LatLng(json_waypoints[i].lat, json_waypoints[i].lng);
      waypoints.push({location:waypointLatLng, stopover:true});
    }
    calcRoute(_start, waypoints);
  }

  // Selects tag buttons
  // Used for feature selection
  // tags is a list of strings
  function selectTag(tags) {
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      $("#"+tag+".place-tag").click()
    }
  }

  function displayError() {
    // Displays error on screen, most likely because internet down
    console.log("Couldn't load path")
  }

  google.maps.event.addDomListener(window, 'load', initialize);

   // Attach a click listener to refresh_map button; NOTE: already done in initialize(), do we need to move it down here?
  /*$("#refresh-map").click(function() {
    genRoute(start, dist, getActiveTags());
  });*/



  //Need to save path
  // Could be hacked. Need to sanitize inputs.
  $("#save_btn").click(function() {
    // Check whether user has actually generated a path. If not, say it
    if (pathList.length === 0) {
      $("#error-message").text("No generated path");
      return
    }
    // Check whether name exists. If it doesn't, show error message
    var name = $("#path-name-input").val()
    if (name === "") {
      $("#error-message").text("*Input name");
      return
    } else {
      $("#error-message").text("");
      cachePath(name);
    }

  })

  $(".get-path-button").click(function() {
    getPathFromID($(this).attr("value"))
  })

})