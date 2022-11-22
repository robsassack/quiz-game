const data = {
  response_code: 0,
  results: [
    {
      category: "Main",
      type: "multiple",
      difficulty: "easy",
      question: "This is a question",
      correct_answer: "Answer #1",
      incorrect_answers: [
        "opt 1", "opt 2", "opt 3"
      ]
    },
    {
      category: "Main",
      type: "multiple",
      difficulty: "medium",
      question: "Another question here",
      correct_answer: "Answer #2",
      incorrect_answers: [
        "opt a", "opt b", "opt c"
      ]
    },
    {
      category: "Main",
      type: "multiple",
      difficulty: "hard",
      question: "Long question with many words to test the layout",
      correct_answer: "Answer #3",
      incorrect_answers: [
        "long option a", "long option b", "long option c"
      ]
    }
  ]
}

export default data
