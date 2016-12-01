(function() {
  'use strict';

  angular
    .module('app.analytics', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
    // State
    $stateProvider
      .state('app.analytics', {
        url: '/analytics',
        views: {
          'content@app': {
            templateUrl: 'app/main/analytics/analytics.html',
            controller: 'AnalyticsController as vm'
          }
        },
        resolve: {
          AnalyticsData: function(msApi) {
            return msApi.resolve('analytics@get');
          }
        }
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/analytics');

    // Api
    msApiProvider.register('analytics', ['app/data/analytics/analytics.json']);

    // Navigation
    msNavigationServiceProvider.saveItem('fuse.analytics', {
      title: 'Analytics',
      icon: 'icon-poll',
      state: 'app.analytics',
      /*stateParams: {
          'param1': 'page'
       },*/
      translate: 'ANALYTICS.ANALYTICS_NAV',
      weight: 1
    });
  }
})();
