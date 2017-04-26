$( document ).ready(function() {
  $('.tab-chart').hide();
});

$('#map').click(function() {
  $('.tab-algo').show();
  $('.tab-chart').hide();
});

$('#chart').click(function() {
  $('.tab-algo').hide();
  $('.tab-chart').show();
});
