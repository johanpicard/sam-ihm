(function() {
  'use strict';

  angular.module('samApp').controller('constraintsUploadCtrl', ['$scope', 'FileUploader', 'builderService',function($scope, FileUploader, builderService) {
        $scope.jsonFail = false;
        $scope.queueFail = false;
        $scope.error = false;
        $scope.fileContent = "Empty";
        $scope.showLoadedContent = false;
        $scope.loadedContent = JSON.stringify(builderService.getConstraintsFile(),undefined, 2);
        
        $scope.$watch( function () { return builderService.getConstraintsFile(); }, function ( constraintsFile ) {
          $scope.loadedContent = JSON.stringify(constraintsFile,undefined, 2);
        },true);

        $scope.showContent = function($fileContent){
            $scope.fileContent = $fileContent;
        };

        $scope.setConstraints = function(){
            if ($scope.fileContent !== "Empty") {
                var constraintObject = JSON.parse($scope.fileContent);
                if (constraintObject.constraint) {
                    builderService.setConstraints(constraintObject);
                    return true;
                } else {
                  $scope.error = true;
                  $scope.fileContent = "Empty";
                  return false;
                }
            } else {
                $scope.error = true;
                return false;
            }
        };

        $scope.removeItem = function(){
            $scope.jsonFail = false;
            $scope.queueFail = false;
            $scope.error = false;
            $scope.contentLoaded = false;
            var emptyObject = {};
            builderService.setConstraints(emptyObject);
        }

        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS
        uploader.filters.push({
            name: 'queueLimit',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 1;
            }
        });

        uploader.filters.push({
            name:'jsonFilter',
            fn:function(item /*{File|FileLikeObject}*/, options) {
                var name = item.name.toLowerCase();
                return name.indexOf(".json") > -1;
            }
        });

        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
           // console.info('onWhenAddingFileFailed', item, filter, options);
            if (filter.name === "jsonFilter") {
                $scope.jsonFail = true;
            } else if (filter.name === "queueLimit") {
                $scope.queueFail = true;
            }
        };
        uploader.onAfterAddingFile = function(fileItem) {
          //  console.info('onAfterAddingFile', fileItem);
            $scope.jsonFail = false;
            $scope.queueFail = false;
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
         //   console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.jsonFail = false;
            $scope.queueFail = false;
            $scope.error = false;
            if (response === "Error") {
              $scope.error = true;
            }
            if(!$scope.setConstraints()){
              this.queue[0].isError = true;
              this.queue[0].isSuccess = false;
              this.queue[0].isUploaded = false;
            } else {
              $scope.contentLoaded = true;
            }
        };
    }]);

    angular.module('samApp').controller('cubeUploadCtrl', ['$scope', 'FileUploader', 'builderService',function($scope, FileUploader, builderService) {
        $scope.jsonFail = false;
        $scope.queueFail = false;
        $scope.error = false;
        $scope.fileContent = "Empty";
        $scope.showLoadedContent = false;
        $scope.contentLoaded = false;
        $scope.loadedContent = JSON.stringify(builderService.getCubeFile(),undefined, 2);
        
        $scope.$watch( function () { return builderService.getCubeFile(); }, function ( cubeFile ) {
          $scope.loadedContent = JSON.stringify(cubeFile,undefined, 2);
        });
                    

        $scope.showContent = function($fileContent){
            $scope.fileContent = $fileContent;
        };

        $scope.setCube = function(){
            if ($scope.fileContent !== "Empty") {
                var cubeObject = JSON.parse($scope.fileContent);
                if (cubeObject.dimensions && cubeObject.cubes) {
                    builderService.setCube(cubeObject);
                    return true;
                } else {
                  $scope.error = true;
                  $scope.fileContent = "Empty";
                  return false;
                }
            } else {
                $scope.error = true;
                return false;
            }
        };

        $scope.removeItem = function(){
            $scope.jsonFail = false;
            $scope.queueFail = false;
            $scope.error = false;
            $scope.contentLoaded = false;
            var emptyObject = {};
            builderService.setCube(emptyObject);
        }

        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name: 'queueLimit',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 1;
            }
        });

        uploader.filters.push({
            name:'jsonFilter',
            fn:function(item /*{File|FileLikeObject}*/, options) {
                var name = item.name.toLowerCase();
                return name.indexOf(".json") > -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
          //  console.info('onWhenAddingFileFailed', item, filter, options);
            if (filter.name === "jsonFilter") {
                $scope.jsonFail = true;
            } else if (filter.name === "queueLimit") {
                $scope.queueFail = true;
            }
        };
        uploader.onAfterAddingFile = function(fileItem) {
          //  console.info('onAfterAddingFile', fileItem);
            $scope.jsonFail = false;
            $scope.queueFail = false;
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
          //  console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.jsonFail = false;
            $scope.queueFail = false;
            $scope.error = false;
            if (response === "Error") {
              $scope.error = true;
            }
            if(!$scope.setCube()){
              this.queue[0].isError = true;
              this.queue[0].isSuccess = false;
              this.queue[0].isUploaded = false;
            } else {
              $scope.contentLoaded = true;
            }
        };
    }]);

    angular.module('samApp').controller('csvUploadCtrl', ['$scope', 'FileUploader', 'builderService',function($scope, FileUploader, builderService) {
        $scope.csvFail = false;
        $scope.alreadyExists = false;        
        $scope.error = false;
        $scope.fileContent = [];

        $scope.showContent = function($fileContent){
            var fileItem = {};
            fileItem.name = $fileContent.substring(0,$fileContent.indexOf("||"));
            fileItem.content = $fileContent.substring($fileContent.indexOf("||")+2);
            $scope.fileContent.push(fileItem);
        };

        $scope.addToData = function(fileName){
            var content;
            for (var i = 0 ; i < $scope.fileContent.length;i++) {
                if ($scope.fileContent[i].name === fileName){
                    content = $scope.fileContent[i].content;
                }
            }

            var data = [];
            if (content.split("\r\n").filter(Boolean).length !== 1)
                data = content.split("\r\n").filter(Boolean);
            else if (content.split("\n").filter(Boolean).length !== 1)
                data = content.split("\n").filter(Boolean);
            else if (content.split("\r").filter(Boolean).length !== 1)
                data =content.split("\r").filter(Boolean);
            else {
                $scope.error = true;
                return false;
            }

            if (true) {
                builderService.addToData(fileName,data);
                return true;
            } else {
              $scope.error = true;
              return false;
            }

        };

        $scope.removeItem = function(item){
            var itemName = item.item.file.name.substring(0,item.item.file.name.indexOf(".csv"));
            $scope.csvFail = false;
            $scope.error = false;
            $scope.alreadyExists = false;  
            for (var i = 0 ; i < $scope.fileContent.length; i++) {
                if ($scope.fileContent[i].name === itemName){
                    $scope.fileContent.splice(i, 1);
                }
            }
            builderService.removeFromData(itemName);
        }

        $scope.clearData = function(){
            $scope.fileContent = [];
            builderService.clearData();
        }

        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS

        uploader.filters.push({
            name:'csvFilter',
            fn:function(item /*{File|FileLikeObject}*/, options) {
                var name = item.name.toLowerCase();
                return name.indexOf(".csv") > -1;
            }
        });

        uploader.filters.push({
            name:'itemExistsFilter',
            fn:function(item /*{File|FileLikeObject}*/, options) {
               var name = item.name.substring(0,item.name.indexOf(".csv"));

                for (var i = 0 ; i < $scope.fileContent.length; i++) {
                    if ($scope.fileContent[i].name === name){
                        return false;
                    }
                }
                return true;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
           // console.info('onWhenAddingFileFailed', item, filter, options);
            if (filter.name === "csvFilter") {
                $scope.csvFail = true;
            } else if (filter.name === "itemExistsFilter") {
                $scope.alreadyExists = true;  
            }
        };
        uploader.onAfterAddingFile = function(fileItem) {
          //  console.info('onAfterAddingFile', fileItem);
            $scope.csvFail = false;
            $scope.alreadyExists = false;  
        };

        uploader.onCompleteItem = function(fileItem, response, status, headers) {
           // console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.csvFail = false;
            $scope.error = false;
            $scope.alreadyExists = false;  
            if (response === "Error") {
              $scope.error = true;
            };
            
            var fileName = fileItem.file.name.substring(0,fileItem.file.name.indexOf(".csv"));
            if(!$scope.addToData(fileName)){
              //récupérer l'index du fichier qui a planté
              /*this.queue[0].isError = true;
              this.queue[0].isSuccess = false;
              this.queue[0].isUploaded = false;*/
            }
        };

    }]);



})();