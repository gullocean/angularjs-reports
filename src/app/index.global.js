(function() {
  'use strict';

  angular
    .module('fuse')
    .factory('Global', function($q, api) {

      var vm = this;

      // methods
      vm.sum       = sum;

      function sum (data, index) {
        if (angular.isUndefined(data) || data === null) return null;
        var sum = 0;
        angular.forEach (data, function (item) {
          sum += +item[index];
        });
        return sum;
      }

      return vm;
    });

})();
