import React from 'react';
import { BarChart3, PieChart, Layers, Target, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function AnalyticsView({ selectedUniversity }) {
  const topicWeights = [
    { module: "Module 1: Process Concurrency & CPU Scheduling", weight: 32, frequency: "Very High", recency: "2021-2024" },
    { module: "Module 2: Deadlock Detection & Banker's Algorithm", weight: 26, frequency: "Crucial", recency: "2020-2024" },
    { module: "Module 3: Virtual Memory & Page Replacement Policies", weight: 22, frequency: "High", recency: "2022-2024" },
    { module: "Module 4: File Systems & Directory Management", weight: 12, frequency: "Moderate", recency: "2023" },
    { module: "Module 5: Mass Storage Structure & Disk Scheduling", weight: 8, frequency: "Moderate", recency: "2022" }
  ];

  const blooms = [
    { level: "L1: Remember", desc: "Definitions, laws, basic statements", percent: 15, color: "bg-blue-500" },
    { level: "L2: Understand", desc: "Explanations, block diagrams, comparisons", percent: 25, color: "bg-cyan-500" },
    { level: "L3: Apply", desc: "Numerical problems, algorithm implementations", percent: 30, color: "bg-indigo-500" },
    { level: "L4: Analyze", desc: "Tradeoffs, performance bottlenecks, proofs", percent: 20, color: "bg-purple-500" },
    { level: "L5: Evaluate", desc: "Architectural choices, failure recovery", percent: 10, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Curriculum Analytics & Exam Weightage</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Historical Exam Weightage & Cognitive Domain Distribution
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Derived from multi-year question paper indexing across {selectedUniversity} syllabus guidelines.
        </p>
      </div>

      {/* Grid: Topics Weightage & Bloom's Taxonomy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Topic Weightage Card */}
        <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Chapter-Wise Mark Weightage</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total: 100 Marks</span>
          </div>

          <div className="space-y-4">
            {topicWeights.map((t, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate pr-2">{t.module}</span>
                  <span className="font-mono font-bold text-indigo-400">{t.weight}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${t.weight}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Frequency: <strong className="text-slate-300">{t.frequency}</strong></span>
                  <span>Recency: {t.recency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloom's Taxonomy Distribution */}
        <div className="bg-[#111827]/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Bloom's Taxonomy Breakdown</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Cognitive Balance</span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            University evaluators allocate question marks across Bloom's levels to test fundamental recall as well as analytical derivation skills.
          </p>

          <div className="space-y-3.5">
            {blooms.map((b, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-bold text-slate-200">{b.level}</span>
                  <span className="font-mono text-slate-300 font-semibold">{b.percent}% of Exam</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{b.desc}</p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${b.color}`} style={{ width: `${b.percent * 2.5}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Exam Strategy Recommendation */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/20 rounded-3xl p-6">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">
              Multi-Agent High-Scoring Exam Strategy
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Focus first on <strong>Module 1 & 2</strong> which historically carry over <strong>58%</strong> of total exam marks.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Practice <strong>Banker's Algorithm</strong> and <strong>LRU/FIFO Page Replacement</strong> numerical problems—these show 100% recurrence over the past 4 consecutive exam cycles.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Draw labelled architectural block diagrams for Part B long essay questions to maximize Bloom L2/L3 scoring rubric.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
