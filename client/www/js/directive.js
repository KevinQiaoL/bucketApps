angular.module('starter.directive', [])
.directive("repeat", function () {
  return {
    restrict: 'A',
    require:'ngModel',
    link: function(scope, element, attrs, ctrl){
      if(ctrl){
        var otherInput = element.inheriteData("$formCtroller")[attrs.repeat];

        var repeatValidator = function(value){
          var validaty = value === otherInput.$viewValue;
          ctrl.$setValidaty("repeat", validaty);
          return validaty ? value : undefined;
        };
        ctrl.$parsers.push(repeatValidator);
        ctrl.$formatters.push(repeatValidator);

        otherInput.$parsers.push(function (value) {
            ctrl.$setValidity("repeat", value === ctrl.$viewValue);
            return value;
        });
      }
    }
  }
})

;