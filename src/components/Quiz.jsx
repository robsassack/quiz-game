import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
// sample data for quiz, real questions will be fetched from api
import data from "../data.js";

function Quiz() {
  const [questionData, setQuestionData] = useState();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestionData(data.results);
  }, []);

  function shuffle(array) {
    for (let i=array.length-1; i>0; i--) {
      let x = Math.floor(Math.random() * (i+1));
      let temp = array[i];
      array[i] = array[x];
      array[x] = temp;
    }
    return array;
  }

  useEffect(() => {
    if (!questionData) return;
    const newQuestions = questionData.map((question) => {
      const answers = shuffle([...question.incorrect_answers, question.correct_answer]);
      return {
        id: nanoid(),
        question: question.question,
        answers: answers,
        correctAnswer: question.correct_answer,
      };
    });
    setQuestions(newQuestions);
  }, [questionData]);

  const questionElements = questions.map((question) => (
    <div key={question.id}>
      <h2>{question.question}</h2>
      <ul>
        {question.answers.map((answer) => (
          <div className="quiz--answer" key={nanoid()}>
            <input type="radio" id={answer} name={question.id} value={answer} />
            <label htmlFor={answer}>{answer}</label>
          </div>
        ))}
      </ul>
    </div>
  ));

  return (
    <div className='quiz'>
      {questionElements}
      <button>Check answers</button>
    </div>
  );
}

export default Quiz;
