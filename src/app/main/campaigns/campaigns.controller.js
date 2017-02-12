(function() {
  'use strict';

  angular
    .module('app.campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$state', 'Global', 'api', '$mdDialog', '$document', '$q', '$rootScope'];
  /** @ngInject */
  function CampaignsController($state, Global, api, $mdDialog, $document, $q, $rootScope) {

    var vm = this;

    // variables
    vm.campaigns = [];

    // functions
    vm.addCampaign    = addCampaign;
    vm.deleteCampaign = deleteCampaign;
    vm.editCampaign   = editCampaign;
    vm.selectCampaign = selectCampaign;
    vm.goToUsers      = goToUsers;

    function init() {
      Global.remove( 'currentCampaign' );

      if ( Global.check( 'campaigns' ) ) {
        vm.campaigns = Global.get( 'campaigns' );
      } else {
        api.getCampaigns ( '', function( response ) {
          if ( response.code === 0 ) {
            vm.campaigns = response.data;

            angular.forEach( vm.campaigns, function( campaign ) {
              campaign.id = +campaign.id;
            });
            
            Global.set( 'campaigns', vm.campaigns );
            Global.campaigns = vm.campaigns;
          } else {
            console.log( 'campaigns getting error!' );
          }
        });
      }
    }
    
    function addCampaign(ev) {
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
      }).then(function(campaign) {
        $rootScope.loadingProgress = true;
        if (angular.isDefined (campaign)) {
          api.addCampaign(campaign, function (response) {
            if (response.code == 0) {
              campaign.id = response.data.id;

              vm.campaigns.unshift(response.data);

              Global.set( 'campaigns', vm.campaigns );
            }
            $rootScope.loadingProgress = false;
          });
        } else {
          $rootScope.loadingProgress = false;
        }
      });
    }

    function editCampaign(ev, key) {
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
      }).then(function(campaign) {
        $rootScope.loadingProgress = true;
        if (angular.isDefined(campaign)) {
          api.updateCampaign(campaign, function(response) {
            if (response.code == 0) {
              vm.campaigns[key] = campaign;
              Global.set( 'campaigns', vm.campaigns );
            }
            
            $rootScope.loadingProgress = false;
          });
        } else {
          $rootScope.loadingProgress = false;
        }
      });
    }

    function deleteCampaign(ev, key) {
      var campaign  = vm.campaigns[key];
      var confirm   = $mdDialog.confirm()
        .title('Are you sure to delete this campaign?')
        .htmlContent('<b>' + campaign.company + '</b>' + ' will be deleted.')
        .ariaLabel('delete campaign')
        .targetEvent(ev)
        .ok('OK')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function() {
        $rootScope.loadingProgress = true;
        api.deleteCampaign (campaign.id, function(response) {
          $rootScope.loadingProgress = false;
          if (response.code == 0) {
            vm.campaigns.splice (key, 1);
            Global.set( 'campaigns', vm.campaigns );
          }
        });
      });
    }

    function selectCampaign( campaign ) {
      Global.set( 'currentCampaign', campaign );
      Global.currentCampaign = angular.copy( campaign );
      $state.go( 'app.task_summaries' );
    }

    function goToUsers() {
      $state.go('app.users');
    }

    function getScreenshot( url ) {
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