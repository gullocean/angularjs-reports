(function() {
  'use strict';

  angular
    .module('app.dashboard.customData', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider
      .state('app.dashboard_customData', {
        url: '/custom-data',
        views: {
          'content@app': {
            templateUrl: 'app/main/dashboard/custom-data/custom-data.html',
            controller: 'CustomDataController as vm'
          }
        }
      });
  };

})();
