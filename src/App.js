import React, { useState, useEffect } from 'react';
import './App.css';
import { FaFacebook, FaTwitter, FaInstagram ,FaLinkedin ,FaGithub, } from 'react-icons/fa';

function App() {
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [mistakes, setMistakes] = useState({});

  useEffect(() => {
    // Fetch the Japanese character and its corresponding English translation from the API
    fetch('http://localhost:5000/api/next')
      .then(response => response.json())
      .then(data => {
        setJapanese(data.japanese);
        setEnglish(data.english);
      })
      .catch(error => console.error(error));
  }, []);

  const handleNext = () => {
    // Fetch the next Japanese character and its corresponding English translation from the API
    fetch('http://localhost:5000/api/next')
      .then(response => response.json())
      .then(data => {
        setJapanese(data.japanese);
        setEnglish(data.english);
        setResult('');
        setUserInput('');
      })
      .catch(error => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput === english) {
      setResult('Correct!');
      // update the correct count
      setMistakes(prevMistakes => ({
        ...prevMistakes,
        [japanese]: {
          correct: prevMistakes[japanese]?.correct ? prevMistakes[japanese].correct + 1 : 1,
          incorrect: prevMistakes[japanese]?.incorrect ? prevMistakes[japanese].incorrect : 0
        }
      }));
    } else {
      setResult('Incorrect!');
      // update the incorrect count
      setMistakes(prevMistakes => ({
        ...prevMistakes,
        [japanese]: {
          correct: prevMistakes[japanese]?.correct ? prevMistakes[japanese].correct : 0,
          incorrect: prevMistakes[japanese]?.incorrect ? prevMistakes[japanese].incorrect + 1 : 1
        }
      }));
    }
  };

  const charactersWithMistakes = Object.keys(mistakes).filter(char => mistakes[char].correct > 0 || mistakes[char].incorrect > 0);


  return (
    <div className="App">
      <div className="title-container">
        <h1 className="title">Japanese Practice - 日本</h1>
        <p className="subtitle">By Raman</p>
      </div>
      <div className="main-container">
        <div className="question-container">
          <h2 className="question">{`Guess the character?`}</h2>
          {japanese.includes("/") ? (
    <>
      <h1 className="japanese-character">{japanese.split("/")[0]}</h1>
      <p className="kunyomi">{japanese.split("/")[1]}</p>
    </>
  ) : (
    <h1 className="japanese-character">{japanese}</h1>
  )}
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="input" onChange={e => setUserInput(e.target.value)} value={userInput} />
          <p className={`result ${result === 'Correct!' ? 'correct' : 'incorrect'}`}>{result}</p>
          <div className='button-container'>
          <button className="next-button" onClick={handleNext} style ={{ marginRight: "20px"}}>Next</button>
          <button type="submit" className='Submit'>Submit</button>
        </div>
        </form>
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/ramandeep-maan-b8a105185/"><FaLinkedin /></a>
          <a href="https://instagram.com/ramandeep11maan?igshid=OTk0YzhjMDVlZA=="><FaInstagram /></a>
          <a href="https://www.github.com/ramandeep11/"><FaGithub /></a>
        </div>

      </div>
      <div className="mistakes-container">
  {charactersWithMistakes.map(char => (
    <div key={char} className="mistake">
    <h2 className="japanese-character">{char}</h2>
    <div className="mistake-counts">
      <p className="correct-count">{mistakes[char].correct}</p>
      <p className="incorrect-count">{mistakes[char].incorrect}</p>
    </div>
  </div>
  ))}
</div>
    </div>
  );
}

export default App;
