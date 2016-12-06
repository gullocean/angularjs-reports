(function() {
	'use strict';

	angular
		.module('app.analytics.organic')
		.controller('OrganicController', OrganicController);

	OrganicController.$inject = ['Global'];
	/** @ngInject */
	function OrganicController(Global) {
		var vm = this;
		vm.options = {};
		vm.chart = {};
		vm.pages = {};
		// Data
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true
    };
		vm.init = function () {
			vm.organic = Global.analytics.organic;
			vm.options.organic = {
				chart: {
					type:'lineChart',
					x: function(d) { return d.x; },
					y: function(d) { return d.y; }
				}
			};
			vm.pages = Global.analytics.pages;
		}
		vm.init();
	}
})();