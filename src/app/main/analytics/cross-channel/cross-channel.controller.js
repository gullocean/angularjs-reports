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
		vm.keys  			= {};
		vm.style			= {};

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
					this : {
						dateStart: 	moment().subtract(1, 'months').toDate(),
						dateEnd: 		moment().toDate()
					},
					last : {
						dateStart: 	moment().subtract(1, 'years').subtract(1, 'months').toDate(),
						dateEnd: 		moment().subtract(1, 'years').toDate()
					}
				};
			}

			vm.keys.sessionsDevice = [
				{
					label 		: 'Device',
					dimension : 'ga:deviceCategory'
				}, {
					label 		: 'Organic Sessions',
					metrics 	: 'ga:sessions',
					filter		: 'text'
				}, {
					label 		: 'New Users',
					metrics 	: 'ga:newUsers',
					filter		: 'text'
				}, {
					label 		: '% New Sessions',
					metrics 	: 'ga:percentNewSessions',
					filter		: 'percent'
				}, {
					label 		: 'Bounce Rate',
					metrics 	: 'ga:bounceRate',
					filter		: 'percent'
				}, {
					label 		: 'Avg. Session Duration',
					metrics 	: 'ga:avgSessionDuration',
					filter		: 'time'
				}, {
					label 		: 'Goal Completions',
					metrics 	: 'ga:goalCompletionsAll',
					filter		: 'number'
				}, {
					label 		: 'Goal Conversion Rate',
					metrics 	: 'ga:goalConversionRateAll',
					filter		: 'percent'
				}, {
					label 		: 'Pageviews Per Session',
					metrics 	: 'ga:pageviewsPerSession',
					filter		: 'number'
				}
			];

			vm.style.tableDevice = {
				'width'			: 100/( vm.keys.sessionsDevice.length + 0.5) + '%',
				'min-width'	: 100/( vm.keys.sessionsDevice.length + 0.5) + '%',
				'max-width'	: 100/( vm.keys.sessionsDevice.length + 0.5) + '%',
			};

			vm.dateRange = Global.dateRange;

			vm.options = {
				pieChart: {
					chart: {
						type							: 'pieChart',
						x									: function (d) { return d[0]; },
						y 								: function (d) { return d[1]; },
						showLabels 				: true,
						transitionDuration: 500,
						labelType					: 'percent',
						labelsOutside			: true,
						valueFormat				: function (d) { return +d; }
					}
				}
			};

			getAllReports (Global.dateRange, Global.currentCampaign.view_ID);
		}

		function getAllReports (dateRange, viewID, isCompare) {

			$rootScope.loadingProgress = true;

			Global.analytics.cross_channel = {};

			var tasks = [];
			var query = {};

			// sessions by channel
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:channelGrouping'
			};

			tasks.push(api.getReport(query));

			// sessions by device
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:deviceCategory'
			};

			tasks.push(api.getReport(query));

			// sessions by source
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:source'
			};

			tasks.push(api.getReport(query));

			// sessions by Landing Page
			query = {
				table_id		: 'ga:' + viewID,
				metrics			: 'ga:sessions',
				start_date	: moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
				end_date		: moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
				dimensions	: 'ga:landingPagePath'
			};

			tasks.push(api.getReport(query));

			// sessions by devices
			query.metrics 		= '';
			query.dimensions 	= '';

			query.start_date 	= moment(dateRange.this.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRange.this.dateEnd).format('YYYY-MM-DD');

			angular.forEach (vm.keys.sessionsDevice, function (key) {
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

			// sessions by devices
			query.start_date 	= moment(dateRange.last.dateStart).format('YYYY-MM-DD');
			query.end_date 		= moment(dateRange.last.dateEnd).format('YYYY-MM-DD');

			tasks.push(api.getReport(query));

			$q.all(tasks).then (function (response) {

				// sessions by channel
				Global.analytics.cross_channel.channel 			= response[0].data;
				// sessions by device
				Global.analytics.cross_channel.device 			= response[1].data;
				// sessions by source
				Global.analytics.cross_channel.source 			= response[2].data;
				// sessions by Landing Page
				Global.analytics.cross_channel.landingPage 	= response[3].data;
				// sessions by device for tabel : this year
				Global.analytics.cross_channel.tableSessionDeviceThis 	= response[4].data;
				// sessions by device for tabel : last year
				Global.analytics.cross_channel.tableSessionDeviceLast 	= response[5].data;

				vm.values = { 
					channel 		: Global.analytics.cross_channel.channel,
					device 			: Global.analytics.cross_channel.device,
					source 			: Global.analytics.cross_channel.source,
					landingPage : Global.analytics.cross_channel.landingPage,
					tableSessionDeviceThis : Global.analytics.cross_channel.tableSessionDeviceThis,
					tableSessionDeviceLast : Global.analytics.cross_channel.tableSessionDeviceLast
				};

				$rootScope.loadingProgress = false;
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
					dateStart: 	moment().subtract(30, 'days').toDate(),
					dateEnd: 		moment().toDate()
				},
				last : {
					dateStart: 	moment().subtract(1, 'years').subtract(30, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'years').toDate()
				}
			};
			vm.dateRange = Global.dateRange;
			getAllReports (vm.dateRange, Global.currentCampaign.view_ID);
		}

		function onNinetyDays () {
			Global.dateRange = {
				this : {
					dateStart: 	moment().subtract(90, 'days').toDate(),
					dateEnd: 		moment().toDate()
				},
				last : {
					dateStart: 	moment().subtract(1, 'years').subtract(90, 'days').toDate(),
					dateEnd: 		moment().subtract(1, 'years').toDate()
				}
			};
			vm.dateRange = Global.dateRange;
			getAllReports (vm.dateRange, Global.currentCampaign.view_ID);
		}

		vm.init();
	}
})();