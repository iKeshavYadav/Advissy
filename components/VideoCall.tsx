
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, MessageSquare, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Consultant } from '../types';
import { createBlob, decodeAudioData, decodeBase64 } from '../services/liveService';

interface VideoCallProps {
  consultant: Consultant;
  onEndCall: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ consultant, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: !isVideoOff 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
            systemInstruction: `You are ${consultant.name}, a ${consultant.title}. 
            Your expertise is in ${consultant.category}. 
            Keep your responses professional, helpful, and concise. 
            The user has just joined a video consultation with you. Greet them warmly.`,
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
        console.error("Failed to start call:", err);
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

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
      {/* Background Consultant Image (Blurred) */}
      <div className="absolute inset-0 opacity-30 blur-2xl">
        <img src={consultant.imageUrl} className="w-full h-full object-cover" alt="Background" />
      </div>

      <div className="relative w-full max-w-6xl h-full max-h-[800px] flex flex-col md:flex-row p-4 gap-4">
        {/* Main Consultant View */}
        <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border border-white/10">
          <img 
            src={consultant.imageUrl} 
            className={`w-full h-full object-cover transition-all duration-1000 ${isSpeaking ? 'scale-110 blur-[2px]' : 'scale-100'}`} 
            alt={consultant.name} 
          />
          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-3xl font-bold text-white mb-2">{consultant.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <p className="text-gray-300 font-medium">{isConnected ? (isSpeaking ? 'Speaking...' : 'Listening...') : 'Connecting...'}</p>
            </div>
          </div>
          
          {/* Speaking Indicator Rings */}
          {isSpeaking && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 rounded-full border-4 border-orange-500/30 animate-ping" />
            </div>
          )}
        </div>

        {/* User Sidebar / PiP */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="aspect-video md:aspect-square bg-gray-800 rounded-2xl overflow-hidden relative shadow-xl border border-white/10">
            {isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                <User className="w-16 h-16 mb-2" />
                <span className="text-xs uppercase font-bold tracking-widest">Camera Off</span>
              </div>
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
            )}
            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest">
              You (Preview)
            </div>
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-white overflow-hidden flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-orange-500 mb-4">Consultation Details</h3>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Encrypted HD Session</span>
              </div>
              <p className="leading-relaxed">
                You are discussing <strong>{consultant.category}</strong>. Feel free to ask about {consultant.description.toLowerCase()}.
              </p>
            </div>
            
            {!isConnected && (
              <div className="mt-auto flex items-center gap-3 text-orange-400 font-bold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Establishing Secure Link...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-8 px-6 py-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 flex items-center gap-6 shadow-2xl">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-4 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <div className="w-[1px] h-8 bg-white/20" />

        <button 
          onClick={onEndCall}
          className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 hover:scale-105 transition-all shadow-lg shadow-red-900/40 flex items-center gap-2 font-bold px-6"
        >
          <PhoneOff className="w-6 h-6" />
          <span>End Consultation</span>
        </button>
      </div>
    </div>
  );
};
