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
		vm.messages = {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			}

			// PPC table
			if (angular.isUndefined(Global.analytics.PPC) || Global.analytics.PPC === null) {
				api.getAnalyticsData ('PPC_Campaign', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC = response.data;
						vm.values.PPC 	= Global.analytics.PPC;
						vm.flags.PPC = true;
					} else {
						vm.flags.PPC = false;
					}
				});
			} else {
				vm.values.PPC 	= Global.analytics.PPC;
				vm.flags.PPC = true;
			}

			// charts
			if (angular.isUndefined(Global.analytics.PPC_CTR) || Global.analytics.PPC_CTR === null) {
				api.getAnalyticsData ('PPC_CTR', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_CTR = response.data;
						vm.values.PPC_CTR 	= Global.analytics.PPC_CTR;
						vm.flags.PPC_CTR = true;
					} else {
						vm.flags.PPC_CTR = false;
					}
				});
			} else {
				vm.values.PPC_CTR 	= Global.analytics.PPC_CTR;
				vm.flags.PPC_CTR = true;
			}

			if (angular.isUndefined(Global.analytics.PPC_CPC) || Global.analytics.PPC_CPC === null) {
				api.getAnalyticsData ('PPC_CPC', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_CPC = response.data;
						vm.values.PPC_CPC 	= Global.analytics.PPC_CPC;
						vm.flags.PPC_CPC = true;
					} else {
						vm.flags.PPC_CPC = false;
					}
				});
			} else {
				vm.values.PPC_CPC 	= Global.analytics.PPC_CPC;
				vm.flags.PPC_CPC = true;
			}

			// box
			if (angular.isUndefined(Global.analytics.PPC_Conversion_Rate) || Global.analytics.PPC_Conversion_Rate === null) {
				api.getAnalyticsData ('PPC_Conversion_Rate', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_Conversion_Rate = response.data;
						vm.values.PPC_Conversion_Rate 	= Global.analytics.PPC_Conversion_Rate;
						vm.flags.PPC_Conversion_Rate = true;
					} else {
						vm.messages.PPC_Conversion_Rate = response.message;
						vm.flags.PPC_Conversion_Rate = false;
					}
				});
			} else {
				vm.values.PPC_Conversion_Rate 	= Global.analytics.PPC_Conversion_Rate;
				vm.flags.PPC_Conversion_Rate = true;
			}

			if (angular.isUndefined(Global.analytics.PPC_Cost) || Global.analytics.PPC_Cost === null) {
				api.getAnalyticsData ('PPC_Cost', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_Cost = response.data;
						vm.values.PPC_Cost 	= Global.analytics.PPC_Cost;
						vm.flags.PPC_Cost = true;
					} else {
						vm.messages.PPC_Cost = response.message;
						vm.flags.PPC_Cost = false;
					}
				});
			} else {
				vm.values.PPC_Cost 	= Global.analytics.PPC_Cost;
				vm.flags.PPC_Cost = true;
			}

			if (angular.isUndefined(Global.analytics.PPC_Conversions) || Global.analytics.PPC_Conversions === null) {
				api.getAnalyticsData ('PPC_Conversions', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_Conversions = response.data;
						vm.values.PPC_Conversions 	= Global.analytics.PPC_Conversions;
						vm.flags.PPC_Conversions = true;
					} else {
						vm.messages.PPC_Conversions = response.message;
						vm.flags.PPC_Conversions = false;
					}
				});
			} else {
				vm.values.PPC_Conversions 	= Global.analytics.PPC_Conversions;
				vm.flags.PPC_Conversions = true;
			}

			if (angular.isUndefined(Global.analytics.PPC_CPA_Box) || Global.analytics.PPC_CPA_Box === null) {
				api.getAnalyticsData ('PPC_CPA_Box', function (response) {
					if (response.code == 0) {
						Global.analytics.PPC_CPA_Box = response.data;
						vm.values.PPC_CPA_Box 	= Global.analytics.PPC_CPA_Box;
						vm.flags.PPC_CPA_Box = true;
					} else {
						vm.messages.PPC_CPA_Box = response.message;
						vm.flags.PPC_CPA_Box = false;
					}
				});
			} else {
				vm.values.PPC_CPA_Box 	= Global.analytics.PPC_CPA_Box;
				vm.flags.PPC_CPA_Box = true;
			}

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
				PPC: ['Campaign', 'Clicks', 'Cost', 'CTR', 'CPC', 'Revenue', 'Goal Completions', 'Conversion Rate']
			};
		};

		vm.GetSum = function (data) {
			if (angular.isUndefined(data) || data === null) return null;
			var sum = 0;
			angular.forEach(data, function(d) {
				sum += +d[1];
			});
			return sum;
		}

		vm.init ();
	}
})();