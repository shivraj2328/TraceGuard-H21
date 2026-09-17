import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Server, 
  AlertTriangle,
  FileCode
} from 'lucide-react';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const metrics = [
    { title: 'Total Traces Analyzed', value: '1,284,920', change: '+12.4%', status: 'up', icon: Activity },
    { title: 'Active Threat Alerts', value: '3 Critical', change: '-2 today', status: 'down', icon: ShieldAlert, alert: true },
    { title: 'System Health Score', value: '99.98%', change: 'Nominal', status: 'neutral', icon: CheckCircle2 },
    { title: 'Monitored Endpoints', value: '42 / 42', change: '100% Online', status: 'up', icon: Server },
  ];

  const recentTraces = [
    { id: 'tr_98231', service: 'auth-service', event: 'JWT Signature Validation', status: 'SUCCESS', time: '2s ago', latency: '12ms' },
    { id: 'tr_98232', service: 'payment-gateway', event: 'Unusual Payload Size (SQLi Attempt)', status: 'BLOCKED', time: '14s ago', latency: '4ms' },
    { id: 'tr_98233', service: 'user-service', event: 'Database Connection Pool Sync', status: 'SUCCESS', time: '1m ago', latency: '28ms' },
    { id: 'tr_98234', service: 'api-gateway', event: 'Rate Limit Threshold Exceeded', status: 'FLAGGED', time: '3m ago', latency: '8ms' },
  ];

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Security & Traceability Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry monitored for account <span className="text-indigo-400 font-mono">{user?.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Live Stream Active</span>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{m.title}</span>
                <div className={`p-2 rounded-lg ${m.alert ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800/80'}`}>
                  <Icon className={`w-4 h-4 ${m.alert ? 'text-red-400' : 'text-indigo-400'}`} />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-100 font-mono">{m.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[11px] font-medium ${m.alert ? 'text-red-400' : 'text-emerald-400'}`}>
                    {m.change}
                  </span>
                  <span className="text-[10px] text-slate-500">vs last hour</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity & Threat Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trace Logs Stream */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-100">Live Trace Log Activity</h2>
            </div>
            <button 
              onClick={() => navigate('/trace-logs')}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTraces.map((trace) => (
              <div 
                key={trace.id} 
                className="p-3 bg-slate-950/60 border border-slate-800/70 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-medium">{trace.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-semibold">{trace.service}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{trace.event}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-slate-500">{trace.latency}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    trace.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    trace.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {trace.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Security Alerts Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-100">Security Advisory</h2>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs font-semibold text-red-300">Rate Limit Spike Detected</p>
                <p className="text-[11px] text-red-400/80 mt-1">
                  IP 192.168.1.102 triggered 450 requests/sec on endpoint <code className="font-mono">/api/v1/auth</code>.
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs font-semibold text-amber-300">Unused Token Expiry</p>
                <p className="text-[11px] text-amber-400/80 mt-1">
                  12 service tokens have exceeded their maximum TTL without revocation.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/security-alerts')}
            className="w-full mt-4 py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Run Security Audit
          </button>
        </div>
      </div>
    </div>
  );
}