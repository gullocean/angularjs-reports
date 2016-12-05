(function() {
	'use strict';

	angular
		.module('app.analytics.goalCompletions', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_goalCompletions', {
				url: '/goal-completions',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/goal-completions/goal-completions.html',
						controller: 'GoalCompletionsController as vm'
					}
				}
			});
	}
})();