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


var depthFirstSearchForRook = function(currentRow, currentBoard, n) {
  
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
    solution = depthFirstSearchForRook(i, currentBoard, n);
  }
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

var depthFirstSearchForRookCount = function(currentNode, currentRow, n, solutionCountArray) {
  
  if (currentRow === n - 1) { // solution on last layer
    
    for (var i = 0; i < n; i++) {
      var childBoard = currentNode.board.copyMatrix();
      var childTree = new BoardTree(childBoard);
      
      childTree.board.togglePiece(currentRow, i);
      currentNode.addChild(childTree.board);
       
//      console.log('child at last row:');
//      childTree.board.showMatrix();
      
      if (childTree.board.hasAnyRooksConflicts()) {
        continue;
      } else {
//         console.log('answer pushed');
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
       
//       console.log('current node added children:');
//       currentNode.children[i].board.showMatrix();
       
      childTree.board.togglePiece(currentRow, i);
    }
    currentRow++;
    
    for (i = 0; i < currentNode.children.length; i++) {
//      console.log('currentNode:');
//      currentNode.board.showMatrix();
       if (currentNode.children[i].board.hasAnyRooksConflicts()) {
          continue;
       }
       
      depthFirstSearchForRookCount(currentNode.children[i], currentRow, n, solutionCountArray);
    }    
  }
  
};
// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var emptyBoard = new Board(createNByNEmptyMatrix(n));
  var rootTree = new BoardTree(emptyBoard);
  var currentLayer = 0;
  
  
  var solutionCountArray = [];

   depthFirstSearchForRookCount(rootTree, 0, n, solutionCountArray);
  
  solutionCount = solutionCountArray.length;

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


var depthFirstSearchForQueen = function(currentRow, currentBoard, n) {
  
  // solutions would only be found when we are at the last row
  if (currentRow === n - 1) {
    for (var j = 0; j < n; j++) {
      currentBoard.togglePiece(currentRow, j);
      //console.log(currentBoard);
      //console.log('has conflict:',currentBoard.hasAnyRooksConflicts());
      
      var hasConflict = currentBoard.hasAnyQueensConflicts();
      // console.log(hasConflict);
      if (hasConflict) {
        currentBoard.togglePiece(currentRow, j);
      } else {  // it is a solution!        
        return currentBoard;
      }
    }
  } else {
    // for every column
    // ex. for n = 2, check for 
    // [1, 0] and [0, 1]
    for (var j = 0; j < n; j++) {
      currentBoard.togglePiece(currentRow, j);
      if (currentBoard.hasAnyQueensConflicts()) {
        currentBoard.togglePiece(currentRow, j);
      } else {
        break;
      }
    }
  }
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = 1; //fixme
  var currentBoard = new Board(createNByNEmptyMatrix(n));
   
   // for depth
  for (var i = 0; i < n; i++) {
    solution = depthFirstSearchForQueen(i, currentBoard, n);
  }
   
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


var depthFirstSearchForQueenCount = function(currentNode, currentRow, n, solutionCountArray) {
  
  if (currentRow === n - 1) { // solution on last layer
    
    for (var i = 0; i < n; i++) {
      var childBoard = currentNode.board.copyMatrix();
      var childTree = new BoardTree(childBoard);
      
      childTree.board.togglePiece(currentRow, i);
      currentNode.addChild(childTree.board);
       
//      console.log('child at last row:');
//      childTree.board.showMatrix();
      
      if (childTree.board.hasAnyQueensConflicts()) {
        continue;
      } else {
//         console.log('answer pushed');
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
       
//       console.log('current node added children:');
//       currentNode.children[i].board.showMatrix();
       
      childTree.board.togglePiece(currentRow, i);
    }
    currentRow++;
    
    for (i = 0; i < currentNode.children.length; i++) {
//      console.log('currentNode:');
//      currentNode.board.showMatrix();
       if (currentNode.children[i].board.hasAnyQueensConflictsConflicts()) {
          continue;
       }
       
      depthFirstSearchForRookCount(currentNode.children[i], currentRow, n, solutionCountArray);
    }    
  }
  
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme

  var emptyBoard = new Board(createNByNEmptyMatrix(n));
  var rootTree = new BoardTree(emptyBoard);
  var currentLayer = 0;
  
  
  var solutionCountArray = [];

   depthFirstSearchForQueenCount(rootTree, 0, n, solutionCountArray);
  
  solutionCount = solutionCountArray.length;
   
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
