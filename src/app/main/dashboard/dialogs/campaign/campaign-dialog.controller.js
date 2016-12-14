(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('CampaignDialogController', CampaignDialogController);

  /** @ngInject */
  function CampaignDialogController($mdDialog, msUtils, ROLE, Campaign, api) {
    var vm = this;

    // Data
    vm.title     = 'Edit Campaign';
    vm.campaign  = angular.copy(Campaign);
    vm.currentStep = 0;
    vm.cntSteps    = 3;
    
    
    vm.newCampaign = false;

    if (!vm.campaign) {
      vm.campaign = {
        'company': '',
        'url': ''
      };

      vm.title        = 'New Campaign';
      vm.newCampaign  = true;
    }

    // Methods
    vm.addNewCampaign = addNewCampaign;
    vm.saveCampaign   = saveCampaign;
    vm.closeDialog    = closeDialog;
    vm.toggleInArray  = msUtils.toggleInArray;
    vm.isFirstStep    = isFirstStep;
    vm.isLastStep     = isLastStep;
    vm.nextStep       = nextStep;
    vm.backStep       = backStep;

    //////////

    /**
     * Add new campaign
     */
    function addNewCampaign() {
      var newCampaign = {};
      newCampaign.company = vm.campaign.company;
      newCampaign.url = vm.campaign.url;
      // api.addUser(newUser, function(response) {
      //   if (response.code == 0) {
      //     closeDialog(newUser);
      //   } else {
      //     closeDialog();
      //   }
      // });
    }

    /**
     * Save user
     */
    function saveCampaign() {
      var editedCampaign = {};
      editedCampaign.company = vm.campaign.company;
      editedCampaign.url = vm.campaign.url;

      // api.updateUser(editedCampaign, function(response) {
      //   if (response.code == 0) {
      //     closeDialog(editedCampaign);
      //   } else {
      //     closeDialog();
      //   }
      // });
    }

    /**
     * Close dialog
     */
    function closeDialog(data) {
      $mdDialog.hide(data);
    }

    /**
     * Check for first step
     */
    function isFirstStep () {
      return vm.currentStep === 0;
    }

    /**
     * Check for last step
     */
    function isLastStep () {
      return vm.currentStep === (vm.cntSteps - 1);
    }

    /**
     * Go to next step
     */
    function nextStep () {
      vm.currentStep ++;
    }

    /**
     * Go to back step
     */
    function backStep () {
      vm.currentStep --;
    }
  }
})();
