
import './App.css';
import WordleGrid from './components/WordleGrid';

function App() {
  return (
    <div className="App">
      <p className="wordletext">CS124H WORDLE</p>
      <WordleGrid></WordleGrid>
      <button className='button'> Check </button>
    </div>
  );
}

export default App;
