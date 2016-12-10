(function() {
	'use strict';

	angular
		.module('app.analytics.value')
		.controller('ValueController', ValueController);

	ValueController.$inject = ['Global', 'api'];
	/** @ngInject */
	function ValueController(Global, api) {
		var vm 			= this;

		vm.options 	= {};
		vm.flags 		= {};
		vm.values 	= {};
		vm.messages = {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}
			if (angular.isUndefined(Global.analytics.value) || Global.analytics.value === null) {
				api.getAnalyticsData ('Conversion_Value', function (response) {
					vm.messages.value = response.message;
					if (response.code == 0) {
						Global.analytics.value = response.data;
						vm.values.value 	= Global.analytics.value;
						vm.flags.value = true;
					} else {
						vm.flags.value = false;
					}
				});
			} else {
				vm.flags.value = true;
			}
			vm.values.value = Global.analytics.value;
		}

		vm.init ();
	}
})();