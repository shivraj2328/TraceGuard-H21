import React, { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import TraceLogs from './pages/TraceLogs';
import Sidebar from './components/Sidebar';
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const storedUser = localStorage.getItem('traceguard_active_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('traceguard_active_user');
      }
    }
  }, []);

  // 1. If not logged in and hasn't clicked "Access Portal", show Welcome page
  if (!user && !showAuth) {
    return <Welcome onGetStarted={() => setShowAuth(true)} />;
  }

  // 2. If not logged in but clicked "Access Portal", show Auth form
  if (!user && showAuth) {
    return <Auth onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // 3. Main Authenticated App Layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 bg-slate-950 overflow-y-auto">
          {activeTab === 'overview' && <Dashboard user={user} />}
          {activeTab === 'traces' && <TraceLogs />}
        </main>
      </div>
    </div>
  );
}