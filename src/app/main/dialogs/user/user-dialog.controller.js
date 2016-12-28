(function() {
  'use strict';

  angular
    .module('app.users')
    .controller('UserDialogController', UserDialogController);

  /**
   * @ngInject
   */
  function UserDialogController($mdDialog, User, api, ROLE, Global, $cookieStore) {
    var vm = this;

    // variables
    vm.ROLE         = {};
    vm.user         = {};
    vm.roleLabel    = [];
    vm.oldEmail     = '';
    vm.title        = '';
    vm.role         = '';
    vm.isNewUser    = false;
    vm.isDuplicatedEmail = false;
    vm.campaigns    = [];

    // methods
    vm.closeDialog  = closeDialog;
    vm.addNewUser   = addNewUser;
    vm.saveUser     = saveUser;

    /**
     * Add new user
     */
    function addNewUser(user) {
      var newUser = {};
      newUser.username  = user.username;
      newUser.email     = user.email;
      newUser.password  = user.newPassword;
      if (vm.role == vm.ROLE.ADMIN) {
        newUser.role    = vm.user.role;
      } else {
        newUser.role    = vm.ROLE.CLIENT;
      }
      closeDialog(newUser);
    }

    /**
     * Save user
     */
    function saveUser(user) {
      var editedUser = {};
      editedUser.id        = user.id;
      editedUser.username  = user.username;
      editedUser.email     = user.email;
      if (angular.isDefined(user.newPassword))
        editedUser.password  = user.newPassword;
      if (vm.role == vm.ROLE.ADMIN) {
        editedUser.role = vm.user.role;
      } else {
        editedUser.role = vm.ROLE.CLIENT;
      }
      closeDialog(editedUser);
    }

    /**
     * Close dialog
     */
    function closeDialog(data) {
      $mdDialog.hide(data);
    }

    /**
     * initialize variables
     */
    function init() {
      vm.role   = angular.copy($cookieStore.get('currentUser')).role;
      vm.ROLE   = angular.copy(ROLE);
      vm.user   = angular.copy(User);
      vm.title  = 'Edit User';
      vm.campaigns = Global.campaigns;

      angular.forEach(ROLE, function(r, k) {
        vm.roleLabel[r] = k;
      });

      if (angular.isUndefined(vm.user) || vm.user === null) {
        vm.user = {
          'username': '',
          'avatar': 'assets/images/avatars/profile.jpg',
          'email': '',
          'role': ROLE.CLIENT
        };

        vm.title      = 'New User';
        vm.isNewUser  = true;
        vm.user.tags  = [];
      }

      if (!vm.isNewUser) {
        vm.user.role    = +vm.user.role;
        vm.oldEmail     = vm.user.email;
        vm.user.avatar  = 'assets/images/avatars/profile.jpg';
      }
    }

    init();
  }
})();
