

const contentWidth = window.innerWidth;
const contentHeight = window.innerHeight;

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
    camera.position.z = 1;

    scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material = new THREE.MeshNormalMaterial();

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

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

// animation


function animation( time ) {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render( scene, camera );
}