// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
    let grid = new Array(8).fill().map(() => new Array(8).fill());
    grid[3][4] = new Piece('black');
    grid[4][3] = new Piece('black');
    grid[3][3] = new Piece('white');
    grid[4][4] = new Piece('white');

    return grid
}
/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  return (Math.min(...pos) >=0 && Math.max(...pos) <=7);
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let row = pos[0];
  let col = pos[1];
  if (this.isValidPos(pos)){  
    return this.grid[row][col];
  } else {
    throw new Error('Not valid pos!');
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let row = pos[0];
  let col = pos[1];
  return this.grid[row][col] instanceof Piece && this.grid[row][col].color === color;

};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let row = pos[0];
  let col = pos[1];
  return this.grid[row][col] instanceof Piece
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  // let row = pos[0];
  // let col = pos[1];

  // is pieces to flip a falsey value? If nothing to flip, return [];
  // else, collect new pos in pieces to flip
  if (!piecesToFlip) {
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos)
  }
  let newPos = [pos[0] + dir[0], pos[1] + dir[1]] // newPos = [0,1]

  if (!this.isValidPos(newPos)) {
    return [];
  } else if (!this.isOccupied(newPos)) {
    return [];
  } else if (this.isMine(newPos, color)) {
    return piecesToFlip ? piecesToFlip : []
  } else {//recursion}
    return this._positionsToFlip(newPos, color, dir, piecesToFlip)
  }
  //push new position each time we don't hit base cases
  // add opposite color to piecesToFlip
  // on recursive call, newPos = pos argument
};




/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)){
    return false;
  } 
  let valid = false;
  for (move of Board.DIRS){
    if (this._positionsToFlip(pos, color, move).length > 0){
      valid = true;
    }
  }
  return valid;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let row = pos[0];
  let col = pos[1];
  if (this.validMove(pos, color)){
    this.grid[row][col] = new Piece(color);
    for (move of Board.DIRS) {
      let positions = this._positionsToFlip(pos, color, move);
      for (tile of positions) {
        let row = tile[0];
        let col = tile[1];
        this.grid[row][col].flip();
      } 
    }
  } else {
      throw new Error('Invalid move!');
  }

};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const retArr = [];
  for (let i = 0; i < this.grid.length; i++){
    for (let j = 0; j < this.grid.length; j++){
      let pos = [i, j]
      if(this.validMove(pos, color)){
        retArr.push(pos);
      }
    }
  }
  return retArr;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length > 0;
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !(this.hasMove('white') && this.hasMove('black'));
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE