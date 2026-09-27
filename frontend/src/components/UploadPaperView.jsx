import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, School, Calendar, BookOpen, Layers } from 'lucide-react';

export default function UploadPaperView({ selectedUniversity }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('Operating Systems & Concurrency');
  const [university, setUniversity] = useState(selectedUniversity);
  const [year, setYear] = useState(2024);
  const [semester, setSemester] = useState('Semester 5');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [parsedResult, setParsedResult] = useState(null);
  const [existingPapers, setExistingPapers] = useState([]);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch('/api/papers');
      const data = await res.json();
      if (data.papers) setExistingPapers(data.papers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a question paper PDF or TXT file.");
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setParsedResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("university", university);
    formData.append("year", year);
    formData.append("semester", semester);

    try {
      const token = localStorage.getItem('student_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/papers/upload', {
        method: 'POST',
        headers,
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', message: data.message });
        setParsedResult(data.data);
        fetchPapers();
      } else {
        setUploadStatus({ type: 'error', message: data.detail || 'Upload failed' });
      }
    } catch (err) {
      setUploadStatus({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Upload Box */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="max-w-xl mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 text-xs font-semibold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Document Parser Agent (OCR Ready)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Upload Previous Year Question Papers (PYQs)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload question paper PDFs. The Document Parser agent sanitizes headers, extracts individual questions, and indexes them into MongoDB for RAG retrieval.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          
          {/* Dropzone */}
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-900/40">
            <input
              type="file"
              id="paper-file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="paper-file" className="cursor-pointer flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-200">
                {file ? file.name : "Click to browse or drop Question Paper PDF"}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Supports PDF, TXT up to 25MB • Automated question boundary detection
              </span>
            </label>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">University / Board</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Exam Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Semester / Term</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Feedback */}
          {uploadStatus && (
            <div className={`p-3 rounded-xl flex items-center space-x-2 text-xs ${
              uploadStatus.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {uploadStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Document Parser Extracting...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Parse & Index Paper</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Extracted Questions Preview */}
      {parsedResult && parsedResult.parsed_questions && (
        <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Extracted Questions ({parsedResult.parsed_questions.length})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">{parsedResult.filename}</span>
          </div>

          <div className="space-y-2">
            {parsedResult.parsed_questions.map((q, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-start space-x-3 text-xs">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="text-slate-200">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Indexed Question Papers Bank */}
      <div className="bg-[#111827]/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Indexed University Papers in MongoDB</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {existingPapers.map((p, idx) => (
            <div key={p.id || idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{p.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.university} • {p.semester} ({p.year})</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {p.parsed_questions?.length || 4} Questions
                </span>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 space-y-1">
                {p.parsed_questions?.slice(0, 2).map((q, qIdx) => (
                  <div key={qIdx} className="truncate">
                    • {typeof q === 'string' ? q : q.question_text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
