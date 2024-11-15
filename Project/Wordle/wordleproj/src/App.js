import './App.css';
import WordleGrid from './components/WordleGrid';
import React, { useState, useEffect } from 'react';
import { generate } from 'random-words';

function App() {
  const [currentRow, setCurrentRow] = useState(0); // Track which row we are on
  const [answer, setAnswer] = useState('');

  // Generate the answer once when the component mounts
  useEffect(() => {
    const generatedAnswer = generate({ minLength: 5, maxLength: 5 }).toUpperCase();
    setAnswer(generatedAnswer);
    
  }, []); // Empty dependency - > run onyl once

  const handleCheck = () => {
    if (currentRow < 6) {
      setCurrentRow(currentRow + 1); // Move to the next row after checking
    }
  };

  return (
    <div className="App">
      <p className="wordletext">CS124H WORDLE</p>
      <WordleGrid currentRow={currentRow} answer={answer} />
      <button className="button" onClick={handleCheck}> Check </button>
    </div>
  );
}

export default App;
