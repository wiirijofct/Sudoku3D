import * as THREE from 'three';
import * as SUDO from './sudokon.js';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let contentWidth = window.innerWidth;
let contentHeight = window.innerHeight;

let camera, scene, renderer, stats;

window.onload = function() {
    init();
};

// init

function init() {
    initGraphics();

    window.addEventListener('resize', onWindowResized);

    onWindowResized();

}

function initGraphics() {
    renderer = new THREE.WebGLRenderer( { antialias: true, logarithmicDepthBuffer: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( contentWidth, contentHeight );
    renderer.setAnimationLoop( animation );
    renderer.setClearColor(0x000000);
    document.body.appendChild( renderer.domElement );
    
    
    camera = new THREE.PerspectiveCamera( 70, contentWidth / contentHeight, 0.01, 10 );
    camera.position.y = 1.5;
    camera.lookAt(0, 0, 0);

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfe3dd );
	scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;

    // pontualLight(0, 0.7, 0);
    // pontualLight(0.5, 0.7, -0.5);
    // pontualLight(-0.5, 0.7, 0.5);
    // directionalLight(0, 1, 0);
    ambientLight();
    
    grid();
    // big3b3Grid();
    //stats

    let solved = SUDO.generateSolvedSudoku();
    let sudo = new SUDO.generateSudoku(solved, 10);
    SUDO.printGrid(sudo);

    stats = new Stats();
    document.body.appendChild( stats.dom );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';

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
    renderer.setSize( contentWidth, contentHeight );
}

function pontualLight(x, y, z) {
    const sphere = new THREE.SphereGeometry( 0.01, 16, 8 );

    const light = new THREE.PointLight( 0xffffff, 10 );
	light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    light.position.set( x, y, z );
    scene.add( light );
}

function directionalLight(x, y, z) {
    const light = new THREE.DirectionalLight( 0xffffff, 20 );
    // light.lookAt(0, 0, 0);
    light.position.set( x, y, z ).normalize();
    scene.add( light );
}

function ambientLight() {
    const light = new THREE.AmbientLight( 0x404040 , 100); // soft white light
    scene.add( light );
}

function onWindowResized() {
    updateWindowDimensions();
}

function gridBlock(x, y, z) {
    const floorTile = new THREE.BoxGeometry( 0.2, 0.01, 0.2 );
    const wallTile = new THREE.BoxGeometry( 0.2, 0.05, 0.01 );
    // gray: 0x808080
    const materialF = new THREE.MeshLambertMaterial( { color: 0x808080});
    // darker gray: 0x505050
    const materialW = new THREE.MeshLambertMaterial( { color: 0x505050});

    const floor = new THREE.Mesh( floorTile, materialF );

    const group = new THREE.Group();
    group.add(floor);

    for(let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh( wallTile, materialW );
        wall.position.y = 0.03;
        // rotate wall
        if(i % 2 === 0) {
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

//
function bigGridWalls(x, y, z){
    const geometry = new THREE.BoxGeometry( 0.64, 0.075, 0.02 );
    const material = new THREE.MeshLambertMaterial( { color: 0x000000});
    const group = new THREE.Group();

    for(let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh( geometry, material );
        wall.position.y = 0.03;
        if(i % 2 === 0) {
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



// function to create a 9x9 grid of blocks
function grid(){
    
    const group = new THREE.Group();

    const bigWall = bigGridWalls(0, 0, 0);
    group.add(bigWall);
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {

            const block = gridBlock(i * 0.2 - 0.2, 0, j * 0.2 - 0.2);
            group.add(block);
        }
    }
    // scene.add(group);

    //now make a scene with 9 of these
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {

            const newGroup = group.clone();
            newGroup.position.set(i * 0.64 - 0.64, 0, j * 0.64 - 0.64);
            scene.add(newGroup);
        }
    }

}


// animation
function animation(time) {
    // mesh.rotation.y = time / 2000;
    renderer.render(scene, camera);
}
