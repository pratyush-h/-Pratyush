import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Filter, 
  Star, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  BookOpen,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PredictionEngineView({ selectedUniversity, onAgentTraceUpdated }) {
  const [subject, setSubject] = useState("Operating Systems & Concurrency");
  const [topicsInput, setTopicsInput] = useState("Process Management, Deadlock Avoidance, Memory Paging & Segmentation, File Systems, Virtual Memory");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterProb, setFilterProb] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const presetSubjects = [
    { name: "Operating Systems & Concurrency", topics: "Process Scheduling, Deadlocks & Banker's Algo, Virtual Memory & Paging, Synchronization & Semaphores, Storage & Disk Scheduling" },
    { name: "Database Management Systems", topics: "Relational Algebra, SQL Optimization, Normalization (3NF & BCNF), Transaction ACID & Concurrency Control, Indexing & B+ Trees" },
    { name: "Design & Analysis of Algorithms", topics: "Asymptotic Complexity & Recurrence, Dynamic Programming, Greedy Methods, Graph Algorithms (Dijkstra/Bellman-Ford), NP-Completeness" },
    { name: "Computer Networks & Protocols", topics: "OSI & TCP/IP Layering, Error Detection & Flow Control, IP Addressing & Subnetting, Routing Protocols (OSPF/BGP), TCP Congestion Control" },
    { name: "Artificial Intelligence & ML", topics: "Heuristic Search (A*), Supervised vs Unsupervised Learning, Backpropagation & Neural Networks, Decision Trees, Prompt Engineering & LLMs" },
    { name: "Compiler Design", topics: "Lexical Analysis & DFA, Context-Free Grammars & LL/LR Parsers, Syntax-Directed Translation, Intermediate Code Generation, Code Optimization" }
  ];

  const handlePresetSelect = (preset) => {
    setSubject(preset.name);
    setTopicsInput(preset.topics);
  };

  const runPrediction = async () => {
    setLoading(true);
    const topics = topicsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const token = localStorage.getItem('student_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/agents/predict-questions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          subject,
          syllabus_topics: topics,
          past_questions: [],
          target_university: selectedUniversity,
          exam_type: "University End-Semester Exam"
        })
      });

      const data = await res.json();
      setPredictions(data);
      if (onAgentTraceUpdated && data.agent_trace) {
        onAgentTraceUpdated(data.agent_trace);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // Filtered prediction list
  const filteredQuestions = (predictions?.predictions || []).filter(q => {
    if (filterType !== "All" && q.type !== filterType) return false;
    if (filterProb !== "All" && q.probability !== filterProb) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Agent Prediction Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Exam Paper Prediction Studio
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select or type a subject and topics. The 5 specialized agents will synthesize high-yield exam questions.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {presetSubjects.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(p)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors"
              >
                {p.name.split(' ')[0]}...
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Operating Systems & Concurrency"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Syllabus Units / Chapters (comma separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="Module 1, Module 2, Module 3..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Trigger Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={runPrediction}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Agents Reasoning & Predicting...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>Run Autonomous Multi-Agent Prediction</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Predictions Output Section */}
      {predictions && (
        <div className="space-y-4">
          
          {/* Analysis Summary Card */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 sm:p-5 flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Multi-Agent Synthesis Summary ({predictions.subject})
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {predictions.analysis_summary}
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111827]/60 border border-slate-800 rounded-2xl p-3">
            
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span>Filters:</span>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
              >
                <option value="All">All Question Types</option>
                <option value="Long Essay">Long Essay</option>
                <option value="Short Answer">Short Answer</option>
                <option value="Numerical / Problem">Numerical / Problem</option>
              </select>

              {/* Probability Filter */}
              <select
                value={filterProb}
                onChange={(e) => setFilterProb(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
              >
                <option value="All">All Probabilities</option>
                <option value="Crucial">Crucial (High Recency)</option>
                <option value="High">High Probability</option>
                <option value="Medium">Medium Probability</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export / Print</span>
              </button>
            </div>
          </div>

          {/* Questions Cards List */}
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedId === q.id;
              const isBookmarked = bookmarkedIds.includes(q.id);

              const probColor = 
                q.probability === 'Crucial' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                q.probability === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

              return (
                <div 
                  key={q.id}
                  className="bg-[#111827]/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${probColor}`}>
                          {q.probability} Priority ({Math.round(q.confidence_score * 100)}% Confidence)
                        </span>

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {q.type}
                        </span>

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Bloom: {q.bloom_taxonomy}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono">
                          Topic: {q.topic}
                        </span>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                        {q.question}
                      </h3>

                      {/* Key Concepts */}
                      {q.key_concepts?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {q.key_concepts.map((c, i) => (
                            <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                              #{c}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Right actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isBookmarked 
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400'
                        }`}
                        title={isBookmarked ? "Bookmarked" : "Bookmark Question"}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Solution' : 'Model Blueprint'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>

                  {/* Expandable Model Solution Blueprint */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-900/60 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span>AI Model Answer Blueprint & Key Scoring Points</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                        {q.model_solution_outline}
                      </div>
                      <div className="mt-3 text-[10px] text-emerald-400/90 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified syllabus compliant by Critic Agent</span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
