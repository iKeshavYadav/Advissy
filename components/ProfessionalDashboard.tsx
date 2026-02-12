
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
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
  X,
  History,
  Check,
  ChevronLeft,
  Plus,
  RefreshCw,
  ExternalLink,
  /* Added Trash2 to imports */
  Trash2
} from 'lucide-react';
import { ExpertProfile, ScheduleItem, Category, AvailabilitySlot, CalendarProvider } from '../types';
import { generateCalendarUrl } from '../services/calendarService';

interface ProfessionalDashboardProps {
  onBack: () => void;
}

interface RescheduleModalProps {
  session: ScheduleItem;
  onClose: () => void;
  onConfirm: (id: string, newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ session, onClose, onConfirm }) => {
  const [newDate, setNewDate] = useState(session.date);
  const [newTime, setNewTime] = useState(session.time);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900">Reschedule Session</h3>
            <p className="text-slate-500 text-sm mt-1">Adjust timing for <strong>{session.clientName}</strong></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Date</label>
            <input 
              type="date" 
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Time</label>
            <input 
              type="time" 
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-900"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(session.id, newDate, newTime)}
            className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'earnings' | 'profile' | 'settings'>('schedule');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [reschedulingSession, setReschedulingSession] = useState<ScheduleItem | null>(null);
  const [showPastSessions, setShowPastSessions] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
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
      totalEarnings: 12450,
      calendarProvider: 'none'
    };
  });
  
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('expert_schedule');
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    return saved ? JSON.parse(saved) : [
      {
        id: 's1',
        clientName: 'Alex Thompson',
        clientEmail: 'alex.t@gmail.com',
        type: 'video',
        time: '14:30',
        date: today,
        timestamp: Date.now() + 3600000,
        status: 'confirmed'
      },
      {
        id: 's2',
        clientName: 'Maria Garcia',
        clientEmail: 'm.garcia@outlook.com',
        type: 'chat',
        time: '16:00',
        date: today,
        timestamp: Date.now() + 7200000,
        status: 'pending'
      },
      {
        id: 's3',
        clientName: 'James Wilson',
        clientEmail: 'j.wilson@me.com',
        type: 'phone',
        time: '10:00',
        date: tomorrow,
        timestamp: Date.now() + 86400000,
        status: 'confirmed'
      }
    ];
  });

  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
    const saved = localStorage.getItem('expert_availability');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('expert_profile', JSON.stringify(expertProfile));
  }, [expertProfile]);

  useEffect(() => {
    localStorage.setItem('expert_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('expert_availability', JSON.stringify(availability));
  }, [availability]);

  const handleSyncToCalendar = (session: ScheduleItem) => {
    if (!expertProfile.calendarProvider || expertProfile.calendarProvider === 'none') {
      setActiveTab('settings');
      alert('Please select a calendar provider in settings!');
      return;
    }

    const url = generateCalendarUrl({
      title: `Client Session: ${session.clientName}`,
      description: `ConsultantHub ${session.type} session with client ${session.clientEmail}`,
      location: `ConsultantHub ${session.type} Room`,
      startTime: session.timestamp,
      durationMinutes: 60
    }, expertProfile.calendarProvider);

    window.open(url, '_blank');
  };

  const saveProfile = () => {
    setIsEditing(false);
  };

  const handleUpdateStatus = (id: string, newStatus: 'confirmed' | 'completed') => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleRescheduleConfirm = (id: string, newDate: string, newTime: string) => {
    setSchedule(prev => prev.map(s => 
      s.id === id ? { ...s, date: newDate, time: newTime } : s
    ));
    setReschedulingSession(null);
  };

  const toggleAvailability = (date: string, time: string) => {
    const exists = availability.find(a => a.date === date && a.time === time);
    if (exists) {
      setAvailability(prev => prev.filter(a => !(a.date === date && a.time === time)));
    } else {
      setAvailability(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        date,
        time,
        isAvailable: true
      }]);
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startOffset = firstDay.getDay();
    
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month, -i),
        isCurrentMonth: false
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    const endOffset = 42 - days.length;
    for (let i = 1; i <= endOffset; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  }, [currentMonth]);

  const tabs = [
    { id: 'schedule', label: 'My Schedule', icon: CalendarIcon },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'profile', label: 'Expert Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredSchedule = schedule.filter(s => 
    showPastSessions ? s.status === 'completed' : s.status !== 'completed'
  );

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const sessionsOnSelectedDay = schedule.filter(s => s.date === selectedDateStr);
  const availabilityOnSelectedDay = availability.filter(a => a.date === selectedDateStr);

  return (
    <div className="min-h-screen bg-slate-50 pt-16 pb-24 text-[#2d1a10]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-white rounded-[1.25rem] shadow-xl shadow-orange-100 border border-orange-50 hover:text-orange-600 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-black tracking-tight">Expert Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${expertProfile.isAvailable ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <div className={`w-2 h-2 rounded-full ${expertProfile.isAvailable ? 'bg-orange-600 animate-pulse' : 'bg-slate-300'}`} />
                {expertProfile.isAvailable ? 'Open for Bookings' : 'Stepped Away'}
             </div>
             <button 
               onClick={() => setExpertProfile({...expertProfile, isAvailable: !expertProfile.isAvailable})}
               className={`p-3 rounded-2xl transition-all shadow-lg ${expertProfile.isAvailable ? 'bg-[#2d1a10] text-white shadow-[#2d1a10]/20' : 'bg-white text-slate-400 border border-slate-100'}`}
             >
                <Power className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <DollarSign className="w-7 h-7" />
            </div>
            <p className="text-[#8b7668] text-[10px] font-black uppercase tracking-widest mb-1">Lifetime Revenue</p>
            <p className="text-3xl font-black text-[#2d1a10] tracking-tighter">${expertProfile.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-[#8b7668] text-[10px] font-black uppercase tracking-widest mb-1">Network Size</p>
            <p className="text-3xl font-black text-[#2d1a10] tracking-tighter">124 Clients</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <p className="text-[#8b7668] text-[10px] font-black uppercase tracking-widest mb-1">Avg. Response</p>
            <p className="text-3xl font-black text-[#2d1a10] tracking-tighter">12m 40s</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange-100">
              <TrendingUp className="w-7 h-7" />
            </div>
            <p className="text-[#8b7668] text-[10px] font-black uppercase tracking-widest mb-1">Rank Projection</p>
            <p className="text-3xl font-black text-[#2d1a10] tracking-tighter">Top 1.2%</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                    activeTab === tab.id 
                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' 
                    : 'bg-white text-[#5c4a3d] hover:bg-orange-50 hover:text-orange-600 border border-transparent shadow-sm'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex bg-white rounded-2xl p-1.5 shadow-xl shadow-orange-100 border border-orange-50">
                    <button 
                      onClick={() => setViewMode('calendar')}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-[#2d1a10] text-white shadow-lg shadow-[#2d1a10]/20' : 'text-[#5c4a3d] hover:text-[#2d1a10]'}`}
                    >
                      Calendar
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-[#2d1a10] text-white shadow-lg shadow-[#2d1a10]/20' : 'text-[#5c4a3d] hover:text-[#2d1a10]'}`}
                    >
                      List View
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowPastSessions(!showPastSessions)}
                    className="text-[10px] font-black text-orange-600 uppercase tracking-[0.15em] hover:underline flex items-center gap-2 px-4"
                  >
                    <History className="w-3.5 h-3.5" />
                    {showPastSessions ? 'View Upcoming' : 'Session History'}
                  </button>
                </div>

                {viewMode === 'calendar' ? (
                  <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 bg-white p-8 rounded-[3rem] shadow-xl shadow-orange-100/30 border border-orange-50">
                      <div className="flex items-center justify-between mb-10 px-2">
                        <h3 className="text-xl font-black text-[#2d1a10] tracking-tight">
                          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                            className="p-3 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-2xl transition-all border border-orange-100 shadow-sm"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                            className="p-3 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-2xl transition-all border border-orange-100 shadow-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-3 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-[10px] font-black uppercase text-orange-300 tracking-[0.2em] mb-2">
                            {day}
                          </div>
                        ))}
                        {calendarDays.map((item, idx) => {
                          const dateStr = item.date.toISOString().split('T')[0];
                          const hasSessions = schedule.some(s => s.date === dateStr);
                          const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
                          const isToday = new Date().toISOString().split('T')[0] === dateStr;

                          return (
                            <button 
                              key={idx}
                              onClick={() => setSelectedDate(item.date)}
                              className={`aspect-square p-2 rounded-2xl relative transition-all flex flex-col items-center justify-center border ${
                                !item.isCurrentMonth ? 'opacity-20 pointer-events-none' : 
                                isSelected ? 'bg-[#2d1a10] border-[#2d1a10] text-white shadow-xl shadow-[#2d1a10]/30' : 
                                isToday ? 'bg-orange-50 border-orange-100 text-orange-600 font-black' :
                                'bg-white border-orange-50 hover:bg-orange-50 hover:border-orange-100 text-[#2d1a10]'
                              }`}
                            >
                              <span className="text-xs font-black">{item.date.getDate()}</span>
                              {hasSessions && (
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-orange-400' : 'bg-orange-600 animate-pulse'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="w-full xl:w-[22rem] bg-white p-8 rounded-[3rem] shadow-xl shadow-orange-100/30 border border-orange-50 flex flex-col">
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-1">Selected Date</h4>
                        <p className="text-2xl font-black text-[#2d1a10] leading-tight">
                          {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar pb-6">
                        <div>
                          <h5 className="text-[10px] font-black text-[#8b7668] uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-600" /> Booked Appointments
                          </h5>
                          {sessionsOnSelectedDay.length === 0 ? (
                            <div className="p-10 bg-orange-50/30 rounded-3xl border border-dashed border-orange-100 text-center">
                              <p className="text-[10px] font-black text-orange-300 uppercase leading-relaxed">No sessions found for this date.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {sessionsOnSelectedDay.map(session => (
                                <div key={session.id} className="p-4 bg-white border border-orange-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all">
                                  <div className="flex justify-between items-start mb-2">
                                     <p className="font-black text-[#2d1a10] text-sm">{session.clientName}</p>
                                     <span className="text-[10px] font-black text-orange-600">{session.time}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black uppercase text-orange-300 tracking-wider">{session.type} Call</span>
                                    <button 
                                      onClick={() => handleSyncToCalendar(session)}
                                      className="text-[9px] font-black uppercase text-orange-600 hover:underline"
                                    >
                                      Sync Cal
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <h5 className="text-[10px] font-black text-[#8b7668] uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-orange-600" /> Update Slots
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(time => {
                              const isAvailable = availability.some(a => a.date === selectedDateStr && a.time === time);
                              const isBooked = schedule.some(s => s.date === selectedDateStr && s.time === time);
                              
                              return (
                                <button
                                  key={time}
                                  disabled={isBooked}
                                  onClick={() => toggleAvailability(selectedDateStr, time)}
                                  className={`p-3 rounded-2xl text-[10px] font-black border transition-all ${
                                    isBooked ? 'bg-orange-50 text-orange-200 border-orange-100 cursor-not-allowed' :
                                    isAvailable ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100' :
                                    'bg-white text-[#5c4a3d] border-orange-100 hover:border-orange-500'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSchedule.length === 0 ? (
                      <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-orange-100 text-center">
                        <CalendarIcon className="w-16 h-16 text-orange-100 mx-auto mb-6" />
                        <p className="text-[#5c4a3d] font-black uppercase text-xs tracking-widest">Your schedule is currently empty.</p>
                      </div>
                    ) : (
                      filteredSchedule.map(item => (
                        <div key={item.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50 flex flex-col md:flex-row items-center gap-8 group hover:border-orange-300 transition-all">
                          <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center flex-shrink-0 shadow-lg ${
                            item.type === 'video' ? 'bg-orange-600 text-white shadow-orange-200' :
                            item.type === 'chat' ? 'bg-[#2d1a10] text-white shadow-orange-100' : 'bg-amber-500 text-white shadow-amber-200'
                          }`}>
                            {item.type === 'video' ? <Video className="w-8 h-8" /> : item.type === 'chat' ? <MessageSquare className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
                          </div>
                          
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="font-black text-[#2d1a10] text-2xl tracking-tight leading-none mb-2">{item.clientName}</h3>
                            <p className="text-sm text-[#5c4a3d] font-bold mb-4">{item.clientEmail}</p>
                            <div className="flex items-center justify-center md:justify-start gap-5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
                              <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-600" /> {item.time}
                              </span>
                              <span className="opacity-30">•</span>
                              <span>{item.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center md:items-end gap-4">
                            {item.status === 'pending' ? (
                              <div className="flex gap-3">
                                <button 
                                  onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                                  className="px-6 py-3 bg-orange-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100"
                                >
                                  Accept
                                </button>
                                <button className="px-6 py-3 bg-white text-[#5c4a3d] rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 border border-orange-100">Ignore</button>
                              </div>
                            ) : item.status === 'confirmed' ? (
                              <div className="flex flex-col items-end gap-3">
                                <div className="flex items-center gap-3">
                                  <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-orange-100">Session Confirmed</span>
                                  <button 
                                    onClick={() => handleSyncToCalendar(item)}
                                    className="p-2.5 bg-[#2d1a10] text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100/20"
                                    title="Sync to External Calendar"
                                  >
                                    <CalendarIcon className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                                    className="p-2.5 bg-orange-600 text-white rounded-xl hover:bg-[#2d1a10] transition-all shadow-lg shadow-orange-100"
                                    title="Mark as Finished"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                </div>
                                <button 
                                  onClick={() => setReschedulingSession(item)}
                                  className="text-[9px] font-black uppercase tracking-widest text-orange-300 hover:text-orange-600 transition-colors"
                                >
                                  Modify Schedule
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="px-5 py-2 bg-orange-50 text-[#8b7668] rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                                  Completed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-orange-100/30 border border-orange-50 animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-[#2d1a10]">Expert Profile Details</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Edit Public Details
                    </button>
                  ) : (
                    <button 
                      onClick={saveProfile}
                      className="bg-[#2d1a10] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Publish Changes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-3">Professional Title</label>
                      {isEditing ? (
                        <input 
                          value={expertProfile.title} 
                          onChange={e => setExpertProfile({...expertProfile, title: e.target.value})}
                          className="w-full p-4 rounded-2xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        />
                      ) : (
                        <p className="text-[#2d1a10] font-black text-xl leading-tight">{expertProfile.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-3">Primary Category</label>
                      {isEditing ? (
                        <select 
                          value={expertProfile.category} 
                          onChange={e => setExpertProfile({...expertProfile, category: e.target.value as Category})}
                          className="w-full p-4 rounded-2xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                        >
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      ) : (
                        <p className="text-[#2d1a10] font-black text-xl leading-tight">{expertProfile.category}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-3">Hourly Consulting Rate</label>
                      {isEditing ? (
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
                          <input 
                            type="number"
                            value={expertProfile.pricePerHour} 
                            onChange={e => setExpertProfile({...expertProfile, pricePerHour: parseInt(e.target.value)})}
                            className="w-full pl-10 pr-4 py-4 rounded-2xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                          />
                        </div>
                      ) : (
                        <p className="text-[#2d1a10] font-black text-3xl tracking-tighter">${expertProfile.pricePerHour}<span className="text-sm font-bold text-orange-300">/hr</span></p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <label className="block text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-3">Public Biography</label>
                  {isEditing ? (
                    <textarea 
                      value={expertProfile.bio} 
                      onChange={e => setExpertProfile({...expertProfile, bio: e.target.value})}
                      className="w-full p-6 rounded-3xl border border-orange-50 bg-orange-50/20 outline-none focus:ring-2 focus:ring-orange-500 h-48 resize-none font-bold text-[#5c4a3d]"
                    />
                  ) : (
                    <p className="text-[#5c4a3d] leading-relaxed text-base font-medium">{expertProfile.bio}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-orange-100/30 border border-orange-50">
                  <h2 className="text-2xl font-black text-[#2d1a10] mb-10">Revenue Center</h2>
                  <div className="flex flex-col md:flex-row items-center gap-10 border-b pb-12 border-orange-50 mb-12">
                    <div className="text-center md:text-left flex-1">
                      <p className="text-orange-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Unlocked for Payout</p>
                      <p className="text-5xl font-black text-[#2d1a10] tracking-tighter">$2,450.00</p>
                      <p className="text-[11px] text-[#8b7668] font-bold mt-2 italic">*Next payout cycle: Nov 15th</p>
                    </div>
                    <button className="bg-[#2d1a10] text-white px-10 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-200 h-16">
                      Transfer to Bank
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-orange-300 uppercase tracking-[0.2em] mb-4">Historical Transactions</h3>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-6 bg-orange-50/20 rounded-3xl border border-orange-50">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-black text-[#2d1a10] text-sm">Consultation Success #{1024 + i}</p>
                            <p className="text-[10px] text-orange-300 uppercase font-black tracking-widest">Confirmed • Oct {20 + i}, 2023</p>
                          </div>
                        </div>
                        <p className="font-black text-orange-600 text-xl tracking-tight">+${expertProfile.pricePerHour}.00</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-orange-100/30 border border-orange-50">
                   <h2 className="text-2xl font-black text-[#2d1a10] mb-10">Calendar Sync</h2>
                   
                   <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 mb-10">
                      <div className="flex items-center gap-5 mb-6">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-xl shadow-orange-200/50">
                            <CalendarIcon className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-[#2d1a10]">External Calendar Provider</p>
                            <p className="text-[10px] text-[#8b7668] font-black uppercase tracking-widest">Sessions will be exported to this calendar</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {(['google', 'outlook', 'none'] as const).map((provider) => (
                           <button
                             key={provider}
                             onClick={() => {
                               const updated = { ...expertProfile, calendarProvider: provider };
                               setExpertProfile(updated);
                               localStorage.setItem('expert_profile', JSON.stringify(updated));
                             }}
                             className={`flex items-center justify-center gap-3 py-5 rounded-[1.5rem] border-2 transition-all font-black uppercase tracking-widest text-xs ${
                               expertProfile.calendarProvider === provider
                                 ? 'bg-[#2d1a10] border-[#2d1a10] text-white shadow-2xl shadow-[#2d1a10]/20'
                                 : 'bg-white border-orange-100 text-[#5c4a3d] hover:border-orange-600'
                             }`}
                           >
                             {provider === 'google' && <RefreshCw className="w-4 h-4" />}
                             {provider === 'outlook' && <ExternalLink className="w-4 h-4" />}
                             {provider}
                           </button>
                         ))}
                      </div>
                   </div>

                   <h2 className="text-2xl font-black text-[#2d1a10] mb-8">System Preferences</h2>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between p-8 rounded-[2rem] bg-orange-50/20 border border-orange-50">
                         <div>
                            <p className="font-black text-[#2d1a10] text-lg">Instant Approval</p>
                            <p className="text-xs text-[#5c4a3d] font-bold">Clients can book available slots without manual confirmation</p>
                         </div>
                         <div className="w-14 h-7 bg-orange-600 rounded-full relative flex items-center px-1.5 shadow-inner cursor-pointer">
                            <div className="w-5 h-5 bg-white rounded-full ml-auto shadow-md" />
                         </div>
                      </div>

                      <div className="flex items-center justify-between p-8 rounded-[2rem] bg-orange-50/20 border border-orange-50">
                         <div>
                            <p className="font-black text-[#2d1a10] text-lg">Profile Discovery</p>
                            <p className="text-xs text-[#5c4a3d] font-bold">List your profile in the main ConsultantHub search results</p>
                         </div>
                         <div className="w-14 h-7 bg-orange-600 rounded-full relative flex items-center px-1.5 shadow-inner cursor-pointer">
                            <div className="w-5 h-5 bg-white rounded-full ml-auto shadow-md" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#2d1a10] p-10 rounded-[3rem] text-white shadow-2xl shadow-orange-100 border border-white/5">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-red-600 rounded-2xl shadow-xl shadow-red-900/40">
                         <Trash2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black">Danger Zone</h3>
                   </div>
                   <p className="text-orange-200/60 text-sm font-bold mb-8 leading-relaxed max-w-md">Deleting your account is permanent. All historical data, client lists, and outstanding revenue will be forfeited.</p>
                   <button className="px-8 py-3 bg-white/10 hover:bg-red-600 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                      Delete My Expert Account
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {reschedulingSession && (
        <RescheduleModal 
          session={reschedulingSession} 
          onClose={() => setReschedulingSession(null)}
          onConfirm={handleRescheduleConfirm}
        />
      )}
    </div>
  );
};
