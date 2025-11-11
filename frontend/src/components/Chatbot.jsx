import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import '../styles/Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! I am FarmerGPT, your farming assistant. Ask me anything about farming, crops, soil, irrigation, pest control, or weather planning!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(input);
      const botMessage = {
        type: 'bot',
        text: response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      if (response.data.note) {
        const noteMessage = {
          type: 'info',
          text: response.data.note,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, noteMessage]);
      }
    } catch (error) {
      const errorMessage = {
        type: 'error',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    'What is the best time to plant wheat?',
    'How to control pests naturally?',
    'Tips for improving soil health',
    'When should I irrigate my crops?',
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h2>AI Farming Assistant</h2>
        <p>Ask me anything about farming</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.type}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        <p>Quick questions:</p>
        <div className="quick-questions-list">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="quick-question-btn"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a farming question..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
