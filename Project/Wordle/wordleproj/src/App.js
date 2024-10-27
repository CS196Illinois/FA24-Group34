import './App.css';
import WordleGrid from './components/WordleGrid';
import React, { useState } from 'react';

function App() {
  const [currentRow, setCurrentRow] = useState(0); // Track which row we are on

  const handleCheck = () => {
    if (currentRow < 6) {
      setCurrentRow(currentRow + 1); // Move to the next row after checking
    }
  };

  return (
    <div className="App">
      <p className="wordletext">CS124H WORDLE</p>
      <WordleGrid currentRow={currentRow} />
      <button className="button" onClick={handleCheck}> Check </button>
    </div>
  );
}

export default App;
