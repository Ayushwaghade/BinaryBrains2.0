import React, { useState } from "react";

const MockInterviewComponent = () => {
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleGenerate = async () => {
    if (!jobRole || !companyName) {
      setError("Please enter both job role and company name.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers([]);
    setFeedback("");

    try {
      const response = await fetch(
        "http://localhost:5000/interview/generate_questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_role: jobRole,
            company_name: companyName,
          }),
        }
      );

      const data = await response.json();
      setQuestions(data.questions.filter((q) => q.trim() !== ""));
      setAnswers(data.questions.map(() => ""));
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmitAnswers = async () => {
    setSubmitting(true);
    setFeedback("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/interview/submit_answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setFeedback(data.feedback);
      } else {
        setError(data.message || "Failed to get feedback.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mock Interview System</h2>

      <div className="mb-4">
        <label className="form-label">Job Role</label>
        <input
          type="text"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="form-control"
          placeholder="e.g., Software Engineer"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="form-control"
          placeholder="e.g., Google"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn btn-primary w-100"
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      {error && <div className="mt-4 text-danger">{error}</div>}

      {questions.length > 0 && (
        <div className="mt-6">
          <h3 className="h4 mb-3">Answer the Questions</h3>

          {questions.map((q, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded">
              <p className="fw-bold">
                Q{idx + 1}: {q}
              </p>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Your answer..."
                value={answers[idx]}
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              />
            </div>
          ))}

          <button
            onClick={handleSubmitAnswers}
            disabled={submitting}
            className="btn btn-success w-100 mt-3"
          >
            {submitting ? "Evaluating..." : "Submit for Feedback"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="mt-6 bg-light p-4 rounded">
          <h4 className="h5">AI Feedback</h4>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default MockInterviewComponent;
