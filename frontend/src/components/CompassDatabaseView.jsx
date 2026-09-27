import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Terminal, 
  Server, 
  Table, 
  Users, 
  Layers, 
  Activity,
  FileCheck
} from 'lucide-react';

export default function CompassDatabaseView({ stats, onRefreshStats }) {
  const [copied, setCopied] = useState(false);
  const [activeCollectionTab, setActiveCollectionTab] = useState('agent_logs');
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const connectionUri = stats?.connection_uri || "mongodb://localhost:27017/student_db";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(connectionUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (data.logs) setRecentLogs(data.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const collections = [
    { name: "users", label: "Student Accounts & Auth", count: stats?.collections?.users || 1, icon: Users, desc: "Records student registration, emails, universities, hashed credentials, and login sessions." },
    { name: "question_papers", label: "Uploaded PYQs & Banks", count: stats?.collections?.question_papers || 2, icon: Layers, desc: "Raw OCR text, structured parsed questions, exam years, and subject tags." },
    { name: "predictions", label: "Prediction Forecasts", count: stats?.collections?.predictions || 5, icon: FileCheck, desc: "Predicted questions, confidence probabilities, and cognitive taxonomy outputs." },
    { name: "agent_logs", label: "Multi-Agent System Logs", count: stats?.collections?.agent_logs || 8, icon: Activity, desc: "Full execution telemetry, agent latency, step reasoning traces, and audit logs used for system training." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* MongoDB Compass Connection Hero */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB Atlas & Compass Integration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              MongoDB Database Inspector & Compass Bridge
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              All student activity, parsed question papers, and multi-agent reasoning steps are logged in real-time. 
              Open MongoDB Compass to view and explore live collections visually on your desktop.
            </p>
          </div>

          <button
            onClick={onRefreshStats}
            className="self-start lg:self-auto flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Live Counts</span>
          </button>
        </div>

        {/* Connection String Bar */}
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 overflow-hidden">
            <Server className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">MongoDB Connection URI</span>
              <span className="font-mono text-xs text-slate-200 truncate block">
                {connectionUri}
              </span>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="shrink-0 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied URI!' : 'Copy for Compass'}</span>
          </button>
        </div>
      </div>

      {/* 3-Step Compass Connect Guide */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-slate-200 mb-4">
          How to Connect via MongoDB Compass Desktop Application
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-200">Open MongoDB Compass</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Launch MongoDB Compass on your PC or download it free from mongodb.com.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-200">Paste Connection URI</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Click 'New Connection', paste the URI from above (Atlas or localhost), and hit <strong>Connect</strong>.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-200">Inspect & Train Database</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Open database <code>student_db</code> to inspect live collections: <code>users</code>, <code>agent_logs</code>, and <code>question_papers</code>.
            </p>
          </div>

        </div>
      </div>

      {/* Collections Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-base font-bold text-white">
                    {c.count} docs
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{c.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{c.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                ● Live MongoDB Collection
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Agent Audit Logs Table (For System Training & Auditing) */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Multi-Agent System Execution Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-400">Captured telemetry used for reinforcement feedback and agent refinement</p>
          </div>
          <button
            onClick={fetchLogs}
            disabled={loadingLogs}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User Email</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Agents Invoked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {recentLogs.length > 0 ? (
                recentLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 text-slate-300">
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-3 text-slate-200 truncate max-w-[150px]">
                      {log.user_email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.subject || "Operating Systems"}</td>
                    <td className="py-3 px-3 text-emerald-400">{log.execution_time_ms || 240}ms</td>
                    <td className="py-3 px-3 text-slate-400">5 nodes</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-500">
                    No log records yet. Run a prediction to see live telemetry stored in MongoDB.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
