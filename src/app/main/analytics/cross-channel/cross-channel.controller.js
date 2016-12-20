(function() {
	'use strict';

	angular
		.module('app.analytics.crossChannel')
		.controller('CrossChannelController', CrossChannelController);

	CrossChannelController.$inject = ['Global', 'api', '$state'];
	/** @ngInject */
	function CrossChannelController(Global, api, $state) {
		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 			= {};
		vm.values 		= {};
		vm.dateRange 	= {};

		vm.init = function () {

			if ( angular.isUndefined (Global.currentCampaign) || Global.currentCampaign === null ) {
				$state.go('app.campaigns');
				return;
			}

			if (angular.isUndefined(Global.analytics) || Global.analytics === null) {
				Global.analytics = {};
			};

			if ( angular.isUndefined (Global.dateRange) || Global.dateRange === null ) {
				Global.dateRange = {
					dateStart: 	new Date(moment(new Date()).subtract(1, 'months')),
					dateEnd: 		new Date(moment(new Date()))
				};
			}

			vm.dateRange = Global.dateRange;

			if (angular.isUndefined(Global.analytics.channel) || Global.analytics.channel === null) {
				api.getAnalyticsData ('Sessions_Channel', function (response) {
					if (response.code == 0) {
						Global.analytics.channel = response.data;
						vm.values.channel 	= Global.analytics.channel;
						vm.flags.channel = true;
					} else {
						vm.flags.channel = false;
					}
				});
			} else {
				vm.flags.channel = true;
			}

			if (angular.isUndefined(Global.analytics.device) || Global.analytics.device === null) {
				api.getAnalyticsData ('Sessions_Device', function (response) {
					if (response.code == 0) {
						Global.analytics.device = response.data;
						vm.values.device 	= Global.analytics.device;
						vm.flags.device = true;
					} else {
						vm.flags.device = false;
					}
				});
			} else {
				vm.flags.device = true;
			}

			vm.options = {
				channel: {
					chart: {
						type							: 'pieChart',
						x: function (d) { return d[0]; },
						y: function (d) { return d[1]; },
						showLabels 				: true,
						transitionDuration: 500,
						labelThreshold    : 0.01
					}
				},
				device: {
					chart: {
						type							: 'pieChart',
						x: function (d) { return d[0]; },
						y: function (d) { return d[1]; },
						showLabels				: true,
						transitionDuration: 500,
						labelThreshold    : 0.01
					}
				}
			};
			vm.values = { 
				channel: Global.analytics.channel,
				device : Global.analytics.device
			};
		}

		vm.init();
	}
})();