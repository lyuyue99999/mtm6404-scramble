/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

const wordsList = [
  "banana", "react", "syntax", "object", "coding",
  "array", "function", "browser", "script", "variable"
];

function App() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [strikes, setStrikes] = useState(() => parseInt(localStorage.getItem("strikes")) || 0);
  const [passes, setPasses] = useState(() => parseInt(localStorage.getItem("passes")) || 3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("words");
    if (saved) {
      setWords(JSON.parse(saved));
    } else {
      const shuffled = shuffle(wordsList);
      setWords(shuffled);
      localStorage.setItem("words", JSON.stringify(shuffled));
    }
  }, []);

  useEffect(() => {
    if (!gameOver && words.length > 0) {
      const word = words[0];
      setCurrentWord(word);
      setScrambledWord(shuffle(word));
    }
  }, [words, gameOver]);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
  }, [points, strikes, passes]);

  function handleGuess(e) {
    e.preventDefault();
    if (guess.trim().toLowerCase() === currentWord) {
      setPoints(points + 1);
      setMessage("Correct!");
      nextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect!");
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
    setGuess("");
  }

  function nextWord() {
    const remaining = words.slice(1);
    setWords(remaining);
    localStorage.setItem("words", JSON.stringify(remaining));
    if (remaining.length === 0) {
      setGameOver(true);
    }
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      nextWord();
    }
  }

  function restartGame() {
    const resetWords = shuffle(wordsList);
    setWords(resetWords);
    setCurrentWord("");
    setScrambledWord("");
    setGuess("");
    setMessage("");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    localStorage.clear();
    localStorage.setItem("words", JSON.stringify(resetWords));
  }

  return (
    <div>
      <h1>Scramble</h1>
      {!gameOver ? (
        <>
          <p><strong>Scrambled Word:</strong> {scrambledWord}</p>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              autoFocus
            />
            <button type="submit">Guess</button>
          </form>
          <p>{message}</p>
          <p>Points: {points} | Strikes: {strikes} | Passes: {passes}</p>
          <button onClick={handlePass} disabled={passes === 0}>Pass</button>
        </>
      ) : (
        <>
          <h2>Game Over</h2>
          <p>Your final score: {points}</p>
          <button onClick={restartGame}>Play Again</button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.body).render(<App />);