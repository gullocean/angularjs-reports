(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('CampaignDialogController', CampaignDialogController);

  /** @ngInject */
  function CampaignDialogController($mdDialog, msUtils, ROLE, Campaign, api) {
    var vm = this;

    // variables
    vm.title        = 'Edit Campaign';
    vm.campaign     = angular.copy(Campaign);
    vm.currentStep  = 0;
    vm.cntSteps     = 3;
    vm.newCampaign  = false;
    vm.imgCampaign  = null;
    vm.error        = {};
    vm.progress     = false;

    // methods
    vm.addNewCampaign = addNewCampaign;
    vm.saveCampaign   = saveCampaign;
    vm.closeDialog    = closeDialog;
    vm.toggleInArray  = msUtils.toggleInArray;
    vm.isFirstStep    = isFirstStep;
    vm.isLastStep     = isLastStep;
    vm.nextStep       = nextStep;
    vm.backStep       = backStep;
    vm.checkUrl       = checkUrl;
    vm.getScreenshot  = getScreenshot;

    if (!vm.campaign) {
      vm.campaign = {
        company   : '',
        url       : '',
        view_ID   : '',
        thumbnail : ''
      };

      vm.title        = 'New Campaign';
      vm.newCampaign  = true;
    }

    /**
     * Add new campaign
     */
    function addNewCampaign() {
      vm.progress = true;
      api.addCampaign (vm.campaign, function (response) {
        if (response.code == 0) {
          console.log(vm.campaign);
          closeDialog (vm.campaign);
        } else {
          closeDialog ();
        }
        vm.progress = false;
      });
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
    function closeDialog (data) {
      $mdDialog.hide (data);
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

    function checkUrl (url) {
      api.checkUrl (url, function (response) {
        console.log (response);
      });
    }

    function getScreenshot (url) {
      if (angular.isUndefined (url)) return;
      vm.progress = true;
      api.getScreenshot (url, function (response) {
        vm.error.url = false;
        vm.progress = false
        vm.campaign.thumbnail = 'data:' + response.screenshot.mime_type + ';base64,' + api.decodeGoogle (response.screenshot.data);
      }, function (error) {
        vm.error.url = true;
        vm.progress = false
      });
    }

    function init () {
      vm.error.url = true;
      vm.progress = false
    }

    init ();
  }
})();
