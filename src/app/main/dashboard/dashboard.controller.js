(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['DashboardData', '$cookieStore', '$rootScope', 'ROLE', '$http', '$mdDialog', '$document', 'DTColumnDefBuilder'];

  /** @ngInject */
  function DashboardController(DashboardData, $cookieStore, $rootScope, ROLE, $http, $mdDialog, $document, DTColumnDefBuilder) {
    var vm = this;
    vm.ROLE = ROLE;
    vm.users = [];
    vm.role_label = [];
    vm.currentUser = $cookieStore.get('currentUser');

    angular.forEach(ROLE, function(r, k) {
      vm.role_label[r] = k;
    });

    // Data
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };

    if (vm.currentUser.role == ROLE.ADMIN) {
      $http({
        method: 'GET',
        url: 'http://reports.trafficdev.net/api/index.php/users/get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        if (response.code == 0) {
          vm.users = response.data;
        } else $state.go('app.pages_auth_login');
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    vm.edit = function(ev, i) {
      $mdDialog.show({
        controller: 'UserDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dashboard/dialogs/user/user-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          User: vm.users[i]
        }
      })
      .then(function(editedUser) {
        if (!angular.isUndefined(editedUser)) {
          angular.forEach(editedUser, function(value, key) {
            vm.users[i][key] = value;
          })
        }
      });
    }

    vm.delete = function(ev, i) {
      var user = vm.users[i];
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the user?')
        .htmlContent('<b>' + user.username + '</b>' + ' will be deleted.')
        .ariaLabel('delete user')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        vm.users.splice(i, 1);
      });
    }

    vm.select = function(i) {
      // alert('table row : ' + key);
    }

    vm.add = function(ev, user) {
      $mdDialog.show({
        controller: 'UserDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dashboard/dialogs/user/user-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: true,
        locals: {
          User: user
        }
      })
      .then(function(newUser) {
        vm.users.unshift(newUser);
      });
    }
  }
})();
