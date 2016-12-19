(function() {
	'use strict';

	angular
		.module('app.analytics.organic')
		.controller('OrganicController', OrganicController);

	OrganicController.$inject = ['Global', 'api', '$rootScope', '$mdDateRangePicker', 'moment', '$q'];
	
	/** @ngInject */
	function OrganicController(Global, api, $rootScope, $mdDateRangePicker, moment, $q) {
		
		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 			= {};
		vm.chart 			= {};
		vm.values 		= {};
		vm.keys 			= {};
		vm.dateRanges = {};

		// methods
		vm.updateOrganicDateRange = updateOrganicDateRange;
		vm.updateOrganicChart = updateOrganicChart;

		vm.init = function () {
			
			vm.flags.endRequestPages 		= false;
			vm.flags.endRequestOrganic 	= false;
			$rootScope.loadingProgress 	= true;

			vm.dateRanges.organic = {
				dateStart: new Date(moment(new Date()).subtract(6, 'days')),
				dateEnd: new Date(moment(new Date()))
			};

			vm.options.dateRange = {
				showTemplate: false,
				fullscreen: false
			}

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
				api.getAnalyticsData ('Landing_Pages', function (response) {
					if (response.code == 0) {
						Global.analytics.pages = response.data;
						vm.values.pages 	= Global.analytics.pages;
						vm.flags.pages = true;
					} else {
						vm.flags.pages = false;
					}
					vm.flags.endRequestPages = true;
					$rootScope.loadingProgress = true && !(vm.flags.endRequestPages && vm.flags.endRequestOrganic);
				});
			} else {
				vm.flags.pages = true;
			}

			if (angular.isUndefined(Global.analytics.organic) || Global.analytics.organic === null) {
				api.getAnalyticsData ('Sessions', function (response) {
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
					vm.flags.endRequestOrganic = true;
					$rootScope.loadingProgress = true && !(vm.flags.endRequestPages && vm.flags.endRequestOrganic);
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
			console.log(data);
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

		function updateOrganicDateRange ($event, showTemplate) {
			$mdDateRangePicker
				.show({targetEvent:$event, model:vm.dateRanges.organic} )
				.then(function(result){
					if(result) {
						vm.dateRanges.organic = result;
						updateOrganicChart (vm.dateRanges.organic);
					}
				});
		}

		function updateOrganicChart (dateRange) {
			
			var range = {};
			range.dateStart = moment(dateRange.dateStart).format('YYYY-MM-DD');
			range.dateEnd = moment(dateRange.dateEnd).format('YYYY-MM-DD');
			var query = {
				table_id: 'ga:' + Global.currentCampaign.view_ID,
				metrics: 'ga:sessions, ga:pageviewsPerSession',
				start_date: range.dateStart,
				end_date: range.dateEnd,
				dimensions: 'ga:date'
			};

			api.getAnalytics (query, function (response) {
					if (response.code == 0) {
						console.log(response);

						vm.values.organic = response.date;

						vm.flags.organic = true;

						vm.options.organic.chart.yDomain = getExtent(vm.values.organic).map(function(x) { return x * 1.1; })

					} else {
						vm.flags.channel = false;
					}
				});

			// if (angular.isUndefined(Global.analytics.organic) || Global.analytics.organic === null) {
			// 	api.getAnalyticsData ('Sessions', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.organic = response.data;
			// 			vm.values.organic = Global.analytics.organic;

			// 			vm.flags.organic = true;
			// 			vm.values.organic = Global.analytics.organic;
			// 			vm.values.pages 	= Global.analytics.pages;
			// 			vm.options.organic.chart.yDomain = getExtent(vm.values.organic).map(function(x) { return x * 1.1; })
			// 		} else {
			// 			vm.flags.organic = false;
			// 		}
			// 		vm.flags.endRequestOrganic = true;
			// 		$rootScope.loadingProgress = true && !(vm.flags.endRequestPages && vm.flags.endRequestOrganic);
			// 	});
			// } else {
			// 	vm.values.organic = Global.analytics.organic;
			// 	vm.values.pages 	= Global.analytics.pages;
			// 	vm.options.organic.chart.yDomain = getExtent(vm.values.organic).map(function(x) { return x * 1.1; })
			// 	vm.flags.organic = true;
			// }
		}

		vm.init();
	}
})();