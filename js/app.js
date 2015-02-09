(function() {
  'use strict';

  var app = angular.module('samApp', ['ui.tree','ui.bootstrap','angularFileUpload']);

  app.service('builderService', function () {
    var cell = [];
    var aggregs = [];
    var distribs = [];
    var selectedAggreg = 'Please select an aggregation to add';
    var selectedMeasure = 'Please select a measure to add';
    var addedToCell = [];
    var constraintsFile = {constraint:[]};
    var cubeFile = {};
    var dataFile = [];
    var solve = 0;
    
    return {
      setConstraints: function(constraintObject) {
        constraintsFile = constraintObject;
      },
      getConstraintsFile: function () {
        return constraintsFile;
      },
      setCube: function(cubeObject) {
        cubeFile = cubeObject;
      },
      getCubeFile: function () {
        return cubeFile;
      },
      addToData: function(fileName,fileContent) {
        var newItem = {}
        newItem[fileName] = fileContent;
        dataFile.push(newItem);
      },
      removeFromData: function(fileName) {
         for (var i = 0 ; i < dataFile.length; i++) {
            if (dataFile[i][fileName]){
                dataFile.splice(i, 1);
            }
        }
      },
      clearData: function() {
        dataFile = [];
      },
      getData: function() {
        return dataFile;
      },
      getAggregs: function () {
        return aggregs;
      },
      getDistribs: function () {
        return distribs;
      },
      getAggregDistrib: function () {
        return aggregDistrib;
      },
      getCell: function () {
        return cell;
      },
      getSolve: function () {
        return solve;
      },
      getSelectedAggreg: function () {
        return selectedAggreg;
      },
      getSelectedMeasure: function () {
        return selectedMeasure;
      },
      selectAggreg: function(str) {
        selectedAggreg = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      },
      selectMeasure: function(str) {
        selectedMeasure = str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      },
      isInCell: function(str) {
        var index = str.indexOf(" - ")
        var dimension = str.substring(0,index);
        var arrayLength = addedToCell.length;
        for (var i = 0 ; i < arrayLength ; i++){
          if (addedToCell[i] === dimension) {
            return true;
          }
        }
        return false;
      },
      revertAdd: function(str) {
        var arrayLength = addedToCell.length;
        for (var i = 0 ; i < arrayLength ; i++){
          if (addedToCell[i] === str) {
            addedToCell.splice(i, 1);
          }
        }
      },
      addToDistribs: function(title, name, value) {
        var obj = {};
        obj.title = title.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        obj.name = name.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        obj.law = value;
        obj.id = distribs.length + aggregs.length + 1;
        obj.nodes = [];
        distribs.push(obj);
      },
      addToAggregs: function(title, name, value) {
        var obj = {};
        obj.title = title.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        obj.name = name.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        obj.value = value;
        obj.id = distribs.length + aggregs.length + 1;
        obj.nodes = [];
        aggregs.push(obj);
      },
      addToBuilder: function(str) {
        var obj = {};
        obj.title = str;
        obj.id = cell.length + 1;
        obj.nodes = [];
        cell.push(obj);
        addedToCell.push(str.substring(0,str.indexOf(" - ")));
      },
      solveConstraints: function(){
        solve = solve + 1;
      },
      resetBuilder: function() {
        cell = [];
        aggregs = [];
        distribs = [];
        selectedAggreg = 'Please select an aggregation to add';
        selectedMeasure = 'Please select a measure to add';
        addedToCell = [];
      }
    };
  });

  app.controller('tabsCtrl', function ($scope, $window) {

    $scope.selectedTab = 0;

    $scope.selectTab = function(tabNumber){
      $scope.selectedTab = tabNumber;
    }
  });

  app.directive('fileUploader', function() {
    return {
      restrict: "E",
      templateUrl: 'file-uploader.html'
    };
  });

  app.directive('constraintBuilder', function() {
    return {
      restrict: "E",
      templateUrl: 'constraint-builder.html'
    };
  });

  app.directive('onReadFile', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);
              
        element.on('change', function(onChangeEvent) {          
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              fn(scope, {$fileContent:onLoadEvent.target.result});
            });
          };

          try {
              reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
          } catch (e) {
            console.error("Could not read the file")
          }
        });
      }
    }
  });


  app.directive('onReadFiles', function ($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFiles);
              
        element.on('change', function(onChangeEvent) {
          var files = (onChangeEvent.srcElement || onChangeEvent.target).files;
                  
          for (var i = 0; i < files.length; i++) {
            (function(file) {
              var reader = new FileReader();

              reader.onload = function(onLoadEvent) {
                scope.$apply(function() {
                  var fileName = (onLoadEvent.srcElement || onLoadEvent.target).fileName;
                  fn(scope, {$fileContent:fileName +"||"+ onLoadEvent.target.result});
                });
              };

              try {
                  reader.fileName = file.name.substring(0,file.name.indexOf(".csv"));
                  reader.readAsText(file);
              }
              catch (e) {
                console.error("Could not read : " + file)
              }
            })(files[i]);
          }
        });
      }
    };
  });

})();