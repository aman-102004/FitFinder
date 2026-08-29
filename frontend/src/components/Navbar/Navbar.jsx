import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Fit<span>Finder</span> AI</Link>

      <ul className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/gyms">Gyms</NavLink></li>
        <li><NavLink to="/workout">Workouts</NavLink></li>
        <li><NavLink to="/diet">Diet</NavLink></li>
        <li><NavLink to="/chat">AI Chat</NavLink></li>
        <li><NavLink to="/bmi">BMI</NavLink></li>
        {isLoggedIn && <li><NavLink to="/tracker" className="tracker-link">📊 My Tracker</NavLink></li>}
      </ul>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <Link to="/tracker" className="btn-tracker">📊 Tracker</Link>
            <span className="nav-user">Hi, {user?.name?.split(' ')[0]}</span>
            <button className="btn-outline" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"  className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-red">Sign Up</Link>
          </>
        )}
      </div>

      <button className="hamburger" onClick={() => setOpen(o => !o)}>☰</button>
    </nav>
  );
}
