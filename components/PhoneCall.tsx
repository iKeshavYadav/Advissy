
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, PhoneOff, Loader2, Volume2, User } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Consultant } from '../types';
import { createBlob, decodeAudioData, decodeBase64 } from '../services/liveService';

interface PhoneCallProps {
  consultant: Consultant;
  onEndCall: () => void;
}

export const PhoneCall: React.FC<PhoneCallProps> = ({ consultant, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [duration, setDuration] = useState(0);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let timer: number;
    if (isConnected) {
      timer = window.setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
            },
            systemInstruction: `You are ${consultant.name}, a ${consultant.title}. 
            Your expertise is in ${consultant.category}. 
            This is a phone consultation. Speak clearly and professionally.
            The user has just called you. Answer with a friendly professional greeting.`,
          },
          callbacks: {
            onopen: () => {
              setIsConnected(true);
              const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                // Use sessionPromise to prevent race condition and ensure valid session usage
                sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);
            },
            onmessage: async (message) => {
              const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (audioData) {
                setIsSpeaking(true);
                const ctx = audioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setIsSpeaking(false);
                });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
              }
            },
            onclose: () => onEndCall(),
            onerror: (e) => console.error("Live API Error:", e),
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err) {
        console.error("Failed to start phone call:", err);
        onEndCall();
      }
    };

    startCall();

    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (inputAudioContextRef.current) inputAudioContextRef.current.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, []);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900 flex flex-col items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-black/40 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Caller Interface */}
        <div className="mb-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="relative mb-8">
            <div className={`absolute inset-0 bg-green-500 rounded-full blur-2xl transition-all duration-700 ${isSpeaking ? 'opacity-40 scale-125' : 'opacity-10 scale-100'}`} />
            <div className={`relative w-40 h-40 rounded-full border-4 ${isSpeaking ? 'border-green-500 animate-pulse' : 'border-white/10'} p-1 overflow-hidden transition-colors`}>
              <img 
                src={consultant.imageUrl} 
                className="w-full h-full object-cover rounded-full" 
                alt={consultant.name} 
              />
            </div>
            {isSpeaking && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-900/40">
                Speaking
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{consultant.name}</h2>
          <p className="text-green-400 font-medium tracking-wide uppercase text-xs mb-4">{consultant.title}</p>
          
          <div className="flex items-center justify-center gap-2 text-gray-400">
            {isConnected ? (
              <span className="font-mono text-xl tracking-tighter text-white/80">{formatDuration(duration)}</span>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-bold uppercase tracking-widest">Calling...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-8 w-full">
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-orange-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </button>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mute</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-not-allowed opacity-50">
              <Volume2 />
            </button>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Speaker</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-not-allowed opacity-50">
              <User />
            </button>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add</span>
          </div>
        </div>

        <div className="mt-16 w-full flex justify-center">
          <button 
            onClick={onEndCall}
            className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-red-900/60"
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        </div>
        
        <p className="mt-12 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
          End-to-End Encrypted Voice
        </p>
      </div>
    </div>
  );
};
