import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import loading from "../assets/90-ring.svg";

function Quiz(props) {
  const [questionData, setQuestionData] = useState();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [numCorrect, setNumCorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    getNewQuestions();
  }, []);

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let x = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[x];
      array[x] = temp;
    }
    return array;
  }

  const decodeHtmlEntity = function (str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    if (!questionData) return;
    const newQuestions = questionData.map((question) => {
      let answers = '';
      if (question.type === "boolean") {
        answers = ["True", "False"];
      } else {
        answers = shuffle([
          ...question.incorrect_answers,
          question.correct_answer,
        ]);
      }
      return {
        id: nanoid(),
        question: question.question,
        answers: answers,
        correctAnswer: question.correct_answer,
      };
    });
    setQuestions(newQuestions);
  }, [questionData]);

  function getNewQuestions() {
    async function getQuestions() {
      const resp = await fetch("https://opentdb.com/api.php?amount=5");
      const data = await resp.json();
      setQuestionData(data.results);
    }
    getQuestions();
  }

  function handleChange(e, question) {
    const newFormData = { ...formData };
    newFormData[question] = e.target.value;
    setFormData(newFormData);
  }

  const questionElements = questions.map((question) => (
    <div key={question.id} className='quiz--question-container'>
      <h2 className='quiz--question'>{decodeHtmlEntity(question.question)}</h2>
      <ul className='quiz--answer-list'>
        {question.answers.map((answer) => {
          const answerId = nanoid();
          return (
            <div className='quiz--answer' key={nanoid()}>
              <input
                className='quiz--answer-option'
                type='radio'
                id={answerId}
                name={answerId}
                value={answer}
                onChange={(e) => handleChange(e, question.id)}
                checked={formData[question.id] === answer}
              />
              <label htmlFor={answerId} className='quiz--answer-label'>
                {decodeHtmlEntity(answer)}
              </label>
            </div>
          );
        })}
      </ul>
    </div>
  ));

  const answerElements = questions.map((question) => {
    const isCorrect = question.correctAnswer === formData[question.id];
    return (
      <div key={question.id} className='quiz--question-container'>
        <h2 className='quiz--question'>
          {decodeHtmlEntity(question.question)}
        </h2>
        <div className='quiz--answer-list' key={nanoid()}>
          {question.answers.map((answer) => {
            if (answer === question.correctAnswer) {
              return (
                <div className='quiz--correct-answer' key={nanoid()}>
                  {decodeHtmlEntity(answer)}
                </div>
              );
            } else if (answer === formData[question.id]) {
              return (
                <div className='quiz--wrong-answer' key={nanoid()}>
                  {decodeHtmlEntity(answer)}
                </div>
              );
            }
            return (
              <div className='quiz--regular-answer' key={nanoid()}>
                {decodeHtmlEntity(answer)}
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  function handleSubmit(event) {
    event.preventDefault();
    // questions not loaded yet
    if (questions.length === 0) {
      return;
    }
    // not all questions answered
    if (Object.keys(formData).length < questions.length) {
      return;
    }
    // all questions answered
    questions.forEach((question) => {
      if (question.correctAnswer === formData[question.id]) {
        setNumCorrect((prevNumCorrect) => prevNumCorrect + 1);
        setTotalScore((prevTotalScore) => prevTotalScore + 1);
      }
    });
    setShowResults(true);
  }

  function resetGame() {
    // get new questions
    setQuestions([]);
    setFormData({});
    setNumCorrect(0);
    setShowResults(false);
    getNewQuestions();
    setRounds((prevRounds) => prevRounds + 1);
  }

  function quitGame() {
    setQuestions([]);
    setFormData({});
    setNumCorrect(0);
    setShowResults(false);
    setRounds(0);
    setTotalScore(0);
    props.setQuizStarted(false);
  }

  return (
    <div className='quiz'>
      {questions.length === 0 && <img className="quiz--loading" src={loading} height="100px" alt='Loading...' />}
      {(!showResults && questions.length > 0) && (
        <form onSubmit={handleSubmit}>
          {questionElements}
          <div className='quiz--button-container'>
            <button className='quiz--answer-button'
              disabled={Object.keys(formData).length < questions.length}
            >Check answers</button>
          </div>
        </form>
      )}
      {showResults && (
        <div className='quiz--results'>
          {answerElements}
          <div className='quiz--button-container'>
            <p className='quiz--correct-stat'>
              You scored {numCorrect}/{questions.length} correct answers -  Total score: {totalScore}/{(rounds+1)*5}
            </p>
            <button className='quiz--answer-button' onClick={resetGame}>
              Play again
            </button>
            <button className='quiz--answer-button' onClick={quitGame}>
              Quit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
