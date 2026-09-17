import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Server, 
  Settings, 
  Lock 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'traces', label: 'Trace Logs', icon: Activity },
    { id: 'alerts', label: 'Security Alerts', icon: ShieldAlert, badge: '3' },
    { id: 'services', label: 'Monitored Services', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-1">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Platform Navigation
        </p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded font-semibold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">Zero-Trust Mode</p>
            <p className="text-[10px] text-emerald-400 font-mono">Enforced & Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}