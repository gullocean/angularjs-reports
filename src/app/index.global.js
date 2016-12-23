(function() {
  'use strict';

  angular
    .module('fuse')
    .factory('Global', function($q, api) {

      var vm = this;

      vm.getReport  = getReport;
      vm.sum        = sum;

      function getReport (query) {
        var promise = $q.defer();

        api.getAnalytics (query, function (response) {
          if (response.code == 0) {
            promise.resolve (response);
          } else {
            promise.reject (response);
          } 
        });

        return promise.promise;
      }

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
