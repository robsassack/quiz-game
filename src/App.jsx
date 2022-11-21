import { useState } from 'react';
import Landing from './components/Landing';
import Quiz from './components/Quiz';
import "./App.css";

function App() {
  // temp state for testing
  const [quizStarted, setQuizStarted] = useState(true);
  // const [quizStarted, setQuizStarted] = useState(false);

  function startQuiz() {
    setQuizStarted(true);
    document.body.classList.add('blob-move');
  }

  return (
    <div className='App'>
      {!quizStarted && <Landing quizStarted={startQuiz} />}
      {quizStarted && <Quiz />}
    </div>
  );
}

export default App;
