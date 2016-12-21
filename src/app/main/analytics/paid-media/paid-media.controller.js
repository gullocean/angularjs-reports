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
		vm.messages 	= {};
		vm.dateRanges	= {};

		// methods

		function init () {

			if ( angular.isUndefined (Global.currentCampaign) || Global.currentCampaign === null ) {
				$state.go('app.campaigns');
				return;
			}

			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
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

			vm.options = { 
				PPC: {
					dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		      pagingType: 'simple',
		      autoWidth: false,
		      responsive: true
		    },
		    PPC_CTR: {
		    	chart: {
		    		type: 'lineChart',
		    		color: ['#03A9F4'],
		    		height: 40,
		    		margin: { top: 4, right: 4, bottom: 4, left: 4 },
		    		isArea: true,
		    		interpolate: 'cardinal',
		    		clipEdge: true,
		    		duration: 500,
		    		showXAxis: false,
		    		showYAxis: false,
		    		showLegend: false,
		    		x: function(d) { return d[0]; },
		    		y: function(d) { return d[1]; }
		    	}
		    },
		    PPC_CPC: {
		    	chart: {
		    		type: 'lineChart',
		    		x: function(d) { return d[0]; },
		    		y: function(d) { return d[1]; },
		    		color: ['#03A9F4'],
		    		height: 40,
		    		margin: { top: 4, right: 4, bottom: 4, left: 4 },
		    		isArea: true,
		    		interpolate: 'cardinal',
		    		clipEdge: true,
		    		duration: 500,
		    		showXAxis: false,
		    		showYAxis: false,
		    		showLegend: false
		    	}
		    }
			};

			vm.keys = {
				PPC: ['Campaign', 'Clicks', 'Cost', 'Clickthrough rate', 'Cost per click', 'Revenue', 'Goal Completions', 'Conversion Rate', 'Cost/Goalcompletion', 'ROI']
			};

			vm.keys.table = [
				{
					label 	: 'Clicks',
					metrics	: 'ga:adClicks'
				}, {
					label		: 'Cost',
					metrics : 'ga:adCost'
				}, {
					label 	: 'Clickthrough rate',
					metrics : 'ga:CTR'
				}, {
					label		: 'Cost per click',
					metrics : 'ga:CPC'
				}, {
					label		: 'Revenue',
					metrics : 'ga:transactionRevenue'
				}, {
					label		: 'Goal Completions',
					metrics : 'ga:goalCompletionsAll'
				}, {
					label 	: 'Conversion Rate',
					metrics : 'ga:goalConversionRateAll'
				}, {
					label 	: 'Cost per Goal Conversion',
					metrics : 'ga:costPerGoalConversion'
				}/*, {
					label		: 'ROI',
					metrics : null
				}*/
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
				metrics			: 'ga:adClicks, ga:adCost, ga:CTR, ga:CPC, ga:transactionRevenue, ga:goalCompletionsAll, ga:goalConversionRateAll, ga:costPerGoalConversion',
				start_date	: moment(dateRanges.thisMonth.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRanges.thisMonth.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:campaign'
			};

			tasks.push (Global.getReport (query));

			// angular.forEach (vm.keys.table, function (d) {
			// 	query.metrics = d.metrics;
			// 	tasks.push (Global.getReport (query));
			// });

			// for last month
			query.start_date = moment(dateRanges.lastMonth.dateStart).format('YYYY-MM-DD');
			query.end_date = moment(dateRanges.lastMonth.dateEnd).format('YYYY-MM-DD');

			tasks.push (Global.getReport (query));

			// angular.forEach (vm.keys.table, function (d) {
			// 	query.metrics = d.metrics;
			// 	tasks.push (Global.getReport (query));
			// });
			
			$q.all(tasks).then (function (response) {
				$rootScope.loadingProgress = false;
				console.log('paid media response', response);
			}, function (error) {
				$rootScope.loadingProgress = false;
				console.log('paid media error', error);
			});
		}

		init ();
	}
})();