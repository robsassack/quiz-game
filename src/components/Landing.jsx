function Landing(props) {
  return (
    <div className='landing'>
      <p className="landing--title">Quizzical</p>
      <p className="landing--desc">Quiz time! Questions from the Open Trivia Database.</p>
      <button className="landing--button" onClick={props.quizStarted}>Start quiz</button>
    </div>
  );
}

export default Landing;
