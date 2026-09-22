import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  PhoneCall, 
  Map, 
  Bot, 
  Navigation, 
  Heart,
  Siren
} from 'lucide-react';
import type { CycloneTelemetry } from './types/cyclone';
import { evaluateCycloneRisk, HISTORICAL_PRESETS, fetchLiveOdishaCoastWeather } from './services/cycloneAiEngine';
import { CycloneDashboard } from './components/CycloneDashboard';
import { HelplineDirectory } from './components/HelplineDirectory';
import { PersonalEmergencyContacts } from './components/PersonalEmergencyContacts';
import { InteractiveCycloneMap } from './components/InteractiveCycloneMap';
import { KalingaCycloneAiChat } from './components/KalingaCycloneAiChat';
import { EmergencySosModal } from './components/EmergencySosModal';

type ActiveTab = 'dashboard' | 'helplines' | 'personal_contacts' | 'map' | 'ai_assistant';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [telemetry, setTelemetry] = useState<CycloneTelemetry>(HISTORICAL_PRESETS[0]);
  const [currentDistrict, setCurrentDistrict] = useState('Puri');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // Load personal contacts count for badge
  const [personalContactsCount, setPersonalContactsCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('odisha_cyclone_personal_contacts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPersonalContactsCount(parsed.length);
      } catch (e) { console.error(e); }
    }
  }, [activeTab]);

  const riskAssessment = evaluateCycloneRisk(telemetry);

  const handleFetchLiveWeather = async () => {
    const live = await fetchLiveOdishaCoastWeather();
    setTelemetry({
      ...telemetry,
      systemName: 'Live Coastal Stream (Paradip / Puri)',
      centralPressureHpa: live.pressure,
      maxWindSpeedKmph: live.windSpeed,
      estimatedLandfallTime: 'Live Weather Monitoring Active',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Banner Alert Bar */}
      {riskAssessment.level === 'RED' && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-lg animate-pulse">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <Siren className="w-4 h-4 shrink-0" />
            <span>
              🔴 RED ALERT ACTIVE: {riskAssessment.category.toUpperCase()} THREAT TO ODISHA COAST. ODRAF & NDRF TEAMS ON HIGH STANDBY.
            </span>
          </div>
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="px-3 py-1 bg-black/40 hover:bg-black/60 rounded-full text-[11px] font-extrabold uppercase border border-white/30"
          >
            1-TAP SOS
          </button>
        </div>
      )}

      {/* Main Navbar Header */}
      <header className="sticky top-0 z-[1000] bg-slate-900/90 border-b border-slate-800 backdrop-blur-md shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-rose-600 p-0.5 shadow-lg shadow-cyan-900/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  ODISHA CYCLONE AI
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    v2.5 LIVE
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Disaster Response • ODRAF / NDRF Helplines • Emergency Contact Hub
              </p>
            </div>
          </div>

          {/* District Selector & Quick SOS */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">District:</span>
              <select
                value={currentDistrict}
                onChange={(e) => setCurrentDistrict(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Puri" className="bg-slate-900">Puri District</option>
                <option value="Jagatsinghpur" className="bg-slate-900">Jagatsinghpur (Paradip)</option>
                <option value="Kendrapara" className="bg-slate-900">Kendrapara</option>
                <option value="Bhadrak" className="bg-slate-900">Bhadrak (Dhamra)</option>
                <option value="Balasore" className="bg-slate-900">Balasore (Chandipur)</option>
                <option value="Ganjam" className="bg-slate-900">Ganjam (Gopalpur)</option>
                <option value="Khordha" className="bg-slate-900">Khordha (Bhubaneswar)</option>
              </select>
            </div>

            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/40 transition-all transform hover:scale-105"
            >
              <Siren className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">1-TAP EMERGENCY SOS</span>
              <span className="sm:hidden">SOS</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-800/60 pt-2 pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>AI Cyclone Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('helplines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'helplines'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Helplines (ODRAF / NDRF / 112)</span>
          </button>

          <button
            onClick={() => setActiveTab('personal_contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'personal_contacts'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-400" />
            <span>Personal Emergency Contacts</span>
            {personalContactsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-black">
                {personalContactsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'map'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-lg shadow-indigo-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Coastal Radar Map & Shelters</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_assistant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ai_assistant'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Kalinga AI Assistant (Odia)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'dashboard' && (
          <CycloneDashboard
            telemetry={telemetry}
            riskAssessment={riskAssessment}
            onSelectPreset={(p) => setTelemetry(p)}
            onFetchLiveWeather={handleFetchLiveWeather}
          />
        )}

        {activeTab === 'helplines' && <HelplineDirectory />}

        {activeTab === 'personal_contacts' && (
          <PersonalEmergencyContacts
            currentDistrict={currentDistrict}
            cycloneRiskLevel={riskAssessment.level}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveCycloneMap
            telemetry={telemetry}
            onSelectShelter={(shelter) => {
              alert(`Selected Shelter: ${shelter.name}\nDistrict: ${shelter.district}\nHelpline: ${shelter.contactPhone}`);
            }}
          />
        )}

        {activeTab === 'ai_assistant' && <KalingaCycloneAiChat />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 mt-12 text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">
          Odisha Cyclone AI & Emergency Response Hub • Powered by OSDMA, IMD & Emergency Helplines Data
        </p>
        <p className="text-[11px] text-slate-500">
          For immediate life-threatening emergencies, always dial <strong className="text-white">112</strong> or call ODRAF Control Room at <strong className="text-white">1070 / 0674-2534177</strong>.
        </p>
      </footer>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        personalContacts={JSON.parse(localStorage.getItem('odisha_cyclone_personal_contacts') || '[]')}
        currentDistrict={currentDistrict}
        cycloneRiskLevel={riskAssessment.level}
      />
    </div>
  );
};

export default App;
