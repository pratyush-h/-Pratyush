import React from 'react';
import { 
  Activity, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ArrowDown, 
  ShieldCheck, 
  FileSearch, 
  Sparkles,
  Terminal
} from 'lucide-react';

export default function AgentVisualizerView({ agentTrace }) {
  const defaultTrace = [
    {
      agent: "Orchestrator Agent",
      status: "completed",
      duration_ms: 45,
      summary: "Validated student session and initialized pipeline state graph for Operating Systems.",
      details: {
        routing: "Directing state to Document Parser Node",
        memory_state: "Persistent session context established",
        framework: "LangGraph StateGraph"
      }
    },
    {
      agent: "Document Parser Agent",
      status: "completed",
      duration_ms: 110,
      summary: "Sanitized OCR artifacts, filtered page headers, and parsed 18 historical question records.",
      details: {
        records_cleaned: 18,
        section_splits: "Part A (Short Answer) / Part B (Long Essay)",
        noise_reduction_ratio: "99.2%"
      }
    },
    {
      agent: "Syllabus & Retrieval Agent (RAG)",
      status: "completed",
      duration_ms: 140,
      summary: "Computed curriculum density matrix across 5 modules; mapped Bloom's Taxonomy cognitive levels.",
      details: {
        top_weight_module: "Process Scheduling & Deadlocks (32%)",
        bloom_distribution: "L3 Apply (30%), L2 Understand (25%), L4 Analyze (20%)",
        vector_index: "MongoDB Atlas Vector Store"
      }
    },
    {
      agent: "Question Analysis & Prediction Agent",
      status: "completed",
      duration_ms: 180,
      summary: "Applied recency frequency formula to forecast 5 high-yield exam questions with solution blueprints.",
      details: {
        generated_count: 5,
        avg_confidence: "93.4%",
        crucial_flagged: 2
      }
    },
    {
      agent: "Critic & Curriculum Validation Agent",
      status: "completed",
      duration_ms: 65,
      summary: "Audited predicted questions against syllabus curriculum boundaries; eliminated out-of-scope variations.",
      details: {
        curriculum_compliance: "100%",
        hallucination_rate: "0.0%",
        ready_for_student: true
      }
    }
  ];

  const traceToRender = agentTrace && agentTrace.length > 0 ? agentTrace : defaultTrace;
  const totalLatency = traceToRender.reduce((acc, step) => acc + (step.duration_ms || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Multi-Agent Live Execution Visualizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              LangGraph Multi-Agent Reasoning Trace
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Observe how each specialized agent processes university question papers in a directed state graph.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex items-center space-x-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Swarm Pipeline</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                Sequential Graph
              </span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Latency</span>
              <span className="text-xs font-bold font-mono text-indigo-300">{totalLatency} ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Agent Steps Flow */}
      <div className="space-y-4">
        {traceToRender.map((step, idx) => (
          <div key={idx} className="relative">
            
            <div className="bg-[#111827]/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-100">{step.agent}</h4>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Completed</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{step.summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg shrink-0">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{step.duration_ms}ms</span>
                </div>

              </div>

              {/* Step Details Payload */}
              {step.details && Object.keys(step.details).length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {Object.entries(step.details).map(([k, v], i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-2 text-[11px]">
                      <span className="text-slate-400 block capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span className="text-indigo-300 font-mono font-medium truncate block">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Connecting down arrow */}
            {idx < traceToRender.length - 1 && (
              <div className="flex justify-center my-1 text-slate-600">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}
