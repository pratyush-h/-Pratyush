import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PredictionEngineView from './components/PredictionEngineView';
import UploadPaperView from './components/UploadPaperView';
import AgentVisualizerView from './components/AgentVisualizerView';
import AnalyticsView from './components/AnalyticsView';
import CompassDatabaseView from './components/CompassDatabaseView';
import AuthModal from './components/AuthModal';

import { 
  LayoutDashboard, 
  BrainCircuit, 
  UploadCloud, 
  Activity, 
  BarChart3, 
  Database 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState('JNTU (Jawaharlal Nehru Tech)');
  const [stats, setStats] = useState(null);
  const [agentTrace, setAgentTrace] = useState([]);
  const [predictionsCount, setPredictionsCount] = useState(128);

  useEffect(() => {
    fetchSystemStats();
    checkCurrentUser();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const res = await fetch('/api/database/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.log('Running in local standalone mode:', err);
    }
  };

  const checkCurrentUser = async () => {
    const token = localStorage.getItem('student_token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('student_token');
      }
    } catch (err) {
      // Offline fallback
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    setCurrentUser(null);
  };

  const handleAgentTraceUpdated = (trace) => {
    setAgentTrace(trace);
    setPredictionsCount(prev => prev + 5);
    fetchSystemStats();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        selectedUniversity={selectedUniversity}
        setSelectedUniversity={setSelectedUniversity}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigate={(tab) => setActiveTab(tab)}
              stats={stats}
              predictionsCount={predictionsCount}
              selectedUniversity={selectedUniversity}
            />
          )}

          {activeTab === 'predictions' && (
            <PredictionEngineView 
              selectedUniversity={selectedUniversity}
              onAgentTraceUpdated={handleAgentTraceUpdated}
            />
          )}

          {activeTab === 'upload' && (
            <UploadPaperView 
              selectedUniversity={selectedUniversity}
            />
          )}

          {activeTab === 'visualizer' && (
            <AgentVisualizerView 
              agentTrace={agentTrace}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView 
              selectedUniversity={selectedUniversity}
            />
          )}

          {activeTab === 'database' && (
            <CompassDatabaseView 
              stats={stats}
              onRefreshStats={fetchSystemStats}
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d121f]/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex justify-around items-center">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'predictions', label: 'Predict', icon: BrainCircuit },
          { id: 'upload', label: 'Upload', icon: UploadCloud },
          { id: 'visualizer', label: 'Trace', icon: Activity },
          { id: 'database', label: 'Compass', icon: Database },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          fetchSystemStats();
        }}
      />

    </div>
  );
}
