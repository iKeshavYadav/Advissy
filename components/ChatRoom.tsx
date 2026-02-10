
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Consultant } from '../types';
import { createConsultantChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatRoomProps {
  consultant: Consultant;
  onClose: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ consultant, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hello! I'm ${consultant.name}. I've reviewed your request and I'm ready to help you with your ${consultant.category} needs. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createConsultantChat(consultant);
  }, [consultant]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userText });
      
      let fullResponse = '';
      let isFirstChunk = true;

      for await (const chunk of result) {
        if (isFirstChunk) {
          setIsTyping(false);
          setMessages(prev => [...prev, { role: 'model', text: '' }]);
          isFirstChunk = false;
        }

        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullResponse += textChunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Could you please try again?" }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Consultant Info (Hidden on small screens) */}
      <div className="hidden md:flex w-80 bg-gray-50 border-r border-gray-100 flex-col p-8">
        <button onClick={onClose} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img src={consultant.imageUrl} className="w-32 h-32 rounded-3xl object-cover shadow-lg mx-auto" alt={consultant.name} />
            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white w-6 h-6 rounded-full" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{consultant.name}</h2>
          <p className="text-sm text-orange-600 font-semibold mb-6">{consultant.title}</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current Session</h4>
            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Direct Message Consultation
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
            <p className="text-xs text-orange-800 leading-relaxed">
              This is a private, encrypted chat session. Your data is handled securely and only used for this consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img src={consultant.imageUrl} className="w-10 h-10 rounded-xl object-cover" alt={consultant.name} />
            <div>
              <h3 className="text-sm font-bold">{consultant.name}</h3>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-white no-scrollbar"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1 shadow-sm">
                    <img src={consultant.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-none shadow-md' 
                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100 whitespace-pre-wrap'
                }`}>
                  {msg.text || (isLoading && idx === messages.length - 1 && !isTyping ? <Loader2 className="w-4 h-4 animate-spin opacity-50" /> : msg.text)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex gap-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1 shadow-sm">
                  <img src={consultant.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center h-10 px-5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${consultant.name.split(' ')[0]}...`}
              disabled={isLoading}
              className="w-full py-4 px-6 pr-14 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:grayscale"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-bold">
            Consultations are recorded for quality assurance
          </p>
        </div>
      </div>
    </div>
  );
};
