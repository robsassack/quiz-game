import { useState } from "react";
import Landing from "./components/Landing";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  function startQuiz() {
    setQuizStarted(true);
    document.body.classList.add("blob-move");
  }

  return (
    <div className={"App" + (quizStarted ? "" : " App--center")}>
      {!quizStarted && <Landing quizStarted={startQuiz} />}
      {quizStarted && <Quiz setQuizStarted={setQuizStarted} />}
      <div className='App--github-container'>
        <a
          href='https://github.com/robsassack/quiz-game'
          aria-label='GitHub repo link'
        >
          <i className='fa-brands fa-github App--github-link'></i>
        </a>
      </div>
    </div>
  );
}

export default App;
