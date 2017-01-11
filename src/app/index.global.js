(function() {
  'use strict';

  angular
    .module( 'fuse' )
    .factory( 'Global', function( $cookies, $state ) {

      var vm = this;

      // variables
      vm.black_logo_path = 'assets/images/logos/traffic-logo-black.png';

      // methods
      vm.sum        = sum;
      vm.set        = set;
      vm.get        = get;
      vm.check      = isExist;
      vm.remove     = remove;
      vm.removeAll  = removeAll;
      vm.isValid    = isValid;
      vm.goToCampaigns = goToCampaigns;

      function sum ( data, index ) {
        if ( !isValid( data ) || !isValid( index ) ) return null;
        var sum = 0;
        angular.forEach ( data, function ( item ) {
          sum += +item[index];
        });
        return sum;
      }

      function set( key, param ) {
        if ( !isValid( key ) || !isValid( param ) ) {
          console.error( 'global set error!' );
          return;
        }

        if ( angular.isObject( param ) )
          $cookies.putObject( key, param );
        else
          $cookies.put( key, param );
      }

      function get( key ) {
        if ( !isValid( key ) ) {
          console.error( 'global get error!' );
          return;
        }
        if ( !angular.isString( key ) ) {
          console.error( 'global get requires string key!' );
          return false;
        }
        if ( isObject( key ) ) return $cookies.getObject( key );
        return $cookies.get( key );
      }

      function remove( key ) {
        if ( !isValid( key ) ) {
          console.error( 'global delete error!' );
          return;
        }
        if ( !angular.isString( key ) ) {
          console.error( 'global remove requires string key!' );
          return false;
        }
        $cookies.remove( key );
      }

      function isValid( param ) {
        if ( angular.isUndefined(param) || param === null ) return false;
        return true;
      }

      function isExist( key ) {
        if ( !isValid( key ) ) {
          console.error( 'global isExist error!' );
          return false;
        }
        if ( !angular.isString( key ) ) {
          console.error( 'global isExist requires string key!' );
          return false;
        }
        var cookies = $cookies.getAll();
        return cookies.hasOwnProperty( key );
      }

      function isObject( key ) {
        if ( !isValid( key ) ) {
          console.error( 'global isObject error!' );
          return false;
        }
        if ( !angular.isString( key ) ) {
          console.error( 'global isObject requires string key!' );
          return false;
        }
        if ( !isExist( key ) ) return false;
        var reg_json = /^[a-zA-Z0-9_.-]*$/;
        if ( reg_json.test( $cookies.getAll()[ key ] ) )
          return false;
        else
          return true;
      }

      function getAll() {
        return $cookies.getAll();
      }

      function removeAll() {
        angular.forEach( getAll(), function( cookie, key ) {
          remove( key );
        });
      }

      function goToCampaigns() {
        $state.go('app.campaigns');
      }

      function init() {
        // console.log( getAll() );
        // console.log( get( 'campaigns' ) );
        // console.log( get( 'currentUser' ) );
        // console.log( get( 'selectedTheme' ) );
      }

      init();

      return vm;
    });

})();
