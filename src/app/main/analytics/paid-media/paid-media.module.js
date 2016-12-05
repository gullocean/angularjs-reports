(function() {
	'use strict';

	angular
		.module('app.analytics.paidMedia', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_paidMedia', {
				url: '/paid-media',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/paid-media/paid-media.html',
						controller: 'PaidMediaController as vm'
					}
				}
			});
	}
})();