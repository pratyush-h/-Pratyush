import React from 'react';
import { Sparkles, Database, ShieldCheck, User, LogIn, LogOut, Cpu } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAuth, onLogout, systemHealth, selectedUniversity, setSelectedUniversity }) {
  const universities = [
    "JNTU (Jawaharlal Nehru Tech)",
    "Anna University (Chennai)",
    "VTU (Visvesvaraya Tech)",
    "AKTU (Dr. APJ Abdul Kalam Tech)",
    "Mumbai University",
    "Pune University (SPPU)",
    "Delhi Technological University",
    "General / State University"
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d121f]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ExamMatrix AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Multi-Agent
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Autonomous Exam Paper Intelligence & Question Predictor</p>
          </div>
        </div>

        {/* Center: University Selector */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
          <span className="text-slate-400 font-medium">Target Board:</span>
          <select 
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {universities.map(u => (
              <option key={u} value={u} className="bg-slate-900 text-slate-200">{u}</option>
            ))}
          </select>
        </div>

        {/* Right: Live Connection Pill & User Profile */}
        <div className="flex items-center space-x-3">
          {/* MongoDB Connection Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px]">MongoDB Compass Ready</span>
          </div>

          {/* User Button */}
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                {currentUser.full_name?.charAt(0) || "S"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-200 leading-tight">{currentUser.full_name}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{currentUser.university || "Student"}</p>
              </div>
              <button 
                onClick={onLogout}
                title="Log Out"
                className="text-slate-400 hover:text-rose-400 transition-colors p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Student Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
