(function() {
  'use strict';

  angular
    .module('app.campaigns', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider
      .state('app.campaigns', {
        url: '/campaigns',
        views: {
          'main@'                 : {
            templateUrl: 'app/core/layouts/content-with-toolbar.html',
            controller : 'MainController as vm'
          },
          'toolbar@app.campaigns'           : {
            templateUrl: 'app/toolbar/layouts/vertical-navigation/toolbar.html',
            controller : 'ToolbarController as vm'
          },
          'content@app.campaigns' : {
            templateUrl: 'app/main/campaigns/campaigns.html',
            controller: 'CampaignsController as vm'
          }
        }
      });
  }
})();
