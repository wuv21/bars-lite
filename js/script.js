var barsLiteApp = angular.module('barsLiteApp', []);

barsLiteApp.controller('MainController', function($scope) {
    $scope.quads = [];
    for (var i=0; i<4; i++) {
        $scope.quads.push({
            enabled: 'disabled',
            ctrlRows: 1
        });
    }

    $scope.absFile = "";
    $scope.csvFile = null;

    $scope.checkValid = function() {
        var mark = false;
        for (var i=0; i<$scope.quads.length; i++) {
            var q = $scope.quads[i];

            if (q.enabled == 'enabled' && q.ctrlRows > 0) {
                mark = true;
                break;
            }
        };

        if (!$scope.csvFile) {
            mark = false;
        }

        return mark;
    }

    $scope.quadsParsed = [];
    $scope.submitPlate = function() {
        var plateParsed = $scope.csvFile.split('\n');
        var plateAbs = [];
        var plateQuads = [[], [], [], []];

        for (var i=1; i<plateParsed.length; i++) {
            if (plateParsed[i].length > 0) {
                plateAbs.push(Number(plateParsed[i].split(',')[5]));
            }
        }

        var marker = 0;
        for (var i=0; i<4; i++) {
            plateQuads[0].push(plateAbs.slice(marker, marker + 6));
            plateQuads[1].push(plateAbs.slice(marker + 6, marker + 12));

            bottomHalf = marker + 48;
            plateQuads[2].push(plateAbs.slice(bottomHalf, bottomHalf + 6));
            plateQuads[3].push(plateAbs.slice(bottomHalf + 6, bottomHalf + 12));

            marker += 12;
        }

        var formatVals = function(q) {
            var qFormatted = [];
            for (var j=0; j<5; j+=2) {
                for (var i=0; i<q.length; i++) {
                    var x1 = q[i][j];
                    var x2 = q[i][j+1];

                    qFormatted.push([x1, x2]);
                }
            }

            return qFormatted;
        }

        $scope.quads.forEach(function(quad, ind) {
            if (quad.enabled == 'enabled') {
                var values = formatVals(plateQuads[ind]);

                var noV = 0.0;
                for (var i=0; i<quad.ctrlRows; i++) {
                    noV += values[values.length - 1 - i][0] + values[values.length - 1 - i][1]
                }

                for (var i=0; i<quad.ctrlRows; i++) {
                    values.pop();
                }

                noV = noV / (quad.ctrlRows * 2);

                for (var i=0; i<values.length; i++) {
                    for (var j=0; j<2; j++) {
                        var diff = values[i][j] - noV;
                        if (diff < 0) {
                            values[i][j] = 0;
                        } else {
                            values[i][j] = diff;
                        }
                    }
                }

                var noD = (values[0][0] + values[0][1]) / 2;
                values = values.slice(0, 1);

                for (var i=0; i<values.length; i++) {
                    values[i][0] = values[i][0] / noD * 100;
                    values[i][1] = values[i][1] / noD * 100;
                }

                $scope.quadsParsed[ind] = values;
            }
        });
    }
});

barsLiteApp.directive('quadinfo', function() {
    return {
        restrict: "E",
        scope: true,
        templateUrl: "template/quadinfo.html",
        link: function(scope) {
        }
    }
});

barsLiteApp.directive('validFile',function() {
  return {
    require: 'ngModel',
    link: function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change', function() {
        scope.$apply(function() {
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
});

barsLiteApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function(scope, element, attrs) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsText(changeEvent.target.files[0]);
            });
        }
    }
}]);
