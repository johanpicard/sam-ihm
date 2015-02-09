(function() {
  'use strict';

  angular.module('samApp').controller('aggregCtrl', function($scope, builderService) {
    $scope.aggregations = builderService.getAggregs();
    $scope.distributions = builderService.getDistribs();

    $scope.$watch( function () { return builderService.getSelectedAggreg(); }, function ( selectAggreg ) {
      $scope.selectedItem = selectAggreg;
    });

    $scope.$watch( function () { return builderService.getAggregs(); }, function ( aggregs ) {
      $scope.aggregations = aggregs;
    });

    $scope.$watch( function () { return builderService.getDistribs(); }, function ( distribs ) {
      $scope.distributions = distribs;
    });

    $scope.$watch( function () { return builderService.getSelectedMeasure(); }, function ( selectMeasure ) {
      $scope.selectedMeasure = selectMeasure;
    });

    $scope.isPercentage = true;

    $scope.percentValue;
    $scope.lawParameters;

    $scope.status = {
      isopen: false
    };

    $scope.disableAddConstraint = function() {
      var disable = builderService.getAggregs().length === 0 && builderService.getDistribs().length === 0;
      return disable;
    }

    $scope.canAddAggreg = function(){
      var notEmpty = $scope.selectedItem !== "Please select an aggregation to add";
      var percent = $scope.isPercentage && $scope.percentValue >= 0 && $scope.percentValue <= 100;
      var value = !$scope.isPercentage && $scope.percentValue >= 0;
      return notEmpty && (percent || value);
    }

    $scope.emptyAggreg = function(){
      return $scope.selectedItem === "Please select an aggregation to add";
    }

    $scope.canAddDistrib = function(){
      return $scope.selectedMeasure !== "Please select a measure to add";
    }

    $scope.submitAggreg = function(object){
      if ($scope.isPercentage){
        builderService.addToAggregs($scope.selectedItem+" : "+$scope.percentValue+"%",$scope.selectedItem,$scope.percentValue);
      } else {
        builderService.addToAggregs($scope.selectedItem+" : "+$scope.percentValue,$scope.selectedItem,$scope.percentValue);
      }

      builderService.selectAggreg("Please select an aggregation to add");
    };

    $scope.submitDistrib = function(object){
      builderService.addToDistribs($scope.selectedMeasure+" law : "+$scope.lawParameters,$scope.selectedMeasure,$scope.lawParameters);
      builderService.selectMeasure("Please select a measure to add");
    };

  });

})();