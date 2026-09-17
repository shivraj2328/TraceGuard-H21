import React, { useState } from 'react';
import { User, Shield, Key, Bell, Laptop, LogOut, Check, Copy } from 'lucide-react';

export default function Settings({ user, onLogout }) {
  const [copied, setCopied] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState('30');
  const [notifications, setNotifications] = useState({
    emailCritical: true,
    emailWeekly: false,
  });

  const apiKey = "tg_live_99f82a104c889a74e";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl space-y-6 text-slate-100">
      <div>
        <h1 className="text-xl font-bold">Account & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, access rules, telemetry keys, and alert preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Session Management */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-200 truncate">{user?.name || 'Security Operator'}</h3>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'operator@traceguard.io'}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-medium">
                  {user?.role || 'Developer'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Session & Logout */}
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
              <Laptop className="w-4 h-4 text-indigo-400" /> Active Session
            </h2>
            <div className="text-xs text-slate-400 space-y-1 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
              <p className="text-slate-300 font-medium">Chrome on Windows (Current)</p>
              <p>IP: 192.168.1.102</p>
              <p className="text-[10px] text-emerald-400 font-medium"><span className='animate-pulse'>●</span> Session Active</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>

        {/* Right Column: Security, API Keys, Notifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Password & Access Controls */}
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
              <Shield className="w-4 h-4 text-indigo-400" /> Password & Access Controls
            </h2>

            {/* Account Password */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <div>
                <p className="text-xs font-medium text-slate-200">Account Password</p>
                <p className="text-[11px] text-slate-400">Update your login credentials.</p>
              </div>
              <button 
                onClick={() => alert("Password reset functionality initialized.")}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
              >
                Change Password
              </button>
            </div>

            {/* Idle Timeout */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <div>
                <p className="text-xs font-medium text-slate-200">Idle Session Timeout</p>
                <p className="text-[11px] text-slate-400">Automatically log out after inactivity.</p>
              </div>
              <select
                value={idleTimeout}
                onChange={(e) => setIdleTimeout(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
              </select>
            </div>

            {/* Zero-Trust Status */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-slate-200">Zero-Trust Mode</p>
                <p className="text-[11px] text-slate-400">Enforce strict token verification across endpoints.</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold">
                Active & Enforced
              </span>
            </div>
          </div>

          {/* Telemetry API Keys */}
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
              <Key className="w-4 h-4 text-indigo-400" /> Telemetry Ingestion API Key
            </h2>
            <p className="text-[11px] text-slate-400">
              Use this key to authenticate microservice log ingestion into TraceGuard.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value={apiKey}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Key'}
              </button>
            </div>
          </div>

          {/* Alert Routing Preferences */}
          <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-slate-200">
              <Bell className="w-4 h-4 text-indigo-400" /> Security Alert Routing
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <div>
                  <p className="text-slate-200 font-medium">Critical Security Alerts</p>
                  <p className="text-[11px] text-slate-400">Send immediate notifications when threats are detected.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailCritical}
                  onChange={(e) => setNotifications({ ...notifications, emailCritical: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-0 cursor-pointer accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer pt-2 border-t border-slate-800/60">
                <div>
                  <p className="text-slate-200 font-medium">Weekly Telemetry Digest</p>
                  <p className="text-[11px] text-slate-400">Receive summary reports on trace health every Monday.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailWeekly}
                  onChange={(e) => setNotifications({ ...notifications, emailWeekly: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-0 cursor-pointer accent-indigo-600"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}