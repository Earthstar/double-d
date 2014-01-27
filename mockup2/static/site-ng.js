;(function() {
	
	var app = angular.module('napkin', [], ['$locationProvider', function($locationProvider){
		if( !$('html').hasClass('lte8') ){
			$locationProvider.html5Mode(true);
		}
	}]);
	
	var model = {
		members: [{name:''}],
		section: 'start',
		hasRequiredMembers: false
	};
	
	app.controller('NapkinCtrl', ["$scope", "$location", "$timeout", function($scope, $location, $timeout) {
		$scope.model = model;
		$scope.resizeEvents = 0;
		$scope.errorMessages = {};

		$scope.decisions = [
		    { val: 'a1', label: 'Majority of team members voting in favour' },
		    { val: 'a2', label: 'Majority of percentage stakes above voting in favour' },
		    { val: 'a3', label: ' is the boss and has the deciding vote', hasBossSelection: true },
		    { val: 'a4', label: 'Unanimously' },
		    { val: 'a5', label: 'Other' }
		];

		$scope.breakupStrategies = [
			{ val: 'a1', label: ' gets to take all the digital assets and carry on, and the rest of us will wish them well', hasBossSelection: true  },
			{ val: 'a2', label: 'We will each get the chance to offer to buy the others out' },
			{ val: 'a3', label: 'We will all agree not to use any branding that we’ve developed for the project, but we’ll each be able to take any code or other development work away under license and do our own thing'}
		];

		var scroll = function(newSection) {
			$.waypoints('disable');
			setTimeout(function(){
				$.waypoints('enable');
				$.waypoints('refresh');
				var newPath = (baseURL + "/" + newSection);
				if ( $scope.model.section !== newSection || $location.path() !== newPath) {
					$scope.model.section = newSection;
					$location.path(newPath);
					$scope.$apply();
				}
			}, 500);
			$.scrollTo( $('#' + newSection).offset().top, {
				duration: 400,
				axis: 'y'
			});
		};

		var updateTooltips = function() {
			$('a.tip').each(function(){
				$(this).tooltip({
					placement: 'top',
					delay: {
						show: 500,
						hide: 100
					}
				}, 'fixTitle');
			});
		};

		$('article').waypoint(function(direction) {
			var section = $(this).attr('id');
			$scope.model.section = section;
			$location.path(baseURL + "/" + section);
			$scope.removeLastBlankMember();
			$('div.dummy-field').popover('hide');
			$scope.$apply();
		});
		
		$scope.$watch(function(){
			var result = $location.path();
			if ( !result ) result = "start";
			return result;
		}, function(newPath, oldPath) {
			newPath = newPath.replace(/^\/napkin/,"");
			oldPath = oldPath.replace(/^\/napkin/,"");
			var newSection = newPath.replace(/\//g,"");
			if ( newSection == '' ) newSection = 'start';
			if ( $scope.model.section == newSection ) {
			} else {
				$scope.model.section = newSection;
				if( MQ.getContext() != 'mobile' ){
					scroll(newSection);
				}
			}
		});		
		
		$scope.bodyClass = function() {
			var result = $scope.model.section === 'start' ? ' ' : ( $scope.model.section === 'done' ? 'show-footer' : 'show-progress hide-footer');
			return result;
		};
		
		$scope.hideAllPopovers = function() {
			$('div.dummy-field').popover('hide');
		};
		
		$scope.selectDecision = function(decision) {
			$scope.model.selectedDecision = decision.val; // Because IE is JUNK
			$scope.model.closeOtherDecision = false;
			if ( !decision.hasBossSelection ) $scope.hideAllPopovers();	
		};
		
		$scope.selectBreakup = function(breakup) {
			$scope.model.selectedBreakup = breakup.val; // Because IE is JUNK
			if ( !breakup.hasBossSelection ) $scope.hideAllPopovers();	
		};
		
		$scope.setSection = function(newSection, completed) {
			$scope.removeLastBlankMember();
			$scope.hideAllPopovers();
			if( completed || $scope.completed(newSection) ){
				scroll(newSection);
				if ( newSection == 'who' ) $("#who input[type='text']:last").focus();
				if ( newSection == 'what' ) $("#what textarea").focus();
				if ( newSection == 'percentages' ) $("#percentages input[type='text']:first").focus();
			}
		};

		$scope.downloadNapkin = function() {
			/* Fetch new CSRF token */
			$.ajax(baseURL + "/token/", {
				dataType: "json",
				success: function(data) {
					$("#napkin-form input[name=__csrf]").val(data.csrf);
					$("#napkin-form").submit();
				}
			});
		};

		$scope.$watch("resizeEvents", function() {
			var w = $(window).width(),
				h = $(window).height();
			$('article')
				.each(function(){
					var $this = $(this),
						$content = $this.find('.content');
					
					 // Reset values before finding original dimensions
					$this.css({
						'width': 'auto',
						'min-height': 0
					});
					$content.css('padding-top', 0);
					
					// Find and set new dimensions
					var	thisW = $this.width(),
						thisH = $this.height();
					
					var newW = thisW > w ? thisW : w;
					var newH = thisH > h ? thisH : h;
					
					$this.css({
						'width': newW,
						'min-height': newH
					});
					
					if( thisH < h ){
						$content.css({
							'padding-top': ( $(window).height() - $content.outerHeight() ) / 2
						});
					}
				});
			scroll($scope.model.section);
			$.waypoints('refresh');
		});

		$scope.addNewMember = function() {
			if ( $scope.model.members.length > 0 && $scope.model.members[$scope.model.members.length-1].name !== '') {
				$scope.model.members.push({name: ''});
			}
			if( MQ.getContext() != 'mobile' ){
				$scope.resizeEvents++;
			}
		};

		$scope.removeBlankMembers = function() {
			for (var i = $scope.model.members.length - 2; i >= 0; i--){
				if ( $scope.model.members[i].name === '' && $scope.model.members.length > 1 ) {
					$scope.model.members.splice(i, 1); // Removes a single item
					$(":focus").next("input").focus();
				}
			};
		};
		
		$scope.removeLastBlankMember = function() {
			if ( $scope.model.members.length > 1 && $scope.model.members[$scope.model.members.length-1].name === ''  ) {
				$scope.model.members.pop();
			};
		};

		$scope.completed = function(step) {
			$scope.errorMessages[step] = '';
			if ( step === 'start' ) {
				return true;
			} if ( step === 'who' ) {
				var count = 0;
				for (var i = $scope.model.members.length - 1; i >= 0; i--){
					if ( $scope.model.members[i].name !== '' ) {
						count++;
					}
				};
				if ( count < 2 ) {
					$scope.errorMessages[step] = 'Please add at least two team members';
					$scope.hasRequiredMembers = false;
				} else {
					$scope.hasRequiredMembers = true;
				}
			} else if ( step === 'what' ) {
				if ( 
					typeof $scope.model.projectDescription === 'undefined'
					|| $scope.model.projectDescription.length < 3
				) {
					$scope.errorMessages[step] = 'Please complete your project description';
				} else if ($scope.model.projectDescription.split(' ')[0].toLowerCase() !== 'a' && $scope.model.projectDescription.split(' ')[0].toLowerCase() !== 'an' ) {
					$scope.errorMessages[step] = 'Please start your project description with ‘a’ or ‘an’';
				}
			} else if ( step === 'percentages' ) {
				var total = 0;
				if($scope.model.members.length == 1){
					$scope.errorMessages[step] = "Please add some team members first";
				} else {
					var badNumber = false;
					var negativeNumber = false;
					for ( var x = 0; x < $scope.model.members.length; x++) {
						var member = $scope.model.members[x];
						var p = parseInt(member.percentage, 10);
						if ( isNaN(p) ) {
							badNumber = true;
						} else if ( p < 0 ) {
							negativeNumber = true;
						} else {
							total += p;
						}
					}
					if ( badNumber ) {
						$scope.errorMessages[step] = "Please complete the percentages for everyone";
					} else if ( negativeNumber ) {
						$scope.errorMessages[step] = "Percentages can’t be less than 0%";
					} else if ( Math.abs(100 - total) > 1 ) {
						$scope.errorMessages[step] = "Your percentages must total 100%";
					}
				}
			} else if ( step === 'decisions' ) {
				if ( $scope.model.selectedDecision == 'a3' ) {
					if ( !$scope.model.decidingBoss ) $scope.errorMessages[step] = "Please specify who is project boss";
				} else if ( $scope.model.selectedDecision == 'a5' ) {
					if( !$scope.model.decisionOther ) {
						$scope.errorMessages[step] = "Please say how you will make decisions";
					}
				} else if ( !$scope.model.selectedDecision ) {
					$scope.errorMessages[step] = "Please select a decision process";
				}
			} else if ( step === 'breakup' ) {
				if ( $scope.model.selectedBreakup == 'a1' ) {
					if ( !$scope.model.breakupBoss ) $scope.errorMessages[step] = "Please specify who is project boss";
				} else if ( !$scope.model.selectedBreakup ) {
					$scope.errorMessages[step] = "Please select a breakup process";
				}
			} else if ( step === 'all' || step === 'done' ) {
				return $scope.completed('who') && $scope.completed('what') && $scope.completed('percentages') && $scope.completed('decisions') && $scope.completed('breakup');
			}

			updateTooltips();
			return $scope.errorMessages[step] == '';
		};
		
	}]);

	app.directive('ngFocus', ['$parse', function($parse) {
		return function(scope, element, attr) {
			var fn = $parse(attr['ngFocus']);
			element.bind('focus', function(event) {
				scope.$apply(function() {
					fn(scope, {$event:event});
				});
			});
		};
	}]);

	app.directive('ngBlur', ['$parse', function($parse) {
		return function(scope, element, attr) {
			var fn = $parse(attr['ngBlur']);
			element.bind('blur', function(event) {
				scope.$apply(function() {
					fn(scope, {$event:event});
				});
			});
		};
	}]);
	
	app.directive('popoverControl', function() {
		return {
			link: function(scope, element, attrs) {
				element.popover({
					'html': true,
					"content": function(){
						return $('#member-list').clone().attr({
							'id': '',
							'class': 'cloned-popup'
						}).data('section', element.data('section'));
					},
					'placement': 'bottom',
					'container': 'body',
					'template': '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>'
				});
			}
		};
	});

	$(document).on('click', '.popover-content a', function(e){
		var scope = $('#body').scope();
		var section = $(this).closest('.cloned-popup').data('section');
		
		if( section == 'decisions' ){
			scope.model.decidingBoss = $(this).text();
		} else if ( section == 'breakup' ){
			scope.model.breakupBoss = $(this).text();
		}
		
		scope.hideAllPopovers();
		
		scope.$apply();
	});
})();

