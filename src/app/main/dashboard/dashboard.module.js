(function() {
  'use strict';

  angular
    .module('app.dashboard', ['datatables', 'ngPassword', 'ngAnalytics', 'app.dashboard.customData'])
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
      icon: 'icon-table',
      state: 'app.dashboard',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.organic', {
      title: 'Organic',
      icon: 'icon-poll',
      state: 'app.analytics_organic',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.crossChannel', {
      title: 'Cross-Channel',
      icon: 'icon-poll',
      state: 'app.analytics_crossChannel',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.paidMedia', {
      title: 'Paid Media',
      icon: 'icon-poll',
      state: 'app.analytics_paidMedia',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.conversions', {
      title: 'Conversions',
      icon: 'icon-poll',
      weight: 1
    });

    msNavigationServiceProvider.saveItem('fuse.conversions.phoneCalls', {
      title: 'Phone Calls',
      icon: 'icon-phone',
      state: 'app.analytics_phoneCalls'
    });

    msNavigationServiceProvider.saveItem('fuse.conversions.goalCompletions', {
      title: 'Goal Completions',
      icon: 'icon-poll',
      state: 'app.analytics_goalCompletions'
    });

    msNavigationServiceProvider.saveItem('fuse.conversions.value', {
      title: 'Value',
      icon: 'icon-poll',
      state: 'app.analytics_value'
    });

    msNavigationServiceProvider.saveItem('fuse.reports', {
      title: 'Reports',
      icon: 'icon-file-pdf',
      state: 'app.reports'
    });
  }
})();
