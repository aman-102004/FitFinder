import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, authHeaders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Tracker.css';

// ─── small helper to format date nicely ───────────────────────────────────
function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── TABS ─────────────────────────────────────────────────────────────────
const TABS = ['Dashboard', 'Log Workout', 'Log Diet', 'Log Weight', 'History', 'Settings'];

export default function Tracker() {
  const { isLoggedIn, user } = useAuth();
  const { showToast }        = useToast();
  const navigate             = useNavigate();

  const [tab,     setTab]     = useState('Dashboard');
  const [tracker, setTracker] = useState(null);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── workout form state ───────────────────────────────────────────────────
  const [workout, setWorkout] = useState({ name: '', duration: '', notes: '', exercises: [{ name: '', sets: '', reps: '', weight: '' }] });

  // ── diet form state ──────────────────────────────────────────────────────
  const [diet, setDiet] = useState({ meal: 'Breakfast', food: '', calories: '', protein: '', carbs: '', fat: '' });

  // ── weight form state ────────────────────────────────────────────────────
  const [newWeight, setNewWeight] = useState('');

  // ── settings/profile state ───────────────────────────────────────────────
  const [profile, setProfile] = useState({ weight: '', height: '', age: '', gender: 'male', goal: 'muscle_gain', activityLevel: 'moderate', targetWeight: '' });
  const [goals,   setGoals]   = useState({ dailyCalories: '', dailyProtein: '', weeklyWorkouts: '' });

  // ── redirect if not logged in ────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    fetchTracker();
    fetchStats();
  }, [isLoggedIn]); // eslint-disable-line

  const fetchTracker = async () => {
    try {
      const res  = await fetch(`${API}/tracker`, { headers: authHeaders() });
      const data = await res.json();
      setTracker(data);
      if (data.profile) setProfile(p => ({ ...p, ...data.profile }));
      if (data.goals)   setGoals(g  => ({ ...g, ...data.goals   }));
    } catch (err) {
      showToast('Could not load tracker. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res  = await fetch(`${API}/tracker/stats`, { headers: authHeaders() });
      const data = await res.json();
      setStats(data);
    } catch (_) {}
  };

  // ── LOG WORKOUT ──────────────────────────────────────────────────────────
  const logWorkout = async () => {
    if (!workout.name.trim()) { showToast('Please enter a workout name.'); return; }
    try {
      const res  = await fetch(`${API}/tracker/workout`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          name:      workout.name,
          duration:  Number(workout.duration),
          notes:     workout.notes,
          exercises: workout.exercises.filter(e => e.name).map(e => ({
            name: e.name, sets: Number(e.sets), reps: Number(e.reps), weight: Number(e.weight)
          }))
        })
      });
      if (!res.ok) throw new Error();
      showToast('Workout logged! 💪');
      setWorkout({ name: '', duration: '', notes: '', exercises: [{ name: '', sets: '', reps: '', weight: '' }] });
      fetchTracker(); fetchStats();
      setTab('Dashboard');
    } catch { showToast('Could not log workout.'); }
  };

  const addExercise = () => setWorkout(w => ({ ...w, exercises: [...w.exercises, { name: '', sets: '', reps: '', weight: '' }] }));
  const removeExercise = i => setWorkout(w => ({ ...w, exercises: w.exercises.filter((_, idx) => idx !== i) }));
  const setEx = (i, k, v) => setWorkout(w => ({ ...w, exercises: w.exercises.map((e, idx) => idx === i ? { ...e, [k]: v } : e) }));

  // ── LOG DIET ─────────────────────────────────────────────────────────────
  const logDiet = async () => {
    if (!diet.food.trim()) { showToast('Please enter food name.'); return; }
    try {
      const res = await fetch(`${API}/tracker/diet`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ ...diet, calories: Number(diet.calories), protein: Number(diet.protein), carbs: Number(diet.carbs), fat: Number(diet.fat) })
      });
      if (!res.ok) throw new Error();
      showToast('Meal logged! 🥗');
      setDiet({ meal: 'Breakfast', food: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchTracker(); fetchStats();
      setTab('Dashboard');
    } catch { showToast('Could not log meal.'); }
  };

  // ── LOG WEIGHT ───────────────────────────────────────────────────────────
  const logWeight = async () => {
    if (!newWeight) { showToast('Please enter your weight.'); return; }
    try {
      const res = await fetch(`${API}/tracker/weight`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ weight: Number(newWeight) })
      });
      if (!res.ok) throw new Error();
      showToast(`Weight ${newWeight}kg logged! ⚖️`);
      setNewWeight('');
      fetchTracker(); fetchStats();
      setTab('Dashboard');
    } catch { showToast('Could not log weight.'); }
  };

  // ── SAVE SETTINGS ────────────────────────────────────────────────────────
  const saveSettings = async () => {
    try {
      const res = await fetch(`${API}/tracker/profile`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({
          profile: { ...profile, weight: Number(profile.weight), height: Number(profile.height), age: Number(profile.age), targetWeight: Number(profile.targetWeight) },
          goals:   { ...goals,   dailyCalories: Number(goals.dailyCalories), dailyProtein: Number(goals.dailyProtein), weeklyWorkouts: Number(goals.weeklyWorkouts) }
        })
      });
      if (!res.ok) throw new Error();
      showToast('Settings saved! ✅');
      fetchStats();
    } catch { showToast('Could not save settings.'); }
  };

  // ── DELETE logs ──────────────────────────────────────────────────────────
  const deleteWorkout = async (id) => {
    try {
      await fetch(`${API}/tracker/workout/${id}`, { method: 'DELETE', headers: authHeaders() });
      showToast('Workout deleted.');
      fetchTracker(); fetchStats();
    } catch { showToast('Could not delete.'); }
  };
  const deleteDiet = async (id) => {
    try {
      await fetch(`${API}/tracker/diet/${id}`, { method: 'DELETE', headers: authHeaders() });
      showToast('Meal deleted.');
      fetchTracker(); fetchStats();
    } catch { showToast('Could not delete.'); }
  };

  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;

  // ── today's diet totals ───────────────────────────────────────────────────
  const today      = new Date(); today.setHours(0,0,0,0);
  const todayDiet  = (tracker?.dietLogs || []).filter(d => new Date(d.date) >= today);
  const totalCals  = todayDiet.reduce((s, d) => s + (d.calories || 0), 0);
  const totalProt  = todayDiet.reduce((s, d) => s + (d.protein  || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>My <span>Fitness Tracker</span></h1>
        <p>Welcome back, {user?.name?.split(' ')[0]}! Track your workouts, meals and progress.</p>
      </div>

      {/* TAB NAV */}
      <div className="tracker-tabs">
        {TABS.map(t => (
          <button key={t} className={`t-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section tracker-section">

        {/* ═══ DASHBOARD ═══════════════════════════════════════════════════ */}
        {tab === 'Dashboard' && (
          <div>
            {/* Stats cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="sc-icon">🏋️</div>
                <div className="sc-val">{stats?.workoutsThisWeek ?? 0}</div>
                <div className="sc-label">Workouts this week</div>
                <div className="sc-sub">Goal: {stats?.goals?.weeklyWorkouts || 4}/week</div>
              </div>
              <div className="stat-card">
                <div className="sc-icon">🔥</div>
                <div className="sc-val">{totalCals}</div>
                <div className="sc-label">Calories today</div>
                <div className="sc-sub">Goal: {stats?.goals?.dailyCalories || '—'} kcal</div>
              </div>
              <div className="stat-card">
                <div className="sc-icon">🥩</div>
                <div className="sc-val">{totalProt}g</div>
                <div className="sc-label">Protein today</div>
                <div className="sc-sub">Goal: {stats?.goals?.dailyProtein || '—'}g</div>
              </div>
              <div className="stat-card">
                <div className="sc-icon">⚖️</div>
                <div className="sc-val">{stats?.latestWeight ? `${stats.latestWeight}kg` : '—'}</div>
                <div className="sc-label">Current weight</div>
                <div className="sc-sub">Target: {tracker?.profile?.targetWeight ? `${tracker.profile.targetWeight}kg` : '—'}</div>
              </div>
            </div>

            {/* Progress bars */}
            {stats?.goals?.dailyCalories > 0 && (
              <div className="progress-section">
                <h3 className="section-title" style={{fontSize:'1.4rem',marginBottom:'1rem'}}>Today's <span>Progress</span></h3>
                <div className="prog-item">
                  <div className="prog-label"><span>Calories</span><span>{totalCals} / {stats.goals.dailyCalories} kcal</span></div>
                  <div className="prog-bar"><div className="prog-fill" style={{width: Math.min(100, (totalCals / stats.goals.dailyCalories) * 100) + '%', background: totalCals > stats.goals.dailyCalories ? '#ef5350' : 'var(--red)'}} /></div>
                </div>
                {stats?.goals?.dailyProtein > 0 && (
                  <div className="prog-item">
                    <div className="prog-label"><span>Protein</span><span>{totalProt}g / {stats.goals.dailyProtein}g</span></div>
                    <div className="prog-bar"><div className="prog-fill" style={{width: Math.min(100, (totalProt / stats.goals.dailyProtein) * 100) + '%', background: '#66bb6a'}} /></div>
                  </div>
                )}
                <div className="prog-item">
                  <div className="prog-label"><span>Workouts this week</span><span>{stats?.workoutsThisWeek} / {stats?.goals?.weeklyWorkouts || 4}</span></div>
                  <div className="prog-bar"><div className="prog-fill" style={{width: Math.min(100, ((stats?.workoutsThisWeek || 0) / (stats?.goals?.weeklyWorkouts || 4)) * 100) + '%', background: '#64b5f6'}} /></div>
                </div>
              </div>
            )}

            {/* Quick log buttons */}
            <div className="quick-log-row">
              <button className="ql-btn" onClick={() => setTab('Log Workout')}>+ Log Workout 🏋️</button>
              <button className="ql-btn" onClick={() => setTab('Log Diet')}>+ Log Meal 🥗</button>
              <button className="ql-btn" onClick={() => setTab('Log Weight')}>+ Log Weight ⚖️</button>
            </div>

            {/* Recent workouts */}
            <div className="recent-section">
              <h3 className="section-title" style={{fontSize:'1.4rem',marginBottom:'1rem'}}>Recent <span>Workouts</span></h3>
              {!(tracker?.workoutLogs?.length) ? (
                <p className="empty-msg">No workouts logged yet. Click "Log Workout" to start! 💪</p>
              ) : [...tracker.workoutLogs].reverse().slice(0,3).map(w => (
                <div key={w._id} className="log-card">
                  <div className="log-top">
                    <div>
                      <div className="log-name">🏋️ {w.name}</div>
                      <div className="log-meta">{fmtDate(w.date)} {w.duration ? `· ${w.duration} min` : ''}</div>
                    </div>
                    <button className="del-btn" onClick={() => deleteWorkout(w._id)}>✕</button>
                  </div>
                  {w.exercises?.length > 0 && (
                    <div className="ex-chips">
                      {w.exercises.map((e,i) => <span key={i} className="ex-chip">{e.name} {e.sets && e.reps ? `${e.sets}×${e.reps}` : ''}{e.weight ? ` @ ${e.weight}kg` : ''}</span>)}
                    </div>
                  )}
                  {w.notes && <p className="log-notes">{w.notes}</p>}
                </div>
              ))}
            </div>

            {/* Today's meals */}
            <div className="recent-section">
              <h3 className="section-title" style={{fontSize:'1.4rem',marginBottom:'1rem'}}>Today's <span>Meals</span></h3>
              {!todayDiet.length ? (
                <p className="empty-msg">No meals logged today. Click "Log Diet" to track food! 🥗</p>
              ) : todayDiet.map(d => (
                <div key={d._id} className="log-card">
                  <div className="log-top">
                    <div>
                      <div className="log-name">🍽️ {d.food}</div>
                      <div className="log-meta">{d.meal} {d.calories ? `· ${d.calories} kcal` : ''} {d.protein ? `· ${d.protein}g protein` : ''}</div>
                    </div>
                    <button className="del-btn" onClick={() => deleteDiet(d._id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ LOG WORKOUT ═════════════════════════════════════════════════ */}
        {tab === 'Log Workout' && (
          <div className="form-section">
            <h2 className="section-title">Log a <span>Workout</span></h2>
            <p className="section-sub">Record your training session</p>

            <div className="form-group">
              <label>Workout Name (e.g. Chest Day, Full Body, Leg Day)</label>
              <input type="text" placeholder="e.g. Chest Day" value={workout.name} onChange={e => setWorkout(w => ({...w, name: e.target.value}))} />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" placeholder="e.g. 60" value={workout.duration} onChange={e => setWorkout(w => ({...w, duration: e.target.value}))} />
            </div>

            <h3 className="sub-heading">Exercises</h3>
            {workout.exercises.map((ex, i) => (
              <div key={i} className="ex-row">
                <div className="ex-inputs">
                  <input placeholder="Exercise name (e.g. Bench Press)" value={ex.name}   onChange={e => setEx(i, 'name',   e.target.value)} />
                  <input placeholder="Sets" type="number"  value={ex.sets}   onChange={e => setEx(i, 'sets',   e.target.value)} style={{width:80}} />
                  <input placeholder="Reps" type="number"  value={ex.reps}   onChange={e => setEx(i, 'reps',   e.target.value)} style={{width:80}} />
                  <input placeholder="kg"   type="number"  value={ex.weight} onChange={e => setEx(i, 'weight', e.target.value)} style={{width:80}} />
                </div>
                {workout.exercises.length > 1 && (
                  <button className="del-btn" onClick={() => removeExercise(i)}>✕</button>
                )}
              </div>
            ))}
            <button className="add-ex-btn" onClick={addExercise}>+ Add Exercise</button>

            <div className="form-group" style={{marginTop:'1rem'}}>
              <label>Notes (optional)</label>
              <textarea placeholder="How did the workout feel? Any PBs?" value={workout.notes} onChange={e => setWorkout(w => ({...w, notes: e.target.value}))} rows={2} className="review-textarea" />
            </div>

            <button className="btn-red" style={{padding:'.8rem 2rem', marginTop:'.5rem', fontSize:'1rem'}} onClick={logWorkout}>Save Workout 💪</button>
          </div>
        )}

        {/* ═══ LOG DIET ════════════════════════════════════════════════════ */}
        {tab === 'Log Diet' && (
          <div className="form-section">
            <h2 className="section-title">Log a <span>Meal</span></h2>
            <p className="section-sub">Track what you ate to monitor your nutrition</p>

            <div className="form-row">
              <div className="form-group">
                <label>Meal Type</label>
                <select value={diet.meal} onChange={e => setDiet(d => ({...d, meal: e.target.value}))}>
                  {['Breakfast','Lunch','Dinner','Snack','Pre-Workout','Post-Workout'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group" style={{flex:2}}>
                <label>Food Name</label>
                <input type="text" placeholder="e.g. 2 Boiled Eggs + Toast" value={diet.food} onChange={e => setDiet(d => ({...d, food: e.target.value}))} />
              </div>
            </div>

            <div className="macro-row">
              <div className="form-group">
                <label>Calories (kcal)</label>
                <input type="number" placeholder="e.g. 350" value={diet.calories} onChange={e => setDiet(d => ({...d, calories: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Protein (g)</label>
                <input type="number" placeholder="e.g. 25" value={diet.protein} onChange={e => setDiet(d => ({...d, protein: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Carbs (g)</label>
                <input type="number" placeholder="e.g. 40" value={diet.carbs} onChange={e => setDiet(d => ({...d, carbs: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Fat (g)</label>
                <input type="number" placeholder="e.g. 10" value={diet.fat} onChange={e => setDiet(d => ({...d, fat: e.target.value}))} />
              </div>
            </div>

            <div className="macro-hint">
              <strong>Quick reference:</strong> Chicken 100g ≈ 165 kcal, 31g protein · Dal 1 bowl ≈ 200 kcal, 12g protein · 1 Egg ≈ 78 kcal, 6g protein · Paneer 100g ≈ 265 kcal, 18g protein
            </div>

            <button className="btn-red" style={{padding:'.8rem 2rem', marginTop:'.5rem', fontSize:'1rem'}} onClick={logDiet}>Save Meal 🥗</button>
          </div>
        )}

        {/* ═══ LOG WEIGHT ══════════════════════════════════════════════════ */}
        {tab === 'Log Weight' && (
          <div className="form-section">
            <h2 className="section-title">Log <span>Weight</span></h2>
            <p className="section-sub">Track your weight over time to see your progress</p>

            <div className="weight-log-box">
              <div className="form-group">
                <label>Your weight today (kg)</label>
                <input type="number" placeholder="e.g. 72.5" value={newWeight} onChange={e => setNewWeight(e.target.value)} onKeyDown={e => e.key==='Enter' && logWeight()} style={{fontSize:'1.2rem',padding:'1rem'}} />
              </div>
              <button className="btn-red" style={{padding:'.8rem 2rem', fontSize:'1rem'}} onClick={logWeight}>Save Weight ⚖️</button>
            </div>

            {/* Weight history */}
            {tracker?.weightHistory?.length > 0 && (
              <div style={{marginTop:'2rem'}}>
                <h3 className="section-title" style={{fontSize:'1.4rem',marginBottom:'1rem'}}>Weight <span>History</span></h3>
                <div className="weight-history">
                  {[...tracker.weightHistory].reverse().map((w, i) => (
                    <div key={i} className="wh-row">
                      <span className="wh-date">{fmtDate(w.date)}</span>
                      <span className="wh-val">{w.weight} kg</span>
                      {i > 0 && (() => {
                        const prev = [...tracker.weightHistory].reverse()[i-1];
                        const diff = (w.weight - prev.weight).toFixed(1);
                        return <span className={`wh-diff ${diff > 0 ? 'up' : 'down'}`}>{diff > 0 ? '▲' : '▼'} {Math.abs(diff)}kg</span>;
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ HISTORY ═════════════════════════════════════════════════════ */}
        {tab === 'History' && (
          <div>
            <h2 className="section-title">Full <span>History</span></h2>
            <p className="section-sub">All your workout and diet logs</p>

            <h3 style={{fontFamily:'var(--display)',fontSize:'1.5rem',color:'var(--red)',marginBottom:'1rem',letterSpacing:'1px'}}>All Workouts ({tracker?.workoutLogs?.length || 0})</h3>
            {!tracker?.workoutLogs?.length ? (
              <p className="empty-msg">No workouts logged yet.</p>
            ) : [...tracker.workoutLogs].reverse().map(w => (
              <div key={w._id} className="log-card">
                <div className="log-top">
                  <div>
                    <div className="log-name">🏋️ {w.name}</div>
                    <div className="log-meta">{fmtDate(w.date)}{w.duration ? ` · ${w.duration} min` : ''}{w.exercises?.length ? ` · ${w.exercises.length} exercises` : ''}</div>
                  </div>
                  <button className="del-btn" onClick={() => deleteWorkout(w._id)}>✕</button>
                </div>
                {w.exercises?.length > 0 && (
                  <div className="ex-chips">
                    {w.exercises.map((e,i) => <span key={i} className="ex-chip">{e.name}{e.sets && e.reps ? ` ${e.sets}×${e.reps}` : ''}{e.weight ? ` @${e.weight}kg` : ''}</span>)}
                  </div>
                )}
              </div>
            ))}

            <h3 style={{fontFamily:'var(--display)',fontSize:'1.5rem',color:'var(--red)',margin:'2rem 0 1rem',letterSpacing:'1px'}}>All Meals ({tracker?.dietLogs?.length || 0})</h3>
            {!tracker?.dietLogs?.length ? (
              <p className="empty-msg">No meals logged yet.</p>
            ) : [...tracker.dietLogs].reverse().map(d => (
              <div key={d._id} className="log-card">
                <div className="log-top">
                  <div>
                    <div className="log-name">🍽️ {d.food}</div>
                    <div className="log-meta">{fmtDate(d.date)} · {d.meal}{d.calories ? ` · ${d.calories} kcal` : ''}{d.protein ? ` · ${d.protein}g protein` : ''}</div>
                  </div>
                  <button className="del-btn" onClick={() => deleteDiet(d._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ SETTINGS ════════════════════════════════════════════════════ */}
        {tab === 'Settings' && (
          <div className="form-section">
            <h2 className="section-title">Your <span>Profile & Goals</span></h2>
            <p className="section-sub">Set your details so the AI chatbot can give you personalised advice</p>

            <h3 className="sub-heading">Body Details</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Current Weight (kg)</label>
                <input type="number" placeholder="e.g. 70" value={profile.weight} onChange={e => setProfile(p => ({...p, weight: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" placeholder="e.g. 175" value={profile.height} onChange={e => setProfile(p => ({...p, height: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" placeholder="e.g. 22" value={profile.age} onChange={e => setProfile(p => ({...p, age: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={profile.gender} onChange={e => setProfile(p => ({...p, gender: e.target.value}))}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Your Goal</label>
                <select value={profile.goal} onChange={e => setProfile(p => ({...p, goal: e.target.value}))}>
                  <option value="weight_loss">Lose Weight</option>
                  <option value="muscle_gain">Build Muscle</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>
              <div className="form-group">
                <label>Activity Level</label>
                <select value={profile.activityLevel} onChange={e => setProfile(p => ({...p, activityLevel: e.target.value}))}>
                  <option value="sedentary">Sedentary (no exercise)</option>
                  <option value="light">Light (1–3 days/week)</option>
                  <option value="moderate">Moderate (3–5 days/week)</option>
                  <option value="active">Active (6–7 days/week)</option>
                  <option value="veryActive">Very Active (twice a day)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Target Weight (kg)</label>
                <input type="number" placeholder="e.g. 65" value={profile.targetWeight} onChange={e => setProfile(p => ({...p, targetWeight: e.target.value}))} />
              </div>
            </div>

            <h3 className="sub-heading" style={{marginTop:'1.5rem'}}>Daily Goals</h3>
            <div className="settings-grid">
              <div className="form-group">
                <label>Daily Calorie Goal (kcal)</label>
                <input type="number" placeholder="e.g. 2200" value={goals.dailyCalories} onChange={e => setGoals(g => ({...g, dailyCalories: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Daily Protein Goal (g)</label>
                <input type="number" placeholder="e.g. 140" value={goals.dailyProtein} onChange={e => setGoals(g => ({...g, dailyProtein: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Weekly Workout Goal</label>
                <input type="number" placeholder="e.g. 5" value={goals.weeklyWorkouts} onChange={e => setGoals(g => ({...g, weeklyWorkouts: e.target.value}))} />
              </div>
            </div>

            <div className="ai-tip">
              🤖 <strong>Tip:</strong> Fill in your profile and the AI chatbot will automatically give you personalised advice — like your exact calorie needs, workout plans for your goal, and diet tips based on your weight!
            </div>

            <button className="btn-red" style={{padding:'.8rem 2rem', marginTop:'1rem', fontSize:'1rem'}} onClick={saveSettings}>Save Settings ✅</button>
          </div>
        )}

      </div>
    </div>
  );
}
