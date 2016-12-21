(function() {
	'use strict';

	angular
		.module('app.analytics.crossChannel')
		.controller('CrossChannelController', CrossChannelController);

	CrossChannelController.$inject = ['Global', 'api', '$state', '$mdDateRangePicker', 'moment', '$rootScope', '$q'];
	/** @ngInject */
	function CrossChannelController(Global, api, $state, $mdDateRangePicker, moment, $rootScope, $q) {
		
		var vm = this;

		// variables
		vm.options 		= {};
		vm.flags 			= {};
		vm.values 		= {};
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

			vm.options = {
				pieChart: {
					chart: {
						type							: 'pieChart',
						x: function (d) { return d[0]; },
						y: function (d) { return d[1]; },
						showLabels 				: true,
						transitionDuration: 500,
						labelThreshold    : 0.01,
						labelType					: 'percent',
						labelsOutside			: true
					}
				}
			};

			if (angular.isUndefined (Global.analytics.cross_channel) || Global.analytics.cross_channel === null) {
				Global.analytics.cross_channel = {};

				getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
			} else {
				vm.values = { 
					channel 		: Global.analytics.cross_channel.channel,
					device 			: Global.analytics.cross_channel.device,
					source 			: Global.analytics.cross_channel.source,
					landingPage : Global.analytics.cross_channel.landingPage
				};
			}
		}

		function getAllReports (dateRange, viewID, isCompare) {

			$rootScope.loadingProgress = true;

			var tasks = [];
			var query = {};

			// sessions by channel
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:channelGrouping'
			};

			tasks.push(Global.getReport(query));

			// sessions by device
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:deviceCategory'
			};

			tasks.push(Global.getReport(query));

			// sessions by source
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:source'
			};

			tasks.push(Global.getReport(query));

			// sessions by Landing Page
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:landingPagePath'
			};

			tasks.push(Global.getReport(query));

			$q.all(tasks).then (function (response) {
				// sessions by channel
				Global.analytics.cross_channel.channel 			= response[0].data;
				// sessions by device
				Global.analytics.cross_channel.device 			= response[1].data;
				// sessions by source
				Global.analytics.cross_channel.source 			= response[2].data;
				// sessions by Landing Page
				Global.analytics.cross_channel.landingPage 	= response[3].data;

				vm.values = { 
					channel 		: Global.analytics.cross_channel.channel,
					device 			: Global.analytics.cross_channel.device,
					source 			: Global.analytics.cross_channel.source,
					landingPage : Global.analytics.cross_channel.landingPage
				};

				$rootScope.loadingProgress = false;
			}, function (error) {
				console.log(error);
				$rootScope.loadingProgress = false;
			});

			
		}

		function updateOrganicDateRange ($event, showTemplate) {
			$mdDateRangePicker
				.show({targetEvent:$event, model:Global.dateRange} )
				.then(function(result){
					if(result) {
						Global.dateRange 	= result;
						vm.dateRange 			= Global.dateRange;
						getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
					}
				});
		}

		function onThirtyDays () {
			Global.dateRange = {
				dateStart: 	new Date(moment(new Date()).subtract(30, 'days')),
				dateEnd: 		new Date(moment(new Date()))
			};
			vm.dateRange = Global.dateRange;
			getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
		}

		function onNinetyDays () {
			Global.dateRange = {
				dateStart: 	new Date(moment(new Date()).subtract(90, 'days')),
				dateEnd: 		new Date(moment(new Date()))
			};
			vm.dateRange = Global.dateRange;
			getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
		}

		vm.init();
	}
})();