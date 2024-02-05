import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';
import Stats from 'three/addons/libs/stats.module.js';

const clock = new THREE.Clock(); 
let scene, camera, renderer, stats, controls, controlsCSS;
let css3DScene, css3DRenderer;
let mapCam = true;

function initScene() {
    
    // Initialize variables
    let contentWidth = window.innerWidth;
    let contentHeight = window.innerHeight;
    
    // Initialize renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(contentWidth, contentHeight);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);
    
    css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(contentWidth, contentHeight);
    css3DRenderer.domElement.style.position = 'absolute';
    css3DRenderer.domElement.style.top = 0;
    document.getElementById('container').appendChild(css3DRenderer.domElement);

    // Initialize scene
    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    css3DScene = new THREE.Scene();

    // Initialize camera
    camera = new THREE.PerspectiveCamera(70, contentWidth / contentHeight, 0.01, 10);
    camera.position.y = 2.2;
    camera.position.z = 0;
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Initialize controls

    controls = initMapControls(camera, renderer.domElement);
    controlsCSS = initMapControls(camera, css3DRenderer.domElement);

    controls.update();
    // controls handler

    document.addEventListener('keydown', function (event) {
        if (event.key === 'v' || event.key === 'V') {
            changeControls();
        }
    }
    );

    // Resize handler
    window.addEventListener('resize', function () {
        const newContentWidth = window.innerWidth;
        const newContentHeight = window.innerHeight;

        if (newContentWidth !== contentWidth || newContentHeight !== contentHeight) {
            contentWidth = newContentWidth;
            contentHeight = newContentHeight;

            renderer.setSize(contentWidth, contentHeight);
            css3DRenderer.setSize(contentWidth, contentHeight);
            camera.aspect = contentWidth / contentHeight;
            camera.updateProjectionMatrix();
        }
        renderer.setSize(contentWidth, contentHeight);
        css3DRenderer.setSize(contentWidth, contentHeight);
    }, false);

    // Initialize lights

    pontualLight(0, 1.5, 0);

    //stats
    stats = new Stats();
    document.body.appendChild(stats.dom);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
  
}

function pontualLight(x, y, z) {
    const sphere = new THREE.SphereGeometry(0.01, 16, 8);

    const light = new THREE.PointLight(0xffffff, 10);
    // light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xff0040 })));
    light.position.set(x, y, z);
    scene.add(light);
}

function directionalLight(x, y, z) {
    const light = new THREE.DirectionalLight(0xffffff, 20);
    // light.lookAt(0, 0, 0);
    light.position.set(x, y, z).normalize();
    scene.add(light);
}

function ambientLight() {
    const light = new THREE.AmbientLight(0x404040, 100); // soft white light
    scene.add(light);
}

function initMapControls(camera, domElement) {
    // set up controls
    controls = new MapControls(camera, domElement);
    controls.enablePan = true;

    // limits
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;

    // configure controls
    controls.zoomToCursor = true;
    controls.panSpeed = 0.5;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;
    controls.minDistance = 0.5;
    controls.maxDistance = 3;
    controls.maxTargetRadius = 1.5;

    return controls;
}


function changeControls() {
    if (mapCam) {
        // Dispose of OrbitControls
        controls.dispose();
        controlsCSS.dispose();
        
        // Set camera
        camera.up.set(0, 0, -1);
        
        mapCam = false;
    } else {

        // set camera
        camera.position.set(0, 2.2, 0);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 1, 0);

        // Initialize OrbitControls
        controls = initMapControls(camera, renderer.domElement);
        controlsCSS = initMapControls(camera, css3DRenderer.domElement);

        mapCam = true;
    }
}


export { initScene, scene, camera, renderer, stats, controls, controlsCSS, css3DScene, css3DRenderer, mapCam, clock};