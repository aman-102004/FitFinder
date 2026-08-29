import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">Fit<span>Finder</span> AI</div>
        <p>Your smart gym finder and AI fitness companion for MP cities.</p>
        <div className="footer-links">
          {[['/','/gyms','/workout','/diet','/chat','/bmi'],['Home','Gyms','Workouts','Diet','AI Chat','BMI']].reduce((_, __, i, arr) => arr[0].map((path,j) => <Link key={path} to={path}>{arr[1][j]}</Link>), null)}
        </div>
        <p className="footer-copy">© 2025 FitFinder AI — Bhopal · Indore · Jabalpur · Gwalior · Ujjain</p>
      </div>
    </footer>
  );
}
