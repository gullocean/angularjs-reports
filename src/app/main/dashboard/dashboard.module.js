(function() {
  'use strict';

  angular
    .module('app.dashboard', ['datatables', 'ngPassword', 'ngAnalytics'])
    .config(config)
    .run(['ngAnalyticsService', function (ngAnalyticsService) {
      ngAnalyticsService.setClientId('574168449740-uv24b6hfs45vh5vuhf924vt71e1hjnpc.apps.googleusercontent.com');
    }]);

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
