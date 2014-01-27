$(document).ready(function() {
	$('#text').focus();
	$('#text').click();

	var check = 1;
	var color = "#F26933";
	var size= 6;
	var comp= null;
	var eraseCheck = 0;
	

	//hover over
	$('#draw_btn').mouseover(function(){
		$(this).css('backgroundImage','-webkit-linear-gradient(bottom, #FFFFFF 0%, #e6e6e6 100%)');
		$('#draw_tooltip').show();
	}).mouseout(function(){
		$(this).css('backgroundImage', 'none');
		$('#draw_tooltip').hide();
	})
	

	//toggle
	$('#draw_btn').click(function(){
		if (check == 1){
			$('#toggle_dot').css('left', '32px');
			$('#walk_icon').css({
				'opacity': '.5',
			});
			$('#run_icon').css('opacity', '1.0');
			
			check = 0;	
			
		}else{
			$('#toggle_dot').css('left', '2px');
			$('#walk_icon').css('opacity', '1.0');
			$('#run_icon').css('opacity', '.5');
			check = 1;
			
			
		}
	})


	
	
	
//document ready
});






