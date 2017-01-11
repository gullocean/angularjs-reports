(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$rootScope', '$scope', '$state', '$http', 'api', 'ROLE', 'Global'];

  /** @ngInject */
  function LoginController($rootScope, $scope, $state, $http, api, ROLE, Global) {

    var vm = this;

    // methods
    vm.login = login;

    function init() {
      Global.removeAll();

      api.getParticleData(function(particleData) {
        // particleData.particles.color.value = '#2392CD';
        // particleData.particles.line_linked.color = '#2392CD';
        particlesJS('particles-js', particleData);
      });
    }

    function login() {

      $rootScope.loadingProgress  = true;

      var data = {
        email   : vm.form.email,
        password: vm.form.password
      };

      api.auth(data, function(response) {
        if (response.code == 0) {
          var currentUser = response.data;
          var token       = response.token;

          currentUser.role = +currentUser.role;

          Global.set( 'currentUser' , currentUser );
          Global.set( 'token', token );
          
          Global.currentUser = currentUser;

          if(currentUser.role === ROLE.CLIENT) {
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

    init ();
  }
})();