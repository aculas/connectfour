/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;//Renamed variables to be updated to the ES2015 style
const  HEIGHT = 6;

let  currPlayer = 1; // active player: 1 or 2
let  board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

 function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {//standard for loop to create the board
    board.push(Array.from({ length: WIDTH }));//takes the emtpy array above and creates an new, shallow-copied array
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Sets "htmlBoard" variable from the item in HTML w/ID of "board"
  const board = document.getElementById ('board');
  const top = document.createElement("tr");// Sets a variable for the top row using the ID of "tr"
  top.setAttribute("id", "column-top");//sets the attributes form the new top row created
  top.addEventListener("click", handleClick);//uses an event listener function when a user clicks at the top
//Creates datacells in a top row and stores them in a variable using the id of "td"
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");//creates an initial head cell
    headCell.setAttribute("id", x);//sets the attribute for the new cells
    top.append(headCell);//appends to headCell and creates a child element
  }
  board.append(top);//appends to top row "tr"

  // This creates the main part of the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');//creates a new div element for the individual pieces 
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);//adds whatever the current player is
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x]= currPlayer;//this is multidimentional array
  placeInTable(y, x);//callback function

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);//This is a callback function using a template literal
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) { 
    return endGame('Tie!');
  }
  /*This uses the .every method() that tests whether all elements in the array
   pass the test implemented by the provided function. It returns a Boolean value.*/
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  for (let y = 0; y < HEIGHT; y++) {//standard for loop that iterates through the cells
    for (let x = 0; x < WIDTH; x++) {
      // gets a "check list" of 4 cells (starting here) for each of the different
        // ways to win
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];//Checks for a horizontal win
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];//Checks for a vertical win
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];//Checks for a diagonal right win
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];//Checks for a diagonal left win
      // Finds a winner (only checking each win-possibility as needed) and returns true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();