(function() {
	'use strict';

	angular
		.module('app.analytics.crossChannel', [])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_crossChannel', {
				url: '/cross-channel',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/cross-channel/cross-channel.html',
						controller: 'CrossChannelController as vm'
					}
				}
			});
	}
})();