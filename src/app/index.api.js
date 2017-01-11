(function() {
  'use strict';

  angular
    .module('fuse')
    .factory('api', apiService);

  /** @ngInject */
  function apiService( $resource, $http, $state, $rootScope, $mdDialog, $q, Global ) {

    var api = {};

    // Base Url
    api.baseUrl = 'http://reports.trafficdev.net/api/index.php';
    api.key     = 'AIzaSyAxPOleU-4DCd0oWx7sTAXuCH2ftnJw7qM';

    // functions
    api.auth              = auth;
    api.logout            = logout;
    api.getUser           = getUser;
    api.getUsers          = getUsers;
    api.addUser           = addUser;
    api.deleteUser        = deleteUser;
    api.updateUser        = updateUser;
    api.getAnalyticsData  = getAnalyticsData;
    api.getAnalytics      = getAnalytics;
    api.getParticleData   = getParticleData;
    api.getCampaigns      = getCampaigns;
    api.getScreenshot     = getScreenshot;
    api.getScreenshots    = getScreenshots;
    api.decodeGoogle      = decodeGoogle;
    api.addCampaign       = addCampaign;
    api.updateCampaign    = updateCampaign;
    api.deleteCampaign    = deleteCampaign;
    api.getReport         = getReport;
    api.checkViewID       = checkViewID;
    api.checkEmail        = checkEmail;
    api.getAnalyticsAccountList = getAnalyticsAccountList;

    function auth( data, callback ) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/auth',
        data: $.param( data ),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success( function( response ) {
        callback( response );
      }).error( function( error ) {
        console.log('login error : ', error);
      });
    }

    function logout() {
      $http({
        method: 'GET',
        url: api.baseUrl + '/users/logout',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).error( function( error ) {
        console.log('logout error : ', error);
      });
    }

    function getUser( id, callback ) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/users/get/' + id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success( function( response ) {
        callback( response );
      }).error( function( error ) {
        console.log('get user error : ', error);
      });
    }

    function getUsers( callback ) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/users/get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success( function( response ) {
        callback( response );
      }).error( function( error ) {
        console.log('get user error : ', error);
      });
    }

    function addUser (data, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/users/add',
        data: $.param(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('add user error : ', error);
      });
    }

    function deleteUser (id, callback) {
      $http({
        method: 'DELETE',
        url: api.baseUrl + '/users/delete/' + id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
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
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
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
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('get analytics data error : ', error);
      });
    }

    function getAnalytics (query, callback) {
      $http({
        method: 'POST',
        url: api.baseUrl + '/analytics/get',
        data : $.param(query),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        $rootScope.loadingProgress = false;
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

    function addCampaign (campaign, callback) {
      $http({
        method: 'POST',
        data : $.param (campaign),
        url: api.baseUrl + '/campaigns/add',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('add campaigns error : ', error);
      });
    }

    function updateCampaign(campaign, callback) {
      $http({
        method: 'POST',
        data : $.param (campaign),
        url: api.baseUrl + '/campaigns/update',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('add campaigns error : ', error);
      });
    }

    function deleteCampaign (campaignID, callback) {
      $http({
        method: 'DELETE',
        url: api.baseUrl + '/campaigns/delete/' + campaignID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success (function (response) {
        callback (response);
      }).error (function (error) {
        console.log ('delete campaign error', campaignID);
      });
    }

    function getCampaigns (id, callback) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/campaigns/get/' + id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success(function(response) {
        callback(response);
      }).error(function(error) {
        console.log('get campaigns error : ', error);
      });
    }

    function getScreenshot (url, callback, errorCallback) {
      $http({
        method: 'GET',
        url : 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + url + '&key' + api.key + '&screenshot=true&rule=USABILITY',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success (function (response) {
        callback (response);
      }).error (function (error) {
        errorCallback (error);
        console.log('can not get screenshot of ' + url + ' error : ' + error);
      });
    }

    function getScreenshots (url) {
      var promise = $q.defer ();

      getScreenshot (url, function (response) {
        if (response.code == 0) {
          promise.resolve (response);
        } else {
          promise.reject (response);
        }
      }, function (error) {
        console.log (error);
      });

      return promise.promise;
    }

    function decodeGoogle (str) {
      if (angular.isUndefined (str) || str === null) {
        return null;
      }

      var ret = str.replace(/_/g, '/');
      ret = ret.replace(/-/g, '+');
      return ret;
    }

    function getReport (query) {
      var promise = $q.defer();

      getAnalytics (query, function (response) {
        if (response.code == 0) {
          promise.resolve (response);
        } else {
          promise.reject (response);
        } 
      });

      return promise.promise;
    }

    function checkViewID (viewID, callback) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/analytics/checkID/' + viewID,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success (function (response) {
        callback (response);
      }).error (function (error) {
        console.log('viewID check error', error);
      });
    }

    function getAnalyticsAccountList (callback) {
      $http({
        method: 'GET',
        url: api.baseUrl + '/analytics/getAccountList',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).success (function (response) {
        callback (response);
      }).error (function (error) {
        console.log ('can not get analytics account list!');
      });
    }

    function checkEmail(email, callback) {
      $http({
        method  : 'POST',
        url     : api.baseUrl + '/users/check',
        data    : $.param({email : email}),
        headers : {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token'       : Global.get( 'token' )
        }
      }).then(function(response) {
        callback(response);
      }, function(error) {
        $rootScope.loadingProgress = true;
        console.log('can not check email : ' + email);
      });
    }

    return api;
  }

})();
