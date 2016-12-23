var barsLiteApp = angular.module('barsLiteApp', []);

barsLiteApp.controller('MainController', function($scope) {
    console.log('here');
    $scope.quads = [];
});

barsLiteApp.directive('quadinfo', function() {
    return {
        restrict: "E",
        scope: true,
        templateUrl: "/template/quadinfo.html",
        link: function(scope) {
            
        }
    }
});
