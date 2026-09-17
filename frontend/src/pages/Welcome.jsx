import React from 'react';
import { useNavigate } from 'react-router-dom';
import TraceGuardLogo from '../components/TraceGuardLogo';
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Telemetry',
      description: 'Stream distributed trace logs with microsecond precision and automatic latency profiling across all microservices.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Trust Verification',
      description: 'Validate payload integrity and JWT sign-offs on every API endpoint before granting system access.'
    },
    {
      icon: Zap,
      title: 'Automated Threat Blocking',
      description: 'Instantly isolate rate limit anomalies, SQL injection vectors, and unauthorized token reuse in real time.'
    }
  ];

  const highlights = [
    'Sub-millisecond trace ingestion',
    'Built-in rate limiting & SQLi filters',
    'Persistent session & role-based access',
    'OpenTelemetry compatible backend'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/40 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <TraceGuardLogo data-aos="zoom-out" size="md" showTagline={true} />

          <button
            data-aos="fade-left"
            onClick={handleGetStarted}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Access Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center text-center justify-center">
        {/* Status Badge */}
        <div data-aos="zoom-out" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          TraceGuard v1.0 Live Monitoring Engine
        </div>

        {/* Hero Title */}
        <h1 data-aos="zoom-out" className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-3xl leading-tight">
          Trace the break.<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"><br />Guard the build.</span>
        </h1>

        <p data-aos="zoom-out" className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          Monitor microservice health, detect injection threats, and inspect HTTP execution flows in a unified real-time dashboard.
        </p>

        {/* Call To Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            data-aos="fade-right"
            onClick={handleGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/25 transition-all cursor-pointer"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            data-aos="fade-left"
            href="#features"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            Explore Architecture
          </a>
        </div>

        {/* Live Terminal Teaser Card */}
        <div data-aos="zoom-out-up" className="mt-14 w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl text-left overflow-hidden">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> traceguard-kernel-daemon
            </span>
          </div>

          <div className="p-5 font-mono text-xs text-slate-300 space-y-2.5 overflow-x-auto">
            <div className="flex items-center gap-3 text-slate-500">
              <span>18:50:12</span>
              <span className="text-emerald-400">[SYS_INIT]</span>
              <span>Zero-Trust validation protocol attached to 42 endpoints</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">18:50:14</span>
              <span className="text-indigo-400">[TRACE_OK]</span>
              <span>tr_98231 POST /api/v1/auth/verify (12ms) - 200 OK</span>
            </div>
            <div className="flex items-center gap-3 bg-red-500/10 -mx-5 px-5 py-1 border-l-2 border-red-500">
              <span className="text-slate-500">18:50:28</span>
              <span className="text-red-400 font-bold">[BLOCKED]</span>
              <span>tr_98232 SQLi injection vector detected on /api/v1/checkout</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between"
                data-aos="flip-down"
                data-aos-delay={idx * 200}
              >
                <div>
                  <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checklist Section */}
        <div data-aos="zoom-out-up" className="mt-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 w-full max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Platform Capabilities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <p>© 2026 TraceGuard Security Inc. All system events monitored under Zero-Trust constraints.</p>
      </footer>
    </div>
  );
}