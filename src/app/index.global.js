(function() {
  'use strict';

  angular
    .module('fuse')
    .factory('Global', function($q, api) {

      var vm = this;

      vm.getReport = getReport;

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
      return vm;
    });

})();
