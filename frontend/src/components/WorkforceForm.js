import { useState } from "react";
import axios from "axios";

export default function WorkforceForm() {
  const [formData, setFormData] = useState({
    skills: "",
    goal: "",
    education_level: "",
    experience_years: "",
    current_job_title: "",
    interests: "",
    certifications: "",
  });

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  function formatAnalysisText(text) {
    const lines = text.split("\n");

    const formatted = lines.map((line, idx) => {
      // Bold section headings like "**Skillset Analysis:**"
      if (/^(\*\*)?[\w\s]+:(\*\*)?$/.test(line.trim())) {
        return (
          <h6 key={idx} className="mt-3">
            <strong>{line.replace(/\*/g, "").trim()}</strong>
          </h6>
        );
      }

      // Sub-points like "* Summary of Current Skills:"
      if (line.trim().startsWith("* ")) {
        return (
          <li key={idx}>
            {line.replace(/^\* /, "").replace(/\*/g, "").trim()}
          </li>
        );
      }

      // Bullet with bold at start: * **AWS**: Description
      if (line.trim().match(/^\* \*\*(.*?)\*\*: (.+)$/)) {
        const match = line.trim().match(/^\* \*\*(.*?)\*\*: (.+)$/);
        return (
          <li key={idx}>
            <strong>{match[1]}</strong>: {match[2]}
          </li>
        );
      }

      // Bold inline: **some text**
      if (line.includes("**")) {
        const parts = line.split(/\*\*/);
        return (
          <p key={idx}>
            {parts.map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }

      return <p key={idx}>{line}</p>;
    });

    return formatted;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData);
      setResponse(res.data.analysis);
    } catch (err) {
      setError("Failed to get analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      skills: "",
      goal: "",
      education_level: "",
      experience_years: "",
      current_job_title: "",
      interests: "",
      certifications: "",
    });
    setResponse("");
    setError("");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="mb-0">AI Workforce Development Analysis</h4>
          <small className="text-muted">
            Fill out the form to receive a personalized AI career analysis.
          </small>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([field, value]) => (
              <div className="mb-3" key={field}>
                <label className="form-label text-capitalize">
                  {field.replace(/_/g, " ")}
                </label>
                {["skills", "goal", "interests"].includes(field) ? (
                  <textarea
                    className="form-control"
                    name={field}
                    rows={3}
                    placeholder={`Enter your ${field.replace(/_/g, " ")}`}
                    value={value}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    name={field}
                    placeholder={`Enter your ${field.replace(/_/g, " ")}`}
                    value={value}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Submit"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}

          {response && (
            <div className="alert alert-success mt-4" role="alert">
              <h5 className="alert-heading">AI Analysis Results</h5>
              <div>{formatAnalysisText(response)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
