(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('CampaignDialogController', CampaignDialogController);

  /** @ngInject */
  function CampaignDialogController($mdDialog, msUtils, ROLE, Campaign, api, $scope) {
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
    vm.accounts     = [];

    // methods
    vm.addNewCampaign = addNewCampaign;
    vm.saveCampaign   = saveCampaign;
    vm.closeDialog    = closeDialog;
    vm.toggleInArray  = msUtils.toggleInArray;
    vm.isFirstStep    = isFirstStep;
    vm.isLastStep     = isLastStep;
    vm.nextStep       = nextStep;
    vm.backStep       = backStep;
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
    function addNewCampaign (campaign) {
      vm.progress = true;
      closeDialog (campaign);
    }

    /**
     * Save campaign
     */
    function saveCampaign (campaign) {
      vm.progress = true;
      closeDialog (campaign);
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
      vm.error.step = true;
      vm.currentStep ++;
    }

    /**
     * Go to back step
     */
    function backStep () {
      vm.currentStep --;
    }

    function getScreenshot (url) {
      if (angular.isUndefined (url)) return;
      vm.progress = true;
      api.getScreenshot (url, function (response) {
        vm.error.url  = false;
        vm.error.step = false;
        vm.progress   = false;
        vm.campaign.thumbnail = 'data:' + response.screenshot.mime_type + ';base64,' + api.decodeGoogle (response.screenshot.data);
      }, function (error) {
        vm.error.url  = true;
        vm.progress   = false;
      });
    }

    function getAnalyticsAccountList () {
      vm.progress   = true;
      api.getAnalyticsAccountList (function (response) {
        vm.progress = false;
        if (response.code == 0) {
          angular.forEach (response.data, function (r) {
            vm.accounts.push ({
              name  : r.name,
              id    : r.id
            });
          });
        }
      });
    }

    function init () {
      vm.error.step = true;
      vm.error.url  = true;
      vm.progress   = false;

      getAnalyticsAccountList ();
    }

    init ();
  }
})();
