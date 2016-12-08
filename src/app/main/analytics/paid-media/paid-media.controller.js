(function() {
	'use strict';

	angular
		.module('app.analytics.paidMedia')
		.controller('PaidMediaController', PaidMediaController);

	PaidMediaController.$inject = ['Global', 'api'];
	/** @ngInject */
	function PaidMediaController(Global, api) {
		var vm 		 = this;

		vm.options = {};
		vm.flags 	 = {};
		vm.values  = {};
		vm.keys		 = {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}

			if (angular.isUndefined(Global.analytics.PPC) || Global.analytics.PPC === null) {
				api.getAnalyticsData ('PPC', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC = response.data;
						vm.values.PPC 	= Global.analytics.PPC;
						vm.flags.PPC = true;
						console.log(Global.analytics.PPC);
					} else {
						vm.flags.PPC = false;
					}
				});
			} else {
				vm.flags.PPC = true;
			}
			vm.options = { 
				PPC: {
					dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		      pagingType: 'simple',
		      autoWidth: false,
		      responsive: true
		    }
			};
			vm.keys = {
				PPC: ['Campaign', 'Clicks', 'Cost', 'CTR', 'CPC', 'Revenue', 'Goal Completions', 'Conversion Rate']
			};
			vm.values = {
				PPC: Global.analytics.PPC
			};
		};

		vm.init ();
	}
})();