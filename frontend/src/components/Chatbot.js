import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { buildKnowledgeBase, getChatbotReply } from '../utils/chatbot';
import './Chatbot.css';

const quickPrompts = [
  'What are the darshan timings?',
  'Show available poojas',
  'Where is the temple located?',
  'How do I generate a token?',
  'Any announcements today?'
];

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Namaste. I am the temple assistant. Ask me about timings, poojas, booking, contact details, location, announcements, or temple information.'
  }
];

const Chatbot = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [knowledge, setKnowledge] = useState(buildKnowledgeBase({}));
  const [knowledgeLoaded, setKnowledgeLoaded] = useState(false);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    if (isOpen && !knowledgeLoaded && !loadingKnowledge) {
      fetchKnowledge();
    }
  }, [isOpen, knowledgeLoaded, loadingKnowledge]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, thinking]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const fetchKnowledge = async () => {
    setLoadingKnowledge(true);

    try {
      const results = await Promise.allSettled([
        api.get('/home'),
        api.get('/about'),
        api.get('/poojas'),
        api.get('/map'),
        api.get('/contact')
      ]);

      const nextKnowledge = buildKnowledgeBase({
        home: results[0].status === 'fulfilled' ? results[0].value.data : {},
        about: results[1].status === 'fulfilled' ? results[1].value.data : {},
        poojas: results[2].status === 'fulfilled' ? results[2].value.data : [],
        map: results[3].status === 'fulfilled' ? results[3].value.data : {},
        contact: results[4].status === 'fulfilled' ? results[4].value.data : {}
      });

      setKnowledge(nextKnowledge);
      setKnowledgeLoaded(true);
      return nextKnowledge;
    } catch (error) {
      console.error('Error loading chatbot knowledge:', error);
      return buildKnowledgeBase({});
    } finally {
      setLoadingKnowledge(false);
    }
  };

  const answerQuestion = async (question) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        role: 'user',
        text: trimmedQuestion
      }
    ]);
    setInput('');
    setThinking(true);

    let activeKnowledge = knowledge;
    if (!knowledgeLoaded) {
      activeKnowledge = await fetchKnowledge();
    }

    window.setTimeout(() => {
      const reply = getChatbotReply(trimmedQuestion, activeKnowledge);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: reply
        }
      ]);
      setThinking(false);
    }, 450);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    answerQuestion(input);
  };

  return (
    <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <p className="chatbot-kicker">Temple Assistant</p>
              <h3>Smart Help</h3>
            </div>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-message ${message.role}`}>
                <p>{message.text}</p>
              </div>
            ))}

            {thinking && (
              <div className="chatbot-message assistant typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chatbot-prompt"
                onClick={() => answerQuestion(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="chatbot-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about timings, poojas, token, location..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Open temple assistant"
      >
        <span>Temple Assistant</span>
        <strong>Chat</strong>
      </button>
    </div>
  );
};

export default Chatbot;
