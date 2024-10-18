import React, { useState } from 'react';
import './WordleGrid.css';

function WordleGrid() {
  // Basically using a 2d array from java, react initialization is a bit weird lol
  const [grid, setGrid] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  
  //basically changing the particular row and colum by using the change in value of text box as trigger to call function
  const handleChange = (event, rowIndex, colIndex) => {
    const newGrid = [...grid]; // Making a copy of the current array, the ... is like saying copy it
    newGrid[rowIndex][colIndex] = event.target.value.toUpperCase(); // Update the letter in the grid based on which box called the function
    setGrid(newGrid); //sets the array to the updated array
  
    // Move to the next input box all the way up to the last column
    if (event.target.value && colIndex < 4) {

        //almost like javascript and html, i used queryselvector (hardest part to figure out cus of the syntax)
      const nextInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`
      );

      if (nextInput) {
        nextInput.focus();// Focus the next input if it exists
      }
     
    }
  };

  const handleKeyDown = (event, rowIndex, colIndex) => {
    if (event.key === 'Backspace' && !grid[rowIndex][colIndex]) {
      // Will move cursor to the previous input box if backspace is pressed and current box is empty
      if (colIndex > 0) {
        const prevInput = document.querySelector(
          `input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`
        );
        if (prevInput) prevInput.focus();
      }
    } else if (event.key === 'ArrowRight' && colIndex < 4) {
      
      const nextInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`
      );
      if (nextInput) nextInput.focus();
    } else if (event.key === 'ArrowLeft' && colIndex > 0) {
      
      const prevInput = document.querySelector(
        `input[data-row="${rowIndex}"][data-col="${colIndex - 1}"]`
      );
      if (prevInput) prevInput.focus();
    }

  };
  

  return (
    <div className="grid-container">
      {/* Array.map is a rlly good thing if you have a lot of values in an array and have 
      the exact same format to display all of them or do the same thing with all of them */}
      {grid.map((row, rowIndex) => (
        //mapping the rows first, -> saying for each row in the grid

        <div key={rowIndex} className="grid-row">

          {row.map((cell, colIndex) => (
            //now it is saying for each column in this row

            <input
              key={colIndex}
              type="text"
              value={cell}
              onChange={(event) => handleChange(event, rowIndex, colIndex)} 
              onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)} //keyDown is different than onChange because it records the key pressed
              maxLength="1"
              className="grid-cell"
              data-row={rowIndex} // basically lets us know which row and column we are on
              data-col={colIndex}
            />
          ))}

        </div>

      ))}
    </div>
  );
}

export default WordleGrid;
