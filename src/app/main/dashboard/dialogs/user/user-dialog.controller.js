(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('UserDialogController', UserDialogController);

  /** @ngInject */
  function UserDialogController($mdDialog, msUtils, ROLE, User, Role, api) {
    var vm = this;

    vm.ROLE = ROLE;
    vm.role = Role;
    vm.role_label = [];
    vm.oldEmail = '';

    angular.forEach(ROLE, function(r, k) {
      vm.role_label[r] = k;
    });

    // Data
    vm.title = 'Edit User';
    vm.user  = angular.copy(User);
    
    vm.newUser   = false;
    vm.allFields = false;

    if (!vm.user) {
      vm.user = {
        'username': '',
        'avatar': 'assets/images/avatars/profile.jpg',
        'email': '',
        'role': ROLE.CLIENT
      };

      vm.title      = 'New User';
      vm.newUser    = true;
      vm.user.tags  = [];
    }

    if (!vm.newUser) {
      vm.user.role    = +vm.user.role;
      vm.oldEmail     = vm.user.email;
      vm.user.avatar  = 'assets/images/avatars/profile.jpg';
    }

    // Methods
    vm.addNewUser     = addNewUser;
    vm.saveUser       = saveUser;
    vm.closeDialog    = closeDialog;
    vm.toggleInArray  = msUtils.toggleInArray;
    // vm.exists = msUtils.exists;

    //////////

    /**
     * Add new user
     */
    function addNewUser() {
      var newUser = {};
      newUser.username  = vm.user.username;
      newUser.email     = vm.user.email;
      newUser.password  = vm.user.newPassword;
      if (vm.role == vm.ROLE.ADMIN) {
        newUser.role    = vm.user.role;
      } else {
        newUser.role    = vm.ROLE.CLIENT;
      }
      api.addUser(newUser, function(response) {
        if (response.code == 0) {
          closeDialog(newUser);
        } else {
          closeDialog();
        }
      });
    }

    /**
     * Save user
     */
    function saveUser() {
      var editedUser = {};
      editedUser.oldEmail  = vm.oldEmail;
      editedUser.username  = vm.user.username;
      editedUser.email     = vm.user.email;
      editedUser.password  = vm.user.newPassword;
      if (vm.role == vm.ROLE.ADMIN) {
        editedUser.role = vm.user.role;
      } else {
        editedUser.role = vm.ROLE.CLIENT;
      }
      api.updateUser(editedUser, function(response) {
        if (response.code == 0) {
          closeDialog(editedUser);
        } else {
          closeDialog();
        }
      });
    }

    /**
     * Close dialog
     */
    function closeDialog(data) {
      $mdDialog.hide(data);
    }

  }
})();
