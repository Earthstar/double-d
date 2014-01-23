$(function() {
  var map;
  var infowindow;
  var directionsService = new google.maps.DirectionsService();
  var placesService;
  var DISTANCE_CONSTANT = 2.6*3.14159;

  // Inputs for map generation, should be changed upon genRoute
  var start = new google.maps.LatLng(0, 0);
  var distance = 0;
  var tags = [];

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
      zoom: 15
    });

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    infowindow = new google.maps.InfoWindow();
    placesService = new google.maps.places.PlacesService(map);
    genRoute(cambridge, 5000, ['park', 'restaurant', 'cafe']);
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
    placesService.nearbySearch(request, callback);
  }

  function callback(results, status) {
    console.log(status);
    // results is a list of PlaceResult objects
    if (status == google.maps.places.PlacesServiceStatus.OK) {
       var waypoints = new Array();
       var length = results.length;
       cachePlaces(results);

       pathPlaceIds = []; //Clear pathPlaceIDs
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
      calcRoute(waypoints);
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

  function cachePath() {
    // Caches a path object in our database
    // Reminder: clear pathPlaceIds
    var startJSON = JSON.stringify(start);
    var pathListJSON = JSON.stringify(pathList);
    $.ajax({
      type: 'POST',
      url: '/path/',
      data: {'start': startJSON,
      'end': startJSON,
      'name': Math.round((Math.random()*1000000)),
      'waypoints': pathListJSON}
    });

  }

  function getPathFromID(pathName) {
    $.ajax({
      type: 'GET',
      url: '/path/',
      data: {'path-name': pathName}
    });
  }

  function calcRoute(points) {
   var request = {
       origin:start,
       destination:start,
       waypoints:points,
       optimizeWaypoints:true,
       travelMode: google.maps.TravelMode.WALKING
   };
   directionsService.route(request, function(response, status) {
     if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
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

  function renderPath() {
    // TODO fill in function
  }

  google.maps.event.addDomListener(window, 'load', initialize);

   // Attach a click listener to refresh_map button
  $("#refresh-map").click(function() {
    genRoute(null, null, getActiveTags());
  });

    //Need to save path
  $("#save-path").click(function() {
    cachePath();
  })

})