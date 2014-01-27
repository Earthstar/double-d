$(function() {
	
	function on_resize(c,t) {
		// debulked onresize handler
		// https://github.com/louisremi/jquery-smartresize/
		onresize = function(){
			clearTimeout(t);
			t = setTimeout(c,100);
		};
		return c;
	}

	function resize() {
		if( MQ.getContext() != 'mobile' ){
			var scope = $("#body").scope();
			scope.resizeEvents++;
			scope.$apply();
		}
	};
	
	$(document).on("keyup", "input", function(e) {
		if ( e.which == 38 ) { // Up
			if ( $(this).prev("input").length ) $(this).prev("input").focus();
		} else if ( e.which == 40 || e.which == 13 ) { // Down or Enter
			var $nextItem = $(this).next("input").not(".hidden");
			if ( $nextItem.length ) {
				$nextItem.focus();
			} else if ( $("html").hasClass("ie8") && $(this).val() !== '' ) {
				$(this).closest("form").submit();
			}
		}
	});
	
	$('textarea.autogrow').autogrow();
	
	var queries = [
		{
			context: 'mobile',
			match: function() {
				// console.log('mobile');
			}
	    },
	    {
			context: 'desktop',
			match: function() {
	            // console.log('desktop');
			}
		}
	];
	
	MQ.init(queries);
	
	$(document).on("click", 'a[href="#"]', function(e) {
		e.preventDefault();
	});
	
	$('a.download-napkin').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	
	$(document).on("submit", "form.no-submit", function(e) {
		e.preventDefault();
		return false;
	});

	on_resize(resize);
	resize();

});
