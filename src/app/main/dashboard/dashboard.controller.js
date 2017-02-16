(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['Global', '$rootScope', '$mdDateRangePicker', 'moment', '$q', '$state', 'api', 'ROLE'];

  /** @ngInject */
  function DashboardController(Global, $rootScope, $mdDateRangePicker, moment, $q, $state, api, ROLE) {
    
    var vm = this;

    // variables
    vm.dateRange  = {};
    vm.isCompare  = true;
    vm.keys = {};
    vm.isLoading = true;
    vm.selectedCampaign = {};

    // methods
    vm.onThirtyDays     = onThirtyDays;
    vm.onNinetyDays     = onNinetyDays;
    vm.updateDateRange  = updateDateRange;

    function init() {
      if ( !Global.check( 'currentUser' ) ) {
        $state.go('app.login');
        return;
      }

      vm.keys.compare = [
        {
          label   : 'Sessions',
          metrics : 'ga:sessions',
          filter  : 'string'
        }, {
          label   : 'Bounce Rate',
          metrics : 'ga:bounceRate',
          filter  : 'percent'
        }, {
          label   : 'Avg. Session Duration',
          metrics : 'ga:avgSessionDuration',
          filter  : 'time'
        }, {
          label   : 'Pages / Session',
          metrics : 'ga:pageviewsPerSession',
          filter  : 'number'
        }
      ];

      vm.options = {
        pieChart: {
          chart: {
            type              : 'pieChart',
            x                 : function (d) { return d[0]; },
            y                 : function (d) { return d[1]; },
            showLabels        : true,
            transitionDuration: 500,
            labelType         : 'percent',
            labelsOutside     : true,
            valueFormat       : function (d) { return +d; }
          }
        }
      };

      vm.currentUser = Global.get( 'currentUser' );

      if ( isClient() ) {
        api.getCampaigns( vm.currentUser.campaignID, function( response ) {
          if ( response.code === 0 ) {
            vm.selectedCampaign = response.data;
            Global.selectedCampaign = vm.selectedCampaign;
            Global.set( 'selectedCampaign', vm.selectedCampaign);
          } else {
            console.log( 'campaigns getting error!' );
          }
        });
      } else {
        if ( Global.check( 'selectedCampaign' ) ) {
          vm.selectedCampaign = Global.get( 'selectedCampaign' );
          Global.selectedCampaign = vm.selectedCampaign;
        } else {
          $state.go('app.campaigns');
          return;
        }
      }

      if ( Global.check( 'dateRange' ) ) {
        vm.dateRange = Global.get( 'dateRange' );
        vm.dateRange.this.dateEnd = moment(vm.dateRange.this.dateEnd).toDate();
        vm.dateRange.this.dateStart = moment(vm.dateRange.this.dateStart).toDate();
        vm.dateRange.last.dateEnd = moment(vm.dateRange.last.dateEnd).toDate();
        vm.dateRange.last.dateStart = moment(vm.dateRange.last.dateStart).toDate();
      } else {
        vm.dateRange = {
          this : {
            dateStart:  moment().subtract(1, 'months').toDate(),
            dateEnd:    moment().subtract(1, 'days').toDate()
          },
          last : {
            dateStart:  moment().subtract(1, 'years').subtract(1, 'months').toDate(),
            dateEnd:    moment().subtract(1, 'years').subtract(1, 'days').toDate()
          }
        };
        Global.set( 'dateRange', vm.dateRange );
      }

      getAllReports (vm.dateRange, vm.selectedCampaign.view_ID);
    }

    function getAllReports (dateRange, viewID, isCompare) {
      $rootScope.loadingProgress = true;
      vm.isLoading = true;

      Global.analytics.dashboard = {};

      var tasks = [];
      var query = {};

      // sessions by channel
      query = {
        table_id    : 'ga:' + viewID,
        metrics     : 'ga:sessions',
        start_date  : moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
        end_date    : moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
        dimensions  : 'ga:channelGrouping'
      };

      tasks.push(api.getReport(query));

      // sessions by device
      query = {
        table_id    : 'ga:' + viewID,
        metrics     : 'ga:sessions',
        start_date  : moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
        end_date    : moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
        dimensions  : 'ga:deviceCategory'
      };

      tasks.push(api.getReport(query));

      angular.forEach (vm.keys.compare, function (item) {

        query = {
          table_id    : 'ga:' + viewID,
          metrics     : item.metrics,
          start_date  : moment(dateRange.this.dateStart).format('YYYY-MM-DD'),
          end_date    : moment(dateRange.this.dateEnd).format('YYYY-MM-DD'),
          dimensions  : null
        };

        tasks.push(api.getReport(query));

        query = {
          table_id    : 'ga:' + viewID,
          metrics     : item.metrics,
          start_date  : moment(dateRange.last.dateStart).format('YYYY-MM-DD'),
          end_date    : moment(dateRange.last.dateEnd).format('YYYY-MM-DD'),
          dimensions  : null
        };

        tasks.push(api.getReport(query));

        query = {
          table_id    : 'ga:' + viewID,
          metrics     : item.metrics,
          start_date  : moment(dateRange.this.dateStart).subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD'),
          end_date    : moment(dateRange.this.dateEnd).subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD'),
          dimensions  : null
        };

        tasks.push(api.getReport(query));

        query = {
          table_id    : 'ga:' + viewID,
          metrics     : item.metrics,
          start_date  : moment(dateRange.this.dateStart).subtract(2, 'weeks').startOf('week').format('YYYY-MM-DD'),
          end_date    : moment(dateRange.this.dateEnd).subtract(2, 'weeks').endOf('week').format('YYYY-MM-DD'),
          dimensions  : null
        };

        tasks.push(api.getReport(query));
      });

      $q.all(tasks).then (function (response) {
        // sessions by channel
        Global.analytics.dashboard.channel  = response[0].data;
        // sessions by device
        Global.analytics.dashboard.device   = response[1].data;

        vm.values = { 
          channel : Global.analytics.dashboard.channel,
          device  : Global.analytics.dashboard.device,
        };

        vm.values.compare = [];

        for (var i = 0; i < vm.keys.compare.length; i ++) {
          vm.values.compare.push ({
            key : vm.keys.compare[i].label + '_this_year',
            value : response[2 + 4 * i].data === null ? 0 : +response[2 + 4 * i].data[0][0]
          });
          vm.values.compare.push ({
            key : vm.keys.compare[i].label + '_last_year',
            value : response[3 + 4 * i].data === null ? 0 : +response[3 + 4 * i].data[0][0]
          });
          vm.values.compare.push ({
            key : vm.keys.compare[i].label + '_this_week',
            value : response[4 + 4 * i].data === null ? 0 : +response[4 + 4 * i].data[0][0]
          });
          vm.values.compare.push ({
            key : vm.keys.compare[i].label + '_last_week',
            value : response[5 + 4 * i].data === null ? 0 : +response[5 + 4 * i].data[0][0]
          });
        }

        $rootScope.loadingProgress = false;
        vm.isLoading = false;
      }, function (error) {
        console.log(error);
        $rootScope.loadingProgress = false;
      });
    }

    /**
     * Check if role of current user is client
     * @returns true or false
     */
    function isClient() {
      return vm.currentUser.role === ROLE.CLIENT;
    }

    function onThirtyDays () {
      vm.dateRange = {
        this : {
          dateStart:  moment().subtract(31, 'days').toDate(),
          dateEnd:    moment().subtract(1, 'days').toDate()
        },
        last : {
          dateStart:  moment().subtract(1, 'years').subtract(31, 'days').toDate(),
          dateEnd:    moment().subtract(1, 'years').subtract(1, 'days').toDate()
        }
      };
      vm.dateRange = vm.dateRange;
      getAllReports (vm.dateRange, vm.selectedCampaign.view_ID);
    }

    function onNinetyDays () {
      vm.dateRange = {
        this : {
          dateStart:  moment().subtract(91, 'days').toDate(),
          dateEnd:    moment().subtract(1, 'days').toDate()
        },
        last : {
          dateStart:  moment().subtract(1, 'years').subtract(91, 'days').toDate(),
          dateEnd:    moment().subtract(1, 'years').subtract(1, 'days').toDate()
        }
      };
      vm.dateRange = vm.dateRange;
      getAllReports (vm.dateRange, vm.selectedCampaign.view_ID);
    }

    function updateDateRange ($event, showTemplate) {
      $mdDateRangePicker
        .show({targetEvent:$event, model:vm.dateRange.this} )
        .then(function(result){
          if(result) {
            vm.dateRange.this = result;
            vm.dateRange.last = {
              dateStart : moment(vm.dateRange.this.dateStart).subtract(1, 'years').toDate (),
              dateEnd   : moment(vm.dateRange.this.dateEnd).subtract(1, 'years').toDate ()
            };

            vm.dateRange = vm.dateRange;

            getAllReports (vm.dateRange, vm.selectedCampaign.view_ID);
          }
        });
    }

    init();
  }
})();
