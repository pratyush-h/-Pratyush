import React, { useState } from 'react';
import { 
  Wind, 
  Gauge, 
  Thermometer, 
  Waves, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  RefreshCw, 
  Radio
} from 'lucide-react';
import type { CycloneTelemetry, RiskAssessment } from '../types/cyclone';
import { HISTORICAL_PRESETS } from '../services/cycloneAiEngine';

interface Props {
  telemetry: CycloneTelemetry;
  riskAssessment: RiskAssessment;
  onSelectPreset: (preset: CycloneTelemetry) => void;
  onFetchLiveWeather: () => void;
}

export const CycloneDashboard: React.FC<Props> = ({
  telemetry,
  riskAssessment,
  onSelectPreset,
  onFetchLiveWeather,
}) => {
  const [sirenPlaying, setSirenPlaying] = useState(false);

  const toggleSiren = () => {
    setSirenPlaying(!sirenPlaying);
  };

  const getAlertColorClasses = (level: string) => {
    switch (level) {
      case 'RED':
        return {
          bg: 'bg-red-950/80 border-red-500/60 text-red-300',
          badge: 'bg-red-600 text-white animate-pulse',
          gaugeBg: 'from-red-600 to-rose-600',
        };
      case 'ORANGE':
        return {
          bg: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
          badge: 'bg-amber-600 text-white',
          gaugeBg: 'from-amber-600 to-orange-600',
        };
      case 'YELLOW':
        return {
          bg: 'bg-yellow-950/80 border-yellow-500/60 text-yellow-300',
          badge: 'bg-yellow-500 text-black',
          gaugeBg: 'from-yellow-500 to-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
          badge: 'bg-emerald-600 text-white',
          gaugeBg: 'from-emerald-500 to-teal-500',
        };
    }
  };

  const alertStyle = getAlertColorClasses(riskAssessment.level);

  return (
    <div className="space-y-6">
      {/* Risk Alert Header Banner */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md shadow-2xl relative overflow-hidden ${alertStyle.bg}`}>
        {/* Animated Background Pulse */}
        {riskAssessment.level === 'RED' && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border border-white/20 shadow-md ${alertStyle.badge}`}>
                IMD SIGNAL NO. {riskAssessment.imdSignalNumber} • {riskAssessment.level} ALERT
              </span>
              <span className="text-xs font-mono text-slate-300">
                AI Category: <strong className="text-white">{riskAssessment.category}</strong>
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {riskAssessment.summaryTitle}
            </h1>
            <p className="text-sm font-semibold text-amber-300">
              {riskAssessment.summaryTitleOdia}
            </p>
          </div>

          {/* AI Risk Score Meter Gauge */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/10 shrink-0">
            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Cyclone AI Risk Index
              </span>
              <div className="text-4xl font-black text-white mt-0.5">
                {riskAssessment.riskScorePct}<span className="text-xl text-rose-400">%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">Bay of Bengal Threat</span>
            </div>

            <div className="w-2.5 h-16 rounded-full bg-slate-800 p-0.5 relative overflow-hidden flex flex-col justify-end">
              <div
                className={`w-full rounded-full bg-gradient-to-t ${alertStyle.gaugeBg} transition-all duration-700`}
                style={{ height: `${riskAssessment.riskScorePct}%` }}
              ></div>
            </div>

            {/* Emergency Siren Audio Button */}
            <button
              onClick={toggleSiren}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                sirenPlaying
                  ? 'bg-red-600 text-white border-white animate-bounce'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
              title="Toggle Emergency Warning Audio Siren"
            >
              {sirenPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-bold uppercase">{sirenPlaying ? 'SIREN ON' : 'SIREN OFF'}</span>
            </button>
          </div>
        </div>

        {/* Immediate Directives */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3">
          {riskAssessment.immediateDirectives.map((directive, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{directive}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preset Storm Scenarios & Live Fetch Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase">Storm Telemetry Preset:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {HISTORICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                telemetry.id === preset.id
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {preset.systemName.split('(')[0]}
            </button>
          ))}

          <button
            onClick={onFetchLiveWeather}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold whitespace-nowrap hover:bg-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Live Odisha Coast Feed
          </button>
        </div>
      </div>

      {/* Atmospheric Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wind Speed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">MAX WIND SPEED</span>
            <Wind className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {telemetry.maxWindSpeedKmph} <span className="text-sm font-normal text-slate-400">km/h</span>
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-1">
            Gusts up to {telemetry.gustWindSpeedKmph} km/h
          </div>
        </div>

        {/* Central Barometric Pressure */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">CENTRAL PRESSURE</span>
            <Gauge className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {telemetry.centralPressureHpa} <span className="text-sm font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {telemetry.centralPressureHpa < 960 ? 'Extreme Low Pressure Drop' : 'Depression Drop'}
          </div>
        </div>

        {/* Storm Surge Height */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">STORM SURGE HEIGHT</span>
            <Waves className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {telemetry.surgeHeightMeters} <span className="text-sm font-normal text-slate-400">Meters</span>
          </div>
          <div className="text-[11px] text-rose-400 font-mono mt-1">
            Inundation risk along coastal estuaries
          </div>
        </div>

        {/* Sea Surface Temp */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">SEA SURFACE TEMP</span>
            <Thermometer className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {telemetry.seaSurfaceTempC}° <span className="text-sm font-normal text-slate-400">Celsius</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">
            Bay of Bengal Fueling Index: High
          </div>
        </div>
      </div>

      {/* District-by-District Risk Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Coastal District Vulnerability Breakdown</h3>
            <p className="text-xs text-slate-400">ODSMA Evacuation Priority & Expected Storm Impacts</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">Landfall Target: {telemetry.forecastLandfallPoint}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3">District</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Dist. to Storm</th>
                <th className="p-3">Expected Wind</th>
                <th className="p-3">Surge Height</th>
                <th className="p-3">Evacuation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {riskAssessment.coastalAlerts.map((alert) => (
                <tr key={alert.district} className="hover:bg-slate-850 transition-colors">
                  <td className="p-3 font-bold text-white">
                    {alert.district} <span className="text-slate-400 font-normal">({alert.districtOdia})</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      alert.riskLevel === 'RED' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      alert.riskLevel === 'ORANGE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}>
                      {alert.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{alert.distanceToStormKm} km</td>
                  <td className="p-3 font-mono font-bold text-cyan-300">{alert.expectedWindSpeedKmph} km/h</td>
                  <td className="p-3 font-mono text-blue-400">{alert.stormSurgeMeters} m</td>
                  <td className="p-3 font-semibold">
                    <span className={alert.evacuationStatus === 'Evacuation Required' ? 'text-red-400 animate-pulse' : 'text-slate-300'}>
                      {alert.evacuationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
