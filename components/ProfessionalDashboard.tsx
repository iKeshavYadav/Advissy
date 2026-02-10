
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  ChevronRight, 
  Settings, 
  User, 
  Save, 
  Power,
  TrendingUp,
  CheckCircle2,
  Phone,
  Video,
  MessageSquare,
  ArrowLeft,
  History,
  Shield,
  Bell,
  Lock,
  MoreVertical,
  Check,
  XCircle
} from 'lucide-react';
import { ExpertProfile, ScheduleItem, Category } from '../types';

interface ProfessionalDashboardProps {
  onBack: () => void;
}

type TabType = 'schedule' | 'history' | 'earnings' | 'profile' | 'personal' | 'settings';

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [expertProfile, setExpertProfile] = useState<ExpertProfile>(() => {
    const saved = localStorage.getItem('expert_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Sarah Jenkins',
      email: 'sarah.j@expert.hub',
      bio: 'Specializing in European admissions for over 10 years. I help students find their dream universities.',
      location: 'London, UK',
      title: 'Senior Education Consultant',
      category: Category.STUDY_ABROAD,
      pricePerHour: 80,
      isAvailable: true,
      totalEarnings: 12450
    };
  });
  
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('expert_schedule');
    return saved ? JSON.parse(saved) : [
      {
        id: 's1',
        clientName: 'Alex Thompson',
        clientEmail: 'alex.t@gmail.com',
        type: 'video',
        time: '14:30',
        date: 'Today',
        timestamp: Date.now() + 3600000,
        status: 'confirmed'
      },
      {
        id: 's2',
        clientName: 'Maria Garcia',
        clientEmail: 'm.garcia@outlook.com',
        type: 'chat',
        time: '16:00',
        date: 'Today',
        timestamp: Date.now() + 7200000,
        status: 'pending'
      },
      {
        id: 's3',
        clientName: 'James Wilson',
        clientEmail: 'j.wilson@me.com',
        type: 'phone',
        time: '10:00',
        date: 'Tomorrow',
        timestamp: Date.now() + 86400000,
        status: 'confirmed'
      }
    ];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('expert_settings');
    return saved ? JSON.parse(saved) : {
      instantBooking: false,
      publicVisibility: true,
      emailNotifications: true,
      desktopNotifications: false
    };
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('expert_profile', JSON.stringify(expertProfile));
  }, [expertProfile]);

  useEffect(() => {
    localStorage.setItem('expert_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('expert_settings', JSON.stringify(settings));
  }, [settings]);

  const upcomingSessions = useMemo(() => 
    schedule.filter(s => s.status !== 'completed'), [schedule]
  );

  const completedSessions = useMemo(() => 
    schedule.filter(s => s.status === 'completed'), [schedule]
  );

  const handleUpdateStatus = (id: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const saveProfile = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: Calendar, count: upcomingSessions.length },
    { id: 'history', label: 'History', icon: History },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Public Profile', icon: User },
    { id: 'personal', label: 'Personal Info', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={onBack}
              className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-2xl font-black">
                {expertProfile.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">Expert Dashboard</h1>
                <p className="text-slate-400 text-sm font-medium">{expertProfile.title}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className={`flex-1 md:flex-none flex items-center justify-between gap-3 px-6 py-3 rounded-2xl border transition-all ${expertProfile.isAvailable ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${expertProfile.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{expertProfile.isAvailable ? 'Live & Available' : 'Currently Offline'}</span>
                </div>
                <button 
                  onClick={() => setExpertProfile(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                  className={`p-1.5 rounded-lg transition-all ${expertProfile.isAvailable ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                >
                   <Power className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 space-y-2">
            <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all ${
                      isActive 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : ''}`} />
                      {tab.label}
                    </div>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Stats Sidebar Card */}
            <div className="bg-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p>
              <h3 className="text-3xl font-black mb-6">${expertProfile.totalEarnings.toLocaleString()}</h3>
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-orange-100">
                  <Clock className="w-3 h-3" /> 42m Avg response
                </div>
                <div className="px-2 py-1 bg-white/20 rounded-lg">Top 1%</div>
              </div>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1">
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">Upcoming Schedule</h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">Calendar Feed</button>
                  </div>
                </div>
                
                {upcomingSessions.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center border-2 border-dashed border-slate-100">
                    <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No upcoming bookings</h3>
                    <p className="text-slate-400 max-w-xs mx-auto text-sm">You're all caught up! New session requests will appear here as they arrive.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {upcomingSessions.map(item => (
                      <div key={item.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:border-orange-500/30 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                          item.type === 'video' ? 'bg-blue-50 text-blue-600' :
                          item.type === 'chat' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {item.type === 'video' ? <Video className="w-7 h-7" /> : item.type === 'chat' ? <MessageSquare className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <h3 className="font-black text-slate-900 text-xl">{item.clientName}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${
                              item.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 font-medium mb-3">{item.clientEmail}</p>
                          <div className="flex items-center justify-center sm:justify-start gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl">
                              <Clock className="w-3.5 h-3.5" /> {item.time}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl">
                              <Calendar className="w-3.5 h-3.5" /> {item.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 sm:pt-0">
                          {item.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                                className="px-6 py-3 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => handleUpdateStatus(item.id, 'completed')}
                                 className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-slate-200 transition-all"
                               >
                                 Mark Complete
                               </button>
                               <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all">
                                 <MoreVertical className="w-5 h-5" />
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">Session History</h2>
                </div>
                {completedSessions.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center border border-slate-100">
                    <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm font-medium">No completed sessions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedSessions.map(item => (
                      <div key={item.id} className="bg-white px-6 py-5 rounded-[28px] border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <Check className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{item.clientName}</h4>
                            <p className="text-xs text-slate-400 font-medium capitalize">{item.type} Session • {item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">+${expertProfile.pricePerHour}</p>
                          <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Paid out</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Public Expert Profile</h2>
                    <p className="text-slate-400 text-sm font-medium">This information is visible to clients in search results.</p>
                  </div>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-orange-100 transition-all"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={saveProfile}
                      className="px-6 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Professional Title</label>
                      {isEditing ? (
                        <input 
                          value={expertProfile.title} 
                          onChange={e => setExpertProfile({...expertProfile, title: e.target.value})}
                          className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-black text-xl">{expertProfile.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Expert Category</label>
                      {isEditing ? (
                        <select 
                          value={expertProfile.category} 
                          onChange={e => setExpertProfile({...expertProfile, category: e.target.value as Category})}
                          className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
                        >
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      ) : (
                        <p className="text-slate-900 font-black text-xl">{expertProfile.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Rate Per Hour (USD)</label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <input 
                            type="number"
                            value={expertProfile.pricePerHour} 
                            onChange={e => setExpertProfile({...expertProfile, pricePerHour: parseInt(e.target.value)})}
                            className="w-full p-4 pl-12 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
                          />
                        </div>
                      ) : (
                        <p className="text-slate-900 font-black text-3xl">${expertProfile.pricePerHour}<span className="text-sm font-bold text-slate-400"> / hour</span></p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Expert Bio & Experience</label>
                  {isEditing ? (
                    <textarea 
                      value={expertProfile.bio} 
                      onChange={e => setExpertProfile({...expertProfile, bio: e.target.value})}
                      className="w-full p-6 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 h-48 resize-none font-medium text-slate-600 leading-relaxed"
                    />
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                      <p className="text-slate-600 leading-relaxed font-medium">{expertProfile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Personal Information</h2>
                    <p className="text-slate-400 text-sm font-medium">Private details for identity verification and payouts.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Legal Full Name</label>
                      <p className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold">{expertProfile.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Payout Email</label>
                      <p className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold">{expertProfile.email}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900 rounded-[28px] text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-lg mb-1">Identity Verified</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Passport • Verified on Oct 2023</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                     <h4 className="text-sm font-black text-slate-900 mb-4">Verification Documents</h4>
                     <div className="flex gap-4">
                        <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                           <Shield className="w-4 h-4 text-orange-600" /> Professional Certification.pdf
                        </div>
                        <div className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                           <Shield className="w-4 h-4 text-orange-600" /> ID_Verification.jpg
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none" />
                  
                  <h2 className="text-2xl font-black text-slate-900 mb-10">Financial Performance</h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 border-b border-slate-100 pb-10 mb-10">
                    <div className="text-center md:text-left">
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Next Payout: Nov 1, 2023</p>
                      <p className="text-5xl font-black text-slate-900">$2,450<span className="text-2xl text-slate-300">.00</span></p>
                    </div>
                    <button className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-200">
                      Request Early Payout
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Last 30 Days</p>
                        <p className="text-2xl font-black text-slate-900">$4,820</p>
                        <div className="mt-2 flex items-center gap-1 text-green-600 font-bold text-xs">
                           <TrendingUp className="w-3 h-3" /> +12% from last month
                        </div>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Average Payout</p>
                        <p className="text-2xl font-black text-slate-900">$1,205</p>
                        <p className="mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Paid Weekly</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-12">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Platform Controls</h2>
                    <p className="text-slate-400 text-sm font-medium mb-10">Manage how you interact with clients and receive updates.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                          <div>
                            <p className="font-black text-slate-900 text-lg">Instant Booking</p>
                            <p className="text-xs text-slate-500 font-medium max-w-sm">Clients can automatically confirm sessions during your available slots without waiting for your approval.</p>
                          </div>
                          <button 
                            onClick={() => setSettings(s => ({ ...s, instantBooking: !s.instantBooking }))}
                            className={`w-14 h-8 rounded-full relative transition-all flex items-center px-1 ${settings.instantBooking ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all ${settings.instantBooking ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                              <Bell className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg">Email Alerts</p>
                              <p className="text-xs text-slate-500 font-medium">Get notified about new messages and session updates.</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSettings(s => ({ ...s, emailNotifications: !s.emailNotifications }))}
                            className={`w-14 h-8 rounded-full relative transition-all flex items-center px-1 ${settings.emailNotifications ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                              <Lock className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg">Public Visibility</p>
                              <p className="text-xs text-slate-500 font-medium">Toggle your profile's visibility in search and categories.</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSettings(s => ({ ...s, publicVisibility: !s.publicVisibility }))}
                            className={`w-14 h-8 rounded-full relative transition-all flex items-center px-1 ${settings.publicVisibility ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all ${settings.publicVisibility ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-red-600 font-black text-sm uppercase tracking-widest hover:text-red-700">
                       <XCircle className="w-5 h-5" /> Deactivate Expert Account
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
