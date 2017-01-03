(function() {
	'use strict';

	angular
		.module('app.task-summaries')
		.controller('TaskSummariesController', TaskSummariesController);

	TaskSummariesController.$inject = ['$document', '$mdDialog', '$mdSidenav', 'Global', '$state', 'ROLE', 'api'];
	/** @ngInject */
	function TaskSummariesController($document, $mdDialog, $mdSidenav, Global, $state, ROLE, api) {
		
    var vm = this;

    // variables
    vm.tasks = [];
    vm.task = {};

    // methods
    vm.openTaskDialog = openTaskDialog;

    /**
     * Open new task dialog
     *
     * @param ev
     * @param task
     */
    function openTaskDialog(ev, task)
    {
      $mdDialog.show({
        controller         : 'TaskDialogController',
        controllerAs       : 'vm',
        templateUrl        : 'app/main/task-summaries/dialogs/task/task-dialog.html',
        parent             : angular.element($document.body),
        targetEvent        : ev,
        clickOutsideToClose: true,
        locals             : {
          Task : task,
          Tasks: vm.tasks,
          event: ev
        }
      });
    }

    function init() {
      if ( !Global.check( 'currentUser' ) || !Global.check( 'currentCampaign' ) ) {
        $state.go('app.pages_auth_login');
        return;
      }

      if ( Global.get( 'currentUser').role === ROLE.CLIENT ) {
        api.getCampaigns(1, function(response) {
          if (response.code === 0) {
            Global.set( 'currentCampaign', response.data);
          } else {
            console.log( 'campaigns getting error!' );
          }
        });
      }
    }

    init ();
	}
})();