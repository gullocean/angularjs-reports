(function() {
	'use strict';

	angular
		.module('app.dashboard.customData')
		.controller('CustomDataController', CustomDataController);

	CustomDataController.$inject = ['Global', 'api', '$state', '$mdSidenav'];
	/** @ngInject */
	function CustomDataController(Global, api, $state, $mdSidenav) {
		var vm = this;

		vm.init = function () {
			vm.user = Global.selectedAccount;
			vm.user.avatar = 'assets/images/avatars/profile.jpg';
		}
		
		vm.backToDashboard = function() {
			$state.go('app.dashboard');
		}

		vm.toggleSidenav = function (sidenavId) {
			$mdSidenav(sidenavId).toggle();
		}

		vm.init();
	}
})();