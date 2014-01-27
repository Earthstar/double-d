$(function() {
  $(".radio-toggle").click(function() {
    // apply radio toggle only to children
      $(".radio-toggle.active").toggleClass("active");
      $(this).toggleClass("active");
    })

  $(".check-toggle").click(function() {
      $(this).toggleClass("active");
    })
})