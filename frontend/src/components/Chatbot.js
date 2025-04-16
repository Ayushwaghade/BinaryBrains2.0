import React, { useRef, useState, useEffect } from "react";
import "../css/Chatbot.css";

const Chatbot = ({ onClose }) => {
  const chatbotRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 450 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const startDrag = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const startResize = (e) => {
    e.stopPropagation();
    setResizing(true);
  };

  const stopAction = () => {
    setDragging(false);
    setResizing(false);
  };

  const onMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    } else if (resizing) {
      const rect = chatbotRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(250, e.clientX - rect.left),
        height: Math.max(300, e.clientY - rect.top),
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopAction);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopAction);
    };
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={chatbotRef}
      className="chatbot-window shadow-lg"
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex: 1050,
      }}
    >
      <div className="card h-100 d-flex flex-column">
        <div
          className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          onMouseDown={startDrag}
          style={{ cursor: "move" }}
        >
          <span>💬 Job IQ Chatbot</span>
          <button onClick={onClose} className="btn btn-sm btn-light">
            ✖
          </button>
        </div>

        <div className="card-body p-2 overflow-auto" style={{ flex: 1 }}>
          <p className="small text-muted">
            I’m your smart assistant! Ask me anything about career, skills, or
            interviews. I guide you, not just solve things directly!
          </p>
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex ${
                  msg.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-2`}
              >
                <span
                  className={`badge rounded-pill bg-${
                    msg.sender === "user" ? "primary" : "secondary"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-footer bg-white border-top p-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      <div className="chatbot-resizer" onMouseDown={startResize}></div>
    </div>
  );
};

export default Chatbot;
