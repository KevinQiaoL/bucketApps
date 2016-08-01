angular.module('starter.services', [])
.factory('API', function($rootScope, $http, $ionicLoading, $window, $timeout){
  var base = "http://192.168.31.113:9804";
  $rootScope.show = function(text){
    $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
  };
  $rootScope.hide = function () {
      $ionicLoading.hide();
  };
  $rootScope.notify =function(text){
      $rootScope.show(text);
      $window.setTimeout(function () {
        $rootScope.hide();
      }, 1999);
  };
  $rootScope.logout = function () {
      $rootScope.setToken("");
      $window.location.href = ('#/login');
  };
  
  $rootScope.doRefresh = function (tab) {
      if(tab == 1)
          $rootScope.$broadcast('fetchAll');
      else
          $rootScope.$broadcast('fetchCompleted');
      
      $rootScope.$broadcast('scroll.refreshComplete');
  };

  $rootScope.setToken = function (token) {
    return $window.sessionStorage.token = token;
  };

  $rootScope.getToken = function () {
    return $window.sessionStorage.token;
  };

  $rootScope.isSessionActive = function () {
    return $window.sessionStorage.token ? true : false;
  };
  return {
    signin : function(form){
      return $http.post(base + "/api/v1/auth/login", form);
    },
    signup : function(form){
      return $http.post(base + "/api/v1/auth/register", form);
    },
    getAll: function (email) {
        return $http.get(base+'/api/v1/data/list', {
            method: 'GET',
            params: {
                token: email
            }
        });
    },
    getOne: function (id, email) {
        return $http.get(base+'/api/v1/data/item/' + id, {
            method: 'GET',
            params: {
                token: email
            }
        });
    },
    saveItem: function (form, email) {
        return $http.post(base+'/api/v1/data/item', form, {
            method: 'POST',
            params: {
                token: email
            }
        });
    },
    putItem: function (id, form, email) {
        return $http.put(base+'/api/v1/data/item/' + id, form, {
            method: 'PUT',
            params: {
                token: email
            }
        });
    },
    deleteItem: function (id, email) {
        return $http.delete(base+'/api/v1/data/item/' + id, {
            method: 'DELETE',
            params: {
                token: email
            }
        });
    }
  }



});