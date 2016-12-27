(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$scope', '$state', '$http', '$cookieStore', 'api', 'ROLE', 'Global'];

  /** @ngInject */
  function LoginController($rootScope, $scope, $state, $http, $cookieStore, api, ROLE, Global) {

    var vm = this;
    vm.currentUser = {};

    vm.init = init;

    function init() {
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
          vm.currentUser = response.data;
          vm.currentUser.role = +vm.currentUser.role;
          Global.currentUser = vm.currentUser;
          $cookieStore.put('currentUser', vm.currentUser);

          if(vm.currentUser.role === ROLE.ADMIN) {
            $state.go('app.campaigns');
          } else if(vm.currentUser.role === ROLE.CLIENT) {
            $state.go('app.task_summaries');
          }
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