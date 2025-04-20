import React, { useState } from "react";
import { BarChart3, BookOpen, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dummy data for skills and learning paths
  const skills = [
    { id: 1, name: "Python", category: "Programming", level: 4 },
    { id: 2, name: "React", category: "Frontend", level: 3 },
    { id: 3, name: "MySQL", category: "Database", level: 2 },
  ];

  const learningPaths = [
    {
      id: 1,
      title: "Full-Stack Developer Roadmap",
      description: "Start from basics to advanced full-stack development.",
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      progress: 40,
    },
    {
      id: 2,
      title: "Data Scientist Journey",
      description: "Master data analysis, ML, and data visualization.",
      skills: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
      progress: 70,
    },
  ];

  return (
    <div className="container py-5">
      {/* Tabs */}
      <div className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`nav-link ${
                activeTab === "dashboard" ? "active" : ""
              }`}
            >
              <BarChart3 className="me-2" size={18} /> Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("skills")}
              className={`nav-link ${activeTab === "skills" ? "active" : ""}`}
            >
              <BookOpen className="me-2" size={18} /> Skills
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("learningPaths")}
              className={`nav-link ${
                activeTab === "learningPaths" ? "active" : ""
              }`}
            >
              <Trophy className="me-2" size={18} /> Learning Paths
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <div className="container py-4">
          <h2 className="h3 mb-3">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard Overview
          </h2>
          <p className="text-muted mb-4">
            Welcome back! Track your progress and skills here.
          </p>

          <div className="row g-4">
            {/* Skill Progress */}
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-bar-chart-line-fill me-2 text-primary"></i>
                    Your Skills Progress
                  </h5>
                  <ul className="list-group list-group-flush mt-3">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Web Development</span>
                      <span>70%</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Machine Learning</span>
                      <span>85%</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Java Development</span>
                      <span>60%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-clock-history me-2 text-warning"></i>
                    Recent Activities
                  </h5>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Completed React Project: Job Prediction System
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-play-circle-fill text-info me-2"></i>
                      Started Spring Boot Backend for Hostel Signature
                      Verification System
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-cpu-fill text-secondary me-2"></i>
                      Worked on Rice Quality Analysis Deep Learning Model
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-lightbulb-fill me-2 text-warning"></i>
                    Recommendations
                  </h5>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill me-2 text-primary"></i>
                      Learn Spring Boot for backend development
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill me-2 text-primary"></i>
                      Practice more ML algorithms for better predictions
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-arrow-right-circle-fill me-2 text-primary"></i>
                      Explore Flutter for cross-platform mobile development
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div>
          <Link to="/quiz">
            <button className="btn btn-primary btn-lg btn-block mb-3">
              AI Quiz Preperation
            </button>
          </Link>
          <Link to="/mock-interview">
            <button className="btn btn-primary mb-3 btn-lg btn-block mx-2">
              Mock Interview
            </button>
          </Link>
          <h2 className="h4">Your Skills</h2>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {skills.map((skill) => (
              <div key={skill.id} className="col">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{skill.name}</h5>
                    <p className="card-text text-muted">
                      Category: {skill.category}
                    </p>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${skill.level * 20}%` }}
                        aria-valuenow={skill.level * 20}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    <p className="text-muted small mt-2">
                      {skill.level * 20}% Mastery
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "learningPaths" && (
        <div>
          <Link to="/learningpath">
            <button className="btn btn-primary mb-3">
              Go to Learning Path Generator
            </button>
          </Link>
          <h2 className="h4">Learning Paths</h2>
          <div className="list-group">
            {learningPaths.map((path) => (
              <div key={path.id} className="list-group-item">
                <h5>{path.title}</h5>
                <p className="text-muted">{path.description}</p>
                <div>
                  {path.skills.map((skill) => (
                    <span key={skill} className="badge bg-info text-white me-2">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="progress mt-3">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${path.progress}%` }}
                    aria-valuenow={path.progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <p className="text-muted small mt-2">
                  {path.progress}% Completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
