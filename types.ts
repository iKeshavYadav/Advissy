
export enum Category {
  STUDY_ABROAD = 'Study Abroad',
  FINANCE = 'Finance & Tax',
  LEGAL = 'Legal Matters',
  STARTUP = 'Startup & Business',
  CAREER = 'Career Coaching',
  TECH = 'Technology'
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
  isVerified: boolean;
  description: string;
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
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  avatarUrl?: string;
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
  date: string;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'completed';
}
