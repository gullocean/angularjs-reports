(function() {
  'use strict';

  angular
    .module('app.dashboard', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'content@app': {
            templateUrl: 'app/main/dashboard/dashboard.html',
            controller: 'DashboardController as vm'
          }
        },
        resolve: {
          DashboardData: function(msApi) {
            return msApi.resolve('dashboard@get');
          }
        }
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/dashboard');

    // Api
    msApiProvider.register('dashboard', ['app/data/dashboard/dashboard.json']);

    // Navigation
    msNavigationServiceProvider.saveItem('fuse', {
      title: 'Dashboard',
      group: true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.dashboard', {
      title: 'Dashboard',
      icon: 'icon-tile-four',
      state: 'app.dashboard',
      /*stateParams: {
          'param1': 'page'
       },*/
      translate: 'DASHBOARD.DASHBOARD_NAV',
      weight: 1
    });
  }
})();
