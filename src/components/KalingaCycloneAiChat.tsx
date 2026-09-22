import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Globe
} from 'lucide-react';
import type { AiChatMessage } from '../types/cyclone';

const INITIAL_MESSAGES: AiChatMessage[] = [
  {
    id: 'ai-welcome',
    sender: 'ai',
    text: "Namaskar! I am KALINGA CYCLONE AI, your 24x7 disaster assistant for Odisha. Ask me about live cyclone warnings, nearest OSDMA shelters in Puri/Paradip/Balasore, ODRAF/NDRF helpline numbers, or evacuation tips.",
    textOdia: "ନମସ୍କାର! ମୁଁ କଳିଙ୍ଗ ବାତ୍ୟା AI. ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳ, ODRAF/NDRF ହେଲ୍ପଲାଇନ୍ ନମ୍ବର (1070/112) ଏବଂ ଜରୁରୀକାଳୀନ ସୂଚନା ପାଇଁ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।",
    timestamp: 'Just now',
  },
];

export const KalingaCycloneAiChat: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isOdia, setIsOdia] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Simulate AI response logic with Disaster domain knowledge
    setTimeout(() => {
      let responseText = "";
      let responseTextOdia = "";

      const lower = text.toLowerCase();

      if (lower.includes('odraf') || lower.includes('ndrf') || lower.includes('helpline') || lower.includes('call') || lower.includes('number')) {
        responseText = "🚨 Official Emergency Helpline Numbers:\n• ODRAF / State Control (SEOC): 1070 / 0674-2534177\n• NDRF 3rd Bn: 1078 / 0671-2879711\n• Odisha Unified Emergency: 112\n• Fire Services: 101\n• Coast Guard: 1554\n• Ambulance: 108";
        responseTextOdia = "🚨 ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍: ODRAF (1070), NDRF (1078), ୧୧୨ (Unified Emergency), ଆମ୍ବୁଲାନ୍ସ (108)।";
      } else if (lower.includes('shelter') || lower.includes('puri') || lower.includes('paradip') || lower.includes('dhamra') || lower.includes('stay')) {
        responseText = "🏠 Multipurpose Cyclone Shelters are active across coastal Odisha:\n• Puri Sea Beach Shelter (Cap: 2500, Contact: 06752-223201)\n• Paradip Port Evacuation Center (Cap: 3500, Contact: 06724-220368)\n• Rajnagar Bhitarkanika Shelter (Cap: 2200)\n• Dhamra Port Shelter (Cap: 4000)\n• Chandipur Beach Shelter (Cap: 2000)";
        responseTextOdia = "🏠 ପୁରୀ, ପାରାଦ୍ଵୀପ, ଧାମରା, ଚାନ୍ଦିପୁର ଏବଂ ଗୋପାଳପୁରରେ ଓଡ଼ିଶା ସରକାରଙ୍କ ସମସ୍ତ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳ ପ୍ରସ୍ତୁତ ଅଛି।";
      } else if (lower.includes('safety') || lower.includes('do') || lower.includes('tip') || lower.includes('evacuat')) {
        responseText = "⚠️ Coastal Safety Guidelines:\n1. Move to reinforced concrete OSDMA shelters before wind exceeds 80 km/h.\n2. Keep charged power banks, dry food (chuda, gur), torch, & essential medicines ready.\n3. Turn off main gas valve and electricity master switches.\n4. Untie livestock and move them to elevated ground.";
        responseTextOdia = "⚠️ ସୁରକ୍ଷା ନିୟମ: ପାୱାର ବ୍ୟାଙ୍କ, ଛୁଡ଼ା/ଗୁଡ଼, ଟର୍ଚ୍ଚ ଏବଂ ଔଷଧ ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ। ଗୃହପାଳିତ ପଶୁଙ୍କୁ ବାନ୍ଧି ରଖନ୍ତୁ ନାହିଁ।";
      } else {
        responseText = `I have logged your cyclone query "${text}". For immediate rescue, tap the 1-Tap Call buttons for ODRAF (1070) or 112 directly. You can also view live shelter coordinates on the GIS Radar map tab.`;
        responseTextOdia = `ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପାଇଁ ଧନ୍ୟବାଦ। ଜରୁରୀକାଳୀନ ସହାୟତା ପାଇଁ ODRAF (1070) କିମ୍ବା ୧୧୨ କୁ କଲ୍ କରନ୍ତୁ।`;
      }

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        textOdia: responseTextOdia,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              KALINGA CYCLONE AI
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-cyan-400 font-mono">Odisha Disaster Evacuation Assistant</p>
          </div>
        </div>

        <button
          onClick={() => setIsOdia(!isOdia)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-amber-300 font-semibold hover:bg-slate-750 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{isOdia ? 'English Mode' : 'ଓଡ଼ିଆ Language'}</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              {isOdia && msg.textOdia && (
                <p className="text-xs text-amber-300 font-medium mt-2 pt-2 border-t border-slate-800">
                  {msg.textOdia}
                </p>
              )}
              <span className="block text-[10px] opacity-60 text-right mt-1 font-mono">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommended Prompt Pills */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleSendMessage('Call ODRAF Helpline')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold whitespace-nowrap hover:bg-rose-500/20 transition-all flex items-center gap-1"
        >
          <PhoneCall className="w-3 h-3" /> ODRAF Number
        </button>
        <button
          onClick={() => handleSendMessage('Where are Puri shelters?')}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold whitespace-nowrap hover:bg-emerald-500/20 transition-all flex items-center gap-1"
        >
          <MapPin className="w-3 h-3" /> Puri Shelters
        </button>
        <button
          onClick={() => handleSendMessage('Safety rules during landfall')}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold whitespace-nowrap hover:bg-amber-500/20 transition-all flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3" /> Evacuation Checklist
        </button>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Kalinga Cyclone AI (e.g. ODRAF contact, Paradip shelter, evacuation)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/40 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
