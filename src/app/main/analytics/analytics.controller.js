(function ()
{
    'use strict';

    angular
        .module('app.analytics')
        .controller('AnalyticsController', AnalyticsController);

    /** @ngInject */
    function AnalyticsController(AnalyticsData)
    {
        var vm = this;

        // Data
        vm.helloText = AnalyticsData.data.helloText;

        // Methods

        //////////
    }
})();
