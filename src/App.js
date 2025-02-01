import React, { useState, useEffect } from 'react';
import './styles.css';
import fetchQuizData from './Api.js';

function App() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [quizStarted, setQuizStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false); 
  const [viewResults, setViewResults] = useState(false); 

  const restartQuiz = () => {
    setCurrentQuestionIndex(0); 
    setSelectedAnswers({});  
    setSubmitted(false); 
    setScore(0); 
    setViewResults(false); 
  };

  useEffect(() => {
    const getQuizData = async () => {
      const responseData = await fetchQuizData(); 
      setData(responseData); 
      setLoading(false); 
    };
    getQuizData(); 
  }, []); 

  const handleStartQuiz = () => {
    setQuizStarted(true); 
  };

  const handleAnswerChange = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId, 
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let totalScore = 0;
    data.questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      const correctOption = question.options.find(option => option.is_correct);
      if (selectedAnswer === correctOption.id) {
        totalScore += 1;
      }
    });
    setScore(totalScore); 
    setSubmitted(true);
    setViewResults(true); 
  };

  if (!quizStarted) {
    return (
      <div class="quiz-container">
    <h1>Quiz App</h1>
    <div class="quiz-description">
        <p>Welcome to the Quiz App! Test your knowledge with our fun and interactive quiz.</p>
        <ul>
            <li><strong>10 Questions</strong> to challenge your skills!</li>
            <li><strong>1 Mark</strong> for each correct answer.</li>
            <li><strong>0 Mark</strong> for wrong answers.</li>
        </ul>
        <p>Good luck and have fun!</p>
        <button onClick={handleStartQuiz}>Start Quiz</button>
      
    </div>
</div>

    );
  }

  return (
    <div>
      <h1>Quiz App</h1>
      {loading ? (
        <p>Loading...</p> 
      ) : (
        <div>
          {!viewResults ? (
            <div >
             <h3 >
              <b>Question {currentQuestionIndex + 1} of {data.questions.length}</b>
              </h3>

              <h4>{data.questions[currentQuestionIndex].description}</h4>
              <p><strong>Topic:</strong> {data.questions[currentQuestionIndex].topic}</p>

              {data.questions[currentQuestionIndex].options.map(option => (
                <div key={option.id}>
                  <label>
                    <input
                      type="radio"
                      value={option.id}
                      onChange={() => handleAnswerChange(data.questions[currentQuestionIndex].id, option.id)}
                      name={`question-${data.questions[currentQuestionIndex].id}`} 
                    />
                    {option.description}
                  </label>
                </div>
              ))}

              {currentQuestionIndex > 0 && !submitted && (
                <button onClick={handlePreviousQuestion}>Previous</button>
              )}

              {currentQuestionIndex < data.questions.length - 1 && !submitted && (
                <button onClick={handleNextQuestion} disabled={!selectedAnswers[data.questions[currentQuestionIndex].id]}>
                  Next
                </button>
              )}

              {currentQuestionIndex === data.questions.length - 1 && !submitted && (
                <button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length < data.questions.length}>
                  Submit
                </button>
              )}
            </div>
          ) : (
            <div>
              <h2>Quiz Completed!</h2>
              <p class='resScore'><b>Score: {score}/{data.questions.length}</b></p>
              <ul>
                {data.questions.map((question) => {
                  const selectedAnswer = selectedAnswers[question.id];
                  const correctOption = question.options.find(option => option.is_correct);
                  return (
                    <li key={question.id}>
                      <h4>{question.description}</h4>
                      <div >
                        {question.options.map(option => {
                          const isCorrect = option.is_correct;
                          const isSelected = selectedAnswer === option.id;
                          const isAnswerCorrect = isSelected && isCorrect;
                          const isAnswerWrong = isSelected && !isCorrect;
                          const isCorrectAnswerNotSelected = !isSelected && isCorrect;

                          return (
                            <div key={option.id}
                              className={`option-item 
                                ${isAnswerCorrect ? 'correct' : ''}
                                ${isAnswerWrong ? 'incorrect' : ''}
                                ${isCorrectAnswerNotSelected ? 'correct-option' : ''}`}
                            >
                              <label>
                                <input 
                                  type="radio" 
                                  value={option.id} 
                                  disabled
                                />
                                {option.description}
                              </label>
                              
                            </div>
                            
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button onClick={restartQuiz}>Restart Quiz</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
