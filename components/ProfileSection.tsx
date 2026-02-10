
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  History, 
  Save, 
  MapPin, 
  Mail, 
  Briefcase, 
  ExternalLink,
  ChevronRight,
  Bell,
  Lock,
  LogOut
} from 'lucide-react';
import { UserProfile, Booking } from '../types';

interface ProfileSectionProps {
  onBack: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'settings'>('bookings');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Looking for advice on scaling my SaaS startup and international tax law.',
    location: 'San Francisco, CA'
  });
  const [history, setHistory] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedBookings = localStorage.getItem('user_bookings');
    if (savedBookings) {
      const parsed: Booking[] = JSON.parse(savedBookings);
      setHistory(parsed.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: History },
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-orange-600" />
              )}
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-sm" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                {profile.email}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </div>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            Back to Search
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Sidebar */}
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
                    : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
            <div className="pt-8">
               <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Your Consultations</h2>
                  <span className="text-sm font-medium text-gray-500">{history.length} sessions total</span>
                </div>
                {history.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No sessions booked yet.</p>
                    <button onClick={onBack} className="mt-4 text-orange-600 font-bold hover:underline">Browse Consultants</button>
                  </div>
                ) : (
                  history.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={booking.consultantImageUrl} className="w-full h-full object-cover" alt={booking.consultantName} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-gray-900 text-lg">{booking.consultantName}</h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-500 capitalize font-medium">
                          <span className={`px-2 py-0.5 rounded ${
                            booking.type === 'video' ? 'bg-orange-50 text-orange-600' :
                            booking.type === 'chat' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {booking.type}
                          </span>
                          <span>•</span>
                          <span>{booking.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                           booking.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                         }`}>
                           {booking.status}
                         </span>
                         <button className="p-2 text-gray-400 hover:text-orange-600">
                           <ChevronRight className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button 
                      onClick={saveProfile}
                      className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-orange-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                      {isEditing ? (
                        <input 
                          value={profile.name} 
                          onChange={e => setProfile({...profile, name: e.target.value})}
                          className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold text-lg">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                      {isEditing ? (
                        <input 
                          value={profile.email} 
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-semibold text-lg">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location</label>
                    {isEditing ? (
                      <input 
                        value={profile.location} 
                        onChange={e => setProfile({...profile, location: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-semibold">{profile.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Short Bio</label>
                    {isEditing ? (
                      <textarea 
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
                      />
                    ) : (
                      <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-8">Platform Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Email Notifications</p>
                          <p className="text-xs text-gray-500 font-medium">Receive updates on your session requests</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-orange-600 rounded-full relative flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Privacy Mode</p>
                          <p className="text-xs text-gray-500 font-medium">Hide your profile from public expert search</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded-full relative flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
                  <h3 className="text-orange-900 font-bold mb-2">Want to consult?</h3>
                  <p className="text-orange-800 text-sm leading-relaxed mb-6">
                    Join our expert network and start earning by sharing your knowledge. Verify your credentials today.
                  </p>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-200">
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
