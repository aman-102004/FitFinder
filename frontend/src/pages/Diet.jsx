import React, { useState } from 'react';
import './Diet.css';

const PLANS = {
  loss: {
    label:'Weight Loss', icon:'🔥', kcal:'1400–1600 kcal/day',
    meals:[
      { time:'Morning 6 AM',    food:'Warm lemon water + 5 soaked almonds' },
      { time:'Breakfast 8 AM',  food:'1 cup oats + milk + fruits OR 2 boiled eggs + toast' },
      { time:'Lunch 1 PM',      food:'2 chapati + dal + sabzi + salad + buttermilk' },
      { time:'Snack 4 PM',      food:'Green tea + roasted chana or makhana (30g)' },
      { time:'Dinner 7 PM',     food:'Grilled paneer or chicken 150g + 1 chapati + salad' },
      { time:'Before Bed',      food:'1 glass warm turmeric milk' },
    ],
    tips:['Drink 3–4 litres of water daily','Cut sugar, fried food and packaged snacks completely','Eat dinner at least 2 hours before sleeping','Do 150 minutes of cardio every week'],
  },
  gain: {
    label:'Muscle Gain', icon:'💪', kcal:'2800–3000 kcal/day',
    meals:[
      { time:'Morning 6 AM',      food:'Banana + 2 tbsp peanut butter + 500ml water' },
      { time:'Breakfast 8 AM',    food:'4 whole eggs + 2 slices wheat bread + full-fat milk' },
      { time:'Lunch 1 PM',        food:'200g chicken or paneer + 1.5 cup rice + 2 chapati + dal + curd' },
      { time:'Pre-Workout 4 PM',  food:'Banana + black coffee' },
      { time:'Post-Workout',      food:'Whey protein shake + banana' },
      { time:'Dinner 8 PM',       food:'Paneer bhurji or chicken curry + 3 chapati' },
      { time:'Before Bed',        food:'1 glass warm milk' },
    ],
    tips:['Eat every 3–4 hours to keep building muscle','Sleep 7–9 hours — muscle grows during sleep','Train 5 days per week with heavy compound lifts','Aim for 1.8–2.2g protein per kg of your bodyweight'],
  },
  maintain: {
    label:'Maintenance', icon:'⚖️', kcal:'1800–2200 kcal/day',
    meals:[
      { time:'Morning 7 AM',  food:'Warm water + dry fruits + ginger tea' },
      { time:'Breakfast 8 AM',food:'Poha or upma with veggies + milk' },
      { time:'Lunch 1 PM',    food:'Dal + sabzi + rice or roti + salad + curd' },
      { time:'Snack 4 PM',    food:'Sprouts chaat or fruit + coconut water' },
      { time:'Dinner 7 PM',   food:'Khichdi or light sabzi + chapati' },
    ],
    tips:['Exercise 3–4 times per week consistently','Weigh yourself once a week at same time','Adjust calories up/down by 200 if weight changes','Focus on good sleep and low stress'],
  },
  veg: {
    label:'Vegetarian', icon:'🌱', kcal:'2000 kcal · Plant protein focus',
    meals:[
      { time:'Morning 6:30 AM',   food:'Chia seeds in warm water + 10 almonds + 5 walnuts' },
      { time:'Breakfast 8 AM',    food:'Moong dal cheela (2 pcs) + curd + plant protein shake' },
      { time:'Lunch 1 PM',        food:'Rajma or chole + 2 chapati + brown rice + salad + curd' },
      { time:'Snack 5 PM',        food:'Sprouts bhel + buttermilk' },
      { time:'Dinner 8 PM',       food:'Paneer tikka or tofu curry + 2 multigrain chapati' },
      { time:'Before Bed',        food:'Warm turmeric milk' },
    ],
    tips:['Best veg protein sources: soya chunks (52g/100g), paneer (18g/100g), dal (9g/100g)','Always combine rice + dal for complete protein','Take B12 and Vitamin D supplements','Eat legumes (dal, rajma, chana) every single day'],
  },
};

export default function Diet() {
  const [active, setActive] = useState('loss');
  const plan = PLANS[active];

  return (
    <div>
      <div className="page-header">
        <h1>Diet <span>Plans</span></h1>
        <p>Indian nutrition plans designed for your fitness goal</p>
      </div>
      <div className="section">
        <div className="tabs">
          {Object.entries(PLANS).map(([k,p]) => (
            <button key={k} className={`tab-btn ${active===k?'active':''}`} onClick={() => setActive(k)}>{p.icon} {p.label}</button>
          ))}
        </div>

        <div className="plan-header">
          <h2>{plan.icon} {plan.label} Plan</h2>
          <span className="kcal-pill">{plan.kcal}</span>
        </div>

        <div className="meal-list">
          {plan.meals.map(m => (
            <div key={m.time} className="meal-row">
              <span className="meal-time">{m.time}</span>
              <span className="meal-food">{m.food}</span>
            </div>
          ))}
        </div>

        <div className="tips-box">
          <h3>💡 Key Tips</h3>
          <ul>{plan.tips.map(t => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
