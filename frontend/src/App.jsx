import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import TraceLogs from './pages/TraceLogs';
import SecurityAlerts from './pages/SecurityAlerts';
import MonitoredServices from './pages/MonitoredServices';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('traceguard_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('traceguard_active_user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex">
      {/* Single top-level Sidebar when logged in */}
      {user && <Sidebar />}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/welcome"
            element={user ? <Navigate to="/dashboard" replace /> : <Welcome />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Auth mode="login" onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Auth mode="register" onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute user={user} />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/trace-logs" element={<TraceLogs />} />
            <Route path="/security-alerts" element={<SecurityAlerts />} />
            <Route path="/monitored-services" element={<MonitoredServices />} />
            <Route path="/settings" element={<Settings user={user} onLogout={handleLogout} />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/welcome"} replace />} />
        </Routes>
      </main>
    </div>
  );
}