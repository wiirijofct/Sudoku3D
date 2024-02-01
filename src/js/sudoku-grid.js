import * as THREE from 'three';
import * as SUDO from './sudoku.js';
import { scene, css3DScene } from './scene-setup.js';
import { isShiftDown } from './interactions.js';

import {CSS3DObject} from 'three/addons/renderers/CSS3DRenderer.js';
import TWEEN from 'three/addons/libs/tween.module.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let selectedTile;
let sudokuGrid, filledSudokuGrid, sudoku;

let wrongCount;

const objects = [];

const fontLoader = new FontLoader();
let font;
let fontLoaded = false;
let pendingTextCreations = [];

const defaultEmissiveColor = 0x000000;

const Tiles = {};
const letters = 'abcdefghin';
for (let i = 0; i < 10; i++) {
    for (let j = 1; j <= 9; j++) {
        const identifier = `${letters[i]}${j}`;
        Tiles[identifier] = null;
    }
}

function initSudokuGrid(difficulty) {
    // Initialize Sudoku grid, font loader, and any other related functionalities here
    // ...
    
    sudoku = SUDO.createSudoku(difficulty);
    sudokuGrid = sudoku.sudokuGrid;
    filledSudokuGrid = sudoku.filledGrid;
    
    loadFont('helvetiker', 'regular', () => {
        createSudokuGrid(); // This function initializes the grid and creates the initial text meshes
        fillSudokuGrid(sudokuGrid); // This function fills the grid with the actual numbers
        createNumbersRow();
        wrongCount = 0;
        addErrorCounter();
    });
    
}

// Load the font and store it globally
function loadFont(fontName, fontWeight, callback) {
    const fontPath = `fonts/${fontName}_${fontWeight}.typeface.json`;
    fontLoader.load(fontPath, (loadedFont) => {
        font = loadedFont;
        fontLoaded = true;
        if (typeof callback === 'function') {
            callback(); // Call the callback function once the font is loaded
        }
    });
}

// Create text with more customizable parameters
function createText(text, x, y, z, options = {}, identifier) {
    if (!fontLoaded) {
        // If the font isn't loaded yet, add the parameters to the pending list
        pendingTextCreations.push([text, x, y, z, options, identifier]);
    } else {

        const textGeo = new TextGeometry(text, {
            font: font,
            size: options.size || 1,
            height: options.height || 0.1,
            curveSegments: options.curveSegments || 12,
            bevelThickness: options.bevelThickness || 0,
            bevelSize: options.bevelSize || 0,
            bevelSegments: options.bevelSegments || 0,
            bevelEnabled: options.bevelEnabled || false
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: options.color || 0xffffff });
        const textMesh = new THREE.Mesh(textGeo, textMaterial);

        textMesh.rotation.x = -Math.PI / 2;
        textMesh.position.set(x, y, z);

        scene.add(textMesh);
        // Map the created text mesh to the given identifier
        if (identifier && Tiles.hasOwnProperty(identifier)) {
            Tiles[identifier].textMesh = textMesh;
        } else {
            console.error(`Identifier "${identifier}" is not valid.`);
        }

        return textMesh;
    }
}

function updateTextMesh(identifier, newText, color) {
    if (!fontLoaded) {
        console.log('Font not loaded yet, cannot update text mesh.');
        return;
    }

    const oldTextMesh = Tiles[identifier].textMesh;
    if (!oldTextMesh) {
        console.error('No text mesh found for identifier:', identifier);
        return;
    }

    // Store the position and rotation of the old mesh
    const oldPosition = oldTextMesh.position.clone();
    const oldRotation = oldTextMesh.rotation.clone();

    // Remove the old text mesh from the scene and dispose of its geometry and material
    scene.remove(oldTextMesh);
    oldTextMesh.geometry.dispose();
    if (Array.isArray(oldTextMesh.material)) {
        oldTextMesh.material.forEach(material => material.dispose());
    } else {
        oldTextMesh.material.dispose();
    }

    // Now call createText with the new text and old parameters
    const newTextMesh = createText(newText, oldPosition.x, oldPosition.y, oldPosition.z, {
        size: oldTextMesh.geometry.parameters.options.size,
        height: oldTextMesh.geometry.parameters.options.height,
        curveSegments: oldTextMesh.geometry.parameters.options.curveSegments,
        bevelThickness: oldTextMesh.geometry.parameters.options.bevelThickness,
        bevelSize: oldTextMesh.geometry.parameters.options.bevelSize,
        bevelEnabled: oldTextMesh.geometry.parameters.options.bevelEnabled
    }, identifier);

    // Set the new mesh's position and rotation to match the old mesh
    newTextMesh.position.copy(oldPosition);
    newTextMesh.rotation.copy(oldRotation);

    // Update the reference in the Tiles object
    Tiles[identifier].textMesh = newTextMesh;

    // Update the color if provided
    if (color) {
        newTextMesh.material.color.set(color);
    }
}

function gridBlock(x, y, z) {
    const floorTile = new THREE.BoxGeometry(0.2, 0.01, 0.2);
    const wallTile = new THREE.BoxGeometry(0.2, 0.05, 0.01);
    // gray: 0x808080
    const materialF = new THREE.MeshPhongMaterial({ color: 0x808080, emissiveIntensity: 0.5 });
    // darker gray: 0x505050
    const materialW = new THREE.MeshPhongMaterial({ color: 0x505050 });

    const floor = new THREE.Mesh(floorTile, materialF);

    const group = new THREE.Group();
    group.add(floor);

    for (let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh(wallTile, materialW);
        wall.position.y = 0.03;
        // rotate wall
        if (i % 2 === 0) {
            wall.rotation.y = Math.PI / 2;
            if (i === 0) wall.position.x = -0.095;
            else wall.position.x = 0.095;
        }
        else {
            if (i === 1) wall.position.z = -0.095;
            else wall.position.z = 0.095;
        }
        group.add(wall);
    }

    group.position.set(x, y, z);

    return group;
}

function bigGridWalls(x, y, z) {
    const geometry = new THREE.BoxGeometry(0.64, 0.075, 0.02);
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const group = new THREE.Group();

    for (let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh(geometry, material);
        wall.position.y = 0.03;
        if (i % 2 === 0) {
            wall.rotation.y = Math.PI / 2;
            if (i === 0) wall.position.x = -0.31;
            else wall.position.x = 0.31;
        }
        else {
            if (i === 1) wall.position.z = -0.31;
            else wall.position.z = 0.31;
        }
        group.add(wall);
    }

    group.position.set(x, y, z);

    return group;
}

// A function to create a grid block with associated text
function createGridBlockWithText(row, col, x, y, z) {
    const blockGroup = new THREE.Group();

    // Create the block
    const block = gridBlock(x, y, z);
    blockGroup.add(block);

    // Create the text
    const identifier = getBlockIdentifier(row, col);

    const floorTile = block.children[0];
    Tiles[identifier] = {
        floor: floorTile, // assuming 'floor' is your tile mesh
        textMesh: null, // will be set later when the text is created
        noteGrid: null,
        noteGridElement: null
    };

    // Create the text and store it in Tiles with the correct identifier
    createText('', x - 0.0625, y, z + 0.07, { size: 0.15, height: 0.035, color: 0x000000 }, identifier);


    return { blockGroup: blockGroup, floorTile: floorTile };
}

// A function to create the entire Sudoku grid
function createSudokuGrid() {
    const sudokuGroup = new THREE.Group();

    const wall = new THREE.Group();
    //now make a scene with 9 of these
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            wall.add(bigGridWalls(i * 0.64 - 0.64, 0, j * 0.64 - 0.64));
        }
    }
    scene.add(wall);

    // Loop to create 9x9 grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // Calculate the position for the block
            const x = (col % 3) * 0.2 - 0.2 + Math.floor(col / 3) * 0.64 - 0.64;
            const z = (row % 3) * 0.2 - 0.2 + Math.floor(row / 3) * 0.64 - 0.64;
            const y = 0; // Adjust y as needed

            // Create the block with text
            const { blockGroup, floorTile } = createGridBlockWithText(row, col, x, y, z);
            sudokuGroup.add(blockGroup);

            // Update floorTile to have the world position
            floorTile.updateMatrixWorld(true);
            const worldPosition = new THREE.Vector3();
            floorTile.getWorldPosition(worldPosition);

            // Now, instead of adding the local floor tile, clone it and set its position to the world position
            const floorTileClone = floorTile.clone();
            floorTileClone.position.copy(worldPosition);
            floorTileClone.userData.identifier = getBlockIdentifier(row, col);
            floorTileClone.userData.originalEmissive = defaultEmissiveColor;
            floorTileClone.userData.originalEmissiveIntensity = floorTileClone.material.emissiveIntensity;
            Tiles[floorTileClone.userData.identifier].floor = floorTileClone;
            objects.push(floorTileClone)
        }
    }
    scene.add(bigGridWalls(0, 0, 0));
    scene.add(sudokuGroup);
}

function createNumbersRow() {

    for(let row = 0; row < 9; row++) {
        const x = row * 0.2 - 0.2 * 0.64 - 0.64;
        const z = 1.2;
        const y = 0;

        const blockGroup = new THREE.Group();

        const block = gridBlock(x, y, z);
        blockGroup.add(block);

        debugger;
        const identifier = `n${row + 1}`;

        const floorTile = block.children[0];
        Tiles[identifier] = {
            floor: floorTile, // assuming 'floor' is your tile mesh
            textMesh: null, // will be set later when the text is created
            noteGrid: null,
            noteGridElement: null
        };

        createText((row + 1).toString(), x - 0.0625, y, z + 0.07, { size: 0.15, height: 0.035, color: 0x000000 }, identifier);

        floorTile.updateMatrixWorld(true);
        const worldPosition = new THREE.Vector3();
        floorTile.getWorldPosition(worldPosition);

        const floorTileClone = floorTile.clone();
        floorTileClone.position.copy(worldPosition);
        floorTileClone.userData.identifier = identifier;
        floorTileClone.userData.originalEmissive = defaultEmissiveColor;
        floorTileClone.userData.originalEmissiveIntensity = floorTileClone.material.emissiveIntensity;
        Tiles[floorTileClone.userData.identifier].floor = floorTileClone;
        objects.push(floorTileClone)
        scene.add(blockGroup);
    }
}

// A function to get the identifier for the block, given its row and column
function getBlockIdentifier(row, col) {
    const letters = 'abcdefghi';
    return letters[row] + (col + 1);
}

// Fill the sudoku grid with the actual numbers
function fillSudokuGrid(sudokuGrid) {
    // Loop through the grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            // Get the identifier for the current block
            const identifier = getBlockIdentifier(row, col);

            // Get the number for the current block
            const number = sudokuGrid[row][col].toString();
            let currentTile = Tiles[identifier].floor;
            currentTile.userData.identifier = identifier;
            Tiles[identifier].noteGrid = createNoteGrid(currentTile);

            if (number === '0') {
                // If the number is 0, set the text to empty
                updateTextMesh(identifier, '');
            } else {
                // Otherwise, set the text to the number
                updateTextMesh(identifier, number);
                Tiles[identifier].noteGrid.visible = false;
                Tiles[identifier].noteGridElement.style.display = 'none';
                Tiles[identifier].noteGridElement.style.visibility = 'hidden';
                Tiles[identifier].noteGridElement.style.opacity = 0;
                Tiles[identifier].noteGridElement.style.pointerEvents = 'none';
                Tiles[identifier].textMesh.userData.assigned = true;
            }
        }
    }
}

function selectTile(tile) {
    // If the current tile is already selected, deselect it
    if (selectedTile === tile) {
        resetTile(tile);
        selectedTile = null; // Clear the selected tile
        return; // Exit the function early
    }

    // Deselect previous tile if any
    if (selectedTile) {
        resetTile(selectedTile);
    }

    resetHighlight();
    // Highlight selected tile
    selectedTile = tile;
    tile.material.emissive.setHex(0xBB012D); // Example highlight color

    // Retrieve the identifier from the tile's userData
    const identifier = tile.userData.identifier;

    // Parse the identifier to get the row and column
    const row = letters.indexOf(identifier[0]);
    const col = parseInt(identifier[1], 10) - 1;

    // Highlight row, column, block and number
    highlightRowAndColumn(row, col);
    highlightBlock(row, col);
    highlightNumber(sudokuGrid[row][col]);
}

function resetTile(tile) {

    if (!tile) {
        resetHighlight();
        return;
    }

    // Reset the tile's emissive color to its original color
    tile.material.emissive.setHex(tile.userData.originalEmissive || defaultEmissiveColor);

    // Reset the highlight for the row and column
    resetHighlight();

    // Clear the selected tile reference if it's the same as the tile being reset
    if (selectedTile === tile) {
        selectedTile = null;
    }
}

function highlightRowAndColumn(row, col) {
    // Loop through all tiles and highlight the ones in the same row and column
    for (let i = 0; i < 9; i++) {
        // Highlight row
        let rowIdentifier = getBlockIdentifier(row, i);
        let rowTile = Tiles[rowIdentifier].floor;
        if (rowTile) {
            rowTile.material.emissive.setHex(0xF04B4BD7);
        }

        // Highlight column
        let colIdentifier = getBlockIdentifier(i, col);
        let colTile = Tiles[colIdentifier].floor;
        if (colTile) {
            colTile.material.emissive.setHex(0xF04B4BD7);
        }
    }
}

function highlightBlock(row, col) {
    if (row < 0 || row > 8 || col < 0 || col > 8) {
        console.error('Invalid row or column:', row, col);
        return;
    }

    // Loop through all tiles and highlight the ones in the same block
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
    for (let i = rowStart; i < rowStart + 3; i++) {
        for (let j = colStart; j < colStart + 3; j++) {
            let identifier = getBlockIdentifier(i, j);
            let tile = Tiles[identifier].floor;
            if (tile) {
                tile.material.emissive.setHex(0xF04B4BD7);
            }
        }
    }
}

function highlightNumber(number) {

    if (number < 1 || number > 9) {
        return;
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const identifier = getBlockIdentifier(row, col);

            const currentNumber = sudokuGrid[row][col];

            if (currentNumber === number) {
                let tile = Tiles[identifier].floor;
                if (tile) {
                    tile.material.emissive.setHex(0xFF0000);
                    if (tile.material.emissiveIntensity) {
                        tile.material.emissiveIntensity = 10; // Increase the intensity
                    }
                }
            }
        }
    }
}

function resetHighlight() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let identifier = getBlockIdentifier(row, col);
            let tile = Tiles[identifier].floor;
            if (tile) {
                let originalColor = tile.userData.originalEmissive || defaultEmissiveColor;
                tile.material.emissive.setHex(originalColor);
                if (tile.material.emissiveIntensity) {
                    tile.material.emissiveIntensity = tile.userData.originalEmissiveIntensity || 1;
                }
            }
        }
    }
}

function fillSelectedTile(number) {
    if (!selectedTile) {
        console.error('No tile selected.');
        return;
    }

    const identifier = selectedTile.userData.identifier;
    const row = letters.indexOf(identifier[0]);
    const col = parseInt(identifier[1], 10) - 1;

    if (Tiles[identifier].textMesh.userData.assigned)
        return;

    if (isShiftDown) {
        if (sudokuGrid[row][col] !== 0) {
            console.log('Tile already has a number.');
            return;
        }
        addNoteToSelectedTile(number);
        return;
    }

    sudokuGrid[row][col] = number;
    const isCorrect = sudokuGrid[row][col] === filledSudokuGrid[row][col];
    const textMeshColor = isCorrect ? 0x006400 : 0xFF0000;

    updateTextMesh(identifier, number.toString(), textMeshColor);

    if (sudokuGrid[row][col] !== 0) {
        hideNotes(identifier);
        Tiles[identifier].noteGrid.visible = false;
    }

    if (isCorrect) {
        console.log('Correct!');
    } else {
        console.log('Incorrect!');
        wrongCount++;
        if (wrongCount === 3) {
            console.log('Game Over!');
        }
        document.getElementById('error-counter').textContent = wrongCount;
        document.getElementById('wrongCount').innerHTML = wrongCount;
    }

    resetTile(selectedTile);

    if (checkSudoku()) {
        alert('Sudoku is done and correct!');
    }
}

function clearSelectedTile() {
    if (!selectedTile) {
        console.error('No tile selected.');
        return;
    }

    const identifier = selectedTile.userData.identifier;
    const row = letters.indexOf(identifier[0]);
    const col = parseInt(identifier[1], 10) - 1;

    if (Tiles[identifier].textMesh.userData.assigned)
        return;

    sudokuGrid[row][col] = 0;
    updateTextMesh(identifier, '');

    showNotes(identifier);
    Tiles[identifier].noteGrid.visible = true;
}

function createNoteGrid(tile) {

    let gridMesh = new THREE.GridHelper(0.2, 3, 0x000000, 0x000000);
    gridMesh.position.copy(tile.position);
    gridMesh.position.y = 0.075;
    scene.add(gridMesh);

    const noteGridElement = document.createElement('div');
    noteGridElement.className = 'note-grid';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.id = `note-${i}-${j}`; // Give each note a unique ID based on its position
            noteElement.textContent = ''; // Start with empty text
            noteGridElement.appendChild(noteElement);
        }
    }
    Tiles[tile.userData.identifier].noteGridElement = noteGridElement;
    const noteGridObject = new CSS3DObject(noteGridElement);
    noteGridObject.scale.set(0.01, 0.01, 0.01);
    noteGridObject.position.copy(tile.position);
    noteGridObject.position.y += 0.075;

    noteGridObject.rotation.x = -Math.PI / 2;

    noteGridObject.renderOrder = 1;

    css3DScene.add(noteGridObject);
    return gridMesh;
}

function addNoteToSelectedTile(number) {

    const row = Math.floor((number - 1) / 3);
    const col = (number - 1) % 3;
    const noteId = `note-${row}-${col}`;
    const noteElement = Tiles[selectedTile.userData.identifier].noteGridElement.querySelector(`#${noteId}`);
    if (noteElement) {
        // If the note already has the number, remove it
        if (noteElement.textContent === number.toString()) {
            noteElement.textContent = '';
            return;
        }
        noteElement.textContent = number.toString();
        selectedTile = null;
    } else {
        console.log('Note element not found:', noteId);
    }
}

function hideNotes(identifier) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const noteId = `note-${i}-${j}`;
            const noteElement = Tiles[identifier].noteGridElement.querySelector(`#${noteId}`);
            noteElement.textContent = '';
            noteElement.style.display = 'none';
        }
    }
}

function showNotes(identifier) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const noteId = `note-${i}-${j}`;
            const noteElement = Tiles[identifier].noteGridElement.querySelector(`#${noteId}`);
            noteElement.style.display = 'flex';
        }
    }
}

function addErrorCounter() {
    const errorCounter = document.createElement('div');
    errorCounter.className = 'error-counter';
    errorCounter.id = 'error-counter';
    errorCounter.textContent = wrongCount.toString();
    const errorCounterObject = new CSS3DObject(errorCounter);
    errorCounterObject.scale.set(0.01, 0.01, 0.01);
    errorCounterObject.position.set(-1.5, 0, 0);
    errorCounterObject.rotation.x = -Math.PI / 2;
    errorCounterObject.renderOrder = 1;
    css3DScene.add(errorCounterObject);
    animateErrorCounter(errorCounterObject, 30000, 1.5);
}

function updateErrorCounterPosition(angle, radius, errorCounterObject) {
    errorCounterObject.position.x = radius * Math.cos(angle);
    errorCounterObject.position.z = radius * Math.sin(angle);
    // Adjust the y position as needed
    errorCounterObject.position.y = 0;
}

// This function creates and starts the tween animation
function animateErrorCounter(errorCounterObject, duration, radius) {
    var angle = { value: 0 }; // Start angle
    var targetAngle = { value: 2 * Math.PI }; // End angle (one full circle)

    // Create the tween
    var tween = new TWEEN.Tween(angle)
        .to(targetAngle, duration)
        .onUpdate(function() {
            updateErrorCounterPosition(angle.value, radius, errorCounterObject);
        })
        .repeat(Infinity) // Loop forever
        .start();
}

function checkSudoku() {
    // Loop through the grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            // Get the number for the current block
            const number = sudokuGrid[row][col];

            if (number === filledSudokuGrid[row][col]) {
                // If the number is the same as the filled grid, keep going
                continue;
            } else {
                // Otherwise, return false
                return false;
            }
        }
    }
    // If we get here, the sudoku is correct
    return true;
}

export { initSudokuGrid, selectedTile, objects, Tiles, TWEEN, selectTile, resetTile, clearSelectedTile, fillSelectedTile, highlightNumber, resetHighlight,  getBlockIdentifier};