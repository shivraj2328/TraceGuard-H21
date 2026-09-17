import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  RotateCw,
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const INITIAL_SERVICES = [
  {
    id: 'srv-auth',
    name: 'auth-service',
    status: 'Healthy',
    latency: '12ms',
    uptime: '99.99%',
    throughput: '1.4k req/min',
    errorRate: '0.00%',
    activeEndpoints: 8,
    totalEndpoints: 8,
    environment: 'Production',
    lastPing: '3s ago'
  },
  {
    id: 'srv-payment',
    name: 'payment-gateway',
    status: 'Degraded',
    latency: '142ms',
    uptime: '98.42%',
    throughput: '890 req/min',
    errorRate: '1.25%',
    activeEndpoints: 5,
    totalEndpoints: 6,
    environment: 'Production',
    lastPing: '1s ago'
  },
  {
    id: 'srv-user',
    name: 'user-service',
    status: 'Healthy',
    latency: '28ms',
    uptime: '99.95%',
    throughput: '3.2k req/min',
    errorRate: '0.01%',
    activeEndpoints: 12,
    totalEndpoints: 12,
    environment: 'Production',
    lastPing: '2s ago'
  },
  {
    id: 'srv-gateway',
    name: 'api-gateway',
    status: 'Healthy',
    latency: '8ms',
    uptime: '100.00%',
    throughput: '12.8k req/min',
    errorRate: '0.00%',
    activeEndpoints: 14,
    totalEndpoints: 14,
    environment: 'Production',
    lastPing: '1s ago'
  },
  {
    id: 'srv-telemetry',
    name: 'telemetry-ingest',
    status: 'Healthy',
    latency: '4ms',
    uptime: '99.98%',
    throughput: '45.1k req/min',
    errorRate: '0.00%',
    activeEndpoints: 4,
    totalEndpoints: 4,
    environment: 'Production',
    lastPing: '1s ago'
  }
];

export default function MonitoredServices() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredServices = services.filter(srv =>
    srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    srv.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const healthyCount = services.filter(s => s.status === 'Healthy').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <Server className="w-6 h-6 text-indigo-400" />
            Monitored Services & Microservices
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time latency profiling, endpoint health checks, and active zero-trust proxies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2 bg-[#0b0f19] border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Monitored Microservices</span>
            <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">{services.length} Total</div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">{healthyCount} Healthy</span>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active System Endpoints</span>
            <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">42 / 42</div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">100% Online</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Average Latency</span>
            <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">18.8ms</div>
            <span className="text-[11px] text-indigo-400 font-medium mt-1 inline-block">Sub-millisecond ingress</span>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-4 bg-[#0b0f19] border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Global Error Rate</span>
            <div className="text-xl font-extrabold font-mono text-slate-100 mt-1">0.02%</div>
            <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">Nominal bounds</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Toolbar Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          placeholder="Filter microservices by name or cluster..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => {
          const isHealthy = srv.status === 'Healthy';

          return (
            <div
              key={srv.id}
              className="bg-[#0b0f19] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    <h3 className="text-sm font-bold font-mono text-slate-100">{srv.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      isHealthy
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {srv.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Avg Response</span>
                    <span className="font-mono text-xs font-bold text-slate-200">{srv.latency}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Uptime</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{srv.uptime}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Throughput</span>
                    <span className="font-mono text-xs font-bold text-slate-200">{srv.throughput}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 font-medium block">Active Endpoints</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {srv.activeEndpoints} / {srv.totalEndpoints}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Heartbeat: <span className="text-slate-400">{srv.lastPing}</span></span>
                <span className="flex items-center gap-1 text-indigo-400 hover:underline cursor-pointer">
                  Inspect Logs
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}