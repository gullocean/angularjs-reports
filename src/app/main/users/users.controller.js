(function() {
  'use strict';

  angular
    .module('app.users')
    .controller('UsersController', UsersController);

  UsersController.$inject = ['$filter', '$state', 'Global', 'api', '$mdDialog', '$document', '$cookieStore', 'ROLE', '$rootScope'];
  /** @ngInject */
  function UsersController( $filter, $state, Global, api, $mdDialog, $document, $cookieStore, ROLE, $rootScope ) {
    var vm = this;

    // variables
    vm.currentUser  = {};
    vm.ROLE         = ROLE;
    vm.role_label   = [];
    vm.selectedUser = {};
    vm.users        = [];

    // functions
    vm.addUser        = addUser;
    vm.deleteUser     = deleteUser;
    vm.editUser       = editUser;
    vm.goToCampaigns  = Global.goToCampaigns;
    vm.selectUser     = selectUser;

    function init() {
      angular.forEach(ROLE, function(r, k) {
        vm.role_label[r] = k;
      });

      if ( Global.check( 'currentUser' ) ) {
        vm.currentUser = Global.get( 'currentUser' );
      } else {
        api.logout();
      }

      if ( Global.check( 'users' ) ) {
        vm.users = Global.get( 'users' );
      } else {
        if ( vm.currentUser.role === Global.CLIENT )
          return;

        api.getUsers( function( response ) {
          if ( response.code == 0 ) {
            vm.users = response.data;

            angular.forEach( vm.users, function( user ) {
              user.id = +user.id;
              user.campaignID = +user.campaignID;
              user.role = +user.role;
            });

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

    function selectUser( selectedUser ) {
      vm.selectedUser = selectedUser;
      if ( vm.selectedUser.role !== ROLE.CLIENT ) return;
      Global.set( 'selectedUser', vm.selectedUser );
      var campaigns = Global.get( 'campaigns' );
      var filteredCampaigns = $filter( 'filter' )( campaigns, { id: selectedUser.campaignID }, true);

      if ( filteredCampaigns.length < 1 ) {
        console.log( 'There is no campaign!' );
        return;
      }

      Global.set( 'currentCampaign', filteredCampaigns[0] );
      Global.currentCampaign = angular.copy( filteredCampaigns[0] );
      $state.go( 'app.task_summaries' );
    }

    init();
  }
})();