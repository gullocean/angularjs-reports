(function() {
  'use strict';

  angular
    .module('app.dashboard.manage.campaigns', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider
      .state('app.dashboard_manage_campaigns', {
        url: '/manage-campaigns',
        views: {
          'content@app': {
            templateUrl: 'app/main/dashboard/manage-campaigns/manage-campaigns.html',
            controller: 'ManageCampaignsController as vm'
          }
        }
      });
  };

})();