import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const [form,    setForm]    = useState({ name:'', email:'', password:'', goal:'general_fitness' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSignup = async () => {
    setError('');

    // Basic checks
    if (!form.name.trim())     { setError('Please enter your name.'); return; }
    if (!form.email.trim())    { setError('Please enter your email.'); return; }
    if (!form.password)        { setError('Please enter a password.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password, goal: form.goal }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Could not create account. Please try again.');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Cannot connect to server. Make sure the backend is running (npm run dev in the backend folder).');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Join <span>FitFinder</span></h1>
        <p className="auth-sub">Create your account and start your fitness journey today</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Aman Sharma" value={form.name} onChange={e=>set('name',e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password (minimum 6 characters)</label>
          <input type="password" placeholder="Create a password" value={form.password} onChange={e=>set('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSignup()} />
        </div>
        <div className="form-group">
          <label>What is your fitness goal?</label>
          <select value={form.goal} onChange={e=>set('goal',e.target.value)}>
            <option value="weight_loss">Lose Weight</option>
            <option value="muscle_gain">Build Muscle</option>
            <option value="maintenance">Stay Fit (Maintenance)</option>
            <option value="general_fitness">General Fitness</option>
          </select>
        </div>

        <button className="btn-red auth-btn" onClick={handleSignup} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
