import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GymCard from '../components/GymCard/GymCard';
import { API } from '../utils/api';
import './Gyms.css';

// Demo data shown when backend is not running
const DEMO = [
  { _id:'1', name:'FitZone Gym',         city:'bhopal',   location:'MP Nagar, Bhopal',        fees:1500, rating:4.5, facilities:['Cardio','Weights','Trainer'],      icon:'🏋️', badge:'Top Rated'  },
  { _id:'2', name:'Iron Paradise',        city:'bhopal',   location:'Arera Colony, Bhopal',    fees:2000, rating:4.8, facilities:['CrossFit','Yoga','Sauna'],         icon:'💪', badge:'Premium'    },
  { _id:'3', name:'PowerHouse Gym',       city:'bhopal',   location:'Kolar Road, Bhopal',      fees:1200, rating:4.2, facilities:['Cardio','Boxing'],                icon:'🔥', badge:null          },
  { _id:'4', name:'StrongLife Gym',       city:'bhopal',   location:'Piplani, Bhopal',         fees:900,  rating:4.0, facilities:['Beginner Friendly','Weights'],    icon:'🌟', badge:null          },
  { _id:'5', name:'Anytime Fitness',      city:'bhopal',   location:'Hoshangabad Rd, Bhopal',  fees:2500, rating:4.7, facilities:['24/7','Cardio','AC'],             icon:'🕐', badge:'24/7 Open'   },
  { _id:'6', name:"Gold's Gym Indore",    city:'indore',   location:'Vijay Nagar, Indore',     fees:1800, rating:4.6, facilities:['Weights','Cardio','Trainer'],     icon:'🏆', badge:'Top Rated'   },
  { _id:'7', name:'PowerFit Studio',      city:'indore',   location:'Palasia, Indore',         fees:1200, rating:4.3, facilities:['HIIT','Zumba','Cardio'],          icon:'🔥', badge:null          },
  { _id:'8', name:'FitHub Indore',        city:'indore',   location:'AB Road, Indore',         fees:2200, rating:4.7, facilities:['CrossFit','Yoga','Pool'],         icon:'⚡', badge:'Premium'    },
  { _id:'9', name:'FitLife Gym',          city:'jabalpur', location:'Napier Town, Jabalpur',   fees:1000, rating:4.2, facilities:['Weights','Cardio','Trainer'],     icon:'🏋️', badge:'Popular'    },
  { _id:'10',name:'PowerZone Jabalpur',   city:'jabalpur', location:'Adhartal, Jabalpur',      fees:1200, rating:4.3, facilities:['CrossFit','Weights','Cardio'],    icon:'💪', badge:'Top Rated'   },
  { _id:'11',name:'Champion Gym',         city:'jabalpur', location:'Civil Lines, Jabalpur',   fees:800,  rating:4.0, facilities:['Weights','Beginner Friendly'],   icon:'🌟', badge:null          },
  { _id:'12',name:'Flex Gym Gwalior',     city:'gwalior',  location:'Lashkar, Gwalior',        fees:900,  rating:4.1, facilities:['Weights','Cardio','Trainer'],     icon:'🏋️', badge:null         },
  { _id:'13',name:'IronBody Fitness',     city:'gwalior',  location:'Morar, Gwalior',          fees:1100, rating:4.3, facilities:['Weights','Boxing','Cardio'],      icon:'🔥', badge:'Popular'    },
  { _id:'14',name:'FitCentre Gwalior',    city:'gwalior',  location:'Phool Bagh, Gwalior',     fees:1500, rating:4.4, facilities:['Cardio','Yoga','Zumba'],          icon:'⚡', badge:'Top Rated'  },
  { _id:'15',name:'Mahakal Fitness',      city:'ujjain',   location:'Freeganj, Ujjain',        fees:700,  rating:4.0, facilities:['Weights','Cardio','Trainer'],     icon:'🌟', badge:null          },
  { _id:'16',name:'PowerPulse Ujjain',    city:'ujjain',   location:'Dewas Road, Ujjain',      fees:1000, rating:4.2, facilities:['CrossFit','Weights','Cardio'],    icon:'💪', badge:'Popular'    },
];

const CITIES     = ['All Cities','bhopal','indore','jabalpur','gwalior','ujjain'];
const FACILITIES = ['All Facilities','Cardio','Weights','CrossFit','Yoga','Pool','Trainer','Boxing','24/7','Zumba','HIIT'];

export default function Gyms() {
  const [searchParams]      = useSearchParams();
  const [gyms, setGyms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity]     = useState(searchParams.get('q') || '');
  const [sort, setSort]     = useState('');
  const [facility, setFac]  = useState('');

  const load = async () => {
    setLoading(true);
    try {
      let url = `${API}/gyms?`;
      if (city && city !== 'All Cities') url += `city=${encodeURIComponent(city)}&`;
      if (sort)                           url += `sort=${sort}&`;
      if (facility && facility !== 'All Facilities') url += `facility=${encodeURIComponent(facility)}&`;

      const res  = await fetch(url);
      const data = await res.json();
      setGyms(Array.isArray(data) ? data : []);
    } catch {
      // Backend not running — use demo data with local filter
      let result = [...DEMO];
      if (city && city !== 'All Cities')
        result = result.filter(g => g.city.includes(city.toLowerCase()));
      if (facility && facility !== 'All Facilities')
        result = result.filter(g => g.facilities.includes(facility));
      if (sort === 'fees_asc')  result.sort((a,b) => a.fees - b.fees);
      if (sort === 'fees_desc') result.sort((a,b) => b.fees - a.fees);
      if (sort === 'rating')    result.sort((a,b) => b.rating - a.rating);
      setGyms(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  return (
    <div>
      <div className="page-header">
        <h1>Find <span>Gyms</span></h1>
        <p>Discover gyms across Bhopal, Indore, Jabalpur, Gwalior and Ujjain</p>
      </div>

      <div className="section">
        {/* FILTER BAR */}
        <div className="filter-bar">
          <select className="filter-select" value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c === 'All Cities' ? 'All Cities' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sort by</option>
            <option value="rating">Best Rating</option>
            <option value="fees_asc">Price: Low to High</option>
            <option value="fees_desc">Price: High to Low</option>
          </select>
          <select className="filter-select" value={facility} onChange={e => setFac(e.target.value)}>
            {FACILITIES.map(f => <option key={f} value={f === 'All Facilities' ? '' : f}>{f}</option>)}
          </select>
          <button className="btn-red" onClick={load} style={{padding:'.6rem 1.4rem'}}>Search</button>
        </div>

        <p className="results-count">
          {loading ? 'Searching...' : `${gyms.length} gym${gyms.length !== 1 ? 's' : ''} found`}
        </p>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : gyms.length === 0 ? (
          <p className="no-results">No gyms found. Try a different city or filter.</p>
        ) : (
          <div className="gym-grid">
            {gyms.map(g => <GymCard key={g._id} gym={g} />)}
          </div>
        )}
      </div>
    </div>
  );
}
