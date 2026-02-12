
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
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
    bannerUrl: 'https://images.unsplash.com/photo-1513258496099-48168024adb0?auto=format&fit=crop&q=80&w=1200&h=400',
    isVerified: true,
    location: 'Berlin, Germany',
    description: 'Senior Visual Creative Design Guide | UI/UX, Branding and Packaging Specialist. With nearly 20 years of experience, I\'ve discovered that every brand holds a unique story waiting to be told. I specialize in crafting distinctive brand identities—whether digital, print, or motion.',
    statistics: {
      totalMinutes: 4090,
      sessionsCompleted: 98
    },
    expertise: ['Design', 'Marketing'],
    disciplines: ['Graphic Design', 'UX Design', 'Branding'],
    industries: ['Tech', 'Education', 'Creatives'],
    languages: ['English', 'German'],
    experience: [
      {
        title: 'Multidisciplinary Design & Operations Director',
        company: 'Omaha Victoria',
        period: 'JAN 2022 - PRESENT',
        description: 'Creative guide specializing in brand sustainability. As a full-stack visual creative director at Omaha Victoria Design Studio, I specialize in crafting innovative visual identities.'
      },
      {
        title: 'Senior UI/UX Designer',
        company: 'Global EdTech Corp',
        period: '2018 - 2021',
        description: 'Led the redesign of the student application portal, increasing conversion by 40%.'
      }
    ],
    education: [
      {
        degree: 'Visual Media',
        school: 'BFA'
      }
    ],
    sessionPackages: [
      { id: 'p1', name: '1-of-a-kind session', duration: '60 minutes', price: 70, description: 'Book 1:1 sessions from the options based on your needs.' },
      { id: 'p2', name: '4-Session Package', duration: '60 minutes, Weekly, 4 sessions', price: 260, description: 'Deep dive into your portfolio and career strategy.' },
      { id: 'p3', name: 'Mentorship Kickoff', duration: '20 minutes', price: 23, description: 'Connect, Ask, Explore. A quick intro to see if we are a match.' }
    ]
  },
  {
    id: '2',
    name: 'David Chen',
    category: Category.FINANCE,
    title: 'Chartered Accountant (CA)',
    rating: 4.8,
    reviews: 89,
    pricePerHour: 120,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    bannerUrl: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=1200&h=400',
    isVerified: true,
    location: 'Vancouver, Canada',
    description: 'Expert in international tax filing and corporate financial planning. Helping startups navigate the complex world of finance and compliance.',
    statistics: {
      totalMinutes: 5200,
      sessionsCompleted: 142
    },
    expertise: ['Finance', 'Tax'],
    disciplines: ['Accounting', 'Audit', 'Strategic Planning'],
    industries: ['FinTech', 'Real Estate'],
    languages: ['English', 'Mandarin'],
    experience: [
      {
        title: 'Founder & Principal Accountant',
        company: 'Chen & Partners',
        period: '2015 - PRESENT',
        description: 'Managing a diverse portfolio of international clients for tax optimization.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Commerce',
        school: 'UBC'
      }
    ],
    sessionPackages: [
      { id: 'd1', name: 'Tax Audit Prep', duration: '60 minutes', price: 120, description: 'Get ready for your upcoming tax audit with professional guidance.' },
      { id: 'd2', name: 'Corporate Structure Review', duration: '90 minutes', price: 180, description: 'Analyzing the best corporate structure for your new venture.' }
    ]
  },
  {
    id: '3',
    name: 'Amanda Brooks',
    category: Category.LEGAL,
    title: 'Corporate Legal Advisor',
    rating: 5.0,
    reviews: 45,
    pricePerHour: 150,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
    bannerUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200&h=400',
    isVerified: true,
    location: 'New York, USA',
    description: 'Focusing on startup formation, IP protection, and contract law. Bridging the gap between legal complexity and business agility.',
    statistics: {
      totalMinutes: 3100,
      sessionsCompleted: 56
    },
    expertise: ['Legal', 'Startup'],
    disciplines: ['Intellectual Property', 'Contract Negotiation'],
    industries: ['SaaS', 'Digital Health'],
    languages: ['English'],
    experience: [
      {
        title: 'Partner',
        company: 'Brooks Legal Group',
        period: '2019 - PRESENT',
        description: 'Advising tech companies on global IP strategies and funding rounds.'
      }
    ],
    education: [
      {
        degree: 'Juris Doctor (JD)',
        school: 'Harvard Law'
      }
    ],
    sessionPackages: [
      { id: 'a1', name: 'IP Strategy Consultation', duration: '45 minutes', price: 150, description: 'Protect your brand and innovations.' }
    ]
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    category: Category.STARTUP,
    title: 'Venture Partner & Mentor',
    rating: 4.7,
    reviews: 67,
    pricePerHour: 200,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
    location: 'London, UK',
    description: 'Former unicorn founder helping early-stage startups scale and raise capital. Expert in product-market fit and GTM strategy.',
    experience: [{ title: 'Managing Partner', company: 'Thorne Ventures', period: '2018 - PRESENT', description: 'Early stage investing in EMEA startups.' }]
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    category: Category.CAREER,
    title: 'Executive Career Coach',
    rating: 4.9,
    reviews: 156,
    pricePerHour: 95,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
    location: 'Madrid, Spain',
    description: 'Helping professionals pivot into tech and leadership roles through personalized coaching.',
    experience: [{ title: 'Principal Coach', company: 'Career Path', period: '2014 - PRESENT', description: 'Coached over 500 professionals into senior leadership roles.' }]
  },
  {
    id: '6',
    name: 'Dr. Kevin Wu',
    category: Category.TECH,
    title: 'Cloud Solutions Architect',
    rating: 4.8,
    reviews: 32,
    pricePerHour: 175,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
    location: 'Singapore',
    description: 'Deep expertise in AWS, Azure, and distributed systems architecture for enterprise scale.',
    experience: [{ title: 'CTO', company: 'Nexus Systems', period: '2020 - PRESENT', description: 'Building the next generation of serverless cloud platforms.' }]
  }
];

export const THEME_COLOR = '#f06529';
