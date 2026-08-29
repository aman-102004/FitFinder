import React, { useState } from 'react';
import './BMI.css';

export default function BMI() {
  const [form, setForm]   = useState({ weight:'', height:'', age:'', gender:'male', activity:'1.55' });
  const [result, setResult] = useState(null);
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const calculate = () => {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height) / 100;
    const age = parseInt(form.age) || 25;
    if (!w || !h || w < 20 || h < 1) return;

    const bmi = +(w / (h*h)).toFixed(1);
    let cat, tip, pct, color, advice;

    if (bmi < 18.5)      { cat='Underweight'; tip='You need to gain weight through nutrition and strength training.'; pct=18;  color='#64b5f6'; advice=['Eat 300–500 extra calories per day','Strength train 4 times a week','Eat every 3–4 hours','Add healthy fats like nuts and peanut butter'] }
    else if (bmi < 25)   { cat='Normal Weight ✅'; tip='Great shape! Keep it up with balanced diet and exercise.'; pct=45; color='#66bb6a'; advice=['Maintain current calorie intake','Exercise 3–5 times per week','Focus on muscle building','Drink 3 litres of water daily'] }
    else if (bmi < 30)   { cat='Overweight'; tip='Losing some weight will improve your health a lot.'; pct=65; color='#ffa726'; advice=['Eat 400–500 fewer calories per day','Do 150 minutes of cardio per week','Eat more protein and vegetables','Cut sugar and fried food completely'] }
    else                  { cat='Obese'; tip='Please consult a doctor. Start with gentle exercise and diet changes.'; pct=85; color='#ef5350'; advice=['See a doctor before starting intense exercise','Start with walking and swimming','Reduce calories under medical guidance','Monitor blood pressure and blood sugar regularly'] }

    // BMR formula (Mifflin-St Jeor) — calculates calories your body burns at rest
    let bmr = form.gender === 'male'
      ? 10*w + 6.25*(h*100) - 5*age + 5
      : 10*w + 6.25*(h*100) - 5*age - 161;
    const tdee       = Math.round(bmr * parseFloat(form.activity));
    const idealLow   = +(18.5 * h * h).toFixed(1);
    const idealHigh  = +(24.9 * h * h).toFixed(1);
    setResult({ bmi, cat, tip, pct, color, advice, tdee, idealLow, idealHigh });
  };

  return (
    <div>
      <div className="page-header">
        <h1>BMI <span>Calculator</span></h1>
        <p>Find out your Body Mass Index and get a personalised health plan</p>
      </div>
      <div className="section bmi-section">
        <div className="bmi-card">
          <div className="bmi-grid">
            <div className="form-group"><label>Weight (kg)</label><input type="number" placeholder="70" value={form.weight} onChange={e=>set('weight',e.target.value)} /></div>
            <div className="form-group"><label>Height (cm)</label><input type="number" placeholder="175" value={form.height} onChange={e=>set('height',e.target.value)} /></div>
            <div className="form-group"><label>Age</label><input type="number" placeholder="25" value={form.age} onChange={e=>set('age',e.target.value)} /></div>
            <div className="form-group"><label>Gender</label>
              <select value={form.gender} onChange={e=>set('gender',e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group bmi-full"><label>Activity Level</label>
              <select value={form.activity} onChange={e=>set('activity',e.target.value)}>
                <option value="1.2">No exercise (sitting most of day)</option>
                <option value="1.375">Light exercise (1–3 days/week)</option>
                <option value="1.55">Moderate exercise (3–5 days/week)</option>
                <option value="1.725">Heavy exercise (6–7 days/week)</option>
                <option value="1.9">Athlete (train twice a day)</option>
              </select>
            </div>
          </div>
          <button className="btn-red bmi-btn" onClick={calculate}>Calculate BMI</button>

          {result && (
            <div className="bmi-result">
              <div className="bmi-num" style={{color:result.color}}>{result.bmi}</div>
              <div className="bmi-cat">{result.cat}</div>
              <div className="bmi-tip">{result.tip}</div>
              <div className="bar-wrap">
                <div className="bar-bg"><div className="bar-fill" style={{width:result.pct+'%',background:result.color}} /></div>
                <div className="bar-labels"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
              </div>
              <div className="bmi-stats">
                <div className="bmi-stat">
                  <div className="stat-label">Daily Calories Needed</div>
                  <div className="stat-val">{result.tdee.toLocaleString()} kcal</div>
                  <div className="stat-sub">to maintain your current weight</div>
                </div>
                <div className="bmi-stat">
                  <div className="stat-label">Ideal Weight for You</div>
                  <div className="stat-val">{result.idealLow}–{result.idealHigh} kg</div>
                  <div className="stat-sub">for your height</div>
                </div>
              </div>
              <div className="bmi-advice">
                <h4>💡 Your Action Plan</h4>
                <ul>{result.advice.map(a=><li key={a}>{a}</li>)}</ul>
              </div>
            </div>
          )}
        </div>

        <div className="bmi-table-card">
          <h3 className="section-title" style={{fontSize:'1.5rem',marginBottom:'1rem'}}>BMI <span>Reference Table</span></h3>
          <table className="bmi-table">
            <thead><tr><th>Category</th><th>BMI Range</th><th>Health Risk</th></tr></thead>
            <tbody>
              <tr><td>Underweight</td><td>Below 18.5</td><td style={{color:'#64b5f6'}}>Moderate</td></tr>
              <tr><td>Normal</td><td>18.5 – 24.9</td><td style={{color:'#66bb6a'}}>Low ✅</td></tr>
              <tr><td>Overweight</td><td>25 – 29.9</td><td style={{color:'#ffa726'}}>Increased</td></tr>
              <tr><td>Obese</td><td>30 and above</td><td style={{color:'#ef5350'}}>High</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
