import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  Globe, 
  ShieldAlert, 
  ArrowUpRight,
  Code2
} from 'lucide-react';

const MOCK_TRACES = [
  {
    id: 'tr_98231',
    service: 'auth-service',
    event: 'JWT Signature Validation',
    status: 'SUCCESS',
    latency: '12ms',
    timestamp: '2026-09-16 18:50:12',
    clientIp: '192.168.1.45',
    httpMethod: 'POST',
    endpoint: '/api/v1/auth/verify',
    headers: { 'User-Agent': 'Mozilla/5.0', 'Authorization': 'Bearer eyJhbGci...' },
    payload: { userId: 'usr_4492', scope: 'read:write', tokenType: 'Bearer' }
  },
  {
    id: 'tr_98232',
    service: 'payment-gateway',
    event: 'Unusual Payload Size (SQLi Attempt)',
    status: 'BLOCKED',
    latency: '4ms',
    timestamp: '2026-09-16 18:50:00',
    clientIp: '10.0.0.88',
    httpMethod: 'POST',
    endpoint: '/api/v1/checkout',
    headers: { 'User-Agent': 'python-requests/2.28.1', 'Content-Type': 'application/json' },
    payload: { cartId: "102' OR 1=1--", amount: 0 }
  },
  {
    id: 'tr_98233',
    service: 'user-service',
    event: 'Database Connection Pool Sync',
    status: 'SUCCESS',
    latency: '28ms',
    timestamp: '2026-09-16 18:49:12',
    clientIp: '127.0.0.1',
    httpMethod: 'GET',
    endpoint: '/health/db',
    headers: { 'User-Agent': 'Internal-Monitor/1.0' },
    payload: { activeConnections: 14, idleConnections: 6, maxPoolSize: 50 }
  },
  {
    id: 'tr_98234',
    service: 'api-gateway',
    event: 'Rate Limit Threshold Exceeded',
    status: 'FLAGGED',
    latency: '8ms',
    timestamp: '2026-09-16 18:47:05',
    clientIp: '192.168.1.102',
    httpMethod: 'GET',
    endpoint: '/api/v1/telemetry',
    headers: { 'User-Agent': 'curl/7.88.1' },
    payload: { rateLimit: 100, actualReqs: 450, windowMs: 60000 }
  },
  {
    id: 'tr_98235',
    service: 'notification-svc',
    event: 'SMS Gateway Timeout',
    status: 'BLOCKED',
    latency: '5000ms',
    timestamp: '2026-09-16 18:42:20',
    clientIp: '10.0.0.12',
    httpMethod: 'POST',
    endpoint: '/api/v1/notify/sms',
    headers: { 'User-Agent': 'Go-http-client/1.1' },
    payload: { recipient: '+15550192', provider: 'Twilio', retryAttempt: 3 }
  }
];

export default function TraceLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [inspectTrace, setInspectTrace] = useState(null);
  const [copied, setCopied] = useState(false);

  // Filter traces by search term and status tab
  const filteredTraces = MOCK_TRACES.filter((trace) => {
    const matchesSearch = 
      trace.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.endpoint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || trace.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCopyJson = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Telemetry & Trace Logs</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect distributed request executions, payload details, and blocked anomaly events.
        </p>
      </div>

      {/* Control Bar: Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Trace ID, service, event, or endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'SUCCESS', 'FLAGGED', 'BLOCKED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                selectedStatus === status
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trace Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Trace ID</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTraces.length > 0 ? (
                filteredTraces.map((trace) => (
                  <tr 
                    key={trace.id} 
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-indigo-400">
                      {trace.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {trace.service}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{trace.event}</div>
                      <div className="text-[10px] font-mono text-slate-500">{trace.endpoint}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {trace.latency}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {trace.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        trace.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        trace.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {trace.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectTrace(trace)}
                        className="px-2.5 py-1 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No traces found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trace Inspector Modal */}
      {inspectTrace && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-100 font-mono">{inspectTrace.id}</h2>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold font-mono ${
                      inspectTrace.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      inspectTrace.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {inspectTrace.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{inspectTrace.event}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectTrace(null)}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Metadata Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Service</span>
                  <p className="font-semibold text-slate-200">{inspectTrace.service}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Latency</span>
                  <p className="font-mono text-slate-200">{inspectTrace.latency}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Client IP</span>
                  <p className="font-mono text-slate-200">{inspectTrace.clientIp}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Method & Path</span>
                  <p className="font-mono text-indigo-400">{inspectTrace.httpMethod} {inspectTrace.endpoint}</p>
                </div>
              </div>

              {/* JSON Payload Viewer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-400" /> Raw Payload & Context
                  </span>
                  <button
                    onClick={() => handleCopyJson(inspectTrace)}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  {JSON.stringify(inspectTrace, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
              <button
                onClick={() => setInspectTrace(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}