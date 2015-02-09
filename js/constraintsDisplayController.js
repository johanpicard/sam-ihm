(function() {
  'use strict';

  angular.module('samApp').controller('constraintsCtrl', function($scope, $filter, builderService) {
    $scope.currConstraints = [];
    $scope.builderCstFile = builderService.getConstraintsFile();
    $scope.json = JSON.stringify($scope.builderCstFile);
    $scope.showLoadedContent = false;
    $scope.showButton = false;

    $scope.convertConstraintsToTree = function(constFile){
        $scope.currConstraints = [];

        var constraintList = constFile.constraint; 

        if (constraintList) {
            var listLength = constraintList.length;

            for(var i = 0; i < listLength ; i++){
              var cstr = {};
              cstr.id = i;
              cstr.title = "[";
              cstr.cell = constraintList[i].cell;
              cstr.aggregation = constraintList[i].aggregation;
              cstr.distribution = constraintList[i].distribution;

              for(var j = 0; j < constraintList[i].cell.length ; j++){
                  cstr.title += constraintList[i].cell[j].name;
                  if (j !== constraintList[i].cell.length -1){
                    cstr.title += " - ";
                  } else {
                    cstr.title += "] - ";
                  }
              }

              if (constraintList[i].aggregation) {
                for(var j = 0; j < constraintList[i].aggregation.length ; j++){
                    cstr.title += "(" + constraintList[i].aggregation[j].name + " : ";
                    if (constraintList[i].aggregation[j].percentage) {
                      cstr.title += constraintList[i].aggregation[j].percentage + "%) ";
                    } else if (constraintList[i].aggregation[j].value) {
                      cstr.title += constraintList[i].aggregation[j].value + ") ";
                    }
                 }
              }

              if (constraintList[i].distribution) {
                cstr.title += "(law : " + constraintList[i].distribution + ")";
              }

              cstr.items = []; 
              $scope.currConstraints.push(cstr);
            }
        }
       
    }

    $scope.$watch( function () { return builderService.getConstraintsFile(); }, function ( constFile ) {
      $scope.convertConstraintsToTree(constFile);
      $scope.builderCstFile = constFile;
      $scope.json = JSON.stringify($scope.builderCstFile);
    },true);

    $scope.$watch('currConstraints', function(newValue, oldValue){
      if (oldValue === newValue){
        return false;
      }

      $scope.builderCstFile = builderService.getConstraintsFile();
      $scope.json = JSON.stringify($scope.builderCstFile);

      if (newValue.length === 0){
        $scope.showButton = false;
      } else {
        $scope.showButton = true;
      }

      var constraintList = builderService.getConstraintsFile().constraint;

      if (constraintList) {

          var listLength = constraintList.length;

          if (newValue.length === constraintList.length -1) {

            for(var i = 0; i < listLength -1 ; i++){

              if (newValue[i].cell.length !== constraintList[i].cell.length) {
                constraintList.splice(i, 1);
                builderService.solveConstraints();
                return true;
              }
              for(var j = 0; j < constraintList[i].cell.length ; j++){
                if (newValue[i].cell[j].dimension !== constraintList[i].cell[j].dimension) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
                if (newValue[i].cell[j].level !== constraintList[i].cell[j].level) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
                if (newValue[i].cell[j].name !== constraintList[i].cell[j].name) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
              }

              if (constraintList[i].aggregation) {
                if (!newValue[i].aggregation) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
                if (newValue[i].aggregation.length !== constraintList[i].aggregation.length) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }

                for(var j = 0; j < constraintList[i].aggregation.length ; j++){
                  if (newValue[i].aggregation[j].name !== constraintList[i].aggregation[j].name) {
                    constraintList.splice(i, 1);
                    builderService.solveConstraints();
                    return true;
                  }
                  if (newValue[i].aggregation[j].percentage && !constraintList[i].aggregation[j].percentage) {
                    constraintList.splice(i, 1);
                    builderService.solveConstraints();
                    return true;
                  }
                  if (newValue[i].aggregation[j].value && !constraintList[i].aggregation[j].value) {
                    constraintList.splice(i, 1);
                    builderService.solveConstraints();
                    return true;
                  }
                  if(newValue[i].aggregation[j].percentage && constraintList[i].aggregation[j].percentage) { 
                    if(newValue[i].aggregation[j].percentage !== constraintList[i].aggregation[j].percentage) { 
                      constraintList.splice(i, 1);
                      builderService.solveConstraints();
                      return true;
                    }
                  }
                  if(newValue[i].aggregation[j].value && constraintList[i].aggregation[j].value) { 
                    if(newValue[i].aggregation[j].value !== constraintList[i].aggregation[j].value) { 
                      constraintList.splice(i, 1);
                      builderService.solveConstraints();
                      return true;
                    }
                  }
                }
              } else if (newValue[i].aggregation) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
              }

              if (constraintList[i].distribution) {
                if (!newValue[i].distribution) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
                if (constraintList[i].distribution !== newValue[i].distribution) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
                }
              } else if (newValue[i].distribution) {
                  constraintList.splice(i, 1);
                  builderService.solveConstraints();
                  return true;
              }
            }
            constraintList.splice(constraintList.length - 1, 1);
            builderService.solveConstraints();
            return true;
          }
        }
    },true);

  });

})();