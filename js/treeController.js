(function() {
  'use strict';

  angular.module('samApp').controller('treeCtrl', function($scope, $filter, builderService) {
    $scope.measures = [{"id": 1,"title": "Measures","nodes": []}];
    $scope.dimensions = [{"id": 1,"title": "Dimensions","nodes": []}];
    $scope.keys = {};
    
    $scope.$watch( function () { return builderService.getCubeFile(); }, function ( cubeFile ) {
      $scope.measures = [{"id": 1,"title": "Measures","nodes": []}];
      if(cubeFile.cubes) {
        if(cubeFile.cubes[0].measures) {
            $scope.parseMeasures(cubeFile);
          }
        }

        var CSVData = builderService.getData();
        if (CSVData.length > 0) {
          if(cubeFile.dimensions){
            $scope.dimensions = [];
            $scope.parseDimensions(cubeFile,CSVData)
          }
        }

    },true);

     $scope.$watch( function () { return builderService.getData(); }, function ( dataFile ) {
        var cubeFile = builderService.getCubeFile();
        if(cubeFile.cubes && cubeFile.cubes[0].measures && dataFile.length > 0 && cubeFile.dimensions) {
          $scope.dimensions = [];
          $scope.parseDimensions(cubeFile,dataFile)
        }

    },true);

    $scope.parseMeasures = function(cubeFile){
      var cubeMeasures = cubeFile.cubes[0].measures;

      for(var i = 0; i < cubeMeasures.length ; i++){
        var measure = {};
        measure.id = i*10;
        measure.title = cubeMeasures[i].name;
        measure.nodes = [];
        for(var j = 0; j < cubeMeasures[i].aggregations.length ; j++){
          var aggreg = {};
          aggreg.id = i*10+j+1;
          aggreg.title =  measure.title +" - "+ cubeMeasures[i].aggregations[j];
          aggreg.nodes =[];
          measure.nodes.push(aggreg);
        }
        $scope.measures[0].nodes.push(measure);
      }
    }

    $scope.parseDimensions = function(cubeFile,CSVData){
      for(var i = 0; i < cubeFile.dimensions.length ; i++){
        $scope.keys = {};
        var dim = {};
        dim.id = i;
        dim.title = cubeFile.dimensions[i].name;
        dim.nodes =[];
        var levels = cubeFile.dimensions[i].levels;
        var index = -1;
        var prevIndex = -1;
        for(var j = 0; j < levels.length ; j++){
          var levelName = levels[j].name;
          var levelValues = [];
          var relevantData = []
          for (var k = 0; k < CSVData.length; k++) {
            if (CSVData[k][dim.title]){
              var tableHeader = CSVData[k][dim.title][0].split(",");     
              for (var l = 0; l < tableHeader.length; l++) {
                if(tableHeader[l] === levels[j].label) {
                  prevIndex = index;
                  index = l;
                  relevantData = CSVData[k][dim.title].slice(0);
                  relevantData.splice(0,1);
                }
              }
            }
          }
          for (var k = 0; k < relevantData.length; k++) {
            var rowArray = relevantData[k].split(",");
            if (levelValues.indexOf(rowArray[index]) === -1){
              levelValues.push(rowArray[index]);
              var level = {};
              level.id = i*10 + j;
              level.title = dim.title + " - " + levelName + " - " + rowArray[index]
              level.nodes = [];
              $scope.keys[rowArray[index]] = level;
              if (prevIndex === -1){
                dim.nodes.push(level);
              } else {
                var parent = rowArray[prevIndex];
                $scope.keys[parent].nodes.push(level);
              }
            }
          }
        }
        $scope.dimensions.push(dim);
      }
    }

    $scope.selectAggreg = function(item){
      var evt = window.event;
      if (evt) {
         evt.stopPropagation();
      }
      var title = $scope.cleanName(item);
      builderService.selectAggreg(title);
    }

    $scope.selectMeasure = function(item){
      var evt = window.event;
      if (evt) {
         evt.stopPropagation();
      }
      var title = $scope.cleanName(item);
      builderService.selectMeasure(title);
    }

    $scope.visible = function(item) {
      if ($scope.query && $scope.query.length > 0
        && item.title.indexOf($scope.query) == -1) {
        return false;
      }
      return true;
    };

    $scope.collapseAll = function() {
      $scope.$broadcast('collapseAll');
    };

    $scope.expandAll = function() {
      $scope.$broadcast('expandAll');
    };

    $scope.findNodes = function(){

    };

    $scope.isInCell = function(object){
      var title = $scope.cleanName(object);
      return builderService.isInCell(title);
    }

    $scope.addToBuilder = function(object){
      var evt = window.event;
      if (evt) {
         evt.stopPropagation();
      }
      var title = $scope.cleanName(object);
      builderService.addToBuilder(title);
    };

    $scope.cleanName = function(object){
      var str = object.$element[0].textContent.replace(/(\r\n|\n|\r)/gm,"");
      str = str.substring(0,str.indexOf(" Add "));
      str = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      return str;
    }

  });

})();