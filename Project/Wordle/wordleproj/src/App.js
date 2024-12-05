import React, { useState, useEffect } from 'react';
import { generate } from 'random-words';
import './App.css';
import WordleGrid from './components/WordleGrid';

function App() {
  const [currentRow, setCurrentRow] = useState(0);
  const [answer, setAnswer] = useState('');
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Generate the answer once when the component mounts or when starting a new game
  const generateNewWord = () => {
    const generatedAnswer = generate({ minLength: 5, maxLength: 5 }).toUpperCase();
    setAnswer(generatedAnswer);
    console.log(generatedAnswer);
    setCurrentRow(0);
    setGameWon(false);
  };

  useEffect(() => {
    generateNewWord();
  }, []); // Initial word generation

  const handleCheck = () => {
    if (currentRow < 6) {
      setCurrentRow(currentRow + 1);
    }
  };

  const handleNextWord = () => {
    // Increment streak and attempts, if not do this, i will sad, yay i did
    const newStreak = streak + 1;
    setStreak(newStreak);
    setAttempts(attempts + 1);

    // Check if we should move to Level 2 please!!!!
    if (newStreak === 5 && level === 1) {
      setLevel(2);
    }

    // Reset for next word, OPTIMUS PRIME EE EE OO AAA  OOA AA E--- boom megatron bumbubee 
    generateNewWord();
  };

  return (
    <div className="App">
      <div className="game-info">
        <p className="wordletext">
          {level === 1 ? 'LEVEL 1 WORDLE' : 'LEVEL 2 WORDLE'}
        </p>
        <div className="stats-container">
          <p>Streak: {streak}</p>
          <p>Level: {level}</p>
          <p>Attempts: {attempts}</p>
        </div>
      </div>
      <WordleGrid 
        key={answer} // Force reset when answer changes, im actually gonna tweak
        currentRow={currentRow} 
        answer={answer} 
        level={level}
        onGameWon={(isWon) => setGameWon(isWon)}
      />
      <div className="button-container">
        {!gameWon ? (
          <button className="button" onClick={handleCheck}>
            Check
          </button>
        ) : (
          <button className="button next-button" onClick={handleNextWord}>
            Next Word
          </button> //haha yum yum
        )}
      </div>
    </div>
  );
}

export default App;