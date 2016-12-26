(function() {
  'use strict';

  angular
    .module('app.users')
    .controller('UsersController', UsersController);

  UsersController.$inject = ['$state', 'Global', 'api', '$mdDialog', '$document', '$cookieStore', 'ROLE'];
  /** @ngInject */
  function UsersController($state, Global, api, $mdDialog, $document, $cookieStore, ROLE) {
    var vm = this;

    // variables
    vm.users = [];
    vm.ROLE = ROLE;
    vm.role_label = [];
    vm.currentUser = {};

    // functions
    vm.addUser    = addUser;
    vm.deleteCampaign = deleteCampaign;
    vm.editCampaign   = editCampaign;
    vm.selectCampaign = selectCampaign;
    vm.goToCampaigns  = goToCampaigns;

    vm.init = function () {
      angular.forEach(ROLE, function(r, k) {
        vm.role_label[r] = k;
      });

      vm.currentUser = $cookieStore.get('currentUser');

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
    }
    
    function addUser (ev) {
      $mdDialog.show({
        controller: 'UserDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dialogs/user/user-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          User: null
        }
      })
      .then(function(user) {
        if (angular.isDefined(user)) {
          vm.users.unshift(user);
        }
      });
    }

    function editCampaign (ev, key) {
      var campaign = vm.campaigns[key];
      $mdDialog.show({
        controller: 'CampaignDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dialogs/user/user-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          Campaign: user
        }
      })
      .then(function(newUser) {
        if (!angular.isUndefined(newUser)) {
          vm.users.unshift(newUser);
        }
      });
    }

    function deleteCampaign (ev, key) {
      var user = vm.users[key];
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the user?')
        .htmlContent('<b>' + user.title + '</b>' + ' will be deleted.')
        .ariaLabel('delete user')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        // api.deleteUser({ email: user.email }, function(response) {
        //   if (response.code == 0) {
        //     // vm.users.splice(i, 1);
        //   }
        // });
      });
    }

    function selectCampaign (user) {
      Global.currentCampaign = angular.copy(user);
      $state.go('app.dashboard');
    }

    function goToCampaigns () {
      $state.go('app.campaigns');
    }

    vm.init();
  }
})();