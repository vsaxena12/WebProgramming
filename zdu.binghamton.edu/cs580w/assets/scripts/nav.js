$(function() {

  DELAY = 400;
  
  $('#opennav').click(function() {
    $('#opennav').hide(DELAY);
    $('#nav').show(DELAY);
    $('#main').css('padding-left', '12em');
  });
		      
  $('#closenav').click(function() {
    $('#nav').hide(DELAY);
    $('#opennav').show(DELAY);
    $('#main').css('padding-left', '0.5em');
  });
		      
		      
});
