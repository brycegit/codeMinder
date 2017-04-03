angular.module('stackets.home', [])

  .controller('HomeController', function ($scope, $http, $window, $location, Snippets) {
    // $scope.loggedIn = Snippets.getLogStatus();
    Snippets.authenticate().then(function(response) {
      if ($window.localStorage.stacketsToken) {
        $scope.loggedIn = Snippets.setLogInStatus();
        $scope.username = response.data.name;
        $scope.imageUrl = response.data.photo;
        Snippets.getLogStatus().then(function(status) {
          $scope.loggedIn = status;
        });
      } else if (response.status = 401) {
        $location.path('/login');
        $location.replace();
      }

    }, function(err) {
      console.error(err);
    });

    var query = $location.search()
    if( query["token"] ) {
      $window.localStorage.stacketsToken = query["token"];
      $window.localStorage.userId = query["id"];
    	$scope.username = query["name"];
    	$scope.imageUrl = query["photo"] + '&oe=' + query["oe"];
    }

    var userId = $window.localStorage.userId;
    if ($window.localStorage.userId) {
      Snippets.logIn(userId);
    }

    $location.url($location.path());

  	$scope.show = true;
  	$scope.toggleShow = function() {
  		$scope.show = $scope.show ? false : true;
  	}
  	$scope.loginUser = function(email, password) {
		$http({
	        method: 'POST',
	        url: '/login',
	        data: {email: email, password: password}
		}).then(function(response){
		  $scope.loggedUserEmail = response.data.userEmail;
    }, function(err) {
      console.error(err)
    });
  }
});
