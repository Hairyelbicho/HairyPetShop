import { useState, useRef, useEffect } from 'react';
import { ownApi } from '../../utils/ownApi';
import CallMeBack from './CallMeBack';

export default function HairyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([
    { sender: 'bot', text: '¡Guau! 🐾 Soy Hairy, el asistente inteligente de HairyPetShop. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingText, setIsSpeakingText] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Precargar voces del sistema para asegurar que estén listas
    if (synth) {
      synth.getVoices();
    }
  }, []);

  const speakText = (text: string) => {
    if (isMuted || !synth) return;
    
    // Stop any ongoing speech before starting new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Buscar la voz más natural (Priorizar Google o voces Premium de Microsoft/Apple en español)
    const voices = synth.getVoices();
    const bestVoice = voices.find(v => v.name.includes('Google español') || v.name.includes('Microsoft Sabina') || v.name.includes('Monica')) 
                      || voices.find(v => v.lang.startsWith('es')) 
                      || voices[0];
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    utterance.lang = 'es-ES'; 
    utterance.pitch = 1.05; // Solo un toque de energía, sin que suene metálico
    utterance.rate = 0.98; // Ligeramente más lento para mejorar la vocalización y naturalidad

    utterance.onstart = () => setIsSpeakingText(true);
    utterance.onend = () => setIsSpeakingText(false);
    utterance.onerror = () => setIsSpeakingText(false);

    synth.speak(utterance);
  };

  const toggleMute = () => {
    if (!isMuted) {
      synth.cancel();
      setIsSpeakingText(false);
    }
    setIsMuted(!isMuted);
  };

  const stopSpeaking = () => {
    synth.cancel();
    setIsSpeakingText(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    
    // Añadimos mensaje del usuario al estado
    const newMessages = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = newMessages.slice(-8).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const data = await ownApi<{ success: boolean; message?: string; error?: string }>('/api/chat', {
        agent: 'hairy',
        messages: chatHistory,
      });
      if (data.success && data.message) {
        const botReply = data.message;
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        speakText(botReply);
      } else {
        throw new Error(data.error || 'Respuesta vacía');
      }
    } catch (error) {
      console.error("Groq AI Error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: '¡Guau! Mis circuitos (Groq) están algo lentos ahora mismo. Intenta decírmelo de nuevo 🐾' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
       <style>
       {`
         @keyframes talking {
           0%, 100% { transform: scale(1) translateY(0); }
           50% { transform: scale(1.1) translateY(-3px); }
         }
         .animate-talking {
           animation: talking 0.3s ease-in-out infinite;
         }
       `}
       </style>
       {isOpen && (
         <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[350px] mb-4 border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
           {/* Header */}
           <div className="bg-[#1a1f2e] p-4 text-white flex justify-between items-center border-b-[3px] border-orange-500">
             <div className="flex items-center gap-3">
               <div className="relative">
                 <img src="/hairy-bot.png" className={`w-10 h-10 rounded-full bg-[#c4a574] object-cover border border-gray-600 ${isSpeakingText ? 'animate-talking ring-2 ring-orange-500' : ''}`} alt="Hairy AI" />
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1f2e] rounded-full"></span>
               </div>
               <div>
                 <h3 className="font-black text-sm uppercase tracking-wider text-orange-400">Hairy IA</h3>
                 <p className="text-[10px] text-gray-300 font-bold tracking-widest">ARKADIUM88 HOLDINGS</p>
               </div>
             </div>
             <div className="flex items-center gap-1">
               <button onClick={stopSpeaking} className="text-gray-400 hover:text-white cursor-pointer bg-transparent border-none transition-colors" title="Detener Voz">
                 <i className="ri-stop-circle-line text-xl"></i>
               </button>
               <button onClick={toggleMute} className="text-gray-400 hover:text-white cursor-pointer bg-transparent border-none transition-colors" title={isMuted ? "Activar Voz" : "Silenciar Voz"}>
                 <i className={isMuted ? "ri-volume-mute-line text-xl" : "ri-volume-up-line text-xl text-orange-400"}></i>
               </button>
               <button onClick={() => { setIsOpen(false); synth.cancel(); setIsSpeakingText(false); }} className="text-gray-400 hover:text-white cursor-pointer bg-transparent border-none transition-colors ml-2 border-l border-gray-700 pl-2">
                 <i className="ri-close-line text-2xl"></i>
               </button>
             </div>
           </div>
           
           {/* Chat Area */}
           <div className="flex-1 p-4 bg-[#f8fafc] h-96 overflow-y-auto flex flex-col gap-4">
             {messages.map((msg, i) => (
               <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (
                     <img src="/hairy-bot.png" className={`w-6 h-6 rounded-full self-end mb-1 mr-2 bg-[#c4a574] shadow-sm object-cover ${i === messages.length - 1 && isSpeakingText ? 'animate-talking' : ''}`} alt="Bot" />
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             {isTyping && (
                <div className="flex justify-start items-end">
                  <img src="/hairy-bot.png" className="w-6 h-6 rounded-full self-end mb-1 mr-2 bg-[#c4a574] shadow-sm object-cover" alt="Bot" />
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
             )}
             <div ref={messagesEndRef} />
           </div>
           
           {/* Input Area */}
           <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
             {showCallForm ? (
               <div className="px-1 pb-1">
                 <CallMeBack source="hairybot" compact />
                 <button
                   type="button"
                   onClick={() => setShowCallForm(false)}
                   className="mt-2 text-xs text-gray-500 bg-transparent border-none cursor-pointer"
                 >
                   Volver al chat
                 </button>
               </div>
             ) : (
               <>
             <input 
               type="text" 
               placeholder="Escribe tu mensaje a Hairy..." 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 text-sm transition-colors"
             />
             <div className="flex gap-2">
             <button
               type="button"
               onClick={() => setShowCallForm(true)}
               className="flex-1 text-xs font-bold text-[#1a1f2e] bg-orange-100 rounded-xl py-2 border-none cursor-pointer"
             >
               Te llamamos
             </button>
             <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-[#1a1f2e] text-orange-500 disabled:opacity-50 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black transition-colors cursor-pointer border-none shadow-md">
                <i className="ri-send-plane-fill text-lg"></i>
             </button>
             </div>
               </>
             )}
           </div>
         </div>
       )}
       
       {/* Botón flotante: sustituye el widget "Talk with Us" de Readdy */}
       {!isOpen && (
         <button
           onClick={() => setIsOpen(true)}
           className="flex items-center gap-3 bg-black text-white rounded-full pl-1.5 pr-5 py-1.5 shadow-2xl hover:scale-105 transition-transform cursor-pointer border-none group"
           aria-label="Talk with Us"
         >
            <span className="relative flex-shrink-0">
              <img
                src="/hairy-bot.png"
                className="w-12 h-12 rounded-full object-cover bg-[#c4a574] border-2 border-[#1a1f2e]"
                alt="Hairy IA"
              />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full"></span>
            </span>
            <span className="font-bold text-sm whitespace-nowrap tracking-wide">Talk with Us</span>
         </button>
       )}
    </div>
  );
}
