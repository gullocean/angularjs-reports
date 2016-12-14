(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$scope', '$state', '$http', '$cookieStore', 'api'];

  /** @ngInject */
  function LoginController($rootScope, $scope, $state, $http, $cookieStore, api) {

    var vm = this;

    vm.init = init;

    function init () {
      $cookieStore.remove('currentUser');

      api.getParticleData(function(particleData) {
        particlesJS('particles-js', particleData);
      });
    }

    $scope.login = function() {

      $rootScope.loadingProgress  = true;

      var data = {
        email   : vm.form.email,
        password: vm.form.password
      };

      api.auth(data, function(response) {
        if (response.code == 0) {
          $cookieStore.put('currentUser', response.data);
          $state.go('app.dashboard');
        } else {
          $state.go('app.pages_auth_login');
          alert('email or password is incorrect!');
        }
        $rootScope.loadingProgress  = false;
      });
    }

    vm.init ();
  }
})();