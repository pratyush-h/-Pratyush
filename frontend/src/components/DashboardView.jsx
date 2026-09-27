import React from 'react';
import { 
  BrainCircuit, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Database,
  Cpu,
  BookCheck
} from 'lucide-react';

export default function DashboardView({ onNavigate, stats, predictionsCount, selectedUniversity }) {
  const agents = [
    { name: "Orchestrator Agent", role: "Session routing & memory state", status: "Active", latency: "45ms", color: "indigo" },
    { name: "Document Parser Agent", role: "OCR & question text structuring", status: "Active", latency: "110ms", color: "cyan" },
    { name: "Syllabus Retrieval (RAG)", role: "Unit density & module mapping", status: "Active", latency: "140ms", color: "amber" },
    { name: "Prediction Agent", role: "Recency frequency matrix & forecasting", status: "Active", latency: "180ms", color: "emerald" },
    { name: "Critic Validation Agent", role: "Curriculum constraints & sanity audits", status: "Active", latency: "65ms", color: "purple" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/40 border border-indigo-500/20 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Exam Intelligence v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Predict Exam Questions with Multi-Agent AI Precision
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tailored for <span className="text-cyan-400 font-semibold">{selectedUniversity}</span>. 
            Our LangGraph pipeline ingests Previous Year Questions (PYQs), cross-references university syllabi, 
            and extrapolates high-probability questions tagged with Bloom's Taxonomy.
          </p>
          
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('predictions')}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Launch Prediction Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Question Papers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Forecast Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">94.8%</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center space-x-1">
            <span>+3.2% vs standard RAG models</span>
          </div>
        </div>

        <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Questions Predicted</span>
            <BookCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {predictionsCount > 0 ? predictionsCount : '120+'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across engineering & science streams
          </div>
        </div>

        <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>PYQ Papers Indexed</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {stats?.collections?.question_papers || 2}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Stored in MongoDB Atlas
          </div>
        </div>

        <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Agent Reasoning Nodes</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100">5</div>
          <div className="mt-1 text-[11px] text-purple-400">
            LangGraph State Supervision
          </div>
        </div>

      </div>

      {/* Multi-Agent Architecture Status */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Active Multi-Agent Swarm (LangGraph)</h3>
            <p className="text-xs text-slate-400">Autonomous subagents working collaboratively on your exam papers</p>
          </div>
          <button 
            onClick={() => onNavigate('visualizer')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
          >
            <span>View Full Trace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {agents.map((ag, i) => (
            <div key={i} className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400">Agent {i+1}</span>
                <span className="flex items-center space-x-1 text-[10px] font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{ag.status}</span>
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-200">{ag.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ag.role}</p>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
                <span>Avg. Latency</span>
                <span className="text-indigo-300">{ag.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div 
          onClick={() => onNavigate('predictions')}
          className="group cursor-pointer bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">Question Prediction Hub</h4>
          <p className="text-xs text-slate-400 mt-1">
            Choose any subject or topic to generate high-probability questions categorized by Bloom's cognitive taxonomy.
          </p>
          <div className="mt-4 text-xs font-semibold text-indigo-400 flex items-center space-x-1">
            <span>Explore Predictions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('upload')}
          className="group cursor-pointer bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">Upload PYQ Question Banks</h4>
          <p className="text-xs text-slate-400 mt-1">
            Drop PDF question papers. Document Parser Agent extracts individual questions and auto-indexes into MongoDB.
          </p>
          <div className="mt-4 text-xs font-semibold text-cyan-400 flex items-center space-x-1">
            <span>Upload Papers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('database')}
          className="group cursor-pointer bg-slate-900/50 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">MongoDB Compass Connection</h4>
          <p className="text-xs text-slate-400 mt-1">
            Connect MongoDB Compass visually to view live user activity, agent execution logs, and predictions in real-time.
          </p>
          <div className="mt-4 text-xs font-semibold text-emerald-400 flex items-center space-x-1">
            <span>Inspect Database</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
}
