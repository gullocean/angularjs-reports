(function() {
	'use strict';

	angular
		.module('app.task-summaries')
		.controller('TaskSummariesController', TaskSummariesController);

	TaskSummariesController.$inject = ['$document', '$mdDialog', '$mdSidenav'];
	/** @ngInject */
	function TaskSummariesController($document, $mdDialog, $mdSidenav) {
		
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

    function init () {
      // 
    }

    init ();
	}
})();