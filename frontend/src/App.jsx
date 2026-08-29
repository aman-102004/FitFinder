import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar    from './components/Navbar/Navbar';
import Footer    from './components/Footer/Footer';
import Home      from './pages/Home';
import Gyms      from './pages/Gyms';
import GymDetail from './pages/GymDetail';
import Workout   from './pages/Workout';
import Diet      from './pages/Diet';
import ChatBot   from './pages/ChatBot';
import BMI       from './pages/BMI';
import Tracker   from './pages/Tracker';
import Login     from './pages/Login';
import Signup    from './pages/Signup';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />}      />
            <Route path="/gyms"      element={<Gyms />}      />
            <Route path="/gyms/:id"  element={<GymDetail />} />
            <Route path="/workout"   element={<Workout />}   />
            <Route path="/diet"      element={<Diet />}      />
            <Route path="/chat"      element={<ChatBot />}   />
            <Route path="/bmi"       element={<BMI />}       />
            <Route path="/tracker"   element={<Tracker />}   />
            <Route path="/login"     element={<Login />}     />
            <Route path="/signup"    element={<Signup />}    />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
