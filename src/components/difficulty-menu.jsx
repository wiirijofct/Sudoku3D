export default function DifficultyMenu({ onSelect }) {
    const handleDifficultyClick = (difficulty) => {
        console.log(`Difficulty selected: ${difficulty}`);
      onSelect(difficulty); // This function should be passed from the parent component
    };
  
    return (
      <div className="difficulty-menu">
        <button onClick={() => handleDifficultyClick('easy')}>Easy</button>
        <button onClick={() => handleDifficultyClick('medium')}>Medium</button>
        <button onClick={() => handleDifficultyClick('hard')}>Hard</button>
        <button onClick={() => handleDifficultyClick('harder')}>Harder</button>
        <button onClick={() => handleDifficultyClick('extremely hard')}>Extremely Hard</button>
        <button onClick={() => handleDifficultyClick('inhuman')}>Inhuman</button>
        {/* ... other difficulty levels */}
      </div>
    );
  }