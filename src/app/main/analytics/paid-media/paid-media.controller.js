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

		// methods

		function init () {

			if ( angular.isUndefined (Global.currentCampaign) || Global.currentCampaign === null ) {
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

			vm.indices = {
				tableThis : null,
				tableLast : null
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
		    		x 					: function(d) { return d[0]; },
		    		y 					: function(d) { return d[1]; }
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

			getAllReports (vm.dateRanges.table, Global.currentCampaign.view_ID);

			// PPC table
			// if (angular.isUndefined(Global.analytics.PPC) || Global.analytics.PPC === null) {
			// 	api.getAnalyticsData ('PPC_Campaign', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC = response.data;
			// 			vm.values.PPC 	= Global.analytics.PPC;
			// 			vm.flags.PPC = true;
			// 		} else {
			// 			vm.flags.PPC = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC 	= Global.analytics.PPC;
			// 	vm.flags.PPC = true;
			// }

			// charts
			// if (angular.isUndefined(Global.analytics.PPC_CTR) || Global.analytics.PPC_CTR === null) {
			// 	api.getAnalyticsData ('PPC_CTR', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_CTR = response.data;
			// 			vm.values.PPC_CTR 	= Global.analytics.PPC_CTR;
			// 			vm.flags.PPC_CTR = true;
			// 		} else {
			// 			vm.flags.PPC_CTR = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_CTR 	= Global.analytics.PPC_CTR;
			// 	vm.flags.PPC_CTR = true;
			// }

			// if (angular.isUndefined(Global.analytics.PPC_CPC) || Global.analytics.PPC_CPC === null) {
			// 	api.getAnalyticsData ('PPC_CPC', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_CPC = response.data;
			// 			vm.values.PPC_CPC 	= Global.analytics.PPC_CPC;
			// 			vm.flags.PPC_CPC = true;
			// 		} else {
			// 			vm.flags.PPC_CPC = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_CPC 	= Global.analytics.PPC_CPC;
			// 	vm.flags.PPC_CPC = true;
			// }

			// box
			// if (angular.isUndefined(Global.analytics.PPC_Conversion_Rate) || Global.analytics.PPC_Conversion_Rate === null) {
			// 	api.getAnalyticsData ('PPC_Conversion_Rate', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_Conversion_Rate = response.data;
			// 			vm.values.PPC_Conversion_Rate 	= Global.analytics.PPC_Conversion_Rate;
			// 			vm.flags.PPC_Conversion_Rate = true;
			// 		} else {
			// 			vm.messages.PPC_Conversion_Rate = response.message;
			// 			vm.flags.PPC_Conversion_Rate = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_Conversion_Rate 	= Global.analytics.PPC_Conversion_Rate;
			// 	vm.flags.PPC_Conversion_Rate = true;
			// }

			// if (angular.isUndefined(Global.analytics.PPC_Cost) || Global.analytics.PPC_Cost === null) {
			// 	api.getAnalyticsData ('PPC_Cost', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_Cost = response.data;
			// 			vm.values.PPC_Cost 	= Global.analytics.PPC_Cost;
			// 			vm.flags.PPC_Cost = true;
			// 		} else {
			// 			vm.messages.PPC_Cost = response.message;
			// 			vm.flags.PPC_Cost = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_Cost 	= Global.analytics.PPC_Cost;
			// 	vm.flags.PPC_Cost = true;
			// }

			// if (angular.isUndefined(Global.analytics.PPC_Conversions) || Global.analytics.PPC_Conversions === null) {
			// 	api.getAnalyticsData ('PPC_Conversions', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_Conversions = response.data;
			// 			vm.values.PPC_Conversions 	= Global.analytics.PPC_Conversions;
			// 			vm.flags.PPC_Conversions = true;
			// 		} else {
			// 			vm.messages.PPC_Conversions = response.message;
			// 			vm.flags.PPC_Conversions = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_Conversions 	= Global.analytics.PPC_Conversions;
			// 	vm.flags.PPC_Conversions = true;
			// }

			// if (angular.isUndefined(Global.analytics.PPC_CPA_Box) || Global.analytics.PPC_CPA_Box === null) {
			// 	api.getAnalyticsData ('PPC_CPA_Box', function (response) {
			// 		if (response.code == 0) {
			// 			Global.analytics.PPC_CPA_Box = response.data;
			// 			vm.values.PPC_CPA_Box 	= Global.analytics.PPC_CPA_Box;
			// 			vm.flags.PPC_CPA_Box = true;
			// 		} else {
			// 			vm.messages.PPC_CPA_Box = response.message;
			// 			vm.flags.PPC_CPA_Box = false;
			// 		}
			// 	});
			// } else {
			// 	vm.values.PPC_CPA_Box 	= Global.analytics.PPC_CPA_Box;
			// 	vm.flags.PPC_CPA_Box = true;
			// }

			
		};

		vm.GetSum = function (data) {
			if (angular.isUndefined(data) || data === null) return null;
			var sum = 0;
			angular.forEach(data, function(d) {
				sum += +d[1];
			});
			return sum;
		}

		function getAllReports (dateRanges, viewID) {

			$rootScope.loadingProgress = true;

			var tasks = [];
			var query = {};

			// for this month
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: '',
				start_date	: moment(dateRanges.thisMonth.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRanges.thisMonth.dateEnd).format('YYYY-MM-DD'),
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

			vm.indices.tableThis = tasks.push (Global.getReport (query)) - 1;

			// for last month
			query.start_date 	= moment(dateRanges.lastMonth.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRanges.lastMonth.dateEnd).format('YYYY-MM-DD');

			vm.indices.tableLast = tasks.push (Global.getReport (query)) - 1;
			
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

				console.log(vm.values);

				$rootScope.loadingProgress = false;
			}, function (error) {
				$rootScope.loadingProgress = false;
				console.log('paid media error', error);
			});
		}

		init ();
	}
})();