(function() {
	'use strict';

	angular
		.module('app.analytics.organic', ['nvd3', 'datatables', 'ngMaterialDateRangePicker', 'angularMoment'])
		.config(config);

	/** @ngInject */
	function config($stateProvider) {
		// State
		$stateProvider
			.state('app.analytics_organic', {
				url: '/organic',
				views: {
					'content@app': {
						templateUrl: 'app/main/analytics/organic/organic.html',
						controller: 'OrganicController as vm'
					}
				}
			});
	}
})();