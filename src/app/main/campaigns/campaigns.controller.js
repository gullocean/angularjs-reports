(function() {
  'use strict';

  angular
    .module('app.campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$state', 'Global', 'api', '$mdDialog', '$document'];
  /** @ngInject */
  function CampaignsController($state, Global, api, $mdDialog, $document) {
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
            Global.campaigns = response.data;
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
        templateUrl: 'app/main/dashboard/dialogs/campaign/campaign-dialog.html',
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
        templateUrl: 'app/main/dashboard/dialogs/campaign/campaign-dialog.html',
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
      $state.go('app.dashboard');
    }

    function goToUsers () {
      $state.go('app.users');
    }

    init ();
  }
})();