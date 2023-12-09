import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let contentWidth = window.innerWidth;
let contentHeight = window.innerHeight;

let camera, scene, renderer, mesh;

window.onload = function() {
    init();
};

// init

function init() {
    initGraphics();

    window.addEventListener('resize', onWindowResized);

    onWindowResized();

    requestAnimationFrame(animation);
}

function initGraphics() {
    camera = new THREE.PerspectiveCamera( 70, contentWidth / contentHeight, 0.01, 10 );
    camera.position.z = 0.5;
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    const controls = new OrbitControls(camera, renderer.domElement);
			controls.target.set( 0, 0.5, 0 );
			controls.update();
			controls.enablePan = false;
			controls.enableDamping = true;

    // const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    // geometry.translate(0, 0.05, 0);
    // const material = new THREE.MeshNormalMaterial();

    // mesh = new THREE.Mesh( geometry, material );
    // mesh.position.z = -0.2;
    // mesh.position.y = 0.2;
    // scene.add( mesh );

    gridBlock(0, 0, 0);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( contentWidth, contentHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );
}

function updateWindowDimensions() {
    const newContentWidth = window.innerWidth;
    const newContentHeight = window.innerHeight;
    
    if (newContentWidth !== contentWidth || newContentHeight !== contentHeight) {
        contentWidth = newContentWidth;
        contentHeight = newContentHeight;
        
        renderer.setSize( contentWidth, contentHeight );
        camera.aspect = contentWidth / contentHeight;
        camera.updateProjectionMatrix();
    }
}

function onWindowResized() {
    updateWindowDimensions();
}

function gridBlock(x, y, z) {
    const geometry = new THREE.BoxGeometry( 0.2, 0.05, 0.2 );
    geometry.translate(x, y, z);
    const material = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
}

// animation
function animation(time) {
    // mesh.rotation.y = time / 2000;
    renderer.render(scene, camera);
}
