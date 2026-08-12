import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, SettingsCMS } from '../lib/supabase';
import finalLogo from '../assets/images/final-logo.jpg';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  openResume: () => void;
  openAdmin: () => void;
  activeSection: string;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ isDarkMode, toggleTheme, openResume, openAdmin, activeSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
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

  const loadNavbarSettings = async () => {
    try {
      const setts = await api.getSettings();
      setSettings(setts);
    } catch (e) {
      console.error('Failed to load navbar settings:', e);
    }
  };

  useEffect(() => {
    loadNavbarSettings();
    window.addEventListener('cms-update', loadNavbarSettings);
    return () => window.removeEventListener('cms-update', loadNavbarSettings);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsAdminAuthenticated(sessionStorage.getItem('vj-admin-authenticated') === 'true');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('popstate', checkAuth);
    window.addEventListener('hashchange', checkAuth);
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('popstate', checkAuth);
      window.removeEventListener('hashchange', checkAuth);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      // Set scroll indicator progress
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // Sticky navbar blur trigger
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 border-b border-amber-500/20 backdrop-blur-md shadow-2xl shadow-amber-950/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 z-50 transition-all duration-75 shadow-sm shadow-amber-500/50" style={{ width: `${scrollProgress}%` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 min-[1280px]:gap-6 relative">
        {/* Logo Branding */}
        <div className="flex items-center justify-start shrink-0">
          <a href="#home" className="flex items-center space-x-2.5 group interactive-target">
            <img
              src={finalLogo}
              alt="Alpha Edit Studio Official Logo"
              onError={(e) => { (e.target as HTMLImageElement).src = '/final-logo.jpg'; }}
              className="w-8 h-8 object-contain rounded-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 ring-1 ring-amber-500/30 bg-black/40 p-0.5"
            />
            <div className="flex flex-col justify-center leading-tight">
              <span className="font-sans font-extrabold text-xs sm:text-sm tracking-wide uppercase group-hover:text-amber-400 transition-colors whitespace-nowrap text-white">
                {settings.websiteName}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase leading-none text-amber-400 font-semibold whitespace-nowrap">
                Post-Production & Design
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden min-[1200px]:flex items-center justify-center space-x-2.5 min-[1280px]:space-x-4 xl:space-x-5 2xl:space-x-6 shrink-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative py-1 font-sans text-xs uppercase tracking-wider font-semibold transition-all interactive-target whitespace-nowrap flex items-center h-8 ${
                  isActive
                    ? 'text-amber-400 font-extrabold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-sm shadow-amber-500/50"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Utility Actions & Mobile Hamburger */}
        <div className="flex items-center justify-end space-x-2.5 sm:space-x-3 shrink-0">
          {isAdminAuthenticated && (
            <button
              onClick={openAdmin}
              aria-label="Open Admin Dashboard CMS"
              className="h-9 px-3.5 flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black tracking-wider uppercase transition-all shadow-md shadow-amber-500/20 cursor-pointer interactive-target whitespace-nowrap"
              title="Open Admin Cockpit CMS"
            >
              <span>Admin Portal</span>
            </button>
          )}

          <button
            onClick={openResume}
            aria-label="Open Resume Portal Modal"
            className="hidden sm:flex h-9 px-3.5 items-center justify-center space-x-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer interactive-target whitespace-nowrap bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:border-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
            <span>Studio Profile</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="min-[1200px]:hidden w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen z-[99999] p-6 flex flex-col justify-between bg-[#050505] overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-8 border-b border-amber-500/20">
                <div className="flex items-center space-x-2">
                  <img
                    src={finalLogo}
                    alt="Alpha Edit Studio Logo"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/final-logo.jpg'; }}
                    className="w-8 h-8 object-contain rounded-lg ring-1 ring-amber-500/30 bg-black/40 p-0.5"
                  />
                  <span className="font-sans font-bold text-sm tracking-wide text-white">ALPHA EDIT STUDIO</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close Navigation Drawer"
                  className="p-2 rounded-lg transition-colors bg-amber-500/10 text-amber-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col space-y-5 pt-8">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === item.href.slice(1);
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-sans text-xs font-bold uppercase tracking-widest transition-colors py-1 ${
                        isActive
                          ? 'text-amber-400 pl-2 border-l-2 border-amber-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-amber-500/20 flex flex-col space-y-3">
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdmin();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-xs font-bold uppercase tracking-widest text-center shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Admin Cockpit CMS
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openResume();
                }}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center cursor-pointer transition-colors bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20"
              >
                Open Studio Profile
              </button>
              <p className="text-center text-[10px] text-amber-500/80 font-mono">
                ALPHA EDIT STUDIO • 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
