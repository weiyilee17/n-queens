/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, 
// with n rooks placed such that none of them can attack each other

var BoardTree = function(board) {
  this.board = board;
  this.children = [];
};

BoardTree.prototype.addChild = function(board) {
  var newChild = new BoardTree(board);
  this.children.push(newChild);
};

var createNByNEmptyMatrix = function(n) {
  var outterArray = [];
  for (var i = 0; i < n; i++) {
    var innerArray = [];
    for (var j = 0; j < n; j++) {
      innerArray.push(0);
    }
    outterArray.push(innerArray);
  }
  
  return outterArray;
};


var depthFirstSearch = function(currentRow, currentBoard, n) {
  
  // solutions would only be found when we are at the last row
  if (currentRow === n - 1) {
    for (var j = 0; j < n; j++) {
      currentBoard.togglePiece(currentRow, j);
      //console.log(currentBoard);
      //console.log('has conflict:',currentBoard.hasAnyRooksConflicts());
      
      var hasConflict = currentBoard.hasAnyRooksConflicts();
      // console.log(hasConflict);
      if (hasConflict) {
        currentBoard.togglePiece(currentRow, j);
      } else {  // it is a solution!
        // debugger;
        
        return currentBoard;
      }
    }
  } else {
    // for every column
    // ex. for n = 2, check for 
    // [1, 0] and [0, 1]
    for (var j = 0; j < n; j++) {
      currentBoard.togglePiece(currentRow, j);
      if (currentBoard.hasAnyRooksConflicts()) {
        currentBoard.togglePiece(currentRow, j);
      } else {
        break;
      }
    }
  }
};


window.findNRooksSolution = function(n) {
  var solution = undefined;
  var currentBoard = new Board(createNByNEmptyMatrix(n));
  
  // for depth
  for (var i = 0; i < n; i++) {
    solution = depthFirstSearch(i, currentBoard, n);
  }
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

var depthFirstSearchForCount = function(currentNode, currentRow, n, solutionCountArray) {
  
  debugger;
  if (currentRow === n - 1) { // solution on last layer
    
    for (var i = 0; i < n; i++) {
      var childBoard = currentNode.board.copyMatrix();
      var childTree = new BoardTree(childBoard);
      
      childTree.board.togglePiece(currentRow, i);
      currentNode.addChild(childTree.board);
      
      if (childTree.board.hasAnyRooksConflicts()) {
        return;
      } else {
        solutionCountArray.push(1);
        return;
      }
    }
    
    
    
  } else {
    for (var i = 0; i < n; i++) {
      // ex.
      // 1 0 0, 0 1 0, 0 0 1                          0, 0, 0
      // 0 0 0, 0 0 0, 0 0 0                          0, 0, 0
      // 0 0 0, 0 0 0, 0 0 0 would be child of board  0, 0, 0
      var childBoard = currentNode.board.copyMatrix();
      var childTree = new BoardTree(childBoard);
      
      childTree.board.togglePiece(currentRow, i);
      
      var toggledBoard = childTree.board.copyMatrix();
      
      
      currentNode.addChild(toggledBoard);
      childTree.board.togglePiece(currentRow, i);
    }
    currentRow++;
    
    for (var i = 0; i < currentNode.children.length; i++) {
      depthFirstSearchForCount(currentNode.children[i], currentRow, n, solutionCountArray);
    }    
  }
  
  
  
  
  
  
  
  
  // // solutions would only be found when we are at the last row
  // if (currentRow === n - 1) {
  //   for (var j = 0; j < n; j++) {
  //     currentBoard.togglePiece(currentRow, j);
  //     //console.log(currentBoard);
  //     //console.log('has conflict:',currentBoard.hasAnyRooksConflicts());
      
  //     var hasConflict = currentBoard.hasAnyRooksConflicts();
  //     // console.log(hasConflict);
  //     if (hasConflict) {
  //       currentBoard.togglePiece(currentRow, j);
  //     } else {  // it is a solution!
  //       // debugger;
  //       solutionCountArray.push(1);
  //       currentBoard = previousBoard;
        
  //     }
  //   }
  // } else {
  //   // for every column
  //   // ex. for n = 2, check for 
  //   // [1, 0] and [0, 1]
  //   for (; currentColumn < n; currentColumn++) {
  //     currentBoard.togglePiece(currentRow, currentColumn);
      
  //     if (currentBoard.hasAnyRooksConflicts()) {
  //       currentBoard.togglePiece(currentRow, currentColumn);
  //     } else {  // current board has no conclict
  //       var prevBoard = currentBoard.slice();
  //       depthFirstSearchForCount(currentRow + 1, 0, currentBoard, prevBoard, n, solutionCountArray);
  //     }
  //   }
  // }
};
// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var emptyBoard = new Board(createNByNEmptyMatrix(n));
  var rootTree = new BoardTree(emptyBoard);
  var currentLayer = 0;
  
  
  var solutionCountArray = [];
  
  // for (var i = 0; i < n; i++) {
  //   // ex.
  //   // 1 0 0, 0 1 0, 0 0 1                          0, 0, 0
  //   // 0 0 0, 0 0 0, 0 0 0                          0, 0, 0
  //   // 0 0 0, 0 0 0, 0 0 0 would be child of board  0, 0, 0
  //   var childBoard = rootTree.board.copyMatrix();
  //   var childTree = new BoardTree(childBoard);
  //   childTree.board.togglePiece(currentLayer, i);
  //   rootTree.addChild(childTree.board);
  //   childTree.board.togglePiece(currentLayer, i);
  // }
  // currentLayer++;
  
  for (var j = 0; j < n; j++) {
    depthFirstSearchForCount(rootTree, j, n, solutionCountArray);
  }
  
  // for (var j = 0; j < n; j++) {
  //   debugger;
  //   depthFirstSearchForCount(0, j, currentBoard, currentBoard, n, solutionCountArray);
  // }
  
  solutionCount = solutionCountArray.length;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
