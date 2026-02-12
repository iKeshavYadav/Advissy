
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Settings, 
  History, 
  Save, 
  MapPin, 
  Mail, 
  ChevronRight, 
  Bell, 
  Lock, 
  LogOut, 
  Heart,
  Calendar as CalendarIcon,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { UserProfile, Booking, CalendarProvider } from '../types';
import { MOCK_CONSULTANTS } from '../constants.tsx';
import { ConsultantCard } from './ConsultantCard';
import { generateCalendarUrl, parseDuration } from '../services/calendarService';

interface ProfileSectionProps {
  onBack: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'settings' | 'saved'>('bookings');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Looking for advice on scaling my SaaS startup and international tax law.',
    location: 'San Francisco, CA',
    savedConsultantIds: [],
    calendarProvider: 'none'
  });
  const [history, setHistory] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedBookings = localStorage.getItem('user_bookings');
    if (savedBookings) {
      const parsed: Booking[] = JSON.parse(savedBookings);
      setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp));
    }

    const savedIds = localStorage.getItem('saved_consultant_ids');
    if (savedIds) {
      setProfile(prev => ({ ...prev, savedConsultantIds: JSON.parse(savedIds) }));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleSyncToCalendar = (booking: Booking) => {
    if (!profile.calendarProvider || profile.calendarProvider === 'none') {
      setActiveTab('settings');
      alert('Please select a calendar provider in settings first!');
      return;
    }

    const url = generateCalendarUrl({
      title: `${booking.packageName} with ${booking.consultantName}`,
      description: `ConsultantHub ${booking.type} session. Total Paid: $${booking.price?.toFixed(2)}`,
      location: `ConsultantHub ${booking.type} Room`,
      startTime: booking.timestamp,
      durationMinutes: parseDuration(booking.duration || '60')
    }, profile.calendarProvider);

    window.open(url, '_blank');
  };

  const handleToggleSave = (id: string) => {
    const updatedIds = profile.savedConsultantIds?.includes(id)
      ? profile.savedConsultantIds.filter(sid => sid !== id)
      : [...(profile.savedConsultantIds || []), id];
    
    setProfile(prev => ({ ...prev, savedConsultantIds: updatedIds }));
    localStorage.setItem('saved_consultant_ids', JSON.stringify(updatedIds));
  };

  const savedConsultants = useMemo(() => {
    return MOCK_CONSULTANTS.filter(c => profile.savedConsultantIds?.includes(c.id));
  }, [profile.savedConsultantIds]);

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: History },
    { id: 'saved', label: 'Saved Experts', icon: Heart },
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-orange-50/20 pt-16 pb-24 text-[#2d1a10]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-orange-100/50 border border-orange-50 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-orange-600" />
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-[#2d1a10] mb-2">{profile.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-[#5c4a3d] font-bold">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-orange-600" />
                {profile.email}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600" />
                {profile.location}
              </div>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-[#2d1a10] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
          >
            Back to Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                    activeTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' 
                    : 'bg-white text-[#5c4a3d] hover:bg-orange-50 hover:text-orange-600 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
            <div className="pt-8">
               <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-[#2d1a10]">Your Consultations</h2>
                  <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{history.length} sessions</span>
                </div>
                {history.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-orange-100">
                    <History className="w-12 h-12 text-orange-200 mx-auto mb-4" />
                    <p className="text-[#5c4a3d] font-bold">No sessions booked yet.</p>
                    <button onClick={onBack} className="mt-4 text-orange-600 font-black uppercase text-xs tracking-widest hover:underline">Browse Consultants</button>
                  </div>
                ) : (
                  history.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-orange-100/30 border border-orange-50 flex flex-col sm:flex-row items-center gap-6 group hover:border-orange-200 transition-all">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                        <img src={booking.consultantImageUrl} className="w-full h-full object-cover" alt={booking.consultantName} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-black text-[#2d1a10] text-lg leading-tight">{booking.consultantName}</h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-[10px] text-[#5c4a3d] font-black uppercase tracking-widest">
                          <span className={`px-2 py-0.5 rounded-lg ${
                            booking.type === 'video' ? 'bg-orange-600 text-white' :
                            booking.type === 'chat' ? 'bg-[#2d1a10] text-white' : 'bg-amber-500 text-white'
                          }`}>
                            {booking.type} Call
                          </span>
                          <span className="text-orange-200">•</span>
                          <span>{booking.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                          onClick={() => handleSyncToCalendar(booking)}
                          className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                         >
                           <CalendarIcon className="w-3.5 h-3.5" />
                           Sync
                         </button>
                         <button className="p-2 text-orange-200 hover:text-orange-600">
                           <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-[#2d1a10]">Bookmarked Experts</h2>
                </div>
                {savedConsultants.length === 0 ? (
                  <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-orange-100">
                    <Heart className="w-12 h-12 text-orange-200 mx-auto mb-4" />
                    <p className="text-[#5c4a3d] font-bold">No saved experts yet.</p>
                    <button onClick={onBack} className="mt-4 text-orange-600 font-black uppercase text-xs tracking-widest hover:underline">Explore Experts</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedConsultants.map(c => (
                      <ConsultantCard 
                        key={c.id} 
                        consultant={c} 
                        onBook={onBack} 
                        isSaved={true}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-orange-100/30 border border-orange-50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[#2d1a10]">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={saveProfile}
                      className="bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Full Name</label>
                      {isEditing ? (
                        <input 
                          value={profile.name} 
                          onChange={e => setProfile({...profile, name: e.target.value})}
                          className="w-full p-4 rounded-xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                      ) : (
                        <p className="text-[#2d1a10] font-bold text-lg">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Email Address</label>
                      {isEditing ? (
                        <input 
                          value={profile.email} 
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="w-full p-4 rounded-xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                      ) : (
                        <p className="text-[#2d1a10] font-bold text-lg">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Location</label>
                    {isEditing ? (
                      <input 
                        value={profile.location} 
                        onChange={e => setProfile({...profile, location: e.target.value})}
                        className="w-full p-4 rounded-xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                      />
                    ) : (
                      <p className="text-[#2d1a10] font-bold">{profile.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2">Short Bio</label>
                    {isEditing ? (
                      <textarea 
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full p-4 rounded-xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none font-bold"
                      />
                    ) : (
                      <p className="text-[#5c4a3d] leading-relaxed font-medium">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-orange-100/30 border border-orange-50">
                  <h2 className="text-xl font-black text-[#2d1a10] mb-8">Calendar Integration</h2>
                  <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mb-8">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                           <CalendarIcon className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-black text-[#2d1a10]">Auto-Sync Provider</p>
                           <p className="text-[10px] text-[#5c4a3d] font-black uppercase tracking-widest mt-0.5">Choose where to sync your sessions</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['google', 'outlook', 'none'] as const).map((provider) => (
                          <button
                            key={provider}
                            onClick={() => {
                              const updated = { ...profile, calendarProvider: provider };
                              setProfile(updated);
                              localStorage.setItem('user_profile', JSON.stringify(updated));
                            }}
                            className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[10px] ${
                              profile.calendarProvider === provider
                                ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100'
                                : 'bg-white border-orange-100 text-[#5c4a3d] hover:border-orange-500'
                            }`}
                          >
                            {provider === 'google' && <RefreshCw className="w-3.5 h-3.5" />}
                            {provider === 'outlook' && <ExternalLink className="w-3.5 h-3.5" />}
                            {provider}
                          </button>
                        ))}
                     </div>
                  </div>

                  <h2 className="text-xl font-black text-[#2d1a10] mb-8">Platform Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-orange-50/30 rounded-3xl border border-orange-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                          <Bell className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-[#2d1a10]">Email Notifications</p>
                          <p className="text-[10px] text-[#5c4a3d] font-black uppercase tracking-widest mt-0.5">Updates on session requests</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-orange-600 rounded-full relative flex items-center px-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-orange-50/30 rounded-3xl border border-orange-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2d1a10] shadow-sm">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-[#2d1a10]">Privacy Mode</p>
                          <p className="text-[10px] text-[#5c4a3d] font-black uppercase tracking-widest mt-0.5">Hide profile from search</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-orange-100 rounded-full relative flex items-center px-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#2d1a10] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-100">
                  <h3 className="text-xl font-black mb-2">Want to consult?</h3>
                  <p className="text-orange-200 text-sm leading-relaxed mb-8 font-medium">
                    Join our expert network and start earning by sharing your knowledge. Apply for verification today.
                  </p>
                  <button className="bg-orange-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:scale-105 transition-all">
                    Apply Now
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
