(function() {
  'use strict';

  angular
    .module( 'fuse' )
    .filter( 'getById', function() {
      return function( input, id ) {
        if ( angular.isUndefined( input ) || input === null ) return null;
        if ( angular.isUndefined( id ) || id === null ) return null;

        angular.forEach( input, function( d ) {
          if ( !input.hasOwnProperty( 'id' ) ) return null;
          if ( d.id === id ) return d;
        });

        return null;
      }
    });
})();
