import React, { useState } from 'react';
import './Workout.css';

const PLANS = {
  beginner:  { label:'Beginner',   sub:'Full body plan for those just starting out. 3–4 days/week.',
    days:[
      { label:'Day 1 — Push',    ex:['Push-ups — 3×15','Goblet Squat — 3×15','Shoulder Press — 3×12','Plank — 3×30 sec','Tricep Dips — 3×12'] },
      { label:'Day 2 — Rest',    ex:['Brisk walk — 30 min','Stretching — 15 min','Light cycling'] },
      { label:'Day 3 — Pull',    ex:['Dumbbell Rows — 3×12','Bicep Curls — 3×12','Lat Pulldown — 3×12','Face Pulls — 3×15'] },
      { label:'Day 4 — Legs',    ex:['Squats — 3×15','Lunges — 3×12 each leg','Glute Bridges — 3×15','Calf Raises — 3×20'] },
      { label:'Day 5 — Core',    ex:['Sit-ups — 3×20','Leg Raises — 3×15','Russian Twist — 3×20','Mountain Climbers — 3×30 sec'] },
      { label:'Day 6–7 — Rest',  ex:['Active recovery','Light yoga or walk','Sleep 7–9 hrs'] },
    ]},
  chest:     { label:'Chest',     sub:'Build a strong chest. Train 2x/week.',
    days:[
      { label:'Compound Lifts', ex:['Flat Bench Press — 4×10','Incline Bench Press — 3×10','Decline Press — 3×10','Weighted Dips — 3×10'] },
      { label:'Isolation',      ex:['Dumbbell Fly — 3×12','Cable Crossover — 3×15','Pec Deck — 3×12','Incline DB Fly — 3×12'] },
      { label:'Bodyweight',     ex:['Wide Push-ups — 3×20','Diamond Push-ups — 3×15','Clap Push-ups — 3×10'] },
    ]},
  back:      { label:'Back',      sub:'Build a wide strong back with these exercises.',
    days:[
      { label:'Width (V-taper)',  ex:['Pull-ups — 4×8','Lat Pulldown — 4×12','Wide Grip Rows — 3×10','Straight Arm Pulldown — 3×15'] },
      { label:'Thickness',        ex:['Deadlift — 4×6','Bent Over Row — 4×10','T-Bar Row — 3×10','Seated Cable Row — 3×12'] },
      { label:'Lower Back',       ex:['Romanian Deadlift — 3×10','Hyperextensions — 3×15','Good Mornings — 3×12'] },
    ]},
  legs:      { label:'Legs',      sub:'Never skip legs! Build power and size.',
    days:[
      { label:'Quads',           ex:['Barbell Squats — 4×8','Leg Press — 4×12','Walking Lunges — 3×12','Leg Extension — 3×15'] },
      { label:'Hamstrings',      ex:['Romanian Deadlift — 4×10','Leg Curl — 3×12','Stiff Leg DL — 3×10'] },
      { label:'Glutes & Calves', ex:['Hip Thrust — 4×12','Glute Kickback — 3×15','Calf Raise — 4×20'] },
    ]},
  shoulders: { label:'Shoulders', sub:'Build 3D boulder shoulders.',
    days:[
      { label:'Press',           ex:['Barbell OHP — 4×8','DB Shoulder Press — 3×10','Arnold Press — 3×12'] },
      { label:'Lateral & Rear',  ex:['Lateral Raises — 4×15','Rear Delt Fly — 3×15','Face Pulls — 3×20'] },
    ]},
  arms:      { label:'Arms',      sub:'Build big biceps and strong triceps.',
    days:[
      { label:'Biceps',          ex:['Barbell Curl — 4×10','Incline DB Curl — 3×12','Hammer Curl — 3×12','Concentration Curl — 3×12'] },
      { label:'Triceps',         ex:['Close Grip Bench — 4×10','Skull Crushers — 3×12','Cable Pushdown — 3×15','Overhead Extension — 3×12'] },
    ]},
  cardio:    { label:'Cardio',    sub:'Burn fat and boost stamina.',
    days:[
      { label:'HIIT (20 min)',   ex:['Jumping Jacks — 45 sec','Burpees — 45 sec','High Knees — 45 sec','Rest — 15 sec between','Repeat 4 rounds'] },
      { label:'Steady State',    ex:['Jogging — 30–45 min','60–70% max heart rate','3–4x per week'] },
      { label:'Jump Rope',       ex:['Basic jump — 2 min','Alternate foot — 2 min','Rest — 1 min','Repeat 5 rounds'] },
    ]},
};

export default function Workout() {
  const [active, setActive] = useState('beginner');
  const plan = PLANS[active];

  return (
    <div>
      <div className="page-header">
        <h1>Workout <span>Plans</span></h1>
        <p>Science-backed training plans for every level and goal</p>
      </div>
      <div className="section">
        <div className="tabs">
          {Object.entries(PLANS).map(([k,p]) => (
            <button key={k} className={`tab-btn ${active===k?'active':''}`} onClick={() => setActive(k)}>{p.label}</button>
          ))}
        </div>
        <h2 className="section-title" style={{marginBottom:'.3rem'}}>{plan.label} <span>Workout</span></h2>
        <p className="section-sub">{plan.sub}</p>
        <div className="workout-grid">
          {plan.days.map(d => (
            <div key={d.label} className="day-card">
              <div className="day-label">{d.label}</div>
              <ul className="ex-list">
                {d.ex.map(e => <li key={e}>{e}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
