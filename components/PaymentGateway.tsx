
import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  ChevronLeft, 
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Consultant, Booking } from '../types';

interface PaymentGatewayProps {
  consultant: Consultant;
  bookingData: Partial<Booking>;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  consultant, 
  bookingData, 
  onSuccess, 
  onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const steps = [
    "Verifying payment method...",
    "Securing transaction channel...",
    "Authorizing with bank...",
    "Finalizing booking details..."
  ];

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing steps
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessingStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(onSuccess, 500);
      }
    }, 800);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return v;
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  return (
    <div className="bg-white rounded-[2.5rem] w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      {/* Summary Sidebar */}
      <div className="md:w-80 bg-slate-900 text-white p-10 flex flex-col">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-400 hover:text-white mb-10 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back</span>
        </button>

        <h3 className="text-xl font-black mb-8">Booking Summary</h3>
        
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-4">
            <img src={consultant.imageUrl} className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10" alt="" />
            <div>
              <p className="font-bold text-sm">{consultant.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{consultant.title}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                {bookingData.type === 'video' ? <Video className="w-4 h-4 text-orange-500" /> : 
                 bookingData.type === 'phone' ? <Phone className="w-4 h-4 text-green-500" /> : 
                 <MessageSquare className="w-4 h-4 text-blue-500" />}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Consultation Type</p>
                <p className="text-sm font-bold capitalize">{bookingData.type} Session</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Duration</p>
                <p className="text-sm font-bold">{bookingData.duration}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm text-slate-400">Total amount</span>
            <span className="text-2xl font-black text-orange-500">${bookingData.price?.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-slate-500 italic">Includes all taxes and platform fees.</p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="flex-1 p-12 relative bg-white">
        {isProcessing ? (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Processing Payment</h3>
            <p className="text-slate-500 font-medium mb-12">Please do not refresh or close this window.</p>
            
            <div className="w-full max-w-xs space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx === processingStep ? 'opacity-100 scale-105' : idx < processingStep ? 'opacity-50 grayscale' : 'opacity-20'}`}>
                  {idx < processingStep ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 ${idx === processingStep ? 'border-orange-500 border-t-transparent animate-spin' : 'border-slate-200'}`} />
                  )}
                  <span className={`text-sm font-bold ${idx === processingStep ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-900">Secure Payment</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">SSL Secure</span>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cardholder Name</label>
            <div className="relative">
              <input 
                type="text"
                required
                placeholder="e.g. JOHN DOE"
                value={name}
                onChange={e => setName(e.target.value.toUpperCase())}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="text"
                required
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono text-lg font-bold placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
              <input 
                type="text"
                required
                maxLength={5}
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold placeholder:text-slate-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CVV</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password"
                  required
                  maxLength={3}
                  placeholder="***"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95 transform"
            >
              Pay ${bookingData.price?.toFixed(2)} & Confirm Booking
            </button>
            <div className="flex items-center justify-center gap-2 mt-6">
              <Lock className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Encrypted Payment Connection</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
