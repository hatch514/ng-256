angular.module('256App', [])
  .controller('gameController', gameController);

function gameController($scope){
  const KEY_UP = 38;
  const KEY_RIGHT = 39;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;
  
  $scope.count = 0;
  $scope.ary0;
  $scope.ary1;
  $scope.ary2;
  $scope.sheetTable;
  $scope.allBlocks;

  class SheetObj {
    constructor(){
      this.hasBlock = false;
    }
    
    setBlock(blockObj){
      this.block = blockObj;
      this.hasBlock = true;
    }

    deleteBlock(){
      this.block = null;
      this.hasBlock = false;
    }

    getHasBlock(){
      return this.hasBlock;
    }
  }

  class BlockObj {
    constructor(point, coords){ 
      this.point = point;
      this.coords = coords;
    }

    setCoords(coords){
      this.coords = coords;
    }
  }

  function getRandomInt(max,min){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * 3);
  }

  $scope.init = function(){
    initializeSheets();
    createBlock();
    allocateBlocks();
  };

  function initializeSheets(){
    $scope.ary0 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary1 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary2 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.sheetTable = [$scope.ary0, $scope.ary1, $scope.ary2];
    $scope.allBlocks = [];
  }

  function createBlock(){
    var x = getRandomInt(3);
    var y = getRandomInt(3);
    var newBlock = new BlockObj(2, [x ,y]);
    $scope.allBlocks.push(newBlock);
    $scope.sheetTable[y][x].setBlock();
  }

  function allocateBlocks(){
    $scope.allBlocks.forEach(function(block){
      var x = block.coords[0];
      var y = block.coords[1];
      $scope.sheetTable[y][x].setBlock(block);
    });
  }

  $scope.keyListen = function(event){
    var key = event.which;
    if (key==KEY_UP) $scope.moveBlocks(KEY_UP);
    if (key==KEY_RIGHT) $scope.moveBlocks(KEY_RIGHT);
    if (key==KEY_DOWN) $scope.moveBlocks(KEY_DOWN);
    if (key==KEY_LEFT) $scope.moveBlocks(KEY_LEFT);
  }

  $scope.moveBlocks = function(direction){
    $scope.allBlocks.forEach(function(block){
      var x = block.coords[0];
      var y = block.coords[1];
      var nowSheet = $scope.sheetTable[y][x];
      
      if(direction == KEY_UP){
        var nextSheet = $scope.sheetTable[0][x];
        if(!nextSheet.hasBlock){
          nextSheet.setBlock(block);
          nowSheet.deleteBlock();
          block.setCoords([x,0])
        }

      }else if(direction==KEY_RIGHT){
        var nextSheet = $scope.sheetTable[y][2];
        if(!nextSheet.hasBlock){
          nextSheet.setBlock(block);
          nowSheet.deleteBlock();
          block.setCoords([2,y])
        }

      }else if (direction==KEY_DOWN){
        var nextSheet = $scope.sheetTable[2][x];
        if(!nextSheet.hasBlock){
          nextSheet.setBlock(block);
          nowSheet.deleteBlock();
          block.setCoords([x,2])
        }

      }else if (direction==KEY_LEFT){
        var nextSheet = $scope.sheetTable[y][0];
        if(!nextSheet.hasBlock){
          nextSheet.setBlock(block);
          nowSheet.deleteBlock();
          block.setCoords([0,y])
        }

       }
    });
   
 }
  
}
