(function() {
  'use strict';

  angular
    .module('app.users')
    .controller('UsersController', UsersController);

  UsersController.$inject = ['Global', 'api', '$mdDialog', '$document', '$cookieStore', 'ROLE', '$rootScope'];
  /** @ngInject */
  function UsersController( Global, api, $mdDialog, $document, $cookieStore, ROLE, $rootScope ) {
    var vm = this;

    // variables
    vm.users        = [];
    vm.ROLE         = ROLE;
    vm.role_label   = [];
    vm.currentUser  = {};

    // functions
    vm.addUser        = addUser;
    vm.deleteUser     = deleteUser;
    vm.editUser       = editUser;
    vm.goToCampaigns  = Global.goToCampaigns;

    function init() {
      angular.forEach(ROLE, function(r, k) {
        vm.role_label[r] = k;
      });

      if ( Global.check( 'currentUser' ) ) {
        vm.currentUser = Global.get( 'currentUser' );
      } else {
        Global.logout();
      }

      if ( Global.check( 'users' ) ) {
        vm.users = Global.get( 'users' );
      } else {
        var data = {};
        data.id = null;
        
        if ( vm.currentUser.role === Global.CLIENT )
          return;

        if ( vm.currentUser.role === Global.ADMIN )
          data.role = null;
        else
          data.role = Global.CLIENT;

        api.getUsers( data, function( response ) {
          if ( response.code == 0 ) {
            vm.users = response.data;

            Global.set( 'users', vm.users );
          }
        });
      }
    }
    
    function addUser( ev ) {
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
      .then( function( user ) {
        $rootScope.loadingProgress = true;
        if (angular.isDefined(user)) {
          api.addUser(user, function (response) {
            if (response.code == 0) {
              user.id = response.data.id;
              vm.users.unshift(user);
              Global.set( 'users', vm.users );
            }
            $rootScope.loadingProgress = false;
          });
        } else {
          $rootScope.loadingProgress = false;
        }
      });
    }

    function editUser( ev, key ) {
      var user = vm.users[key];
      $mdDialog.show({
        controller: 'UserDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dialogs/user/user-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          User: user
        }
      })
      .then( function( user ) {
        $rootScope.loadingProgress = true;
        if (angular.isDefined(user)) {
          api.updateUser(user, function (response) {
            if (response.code == 0) {
              vm.users[key] = angular.copy(user);
              Global.set( 'users', vm.users );
            }
            
            $rootScope.loadingProgress = false;
          });
        } else {
          $rootScope.loadingProgress = false;
        }
      });
    }

    function deleteUser(ev, key) {
      var user = vm.users[key];
      var confirm = $mdDialog.confirm()
        .title('Are you sure to delete this user?')
        .htmlContent('<b>' + user.username + '</b>' + ' will be deleted.')
        .ariaLabel('delete user')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show( confirm ).then( function() {
        $rootScope.loadingProgress = true;
        api.deleteUser( user.id, function( response ) {
          $rootScope.loadingProgress = false;
          if ( response.code == 0 ) {
            vm.users.splice(key, 1);
            Global.set( 'users', vm.users );
          }
        });
      });
    }

    init();
  }
})();