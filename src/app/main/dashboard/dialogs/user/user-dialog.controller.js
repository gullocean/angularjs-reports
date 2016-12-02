(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('UserDialogController', UserDialogController);

  /** @ngInject */
  function UserDialogController($mdDialog, msUtils, ROLE, User) {
    var vm = this;
    
    vm.ROLE = ROLE;
    vm.role_label = [];

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
      newUser.role      = vm.user.role;
      newUser.password  = vm.user.newPassword;
      closeDialog(newUser);
    }

    /**
     * Save user
     */
    function saveUser() {
      var editedUser = {};
      editedUser.username  = vm.user.username;
      editedUser.email     = vm.user.email;
      editedUser.role      = vm.user.role;
      editedUser.password  = vm.user.newPassword;
      closeDialog(editedUser);
    }

    /**
     * Close dialog
     */
    function closeDialog(data) {
      $mdDialog.hide(data);
    }

  }
})();
