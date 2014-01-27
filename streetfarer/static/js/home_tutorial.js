$(function() {
  var start;
  var mapOnScreen = false;
  var elementsToToggleOnMapAppearance = "#map-creation-bar, .place-tag-container";

  var tagGroups = {
    hipster: ["art_gallery", "bicycle_store", "cafe", "book_store"],
    natureLover: ["aquarium", "park", "pet_store", "campground", "zoo"],
    morbid: ["cemetery", "funeral_home", "liquor_store", "hospital"],
    stylish: ["beauty_salon", "clothing_store", "florist", "hair_care",
    "jewelry_store", "shoe_store", "shopping_mall", "spa", "department_store"],
    boring: ["accounting", "atm", "bank", "courthouse", "finance",
    "insurance_agency", "lawyer", "parking", "post_office", "storage"],
    partyAnimal: ["bar", "casino", "night_club", "amusement_park"]
  }

  // The names of the tags which should be selected initially
  var initialTags = [];

  cambridge  = new google.maps.LatLng(42.356448, -71.108212);

  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: cambridge,
    zoom: 2
  });
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  // Hack to get google map to appear.
  // $(".carousel-control").click(function() {
  //   setTimeout(function() {
  //   }, 100)
  // })

  // Constantly updates whether map on screen?
  // Triggers events?
  // TODO make event triggers better
  setInterval(function() {
    var mapOnScreenNow = isMapOnScreen()
    if ((mapOnScreen) && (!mapOnScreenNow)) {
      // Map no longer on screen, trigger mapoff event
      console.log("trigger mapdisappear")
      $(elementsToToggleOnMapAppearance).trigger("mapdisappear")

    } else if ((!mapOnScreen) && (mapOnScreenNow)) {
      google.maps.event.trigger(map, 'resize')
      setTimeout(function() {
        console.log("trigger mapappear")
      $(elementsToToggleOnMapAppearance).trigger("mapappear")
      // refresh map
    }, 500)
    }
    mapOnScreen = mapOnScreenNow;
  }, 500)

  function isMapOnScreen() {
    return ($("#map-container").offset().top > 0)
  }

  function isSavedPathMapOnScreen() {
    // TODO
  }

  // Selects tag buttons
  // Used for feature selection
  // tags is a list of strings
  function selectTag(tags) {
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i]
      $("#"+tag+".place-tag").addClass("active")
    }
  }

  // If the map is on the screen, trigger the resize event and pull down the menu
  // If the map is not on the screen, pull up the menu
  // Problem: this code causes the map to stutter.
  $(elementsToToggleOnMapAppearance).on("mapappear", function() {
    $(elementsToToggleOnMapAppearance).slideDown("fast");
    // Hide the checkbox
    $("[hidden]").hide();
  }).on("mapdisappear", function() {
      $(this).slideUp("fast")
  })

  // If you click a preset tag, then select the correct tag
  $(".preset-tag").click(function() {
    // clear existing selected tags
    $(".place-tag").removeClass("active")
    var toSelect = $(this).attr("value")
    toSelect = tagGroups[toSelect]
    selectTag(toSelect)
  })

})