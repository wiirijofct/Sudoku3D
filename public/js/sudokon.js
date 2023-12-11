//javascript file for the sudoku game

//global variables
const UNASIGNED = 0;


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
            if(grid[row][col] === UNASIGNED){
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

            grid[row][col] = UNASIGNED;
        }
    }
    return false;
}

function printGrid(grid) {
    for (let row = 0; row < 9; row++) {
        let rowString = "";
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === UNASIGNED) {
                rowString += " - ";
            } else {
                rowString += " " + grid[row][col] + " ";
            }
            if (col === 2 || col === 5) {
                rowString += "|";
            }
        }
        console.log(rowString);
        if (row === 2 || row === 5) {
            console.log("-----------");
        }
    }
}

function generateSolvedSudoku(){
    let grid = [];
    for(let i = 0; i < 9; i++){
        grid.push([]);
        for(let j = 0; j < 9; j++){
            grid[i].push(UNASIGNED);
        }
    }
    solveSudoku(grid);
    return grid;
}

function generateSudoku(grid , numToRemove){
    while(numToRemove > 0){
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if(grid[row][col] !== UNASIGNED){
            grid[row][col] = UNASIGNED;
            numToRemove--;
        }
    }
    return grid;
}

function shuffleSudoku(grid){
    for (let i = 0; i < 100; i++) {
        let blockRow = Math.floor(Math.random() * 3)*3; // 0, 3, 6
        let r1 = blockRow + Math.floor(Math.random() * 3); //random row in block
        let r2 = blockRow + Math.floor(Math.random() * 3);
        [grid[r1], grid[r2]] = [grid[r2], grid[r1]] //swap rows

        let blockCol = Math.floor(Math.random() * 3)*3; // 0, 3, 6
        let c1 = blockCol + Math.floor(Math.random() * 3); //random col in block
        let c2 = blockCol + Math.floor(Math.random() * 3);
        for(let i = 0; i < 9; i++){
            [grid[i][c1], grid[i][c2]] = [grid[i][c2], grid[i][c1]] //swap cols
        }
    }
}

export { generateSudoku , printGrid , solveSudoku , generateSolvedSudoku, shuffleSudoku };
