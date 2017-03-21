angular.module('256App', ['ngAnimate'])
  .controller('gameController', gameController);

function gameController($scope){
  const KEY_UP = 38;
  const KEY_RIGHT = 39;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;

  const DIR_UP = "up";
  const DIR_RIGHT = "right";
  const DIR_DOWN = "down";
  const DIR_LEFT = "left";
 
  const EDGE_TOP  = 0;
  const EDGE_RIGHT = 2;
  const EDGE_BOTTOM = 2;
  const EDGE_LEFT = 0;
 
  const ANIMATION_CSS = { 
    up:[
      {bottom: '+=130'},
      {bottom: '+=260'}
    ],
    right:[
      {left: '+=130'},
      {left: '+=260'}
    ],
    down:[
      {top: '+=130'},
      {top: '+=260'}
    ],
    left:[
      {right: '+=130'}, 
      {right: '+=260'}
    ]
  }
  const ANIMATION_DURATION = 250;
  const ANIMATION_EASING = 'swing';

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
      this.animation = "none";
    }
    
    setCoords(coords){
      this.coords = coords;
    }

    setAnimation(direction, hop, callback){
      if(hop>=0){
        $('.block').animate(
          ANIMATION_CSS[direction][hop-1], 
          ANIMATION_DURATION, ANIMATION_EASING, callback);
      }
    }
  }

  function getRandomInt(max,min){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * 3);
  }

  function initializeSheets(){
    $scope.ary0 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary1 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.ary2 = [new SheetObj(), new SheetObj(), new SheetObj()];
    $scope.sheetTable = [$scope.ary0, $scope.ary1, $scope.ary2];
    $scope.allBlocks = [];
  }

  function createBlock(){
    var coordsList = [];
    for(var i=0; i<(EDGE_RIGHT+1); i++){
      for(var j=0; j<(EDGE_RIGHT+1); j++){
        coordsList.push({x:i, y:j});
      }
    }
    $scope.allBlocks.forEach(function(block){
      var block_x = block.coords[0];
      var block_y = block.coords[1];
      var index = null;
      coordsList.forEach(function(coords,index){
        if(block_x == coords.x && block_y == coords.y) this.index = index;
      });
      if(index) coordsList.split(index,1); 
     
    }); 
    
    var createIndex = getRandomInt(coordsList.length + 1);
    var newBlock_x = coordsList[createIndex].x; 
    var newBlock_y = coordsList[createIndex].y;
    var newBlock = new BlockObj(2, [newBlock_x, newBlock_y]);

    $scope.allBlocks.push(newBlock);
    $scope.sheetTable[newBlock_y][newBlock_x].setBlock(newBlock);
  }

  function allocateBlocks(){
    $scope.allBlocks.forEach(function(block){
      var x = block.coords[0];
      var y = block.coords[1];
      $scope.sheetTable[y][x].setBlock(block);
    });
  }

  $scope.init = function(){
    initializeSheets();
    createBlock();
    allocateBlocks();
  };

  $scope.gameLoop = function(event){
    var key = event.which;
    if(key==KEY_UP || key==KEY_RIGHT || key==KEY_DOWN || key==KEY_LEFT){
      moveBlocks(key);
      createBlock();
    }
  }

  function moveBlocks(direction){
    $scope.allBlocks.forEach(function(block){
      var now_x = block.coords[0];
      var now_y = block.coords[1];
      var nowSheet = $scope.sheetTable[now_y][now_x];

      var next_x, next_y;
      var nextSheet; 
      var hop; 
      if(direction == KEY_UP){
        next_x = now_x;
        next_y = EDGE_TOP;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = now_y - EDGE_TOP; 
        
        block.setAnimation(DIR_UP, hop, function(){
          nowSheet.deleteBlock();
          block.setCoords([next_x, next_y]);
          nextSheet.setBlock(block);
          $scope.$digest();
        });

      }else if(direction==KEY_RIGHT){
        next_x = EDGE_RIGHT;
        next_y = now_y;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = EDGE_RIGHT - now_x; 
        
        block.setAnimation(DIR_RIGHT, hop, function(){
          nowSheet.deleteBlock();
          block.setCoords([next_x, next_y]);
          nextSheet.setBlock(block);
          $scope.$digest();
        });

      }else if(direction==KEY_DOWN){
        next_x = now_x;
        next_y = EDGE_BOTTOM;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = EDGE_BOTTOM - now_y; 

        block.setAnimation(DIR_DOWN, hop, function(){
          nowSheet.deleteBlock();
          block.setCoords([next_x, next_y]);
          nextSheet.setBlock(block);
          $scope.$digest();
        });

      }else if(direction==KEY_LEFT){
        next_x = EDGE_LEFT;
        next_y = now_y;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = now_x - EDGE_LEFT; 
        
        block.setAnimation(DIR_LEFT, hop, function(){
          nowSheet.deleteBlock();
          block.setCoords([next_x, next_y]);
          nextSheet.setBlock(block);
          $scope.$digest();
        });
       }
    });
  }
}
