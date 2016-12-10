(function() {
	'use strict';

	angular
		.module('app.analytics.goalCompletions')
		.controller('GoalCompletionsController', GoalCompletionsController);

	GoalCompletionsController.$inject = ['Global', 'api'];
	/** @ngInject */
	function GoalCompletionsController(Global, api) {
		var vm 			= this;

		vm.options 	= {};
		vm.flags 		= {};
		vm.values 	= {};
		vm.messages = {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}
			if (angular.isUndefined(Global.analytics.goal) || Global.analytics.goal === null) {
				api.getAnalyticsData ('Goal_Completions', function (response) {
					vm.messages.goal = response.message;
					if (response.code == 0) {
						Global.analytics.goal = response.data;
						vm.values.goal 	= Global.analytics.goal;
						vm.flags.goal = true;
					} else {
						vm.flags.goal = false;
					}
				});
			} else {
				vm.flags.goal = true;
			}
			vm.values.goal = Global.analytics.goal;
		}

		vm.init ();
	}
})();