
import React, { useState, useEffect } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { ExpertProfile, ScheduleItem, Category } from '../types';

interface ProfessionalDashboardProps {
  onBack: () => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'earnings' | 'profile' | 'settings'>('schedule');
  const [expertProfile, setExpertProfile] = useState<ExpertProfile>({
    name: 'Sarah Jenkins',
    email: 'sarah.j@expert.hub',
    bio: 'Specializing in European admissions for over 10 years. I help students find their dream universities.',
    location: 'London, UK',
    title: 'Senior Education Consultant',
    category: Category.STUDY_ABROAD,
    pricePerHour: 80,
    isAvailable: true,
    totalEarnings: 12450
  });
  
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
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
  ]);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('expert_profile');
    if (saved) setExpertProfile(JSON.parse(saved));
    
    const savedSchedule = localStorage.getItem('expert_schedule');
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
  }, []);

  const saveProfile = () => {
    localStorage.setItem('expert_profile', JSON.stringify(expertProfile));
    setIsEditing(false);
  };

  const tabs = [
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Expert Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black text-slate-900">Expert Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest ${expertProfile.isAvailable ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <div className={`w-2 h-2 rounded-full ${expertProfile.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                {expertProfile.isAvailable ? 'Available for calls' : 'Offline'}
             </div>
             <button 
               onClick={() => setExpertProfile({...expertProfile, isAvailable: !expertProfile.isAvailable})}
               className={`p-2 rounded-xl transition-all ${expertProfile.isAvailable ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
             >
                <Power className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Earnings</p>
            <p className="text-2xl font-bold text-slate-900">${expertProfile.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Active Clients</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Avg. Response</p>
            <p className="text-2xl font-bold text-slate-900">42m</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-slate-900">98%</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Navigation */}
          <div className="w-full lg:w-64 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
                    : 'bg-white text-slate-500 hover:bg-orange-50 hover:text-orange-600 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="flex-1">
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
                  <button className="text-sm font-bold text-orange-600 hover:underline">Sync to Calendar</button>
                </div>
                
                <div className="space-y-4">
                  {schedule.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:border-orange-200 transition-all">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        item.type === 'video' ? 'bg-blue-50 text-blue-600' :
                        item.type === 'chat' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {item.type === 'video' ? <Video /> : item.type === 'chat' ? <MessageSquare /> : <Phone />}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-slate-900 text-lg">{item.clientName}</h3>
                        <p className="text-sm text-slate-500 font-medium">{item.clientEmail}</p>
                        <div className="mt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3 h-3" /> {item.time}
                          </span>
                          <span className="text-slate-200">|</span>
                          <span className="text-slate-400">{item.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.status === 'pending' ? (
                          <>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">Accept</button>
                            <button className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-200">Decline</button>
                          </>
                        ) : (
                          <div className="flex flex-col items-end gap-2">
                             <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Confirmed</span>
                             <button className="text-xs font-bold text-slate-400 hover:text-orange-600">Reschedule</button>
                          </div>
                        )}
                        <button className="p-2 text-slate-300 hover:text-slate-900">
                          <ChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-slate-900">Expert Profile Details</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      Edit Public Profile
                    </button>
                  ) : (
                    <button 
                      onClick={saveProfile}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Expert Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Title</label>
                      {isEditing ? (
                        <input 
                          value={expertProfile.title} 
                          onChange={e => setExpertProfile({...expertProfile, title: e.target.value})}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold text-lg">{expertProfile.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Expert Category</label>
                      {isEditing ? (
                        <select 
                          value={expertProfile.category} 
                          onChange={e => setExpertProfile({...expertProfile, category: e.target.value as Category})}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      ) : (
                        <p className="text-slate-900 font-bold text-lg">{expertProfile.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Consultation Fee ($/hr)</label>
                      {isEditing ? (
                        <input 
                          type="number"
                          value={expertProfile.pricePerHour} 
                          onChange={e => setExpertProfile({...expertProfile, pricePerHour: parseInt(e.target.value)})}
                          className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-slate-900 font-bold text-lg">${expertProfile.pricePerHour}/hour</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Professional Bio</label>
                  {isEditing ? (
                    <textarea 
                      value={expertProfile.bio} 
                      onChange={e => setExpertProfile({...expertProfile, bio: e.target.value})}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 h-40 resize-none"
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-sm">{expertProfile.bio}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 mb-8">Payout Overview</h2>
                  <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8 border-slate-50 mb-8">
                    <div className="text-center md:text-left">
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Available for Payout</p>
                      <p className="text-4xl font-black text-slate-900">$2,450.00</p>
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-slate-200">
                      Withdraw Funds
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Transactions</h3>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Consultation Session #{1024 + i}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Oct {20 + i}, 2023</p>
                          </div>
                        </div>
                        <p className="font-black text-slate-900">+${expertProfile.pricePerHour}.00</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                 <h2 className="text-xl font-bold text-slate-900 mb-4">Account Settings</h2>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50">
                       <div>
                          <p className="font-bold text-slate-900">Instant Booking</p>
                          <p className="text-xs text-slate-500 font-medium">Clients can book available slots without your manual approval</p>
                       </div>
                       <div className="w-12 h-6 bg-orange-600 rounded-full relative flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50">
                       <div>
                          <p className="font-bold text-slate-900">Public Profile Visibility</p>
                          <p className="text-xs text-slate-500 font-medium">Show your profile in the "Find Experts" search</p>
                       </div>
                       <div className="w-12 h-6 bg-orange-600 rounded-full relative flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
