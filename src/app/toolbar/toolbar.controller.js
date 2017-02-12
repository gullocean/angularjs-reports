(function() {
  'use strict';

  angular
    .module('app.toolbar')
    .controller('ToolbarController', ToolbarController);

  /** @ngInject */
  ToolbarController.$inject = ['$rootScope', '$q', '$state', '$timeout', '$mdSidenav', '$translate', '$mdToast', 'msNavigationService', 'Global', 'ROLE', '$scope', 'api'];
  function ToolbarController($rootScope, $q, $state, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService, Global, ROLE, $scope, api) {
    var vm = this;

    // Data
    $rootScope.global = {
      search: ''
    };

    vm.black_logo_path = Global.black_logo_path;

    vm.bodyEl = angular.element('body');
    vm.userStatusOptions = [{
      'title': 'Online',
      'icon': 'icon-checkbox-marked-circle',
      'color': '#4CAF50'
    }, {
      'title': 'Away',
      'icon': 'icon-clock',
      'color': '#FFC107'
    }, {
      'title': 'Do not Disturb',
      'icon': 'icon-minus-circle',
      'color': '#F44336'
    }, {
      'title': 'Invisible',
      'icon': 'icon-checkbox-blank-circle-outline',
      'color': '#BDBDBD'
    }, {
      'title': 'Offline',
      'icon': 'icon-checkbox-blank-circle-outline',
      'color': '#616161'
    }];
    vm.languages = {
      en: {
        'title': 'English',
        'translation': 'TOOLBAR.ENGLISH',
        'code': 'en',
        'flag': 'us'
      },
      es: {
        'title': 'Spanish',
        'translation': 'TOOLBAR.SPANISH',
        'code': 'es',
        'flag': 'es'
      },
      tr: {
        'title': 'Turkish',
        'translation': 'TOOLBAR.TURKISH',
        'code': 'tr',
        'flag': 'tr'
      }
    };

    vm.campaigns        = {};
    vm.currentUser      = {};
    vm.users            = [];
    vm.selectedCampaign = {};
    vm.selectedUser     = {};

    // Methods
    vm.isClient = isClient;
    vm.logout = api.logout;
    vm.toggleSidenav  = toggleSidenav;
    vm.changeLanguage = changeLanguage;
    vm.setUserStatus  = setUserStatus;
    vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
    vm.toggleMsNavigationFolded   = toggleMsNavigationFolded;
    vm.search         = search;
    vm.searchResultClick = searchResultClick;
    vm.checkCampaign  = checkCampaign;
    vm.onLogo         = onLogo;
    vm.isClient       = isClient;
    vm.selectCampaign = selectCampaign;

    //////////

    init();

    /**
     * Initialize
     */
    function init() {
      // Select the first status as a default
      vm.userStatus = vm.userStatusOptions[0];

      if ( Global.check( 'currentUser' ) ) {
        vm.currentUser = Global.get( 'currentUser' );
      } else {
        console.log( 'There is no currentUser!' );
        api.logout();
        return;
      }

      // if ( Global.check( 'selectedCampaign' ) ) {
      //   vm.selectedCampaign = Global.get( 'selectedCampaign' );
      // } else {
      //   console.log( 'There is no selectedCampaign!' );
      //   api.logout();
      //   return;
      // }

      // if ( Global.check( 'campaigns' ) ) {
      //   vm.campaigns = Global.get( 'campaigns' );
      // } else {
      //   console.log( 'There is no campaigns!' );
      //   api.logout();
      //   return;
      // }

      // Get the selected language directly from angular-translate module setting
      vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
    }

    /**
     * Check if role of current user is client
     * @returns true or false
     */
    function isClient() {
      return vm.currentUser.role === ROLE.CLIENT;
    }

    /**
     * Toggle sidenav
     *
     * @param sidenavId
     */
    function toggleSidenav(sidenavId) {
      $mdSidenav(sidenavId).toggle();
    }

    /**
     * Sets User Status
     * @param status
     */
    function setUserStatus(status) {
      vm.userStatus = status;
    }

    /**
     * Change Language
     */
    function changeLanguage(lang) {
      vm.selectedLanguage = lang;

      /**
       * Show temporary message if user selects a language other than English
       *
       * angular-translate module will try to load language specific json files
       * as soon as you change the language. And because we don't have them, there
       * will be a lot of errors in the page potentially breaking couple functions
       * of the template.
       *
       * To prevent that from happening, we added a simple "return;" statement at the
       * end of this if block. If you have all the translation files, remove this if
       * block and the translations should work without any problems.
       */
      if (lang.code !== 'en') {
        var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

        $mdToast.show({
          template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
          hideDelay: 7000,
          position: 'top right',
          parent: '#content'
        });

        return;
      }

      // Change the language
      $translate.use(lang.code);
    }

    /**
     * Toggle horizontal mobile menu
     */
    function toggleHorizontalMobileMenu() {
      vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
    }

    /**
     * Toggle msNavigation folded
     */
    function toggleMsNavigationFolded() {
      msNavigationService.toggleFolded();
    }

    /**
     * Search action
     *
     * @param query
     * @returns {Promise}
     */
    function search(query) {
      var navigation = [],
        flatNavigation = msNavigationService.getFlatNavigation(),
        deferred = $q.defer();

      // Iterate through the navigation array and
      // make sure it doesn't have any groups or
      // none ui-sref items
      for (var x = 0; x < flatNavigation.length; x++) {
        if (flatNavigation[x].uisref) {
          navigation.push(flatNavigation[x]);
        }
      }

      // If there is a query, filter the navigation;
      // otherwise we will return the entire navigation
      // list. Not exactly a good thing to do but it's
      // for demo purposes.
      if (query) {
        navigation = navigation.filter(function(item) {
          if (angular.lowercase(item.title).search(angular.lowercase(query)) > -1) {
            return true;
          }
        });
      }

      // Fake service delay
      $timeout(function() {
        deferred.resolve(navigation);
      }, 1000);

      return deferred.promise;
    }

    /**
     * Search result click action
     *
     * @param item
     */
    function searchResultClick(item) {
      // If item has a link
      if (item.uisref) {
        // If there are state params,
        // use them...
        if (item.stateParams) {
          $state.go(item.state, item.stateParams);
        } else {
          $state.go(item.state);
        }
      }
    }

    /**
     * check if a campaign is selected
     */
    function checkCampaign() {
      return Global.check( 'selectedCampaign' );
    }

    /**
     * when click logo
     */
    function onLogo() {
      if ( !Global.check( 'currentUser' ) )
        api.logout();

      if ( vm.currentUser.role !== ROLE.CLIENT )
        $state.go( 'app.campaigns' );
    }

    /**
     * check if currentUser is client or not
     */
    function isClient() {
      if ( vm.currentUser.role === ROLE.CLIENT )
        return true;
      return false;
    }

    function selectCampaign( campaign ) {
      vm.selectedCampaign = campaign;
      Global.set('selectedCampaign', campaign);
    }

    /**
     * watch if Global.currentCampaign and currentUser is changed or not
     */
    $scope.$watch( function() {
      return Global.currentUser;
    }, function( newValue, oldValue ){
      vm.currentUser = angular.copy( Global.get( 'currentUser' ) );
    });

    $scope.$watch( function() {
      return Global.campaigns;
    }, function( newCampaigns, oldCampaigns ) {
      vm.campaigns = newCampaigns;
    });

    $scope.$watch( function() {
      return Global.selectedCampaign;
    }, function( newCampaign, oldCampaign ) {
      vm.selectedCampaign = newCampaign;
    });
  }
})();
