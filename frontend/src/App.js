import React, { useState } from "react";
import { Brain, UserCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import LearningPathGenerator from "./components/LearningPathGenerator";
import WorkforceForm from "./components/WorkforceForm";
import QuizComponent from "./components/QuizComponent";
import MockInterviewComponent from "./components/MockInterviewComponent";
import { MessageCircle } from "lucide-react";
import Chatbot from "./components/Chatbot";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <Brain className="me-2 text-primary" size={28} />
            <span className="h4 mb-0 text-dark">Job IQ</span>
          </div>

          {/* Right Items */}
          <div className="d-flex align-items-center ms-auto">
            {/* Modal Trigger Button */}
            <button
              className="btn btn-outline-primary me-3"
              onClick={openModal}
            >
              Smart Skill Gap Identifier
            </button>

            {/* User Icon */}
            <UserCircle className="text-secondary" size={28} />
          </div>
        </div>
      </nav>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizComponent />} />
          <Route path="/mock-interview" element={<MockInterviewComponent />} />
          <Route path="/learningpath" element={<LearningPathGenerator />} />
        </Routes>
      </Router>

      {/* Modal for WorkforceForm */}
      {isModalOpen && (
        <div
          className="modal fade show"
          id="workforceModal"
          tabIndex="-1"
          aria-labelledby="workforceModalLabel"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="workforceModalLabel">
                  Workforce Form
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <WorkforceForm />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10000,
        }}
      >
        <button
          className="btn btn-primary rounded-circle p-3"
          onClick={toggleChatbot}
          title="Ask Chatbot"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
}

export default App;
