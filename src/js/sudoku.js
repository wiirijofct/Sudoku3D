//javascript file for the sudoku game

//global variables
let UNASSIGNED = 0;


// create a 3x3 grid of blocks and place another 3x3 grid inside each block
// Create an empty 9x9 Sudoku grid
function createEmptySudoku() {
    let grid = [];
    for (let i = 0; i < 9; i++) {
        grid.push([]);
        for (let j = 0; j < 9; j++) {
            grid[i].push(0);
        }
    }
    return grid;
}

// Fill the diagonal 3x3 subgrids
function fillDiagonal(grid) {
    for (let i = 0; i < 9; i += 3) {
        fillBlockRandom(grid, i, i);
    }
    // transpose(grid);
    return grid;
}

// Fill a 3x3 block with random numbers from 1 to 9
function fillBlockRandom(grid, startRow, startCol) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let randomIndex = Math.floor(Math.random() * numbers.length);
            let num = numbers[randomIndex];
            numbers.splice(randomIndex, 1);
            grid[startRow + i][startCol + j] = num;
        }
    }
}

function fillRemaining(grid, i, j){
    if(j >= 9 && i < 9 - 1){
        i = i + 1;
        j = 0;
    }
    if(i >= 9 && j >= 9){
        return true;
    }

    if(i < 3){
        if(j < 3){
            j = 3;
        }
    }
    else if(i < 9 - 3){
        if(j === Math.floor(i / 3) * 3){
            j = j + 3;
        }
    }
    else{
        if(j === 9 - 3){
            i = i + 1;
            j = 0;
            if(i >= 9){
                return true;
            }
        }
    }

    for(let num = 1; num <= 9; num++){
        if(isSafe(grid, i, j, num)){
            grid[i][j] = num;
            if(fillRemaining(grid, i, j + 1)){
                return true;
            }
            grid[i][j] = UNASSIGNED;
        }
    }
    return false;
}

// Remove the K no. of digits to generate a Sudoku puzzle
function removeKDigits(grid, k){
    let count = k;
    while(count !== 0){
        let cellId = Math.floor(Math.random() * 81);
        let i = Math.floor(cellId / 9);
        let j = cellId % 9;
        if(grid[i][j] !== 0){
            count--;
            grid[i][j] = 0;
        }
    }
}


// Print the 9x9 grid
function printGrid(grid) {
    for (let row = 0; row < 9; row++) {
        if (row % 3 === 0 && row !== 0) {
            console.log("-------------------------");
        }
        let rowString = "";
        for (let col = 0; col < 9; col++) {
            if (col % 3 === 0 && col !== 0) {
                rowString += "| ";
            }
            rowString += grid[row][col] === 0 ? "- " : grid[row][col] + " ";
        }
        console.log(rowString);
    }
}

function transpose(grid){
    for(let i = 0; i < 9; i++){
        for(let j = i; j < 9; j++){
            [grid[i][j], grid[j][i]] = [grid[j][i], grid[i][j]];
        }
    }
}


function usedInRow(grid, row, num){
    for(let col = 0; col < 9; col++){
        if(grid[row][col] === num){
            return true;
        }
    }
    return false;
}

function usedInCol(grid, col, num){
    for(let row = 0; row < 9; row++){
        if(grid[row][col] === num){
            return true;
        }
    }
    return false;
}

function usedInBox(grid, boxStartRow, boxStartCol, num){
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
            if(grid[row + boxStartRow][col + boxStartCol] === num){
                return true;
            }
        }
    }
    return false;
}

function isSafe(grid, row, col, num){
    return !usedInRow(grid, row, num) && !usedInCol(grid, col, num) && !usedInBox(grid, row - row % 3, col - col % 3, num);
}

function findUnassignedLocation(grid){
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(grid[row][col] === UNASSIGNED){
                return [row, col];
            }
        }
    }
    return [-1, -1];
}

function solveSudoku(grid){
    let rowCol = findUnassignedLocation(grid);
    let row = rowCol[0];
    let col = rowCol[1];

    if(row === -1){
        return true;
    }

    for(let num = 1; num <= 9; num++){
        if(isSafe(grid, row, col, num)){
            grid[row][col] = num;

            if(solveSudoku(grid)){
                return true;
            }

            grid[row][col] = UNASSIGNED;
        }
    }
    return false;
}

// Easy: 62 filled squares / 19 empty squares

// Medium: 53 filled squares / 28 empty squares

// Hard: 44 filled squares / 37 empty squares

// Very hard: 35 filled squares / 46 empty squares

// Extremely hard: 26 filled squares / 55 empty squares

// Inhuman: 17 filled squares / 64 empty squares
function createSudoku(difficulty){
    let grid = createEmptySudoku();
    fillDiagonal(grid);
    fillRemaining(grid, 0, 3);
    let filledGrid = grid.map((row) => row.slice());
    
    if(difficulty === "easy"){
        removeKDigits(grid, 19);
    }
    else if(difficulty === "medium"){
        removeKDigits(grid, 28);
    }
    else if(difficulty === "hard"){
        removeKDigits(grid, 37);
    }
    else if(difficulty === "very hard"){
        removeKDigits(grid, 46);
    }
    else if(difficulty === "extremely hard"){
        removeKDigits(grid, 55);
    }
    else if(difficulty === "inhuman"){
        removeKDigits(grid, 64);
    }
    // removeKDigits(grid, difficulty);
    return {sudokuGrid: grid, filledGrid: filledGrid};
}


export { createSudoku, createEmptySudoku, printGrid, fillDiagonal, fillBlockRandom, solveSudoku, fillRemaining, removeKDigits, transpose};
