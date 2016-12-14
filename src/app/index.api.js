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

    // functions
    api.auth              = auth;
    api.getUsers          = getUsers;
    api.addUser           = addUser;
    api.deleteUser        = deleteUser;
    api.updateUser        = updateUser;
    api.getAnalyticsData  = getAnalyticsData;
    api.getParticleData   = getParticleData;

    function auth (data, callback) {
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

    function getUsers (data, callback) {
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
        console.log('get user error : ', error);
      });
    }

    function addUser (data, callback) {
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
        console.log('add user error : ', error);
      });
    }

    function deleteUser (data, callback) {
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
        console.log('delete user error : ', error);
      });
    }

    function updateUser (data, callback) {
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
        console.log('update user error : ', error);
      });
    }

    function getAnalyticsData (option, callback) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/analytics/getdata/' + option,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('get analytics data error : ', error);
      });
    }

    function getParticleData (callback) {
      $http({
        method: 'GET',
        url: 'assets/particles.json',
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('particles data load error : ', error);
      });
    }

    return api;
  }

})();
