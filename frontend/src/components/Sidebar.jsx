import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Activity,
  ShieldAlert,
  Server,
  Settings,
  Lock
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutGrid },
    { path: '/trace-logs', label: 'Trace Logs', icon: Activity },
    { path: '/security-alerts', label: 'Security Alerts', icon: ShieldAlert, badge: 3 },
    { path: '/monitored-services', label: 'Monitored Services', icon: Server },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080b12] border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 select-none h-screen sticky top-0">
      <div className="space-y-6">
        <div className="px-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
            Platform Navigation
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#121828] text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold rounded-md">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Security Status */}
      <div className="p-3 bg-[#0d1322] border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-200">Zero-Trust Mode</div>
          <div className="text-[10px] font-semibold text-emerald-400">Enforced & Active</div>
        </div>
      </div>
    </aside>
  );
}