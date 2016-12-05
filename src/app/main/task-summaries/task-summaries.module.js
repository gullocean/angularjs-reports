(function() {
	'use strict';

	angular
		.module('app.task-summaries', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.task_summaries', {
				url: '/task-summaries',
				views: {
					'content@app': {
						templateUrl: 'app/main/task-summaries/task-summaries.html',
						controller: 'TaskSummariesController as vm'
					}
				}
			});
	}
})();