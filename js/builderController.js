(function() {
  'use strict';

  angular.module('samApp').controller('buildCtrl', function($scope, $filter, $http, builderService) {
    $scope.jsonConstraints = '{"constraint":[]}';
    $scope.jsonModel = "{}";
    $scope.jsonData = "[]";
    $scope.resultVisible = false;
    $scope.nbOfFacts = "Waiting for the solver ...";

    $scope.data = builderService.getCell();

    $scope.disableSolve = function() {
      var disable = $scope.jsonConstraints === "{}" || $scope.jsonConstraints === '{"constraint":[]}' || $scope.jsonModel === "{}" || $scope.jsonData === "[]";
      return disable;
    }

    $scope.postSolve = function() {
      $scope.resultVisible = true;
      $scope.nbOfFacts = "Waiting for the solver ...";
      var formObject = {};
      formObject['jsoncsv'] = $scope.jsonData;
      formObject['jsonmodel'] = $scope.jsonModel;
      formObject['jsonconstraints'] = $scope.jsonConstraints;
      $.post("http://localhost:5000/solve", formObject, function(response) {
        $scope.loading = false;
        $scope.nbOfFacts = $scope.updateNbOfFacts(response);
        if (response.solution) {
          builderService.setResults(response.solution)
        }
        $scope.$apply();
      }, 'json');
    }

    $scope.updateNbOfFacts = function(response) {
      var nb = $scope.getNbOfFacts(response);
      if (nb >= 0) {
        return "Number of generated rows : " + nb;
      } else {
        return "Error, the the solver's response is badly formatted";
      }
    }

    $scope.getNbOfFacts = function(response) {
      console.log(response);
      var array = response.solution;
      for (var i = 0; i < array.length; i++) {
        if (array[i].cell[0].dimension === "all" && array[i].cell[0].level === "all" && array[i].cell[0].name === "all" && array[i].aggregation[0].name === "count" && array[i].aggregation[0].percentage === 100) {
          return array[i].aggregation[0].value;
        }
      }
      return -1;
    }

    $scope.visible = function(item) {
      if ($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1) {
        return false;
      }
      return true;
    }

    $scope.addConstraint = function(){
      var constraintFile = builderService.getConstraintsFile();
      var formattedConstraint = $scope.getFormattedConstraint();
      constraintFile.constraint.push(formattedConstraint);
      builderService.resetBuilder();
      $scope.data = builderService.getCell();
      $scope.jsonConstraints = JSON.stringify(constraintFile);
      $scope.jsonModel = JSON.stringify(builderService.getCubeFile());
      $scope.jsonData = JSON.stringify(builderService.getData());
      $scope.postSolve();
    }

    $scope.getFormattedConstraint = function(){
      var aggregs = builderService.getAggregs();
      var distribs = builderService.getDistribs();
      var cell = builderService.getCell();

      var constraint = {};
      if (aggregs.length > 0) {
        constraint.aggregation = [];
        for(var i = 0; i < aggregs.length; i++) {
          var aggreg = {};
          aggreg.name = aggregs[i].name.substring(aggregs[i].name.indexOf(" - ") + 3).toLowerCase();
          if (aggregs[i].title.indexOf("%") > -1) {
            aggreg.percentage = aggregs[i].title.substring(aggregs[i].title.indexOf(" : ") + 3,aggregs[i].title.indexOf("%")).toLowerCase();
          } else {
            aggreg.value = aggregs[i].title.substring(aggregs[i].title.indexOf(" : ") + 3).toLowerCase()
          }
          constraint.aggregation.push(aggreg);
        }
      }

      constraint.cell = [{"dimension" : "all","level" : "all","name" : "all"}];

      for(var j = 0; j < cell.length; j++) {
        var cellItem = {};
        var splittedCell = cell[j].title.split(" - ");
        cellItem.dimension = splittedCell[0].toLowerCase();
        cellItem.level = splittedCell[1].toLowerCase();
        cellItem.name = splittedCell[2].toLowerCase();
        constraint.cell.push(cellItem);
      }

      if (distribs.length > 0) {
        constraint.distribution = distribs[0].law;
      }

      return constraint;
    }

    $scope.revertCellAdd = function(object){
      var str = object.$element[0].textContent.replace(/(\r\n|\n|\r)/gm,"");
      str = str.substring(0,str.indexOf(" - "));
      str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      builderService.revertAdd(str);
    };

    //Gestion avancée du drag'n'drop des parties de la contrainte
    $scope.$watch('data', function(newValue, oldValue){
      if(newValue === oldValue){
          return;
      }
      var arrayLength = $scope.data.length;
      for (var i = 0; i < arrayLength; i++) {
          if ($scope.data[i].nodes.length > 0) {
            arrayLength++;
            $scope.data.splice(i+1, 0, $scope.data[i].nodes[0]);
            $scope.data[i].nodes = [];
          }
      }
    },true);

    $scope.$watch( function () { return builderService.getConstraintsFile(); }, function ( constraintsFile ) {
      $scope.jsonConstraints = JSON.stringify(constraintsFile);
      $scope.jsonModel = JSON.stringify(builderService.getCubeFile());
      $scope.jsonData = JSON.stringify(builderService.getData());
    },true);

    $scope.$watch( function () { return builderService.getCubeFile(); }, function ( cubeFile ) {
      $scope.jsonConstraints = JSON.stringify(builderService.getConstraintsFile());
      $scope.jsonModel = JSON.stringify(cubeFile);
      $scope.jsonData = JSON.stringify(builderService.getData());
    },true);

    $scope.$watch( function () { return builderService.getData(); }, function ( dataFile ) {
      $scope.jsonConstraints = JSON.stringify(builderService.getConstraintsFile());
      $scope.jsonModel = JSON.stringify(builderService.getCubeFile());
      $scope.jsonData = JSON.stringify(dataFile);
    },true);

    $scope.$watch( function () { return builderService.getSolve(); }, function ( solve ) {
      if(!$scope.disableSolve()){
        $scope.postSolve();
      }
    },true);


  });

})();