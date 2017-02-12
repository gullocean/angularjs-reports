(function() {
	'use strict';

	angular
		.module('app.analytics.paidMedia')
		.controller('PaidMediaController', PaidMediaController);

	PaidMediaController.$inject = ['Global', 'api', 'moment', '$q', '$state', '$rootScope'];
	/** @ngInject */
	function PaidMediaController(Global, api, moment, $q, $state, $rootScope) {

		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 	 		= {};
		vm.values  		= {};
		vm.keys		 		= {};
		vm.indices 		= {};
		vm.messages 	= {};
		vm.dateRanges	= {};
		vm.selectedCampaign = {};

		// methods
		vm.onThirtyDays	= onThirtyDays;
		vm.onSixtyDays	= onSixtyDays;
		vm.onNinetyDays = onNinetyDays;
		vm.sum 					= Global.sum;

		function init () {

			if ( Global.check( 'selectedCampaign' ) ) {
				vm.selectedCampaign = Global.get( 'selectedCampaign' );
			} else {
				$state.go('app.campaigns');
				return;
			}

			vm.dateRanges.table = {
				thisMonth : {
					dateStart : moment().startOf('month').toDate(),
					dateEnd		: moment().endOf('month').toDate()
				},
				lastMonth : {
					dateStart : moment().subtract(1, 'months').startOf('month').toDate(),
					dateEnd		: moment().subtract(1, 'months').endOf('month').toDate()
				}
			};

			vm.dateRanges.chart = {
				dateStart 	: moment ().subtract (30, 'days').toDate (),
				dateEnd 		: moment ().toDate ()
			};

			vm.dateRanges.box = {
				last : {
					dateStart 	: moment ().subtract (30, 'days').toDate (),
					dateEnd 		: moment ().toDate ()
				},
				prev : {
					dateStart 	: moment ().subtract (60, 'days').toDate (),
					dateEnd 		: moment ().subtract (31, 'days').toDate ()
				}
			};

			vm.indices = {
				tableThis : null,
				tableLast : null,

				boxLast 	: null,
				boxPrev 	: null
			}

			vm.options = { 
				table 		: {
					dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		      pagingType: 'simple',
		      autoWidth: false,
		      responsive: true
		    },
		    lineChart : {
		    	chart : {
		    		type 				: 'lineChart',
		    		color 			: ['#03A9F4'],
		    		height			: 40,
		    		margin			: { top: 4, right: 4, bottom: 4, left: 4 },
		    		isArea			: true,
		    		interpolate	: 'cardinal',
		    		clipEdge		: true,
		    		duration		: 500,
		    		showXAxis		: false,
		    		showYAxis		: false,
		    		showLegend	: false,
		    		x 					: function(d) { return moment (d[0]).toDate (); },
		    		y 					: function(d) { return Math.round (d[1] * 100) / 100 ; },
		    		xAxis 			: {},
		    		tooltip			: {
		    			headerFormatter : function (d) { return moment (d).format ('MMM DD YYYY'); },
		    			keyFormatter 		: function (d) { return null; }
		    		}
		    	}
		    }
			};

			vm.keys.table = [
				{
					label 		: 'Campaign',
					metrics 	: null,
					dimension	: 'ga:campaign',
					filter		: 'text',
					index 		: null
				}, {
					label 		: 'Clicks',
					metrics		: 'ga:adClicks',
					filter		: 'text',
					index 		: null,
					dimension : null
				}, {
					label			: 'Cost',
					metrics 	: 'ga:adCost',
					filter		: 'currency',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Clickthrough rate',
					metrics 	: 'ga:CTR',
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}, {
					label			: 'Cost per click',
					metrics 	: 'ga:CPC',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}, {
					label			: 'Revenue',
					metrics 	: 'ga:transactionRevenue',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}, {
					label			: 'Goal Completions',
					metrics 	: 'ga:goalCompletionsAll',
					filter 		: 'text',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Conversion Rate',
					metrics 	: 'ga:goalConversionRateAll',
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Cost per Goal Conversion',
					metrics 	: 'ga:costPerGoalConversion',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}, {
					label			: 'ROI',
					metrics 	: null,
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}
			];

			vm.keys.chart = [
				{
					label 		: 'CTR (%)',
					metrics 	: 'ga:CTR',
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}, {
					label 		: 'CPC ($)',
					metrics 	: 'ga:CPC',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Cost / Conv. ($)',
					metrics 	: 'ga:adCost, ga:goalCompletionsAll',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}/*, {
					label 		: 'Conversions / Goal Completions',
					metrics 	: 'ga:costPerGoalConversion',
					filter 		: 'number',
					index 		: null,
					dimension : null
				}*/, {
					label 		: 'Conversions (#)',
					metrics 	: 'ga:costPerGoalConversion',
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Conv. Rate (%)',
					metrics 	: 'ga:goalConversionRateAll',
					filter 		: 'percent',
					index 		: null,
					dimension : null
				}, {
					label 		: 'Revenue ($)',
					metrics 	: 'ga:transactionRevenue',
					filter 		: 'currency',
					index 		: null,
					dimension : null
				}
			];

			vm.keys.box = [
				{
					label 		: 'Cost',
					metrics 	: 'ga:adCost',
					filter 		: 'currency',
					indexLast	: null,
					indexPrev	: null
				}, {
					label 		: 'Conversions',
					metrics 	: 'ga:costPerGoalConversion',
					filter 		: 'number',
					indexLast	: null,
					indexPrev	: null
				}, {
					label 		: 'Cost / Goal Completion',
					metrics 	: 'ga:adCost, ga:goalCompletionsAll',
					filter 		: 'currency',
					indexLast	: null,
					indexPrev	: null
				}, {
					label 		: 'Conversion Rate',
					metrics 	: 'ga:goalConversionRateAll',
					filter 		: 'percent',
					indexLast	: null,
					indexPrev	: null
				}, {
					label 		: 'CTR',
					metrics 	: 'ga:CTR',
					filter 		: 'percent',
					indexLast	: null,
					indexPrev	: null
				}, {
					label 		: 'CPC',
					metrics 	: 'ga:CPC',
					filter 		: 'currency',
					indexLast	: null,
					indexPrev	: null
				}
			];

			getAllReports (vm.dateRanges, vm.selectedCampaign.view_ID);

		};

		function onThirtyDays () {
			vm.dateRanges.chart = {
				dateStart 	: moment ().subtract (30, 'days').toDate (),
				dateEnd 		: moment ().toDate ()
			};
			getChartReports (vm.dateRanges.chart, vm.selectedCampaign.view_ID);
		}

		function onSixtyDays () {
			vm.dateRanges.chart = {
				dateStart 	: moment ().subtract (60, 'days').toDate (),
				dateEnd 		: moment ().toDate ()
			};
			getChartReports (vm.dateRanges.chart, vm.selectedCampaign.view_ID);
		}
		
		function onNinetyDays () {
			vm.dateRanges.chart = {
				dateStart 	: moment ().subtract (90, 'days').toDate (),
				dateEnd 		: moment ().toDate ()
			};
			getChartReports (vm.dateRanges.chart, vm.selectedCampaign.view_ID);
		}

		function getChartReports (dateRange, viewID) {
			$rootScope.loadingProgress = true;

			var tasks = [];

			var query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:date'
			};

			angular.forEach (vm.keys.chart, function (key, index) {
				query.metrics 							= key.metrics;
				vm.keys.chart[index].index 	= tasks.push (api.getReport (query)) - 1;
			});
			
			$q.all(tasks).then (function (response) {
				
				// chart
				vm.values.charts = [];
				angular.forEach (vm.keys.chart, function (key, index) {
					vm.values.charts.push ([{
						key 		: key.label,
						values 	: response [key.index].data
					}]);
				});

				vm.options.lineChart.chart.xAxis.domain = d3.extent(vm.values.charts[0][0].values, function (d) { return d[0]; });

				$rootScope.loadingProgress = false;
			}, function (error) {
				$rootScope.loadingProgress = false;
				console.log('paid media error', error);
			});
		}

		function getAllReports (dateRanges, viewID) {

			$rootScope.loadingProgress = true;

			var tasks = [];
			var query = {};

			// for this month
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: moment(dateRanges.table.thisMonth.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRanges.table.thisMonth.dateEnd).format('YYYY-MM-DD'),
				dimensions	: ''
			};

			var indexMetrics = 0;

			angular.forEach (vm.keys.table, function (key, index) {
				if (key.metrics != null) {
					query.metrics += key.metrics;
					query.metrics += ',';
					vm.keys.table[index].index = indexMetrics ++;
				}
				if (key.dimension != null) {
					query.dimensions += key.dimension;
					query.dimensions += ',';
					vm.keys.table[index].index = indexMetrics ++;
				}
			});

			query.metrics 		= query.metrics.slice(0, -1);
			query.dimensions 	= query.dimensions.slice(0, -1);

			vm.indices.tableThis = tasks.push (api.getReport (query)) - 1;

			// for last month
			query.start_date 	= moment(dateRanges.table.lastMonth.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRanges.table.lastMonth.dateEnd).format('YYYY-MM-DD');

			vm.indices.tableLast = tasks.push (api.getReport (query)) - 1;

			// for charts
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: moment(dateRanges.chart.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRanges.chart.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:date'
			};

			angular.forEach (vm.keys.chart, function (key, index) {
				query.metrics 							= key.metrics;
				vm.keys.chart[index].index 	= tasks.push (api.getReport (query)) - 1;
			});

			// for box
			// last
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: moment(dateRanges.box.last.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRanges.box.last.dateEnd).format('YYYY-MM-DD'),
				dimensions	: ''
			};

			angular.forEach (vm.keys.chart, function (key, index) {
				if (key.metrics != null) {
					query.metrics += key.metrics;
					query.metrics += ',';
				}
			});

			query.metrics 			= query.metrics.slice(0, -1);
			vm.indices.boxLast 	= tasks.push (api.getReport (query)) - 1;

			// prev
			query.start_date 		= moment(dateRanges.box.prev.dateStart).format('YYYY-MM-DD');
			query.end_date 			= moment(dateRanges.box.prev.dateEnd).format('YYYY-MM-DD');
			vm.indices.boxPrev 	= tasks.push (api.getReport (query)) - 1;
			
			$q.all(tasks).then (function (response) {
				
				vm.values.tableThis = response[vm.indices.tableThis].data;
				vm.values.tableLast = response[vm.indices.tableLast].data;

				angular.forEach (vm.values.tableThis, function(value, index) {
					var revenue = {}, cost = {}, roi = {};
					for (var i = 0; i < vm.keys.table.length; i ++) {
						if (vm.keys.table[i].label == 'Revenue') {
							revenue.this = +vm.values.tableThis[index][vm.keys.table[i].index];
							revenue.last = +vm.values.tableLast[index][vm.keys.table[i].index];
						}
						if (vm.keys.table[i].label == 'Cost') {
							cost.this = +vm.values.tableThis[index][vm.keys.table[i].index];
							cost.last = +vm.values.tableLast[index][vm.keys.table[i].index];
						}
					}

					roi.this = cost.this == 0 ? 0 : (revenue.this - cost.this) / cost.this;
					roi.last = cost.last == 0 ? 0 : (revenue.last - cost.last) / cost.last;

					vm.keys.table[vm.keys.table.length - 1].index = vm.values.tableThis[index].push(roi.this) - 1;
					vm.keys.table[vm.keys.table.length - 1].index = vm.values.tableLast[index].push(roi.last) - 1;
				});

				// chart
				vm.values.charts = [];
				angular.forEach (vm.keys.chart, function (key, index) {
					vm.values.charts.push ([{
						key 		: key.label,
						values 	: response [key.index].data
					}]);
				});
				vm.options.lineChart.chart.xAxis.domain = d3.extent(vm.values.charts[0][0].values, function (d) { return d[0]; });

				// box
				vm.values.box = {
					last : response[vm.indices.boxLast].data[0],
					prev : response[vm.indices.boxPrev].data[0]
				};

				$rootScope.loadingProgress = false;
			}, function (error) {
				$rootScope.loadingProgress = false;
				console.log('paid media error', error);
			});
		}

		init ();
	}
})();