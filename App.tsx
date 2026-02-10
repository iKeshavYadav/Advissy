
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
  Briefcase as ProfessionalIcon
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

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activePhoneId, setActivePhoneId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'expert-dashboard'>('home');

  const filteredConsultants = useMemo(() => {
    if (selectedCategory === 'All') return MOCK_CONSULTANTS;
    return MOCK_CONSULTANTS.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const activeConsultantForCall = useMemo(() => {
    return MOCK_CONSULTANTS.find(c => c.id === activeCallId) || null;
  }, [activeCallId]);

  const activeConsultantForChat = useMemo(() => {
    return MOCK_CONSULTANTS.find(c => c.id === activeChatId) || null;
  }, [activeChatId]);

  const activeConsultantForPhone = useMemo(() => {
    return MOCK_CONSULTANTS.find(c => c.id === activePhoneId) || null;
  }, [activePhoneId]);

  const categories = [
    { name: 'All', icon: Layout },
    { name: Category.STUDY_ABROAD, icon: GraduationCap },
    { name: Category.FINANCE, icon: Calculator },
    { name: Category.LEGAL, icon: Scale },
    { name: Category.STARTUP, icon: Briefcase },
    { name: Category.TECH, icon: Code },
  ];

  const addBookingToHistory = (id: string, type: 'video' | 'phone' | 'chat') => {
    const consultant = MOCK_CONSULTANTS.find(c => c.id === id);
    if (!consultant) return;

    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      consultantId: consultant.id,
      consultantName: consultant.name,
      consultantImageUrl: consultant.imageUrl,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now(),
      status: 'upcoming'
    };

    const existing = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    localStorage.setItem('user_bookings', JSON.stringify([newBooking, ...existing]));
  };

  const handleBooking = (id: string) => {
    setShowBookingModal(id);
  };

  const startVideoCall = (id: string) => {
    addBookingToHistory(id, 'video');
    setShowBookingModal(null);
    setActiveCallId(id);
  };

  const startChat = (id: string) => {
    addBookingToHistory(id, 'chat');
    setShowBookingModal(null);
    setActiveChatId(id);
  };

  const startPhoneCall = (id: string) => {
    addBookingToHistory(id, 'phone');
    setShowBookingModal(null);
    setActivePhoneId(id);
  };

  if (activeConsultantForCall) {
    return <VideoCall consultant={activeConsultantForCall} onEndCall={() => setActiveCallId(null)} />;
  }

  if (activeConsultantForChat) {
    return <ChatRoom consultant={activeConsultantForChat} onClose={() => setActiveChatId(null)} />;
  }

  if (activeConsultantForPhone) {
    return <PhoneCall consultant={activeConsultantForPhone} onEndCall={() => setActivePhoneId(null)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6">
          <div className="flex flex-col gap-6 text-lg font-semibold">
            <a href="#how" onClick={() => setIsMenuOpen(false)}>How it works</a>
            <a href="#experts" onClick={() => setIsMenuOpen(false)}>Find Experts</a>
            <button 
              onClick={() => {
                setCurrentView('expert-dashboard');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 text-slate-600"
            >
              <ProfessionalIcon className="w-5 h-5" />
              Expert Portal
            </button>
            <button 
              onClick={() => {
                setCurrentView('profile');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3"
            >
              <UserIcon className="w-5 h-5 text-orange-600" />
              My Profile
            </button>
          </div>
        </div>
      )}

      {currentView === 'profile' ? (
        <ProfileSection onBack={() => setCurrentView('home')} />
      ) : currentView === 'expert-dashboard' ? (
        <ProfessionalDashboard onBack={() => setCurrentView('home')} />
      ) : (
        <>
          {/* Hero Section */}
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
                  <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://picsum.photos/seed/${i+10}/100/100`} alt="User" />
                      ))}
                    </div>
                    <p>Trusted by <span className="font-bold text-gray-900">10,000+</span> professionals & students</p>
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

          {/* Categories Filter */}
          <section id="experts" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Verified Experts</h2>
                  <p className="text-gray-600">Select a category or use our AI to find the perfect match.</p>
                </div>
              </div>

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
                  <ConsultantCard 
                    key={consultant.id} 
                    consultant={consultant} 
                    onBook={handleBooking}
                  />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                  <Users className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">ConsultantHub</span>
              </div>
              <p className="text-gray-400 max-w-md text-lg">
                Making expert advice easily accessible and affordable to everyone, anytime they need it.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-orange-500">How it works</a></li>
                <li><a href="#" className="hover:text-orange-500">Find Consultants</a></li>
                <li><a href="#" className="hover:text-orange-500">Pricing</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold">Book Session</h3>
              <button onClick={() => setShowBookingModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X />
              </button>
            </div>
            <p className="text-gray-600 mb-8">
              Choose your preferred consultation method with <strong>{MOCK_CONSULTANTS.find(c => c.id === showBookingModal)?.name}</strong>.
            </p>
            <div className="space-y-4 mb-8">
              <button 
                onClick={() => startVideoCall(showBookingModal)}
                className="w-full p-4 border border-orange-200 bg-orange-50 rounded-2xl flex items-center justify-between hover:border-orange-500 hover:bg-orange-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                    <Video />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Live Video Consultation</p>
                    <p className="text-xs text-orange-700">Connect instantly (Beta)</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-orange-600" />
              </button>

              <button 
                onClick={() => startPhoneCall(showBookingModal)}
                className="w-full p-4 border border-green-200 bg-green-50 rounded-2xl flex items-center justify-between hover:border-green-500 hover:bg-green-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <Phone />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Phone Consultation</p>
                    <p className="text-xs text-green-700">Voice-only expert advice</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </button>

              <button 
                onClick={() => startChat(showBookingModal)}
                className="w-full p-4 border border-blue-200 bg-blue-50 rounded-2xl flex items-center justify-between hover:border-blue-500 hover:bg-blue-100 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <MessageSquare />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">Instant Chat</p>
                    <p className="text-xs text-blue-700">Message directly with expert</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
