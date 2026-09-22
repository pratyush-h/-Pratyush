import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  X, 
  PhoneForwarded, 
  Send, 
  Anchor, 
  RadioTower, 
  AlertCircle 
} from 'lucide-react';
import type { PersonalContact } from '../types/cyclone';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  personalContacts: PersonalContact[];
  currentDistrict: string;
  cycloneRiskLevel: string;
}

export const EmergencySosModal: React.FC<Props> = ({
  isOpen,
  onClose,
  personalContacts,
  currentDistrict,
  cycloneRiskLevel,
}) => {
  if (!isOpen) return null;

  const primaryContact = personalContacts.find(c => c.isPrimarySOS) || personalContacts[0];

  return (
    <div className="fixed inset-0 z-[5000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-pulse"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto text-red-500 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wide">
            1-TAP EMERGENCY SOS BROADCAST
          </h2>
          <p className="text-xs text-rose-400 font-mono">
            District: {currentDistrict} • Alert Level: {cycloneRiskLevel}
          </p>
        </div>

        {/* Speed Action 1: Official Emergency Helplines */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Direct Speed Call Official Rescue
          </label>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:1070"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40"
            >
              <RadioTower className="w-4 h-4" />
              <span>Call ODRAF (1070)</span>
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-900/40"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>Call 112 Unified</span>
            </a>
            <a
              href="tel:1078"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40"
            >
              <Anchor className="w-4 h-4" />
              <span>Call NDRF (1078)</span>
            </a>
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Ambulance (108)</span>
            </a>
          </div>
        </div>

        {/* Speed Action 2: Personal Known One Contact */}
        {primaryContact ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400">PRIMARY PERSONAL SOS CONTACT</span>
                <h4 className="text-sm font-bold text-white">{primaryContact.name} ({primaryContact.relationship})</h4>
              </div>
              <span className="text-xs text-emerald-400 font-mono">{primaryContact.phone}</span>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${primaryContact.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Direct Call Known One</span>
              </a>

              <a
                href={`https://wa.me/91${primaryContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`EMERGENCY SOS: I am in ${currentDistrict} Odisha under Cyclone Warning (${cycloneRiskLevel}). Please check on me or dispatch help!`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold"
              >
                <Send className="w-4 h-4" />
                <span>WhatsApp SOS</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center">
            <AlertCircle className="w-4 h-4 mx-auto mb-1 text-amber-400" />
            No personal contacts added yet. Go to Personal Contacts tab to add your family numbers.
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-750"
        >
          Close Emergency Panel
        </button>
      </div>
    </div>
  );
};
