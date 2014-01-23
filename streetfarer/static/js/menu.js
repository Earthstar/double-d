$(document).ready(function() {
	$('#text').focus();
	$('#text').click();

	var check = 1;
	var color = "#F26933";
	var size= 6;
	var comp= null;
	var eraseCheck = 0;


	//hover over
	$('#select_btn').mouseover(function(){
		$(this).css('backgroundImage','-webkit-linear-gradient(bottom, #FFFFFF 0%, #e6e6e6 100%)');
		$('#select_tooltip').show();
	}).mouseout(function(){
		$(this).css('backgroundImage', 'none');
		$('#select_tooltip').hide();
	})


	//toggle
	$('#select_btn').click(function(){
		if (check == 1){
			$('#toggle_dot').css('left', '32px');
			$('#walk_icon').css({
				'opacity': '.5',
			});
			$('#run_icon').css('opacity', '1.0');
			document.getElementById('walking_check').checked = false;
			check = 0;

		}else{
			$('#toggle_dot').css('left', '2px');
			$('#walk_icon').css('opacity', '1.0');
			$('#run_icon').css('opacity', '.5');
			document.getElementById('walking_check').checked = true;
			check = 1;


		}
	})





//document ready
});






