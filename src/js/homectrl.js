angular.module('256App', ['ngAnimate'])
  .controller('gameController', gameController);

function gameController($scope, $timeout){
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
  const ANIMATION_DURATION = 150;
  const ANIMATION_EASING = 'swing';

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
      this.setId();
    }
   
    setId(){
      this.id = this.coords.x + '-' + this.coords.y; 
    }

    setCoords(coords){
      this.coords = coords;
      this.setId();
      return new Promise(function(callback){callback()});
    }

    setAnimation(direction, hop){
      if(hop>0){
        $('#' + this.id).animate(
          ANIMATION_CSS[direction][hop-1], 
          ANIMATION_DURATION, ANIMATION_EASING);
      }
    }
  }

  function getRandomInt(max,min){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min));
  }

  function initializeSheets(){
    var ary0 = [new sheetObj(), new sheetObj(), new sheetObj()];
    var ary1 = [new sheetObj(), new sheetObj(), new sheetObj()];
    var ary2 = [new sheetObj(), new sheetObj(), new sheetObj()];
    var sheetTable = [ary0, ary1, ary2];
    return sheetTable;
  }

  function createBlock(){
    var coordsList = [];
    for(var i=0; i<(EDGE_RIGHT+1); i++){
      for(var j=0; j<(EDGE_RIGHT+1); j++){
        coordsList.push({x:j, y:i});
      }
    }
    $($scope.allBlocks).each(function(key, block){
      var block_x = block.coords.x;
      var block_y = block.coords.y;
      var deleteIndex = null;
      $(coordsList).each(function(index, coords){
        if(block_x == coords.x && block_y == coords.y) deleteIndex = index;
      });
      if(deleteIndex >= 0) {
        coordsList.splice(deleteIndex,1); 
      }    
    }); 
    
    var createIndex = getRandomInt(coordsList.length, 0);
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
    $scope.allBlocks = [];
    $scope.sheetTable = initializeSheets();
    createBlock();
    allocateBlocks();
  };

  $scope.gameLoop = function(event){
    var key = event.which;
    if(key==KEY_UP || key==KEY_RIGHT || key==KEY_DOWN || key==KEY_LEFT){
      var direction = key;
      sortAllBlocks(direction).then(()=>{
        return blockAnimate(direction);
      }).then((isMoved)=>{
        if(isMoved){
          $scope.sheetTable = $scope.nextSheetTable;
          $scope.allBlocks = $scope.nextAllBlocks;
          createBlock();
        }
        return;
      }).then(()=>{
        // TODO make promisify
        $timeout(() =>{
          $scope.$digest();
        }, ANIMATION_DURATION + 100)
        console.log('digestcalled');
      });
    }
  }

  function sortAllBlocks(direction){
    tempAllBlocks = [];

    if(direction==KEY_UP){
      for(var y = 0; y <= EDGE_BOTTOM; y++){
        for(var x = 0; x <= EDGE_RIGHT; x++){
          $scope.allBlocks.forEach((block) =>{
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_RIGHT){
      for(var x = EDGE_RIGHT; x >= 0; x--){
        for(var y = 0; y <= EDGE_BOTTOM; y++){
          $scope.allBlocks.forEach((block) =>{
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_DOWN){
      for(var y = EDGE_BOTTOM; y >= 0 ; y--){
        for(var x = 0; x <= EDGE_RIGHT; x++){
          $scope.allBlocks.forEach((block) =>{
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }else if(direction==KEY_LEFT){
      for(var x = 0; x <= EDGE_RIGHT; x++){
        for(var y = 0; y <= EDGE_BOTTOM; y++){
          $scope.allBlocks.forEach((block) =>{
            if(block.coords.x == x && block.coords.y == y){
              tempAllBlocks.push(block);
            } 
          });
        }
      }
    }
    $scope.allBlocks = tempAllBlocks; 
    return new Promise((callback) => {
      callback(); 
    });
  }

  function blockAnimate(direction){
    var anythingIsMoved = false;
    $scope.nextAllBlocks = [];
    $scope.nextSheetTable = initializeSheets(); 

    $($scope.allBlocks).each(function(index, block){
      var now_x = block.coords.x;
      var now_y = block.coords.y;
      var now_point = block.point;

      var next_x, next_y;
      var next_point = now_point;
      var hop; 
      
      if(direction == KEY_UP){
        next_x = now_x;
        for(var i = EDGE_TOP; i<=EDGE_BOTTOM; i++){
          next_y = i;
          var overlap = false; 
          $($scope.nextAllBlocks).each((key, nextBlock)=>{
            var coords = nextBlock.coords;
            if(next_x == coords.x && next_y ==coords.y){
              overlap = true;
            }
          });
          if(!overlap) break;
        }

        hop = now_y - next_y; 

      }else if(direction==KEY_RIGHT){
        next_y = now_y;

        for(var i = EDGE_RIGHT; i>=EDGE_LEFT; i--){
          next_x = i;
          var overlap = false; 
          $($scope.nextAllBlocks).each((key, nextBlock)=>{
            var coords = nextBlock.coords;
            if(next_x == coords.x && next_y ==coords.y){
              overlap = true;
            }
          });
          if(!overlap) break;
        }

        hop = next_x - now_x; 

      }else if(direction==KEY_DOWN){
        next_x = now_x;

        for(var i = EDGE_BOTTOM; i >= EDGE_TOP; i--){
          next_y = i;
          var overlap = false; 
          $($scope.nextAllBlocks).each((key, nextBlock)=>{
            var coords = nextBlock.coords;
            if(next_x == coords.x && next_y ==coords.y){
              overlap = true;
            }
          });
          if(!overlap) break;
        }

        hop = next_y - now_y; 
        
      }else if(direction==KEY_LEFT){
        next_y = now_y;

        for(var i = EDGE_LEFT; i<=EDGE_RIGHT; i++){
          next_x = i;
          var overlap = false; 
          $($scope.nextAllBlocks).each((key, nextBlock)=>{
            var coords = nextBlock.coords;
            if(next_x == coords.x && next_y ==coords.y){
              overlap = true;
            }
          });
          if(!overlap) break;
        }

        hop = now_x - next_x; 
        
      }
      
      var cloneBlock = new blockObj(next_point, {x:next_x, y:next_y});
      $scope.nextSheetTable[next_y][next_x].setBlock(cloneBlock);
      $scope.nextAllBlocks.push(cloneBlock);

      if(hop>0){
        anythingIsMoved = true;
        console.log('setanimation');
        block.setAnimation(direction, hop); // make Promisify`
      }

    });

    return anythingIsMoved; 
  }
}
