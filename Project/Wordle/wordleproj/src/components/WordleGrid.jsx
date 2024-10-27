import React, { useState, useEffect } from 'react';
import './WordleGrid.css';

const WordleGrid = ({ currentRow }) => {
  // Using a 2D array to represent the grid
  const [grid, setGrid] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  const [colorGrid, setColorGrid] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  const answer = "HELLO"; // Example answer
  
  const handleChange = (event, rowIndex, colIndex) => {
    if (rowIndex === currentRow) { // Only allow input for the current row

      const newGrid = [...grid]; //copy grid

      newGrid[rowIndex][colIndex] = event.target.value.toUpperCase().slice(0, 1); // Limit input to one letter
      setGrid(newGrid);

      // Automatically move to the next input box
      if (event.target.value && colIndex < 4) {
        const nextInput = document.querySelector(

          `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`

        );

        if (nextInput) nextInput.focus();
      }
    }
  };

  const checkAnswer = (rowNum) => {
    const guess = grid[rowNum].join(''); //to create the guess String
    // const answer = answerArray.join('');

    const newColorGrid = [...colorGrid];

    if (guess === answer) {
      newColorGrid[rowNum] = ['green', 'green', 'green', 'green', 'green'];
    } else {
      grid[rowNum].forEach((letter, colIndex) => {
        if (letter === answer[colIndex]) {
          newColorGrid[rowNum][colIndex] = 'green'; // Correct letter and position
        } else if (answer.includes(letter)) {
          newColorGrid[rowNum][colIndex] = 'yellow'; // Correct letter but wrong position, I want to fix it so that a letter is put in all its current spots, it shows as grey instead of yellow
        } else {
          newColorGrid[rowNum][colIndex] = 'gray'; // Incorrect letter
        }
      });
    }
    setColorGrid(newColorGrid);
  };

  useEffect(() => {
    if (currentRow > 0 && currentRow <= 6) {
      checkAnswer(currentRow - 1); // Check the previous row when the current row updates
    }
  }, [currentRow]);

  const handleKeyDown = (event, rowIndex, colIndex) => {
    if (event.key === 'Backspace' && !grid[rowIndex][colIndex] && colIndex > 0) {
      const prevInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <input
              key={colIndex}
              type="text"
              value={cell}
              onChange={(event) => handleChange(event, rowIndex, colIndex)}
              onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
              maxLength="1"
              className="grid-cell"
              data-row={rowIndex}
              data-col={colIndex}
              style={{
                color: 'black',
                backgroundColor: colorGrid[rowIndex][colIndex] || 'white',
              }}
              disabled={rowIndex !== currentRow} // Disable input for all rows except the current one, I had to look this one up
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordleGrid;
