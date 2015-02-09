(function() {
  'use strict';

  angular.module('samApp').controller('buildCtrl', function($scope, $filter, $http, builderService) {
    $scope.jsonConstraints = '{"constraint":[]}';
    $scope.jsonModel = "{}";
    $scope.jsonData = "[]";
    $scope.postData = "{}";
    $scope.iframeVisible = false;

    $scope.data = builderService.getCell();

    $scope.disableSolve = function() {
      var disable = $scope.jsonConstraints === "{}" || $scope.jsonConstraints === '{"constraint":[]}' || $scope.jsonModel === "{}" || $scope.jsonData === "[]";
      return disable;
    }

    $scope.postSolve = function() {
      $scope.iframeVisible = true;
      /*$.post("http://localhost:5000/solve", $scope.postData, function(response) {
        $scope.loading = false;
        console.log( "postSuccess !" );
        console.log(response)
      }, 'json');*/
      var formObject = {};
      formObject['jsoncsv'] = $scope.jsonData;
      formObject['jsonmodel'] = $scope.jsonModel;
      formObject['jsonconstraints'] = $scope.jsonConstraints;
      $scope.post("http://localhost:5000/solve", formObject);
    }

    $scope.post = function(path, params, method) {
      method = method || "post"; // Set method to post by default if not specified.

      var form = document.createElement("form");
      form.setAttribute("method", method);
      form.setAttribute("action", path);
      form.setAttribute("target", "dummyiframe");

      for(var key in params) {
          if(params.hasOwnProperty(key)) {
              var hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("name", key);
              hiddenField.setAttribute("value", params[key]);

              form.appendChild(hiddenField);
           }
      }

      document.body.appendChild(form);
      form.submit();

      var formResult = document.createElement("form");
      formResult.setAttribute("method", method);
      formResult.setAttribute("action", path);
      formResult.setAttribute("target", "resultIframe");

      for(var key in params) {
          if(params.hasOwnProperty(key)) {
              var hiddenFieldResult = document.createElement("input");
              hiddenFieldResult.setAttribute("type", "hidden");
              hiddenFieldResult.setAttribute("name", key);
              hiddenFieldResult.setAttribute("value", params[key]);

              formResult.appendChild(hiddenFieldResult);
           }
      }

      document.body.appendChild(formResult);
      formResult.submit();
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
      //$scope.postData = [('jsonmodel',builderService.getCubeFile()), ('jsoncsv',builderService.getData()),('jsonconstraints',builderService.getConstraintsFile())];
    },true);

    $scope.$watch( function () { return builderService.getCubeFile(); }, function ( cubeFile ) {
      $scope.jsonConstraints = JSON.stringify(builderService.getConstraintsFile());
      $scope.jsonModel = JSON.stringify(cubeFile);
      $scope.jsonData = JSON.stringify(builderService.getData());
      //$scope.postData = [('jsonmodel',builderService.getCubeFile()), ('jsoncsv',builderService.getData()),('jsonconstraints',builderService.getConstraintsFile())];
    },true);

    $scope.$watch( function () { return builderService.getData(); }, function ( dataFile ) {
      $scope.jsonConstraints = JSON.stringify(builderService.getConstraintsFile());
      $scope.jsonModel = JSON.stringify(builderService.getCubeFile());
      $scope.jsonData = JSON.stringify(dataFile);
      //$scope.postData = [('jsonmodel',builderService.getCubeFile()), ('jsoncsv',builderService.getData()),('jsonconstraints',builderService.getConstraintsFile())];
    },true);

    $scope.$watch( function () { return builderService.getSolve(); }, function ( solve ) {
      if(!$scope.disableSolve()){
        $scope.postSolve();
      }
    },true);


  });

})();