import { initScene, scene, camera, renderer, stats, css3DScene, css3DRenderer, controls, controlsCSS, OrbitCam, clock} from './scene-setup.js';
import { initInteractions} from './interactions.js';
import { initSudokuGrid, TWEEN } from './sudoku-grid.js';


window.onload = function () {
    initScene();
    initSudokuGrid();
    initInteractions();
    animate();
};

function animate(time) {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    TWEEN.update(time);
    if(!OrbitCam) {
        controls.update(delta);
        controlsCSS.update(delta);
    }
    render();
    stats.update();
}

// animation
function render() {
    renderer.render(scene, camera);
    css3DRenderer.render(css3DScene, camera);
}