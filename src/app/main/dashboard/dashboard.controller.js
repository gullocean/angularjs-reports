(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$cookieStore', '$state', 'ROLE', '$mdDialog', '$document', 'api', 'msNavigationService'];

  /** @ngInject */
  function DashboardController($cookieStore, $state, ROLE, $mdDialog, $document, api, msNavigationServiceProvider) {
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

    api.getUsers(vm.currentUser, function(response) {
      if (response.code == 0) {
        vm.users = response.data;

        msNavigationServiceProvider.saveItem('fuse.summaries', {
          title: 'Task Summaries',
          icon: 'icon-table',
          state: 'app.task_summaries',
          weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.organic', {
          title: 'Organic',
          icon: 'icon-poll',
          state: 'app.analytics_organic',
          weight: 1
        });
        
        msNavigationServiceProvider.saveItem('fuse.crossChannel', {
          title: 'Cross-Channel',
          icon: 'icon-poll',
          state: 'app.analytics_crossChannel',
          weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.paidMedia', {
          title: 'Paid Media',
          icon: 'icon-poll',
          state: 'app.analytics_paidMedia',
          weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.conversions', {
          title: 'Conversions',
          icon: 'icon-phone',
          weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.conversions.phoneCalls', {
          title: 'Phone Calls',
          icon: 'icon-poll',
          state: 'app.analytics_phoneCalls'
        });

        msNavigationServiceProvider.saveItem('fuse.conversions.goalCompletions', {
          title: 'Goal Completions',
          icon: 'icon-poll',
          state: 'app.analytics_goalCompletions'
        });

        msNavigationServiceProvider.saveItem('fuse.conversions.value', {
          title: 'Value',
          icon: 'icon-poll',
          state: 'app.analytics_value'
        });

        // angular.forEach(ANALYTICS.channel, function(value, key) {
        //   msNavigationServiceProvider.saveItem(value.name, value.content);
        // });
      }
    });

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
        api.deleteUser({email:user.email}, function(response) {
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
  }
})();
