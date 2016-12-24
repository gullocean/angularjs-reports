(function() {
  'use strict';

  angular
    .module('app.campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$state', 'Global', 'api', '$mdDialog', '$document', '$q'];
  /** @ngInject */
  function CampaignsController($state, Global, api, $mdDialog, $document, $q) {

    var vm = this;

    // variables
    vm.campaigns = [];

    // functions
    vm.addCampaign    = addCampaign;
    vm.deleteCampaign = deleteCampaign;
    vm.editCampaign   = editCampaign;
    vm.selectCampaign = selectCampaign;
    vm.goToUsers      = goToUsers;

    function init () {
      if (angular.isUndefined(Global.campaigns) || Global.campaigns === null) {
        api.getCampaigns (function(response) {
          if (response.code === 0) {
            Global.campaigns  = response.data;
            // var tasks = [];

            // angular.forEach (Global.campaigns, function (campaign) {
            //   tasks.push (api.getScreenshots (campaign.url));
            // });

            // $q.all (tasks).then (function (response) {
            //   angular.forEach (response, function (r, index) {
            //     console.log(r);
            //     Global.campaigns[index].thumbnail = r;
            //   });
            // });

            vm.campaigns = Global.campaigns;
          } else {
            console.log( 'campaigns getting error!' );
          }
        });
      } else {
        vm.campaigns = Global.campaigns;
      }
    }
    
    function addCampaign (ev) {
      $mdDialog.show({
        controller: 'CampaignDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dialogs/campaign/campaign-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          Campaign: null
        }
      })
      .then(function(newCampaign) {
        if (!angular.isUndefined(newCampaign)) {
          vm.campaigns.unshift(newCampaign);
        }
      });
    }

    function editCampaign (ev, key) {
      var campaign = vm.campaigns[key];
      $mdDialog.show({
        controller: 'CampaignDialogController',
        controllerAs: 'vm',
        templateUrl: 'app/main/dialogs/campaign/campaign-dialog.html',
        parent: angular.element($document.find('#content-container')),
        targetEvent: ev,
        clickOutsideToClose: false,
        locals: {
          Campaign: campaign
        }
      })
      .then(function(newUser) {
        if (!angular.isUndefined(newUser)) {
          vm.users.unshift(newUser);
        }
      });
    }

    function deleteCampaign (ev, key) {
      var campaign = vm.campaigns[key];
      var confirm = $mdDialog.confirm()
        .title('Are you sure want to delete the user?')
        .htmlContent('<b>' + campaign.title + '</b>' + ' will be deleted.')
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

    function selectCampaign (campaign) {
      Global.currentCampaign = angular.copy(campaign);
      $state.go('app.task_summaries');
    }

    function goToUsers () {
      $state.go('app.users');
    }

    function getScreenshot (url) {
      if (angular.isUndefined (url)) return;
      vm.progress = true;
      api.getScreenshot (url, function (response) {
        vm.error.url = false;
        vm.progress = false
        vm.imgCampaign = 'data:' + response.screenshot.mime_type + ';base64,' + api.decodeGoogle (response.screenshot.data);
      }, function (error) {
        vm.error.url = true;
        vm.progress = false
      });
    }

    init ();
  }
})();