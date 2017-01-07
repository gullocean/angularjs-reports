(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$scope', '$state', '$http', 'api', 'ROLE', 'Global'];

  /** @ngInject */
  function LoginController($rootScope, $scope, $state, $http, api, ROLE, Global) {

    var vm = this;
    vm.currentUser = {};

    vm.init = init;

    function init() {
      Global.removeAll();

      api.getParticleData(function(particleData) {
        particleData.particles.color.value = '#2392CD';
        particleData.particles.line_linked.color = '#2392CD';
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
          vm.currentUser      = response.data;
          vm.currentUser.role = +vm.currentUser.role;

          Global.set( 'currentUser' , vm.currentUser );
          Global.currentUser = vm.currentUser;

          if(vm.currentUser.role === ROLE.CLIENT) {
            $state.go('app.task_summaries');
          } else {
            $state.go('app.campaigns');
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