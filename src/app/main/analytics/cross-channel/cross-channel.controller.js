(function() {
	'use strict';

	angular
		.module('app.analytics.crossChannel')
		.controller('CrossChannelController', CrossChannelController);

	CrossChannelController.$inject = ['Global'];
	/** @ngInject */
	function CrossChannelController(Global) {
		var vm 			= this;
		vm.options 	= {};
		vm.values 	= {};
		vm.init 		= function () {
			vm.options = {
				channel: {
					chart: {
						type							: 'pieChart',
						x: function (d) { return d[0]; },
						y: function (d) { return d[1]; },
						showLabels 				: true,
						transitionDuration: 500,
						labelThreshold    : 0.01
					}
				},
				device: {
					chart: {
						type							: 'pieChart',
						x: function (d) { return d[0]; },
						y: function (d) { return d[1]; },
						showLabels				: true,
						transitionDuration: 500,
						labelThreshold    : 0.01
					}
				}
			};
			vm.values = { 
				channel: Global.analytics.channel,
				device : Global.analytics.device
			};
		}

		vm.init();
	}
})();