import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
// sample data for quiz, real questions will be fetched from api
import data from "../data.js";

function Quiz() {
  const [questionData, setQuestionData] = useState();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setQuestionData(data.results);
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

  function handleChange(e) {
    const {name, value} = e.target;
    setFormData(prevFormData => {
      return {...prevFormData, [name]: value};
    })
  }

  const questionElements = questions.map((question) => (
    <div key={question.id} className='quiz--question-container'>
      <h2 className='quiz--question'>{question.question}</h2>
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
              {answer}
            </label>
          </div>
        ))}
      </ul>
    </div>
  ));

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  }

  return (
    <div className='quiz'>
      <form onSubmit={handleSubmit}>
        {questionElements}
        <div className="quiz--button-container">
        <button className='quiz--answer-button'>Check answers</button>
        </div>
      </form>
    </div>
  );
}

export default Quiz;
