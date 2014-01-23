$(function() {
  $(".radio-toggle").click(function() {
      $(".radio-toggle.active").toggleClass("active");
      $(this).toggleClass("active");
    })

  $(".check-toggle").click(function() {
      $(this).toggleClass("active");
    })
})