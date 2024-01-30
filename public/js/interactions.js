import * as THREE from 'three';
import { scene, camera, renderer } from './scene-setup.js';
import { selectedTile, selectTile, resetTile, clearSelectedTile, fillSelectedTile, highlightNumber, resetHighlight, objects, Tiles, getBlockIdentifier} from './sudoku-grid.js';

let raycaster, pointer;
let isShiftDown = false;
let rollOverMesh, rollOverMaterial;


function initInteractions() {
    // Initialize raycaster, mouse vector, and event listeners here
    // ...
    
    // Initialize roll-over mesh
    const rollOverGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);
    
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    // Initialize event listeners
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onDocumentKeyDown);
    document.addEventListener('keyup', onDocumentKeyUp);
}

function onPointerMove(event) {

    pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(pointer, camera);


    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {

        rollOverMesh.visible = true;
        const intersect = intersects[0];

        rollOverMesh.position.copy(intersect.object.position).add(intersect.face.normal);
        rollOverMesh.position.y = intersect.object.position.y + 0.01;

    } else {
        rollOverMesh.visible = false;
    }

}

function onPointerDown(event) {

    pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {

        const intersect = intersects[0].object;
        // Use userData to access the identifier
        const identifier = intersect.userData.identifier;
        if (identifier) {
            selectTile(intersect);
        }

        // example for keybinds
        // if (isShiftDown) {
    }

}

function onDocumentKeyDown(event) {

    switch (event.keyCode) {

        case 16: isShiftDown = true; break;
        case 81:
            resetTile(selectedTile);
            break;
        case 8: clearSelectedTile(); break;
        case 49:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(1);
            else
                fillSelectedTile(1);
            break;
        case 50:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(2);
            else
                fillSelectedTile(2);
            break;
        case 51:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(3);
            else
                fillSelectedTile(3);
            break;
        case 52:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(4);
            else
                fillSelectedTile(4);
            break;
        case 53:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(5);
            else
                fillSelectedTile(5);
            break;
        case 54:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(6);
            else
                fillSelectedTile(6);
            break;
        case 55:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(7);
            else
                fillSelectedTile(7);
            break;
        case 56:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(8);
            else
                fillSelectedTile(8);
            break;
        case 57:
            resetHighlight();
            if (!selectedTile || Tiles[selectedTile.userData.identifier].textMesh.userData.assigned)
                highlightNumber(9);
            else
                fillSelectedTile(9);
            break;

    }

}

function onDocumentKeyUp(event) {

    switch (event.keyCode) {

        case 16: isShiftDown = false; break;

    }

}

export { initInteractions, raycaster, pointer , rollOverMesh, rollOverMaterial, isShiftDown};