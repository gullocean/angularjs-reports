(function() {
	'use strict';

	angular
		.module('app.analytics.organic')
		.controller('OrganicController', OrganicController);

	OrganicController.$inject = ['Global', '$rootScope', '$mdDateRangePicker', 'moment', '$q', '$state', 'api'];
	
	/** @ngInject */
	function OrganicController(Global, $rootScope, $mdDateRangePicker, moment, $q, $state, api) {
		
		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 			= {};
		vm.chart 			= {};
		vm.values 		= {};
		vm.keys 			= {};
		vm.dateRange 	= {};
		vm.isCompare	= true;
		vm.isLoading 	= true;

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
					this : {
						dateStart: 	moment().subtract(1, 'months').toDate(),
						dateEnd: 		moment().subtract(1, 'days').toDate()
					},
					last : {
						dateStart: 	moment().subtract(1, 'years').subtract(1, 'months').toDate(),
						dateEnd: 		moment().subtract(1, 'years').subtract(1, 'days').toDate()
					}
				};
			}

			vm.dateRange = Global.dateRange;

			vm.keys.pages = [
				{
					label 		: 'Landing Page',
					dimension : 'ga:landingPagePath'
				}, {
					label 		: 'Sessions',
					metrics 	: 'ga:sessions'
				}, {
					label 		: 'Bounce Rate',
					metrics 	: 'ga:bounceRate'
				}, {
					label 		: 'Average Session Duration',
					metrics 	: 'ga:avgSessionDuration'
				}
			];

			vm.keys.compare = [
				{
					label 	: 'Sessions',
					metrics : 'ga:sessions'
				}, {
					label 	: 'Bounce Rate',
					metrics : 'ga:bounceRate'
				}, {
					label 	: 'Avg. Session Duration',
					metrics : 'ga:avgSessionDuration'
				}, {
					label 	: 'Pages / Session',
					metrics : 'ga:pageviewsPerSession'
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
					type:'lineChart',
					margin : { top: 30, right: 60, bottom: 50, left : 70 },
					x: function(d) { return d[0].setFullYear(2016); },
					y: function(d) { return d[1]; },
					xScale : d3.time.scale(),
					xAxis: {
						axisLabel: 'Year',
						rotateLabels: 0,
						tickFormat: function(d) { return moment(d).format('MMM DD'); }
					},
					yAxis: {
						tickFormat: function(d) { return d3.format('.0f')(d); }
					}
				}
			};

			vm.chart.values = [
				{
					key 		: 'Current',
					values 	: [],
					color 	: 'red'
				}, {
					key 		: 'Previous',
					values 	: [],
					color 	: 'blue'
				}
			];

			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}

			if (angular.isUndefined(Global.analytics.organic) || Global.analytics.organic === null ) {
				getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
			}
		}

		function getAllReports (dateRange, viewID, isCompare) {

			$rootScope.loadingProgress = true;
			vm.isLoading = true;

			var tasks = [];
			var query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: '',
				end_date		: '',
				dimensions	: ''
			};

			// sessions for current period
			query.metrics 		= 'ga:sessions';
			query.start_date 	= moment(dateRange.this.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRange.this.dateEnd).format('YYYY-MM-DD');
			query.dimensions 	= 'ga:date';
			
			tasks.push(api.getReport (query));

			// sessions for same period of previous year
			query.start_date 	= moment(dateRange.last.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRange.last.dateEnd).format('YYYY-MM-DD');

			tasks.push(api.getReport(query));

			// for pages table
			query.metrics 		= '';
			query.dimensions 	= '';

			angular.forEach (vm.keys.pages, function (key) {
				if (angular.isDefined (key.metrics)) {
					query.metrics += key.metrics;
					query.metrics += ',';
				}
				if (angular.isDefined (key.dimension)) {
					query.dimensions += key.dimension;
					query.dimensions += ',';
				}
			});

			query.metrics 		= query.metrics.slice(0, -1);
			query.dimensions 	= query.dimensions.slice(0, -1);

			tasks.push(api.getReport(query));

			angular.forEach (vm.keys.compare, function (item) {

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: item.metrics,
					start_date	: moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
					end_date		: moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(api.getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: item.metrics,
					start_date	: moment(dateRange.last.dateStart).format('YYYY-MM-DD'),
					end_date		: moment(dateRange.last.dateEnd).format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(api.getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: item.metrics,
					start_date	: moment(dateRange.this.dateStart).subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
					end_date		: moment(dateRange.this.dateEnd).subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(api.getReport(query));

				query = {
					table_id		: 'ga:' + viewID,
					metrics			: item.metrics,
					start_date	: moment(dateRange.this.dateStart).subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD'),
					end_date		: moment(dateRange.this.dateEnd).subtract(2, 'weeks').endOf('week').format('YYYY-MM-DD'),
					dimensions	: null
				};

				tasks.push(api.getReport(query));
			});

			$q.all(tasks).then (function (response) {
				
				// sessions
				vm.chart.values[0].values = response[0].data;

				// page / session
				vm.chart.values[1].values = response[1].data;

				// for pages table
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
						value : response[3 + 4 * i].data === null ? 0 : +response[3 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_last_year',
						value : response[4 + 4 * i].data === null ? 0 : +response[4 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_this_week',
						value : response[5 + 4 * i].data === null ? 0 : +response[5 + 4 * i].data[0][0]
					});
					vm.values.compare.push ({
						key : vm.keys.compare[i].label + '_last_week',
						value : response[6 + 4 * i].data === null ? 0 : +response[6 + 4 * i].data[0][0]
					});
				}

				$rootScope.loadingProgress = false;
				vm.isLoading = false;

			}, function (error) {
				console.log(error);
				$rootScope.loadingProgress = false;
			});
		}

		function updateOrganicDateRange ($event, showTemplate) {
			$mdDateRangePicker
				.show({targetEvent:$event, model:Global.dateRange.this} )
				.then(function(result){
					if(result) {
						Global.dateRange.this = result;
						Global.dateRange.last = {
							dateStart : moment(Global.dateRange.this.dateStart).subtract(1, 'years').toDate (),
							dateEnd 	: moment(Global.dateRange.this.dateEnd).subtract(1, 'years').toDate ()
						};

						vm.dateRange = Global.dateRange;

						getAllReports (vm.dateRange, Global.currentCampaign.view_ID);
					}
				});
		}

		function onThirtyDays () {
			Global.dateRange = {
				this : {
					dateStart: 	moment().subtract(31, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'days').toDate()
				},
				last : {
					dateStart: 	moment().subtract(1, 'years').subtract(31, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'years').subtract(1, 'days').toDate()
				}
			};
			vm.dateRange = Global.dateRange;
			getAllReports (vm.dateRange, Global.currentCampaign.view_ID);
		}

		function onNinetyDays () {
			Global.dateRange = {
				this : {
					dateStart: 	moment().subtract(91, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'days').toDate()
				},
				last : {
					dateStart: 	moment().subtract(1, 'years').subtract(91, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'years').subtract(1, 'days').toDate()
				}
			};
			vm.dateRange = Global.dateRange;
			getAllReports (vm.dateRange, Global.currentCampaign.view_ID);
		}

		vm.init();
	}
})();