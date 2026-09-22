import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  ShieldAlert, 
  MapPin, 
  Check, 
  Heart,
  PhoneCall,
  Send,
  UserCheck
} from 'lucide-react';
import type { PersonalContact } from '../types/cyclone';

const DEFAULT_CONTACTS: PersonalContact[] = [
  {
    id: 'contact-demo-1',
    name: 'Rajesh Kumar Swain (Father)',
    relationship: 'Family (Father)',
    phone: '9437012345',
    district: 'Puri',
    notes: 'Near Grand Road, Puri. Ground floor house.',
    isPrimarySOS: true,
  },
  {
    id: 'contact-demo-2',
    name: 'Anusaya Mohanty (Sister)',
    relationship: 'Family (Sister)',
    phone: '9861098765',
    district: 'Jagatsinghpur (Paradip)',
    notes: 'Lives in Paradip Port township.',
    isPrimarySOS: true,
  }
];

const ODISHA_DISTRICTS = [
  'Puri', 'Jagatsinghpur', 'Kendrapara', 'Bhadrak', 'Balasore', 
  'Ganjam', 'Khordha', 'Cuttack', 'Mayurbhanj', 'Jajpur', 'Gajapati', 'Nayagarh'
];

interface Props {
  currentDistrict?: string;
  cycloneRiskLevel?: string;
}

export const PersonalEmergencyContacts: React.FC<Props> = ({ 
  currentDistrict = 'Puri', 
  cycloneRiskLevel = 'RED' 
}) => {
  const [contacts, setContacts] = useState<PersonalContact[]>(() => {
    const saved = localStorage.getItem('odisha_cyclone_personal_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CONTACTS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Family',
    phone: '',
    altPhone: '',
    district: 'Puri',
    notes: '',
    isPrimarySOS: true,
  });

  useEffect(() => {
    localStorage.setItem('odisha_cyclone_personal_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingId) {
      setContacts(contacts.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
      setEditingId(null);
    } else {
      const newContact: PersonalContact = {
        ...formData,
        id: `contact-${Date.now()}`,
      };
      setContacts([...contacts, newContact]);
    }

    setFormData({
      name: '',
      relationship: 'Family',
      phone: '',
      altPhone: '',
      district: 'Puri',
      notes: '',
      isPrimarySOS: true,
    });
    setIsAdding(false);
  };

  const handleEdit = (contact: PersonalContact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      altPhone: contact.altPhone || '',
      district: contact.district,
      notes: contact.notes || '',
      isPrimarySOS: contact.isPrimarySOS,
    });
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  // Generate WhatsApp / SMS SOS Link
  const generateSosMessage = (contact: PersonalContact) => {
    const text = encodeURIComponent(
      `🚨 EMERGENCY SOS ALERT! 🚨\n\nDear ${contact.name},\nI am currently in ${currentDistrict}, Odisha under CYCLONE ALERT (Risk: ${cycloneRiskLevel}).\nPlease stay in touch or inform ODRAF/SEOC (1070/112) if you cannot reach me.\n\nSent via Odisha Cyclone Detection AI Emergency Hub.`
    );
    return text;
  };

  const triggerBroadcastSos = () => {
    const sosContacts = contacts.filter(c => c.isPrimarySOS);
    if (sosContacts.length === 0) {
      alert('Please add or mark at least one personal emergency contact for SOS!');
      return;
    }

    const firstContact = sosContacts[0];
    const textMsg = `EMERGENCY SOS: I am in ${currentDistrict} Odisha under Cyclone Alert (${cycloneRiskLevel}). Please reach out!`;
    
    // Open WhatsApp with prefilled message
    window.open(`https://wa.me/91${firstContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMsg)}`, '_blank');
    setSosSentSuccess(true);
    setTimeout(() => setSosSentSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & One-Tap Broadcast Action */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-red-950/60 border border-rose-500/40 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 animate-pulse">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
                KNOWN ONES EMERGENCY NETWORK
              </span>
              <span className="text-xs text-slate-400 font-mono">LOCAL PERSISTENCE STORED</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Personal Emergency Contacts</h2>
            <p className="text-slate-300 text-sm mt-0.5">
              Add family & friends in Odisha for 1-Tap Direct Dialing and Instant WhatsApp/SMS Cyclone SOS alerts.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={triggerBroadcastSos}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-red-900/50 transition-all transform hover:scale-105 active:scale-95"
            >
              <ShieldAlert className="w-5 h-5 animate-spin" />
              <span>1-TAP INSTANT SOS BROADCAST</span>
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: '',
                  relationship: 'Family',
                  phone: '',
                  altPhone: '',
                  district: 'Puri',
                  notes: '',
                  isPrimarySOS: true,
                });
                setIsAdding(!isAdding);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>{isAdding ? 'Cancel' : 'Add Contact'}</span>
            </button>
          </div>
        </div>

        {sosSentSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>SOS Alert ready & sent to primary emergency contact via WhatsApp / SMS!</span>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal / Inline Box */}
      {isAdding && (
        <form onSubmit={handleSaveContact} className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              {editingId ? 'Edit Emergency Contact' : 'Add New Emergency Contact (Known One)'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Saved in Browser LocalStorage</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra Das"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship / Tag</label>
              <select
                value={formData.relationship}
                onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Family (Father/Mother)">Family (Parents)</option>
                <option value="Family (Spouse/Sibling)">Family (Spouse/Sibling)</option>
                <option value="Relative / Uncle">Relative</option>
                <option value="Close Friend">Close Friend</option>
                <option value="Neighbor / Local Warden">Neighbor / Local Warden</option>
                <option value="Colleague / Doctor">Colleague / Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Mobile Number (for Direct Call) *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9437012345"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alternate Phone (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. 0674-2500000"
                value={formData.altPhone}
                onChange={e => setFormData({ ...formData, altPhone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Odisha District / Location</label>
              <select
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                {ODISHA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d} District</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Address Details</label>
              <input
                type="text"
                placeholder="e.g. House No 42, Puri Grand Road near Shelter 1"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrimarySOS}
                onChange={e => setFormData({ ...formData, isPrimarySOS: e.target.checked })}
                className="w-4 h-4 accent-rose-500 rounded"
              />
              <span className="text-xs text-slate-300 font-semibold">Include in 1-Tap SOS Speed Broadcast</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-750"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-900/40"
              >
                {editingId ? 'Update Contact' : 'Save Contact'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Grid of Saved Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-lg relative"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400 text-base">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{contact.name}</h3>
                    <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      {contact.relationship}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                    title="Edit Contact"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>District: <strong className="text-white">{contact.district}</strong></span>
                </div>
                {contact.notes && (
                  <p className="text-slate-400 italic text-[11px] bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    "{contact.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Direct Calling & Messaging Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-200" />
                  <span>Call {contact.phone}</span>
                </div>
                <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded text-emerald-200">
                  Direct Call
                </span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${contact.phone.replace(/[^0-9]/g, '')}?text=${generateSosMessage(contact)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp SOS</span>
                </a>

                <a
                  href={`sms:${contact.phone}?body=EMERGENCY SOS: I am in ${currentDistrict} Odisha under Cyclone Alert. Please contact ODRAF 1070!`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS Alert</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
