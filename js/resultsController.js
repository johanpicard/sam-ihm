(function() {
  'use strict';

  angular.module('samApp').controller('resultsCtrl', function($scope, $filter, builderService) {
    $scope.formattedResults = [];
    $scope.builderResults = builderService.getResults();
    $scope.json = JSON.stringify($scope.builderResults);

    $scope.showDisclaimer = function() {
      return  $scope.formattedResults.length === 0;
    }

    $scope.convertResultsToTree = function(solution){
        $scope.formattedResults = [];
        var nbConstraints = builderService.getConstraintsFile().constraint.length;

        if (solution) {
            var listLength = solution.length;

            for(var i = 0; i < listLength ; i++){
              var cstr = {};
              cstr.id = i;
              cstr.title = "[";
              cstr.cell = solution[i].cell;
              cstr.aggregation = solution[i].aggregation;
              cstr.distribution = solution[i].distribution;
              if (i < nbConstraints) {
                cstr.realConstraint = true;
              } else {
                cstr.realConstraint = false;
              }

              for(var j = 0; j < solution[i].cell.length ; j++){
                  cstr.title += solution[i].cell[j].name;
                  if (j !== solution[i].cell.length -1){
                    cstr.title += " - ";
                  } else {
                    cstr.title += "] - ";
                  }
              }

              if (solution[i].aggregation) {
                for(var j = 0; j < solution[i].aggregation.length ; j++){
                    cstr.title += "(" + solution[i].aggregation[j].name + " : ";
                    if (!solution[i].aggregation[j].percentage) {
                      solution[i].aggregation[j].percentage = "None";
                    } 
                    cstr.title += solution[i].aggregation[j].percentage + "% = ";
                    cstr.title += solution[i].aggregation[j].value + ") ";
                 }
              }

              if (solution[i].distribution) {
                cstr.title += "(law : " + solution[i].distribution + ")";
              }

              cstr.items = []; 
              $scope.formattedResults.push(cstr);
            }
        }      
    }

    $scope.$watch( function () { return builderService.getResults(); }, function ( results ) {
      $scope.convertResultsToTree(results);
      $scope.builderResults = results;
      $scope.json = JSON.stringify($scope.builderResults);
    },true);

  });

})();