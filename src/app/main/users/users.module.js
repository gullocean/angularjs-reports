(function() {
  'use strict';

  angular
    .module('app.users', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider
      .state('app.users', {
        url: '/users',
        views: {
          'main@'                 : {
            templateUrl: 'app/core/layouts/content-with-toolbar.html',
            controller : 'MainController as vm'
          },
          'toolbar@app.users'           : {
            templateUrl: 'app/toolbar/layouts/vertical-navigation/toolbar.html',
            controller : 'ToolbarController as vm'
          },
          'content@app.users' : {
            templateUrl: 'app/main/users/users.html',
            controller: 'UsersController as vm'
          }
        }
      });
  }
})();
