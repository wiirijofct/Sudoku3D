import * as THREE from 'three';
import * as SUDO from './sudokon.js';
import * as SUDO2 from './sudoku2.js';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let contentWidth = window.innerWidth;
let contentHeight = window.innerHeight;

let camera, scene, renderer, stats, tGroup, textMesh1, textGeo, materials;

let text = 'S',

    bevelEnabled = false,

    font = undefined,

    fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
    fontWeight = 'bold'; // normal bold

const height = 0.05,
    size = 0.15,
    hover = 1,

    curveSegments = 2,

    bevelThickness = 2,
    bevelSize = 1.5;

// const mirror = true;

const fontMap = {

    'helvetiker': 0,
    'optimer': 1,
    'gentilis': 2,
    'droid/droid_sans': 3,
    'droid/droid_serif': 4

};

const weightMap = {

    'regular': 0,
    'bold': 1

};

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

    materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];
    
    grid();
    
    
    let sudokuGrid = SUDO2.createEmptySudoku();
    console.log("Initialized grid:", JSON.parse(JSON.stringify(sudokuGrid)));
    
    SUDO2.fillDiagonal(sudokuGrid);
    console.log("Grid after filling diagonals:", JSON.parse(JSON.stringify(sudokuGrid)));
    SUDO2.fillRemaining(sudokuGrid, 0, 3);
    SUDO2.printGrid(sudokuGrid);
    
    tGroup = new THREE.Group();
    
    loadFont();
    
    //stats
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

function loadFont() {

    const loader = new FontLoader();
    loader.load( 'fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {

        font = response;

        refreshText();

    } );

}

function createText() {

    textGeo = new TextGeometry( text, {

        font: font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled

    } );

    textGeo.computeBoundingBox();
    // textGeo.computeVertexNormals();

    textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = 0;
    textMesh1.position.y = 0;
    textMesh1.position.z = 0;

    scene.add( textMesh1 );
    // group.add( textMesh1 );


    // if ( mirror ) {

    //     textMesh2 = new THREE.Mesh( textGeo, materials );

    //     textMesh2.position.x = centerOffset;
    //     textMesh2.position.y = - hover;
    //     textMesh2.position.z = height;

    //     textMesh2.rotation.x = Math.PI;
    //     textMesh2.rotation.y = Math.PI * 2;

    //     group.add( textMesh2 );

    // }
}

function refreshText() {

    tGroup.remove( textMesh1 );
    // if ( mirror ) group.remove( textMesh2 );

    if ( ! text ) return;

    createText();

}


// animation
function animation(time) {
    // mesh.rotation.y = time / 2000;
    renderer.render(scene, camera);
}
