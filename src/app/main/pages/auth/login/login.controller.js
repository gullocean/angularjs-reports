(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$http', '$cookieStore', 'ROLE', 'api'];

  /** @ngInject */
  function LoginController($scope, $state, $http, $cookieStore, ROLE, api) {
    var vm = this;
    
    $cookieStore.remove('currentUser');

    $scope.login = function() {
      var data = {
        email: vm.form.email,
        password: vm.form.password,
      };
      api.auth(data,
        function(response) {
          if (response.code == 0) {
            $cookieStore.put('currentUser', response.data);
            $state.go('app.dashboard');
          } else {
            $state.go('app.pages_auth_login');
          }
        }
      );
    }

    $http.get('assets/particles.json')
      .success(function(particles_data) {
        particlesJS('particles-js', particles_data);
      })
      .error(function(error) {
        console.log('particles data load error : ', error);
      });
  }
})();