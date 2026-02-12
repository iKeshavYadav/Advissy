
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Menu, 
  X, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  Calculator, 
  Layout, 
  Code,
  MessageSquare,
  Video,
  Phone,
  User as UserIcon,
  Briefcase as ProfessionalIcon,
  CheckCircle,
  ChevronRight,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Consultant, Category, Booking } from './types';
import { MOCK_CONSULTANTS } from './constants.tsx';
import { ConsultantCard } from './components/ConsultantCard';
import { AIConsultantFinder } from './components/AIConsultantFinder';
import { VideoCall } from './components/VideoCall';
import { ChatRoom } from './components/ChatRoom';
import { PhoneCall } from './components/PhoneCall';
import { ProfileSection } from './components/ProfileSection';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ExpertProfilePage } from './components/ExpertProfilePage';
import { PaymentGateway } from './components/PaymentGateway';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Booking related state
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'video' | 'phone' | 'chat' | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Partial<Booking> | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);

  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activePhoneId, setActivePhoneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'expert-dashboard' | 'consultant-profile'>('home');
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(null);
  const [savedConsultantIds, setSavedConsultantIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_consultant_ids');
    if (saved) {
      try {
        setSavedConsultantIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved consultants", e);
      }
    }
  }, []);

  const toggleSaveConsultant = (id: string) => {
    setSavedConsultantIds(prev => {
      const isSaved = prev.includes(id);
      const updated = isSaved ? prev.filter(sid => sid !== id) : [...prev, id];
      localStorage.setItem('saved_consultant_ids', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredConsultants = useMemo(() => {
    if (selectedCategory === 'All') return MOCK_CONSULTANTS;
    return MOCK_CONSULTANTS.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const consultantForBooking = useMemo(() => {
    return MOCK_CONSULTANTS.find(c => c.id === showBookingModal) || null;
  }, [showBookingModal]);

  const consultantForPayment = useMemo(() => {
    if (!pendingBooking) return null;
    return MOCK_CONSULTANTS.find(c => c.id === pendingBooking.consultantId) || null;
  }, [pendingBooking]);

  const selectedConsultant = useMemo(() => {
    return MOCK_CONSULTANTS.find(c => c.id === selectedConsultantId) || null;
  }, [selectedConsultantId]);

  // Initial step: Prepare booking details and move to payment
  const initiatePayment = () => {
    if (!showBookingModal || !selectedMethod) return;
    
    const consultant = MOCK_CONSULTANTS.find(c => c.id === showBookingModal);
    if (!consultant) return;

    const pkg = consultant.sessionPackages?.find(p => p.id === selectedPackageId);

    setPendingBooking({
      consultantId: consultant.id,
      consultantName: consultant.name,
      consultantImageUrl: consultant.imageUrl,
      type: selectedMethod,
      packageName: pkg?.name || 'Standard Session',
      duration: pkg?.duration || '60 minutes',
      price: pkg?.price || consultant.pricePerHour
    });
    
    setShowBookingModal(null);
  };

  // Final step: After payment is successful
  const finalizeBooking = () => {
    if (!pendingBooking) return;

    const newBooking: Booking = {
      ...pendingBooking as Booking,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      status: 'upcoming'
    };

    const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    localStorage.setItem('user_bookings', JSON.stringify([newBooking, ...existing]));
    
    setBookingConfirmed(newBooking);
    setPendingBooking(null);
    setSelectedMethod(null);
    setSelectedPackageId(null);
  };

  const handleConsultantClick = (id: string) => {
    setSelectedConsultantId(id);
    setCurrentView('consultant-profile');
    window.scrollTo(0, 0);
  };

  const handleBooking = (id: string, packageId?: string) => {
    const consultant = MOCK_CONSULTANTS.find(c => c.id === id);
    setShowBookingModal(id);
    setSelectedMethod(null); // Reset method choice when opening modal
    setSelectedPackageId(packageId || (consultant?.sessionPackages?.[0]?.id || null));
  };

  if (activeCallId) {
    const consultant = MOCK_CONSULTANTS.find(c => c.id === activeCallId);
    return consultant ? <VideoCall consultant={consultant} onEndCall={() => setActiveCallId(null)} /> : null;
  }

  if (activeChatId) {
    const consultant = MOCK_CONSULTANTS.find(c => c.id === activeChatId);
    return consultant ? <ChatRoom consultant={consultant} onClose={() => setActiveChatId(null)} /> : null;
  }

  if (activePhoneId) {
    const consultant = MOCK_CONSULTANTS.find(c => c.id === activePhoneId);
    return consultant ? <PhoneCall consultant={consultant} onEndCall={() => setActivePhoneId(null)} /> : null;
  }

  const categories = [
    { name: 'All', icon: Layout },
    { name: Category.STUDY_ABROAD, icon: GraduationCap },
    { name: Category.FINANCE, icon: Calculator },
    { name: Category.LEGAL, icon: Scale },
    { name: Category.STARTUP, icon: Briefcase },
    { name: Category.TECH, icon: Code },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      {currentView !== 'consultant-profile' && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setCurrentView('home')}
              >
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Users className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">ConsultantHub</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8">
                <a href="#how" className="text-sm font-medium text-gray-600 hover:text-orange-600">How it works</a>
                <a href="#experts" className="text-sm font-medium text-gray-600 hover:text-orange-600">Find Experts</a>
                <div className="w-[1px] h-6 bg-gray-100 mx-2" />
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentView('expert-dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${
                      currentView === 'expert-dashboard' 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                        : 'text-slate-500 hover:text-slate-900 border border-slate-100'
                    }`}
                  >
                    <ProfessionalIcon className="w-3.5 h-3.5" />
                    Expert Portal
                  </button>
                  <button 
                    onClick={() => setCurrentView('profile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
                      currentView === 'profile' 
                        ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </button>
                </div>
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>
      )}

      {currentView === 'profile' ? (
        <ProfileSection onBack={() => setCurrentView('home')} />
      ) : currentView === 'expert-dashboard' ? (
        <ProfessionalDashboard onBack={() => setCurrentView('home')} />
      ) : currentView === 'consultant-profile' && selectedConsultant ? (
        <ExpertProfilePage 
          consultant={selectedConsultant}
          onBack={() => setCurrentView('home')}
          isSaved={savedConsultantIds.includes(selectedConsultant.id)}
          onToggleSave={toggleSaveConsultant}
          onBookSession={handleBooking}
        />
      ) : (
        <>
          <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
            <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-orange-50 opacity-50 blur-3xl rounded-full" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:flex items-center gap-12">
                <div className="lg:w-1/2 mb-12 lg:mb-0">
                  <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mb-6">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Connect with top 1% experts</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
                    The Right Consultant <span className="text-orange-600">When You Need One.</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                    Expert advice doesn't have to be hard to find. Connect with verified, rated consultants for study abroad, taxes, legal, or business needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#experts" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all group">
                      Find an Expert <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <button className="border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                      Join as Consultant
                    </button>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <AIConsultantFinder onRecommendation={(cat) => {
                    setSelectedCategory(cat);
                    document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' });
                  }} />
                </div>
              </div>
            </div>
          </section>

          <section id="experts" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar mb-12">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all shadow-sm ${
                        isActive 
                        ? 'bg-orange-600 text-white shadow-orange-200' 
                        : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredConsultants.map(consultant => (
                  <div key={consultant.id} onClick={() => handleConsultantClick(consultant.id)} className="cursor-pointer">
                    <ConsultantCard 
                      consultant={consultant} 
                      onBook={(id) => handleBooking(id)}
                      isSaved={savedConsultantIds.includes(consultant.id)}
                      onToggleSave={toggleSaveConsultant}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Booking Selection Modal (Reordered) */}
      {showBookingModal && consultantForBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900">Book your session</h3>
                <p className="text-gray-500 font-medium mt-1">Configure your session with {consultantForBooking.name}</p>
              </div>
              <button 
                onClick={() => {
                  setShowBookingModal(null);
                  setSelectedMethod(null);
                  setSelectedPackageId(null);
                }} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>

            {/* Step 1: Method Selection (Now first) */}
            <div className="mb-8">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">1. Choose communication method</label>
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedMethod('video')}
                  className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all group ${
                    selectedMethod === 'video' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' : 'border-gray-100 bg-gray-50/30 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                      selectedMethod === 'video' ? 'bg-orange-600' : 'bg-gray-400'
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Video Consultation</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live HD Video</p>
                    </div>
                  </div>
                  {selectedMethod === 'video' && <CheckCircle className="w-5 h-5 text-orange-600" />}
                </button>

                <button 
                  onClick={() => setSelectedMethod('phone')}
                  className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all group ${
                    selectedMethod === 'phone' ? 'border-green-500 bg-green-50 ring-2 ring-green-500' : 'border-gray-100 bg-gray-50/30 hover:bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                      selectedMethod === 'phone' ? 'bg-green-600' : 'bg-gray-400'
                    }`}>
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Voice Consultation</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Crystal Clear Audio</p>
                    </div>
                  </div>
                  {selectedMethod === 'phone' && <CheckCircle className="w-5 h-5 text-green-600" />}
                </button>

                <button 
                  onClick={() => setSelectedMethod('chat')}
                  className={`w-full p-4 border rounded-2xl flex items-center justify-between transition-all group ${
                    selectedMethod === 'chat' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' : 'border-gray-100 bg-gray-50/30 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
                      selectedMethod === 'chat' ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Chat Consultation</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Messaging</p>
                    </div>
                  </div>
                  {selectedMethod === 'chat' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Step 2: Duration / Package Selection (Conditional) */}
            {selectedMethod && (
              <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">2. Select session duration</label>
                <div className="grid grid-cols-1 gap-3">
                  {consultantForBooking.sessionPackages?.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${
                        selectedPackageId === pkg.id 
                          ? 'border-gray-900 bg-gray-900 text-white ring-2 ring-gray-900' 
                          : 'border-gray-100 hover:border-gray-300 bg-gray-50/30'
                      }`}
                    >
                      <div>
                        <p className={`font-bold ${selectedPackageId === pkg.id ? 'text-white' : 'text-gray-900'}`}>{pkg.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1 ${selectedPackageId === pkg.id ? 'text-gray-400' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3" /> {pkg.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${selectedPackageId === pkg.id ? 'text-orange-500' : 'text-gray-900'}`}>${pkg.price.toFixed(2)}</p>
                      </div>
                    </button>
                  )) || (
                    <div className="p-4 rounded-2xl border border-gray-900 bg-gray-900 text-white ring-2 ring-gray-900 text-left flex justify-between items-center">
                      <div>
                        <p className="font-bold">Standard Consultation</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">60 Minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-orange-500 text-lg">${consultantForBooking.pricePerHour.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Booking Button */}
                <div className="mt-8">
                  <button 
                    disabled={!selectedPackageId}
                    onClick={initiatePayment}
                    className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    Proceed to secure payment <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>
              </div>
            )}
            
            {!selectedMethod && (
              <p className="text-[10px] text-center font-black text-gray-300 uppercase tracking-widest mt-6">
                Please select a communication method to view available durations
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment Gateway Overlay */}
      {pendingBooking && consultantForPayment && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <PaymentGateway 
            consultant={consultantForPayment}
            bookingData={pendingBooking}
            onSuccess={finalizeBooking}
            onCancel={() => setPendingBooking(null)}
          />
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 shadow-inner">
                <CheckCircle className="w-10 h-10" />
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Confirmed!</h3>
             <p className="text-gray-500 font-medium mb-8">Your {bookingConfirmed.packageName?.toLowerCase()} with {bookingConfirmed.consultantName} is scheduled.</p>
             
             {/* Receipt-style details */}
             <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-4 border border-gray-100">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Package</span>
                   <span className="text-sm font-bold text-gray-900">{bookingConfirmed.packageName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</span>
                   <span className="text-sm font-bold text-gray-900">{bookingConfirmed.duration}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</span>
                   <span className="text-sm font-bold text-gray-900 capitalize">{bookingConfirmed.type} Consultation</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
                   <span className="text-xl font-black text-gray-900">${bookingConfirmed.price?.toFixed(2)}</span>
                </div>
             </div>

             <button 
              onClick={() => {
                const type = bookingConfirmed.type;
                const id = bookingConfirmed.consultantId;
                setBookingConfirmed(null);
                setSelectedPackageId(null);
                setSelectedMethod(null);
                
                // Immediately start the session if the user clicks the button
                if (type === 'video') setActiveCallId(id);
                if (type === 'chat') setActiveChatId(id);
                if (type === 'phone') setActivePhoneId(id);
              }}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200"
             >
               Start Session Now
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
