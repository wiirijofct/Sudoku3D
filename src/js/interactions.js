import * as THREE from 'three';
import { scene, camera, mapCam } from './scene-setup.js';
import { selectedTile, selectTile, resetTile, clearSelectedTile, fillSelectedTile, fillTile, highlightNumber, resetHighlight, objects, Tiles, getBlockIdentifier, toggle } from './sudoku-grid.js';

let raycaster, pointer;
let isShiftDown = false;
let rollOverMesh, rollOverMaterial;
let targetPosition = new THREE.Vector3();
let targetRotation = new THREE.Quaternion();
let isTransitioning = false;


function initInteractions() {
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

        if (!mapCam) {
            const identifier = intersect.object.userData.identifier;
            if (identifier != null) { // Check if identifier is not null or undefined
                const centerIdentifier = getSubgridCenterTile(identifier);
                const centerPosition = Tiles[centerIdentifier].floor.position;

                // Set target position and start transitioning
                targetPosition.copy(centerPosition);
                targetPosition.y = camera.position.y; // Keep the current camera height

                // Set target rotation (look at the center position)
                let targetLookAt = new THREE.Vector3(targetPosition.x, 0, targetPosition.z);
                targetRotation.setFromRotationMatrix(
                    new THREE.Matrix4().lookAt(camera.position, targetLookAt, camera.up)
                );

                // Begin the transition
                isTransitioning = true;
            }
        }
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
        
        if (!toggle) {
            if (identifier) 
                selectTile(intersect);
        }else{
            if (identifier[0] === 'n')
                selectTile(intersect);
            else{
                fillTile(identifier, parseInt(selectedTile.userData.identifier[1]));
                highlightNumber(parseInt(selectedTile.userData.identifier[1]));
            }
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

function getSubgridCenterTile(identifier) {
    // Assuming identifier is like 'c3' where 'c' is the row (1-9) and '3' is the column (1-9)
    const rows = 'abcdefghi'; // Example row identifiers
    const size = 3; // Size of the subgrid

    // Get the row and column as numbers
    const row = rows.indexOf(identifier[0].toLowerCase()) + 1; // Convert 'c' to 3 for example
    const col = parseInt(identifier[1]); // Convert '3' to 3

    // Calculate the center tile's row and column of the subgrid
    const centerRow = Math.ceil(row / size) * size - Math.floor(size / 2);
    const centerCol = Math.ceil(col / size) * size - Math.floor(size / 2);

    // Convert back to identifier
    const centerIdentifier = rows[centerRow - 1] + centerCol;

    return centerIdentifier; // 'b2' for 'c3' input
}

function updateCameraTransition(delta) {
    if (!isTransitioning) return;

    const transitionSpeed = 0.5; // Speed of the transition, adjust as needed
    const lerpFactor = transitionSpeed * delta;

    debugger;
    // Linearly interpolate the position
    camera.position.lerp(targetPosition, lerpFactor);

    // Spherical linear interpolation of the rotation
    camera.quaternion.slerp(targetRotation, lerpFactor*0.5);

    // Check if the camera is close enough to the target position to end the transition
    if (camera.position.distanceTo(targetPosition) < 0.1 && !camera.quaternion.equals(targetRotation)) {
        isTransitioning = false;
    }
}


export { initInteractions, raycaster, pointer, rollOverMesh, rollOverMaterial, isShiftDown, updateCameraTransition };