angular.module('256App',[])
  .controller('gameController', gameController);

function gameController($scope){

  $scope.ary0;
  $scope.ary1;
  $scope.ary2;
  $scope.allSheets;

  class SheetObj {
    constructor(){
      this.hasBlock = false;
    }
    
    getBlock(blockObj){
      this.block = blockObj;
      this.hasBlock = true;
    }
  }

  class BlockObj {
    constructor(point, coord){ 
      this.point = point;
      this.coord = coord;
    }
  }

  $scope.init = function(){
    $scope.initializeBlock();
    $scope.createBlock();
  };

  $scope.initializeBlock = function(){
    $scope.ary0 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary1 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary2 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.sheetTable = [$scope.ary0, $scope.ary1, $scope.ary2];
  }

  $scope.createBlock = function(){
    $scope.sheetTable[0][0].getBlock(new BlockObj(2, [0, 0]));
  }
}
