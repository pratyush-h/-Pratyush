import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  UploadCloud, 
  Activity, 
  BarChart3, 
  Database,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'predictions', label: 'Question Predictor', icon: BrainCircuit, badge: 'AI Engine' },
    { id: 'upload', label: 'Upload PYQ Papers', icon: UploadCloud },
    { id: 'visualizer', label: 'Multi-Agent Trace', icon: Activity },
    { id: 'analytics', label: 'Weightage & Trends', icon: BarChart3 },
    { id: 'database', label: 'MongoDB & Compass', icon: Database, badge: 'Live DB' },
  ];

  return (
    <aside className="w-64 bg-[#0d121f]/95 border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        <nav className="space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Major Project Mode</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Autonomous multi-agent system predicting university exam patterns with Bloom's taxonomy & statistical recency.
        </p>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>v1.0.0 Free Edition</span>
          <span className="text-emerald-400">● 5 Agents Active</span>
        </div>
      </div>
    </aside>
  );
}
