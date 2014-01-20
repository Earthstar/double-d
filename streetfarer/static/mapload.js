var map;
var infowindow;
var directionsService = new google.maps.DirectionsService();
var cambridge;
var DISTANCE_CONSTANT = 2.6*3.14159;

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
console.log(csrftoken)

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
  var service = new google.maps.places.PlacesService(map);
  genRoute(cambridge, 2200, ['parks']);
}

function genRoute(start, distance, tags) {
  var modDist = distance/DISTANCE_CONSTANT;
  var request = {
    location: start,
    radius: modDist,
    types: tags
  };
  service.nearbySearch(request, callback)
}

function callback(results, status) {
  // results is a list of PlaceResult objects
  if (status == google.maps.places.PlacesServiceStatus.OK) {
     var waypoints = new Array();
     var length = results.length;
     console.log(results);
     // console.log(JSON.stringify(results[0]))
     cachePlaces(results);
     for(var i = 0; i<8; i++){
       var ran = Math.floor(Math.random()*length);
              waypoints.push({location:results[ran].geometry.location, stopover:true});
              results.splice(ran, 1);
              length--;
    }
    calcRoute(waypoints);
 }
}

function cachePlaces(points){
  // points is a list of objects which we need to turn into json strings
  // Is there a better way?
  // console.log(points);
  var points_json = JSON.stringify(points)
  console.log(points_json)
  $.ajax({
    type: 'POST',
    url: '/saveplace/',
    optimizeWaypoints:true,
    data: {'results[]': points_json},
  });
}

function calcRoute(points) {
 console.log("Hello, there!");
 var start = cambridge;
 var end = cambridge;
 var request = {
     origin:start,
     destination:end,
     waypoints:points,
     travelMode: google.maps.TravelMode.WALKING
 };
 directionsService.route(request, function(response, status) {
   if (status == google.maps.DirectionsStatus.OK) {
     directionsDisplay.setDirections(response);
   }
 });
}


google.maps.event.addDomListener(window, 'load', initialize);
