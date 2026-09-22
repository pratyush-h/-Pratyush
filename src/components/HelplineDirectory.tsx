import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Search, 
  RadioTower, 
  Anchor, 
  Flame, 
  Ambulance, 
  Ship, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  PhoneForwarded,
  Siren
} from 'lucide-react';
import { OFFICIAL_HELPLINES } from '../data/helplines';
import type { HelplineCategory } from '../types/cyclone';

export const HelplineDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelplineCategory | 'all'>('all');

  const filteredHelplines = OFFICIAL_HELPLINES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameOdia && item.nameOdia.includes(searchQuery)) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.district && item.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.primaryPhone.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: HelplineCategory) => {
    switch (category) {
      case 'rescue':
        return { label: 'Rescue & Relief', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'national':
        return { label: 'National Force', bg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
      case 'state':
        return { label: 'State HQ / SEOC', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'medical':
        return { label: 'Medical Emergency', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'coastal':
        return { label: 'Coast Guard / Sea', bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'district':
        return { label: 'District Room', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default:
        return { label: 'Helpline', bg: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'Anchor': return <Anchor className="w-5 h-5 text-indigo-400" />;
      case 'RadioTower': return <RadioTower className="w-5 h-5 text-amber-400" />;
      case 'PhoneCall': return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      case 'Ship': return <Ship className="w-5 h-5 text-cyan-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5 text-emerald-400" />;
      case 'Siren': return <Siren className="w-5 h-5 text-red-400" />;
      default: return <MapPin className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Speed Dials */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/50 border border-red-500/30 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                24x7 DISASTER HELPLINES
              </span>
              <span className="text-xs text-slate-400 font-mono">ODISHA STATE SEOC & ODRAF</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Official Disaster Response Helplines</h2>
            <p className="text-slate-300 text-sm mt-0.5">
              ଓଡ଼ିଶା ଆପାତକାଳୀନ ହେଲ୍ପଲାଇନ୍ ନମ୍ବର - Direct 1-Tap Speed Dial to ODRAF, NDRF, SEOC & District Control Rooms
            </p>
          </div>

          {/* Rapid Direct Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <a
              href="tel:1070"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/40 transition-all transform hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call ODRAF / SEOC (1070)</span>
            </a>
            <a
              href="tel:112"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-900/40 transition-all transform hover:scale-105"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>Call Emergency (112)</span>
            </a>
            <a
              href="tel:1078"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/40 transition-all transform hover:scale-105"
            >
              <Anchor className="w-4 h-4" />
              <span>Call NDRF (1078)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by agency (ODRAF, NDRF, Puri, Paradip), phone or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            All Helplines ({OFFICIAL_HELPLINES.length})
          </button>
          <button
            onClick={() => setSelectedCategory('rescue')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'rescue'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            ODRAF & Fire
          </button>
          <button
            onClick={() => setSelectedCategory('national')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'national'
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            NDRF Force
          </button>
          <button
            onClick={() => setSelectedCategory('district')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'district'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Coastal Districts
          </button>
          <button
            onClick={() => setSelectedCategory('coastal')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedCategory === 'coastal'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Coast Guard / Sea
          </button>
        </div>
      </div>

      {/* Grid of Helpline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHelplines.map((item) => {
          const badge = getCategoryBadge(item.category);
          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 shadow-lg relative overflow-hidden"
            >
              {/* Top Accent line if Priority 1 */}
              {item.priority === 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-rose-500"></div>
              )}

              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 group-hover:scale-105 transition-transform">
                    {getIconComponent(item.iconName)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    {item.is24x7 && (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 24x7 Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Odia Name */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h3>
                {item.nameOdia && (
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{item.nameOdia}</p>
                )}
                <p className="text-xs text-slate-400 mt-1 font-mono">{item.organization}</p>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Call Buttons Section */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
                {/* Primary Direct Call Button */}
                <a
                  href={`tel:${item.primaryPhone.replace(/[^0-9]/g, '')}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all group-hover:shadow-cyan-900/30"
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-cyan-200" />
                    <span>Call {item.primaryPhone}</span>
                  </div>
                  <span className="text-[11px] font-normal opacity-90 px-2 py-0.5 bg-black/20 rounded-md">
                    Tap to Dial
                  </span>
                </a>

                {/* Secondary or Toll-Free Links if available */}
                <div className="flex items-center gap-2">
                  {item.tollFree && (
                    <a
                      href={`tel:${item.tollFree}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Toll Free: {item.tollFree}</span>
                    </a>
                  )}
                  {item.secondaryPhone && (
                    <a
                      href={`tel:${item.secondaryPhone.replace(/[^0-9]/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-mono transition-all"
                    >
                      <PhoneForwarded className="w-3.5 h-3.5 text-slate-400" />
                      <span>Alt: {item.secondaryPhone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHelplines.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
          <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <h4 className="text-white font-semibold">No helpline contacts found</h4>
          <p className="text-slate-400 text-xs mt-1">Try searching with a different district name or agency title.</p>
        </div>
      )}
    </div>
  );
};
