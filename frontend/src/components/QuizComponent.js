import React, { useState } from "react";

const QuizComponent = ({ careerGoal, skills }) => {
  const [quiz, setQuiz] = useState([]);
  const [quizId, setQuizId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const fetchQuiz = async () => {
    if (!subject || !difficulty) {
      setError("Please select subject and difficulty level.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: careerGoal,
          skills: skills,
          subject: subject,
          difficulty: difficulty,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setQuiz(data.quiz);
        setQuizId(data.quiz_id);
        setSelectedAnswers(new Array(data.quiz.length).fill(""));
      } else {
        setError(data.message || "Failed to load quiz");
      }
    } catch (err) {
      setError("Error fetching quiz: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    if (submitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = selectedOption;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (selectedAnswers.includes("")) {
      setError("Please answer all questions before submitting.");
      return;
    }

    if (!quizId) {
      setError("Quiz ID is missing. Please regenerate the quiz.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: quizId,
          answers: selectedAnswers,
          subject: subject,
          difficulty: difficulty,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setQuizResult(result);
        setSubmitted(true);
        setError("");
      } else {
        setError(result.message || "Failed to submit quiz");
      }
    } catch (err) {
      setError("Error submitting quiz: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers(new Array(quiz.length).fill(""));
    setSubmitted(false);
    setQuizResult(null);
    setError("");
    setQuizId("");
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow">
      <h2 className="h3 mb-4">Skill Assessment Quiz: {careerGoal}</h2>

      <div className="mb-4">
        <label className="form-label">Select Subject/Skill</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="form-control"
          placeholder="e.g. JavaScript, Machine Learning"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Select Difficulty Level</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="form-select"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        onClick={fetchQuiz}
        className="btn btn-primary mb-6"
        disabled={loading}
      >
        {loading ? "Generating Quiz..." : "Generate Quiz"}
      </button>

      {error && <div className="text-danger mb-4">{error}</div>}

      {submitted && quizResult && (
        <div className="alert alert-info mb-6">
          <h3>Your Results</h3>
          <p>
            Score: {quizResult.score}/{quizResult.total_questions}
          </p>
          <p>{quizResult.feedback}</p>
          <button onClick={resetQuiz} className="btn btn-secondary mt-4">
            Take Quiz Again
          </button>
        </div>
      )}

      {!submitted && quiz.length > 0 && (
        <>
          <div className="mb-6">
            {quiz.map((item, questionIndex) => (
              <div key={questionIndex} className="card mb-3">
                <div className="card-body">
                  <p className="h5">
                    {questionIndex + 1}. {item.question}
                  </p>
                  {item.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-check">
                      <input
                        type="radio"
                        id={`q${questionIndex}-o${optionIndex}`}
                        name={`question-${questionIndex}`}
                        checked={selectedAnswers[questionIndex] === option}
                        onChange={() =>
                          handleAnswerSelect(questionIndex, option)
                        }
                        className="form-check-input"
                      />
                      <label
                        htmlFor={`q${questionIndex}-o${optionIndex}`}
                        className="form-check-label"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between">
            <button onClick={fetchQuiz} className="btn btn-secondary">
              Refresh Quiz
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Answers"}
            </button>
          </div>
        </>
      )}

      {!quiz.length && !loading && (
        <div className="text-center p-4">
          <p>No quiz questions available.</p>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
