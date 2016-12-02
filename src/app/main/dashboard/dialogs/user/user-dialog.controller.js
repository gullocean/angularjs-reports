(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('UserDialogController', UserDialogController);

  /** @ngInject */
  function UserDialogController($mdDialog, msUtils, ROLE) {
    var vm = this;
    vm.ROLE = ROLE;
    vm.role_label = [];

    angular.forEach(ROLE, function(r, k) {
      vm.role_label[r] = k;
    });

    // Data
    vm.title = 'Edit User';
    // vm.user = angular.copy(User);
    // vm.users = Contacts;
    // vm.user = User;
    vm.newUser = false;
    vm.allFields = false;

    if (!vm.user) {
      vm.user = {
        'id': msUtils.guidGenerator(),
        'name': '',
        'lastName': '',
        'avatar': 'assets/images/avatars/profile.jpg',
        'nickname': '',
        'company': '',
        'jobTitle': '',
        'email': '',
        'phone': '',
        'address': '',
        'birthday': null,
        'notes': ''
      };

      vm.title = 'New User';
      vm.newUser = true;
      vm.user.tags = [];
    }

    // Methods
    vm.addNewUser = addNewUser;
    vm.saveUser = saveUser;
    vm.deleteUserConfirm = deleteUserConfirm;
    vm.closeDialog = closeDialog;
    vm.toggleInArray = msUtils.toggleInArray;
    // vm.exists = msUtils.exists;

    //////////

    /**
     * Add new user
     */
    function addNewUser() {
      // vm.users.unshift(vm.user);

      closeDialog();
    }

    /**
     * Save user
     */
    function saveUser() {
      // Dummy save action
      for (var i = 0; i < vm.users.length; i++) {
        if (vm.users[i].id === vm.user.id) {
          vm.users[i] = angular.copy(vm.user);
          break;
        }
      }

      closeDialog();
    }

    /**
     * Delete User Confirm Dialog
     */
    function deleteUserConfirm(ev) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the user?')
        .htmlContent('<b>' + vm.user.name + ' ' + vm.user.lastName + '</b>' + ' will be deleted.')
        .ariaLabel('delete user')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {

        // vm.users.splice(vm.users.indexOf(User), 1);

      });
    }

    /**
     * Close dialog
     */
    function closeDialog() {
      $mdDialog.hide();
    }

  }
})();
