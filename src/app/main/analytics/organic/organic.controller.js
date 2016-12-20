(function() {
	'use strict';

	angular
		.module('app.analytics.organic')
		.controller('OrganicController', OrganicController);

	OrganicController.$inject = ['Global', 'api', '$rootScope', '$mdDateRangePicker', 'moment', '$q', '$state'];
	
	/** @ngInject */
	function OrganicController(Global, api, $rootScope, $mdDateRangePicker, moment, $q, $state) {
		
		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 			= {};
		vm.chart 			= {};
		vm.values 		= {};
		vm.keys 			= {};
		vm.dateRange 	= {};
		vm.isCompare	= true;

		// methods
		vm.updateOrganicDateRange = updateOrganicDateRange;
		vm.onThirtyDays						= onThirtyDays;
		vm.onNinetyDays						= onNinetyDays;

		vm.init = function () {

			if ( angular.isUndefined (Global.currentCampaign) || Global.currentCampaign === null ) {
				$state.go('app.campaigns');
				return;
			}
			
			if ( angular.isUndefined (Global.dateRange) || Global.dateRange === null ) {
				Global.dateRange = {
					dateStart: 	new Date(moment(new Date()).subtract(1, 'months')),
					dateEnd: 		new Date(moment(new Date()))
				};
			}

			vm.dateRange = Global.dateRange;

			vm.keys.pages = ['Page Title', 'Landing Page', 'Pageviews', 'Entrances', 'Avg. Time on Page'];
			vm.keys.compare = [
				{
					label 	: 'Page Views',
					metrics : 'pageviews'
				}, {
					label 	: 'Bounce Rate',
					metrics : 'bounceRate'
				}, {
					label 	: 'Avg. Session Duration',
					metrics : 'avgSessionDuration'
				}, {
					label 	: 'Pages / Session',
					metrics : 'pageviewsPerSession'
				}
			];

			vm.options.pages = {
	      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
	      pagingType: 'simple',
	      autoWidth: false,
	      responsive: true
	    };

			vm.options.organic = {
				chart : {
					type:'multiChart',
					margin : {
						top: 30,
						right: 60,
						bottom: 50,
						left : 70
					},
					x: function(d) { return d[0]; },
					y: function(d) { return d[1]; },
					xScale : d3.time.scale(),
					xAxis: {
						axisLabel: 'Year',
						rotateLabels: 0,
						tickFormat: function(d) { return moment(d).format('YYYY-MM-DD'); }
					},
					yAxis: {
						tickFormat: function(d) { return d3.format('.2f')(d); }
					},
					y2Axis: {
						tickFormat: function(d) { return d3.format('.2f')(d); }
					}
				}
			};

			vm.chart.values = [
				{
					key 		: 'Sessions',
					type 		: 'line',
					values 	: [],
					yAxis 	: 1
				}, {
					key 		: 'Pages / Session',
					type 		: 'line',
					values 	: [],
					yAxis 	: 2
				}
			];

			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}

			if (angular.isUndefined(Global.analytics.organic) || Global.analytics.organic === null ) {
				getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
			}
		}

		function updateOrganicDateRange ($event, showTemplate) {
			$mdDateRangePicker
				.show({targetEvent:$event, model:Global.dateRange} )
				.then(function(result){
					if(result) {
						Global.dateRange = result;
						Global.dateRange = Global.dateRange;
						getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
					}
				});
		}

		function getReport (query) {
			var promise = $q.defer();

			api.getAnalytics (query, function (response) {
				if (response.code == 0) {
					promise.resolve (response);
				} else {
					promise.reject (response);
				} 
			});

			return promise.promise;
		}

		function getAllReports (dateRange, viewID, isCompare) {

			$rootScope.loadingProgress = true;

			var tasks = [];
			var query = {};

			// sessions
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:date'
			};
			
			tasks.push(getReport(query));

			// pages / session
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:pageviewsPerSession',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:date'
			};

			tasks.push(getReport(query));

			// Landing Pages
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:pageviews, ga:entrances, ga:avgTimeOnPage',
				start_date	: moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD'),
				end_date		: moment(new Date()).format('YYYY-MM-DD'),
				dimensions	: 'ga:pageTitle, ga:landingPagePath'
			};

			tasks.push(getReport(query));

			angular.forEach (vm.keys.compare, function (item) {

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: 'ga:' + item.metrics,
					start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
					end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: 'ga:' + item.metrics,
					start_date	: moment(dateRange.dateStart).subtract(1, 'years').format('YYYY-MM-DD'),
					end_date		: moment(dateRange.dateEnd).subtract(1, 'years').format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: 'ga:' + item.metrics,
					start_date	: moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
					end_date		: moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: 'ga:' + item.metrics,
					start_date	: moment().subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD'),
					end_date		: moment().subtract(2, 'weeks').endOf('week').format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(getReport(query));
			});

			$q.all(tasks).then (function (response) {
				
				// sessions
				vm.chart.values[0].values = response[0].data;

				// page / session
				vm.chart.values[1].values = response[1].data;

				// landing page
				vm.values.pages = response[2].data;

				angular.forEach (vm.chart.values, function(r) {
					angular.forEach (r.values, function(d) {
						d[0] = moment(d[0],'YYYYMMDD').toDate();
						d[1] = Math.round(+d[1] * 100) / 100;
					});
				});

				vm.options.organic.chart.xAxis.domain = d3.extent(vm.chart.values[0].values, function (d) { return d[0]; });

				vm.flags.organic = true;

				vm.values.compare = [];

				for (var i = 0; i < vm.keys.compare.length; i ++) {
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_this_year',
						value : +response[3 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_last_year',
						value : +response[4 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_this_week',
						value : +response[5 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_last_week',
						value : +response[6 + 4 * i].data[0][0]
					});
				}

				$rootScope.loadingProgress = false;

			}, function (error) {
				console.log(error);
			});
		}

		function onThirtyDays () {
			Global.dateRange = {
				dateStart: 	new Date(moment(new Date()).subtract(30, 'days')),
				dateEnd: 		new Date(moment(new Date()))
			};
			getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
		}

		function onNinetyDays () {
			Global.dateRange = {
				dateStart: 	new Date(moment(new Date()).subtract(90, 'days')),
				dateEnd: 		new Date(moment(new Date()))
			};
			getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
		}

		vm.init();
	}
})();