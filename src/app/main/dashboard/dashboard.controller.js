(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardData', '$cookieStore', '$rootScope', 'ROLE'];

  /** @ngInject */
  function DashboardController(DashboardData, $cookieStore, $rootScope, ROLE) {
    var vm = this;

    // Data
    vm.helloText = DashboardData.data.helloText;

    vm.currentUser = $cookieStore.get('currentUser');

    // Methods

    //////////
  }
})();
