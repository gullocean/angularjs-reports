(function() {
  'use strict';

  angular
    .module('app.pages.auth.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$http'];

  /** @ngInject */
  function LoginController($scope, $state, $http) {
    var vm = this;

    $scope.login = function() {
      var data = {
        email: vm.form.email,
        password: vm.form.password,
      };
      $http({
        method: 'POST',
        url: 'http://jdpower.trafficdev.net/api/index.php/users/auth',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        console.log('login response : ', response);
        if (response.code == 0) $state.go('app.dashboard');
        else $state.go('app.pages_auth_login');
      }).error(function(error) {
        console.log('login error : ', error);
      });
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