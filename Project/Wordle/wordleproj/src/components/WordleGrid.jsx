import React, { useState, useEffect } from 'react';
import './WordleGrid.css';

const WordleGrid = ({ currentRow, answer }) => {
  
  console.log(answer);
  // var to track the grid, colorGrid, and the number of rows
  const [grid, setGrid] = useState([
    ['', '', '', '', ''], 
    ['', '', '', '', '']
  ]); // Start with 2 rows
  const [colorGrid, setColorGrid] = useState([
    ['', '', '', '', ''], 
    ['', '', '', '', '']
  ]); // Start with 2 rows
  const [rows, setRows] = useState(2); // Initial number of rows is 2

  // Handle typing in the grid cells
  const handleChange = (event, rowIndex, colIndex) => {
    if (rowIndex === currentRow) { // Only allow input for the current row
      const newGrid = [...grid]; // Copy grid
      newGrid[rowIndex][colIndex] = event.target.value.toUpperCase().slice(0, 1); // Limit input to 1 letter for each box
      setGrid(newGrid);

      // Move to the next input box
      if (event.target.value && colIndex < 4) {
        const nextInput = document.querySelector(
          `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Check if the guess matches the answer and update colors
  const checkAnswer = (rowNum) => {
    const guess = grid[rowNum].join(''); // Combine the row letters into a string
    const newColorGrid = [...colorGrid];
    let rowChanged = false;

    if (guess === answer) {
      newColorGrid[rowNum] = ['green', 'green', 'green', 'green', 'green']; // All correct
    } else {
      grid[rowNum].forEach((letter, colIndex) => {
        if (letter === answer[colIndex]) {
          newColorGrid[rowNum][colIndex] = 'green'; // Correct letter and position

          rowChanged = true;
        } else if (answer.includes(letter)) {
          newColorGrid[rowNum][colIndex] = 'yellow'; // Correct letter but wrong position

          rowChanged = true;
        } else {
          newColorGrid[rowNum][colIndex] = 'gray'; // Incorrect letter
        }
      });
    }

    setColorGrid(newColorGrid);

    // If a green or yellow is found, add a new row if there are less than 5 rows
    if (rowChanged && rows < 5) {
      setRows(rows + 1); // Increase rows
      // Add a new empty rows to both
      setGrid((prevGrid) => [...prevGrid, ['', '', '', '', '']]);
      setColorGrid((prevColorGrid) => [...prevColorGrid, ['', '', '', '', '']]);
    }
  };

  useEffect(() => {
    if (currentRow > 0 && currentRow <= 6) {
      checkAnswer(currentRow - 1); // Check the previous row when the current row updates
    }
  }, [currentRow]);

  // Handle backspace for moving focus to the previous input box
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
      {grid.slice(0, rows).map((row, rowIndex) => ( // Only show rows up to our 'rows' count
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
              disabled={rowIndex !== currentRow} // Disable input for all rows except the current one
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordleGrid;
