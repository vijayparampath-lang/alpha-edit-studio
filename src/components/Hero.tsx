import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Palette, Video, ArrowRight, MousePointerClick, Smartphone, Layers, PenTool } from 'lucide-react';
import { api, SettingsCMS } from '../lib/supabase';

interface HeroProps {
  openResume: () => void;
}

const ROTATING_TITLES = [
  'Post-Production Studio',
  'Luxury Branding House',
  'High-Retention Video Editing',
  'Creative Motion Design'
];

export default function Hero({ openResume }: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [settings, setSettings] = useState<SettingsCMS>({
    websiteName: 'Alpha Edit Studio',
    logoText: 'AES',
    heroTitle: 'PREMIUM POST-PRODUCTION & CREATIVE BRANDING STUDIO',
    heroSubtitle: 'Crafting high-retention vertical videos, aesthetic brand vectors, and luxury identity systems that capture absolute attention.',
    whatsappNumber: '+91 93434 12416',
    footerText: 'Luxury post-production studio crafting original geometric vector branding structures and cinematic reels post-production assets for creators and agencies globally.',
    copyrightText: '© 2026 Alpha Edit Studio. All rights reserved.',
    seoTitle: 'Alpha Edit Studio | Premium Post-Production & Branding Agency',
    seoDescription: 'Official portfolio of Alpha Edit Studio - Video Editing, Graphic Design, and Branding Specialist.',
    themeColor: '#f59e0b',
    accentColor: '#eab308'
  });

  const loadHeroSettings = async () => {
    try {
      const setts = await api.getSettings();
      setSettings(setts);
    } catch (e) {
      console.error('Failed to load hero settings:', e);
    }
  };

  useEffect(() => {
    loadHeroSettings();
    window.addEventListener('cms-update', loadHeroSettings);
    return () => window.removeEventListener('cms-update', loadHeroSettings);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = ROTATING_TITLES[titleIndex];

    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullText) {
          // Pause at complete text before deleting
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        // Deleting
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(45);

        if (currentText === '') {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, typingSpeed]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#080808]"
    >
      {/* Decorative Radial glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-amber-600/10 dark:from-amber-500/15 dark:via-yellow-500/5 dark:to-amber-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating Creative Vector Nodes */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
        {/* Pen Tool Node */}
        <motion.div
          className="absolute top-[25%] left-[12%] p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#121212] border border-amber-500/30 text-amber-500 dark:text-amber-400 backdrop-blur-md shadow-2xl shadow-amber-950/20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PenTool className="w-5 h-5" />
        </motion.div>

        {/* Video Keyframe Node */}
        <motion.div
          className="absolute top-[40%] right-[10%] p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#121212] border border-amber-500/30 text-amber-500 dark:text-amber-400 backdrop-blur-md shadow-2xl shadow-amber-950/20"
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Video className="w-5 h-5" />
        </motion.div>

        {/* Layers Node */}
        <motion.div
          className="absolute bottom-[25%] left-[18%] p-3.5 rounded-2xl bg-amber-500/10 dark:bg-[#121212] border border-amber-500/30 text-amber-500 dark:text-amber-400 backdrop-blur-md shadow-2xl shadow-amber-950/20"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Layers className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Content wrapper */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20 flex flex-col items-center">
        {/* Visual Badge */}
        <motion.div
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-sans text-[10px] font-bold tracking-widest text-amber-300 uppercase">
            Accepting Elite Post-Production & Branding Bookings
          </span>
        </motion.div>

        {/* Name Title */}
        <motion.h1
          className="font-sans text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none mb-4 select-none"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          {settings.websiteName.toUpperCase()}
        </motion.h1>

        {/* Typewriter Rotator Sub-title */}
        <motion.div
          className="h-8 md:h-10 mb-8 flex items-center justify-center font-sans text-lg md:text-2xl font-bold tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-gray-400">We are a&nbsp;</span>
          <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent font-extrabold">
            {currentText}
          </span>
          <span className="w-[3px] h-5 md:h-6 bg-amber-400 ml-1 animate-pulse" />
        </motion.div>

        {/* Narrative Description */}
        <motion.p
          className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed mb-10 text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {settings.heroSubtitle}
        </motion.p>

        {/* Action Button Links */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <a
            href="#portfolio"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 interactive-target ring-1 ring-amber-300/40"
          >
            <span>Explore Showcase</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </a>

          <button
            onClick={openResume}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest transition-all interactive-target"
          >
            <MousePointerClick className="w-4 h-4 text-amber-400" />
            <span>Open Studio Profile</span>
          </button>
        </motion.div>

        {/* Scroll Indicator Icon */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer interactive-target text-gray-500 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-widest mb-2 text-amber-500/80">SCROLL DOWN</span>
          <div className="w-[18px] h-7 rounded-full border border-amber-500/30 flex justify-center p-1">
            <motion.div
              className="w-1 h-1.5 bg-amber-400 rounded-full"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
