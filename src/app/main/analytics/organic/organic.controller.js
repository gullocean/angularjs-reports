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
			vm.options.organic = {
				chart : {
					type:'lineChart',
					x: function(d) { return d.month; },
					y: function(d) { return d.value; },
					xAxis: {
						axisLabel: 'Month'
					},
					yAxis: {
						tickFormat: function(d) { return d3.format('.02f')(d); }
					},
					legend : {
						updateState: false
					}
				}
			};

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
						vm.values.organic = Global.analytics.organic;
						vm.values.pages 	= Global.analytics.pages;
						vm.options.organic.chart.yDomain = getExtent(vm.values.organic).map(function(x) { return x * 1.1; })
					} else {
						vm.flags.organic = false;
					}
				});
			} else {
				vm.values.organic = Global.analytics.organic;
				vm.values.pages 	= Global.analytics.pages;
				vm.options.organic.chart.yDomain = getExtent(vm.values.organic).map(function(x) { return x * 1.1; })
				vm.flags.organic = true;
			}

			

			vm.options.pages = {
	      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
	      pagingType: 'simple',
	      autoWidth: false,
	      responsive: true
	    };

	    vm.keys.pages = ['Page Title', 'Landing Page', 'Pageviews', 'Entrances', 'Avg. Time on Page'];
		}

		function getExtent (data) {
			var y_min = d3.min(data, function(d) {
				return d3.min(d.values, function(dv) {
					return +dv.value;
				});
			});
			var y_max = d3.max(data, function(d) {
				return d3.max(d.values, function(dv) {
					return +dv.value;
				});
			});
			return [y_min, y_max];
		}

		vm.init();
	}
})();