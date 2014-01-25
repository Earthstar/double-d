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

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: cambridge,
      zoom: 2
    });
    var refreshButton = document.getElementById('refresh-btn');
    if (refreshButton) {
      refreshButton.addEventListener("click", function(event){
        event.preventDefault();
        var inputTime = document.getElementById('distance_slider_value').value;
        var inputWalking = document.getElementById('walking_check').checked;
        var inputDist = 0;
        if(inputWalking){
          inputDist = inputTime/60*3*1609.344;
        }
        else{
          inputDist = inputTime/60*5*1609.344;
        }
        var inputStart = "Cambridge, MA";
        var inputTags = getActiveTags();
        geocodeService.geocode({address:inputStart, region:"US"}, function(results, status){
          geocodingCallback(results, status, inputDist, inputTags);
        });
        return true;
      });
    }

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    infowindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);
    //genRoute(cambridge, 5000, ['park', 'restaurant', 'cafe']);
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

   // Attach a click listener to refresh_map button
  $("#refresh-map").click(function() {
    genRoute(null, null, getActiveTags());
  });



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