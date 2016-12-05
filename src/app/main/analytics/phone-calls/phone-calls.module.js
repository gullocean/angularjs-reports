(function() {
	'use strict';

	angular
		.module('app.analytics.phoneCalls', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_phoneCalls', {
				url: '/phone-calls',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/phone-calls/phone-calls.html',
						controller: 'PhoneCallsController as vm'
					}
				}
			});
	}
})();