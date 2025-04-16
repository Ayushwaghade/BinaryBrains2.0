import React, { useState } from "react";
import axios from "axios";

const LearningPathGenerator = () => {
  const [formData, setFormData] = useState({
    goal: "",
    preferred_learning_style: "video",
    available_hours_per_week: "",
    current_skill_level: "beginner",
  });

  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Form Data: ", formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/get-path",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setPath(response.data.learning_path);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to generate learning path.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">🎓 AI-Powered Learning Path Generator</h2>

      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light"
      >
        <div className="mb-3">
          <label className="form-label">Career Goal</label>
          <input
            type="text"
            className="form-control"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Learning Style</label>
          <select
            className="form-select"
            name="preferred_learning_style"
            value={formData.preferred_learning_style}
            onChange={handleChange}
          >
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Available Hours per Week</label>
          <input
            type="number"
            className="form-control"
            name="available_hours_per_week"
            value={formData.available_hours_per_week}
            onChange={handleChange}
            placeholder="e.g., 10"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Current Skill Level</label>
          <select
            className="form-select"
            name="current_skill_level"
            value={formData.current_skill_level}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Learning Path"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {path.length > 0 && (
        <div className="mt-5">
          <h4>Your Personalized Learning Path:</h4>
          {path.map((item, index) => (
            <div className="card mt-3 shadow-sm" key={index}>
              <div className="card-body">
                <h5 className="card-title">
                  {item.stage} – {item.skill}
                </h5>
                <p className="card-text">{item.reason}</p>
                <p>
                  <strong>Estimated Time:</strong> {item.estimated_time}
                </p>
                <a
                  href={item.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success"
                >
                  📺 Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPathGenerator;
