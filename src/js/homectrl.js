angular.module('256App', ['ngAnimate'])
  .controller('gameController', gameController);

function gameController($scope){
  const KEY_UP = 38;
  const KEY_RIGHT = 39;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;

  const EDGE_TOP  = 0;
  const EDGE_RIGHT = 2;
  const EDGE_BOTTOM = 2;
  const EDGE_LEFT = 0;
 
  const ANIMATION_CSS = { 
    '38':[                // KEY UP
      {bottom: '+=130'},
      {bottom: '+=260'}
    ],
    '39':[                // KEY RIGHT
      {left: '+=130'},
      {left: '+=260'}
    ],
    '40':[                // KEY DOWN 
      {top: '+=130'},
      {top: '+=260'}
    ],
    '37':[                // KEY LEFT 
      {right: '+=130'}, 
      {right: '+=260'}
    ]
  }
  const ANIMATION_DURATION = 250;
  const ANIMATION_EASING = 'swing';

  $scope.ary0;
  $scope.ary1;
  $scope.ary2;
  $scope.sheetTable;
  $scope.allBlocks;

  self = this;

  class sheetObj {
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

  class blockObj {
    constructor(point, coords){ 
      this.point = point;
      this.coords = coords;
      this.animation = "none";
    }
    
    setCoords(coords){
      this.coords = coords;
      return new Promise(function(callback){callback()});
    }

    setAnimation(direction, hop, callback){
      if(hop>=0){
        $('.block').animate(
          ANIMATION_CSS[direction][hop-1], 
          ANIMATION_DURATION, ANIMATION_EASING, callback
        );
      }
    }
  }

  function getRandomInt(max,min){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min));
  }

  function initializeSheets(){
    $scope.ary0 = [new sheetObj(), new sheetObj(), new sheetObj()];
    $scope.ary1 = [new sheetObj(), new sheetObj(), new sheetObj()];
    $scope.ary2 = [new sheetObj(), new sheetObj(), new sheetObj()];
    $scope.sheetTable = [$scope.ary0, $scope.ary1, $scope.ary2];
    $scope.allBlocks = [];
  }

  function createBlock(){
    console.log('called');
    var coordsList = [];
    for(var i=0; i<(EDGE_RIGHT+1); i++){
      for(var j=0; j<(EDGE_RIGHT+1); j++){
        coordsList.push({x:j, y:i});
      }
    }
    $scope.allBlocks.forEach(function(block){
      var block_x = block.coords.x;
      var block_y = block.coords.y;
      var deleteIndex = null;
      coordsList.forEach(function(coords,index){
        if(block_x == coords.x && block_y == coords.y) deleteIndex = index;
      });
      if(deleteIndex) {
        coordsList.splice(deleteIndex,1); 
      }    
    }); 
    
    var createIndex = getRandomInt(coordsList.length, 0) ;
    var newBlock = new blockObj(2, coordsList[createIndex]);

    $scope.allBlocks.push(newBlock);
    $scope.sheetTable[newBlock.coords.y][newBlock.coords.x].setBlock(newBlock);
  }

  function allocateBlocks(){
    $scope.allBlocks.forEach(function(block){
      var x = block.coords.x;
      var y = block.coords.y;
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
    }
  }

  function deepCopy(oldObject){
    var newObject = jQuery.extend(true, {}, oldObject);
    return newObject;
  }
  
  function sortAllBlocks(direction){
    tempAllBlocks = [];

    if(direction==KEY_UP){
      for(var y = 0; y <= EDGE_BOTTOM; y++){
        for(var x = 0; x <= EDGE_RIGHT; x++){
          $scope.allBlocks.forEach(function(block){
            if(block.coords.x == x && block.coords.y == y){
              //use deep copy
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_RIGHT){
      for(var x = EDGE_RIGHT; x >= 0; x--){
        for(var y = 0; y <= EDGE_BOTTOM; y++){
          $scope.allBlocks.forEach(function(block){
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_DOWN){
      for(var y = EDGE_BOTTOM; y >= 0 ; y--){
        for(var x = 0; x <= EDGE_RIGHT; x++){
          $scope.allBlocks.forEach(function(block){
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_LEFT){
      for(var x = 0; x <= EDGE_RIGHT; x++){
        for(var y = 0; y <= EDGE_BOTTOM; y++){
          $scope.allBlocks.forEach(function(block){
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }
    $scope.allBlocks = tempAllBlocks; 

  }
  
  //change logic fundamentally
  function moveBlocks(direction){
    sortAllBlocks(direction);
    blockAnimate(direction).then(function(){
      createBlock(); 
      return;
    }).then(function(){
      $scope.$digest();
    });
  }

  function blockAnimate(direction){
    $scope.allBlocks.forEach(function(block){
      var now_x = block.coords.x;
      var now_y = block.coords.y;
      var nowSheet = $scope.sheetTable[now_y][now_x];

      var next_x, next_y;
      var nextSheet; 
      var hop; 
      
      if(direction == KEY_UP){
        next_x = now_x;
        next_y = EDGE_TOP;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = now_y - EDGE_TOP; 
      }else if(direction==KEY_RIGHT){
        next_x = EDGE_RIGHT;
        next_y = now_y;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = EDGE_RIGHT - now_x; 
      }else if(direction==KEY_DOWN){
        next_x = now_x;
        next_y = EDGE_BOTTOM;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = EDGE_BOTTOM - now_y; 
      }else if(direction==KEY_LEFT){
        next_x = EDGE_LEFT;
        next_y = now_y;
        nextSheet = $scope.sheetTable[next_y][next_x];
        hop = now_x - EDGE_LEFT; 
      }

      block.setAnimation(direction, hop, function(){
        nowSheet.deleteBlock();
        block.setCoords({x:next_x, y:next_y}).then(function(){
          nextSheet.setBlock(block);
        });
      });
    });
    return new Promise(function(callback){callback();}); 
  }
}
