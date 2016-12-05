(function() {
	'use strict';

	angular
		.module('app.analytics.value', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_value', {
				url: '/value',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/value/value.html',
						controller: 'ValueController as vm'
					}
				}
			});
	}
})();