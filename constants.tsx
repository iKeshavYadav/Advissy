
import { Category, Consultant } from './types';

export const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    category: Category.STUDY_ABROAD,
    title: 'Senior Education Consultant',
    rating: 4.9,
    reviews: 124,
    pricePerHour: 80,
    imageUrl: 'https://picsum.photos/seed/sarah/400/400',
    isVerified: true,
    description: 'Specializing in European and North American admissions for over 10 years.'
  },
  {
    id: '2',
    name: 'David Chen',
    category: Category.FINANCE,
    title: 'Chartered Accountant (CA)',
    rating: 4.8,
    reviews: 89,
    pricePerHour: 120,
    imageUrl: 'https://picsum.photos/seed/david/400/400',
    isVerified: true,
    description: 'Expert in international tax filing and corporate financial planning.'
  },
  {
    id: '3',
    name: 'Amanda Brooks',
    category: Category.LEGAL,
    title: 'Corporate Legal Advisor',
    rating: 5.0,
    reviews: 45,
    pricePerHour: 150,
    imageUrl: 'https://picsum.photos/seed/amanda/400/400',
    isVerified: true,
    description: 'Focusing on startup formation, IP protection, and contract law.'
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    category: Category.STARTUP,
    title: 'Venture Partner & Mentor',
    rating: 4.7,
    reviews: 67,
    pricePerHour: 200,
    imageUrl: 'https://picsum.photos/seed/marcus/400/400',
    isVerified: true,
    description: 'Former unicorn founder helping early-stage startups scale and raise capital.'
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    category: Category.CAREER,
    title: 'Executive Career Coach',
    rating: 4.9,
    reviews: 156,
    pricePerHour: 95,
    imageUrl: 'https://picsum.photos/seed/elena/400/400',
    isVerified: true,
    description: 'Helping professionals pivot into tech and leadership roles.'
  },
  {
    id: '6',
    name: 'Dr. Kevin Wu',
    category: Category.TECH,
    title: 'Cloud Solutions Architect',
    rating: 4.8,
    reviews: 32,
    pricePerHour: 175,
    imageUrl: 'https://picsum.photos/seed/kevin/400/400',
    isVerified: true,
    description: 'Deep expertise in AWS, Azure, and distributed systems architecture.'
  }
];

export const THEME_COLOR = '#f06529'; // The vibrant orange from the pitch deck
