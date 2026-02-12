
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MessageSquare, 
  Heart, 
  MoreHorizontal, 
  Globe, 
  Linkedin, 
  ShieldCheck,
  Star,
  Clock,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Consultant } from '../types';

interface ExpertProfilePageProps {
  consultant: Consultant;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onBookSession: (id: string) => void;
}

export const ExpertProfilePage: React.FC<ExpertProfilePageProps> = ({ 
  consultant, 
  onBack, 
  isSaved, 
  onToggleSave,
  onBookSession
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'achievements' | 'groups'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: `Reviews ${consultant.reviews}` },
    { id: 'achievements', label: 'Achievements' },
    { id: 'groups', label: 'Group sessions' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="sticky top-0 z-[60] bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Browse consultants</span>
        </button>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors">
            Book a session
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        <img 
          src={consultant.bannerUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200&h=400'} 
          className="w-full h-full object-cover" 
          alt="Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative -mt-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Info Column */}
          <div className="flex-1">
            <div className="flex items-end gap-6 mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white">
                  <img src={consultant.imageUrl} className="w-full h-full object-cover" alt={consultant.name} />
                </div>
                {consultant.isVerified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-[4px] border-white shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-gray-900 leading-tight">
                    {consultant.name} <span className="text-gray-400 font-medium text-2xl ml-1 uppercase">{consultant.location.split(',')[1]?.trim() || 'US'}</span>
                  </h1>
                </div>
                <p className="text-lg font-bold text-gray-600">
                  {consultant.title}
                </p>
              </div>
              <div className="flex items-center gap-3 pb-4">
                <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-gray-500">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onToggleSave(consultant.id)}
                  className={`p-3 border rounded-2xl transition-all ${isSaved ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all text-gray-500">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Switcher */}
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                {/* About Bio */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">About {consultant.name.split(' ')[0]}</h3>
                  <p className="text-gray-700 leading-relaxed max-w-3xl mb-4 font-medium">
                    {consultant.description}
                  </p>
                  <button className="text-orange-600 font-bold text-sm hover:underline">Show more</button>
                  <div className="flex items-center gap-4 mt-6">
                    <button className="p-2 text-gray-400 hover:text-gray-900"><Linkedin className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-900"><Globe className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Profile Insights */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Profile insights</h3>
                    <button className="text-xs font-bold text-orange-600 hover:underline">What's this?</button>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4 max-w-md">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Clear Communicator</p>
                      <p className="text-xs text-gray-500 mt-1">100% of mentees agree that they are great at communication.</p>
                    </div>
                  </div>
                </div>

                {/* Background Details */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Background</h3>
                  <div className="space-y-6 border border-gray-100 rounded-[2.5rem] p-8">
                    {[
                      { label: 'Expertise', items: consultant.expertise || [consultant.category] },
                      { label: 'Disciplines', items: consultant.disciplines || ['Consulting', 'Advisory'] },
                      { label: 'Industries', items: consultant.industries || ['Services'] },
                      { label: 'Fluent in', items: consultant.languages || ['English'] }
                    ].map((row, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center py-4 first:pt-0 last:pb-0 border-b border-gray-50 last:border-0 gap-4 sm:gap-12">
                        <span className="text-xs font-bold text-gray-400 w-32 uppercase tracking-wider">{row.label}</span>
                        <div className="flex flex-wrap gap-2">
                          {row.items?.map((item, idx) => (
                            <span key={idx} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              row.label === 'Expertise' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
                            }`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Experience <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg ml-2">{consultant.experience?.length || 0}</span></h3>
                    <button className="text-xs font-bold text-orange-600 hover:underline">View all</button>
                  </div>
                  <div className="space-y-10">
                    {consultant.experience?.map((exp, idx) => (
                      <div key={idx} className="flex gap-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                              <p className="text-sm text-gray-500 font-medium">{exp.company}</p>
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{exp.period}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:w-96">
            <div className="sticky top-24 space-y-8">
              
              {/* Community Stats Widget */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Community statistics</h3>
                  <button className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">See more <ChevronLeft className="w-3 h-3 rotate-180" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm mb-4">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-gray-900">{consultant.statistics?.totalMinutes || 0} mins</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total session time</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-500 shadow-sm mb-4">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-gray-900">{consultant.statistics?.sessionsCompleted || 0}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sessions completed</p>
                  </div>
                </div>
              </div>

              {/* Booking Packages Widget */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-2">Available sessions</h3>
                <p className="text-xs text-gray-400 font-medium mb-8">Choose from our curated consultation packages</p>
                
                <div className="space-y-6">
                  {consultant.sessionPackages?.map((pkg) => (
                    <div key={pkg.id} className="group relative">
                      <div className="bg-gray-50 rounded-3xl p-6 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:shadow-gray-100 group-hover:border-transparent border border-transparent">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <span className="bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg mb-2 inline-block">Advance</span>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{pkg.name}</h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{pkg.duration}</p>
                          </div>
                          <button 
                            onClick={() => onBookSession(consultant.id)}
                            className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200 ml-2"
                          >
                            Book
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-gray-900">${pkg.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="p-6 bg-gray-50 rounded-3xl">
                       <h4 className="font-bold text-gray-900 text-sm mb-2">Standard Session</h4>
                       <p className="text-xs text-gray-500 mb-4">Book a standard 1-on-1 session.</p>
                       <button 
                          onClick={() => onBookSession(consultant.id)}
                          className="w-full bg-gray-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-orange-600 transition-all"
                       >
                         Book Now • ${consultant.pricePerHour}/hr
                       </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
