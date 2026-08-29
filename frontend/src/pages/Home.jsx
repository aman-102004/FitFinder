import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const FEATURES = [
  { icon:'📍', title:'Gym Finder',     desc:'Search gyms by city. Filter by price, facilities and ratings.' },
  { icon:'🤖', title:'AI Chatbot',     desc:'Get instant fitness advice powered by Groq AI.' },
  { icon:'🥗', title:'Diet Plans',     desc:'Indian diet plans for weight loss, muscle gain and more.' },
  { icon:'🏋️', title:'Workout Plans', desc:'Beginner to advanced plans for every muscle group.' },
  { icon:'📊', title:'BMI Calculator', desc:'Check your BMI and get a personalized action plan.' },
  { icon:'⭐', title:'Real Reviews',   desc:'Verified user reviews and gym ratings from real members.' },
];

export default function Home() {
  const [q, setQ] = useState('');
  const navigate  = useNavigate();
  const search    = () => navigate(`/gyms${q ? `?q=${encodeURIComponent(q)}` : ''}`);

  return (
    <div>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-tag">🤖 AI-Powered Fitness Platform</div>
          <h1>Find Your <span>Perfect</span><br />Gym &amp; Fitness Plan</h1>
          <p>Discover gyms near you in Bhopal, Indore, Jabalpur, Gwalior &amp; Ujjain. Get AI workout plans, diet recommendations and 24/7 fitness guidance.</p>
          <div className="search-box">
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Enter city — Bhopal, Indore, Jabalpur, Gwalior..." />
            <button onClick={search}>Find Gyms →</button>
          </div>
          <p className="hero-hint">Popular: Bhopal · Indore · Jabalpur · Gwalior · Ujjain</p>
        </div>
      </section>

      <div className="stats-bar">
        {[['500+','Gyms Listed'],['5 Cities','MP Covered'],['50+','Workout Plans'],['24/7','AI Support']].map(([n,l])=>(
          <div key={l} className="stat"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      <section className="section">
        <h2 className="section-title">Core <span>Features</span></h2>
        <p className="section-sub">Everything you need to reach your fitness goals</p>
        <div className="features-grid">
          {FEATURES.map(f=>(
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3><p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="section" style={{textAlign:'center'}}>
          <h2 className="section-title">Ready to Start Your <span>Fitness Journey?</span></h2>
          <p className="section-sub">Join thousands of users across Madhya Pradesh achieving their goals</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/signup" className="btn-red" style={{padding:'.8rem 2rem',fontSize:'1rem'}}>Get Started Free</Link>
            <Link to="/chat"   className="btn-outline" style={{padding:'.8rem 2rem',fontSize:'1rem'}}>Try AI Chat</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
