
export enum Category {
  STUDY_ABROAD = 'Study Abroad',
  FINANCE = 'Finance & Tax',
  LEGAL = 'Legal Matters',
  STARTUP = 'Startup & Business',
  CAREER = 'Career Coaching',
  TECH = 'Technology'
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
}

export interface SessionPackage {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string; // ISO string or YYYY-MM-DD
  time: string; // HH:mm
  isAvailable: boolean;
}

export interface Consultant {
  id: string;
  name: string;
  category: Category;
  title: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  imageUrl: string;
  bannerUrl?: string;
  isVerified: boolean;
  description: string;
  location: string;
  statistics?: {
    totalMinutes: number;
    sessionsCompleted: number;
  };
  expertise?: string[];
  disciplines?: string[];
  industries?: string[];
  languages?: string[];
  experience?: Experience[];
  education?: Education[];
  sessionPackages?: SessionPackage[];
}

export interface Booking {
  id: string;
  consultantId: string;
  consultantName: string;
  consultantImageUrl: string;
  type: 'video' | 'phone' | 'chat';
  date: string;
  timestamp: number;
  status: 'completed' | 'upcoming';
  packageName?: string;
  duration?: string;
  price?: number;
}

export type CalendarProvider = 'google' | 'outlook' | 'none';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  savedConsultantIds?: string[];
  calendarProvider?: CalendarProvider;
}

export interface ExpertProfile extends UserProfile {
  title: string;
  category: Category;
  pricePerHour: number;
  isAvailable: boolean;
  totalEarnings: number;
}

export interface ScheduleItem {
  id: string;
  clientName: string;
  clientEmail: string;
  type: 'video' | 'phone' | 'chat';
  time: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  status: 'confirmed' | 'pending' | 'completed';
}
