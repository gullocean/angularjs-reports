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

    vm.queries = {
      organic: {
      query: {
        metrics: 'ga:sessions, ga:pageviewsPerSession',
        dimensions: 'ga:month',
        'start-date': '2016-10-01',
        'end-date': '2016-12-06'
      }
    }, pages: {
      query: {
        metrics: 'ga:pageviews, ga:entrances, ga:avgTimeOnPage',
        dimensions: 'ga:pageTitle, ga:landingPagePath',
        'start-date': '2016-10-01',
        'end-date': '2016-12-06'
      }
    }, channel: {
      query: {
        metrics: 'ga:sessions',
        dimensions: 'ga:channelGrouping',
        'start-date': '2016-10-01',
        'end-date': '2016-12-06'
      }
    }, device: {
      query: {
        metrics: 'ga:sessions',
        dimensions: 'ga:deviceCategory',
        'start-date': '2016-10-01',
        'end-date': '2016-12-06'
      }
    }, PPC: {
      query: {
        metrics: 'ga:adClicks, ga:adCost, ga:CTR, ga:CPC, ga:transactionRevenue, ga:goalCompletionsAll, ga:goalConversionRateAll',
        dimensions: 'ga:campaign',
        'start-date': '2016-12-01',
        'end-date': '2016-12-06'
      }
    }, goal_cur: {
      query: {
        metrics: 'ga:goalCompletionsAll',
        'start-date': '2016-11-07',
        'end-date': '2016-12-06'
      }
    }, goal_prev: {
      query: {
        metrics: 'ga:goalCompletionsAll',
        'start-date': '2016-10-07',
        'end-date': '2016-11-06'
      }
    }, value_cur: {
      query: {
        metrics: 'ga:goalConversionRateAll',
        'start-date': '2016-11-07',
        'end-date': '2016-12-06'
      }
    }, value_prev: {
      query: {
        metrics: 'ga:goalConversionRateAll',
        'start-date': '2016-10-07',
        'end-date': '2016-11-06'
      }
    }, phone_prev: {
      query: {
        metrics: 'ga:goal1Value',
        'start-date': '2016-10-07',
        'end-date': '2016-11-06'
      }
    }, phone_cur: {
      query: {
        metrics: 'ga:goal1Value',
        'start-date': '2016-11-07',
        'end-date': '2016-12-06'
      }
    }};

    vm.init = function() {
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
        icon: 'icon-poll',
        weight: 1
      });

      msNavigationServiceProvider.saveItem('fuse.conversions.phoneCalls', {
        title: 'Phone Calls',
        icon: 'icon-phone',
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

      msNavigationServiceProvider.saveItem('fuse.reports', {
        title: 'Reports',
        icon: 'icon-file-pdf',
        state: 'app.reports'
      });
    }

    api.getUsers(vm.currentUser, function(response) {
      if (response.code == 0) {
        vm.users = response.data;
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

    // if a report is ready
    $scope.$on('$gaReportSuccess', function(e, report, element) {
      console.log(report);
      Global.analytics = {};
      Global.analytics.organic = [{
        key: 'Sessions',
        values: []
      }, {
        key: 'Pages / Session',
        values: []
      }];

      angular.forEach(report[getObjectKeyIndex(vm.queries, 'organic')].rows, function(v, k) {
        Global.analytics.organic[0].values.push({x: +v[0], y: +v[1]});
        Global.analytics.organic[1].values.push({x: +v[0], y: +v[2]});
      });

      Global.analytics.pages = {};
      Global.analytics.pages.columnHeaders = ['Page Title', 'Landing Page', 'Pageviews', 'Entrances', 'Avg. Time on Page'];
      Global.analytics.pages.values = angular.copy(report[getObjectKeyIndex(vm.queries, 'pages')].rows);

      Global.analytics.channel = report[getObjectKeyIndex(vm.queries, 'channel')].rows;
      Global.analytics.device  = report[getObjectKeyIndex(vm.queries, 'device')].rows;
      Global.analytics.PPC     = report[getObjectKeyIndex(vm.queries, 'PPC')].rows;

      var goal_cur  = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'goal_cur')].rows)  ? 0 : +report[getObjectKeyIndex(vm.queries, 'goal_cur')].rows[0];
      var goal_prev = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'goal_prev')].rows) ? 0 : +report[getObjectKeyIndex(vm.queries, 'goal_prev')].rows[0];
      if (goal_cur  === 0) Global.analytics.goal = 0;
      else if (goal_prev === 0) Global.analytics.goal = 100;
      else Global.analytics.goal = (goal_cur - goal_prev) / goal_prev;

      var value_cur  = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'value_cur')].rows)  ? 0 : +report[getObjectKeyIndex(vm.queries, 'value_cur')].rows[0];
      var value_prev = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'value_prev')].rows) ? 0 : +report[getObjectKeyIndex(vm.queries, 'value_prev')].rows[0];
      if (value_cur  === 0) Global.analytics.value = 0;
      else if (value_prev === 0) Global.analytics.value = 100;
      else Global.analytics.value = (value_cur - value_prev) / value_prev;

      var phone_cur  = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'phone_cur')].rows)  ? 0 : +report[getObjectKeyIndex(vm.queries, 'phone_cur')].rows[0];
      var phone_prev = angular.isUndefined(report[getObjectKeyIndex(vm.queries, 'phone_prev')].rows) ? 0 : +report[getObjectKeyIndex(vm.queries, 'phone_prev')].rows[0];
      if (phone_cur  === 0) Global.analytics.phone = 0;
      else if (phone_prev === 0) Global.analytics.phone = 100;
      else Global.analytics.phone = (phone_cur - phone_prev) / phone_prev;

      console.log(Global);
    });
    $scope.$on('$gaReportError', function(e, error, element) {
      console.log(error);
      alert(error);
    });

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
