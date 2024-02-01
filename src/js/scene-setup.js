import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js';
import Stats from 'three/addons/libs/stats.module.js';

const clock = new THREE.Clock(); 
let scene, camera, renderer, stats, controls, controlsCSS;
let css3DScene, css3DRenderer;
let OrbitCam = true;

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
    // camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    camera.rotateX(-Math.PI / 2);
    camera.lookAt(0, 0, 0);


    // Initialize controls

    controls = initOrbitControls(camera, renderer.domElement);
    controlsCSS = initOrbitCSSControls(camera, css3DRenderer.domElement);

    // controls handler

    document.addEventListener('keydown', function (event) {
        if (event.key === 'v' || event.key === 'V') {
            debugger;
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

function initFirstPersonControls(camera, domElement) {
    controls = new FirstPersonControls(camera, domElement);
    controls.movementSpeed = 1;
    controls.lookSpeed = 0.1;
    controls.lookVertical = true; // Allows looking up and down
    controls.constrainVertical = false; // Removes vertical constraints
    // controls.lookAt( scene.position );
    return controls;
}
function initFirstPersonCSSControls(camera, domElement) {
    controlsCSS = new FirstPersonControls(camera, domElement);
    controlsCSS.movementSpeed = 1;
    controlsCSS.lookSpeed = 0.1;
    controlsCSS.lookVertical = true; // Allows looking up and down
    controlsCSS.constrainVertical = false; // Removes vertical constraints
    // controlsCSS.lookAt( scene.position );
    return controlsCSS;
}

function initOrbitControls(camera, domElement) {
    controls = new OrbitControls(camera, domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.enablePan = true;
    controls.enableDamping = true;
    return controls;
}

function initOrbitCSSControls(camera, domElement) {
    controlsCSS = new OrbitControls(camera, domElement);
    controlsCSS.target.set(0, 0, 0);
    controlsCSS.update();
    controlsCSS.enablePan = true;
    controlsCSS.enableDamping = true;
    return controlsCSS;
}

function changeControls() {
    if (OrbitCam) {
        // Dispose of OrbitControls
        controls.dispose();
        controlsCSS.dispose();
        
        // Initialize FirstPersonControls
        controls = initFirstPersonControls(camera, renderer.domElement);
        controlsCSS = initFirstPersonCSSControls(camera, css3DRenderer.domElement);

        OrbitCam = false;
    } else {
        // Dispose of FirstPersonControls
        controls.dispose();
        controlsCSS.dispose();

        // Initialize OrbitControls
        controls = initOrbitControls(camera, renderer.domElement);
        controlsCSS = initOrbitCSSControls(camera, css3DRenderer.domElement);

        OrbitCam = true;
    }
}

export { initScene, scene, camera, renderer, stats, controls, controlsCSS, css3DScene, css3DRenderer, OrbitCam, clock};