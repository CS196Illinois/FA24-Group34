import React, { useState, useEffect } from 'react';
import './WordleGrid.css';

const WordleGrid = ({ currentRow, answer, level, onGameWon }) => {
  const [grid, setGrid] = useState([
    ['', '', '', '', ''], 
    ['', '', '', '', '']
  ]);
  const [colorGrid, setColorGrid] = useState([
    ['', '', '', '', ''], 
    ['', '', '', '', '']
  ]);
  const [rowDots, setRowDots] = useState([]);
  const [rows, setRows] = useState(2);
  const [gameResult, setGameResult] = useState(null);

  // Handle typing in the grid cells
  const handleChange = (event, rowIndex, colIndex) => {
    if (rowIndex === currentRow) {
      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = event.target.value.toUpperCase().slice(0, 1);// I AM LOSING MY MIND 
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

  // Check if the guess matches the answer and update colors, also check if my mental health is ok and if it is not, GIVE ME MORE HOMEWROK
  const checkAnswer = (rowNum) => {
    const guess = grid[rowNum].join('');
    const newColorGrid = [...colorGrid];
    const newRowDots = [...rowDots];
    let rowChanged = false;
    let correctLetters = 0;

    if (guess === answer) {
      newColorGrid[rowNum] = ['green', 'green', 'green', 'green', 'green']; //why tf do i need three === for one damn checking i dont know why so complicated
      newRowDots[rowNum] = 'green';
      setGameResult(true);
      onGameWon(true);
      rowChanged = true;
      correctLetters = 5;
    } else {
      grid[rowNum].forEach((letter, colIndex) => {
        if (letter === answer[colIndex]) {
          newColorGrid[rowNum][colIndex] = 'green';
          correctLetters++;
          rowChanged = true;
        } else if (answer.includes(letter)) {
          newColorGrid[rowNum][colIndex] = 'yellow';
          correctLetters++;
          rowChanged = true;
        } else {
          newColorGrid[rowNum][colIndex] = 'gray';
        }
      });

      

      // Determine row dot color for Level 2, twinkle twinkle little stars how I wonder what I can do to GET THIS SHIT DONE!
      if (level === 2) {
        if (correctLetters === 5) {
          newRowDots[rowNum] = 'green';
        } else if (correctLetters >= 2 && correctLetters <= 3) {
          newRowDots[rowNum] = 'yellow';
        } else {
          newRowDots[rowNum] = 'gray';
        }
      }
    }

    setColorGrid(newColorGrid);
    setRowDots(newRowDots);

    // If a green or yellow is found, add a new row if there are less than 5 rows, yummy haha lambda function hahahahahhaa
    if (rowChanged && rows < 5) {
      setRows(rows + 1);
      setGrid((prevGrid) => [...prevGrid, ['', '', '', '', '']]);
      setColorGrid((prevColorGrid) => [...prevColorGrid, ['', '', '', '', '']]);
      setRowDots((prevRowDots) => [...prevRowDots, 'gray']);
    }

    return correctLetters;
  };

  useEffect(() => {
    if (currentRow > 0 && currentRow <= 6) {
      checkAnswer(currentRow - 1);
    }
  }, [currentRow]);

  // Handle backspace for moving focus to the previous input box, yea i really did not like this part but womp womp guess no one cares abt what I like or not
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
      {grid.slice(0, rows).map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div key={colIndex} className="cell-container">
              <input
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
                  backgroundColor: level === 1 
                    ? (colorGrid[rowIndex][colIndex] || 'white')
                    : 'white',
                }}
                disabled={rowIndex !== currentRow || gameResult}
              />
            </div>
          ))}
          {level === 2 && rowIndex < currentRow && (
            <div 
              className="level-2-dot" //how about instead of getting some green dots, you get some -- I cannot finish this joke in an academic setting.
              style={{ 
                backgroundColor: rowDots[rowIndex] || 'gray' 
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default WordleGrid;