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
    vm.currentUser = {};

    // methods
    vm.openTaskDialog = openTaskDialog;
    vm.toggleSidenav = toggleSidenav;

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
        templateUrl        : 'app/main/dialogs/task/task-dialog.html',
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

    /**
     * Toggle completed status of the task
     *
     * @param task
     * @param event
     */
    function toggleCompleted(task, event)
    {
      event.stopPropagation();
      task.completed = !task.completed;
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId)
    {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * Initialize the controller
     */
    function init() {
      if ( !Global.check( 'currentUser' ) ) {
        $state.go('app.pages_auth_login');
        return;
      }

      vm.currentUser = Global.get( 'currentUser' );

      if ( vm.currentUser.role === ROLE.CLIENT ) {
        api.getCampaigns( vm.currentUser.campaignID, function( response ) {
          if ( response.code === 0 ) {
            Global.currentCampaign = response.data;
            Global.set( 'currentCampaign', Global.currentCampaign);
          } else {
            console.log( 'campaigns getting error!' );
          }
        });
      }
    }

    init ();
	}
})();
