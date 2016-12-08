(function() {
	'use strict';

	angular
		.module('app.analytics.organic')
		.controller('OrganicController', OrganicController);

	OrganicController.$inject = ['Global', 'api'];
	/** @ngInject */
	function OrganicController(Global, api) {
		var vm = this;

		vm.options 	= {};
		vm.flags 		= {};
		vm.chart 		= {};
		vm.values 	= {};
		vm.keys 		= {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}

			if (angular.isUndefined(Global.analytics.pages) || Global.analytics.pages === null) {
				api.getAnalyticsData ('pages', function (response) {
					if (response.code == 0) {
						Global.analytics.pages = response.data;
						vm.values.pages 	= Global.analytics.pages;
						vm.flags.pages = true;
					} else {
						vm.flags.pages = false;
					}
				});
			} else {
				vm.flags.pages = true;
			}

			if (angular.isUndefined(Global.analytics.organic) || Global.analytics.organic === null) {
				api.getAnalyticsData ('organic', function (response) {
					if (response.code == 0) {
						Global.analytics.organic = response.data;
						vm.values.organic = Global.analytics.organic;
						vm.flags.organic = true;
					} else {
						vm.flags.organic = false;
					}
				});
			} else {
				vm.flags.organic = true;
			}

			vm.values.organic = Global.analytics.organic;
			vm.values.pages 	= Global.analytics.pages;

			vm.options.organic = {
				chart : {
					type:'lineChart',
					x: function(d) { return d.month; },
					y: function(d) { return d.value; }
				}
			};

			vm.options.pages = {
	      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
	      pagingType: 'simple',
	      autoWidth: false,
	      responsive: true
	    };

	    vm.keys.pages = ['Page Title', 'Landing Page', 'Pageviews', 'Entrances', 'Avg. Time on Page'];
		}

		vm.init();
	}
})();