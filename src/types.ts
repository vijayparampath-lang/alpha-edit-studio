export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  tags: string[];
  client?: string;
  year: string;
  link?: string;
  videoUrl?: string; // Optional for video editing / reels projects
  videoPlatform?: string; // YouTube, Instagram Reel, Facebook Video, TikTok, Vimeo, Google Drive, Custom URL
  isFeatured?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100 percentage
  category: 'Design' | 'Video' | 'Branding' | 'Other';
  icon: string; // lucide icon name
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: string[];
}
