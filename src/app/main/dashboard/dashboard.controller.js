(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$scope', '$cookieStore', '$state', 'ROLE', '$mdDialog', '$document', 'api', 'msNavigationService', 'Global'];

  /** @ngInject */
  function DashboardController($scope, $cookieStore, $state, ROLE, $mdDialog, $document, api, msNavigationServiceProvider, Global) {
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

    vm.init = function() {
      
    }

    if (angular.isUndefined(Global.users) || Global.users === null) {
      api.getUsers(vm.currentUser, function(response) {
        if (response.code == 0) {
          Global.users = response.data;
          vm.users = Global.users;
        }
      });
    } else {
      vm.users = Global.users;
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
            User: vm.users[i],
            Role: vm.currentUser.role
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
        api.deleteUser({ email: user.email }, function(response) {
          if (response.code == 0) {
            vm.users.splice(i, 1);
          }
        });
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
            User: user,
            Role: vm.currentUser.role
          }
        })
        .then(function(newUser) {
          if (!angular.isUndefined(newUser)) {
            vm.users.unshift(newUser);
          }
        });
    }

    vm.editCustomData = function(ev, i) {
      Global.selectedAccount = vm.users[i];
      $state.go('app.dashboard_customData');
    }

    vm.init();
  }

  function getObjectKeyIndex(obj, keyToFind) {
    var i = 0, key;

    for (key in obj) {
      if (key == keyToFind) {
        return i;
      }
      i++;
    }
    return null;
  }
})();
