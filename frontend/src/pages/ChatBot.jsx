import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API, authHeaders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ChatBot.css';

const QUICK = [
  { label:'💪 Give me a muscle gain plan',    text:'Give me a complete muscle gain workout and diet plan' },
  { label:'🔥 How do I lose belly fat?',      text:'How do I lose belly fat? Give me a plan' },
  { label:'🏋️ Best chest workout',           text:'What is the best chest workout routine for me?' },
  { label:'🥗 Indian diet for weight loss',   text:'Give me a 7-day Indian diet plan for weight loss' },
  { label:'📍 Best gyms in Indore',          text:'What are the best gyms in Indore?' },
  { label:'📊 Calculate my protein needs',   text:'How much protein do I need per day?' },
];

function timeNow() {
  return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

export default function ChatBot() {
  const { isLoggedIn, user } = useAuth();

  const [messages,  setMessages]  = useState([
    { role:'bot', text: isLoggedIn
        ? `Hey ${user?.name?.split(' ')[0] || 'there'}! 💪 I'm FitAI — your personal fitness assistant. I know your profile, so I'll give you advice tailored specifically to your goals. What do you want to work on today?`
        : `Hey! I'm FitAI 💪 I can help you with workouts, diet plans, and finding gyms across Bhopal, Indore, Jabalpur, Gwalior and Ujjain. Login to get personalised advice based on your profile! What's your fitness question?`,
      time: timeNow() }
  ]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bodyRef = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setInput('');
    setShowQuick(false);

    const userMsg = { role:'user', text, time: timeNow() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build full conversation history to send to backend
    const history = [...messages, userMsg].map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const res  = await fetch(`${API}/chat`, {
        method:  'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role:'bot', text: data.reply, time: timeNow() }]);
    } catch {
      setMessages(prev => [...prev, {
        role:'bot',
        text: '❌ Could not connect to the backend. Please make sure the backend server is running (npm run dev in the backend folder).',
        time: timeNow()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>AI <span>Chatbot</span></h1>
        <p>Powered by Groq AI — asks real questions, gets real personalised answers</p>
      </div>

      <div className="section chat-section">

        {/* Login tip banner */}
        {!isLoggedIn && (
          <div className="login-tip">
            🤖 <strong>Get personalised advice!</strong> <Link to="/login">Login</Link> or <Link to="/signup">Sign up</Link> and fill your profile in the Tracker — FitAI will then know your weight, height, goal and give advice made just for you.
          </div>
        )}

        <div className="chat-wrapper">
          <div className="chat-head">
            <div className="chat-av">🤖</div>
            <div>
              <div className="chat-name">FitAI Assistant{isLoggedIn ? ` · Personalised for ${user?.name?.split(' ')[0]}` : ''}</div>
              
            </div>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role==='user' ? 'user' : ''}`}>
                <div className="msg-av">{m.role==='user' ? (user?.name?.[0] || 'U') : '🤖'}</div>
                <div>
                  <div className="msg-bubble">
                    {m.text.split('\n').map((line, j) => (
                      <span key={j}>{line}<br /></span>
                    ))}
                  </div>
                  <div className="msg-time">{m.time}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg">
                <div className="msg-av">🤖</div>
                <div className="msg-bubble typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          {showQuick && (
            <div className="quick-row">
              {QUICK.map(q => (
                <button key={q.label} className="quick-btn" onClick={() => send(q.text)}>{q.label}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask anything — workouts, diet, gyms, supplements..."
              disabled={loading}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()}>→</button>
          </div>
        </div>

        <p className="chat-note">
          ⚠️ For general guidance only. Consult a certified trainer or doctor for medical advice. &nbsp;
          {isLoggedIn && <Link to="/tracker" style={{color:'var(--red)'}}>Update your profile in Tracker →</Link>}
        </p>
      </div>
    </div>
  );
}
