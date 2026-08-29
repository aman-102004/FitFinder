import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GymCard.css';

export default function GymCard({ gym }) {
  const navigate = useNavigate();
  return (
    <div className="gym-card" onClick={() => navigate(`/gyms/${gym._id}`)}>
      <div className="gym-img">
        <span>{gym.icon || '🏋️'}</span>
        {gym.badge && <span className="gym-badge">{gym.badge}</span>}
      </div>
      <div className="gym-body">
        <h3 className="gym-name">{gym.name}</h3>
        <p className="gym-loc">📍 {gym.location}</p>
        <div className="gym-meta">
          <span className="gym-fee">₹{(gym.fees||0).toLocaleString()}/mo</span>
          <span className="gym-rating">⭐ {gym.rating}</span>
        </div>
        <div className="gym-tags">
          {(gym.facilities||[]).slice(0,3).map(f => <span key={f} className="tag">{f}</span>)}
        </div>
        <button className="btn-view">View Details →</button>
      </div>
    </div>
  );
}
