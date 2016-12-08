(function() {
	'use strict';

	angular
		.module('app.analytics.phoneCalls')
		.controller('PhoneCallsController', PhoneCallsController);

	PhoneCallsController.$inject = ['$scope', 'Global'];
	/** @ngInject */
	function PhoneCallsController($scope, Global) {
		var vm = this;
		vm.values = {};

		vm.init = function () {
			if (angular.isUndefined(Global.analytics) || Global.analytics === null) return;
			if (angular.isUndefined(Global.analytics.phone) || Global.analytics.phone === null) return;
			vm.values.phone = Global.analytics.phone;
		}

		vm.init ();
	}
})();