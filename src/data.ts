import { PortfolioItem, Skill, Experience, Testimonial, FAQ, Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    icon: 'Palette',
    description: 'Creating stunning visual concepts that capture attention, build brand value, and communicate messages clearly across digital and physical mediums.',
    items: [
      'Logo Design & Iconography',
      'Social Media Post & Ad Creatives',
      'Banner & Header Design',
      'Brutalists & Aesthetic Poster Design',
      'YouTube Thumbnail Design',
      'Brand Identity Systems & Style Guides',
      'Premium Business Cards & Stationery',
      'Modern Flyers & Marketing Brochures'
    ]
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    icon: 'Video',
    description: 'Transforming raw footage into high-energy, engaging cinematic stories optimized for retention, social platform algorithms, and conversions.',
    items: [
      'Viral Reels & YouTube Shorts Editing',
      'YouTube Video Post-Production',
      'High-Quality Motion Graphics & Titles',
      'Precision Color Grading & Correction',
      'Audio Enhancement & Sound Design',
      'Dynamic Transitions & Effects'
    ]
  },
  {
    id: 'additional-services',
    title: 'Additional Services',
    icon: 'Sparkles',
    description: 'Rounding out creative portfolios with advanced image manipulation, sleek user experiences, and marketing assets that boost engagement.',
    items: [
      'Advanced Photo Editing & Retouching',
      'Sleek UI/UX Prototyping (Figma)',
      'Digital Marketing Campaign Creatives',
      'Interactive Branding Assets',
      'Creative Content Consultation'
    ]
  }
];

export const SKILLS: Skill[] = [
  { name: 'Adobe Photoshop', level: 95, category: 'Design', icon: 'Layers' },
  { name: 'Adobe Illustrator', level: 90, category: 'Design', icon: 'PenTool' },
  { name: 'Figma', level: 85, category: 'Design', icon: 'Framer' },
  { name: 'Canva Pro', level: 95, category: 'Design', icon: 'LayoutGrid' },
  { name: 'Adobe Premiere Pro', level: 92, category: 'Video', icon: 'Video' },
  { name: 'Adobe After Effects', level: 80, category: 'Video', icon: 'Film' },
  { name: 'CapCut', level: 95, category: 'Video', icon: 'Smartphone' },
  { name: 'DaVinci Resolve', level: 75, category: 'Video', icon: 'Tv' }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'branding-nexus',
    title: 'Nexus Corp Brand Identity',
    category: 'Branding',
    subcategory: 'Brand Identity Design',
    description: 'Complete brand identity design for a cutting-edge tech startup, featuring clean minimalist vector geometry, an immersive luxury color palette, custom corporate stationery, and full social guidelines.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Branding', 'Vector Logo', 'Typography', 'Stationery'],
    client: 'Nexus Technologies',
    year: '2025',
    isFeatured: true
  },
  {
    id: 'logo-aurora',
    title: 'Aurora Bio-Wellness Logo',
    category: 'Logo Design',
    subcategory: 'Logo Design',
    description: 'A beautiful organic-geometric hybrid logo symbolizing healing, renewal, and radiant wellness. Leverages Golden Ratio proportions for a timeless and versatile icon design.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    tags: ['Logo Design', 'Vector', 'Golden Ratio', 'Minimalism'],
    client: 'Aurora Wellness LLC',
    year: '2026'
  },
  {
    id: 'social-neon',
    title: 'Cyberpunk Clothing Ad Campaign',
    category: 'Social Media',
    subcategory: 'Social Media Designs',
    description: 'High-conversion aesthetic social media advertising carousel designs utilizing neon contrasts, dynamic streetwear models, and bold typography rules to boost CTR by 40%.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tags: ['Social Media', 'Photoshop', 'Typography', 'Advertising'],
    client: 'NeoWear Threads',
    year: '2026',
    isFeatured: true
  },
  {
    id: 'reels-action',
    title: 'Fitness Coach High-Retention Reels',
    category: 'Reels',
    subcategory: 'Reels & Shorts',
    description: 'A series of highly engaging, sound-effects-driven, short-form reels for a celebrity fitness coach. Features fast-paced visual storytelling, synchronized dynamic sound loops, motion tracking captions, and targeted color grades.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Video Editing', 'Reels', 'CapCut', 'Sound Design'],
    client: 'Alex Thorne Fitness',
    year: '2025',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-dumbbells-in-gym-42250-large.mp4',
    isFeatured: true
  },
  {
    id: 'poster-brutalist',
    title: 'Metropolis Avant-Garde Poster',
    category: 'Posters',
    subcategory: 'Posters',
    description: 'A dark, brutalist industrial poster designed for an underground techno festival. Integrates halftone patterns, custom typography overlays, and vintage abstract textures.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    tags: ['Poster Design', 'Brutalism', 'Photoshop', 'Art Direction'],
    client: 'Sub-Zero Events',
    year: '2025'
  },
  {
    id: 'video-cinematic',
    title: 'Ethereal Travel Vlog Production',
    category: 'Video Editing',
    subcategory: 'Video Editing',
    description: 'Cinematic travel vlog edited with deep storytelling layers, customized speed-ramps, precision multi-cam sync, and immersive soundscapes mimicking real world acoustics.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    tags: ['Premiere Pro', 'DaVinci Resolve', 'Color Grading', 'Travel'],
    client: 'Wanderlust Media',
    year: '2025',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-on-a-highway-with-view-of-mountains-32832-large.mp4'
  },
  {
    id: 'motion-neon-cube',
    title: 'Abstract 3D Logo Reveal',
    category: 'Motion Graphics',
    subcategory: 'Motion Graphics',
    description: 'Futuristic 3D animated logo reveal for an esports network. Uses custom procedural smoke simulations, complex neon wireframe grids, and intense cinematic glitch transitions.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tags: ['After Effects', '3D Motion', 'Intro Animation', 'Esports'],
    client: 'Nexus Gaming League',
    year: '2026',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-keyboard-and-mouse-42352-large.mp4'
  },
  {
    id: 'ui-dashboard',
    title: 'Lumina Smart Home Dashboard',
    category: 'UI Design',
    subcategory: 'UI Designs',
    description: 'Sleek, futuristic glassmorphic mobile app UI design for controlling connected IoT devices. Focused on micro-interactions, dark aesthetic harmony, and seamless visual feedback.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Figma', 'UI/UX', 'Glassmorphism', 'Prototyping'],
    client: 'Lumina Home Systems',
    year: '2026',
    isFeatured: true
  },
  {
    id: 'thumbnail-gaming',
    title: 'Viral Gaming Thumbnail Pack',
    category: 'Social Media',
    subcategory: 'Thumbnail Designs',
    description: 'High-clickrate gaming YouTube thumbnails featuring hyper-stylized background blur, vivid contrast ratios, customized expressional character cutouts, and 3D glowing text elements.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    tags: ['Thumbnails', 'Photoshop', 'Branding', 'Social Media'],
    client: 'FragMaster YouTube',
    year: '2025'
  },
  {
    id: 'photo-enhancement',
    title: 'Cyber-Neon Retouching Portfolio',
    category: 'Photo Editing',
    subcategory: 'Photo Editing',
    description: 'Advanced composite image modification. Transformed daylight street photography into highly-detailed, atmospheric cyberpunk night scenes with custom light reflections, neon signs, and rain-slick streets.',
    image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=800&q=80',
    tags: ['Photo Editing', 'Photoshop', 'Compositing', 'Retouching'],
    client: 'Personal Project',
    year: '2026'
  }
];

export const EXPERIENCE_TIMELINE: Experience[] = [
  {
    id: 'exp-1',
    role: 'Lead Freelance Creative Professional',
    company: 'Independent Consulting',
    period: '2023 - Present',
    description: 'Delivering end-to-end creative solutions across graphic design, high-engagement video production, and integrated branding for international startups, digital marketers, and dynamic content creators.',
    highlights: [
      'Successfully crafted and deployed full brand identities for 25+ fast-growing startups.',
      'Edited short-form content (reels, shorts) generating cumulative views in excess of 10M+.',
      'Engineered interactive user interfaces, banners, and digital marketing creatives yielding double-digit engagement lift.'
    ]
  },
  {
    id: 'exp-2',
    role: 'Senior Graphic Designer & Brand Specialist',
    company: 'Creative Media Agency Contracts',
    period: '2021 - 2023',
    description: 'Spearheaded branding and high-fidelity poster and marketing asset designs for premium entertainment, apparel, and lifestyle brands, maintaining top-tier creative excellence.',
    highlights: [
      'Led a design sprint for an apparel brand, driving 35% increase in e-commerce click rates.',
      'Developed pixel-perfect brand identity guidelines ensuring full omni-channel consistency.',
      'Handled rapid prototyping of UI graphics and bespoke website presentation layouts in Figma.'
    ]
  },
  {
    id: 'exp-3',
    role: 'Video Editor & Motion Designer',
    company: 'Visual Content Production Projects',
    period: '2019 - 2021',
    description: 'Focused on video editing, dynamic motion graphics, and sound design for YouTube campaigns, product reveals, and high-conversion social media reels.',
    highlights: [
      'Mastered speed-ramping, precision audio synchronization, and visual effects to hold audience attention.',
      'Optimized short-form video layouts according to algorithmic metrics of Instagram, TikTok, and YouTube.',
      'Maintained 100% on-time delivery across multiple high-pressure media schedules.'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Michael Chen',
    role: 'Founder & CEO',
    company: 'Nexus Technologies',
    comment: 'Alpha Edit Studio took our vague vision and turned it into an absolutely stunning brand identity. The attention to detail and original logo geometry exceeded our highest expectations. Communication was super smooth and lightning fast!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'test-2',
    name: 'Sarah Jenkins',
    role: 'Digital Marketing Lead',
    company: 'Aura Wellness',
    comment: 'We have seen a huge increase in CTR and video retention since we started working with Alpha Edit Studio for our social media designs and high-tempo reels. They know exactly what triggers viewer engagement and deliver top-tier results.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 'test-3',
    name: 'David Thorne',
    role: 'YouTube Creator (2M+ subs)',
    company: 'Thorne Fitness Channel',
    comment: 'Working with Alpha Edit Studio for our thumbnails and motion intro was a complete game-changer. The layout pop, glowing text styles, and graphic balance are professional grade. Essential partner in our design stack.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is your typical turnaround time for graphic design and video editing?',
    answer: 'Turnaround time varies based on scope. Simple graphic assets, YouTube thumbnails, or single social reels are typically delivered within 24 to 48 hours. Complex brand identity systems, motion graphics, or large multi-cam video edits might take 5 to 7 business days. I always prioritize high-quality results and on-time delivery.',
    category: 'Services'
  },
  {
    id: 'faq-2',
    question: 'Do you provide source files upon project completion?',
    answer: 'Absolutely! For graphic design projects, I deliver ready-to-use print-and-digital files (.PNG, .JPG, .PDF) alongside the fully layered industry-standard source files (.PSD, .AI, or .FIGMA link) based on the agreement. For video editing, you will receive full 4K MP4 deliverables and can request project assets if needed.',
    category: 'Deliverables'
  },
  {
    id: 'faq-3',
    question: 'How does your revision process work?',
    answer: 'I include up to 3 rounds of free revisions on all standard projects to ensure the final product aligns perfectly with your vision. I present draft renders or layout sheets early on to gather feedback, minimizing the need for major adjustments later and keeping the project on schedule.',
    category: 'Process'
  },
  {
    id: 'faq-4',
    question: 'Can you work on remote, long-term contracts?',
    answer: 'Yes! I am fully available for both one-off freelance deliverables and ongoing, long-term remote contracts. Many of my clients retain me on a monthly basis for continuous video editing, social media assets, and general creative direction.',
    category: 'Availability'
  }
];
