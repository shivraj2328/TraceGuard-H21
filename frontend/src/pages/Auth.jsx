import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, ArrowRight, Briefcase, AlertCircle, ChevronDown, Check } from 'lucide-react';
import TraceGuardLogo from '../components/TraceGuardLogo';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Auth({ mode = 'login', onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if register mode is active based on prop or current URL path
  const isRegister = mode === 'register' || location.pathname === '/register';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Developer',
    customRole: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const inputStyleClass = "w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 [color-scheme:dark] autofill:bg-slate-950 autofill:text-slate-100 [-webkit-text-fill-color:#f8fafc] [transition:background-color_50000s_ease-in-out_0s]";

  const roleOptions = [
    'Developer',
    'DevOps Engineer',
    'Security Analyst',
    'System Admin',
    'Other'
  ];

  // Seed default demo user if local storage is empty
  useEffect(() => {
    const existingUsers = localStorage.getItem('traceguard_users');
    if (!existingUsers) {
      const demoUsers = [
        {
          name: 'Alex Mercer',
          email: 'developer@traceguard.com',
          password: 'password123',
          role: 'Developer'
        }
      ];
      localStorage.setItem('traceguard_users', JSON.stringify(demoUsers));
    }
  }, []);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Switch between /login and /register routes
  const handleTabSwitch = (toRegister) => {
    setErrorMsg('');
    navigate(toRegister ? '/register' : '/login');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('traceguard_users') || '[]');
    const existingUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (isRegister) {
      if (!formData.name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (formData.role === 'Other' && !formData.customRole.trim()) {
        setErrorMsg('Please specify your custom role.');
        return;
      }
      if (existingUser) {
        setErrorMsg('An account with this email already exists. Please Sign In.');
        return;
      }
    } else {
      if (!existingUser) {
        setErrorMsg('No account found with this email. Please create an account first.');
        return;
      }
      if (existingUser.password !== formData.password) {
        setErrorMsg('Incorrect password. Please try again.');
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let userData;

      if (isRegister) {
        const resolvedRole = formData.role === 'Other' ? (formData.customRole.trim() || 'Contributor') : formData.role;
        userData = {
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: resolvedRole
        };
        localStorage.setItem('traceguard_users', JSON.stringify([...registeredUsers, userData]));
      } else {
        userData = { name: existingUser.name, email: existingUser.email, role: existingUser.role };
      }

      const sessionUser = { ...userData, token: 'mock-jwt-token' };
      localStorage.setItem('traceguard_active_user', JSON.stringify(sessionUser));
      onLoginSuccess(sessionUser);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <TraceGuardLogo size="md" showTagline={true} />
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex border-b border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-2 cursor-pointer text-sm font-medium border-b-2 transition-colors ${
              !isRegister ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-2 cursor-pointer text-sm font-medium border-b-2 transition-colors ${
              isRegister ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputStyleClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Role</label>
                <div className="relative" ref={dropdownRef}>
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 z-10" />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`${inputStyleClass} cursor-pointer flex items-center justify-between text-left pr-3`}
                  >
                    <span className="truncate">
                      {formData.role === 'Other' ? 'Other...' : formData.role}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-30 py-1 overflow-hidden">
                      {roleOptions.map((role) => {
                        const isSelected = formData.role === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, role });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-xs text-left cursor-pointer flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-indigo-600/20 text-indigo-400 font-semibold'
                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                            }`}
                          >
                            <span>{role === 'Other' ? 'Other...' : role}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {formData.role === 'Other' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Specify Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QA Architect"
                    value={formData.customRole}
                    onChange={(e) => setFormData({ ...formData, customRole: e.target.value })}
                    className={inputStyleClass}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="developer@traceguard.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputStyleClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputStyleClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register & Continue' : 'Login & Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}