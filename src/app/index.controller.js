(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $cookieStore, $state, DEFAULT_THEME)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
        fuseTheming.setActiveTheme(DEFAULT_THEME);
    }
})();