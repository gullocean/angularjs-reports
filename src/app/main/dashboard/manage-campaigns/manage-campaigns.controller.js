(function() {
  'use strict';

  angular
    .module('app.dashboard.customData')
    .controller('ManageCampaignsController', ManageCampaignsController);

  ManageCampaignsController.$inject = ['Global', 'api', '$mdDialog', '$document'];
  /** @ngInject */
  function ManageCampaignsController(Global, api, $mdDialog, $document) {
    var vm = this;

    // variables
    vm.campaigns = [];

    // functions
    vm.addCampaign    = addCampaign;
    vm.deleteCampaign = deleteCampaign;
    vm.editCampaign   = editCampaign;

    vm.init = function () {
      vm.campaigns.push({
        company: 'test campaign',
        url : 'test url',
        thumbnail: 'assets/images/thumbnails/campaigns/test.png'
      });
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

    vm.init();
  }
})();