angular.module('starter.controllers', ['starter.services'])

.controller('DashCtrl', function($rootScope, $scope, API, $timeout, $window) {
    $rootScope.$on("fetchAll", function(){
        API.getAll($rootScope.getToken()).success(function(data, status, headers, config){
            $rootScope.show("Please wait .......");
            $scope.list = [];
            for(var i = 0; i < data.length; i++){
                if(data[i].isCompleted == false){
                    $scope.list.push(data[i]);
                }
            }
            if($scope.list.length == 0){
                $scope.noData = true;
            } else {
                $scope.noData = false;
            };
            $rootScope.hide();
        }).error(function(data, status, headers, config){
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    $rootScope.$broadcast('fetchAll');
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
    $scope.markCompleted = function (id) {
        $rootScope.show("Please wait...");
        API.putItem(id,{
            isCompleted : true
        }, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

})

.controller('AddCtrl', function($scope, $rootScope, $window, API) {
        $scope.data = {
            item : ""
        };
        $scope.addNewItem = function(){
            var item = this.data.item;
            if(!item) return;
            $rootScope.show("Please wait... Creating new");
            var form = {
                item : item,
                isCompleted : false,
                user : $rootScope.getToken(),
                created : Date.now(),
                updated : Date.now()
            };
            API.saveItem(form, form.user)
                .success(function(data, status, headers, config){
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                    $scope.data.item = "";
                    $window.location.href = ("#/tab/dash");
                })
                .error(function(data, status, headers, config){
                    $rootScope.hide();
                    $rootScope.notify("Oops something went wrong!! Please try again later");
                })
        }
})
.controller('SignInCtrl', function($rootScope, $scope, API, $window, $state) {
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/tab/dash');
    }
    $scope.user = {
        email: "",
        password: ""
    };
    $scope.login = function(){
        var email = this.user.email;
        var password = this.user.password;
        if(!email || !password) {
            $rootScope.notify('Please enter valid data');
            return false;
        }
        $rootScope.show('Please wait.. logining');
        API.signin({
            email:email,
            password:password
        }).success(function(data){
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $state.go('tab.dash');
        }).error(function(error){
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }
})
.controller('SignUpCtrl', function ($rootScope, $scope, API, $window, $state) {

    $scope.user = {
        email: "",
        password: "",
        name: ""
    };

    $scope.createUser = function () {
    	var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$rootScope.notify('Please enter valid data');
        	return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $state.go('tab.dash');
        }).error(function (error) {
            $rootScope.hide();
        	if(error.error && error.error.code == 11000)
        	{
        		$rootScope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$rootScope.notify("Oops something went wrong, Please try again!");
        	}
            
        });
    }
})

.controller('AccountCtrl', function($scope, $rootScope, API, $window) {
    $rootScope.$on("fetchCompleted", function(){
        API.getAll($rootScope.getToken()).success(function(data, status, headers, config){
            $rootScope.show("Please wait .......");
            $scope.list = [];
            for(var i = 0; i < data.length; i++){
                if(data[i].isCompleted == true){
                    $scope.list.push(data[i]);
                }
            }
            if(data.length > 0 & $scope.list.length == 0){
                $scope.incomplete = true;
            } else {
                $scope.incomplete = false;
            }
            if(data.length == 0){
                $scope.noData = true;
            } else {
                $scope.noData = false;
            };
            $rootScope.hide();
        }).error(function(data, status, headers, config){
            $rootScope.hide();
            $rootScope.notify("Oops something went wrong!! Please try again later");
        });
    });
    $rootScope.$broadcast("fetchCompleted");
    $scope.deleteItem = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };

});
