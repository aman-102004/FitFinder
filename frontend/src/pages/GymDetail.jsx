import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API, authHeaders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './GymDetail.css';

// Fallback detail data when backend is not running
const DEMO_DETAIL = {
  '1':  { name:'FitZone Gym',       location:'MP Nagar, Bhopal',       fees:1500, rating:4.5, timings:'6:00 AM – 10:00 PM', phone:'+91 9876543210', icon:'🏋️', facilities:['Cardio','Weights','Trainer','Locker Room'], description:"Most popular gym in MP Nagar with certified trainers and modern equipment. Perfect for all fitness levels.", reviews:[{userName:'Rahul K.',rating:5,text:'Best gym in Bhopal! Great equipment.'},{userName:'Priya S.',rating:4,text:'Trainers are very helpful.'}] },
  '2':  { name:'Iron Paradise',     location:'Arera Colony, Bhopal',   fees:2000, rating:4.8, timings:'5:00 AM – 11:00 PM', phone:'+91 9876543211', icon:'💪', facilities:['CrossFit','Yoga','Sauna','Pool'],           description:'Premium facility with CrossFit, yoga and luxury amenities.', reviews:[{userName:'Amit T.',rating:5,text:'World class experience!'},{userName:'Neha M.',rating:5,text:'Best CrossFit in Bhopal!'}] },
  '6':  { name:"Gold's Gym Indore", location:'Vijay Nagar, Indore',    fees:1800, rating:4.6, timings:'6:00 AM – 10:00 PM', phone:'+91 9876543220', icon:'🏆', facilities:['Weights','Cardio','Trainer','Steam Room'],  description:'Flagship gym in Vijay Nagar with international standard equipment.', reviews:[{userName:'Arjun P.',rating:5,text:'Best gym in Indore!'},{userName:'Simran K.',rating:4,text:'Great trainers.'}] },
  '9':  { name:'FitLife Gym',       location:'Napier Town, Jabalpur',  fees:1000, rating:4.2, timings:'6:00 AM – 9:00 PM',  phone:'+91 9876543230', icon:'🏋️', facilities:['Weights','Cardio','Trainer'],              description:'Best gym in Napier Town with experienced trainers.', reviews:[{userName:'Anand K.',rating:4,text:'Good gym, helpful staff.'}] },
  '12': { name:'Flex Gym Gwalior',  location:'Lashkar, Gwalior',       fees:900,  rating:4.1, timings:'6:00 AM – 9:00 PM',  phone:'+91 9876543240', icon:'🏋️', facilities:['Weights','Cardio','Trainer'],              description:'Well-equipped gym in the heart of Lashkar area.', reviews:[{userName:'Ajay V.',rating:4,text:'Good gym at great price.'}] },
  '15': { name:'Mahakal Fitness',   location:'Freeganj, Ujjain',       fees:700,  rating:4.0, timings:'6:00 AM – 9:00 PM',  phone:'+91 9876543250', icon:'🌟', facilities:['Weights','Cardio','Trainer'],              description:'Budget-friendly gym near Mahakaleshwar temple area.', reviews:[{userName:'Karan M.',rating:4,text:'Best budget gym in Ujjain!'}] },
};

export default function GymDetail() {
  const { id }          = useParams();
  const { isLoggedIn }  = useAuth();
  const { showToast }   = useToast();
  const [gym, setGym]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [reviewText, setReview] = useState('');
  const [stars, setStars]       = useState(5);
  const [submitting, setSub]    = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch(`${API}/gyms/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        setGym(data);
      } catch {
        setGym(DEMO_DETAIL[id] || null);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  const submitReview = async () => {
    if (!isLoggedIn)     { showToast('Please login to submit a review!'); return; }
    if (!reviewText.trim()) { showToast('Please write your review first!'); return; }
    setSub(true);
    try {
      const res  = await fetch(`${API}/gyms/${id}/review`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ rating: stars, text: reviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Review submitted! Thank you 🌟');
      setReview('');
      setGym(g => ({ ...g, rating: data.rating, reviewCount: data.reviewCount }));
    } catch (err) {
      showToast(err.message || 'Could not submit review.');
    } finally {
      setSub(false);
    }
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (!gym)    return <div className="section"><p style={{color:'var(--muted)'}}>Gym not found.</p></div>;

  return (
    <div className="section gym-detail">
      <Link to="/gyms" className="back-link">← Back to Gyms</Link>

      <div className="detail-hero">{gym.icon || '🏋️'}</div>

      <div className="detail-top">
        <div>
          <h1>{gym.name}</h1>
          <p className="detail-loc">📍 {gym.location}</p>
        </div>
        <div className="detail-price-box">
          <div className="price-big">₹{(gym.fees||0).toLocaleString()}<span>/mo</span></div>
          <div className="detail-stars">⭐ {gym.rating} / 5</div>
        </div>
      </div>

      {gym.description && <p className="detail-desc">{gym.description}</p>}

      <div className="info-grid">
        <div className="info-item"><div className="info-label">Timings</div><div className="info-val">⏰ {gym.timings || 'N/A'}</div></div>
        <div className="info-item"><div className="info-label">Phone</div><div className="info-val">📞 {gym.phone || 'N/A'}</div></div>
        <div className="info-item"><div className="info-label">Rating</div><div className="info-val">⭐ {gym.rating} / 5</div></div>
        <div className="info-item"><div className="info-label">Monthly Fee</div><div className="info-val" style={{color:'var(--red)'}}>₹{(gym.fees||0).toLocaleString()}</div></div>
      </div>

      <div className="detail-section">
        <h2>Facilities</h2>
        <div className="fac-tags">
          {(gym.facilities||[]).map(f => <span key={f} className="fac-tag">{f}</span>)}
        </div>
      </div>

      <div className="detail-section">
        <h2>User Reviews {gym.reviewCount > 0 && <span className="review-count">({gym.reviewCount})</span>}</h2>
        {!(gym.reviews||[]).length
          ? <p className="no-reviews">No reviews yet — be the first!</p>
          : (gym.reviews||[]).map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-top">
                  <span className="review-user">{r.user || r.userName}</span>
                  <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="review-text">{r.text}</p>
              </div>
            ))
        }
      </div>

      <div className="detail-section">
        <h2>Write a Review</h2>
        <div className="star-row">
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`star-btn ${stars>=n?'on':''}`} onClick={() => setStars(n)}>⭐</button>
          ))}
          <span className="star-label">{stars} / 5</span>
        </div>
        <textarea
          className="review-textarea"
          rows={3}
          placeholder="Share your experience at this gym..."
          value={reviewText}
          onChange={e => setReview(e.target.value)}
        />
        <button className="btn-red" style={{padding:'.7rem 1.8rem'}} onClick={submitReview} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      <div className="detail-actions">
        <button className="btn-red action-btn" onClick={() => showToast('Enquiry sent! The gym will contact you soon. 📞')}>Enquire Now</button>
        <button className="btn-outline action-btn" onClick={() => {
          if (!isLoggedIn) { showToast('Please login to save gyms!'); return; }
          showToast('Gym saved to your favourites! ❤️');
        }}>❤️ Save Gym</button>
      </div>
    </div>
  );
}
