(function() {
	'use strict';

	angular
		.module('app.analytics.paidMedia')
		.controller('PaidMediaController', PaidMediaController);

	PaidMediaController.$inject = ['Global'];
	/** @ngInject */
	function PaidMediaController(Global) {
		var vm 		 = this;
		vm.options = {};
		vm.values  = {};
		vm.keys		 = {};

		vm.init = function () {
			vm.options = { 
				PPC: {
					dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
		      pagingType: 'simple',
		      autoWidth: false,
		      responsive: true
		    }
			};
			vm.keys = {
				PPC: ['Campaign', 'Clicks', 'Cost', 'CTR', 'CPC', 'revenue', 'goal completions', 'conversion rate']
			};
			vm.values = {
				PPC: Global.analytics.PPC
			};
		};

		vm.init ();
	}
})();