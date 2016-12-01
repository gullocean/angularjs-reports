(function() {
  'use strict';

  angular
    .module('fuse')
    .constant('ROLE', {
      ADMIN: 0,
      PROJECT_MANAGER: 1,
      CLIENT: 2
    });
})();
