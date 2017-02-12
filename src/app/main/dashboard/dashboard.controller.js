(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['Global', '$rootScope', '$mdDateRangePicker', 'moment', '$q', '$state', 'api'];

  /** @ngInject */
  function DashboardController(Global, $rootScope, $mdDateRangePicker, moment, $q, $state, api) {
    
    var vm = this;

    // variables
    vm.dateRange  = {};
    vm.isCompare  = true;

    // methods
    vm.onThirtyDays           = onThirtyDays;
    vm.onNinetyDays           = onNinetyDays;
    vm.updateOrganicDateRange = updateOrganicDateRange;

    vm.init = function() {
      if ( Global.check( 'currentCampaign' ) ) {
        vm.currentCampaign = Global.get( 'currentCampaign' );
      } else {
        $state.go('app.campaigns');
        return;
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
    }

    function getAllReports (dateRange, viewID, isCompare) {
      // 
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
      getAllReports (vm.dateRange, vm.currentCampaign.view_ID);
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
      getAllReports (vm.dateRange, vm.currentCampaign.view_ID);
    }

    function updateOrganicDateRange ($event, showTemplate) {
      console.log(vm.dateRange);
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

            getAllReports (vm.dateRange, vm.currentCampaign.view_ID);
          }
        });
    }

    vm.init();
  }
})();
