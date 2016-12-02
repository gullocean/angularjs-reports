(function() {
  'use strict';

  angular
    .module('fuse')
    .factory('api', apiService);

  /** @ngInject */
  function apiService($resource, $http, $cookieStore, $state) {
    var api = {};

    // Base Url
    api.baseUrl = 'http://reports.trafficdev.net/api/index.php';

    api.auth = function(data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/auth',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    api.getUsers = function(data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/get',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    api.addUser = function(data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/add',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    api.deleteUser = function(data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/delete',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    api.updateUser = function(data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/update',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('login error : ', error);
      });
    }

    return api;
  }

})();
