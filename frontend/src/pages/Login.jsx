import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleLogin = async () => {
    setError('');

    // Basic checks before calling API
    if (!email.trim())    { setError('Please enter your email.'); return; }
    if (!password)        { setError('Please enter your password.'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Backend sent an error — show it to user
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      // Save token and user info, then go to home
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
        <h1 className="auth-title">Welcome <span>Back</span></h1>
        <p className="auth-sub">Login to access your personalised fitness dashboard</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          className="btn-red auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
