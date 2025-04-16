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
        <div className="container mx-auto p-4">
          <h2 className="text-3xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-600 mb-6">
            Welcome back! Track your progress and skills here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skill Progress */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-xl mb-2">Your Skills Progress</h3>
              <ul>
                <li className="flex justify-between mb-2">
                  <span className="text-gray-700">Web Development</span>
                  <span>70%</span>
                </li>
                <li className="flex justify-between mb-2">
                  <span className="text-gray-700">Machine Learning</span>
                  <span>85%</span>
                </li>
                <li className="flex justify-between mb-2">
                  <span className="text-gray-700">Java Development</span>
                  <span>60%</span>
                </li>
              </ul>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-xl mb-2">Recent Activities</h3>
              <ul>
                <li className="text-gray-700 mb-2">
                  • Completed React Project: Job Prediction System
                </li>
                <li className="text-gray-700 mb-2">
                  • Started Spring Boot Backend for Hostel Signature
                  Verification System
                </li>
                <li className="text-gray-700 mb-2">
                  • Worked on Rice Quality Analysis Deep Learning Model
                </li>
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-xl mb-2">Recommendations</h3>
              <ul>
                <li className="text-gray-700 mb-2">
                  • Learn Spring Boot for backend development
                </li>
                <li className="text-gray-700 mb-2">
                  • Practice more ML algorithms for better predictions
                </li>
                <li className="text-gray-700 mb-2">
                  • Explore Flutter for cross-platform mobile development
                </li>
              </ul>
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
