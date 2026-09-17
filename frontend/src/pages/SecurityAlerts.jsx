import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const INITIAL_ALERTS = [
  {
    id: 'ALT-8091',
    title: 'Rate Limit Spike Detected',
    category: 'DDoS / Abusive Traffic',
    severity: 'Critical',
    endpoint: '/api/v1/auth/login',
    ip: '192.168.1.102',
    timestamp: '2 mins ago',
    details: 'Client triggered 450 req/sec violating the default rate threshold (100 req/min). Automated rate-limiting applied.',
    status: 'Active',
    traceId: 'tr_98234'
  },
  {
    id: 'ALT-8089',
    title: 'SQL Injection Attack Vector',
    category: 'Payload Security',
    severity: 'Critical',
    endpoint: '/api/v1/checkout',
    ip: '185.220.101.5',
    timestamp: '14 mins ago',
    details: "Unusual payload size detected containing malicious SQL syntax patterns (' OR '1'='1). Vector intercepted and dropped.",
    status: 'Active',
    traceId: 'tr_98232'
  },
  {
    id: 'ALT-8072',
    title: 'Unused Token Expiry Violation',
    category: 'Identity & Access',
    severity: 'Warning',
    endpoint: '/api/v1/user/keys',
    ip: '10.0.4.12',
    timestamp: '45 mins ago',
    details: '12 service tokens have exceeded their maximum TTL (30 days) without revocation or automatic rotation.',
    status: 'Active',
    traceId: 'tr_98210'
  },
  {
    id: 'ALT-8055',
    title: 'Cross-Site Scripting (XSS) Pattern',
    category: 'Payload Security',
    severity: 'Warning',
    endpoint: '/api/v1/profile/update',
    ip: '103.21.244.18',
    timestamp: '2 hours ago',
    details: 'Escaped HTML tags found inside unsanitized JSON payload input field [bio]. Payload stripped successfully.',
    status: 'Resolved',
    traceId: 'tr_98188'
  },
  {
    id: 'ALT-8041',
    title: 'JWT Invalid Signature Signature Breach',
    category: 'Authentication',
    severity: 'Critical',
    endpoint: '/api/v1/admin/config',
    ip: '45.33.32.156',
    timestamp: '5 hours ago',
    details: 'Tampered Bearer token header detected with mismatched HMAC signature. Connection terminated immediately.',
    status: 'Resolved',
    traceId: 'tr_98150'
  }
];

export default function SecurityAlerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState(INITIAL_ALERTS[0]);

  const handleResolve = (id) => {
    setAlerts(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'Resolved' } : item))
    );
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => ({ ...prev, status: 'Resolved' }));
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.ip.includes(searchTerm) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Security & Threat Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time security advisories, payload inspection flags, and threat containment logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-red-400">{criticalCount} Critical Active</span>
          </div>
          <div className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-semibold text-indigo-300">{activeCount} Total Unresolved</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by IP, endpoint, threat type, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Unresolved</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alerts List (8 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center bg-[#0b0f19] border border-slate-800 rounded-2xl text-slate-500 text-xs">
              No security advisories match your current filter criteria.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              const isCritical = alert.severity === 'Critical';
              const isResolved = alert.status === 'Resolved';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 bg-[#0b0f19] border rounded-2xl transition-all cursor-pointer flex flex-col gap-3 relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/30'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Indicator bar on left */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isResolved
                        ? 'bg-emerald-500'
                        : isCritical
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3 pl-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-indigo-400 font-semibold">{alert.id}</span>
                      <h3 className="text-xs font-bold text-slate-100">{alert.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isCritical
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isResolved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 pl-2 leading-relaxed">
                    {alert.details}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/60 pl-2">
                    <span className="truncate max-w-[200px]">Endpoint: <span className="text-slate-300">{alert.endpoint}</span></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Alert Details Panel (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedAlert ? (
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 sticky top-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Threat Inspector</span>
                  <h2 className="text-sm font-bold text-slate-100 mt-0.5">{selectedAlert.title}</h2>
                </div>
                <span className="text-xs font-mono text-slate-500">{selectedAlert.id}</span>
              </div>

              {/* Status Banner */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                selectedAlert.status === 'Resolved'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : selectedAlert.severity === 'Critical'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                <div className="flex items-center gap-2 text-xs font-medium">
                  {selectedAlert.status === 'Resolved' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>Status: {selectedAlert.status}</span>
                </div>
                {selectedAlert.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolve(selectedAlert.id)}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              {/* Metadata Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Target Endpoint</span>
                  <span className="font-mono text-slate-200">{selectedAlert.endpoint}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Origin IP Address</span>
                  <span className="font-mono text-indigo-400">{selectedAlert.ip}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Threat Category</span>
                  <span className="text-slate-200">{selectedAlert.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Associated Trace</span>
                  <span className="font-mono text-indigo-400 flex items-center gap-1">
                    {selectedAlert.traceId}
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Incident Analysis
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 leading-relaxed">
                  {selectedAlert.details}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => alert(`IP ${selectedAlert.ip} added to Zero-Trust Firewall blocklist.`)}
                  className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Block IP Address
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-[#0b0f19] border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Select an alert to inspect full security telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}