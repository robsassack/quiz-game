import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
// sample data for quiz, real questions will be fetched from api

function Quiz() {
  const [questionData, setQuestionData] = useState();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [numCorrect, setNumCorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  const decodeHtmlEntity = function(str) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    if (!questionData) return;
    const newQuestions = questionData.map((question) => {
      const answers = shuffle([
        ...question.incorrect_answers,
        question.correct_answer,
      ]);
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
    console.log('test');
    async function getQuestions() {
      const resp = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
      const data = await resp.json();
      setQuestionData(data.results);
    }
    getQuestions();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  }

  const questionElements = questions.map((question) => (
    <div key={question.id} className='quiz--question-container'>
      <h2 className='quiz--question'>{decodeHtmlEntity(question.question)}</h2>
      <ul className='quiz--answer-list'>
        {question.answers.map((answer) => (
          <div className='quiz--answer' key={nanoid()}>
            <input
              className='quiz--answer-option'
              type='radio'
              id={answer}
              name={question.id}
              value={answer}
              onChange={handleChange}
              checked={formData[question.id] === answer}
            />
            <label htmlFor={answer} className='quiz--answer-label'>
              {decodeHtmlEntity(answer)}
            </label>
          </div>
        ))}
      </ul>
    </div>
  ));

  const answerElements = questions.map((question) => {
    const isCorrect = question.correctAnswer === formData[question.id];
    return (
      <div key={question.id} className='quiz--question-container'>
        <h2 className='quiz--question'>{decodeHtmlEntity(question.question)}</h2>
        <div className='quiz--answer-list' key={nanoid()}>
          {question.answers.map((answer) => {
              if (answer === question.correctAnswer) {
                return (
                  <div className="quiz--correct-answer" key={nanoid()}>{decodeHtmlEntity(answer)}</div>
                )
              } else if (answer === formData[question.id]) {
                return (
                  <div className="quiz--wrong-answer" key={nanoid()}>{decodeHtmlEntity(answer)}</div>
                )
              }
              return (
                <div className="quiz--regular-answer" key={nanoid()}>{decodeHtmlEntity(answer)}</div>
              )
            })}
        </div>
      </div>
    );
  });

  function handleSubmit(event) {
    event.preventDefault();
    // not all questions answered
    if (Object.keys(formData).length < questions.length) {
      return;
    }
    // all questions answered
    questions.forEach((question) => {
      if (question.correctAnswer === formData[question.id]) {
        setNumCorrect((prevNumCorrect) => prevNumCorrect + 1);
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
  }

  return (
    <div className='quiz'>
      {!showResults && (
        <form onSubmit={handleSubmit}>
          {questionElements}
          <div className='quiz--button-container'>
            <button className='quiz--answer-button'>Check answers</button>
          </div>
        </form>
      )}
      {showResults && (
        <div className='quiz--results'>
          {answerElements}
          <div className='quiz--button-container'>
            <p className="quiz--correct-stat">You scored {numCorrect}/{questions.length} correct answers</p>
            <button className='quiz--answer-button' onClick={resetGame}>Play again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
