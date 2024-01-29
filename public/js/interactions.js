import * as THREE from 'three';
import { scene, camera, renderer } from './scene-setup.js';

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function initInteractions() {
    // Initialize raycaster, mouse vector, and event listeners here
    // ...

    // Initialize roll-over mesh
    const rollOverGeo = new THREE.BoxGeometry(0.2, 0.1, 0.2);
    rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);

    

}

export { initInteractions, raycaster, mouse };