(function() {
	'use strict';

	angular
		.module('app.reports', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.reports', {
				url: '/reports',
				views: {
					'content@app': {
						templateUrl: 'app/main/reports/reports.html',
						controller: 'TaskSummariesController as vm'
					}
				}
			});
	}
})();