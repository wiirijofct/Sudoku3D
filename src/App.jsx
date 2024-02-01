import { useState, useEffect } from 'react';
import SplineScene from './components/spline-scene.jsx';
import DifficultyMenu from './components/difficulty-menu.jsx';
import '../src/style.css';
import '../src/styles.css';
import { initScene, scene, camera, renderer, stats, css3DScene, css3DRenderer, controls, controlsCSS, OrbitCam, clock} from './js/scene-setup.js';
import { initInteractions } from './js/interactions.js';
import { initSudokuGrid, TWEEN } from './js/sudoku-grid.js';


function App() {

  const [currentScene, setCurrentScene] = useState('menu'); // 'menu', 'difficulty', 'game'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard', 'harder', 'extremely hard', 'inhuman'

  useEffect(() => {
    
    if (currentScene === 'game') {
      initScene();
      initSudokuGrid(difficulty);
      initInteractions();
      animate();
    }
  }, [currentScene]); 

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

  function render() {
    renderer.render(scene, camera);
    css3DRenderer.render(css3DScene, camera);
  }

  const handleMenuOptionClick = (option) => {
    if(option === 'easy'){
      handleDifficultySelect('easy');
    }
    if(option === 'medium'){
      handleDifficultySelect('medium');
    }
    if(option === 'hard'){
      handleDifficultySelect('hard');
    }
    if(option === 'harder'){
      handleDifficultySelect('very hard');
    }
    if(option === 'extremely hard'){
      handleDifficultySelect('extremely hard');
    }
    if(option === 'inhuman'){
      handleDifficultySelect('inhuman');
    }
    // setCurrentScene(option);
  };

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty); // Update the difficulty state
    setCurrentScene('game'); // Switch to the game scene
    // Here you would also initiate the setup of your game based on the selected difficulty
  };


  switch (currentScene) {
    case 'menu':
      return <SplineScene onMenuOptionClick={handleMenuOptionClick} />;
    case 'difficulty':
      return <DifficultyMenu onSelect={handleDifficultySelect} />;
    case 'game':
      return (
        <div id="container">
          {/* Render your Three.js canvas here */}
        </div>
      );
    default:
      return <div>Unknown scene</div>;
  }
}

export default App;
