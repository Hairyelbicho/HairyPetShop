import { useState, useRef, useEffect } from 'react';

export default function HairyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([
    { sender: 'bot', text: '¡Guau! 🐾 Soy Hairy, el asistente inteligente de HairyPetShop. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakingText, setIsSpeakingText] = useState(false);
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
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey) {
         setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Hairy IA en pausa: Me falta la API Key de Groq en tu archivo .env (VITE_GROQ_API_KEY).' }]);
         setIsTyping(false);
         return;
      }

      // Preparamos el contexto para el LLM (últimos 8 mensajes para no saturar tokens)
      const chatHistory = newMessages.slice(-8).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 150,
          messages: [
            {
              role: 'system',
              content: 'Eres Hairy, el divertido y experto asistente inteligente del ecosistema Hairy (HairyPetShop y Hairy Home), propiedad de Arkadium88 Holdings SL. Eres entusiasta, hablas español neutro y eres experto en mascotas. Tus respuestas deben ser MUY BREVES (máximo 2-3 frases), directas. Si te preguntan por Hairy Home, alojamiento, alquileres u hoteles, explica que Hairy Home es nuestro buscador de propiedades y hoteles 100% pet-friendly donde las mascotas siempre son bienvenidas sin rechazos, sin letra pequeña. Si preguntan por productos, guíalos a la tienda HairyPetShop. Menciona que pueden pagar y ganar recompensas con HairyWallet (Solana).'
            },
            ...chatHistory
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const botReply = data.choices[0].message.content;
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        speakText(botReply); // Hairy habla en voz alta
      } else {
        throw new Error('Respuesta vacía de Groq');
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
                 <img src="/HairyTools_Icon.png" className={`w-10 h-10 rounded-full bg-white object-cover border border-gray-600 ${isSpeakingText ? 'animate-talking ring-2 ring-orange-500' : ''}`} alt="Hairy AI" />
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
                     <img src="/HairyTools_Icon.png" className={`w-6 h-6 rounded-full self-end mb-1 mr-2 bg-white shadow-sm ${i === messages.length - 1 && isSpeakingText ? 'animate-talking' : ''}`} alt="Bot" />
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             {isTyping && (
                <div className="flex justify-start items-end">
                  <img src="/HairyTools_Icon.png" className="w-6 h-6 rounded-full self-end mb-1 mr-2 bg-white shadow-sm" alt="Bot" />
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
           <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
             <input 
               type="text" 
               placeholder="Escribe tu mensaje a Hairy..." 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 text-sm transition-colors"
             />
             <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-[#1a1f2e] text-orange-500 disabled:opacity-50 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black transition-colors cursor-pointer border-none shadow-md">
                <i className="ri-send-plane-fill text-lg"></i>
             </button>
           </div>
         </div>
       )}
       
       {/* Botón Flotante (Widget Cerrado) */}
       {!isOpen && (
         <button 
           onClick={() => setIsOpen(true)}
           className="w-16 h-16 rounded-full shadow-2xl overflow-visible hover:scale-110 transition-transform cursor-pointer flex items-center justify-center relative bg-white border-4 border-[#1a1f2e] group"
         >
            {/* Tooltip Hover */}
            <div className="absolute right-20 bg-[#1a1f2e] text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ¡Habla con Hairy IA!
            </div>
            {/* Indicador Activo */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-10 animate-pulse"></span>
            
            <img src="/HairyTools_Icon.png" className="w-full h-full object-cover rounded-full" alt="Hairy IA Bot" />
         </button>
       )}
    </div>
  );
}
