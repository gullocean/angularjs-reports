(function() {
  'use strict';

  angular
    .module('fuse')
    .constant('ROLE', {
      ADMIN: 0,
      PM: 1,
      CLIENT: 2
    })
    .constant('DEFAULT_THEME', 'trafficTheme');
})();
