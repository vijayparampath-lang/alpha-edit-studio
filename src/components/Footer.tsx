import { useState, useEffect } from 'react';
import { ArrowUp, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, ContactCMS, SocialLinkCMS, SettingsCMS } from '../lib/supabase';
import finalLogo from '../assets/images/final-logo.jpg';

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: 'hover:text-red-500 hover:border-red-500/30',
  Youtube: 'hover:text-red-500 hover:border-red-500/30',
  Instagram: 'hover:text-fuchsia-500 dark:hover:text-fuchsia-400 hover:border-fuchsia-500/30 dark:hover:border-fuchsia-400/30',
  LinkedIn: 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600/30 dark:hover:border-blue-400/30',
  Linkedin: 'hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600/30 dark:hover:border-blue-400/30',
  'Twitter/X': 'hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-500/30 dark:hover:border-sky-400/30',
  Twitter: 'hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-500/30 dark:hover:border-sky-400/30',
  Behance: 'hover:text-blue-500 hover:border-blue-500/30',
  Dribbble: 'hover:text-pink-500 hover:border-pink-500/30',
  GitHub: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-900/30 dark:hover:border-white/30',
  Github: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-900/30 dark:hover:border-white/30',
  TikTok: 'hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-600/30 dark:hover:border-cyan-400/30',
  WhatsApp: 'hover:text-emerald-600 dark:hover:text-emerald-500 hover:border-emerald-600/30 dark:hover:border-emerald-500/30',
  Telegram: 'hover:text-sky-600 dark:hover:text-sky-500 hover:border-sky-600/30 dark:hover:border-sky-500/30',
  Pinterest: 'hover:text-red-600 hover:border-red-600/30',
  Facebook: 'hover:text-blue-600 hover:border-blue-600/30',
  Discord: 'hover:text-indigo-600 dark:hover:text-indigo-500 hover:border-indigo-600/30 dark:hover:border-indigo-500/30',
  Threads: 'hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-900/30 dark:hover:border-slate-200/30',
  'Personal Blog': 'hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-600/30 dark:hover:border-teal-400/30',
};

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [socials, setSocials] = useState<SocialLinkCMS[]>([]);
  const [contact, setContact] = useState<ContactCMS>({
    email: 'alphaeditstudio8@gmail.com',
    phone: '+91 93434 12416',
    address: 'Indore, Madhya Pradesh, India'
  });
  const [settings, setSettings] = useState<SettingsCMS>({
    websiteName: 'Alpha Edit Studio',
    logoText: 'AES',
    heroTitle: 'PREMIUM GRAPHIC DESIGN & CINEMATIC VIDEO EDITING AGENCY',
    heroSubtitle: 'Crafting high-retention vertical videos, aesthetic brand vectors, and luxury identity systems that capture absolute attention.',
    whatsappNumber: '+91 93434 12416',
    footerText: 'Alpha Edit Studio is an elite visual production studio crafting original vector branding structures, high-impact motion graphics, and cinematic video edits globally.',
    copyrightText: '© 2026 Alpha Edit Studio. All rights reserved.',
    seoTitle: 'Alpha Edit Studio | Premium Video Editing & Branding Agency',
    seoDescription: 'Alpha Edit Studio - Creative agency specializing in video editing, graphic design, motion graphics, and brand identity.',
    themeColor: '#f59e0b',
    accentColor: '#eab308'
  });

  const loadFooterData = async () => {
    try {
      const sData = await api.getSocials();
      const cData = await api.getContact();
      const setts = await api.getSettings();
      setSocials(sData);
      setContact(cData);
      setSettings(setts);
    } catch (e) {
      console.error('Failed to load footer dynamic data:', e);
    }
  };

  useEffect(() => {
    loadFooterData();
    window.addEventListener('cms-update', loadFooterData);

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cms-update', loadFooterData);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawPhone = contact.phone.replace(/[^\d+]/g, '');

  return (
    <footer className="bg-[#080808] border-t border-amber-500/20 pt-20 pb-10 relative overflow-hidden">
      
      {/* Decorative accent background lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Call to Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-16 border-b border-amber-500/20 mb-16">
          <div className="space-y-4">
            <h3 className="font-sans text-2xl md:text-3xl font-black text-white tracking-tight">
              ELEVATE YOUR VISUAL GRAPHICS TODAY
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-md leading-relaxed">
              Let's create something outstanding. Connect directly to schedule a project brief or download our capabilities deck.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:justify-end">
            <a
              href="#contact"
              className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 interactive-target"
            >
              <span>INQUIRE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${rawPhone || '919343412416'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest transition-all interactive-target"
            >
              <MessageCircle className="w-4 h-4 text-amber-500" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-amber-500/20">
          
          {/* Logo Brand Description Column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center space-x-2">
              <img
                src={finalLogo}
                alt="Alpha Edit Studio Logo"
                onError={(e) => { (e.target as HTMLImageElement).src = '/final-logo.jpg'; }}
                className="w-9 h-9 object-contain rounded-xl shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/30 bg-black/40 p-0.5"
              />
              <div className="flex flex-col">
                <span className="font-sans font-extrabold text-sm text-white tracking-wide uppercase">
                  {settings.websiteName}
                </span>
                <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase font-semibold">
                  Creative Agency
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {settings.footerText}
            </p>
            
            {/* Social media connections */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {socials.filter(s => s.url && s.url.trim() !== '').map((social) => {
                // Dynamically load Icon based on platform name
                const p = social.platform.toLowerCase();
                let IconComp = (LucideIcons as any)[social.platform];
                if (!IconComp) {
                  if (p.includes('youtube')) IconComp = LucideIcons.Youtube;
                  else if (p.includes('instagram')) IconComp = LucideIcons.Instagram;
                  else if (p.includes('linkedin')) IconComp = LucideIcons.Linkedin;
                  else if (p.includes('twitter') || p.includes('x')) IconComp = LucideIcons.Twitter;
                  else if (p.includes('github')) IconComp = LucideIcons.Github;
                  else if (p.includes('facebook')) IconComp = LucideIcons.Facebook;
                  else if (p.includes('dribbble')) IconComp = LucideIcons.Dribbble;
                  else if (p.includes('tiktok')) IconComp = LucideIcons.Music;
                  else if (p.includes('behance')) IconComp = LucideIcons.Briefcase;
                  else if (p.includes('whatsapp')) IconComp = LucideIcons.MessageCircle;
                  else if (p.includes('telegram')) IconComp = LucideIcons.Send;
                  else if (p.includes('pinterest')) IconComp = LucideIcons.Pin;
                  else if (p.includes('discord')) IconComp = LucideIcons.MessageSquare;
                  else if (p.includes('threads')) IconComp = LucideIcons.AtSign;
                  else if (p.includes('email') || p.includes('mail')) IconComp = LucideIcons.Mail;
                  else if (p.includes('phone') || p.includes('call')) IconComp = LucideIcons.Phone;
                  else if (p.includes('location') || p.includes('address') || p.includes('map')) IconComp = LucideIcons.MapPin;
                  else if (p.includes('portfolio') || p.includes('blog') || p.includes('web') || p.includes('site')) IconComp = LucideIcons.Globe;
                  else IconComp = LucideIcons.ExternalLink;
                }
                if (!IconComp) {
                  if (p.includes('email') || p.includes('mail')) IconComp = LucideIcons.Mail;
                  else if (p.includes('phone') || p.includes('call')) IconComp = LucideIcons.Phone;
                  else if (p.includes('location') || p.includes('address')) IconComp = LucideIcons.MapPin;
                  else IconComp = LucideIcons.ExternalLink;
                }
                
                const hoverClass = PLATFORM_COLORS[social.platform] || 'hover:text-amber-400 hover:border-amber-400/30';

                let href = social.url;
                if (p.includes('email') || p.includes('mail')) {
                  href = social.url.startsWith('mailto:') ? social.url : `mailto:${social.url}`;
                } else if (p.includes('phone') || p.includes('call')) {
                  href = social.url.startsWith('tel:') ? social.url : `tel:${social.url.replace(/\s+/g, '')}`;
                } else if (p.includes('location') || p.includes('address') || p.includes('map')) {
                  href = social.url.startsWith('http') ? social.url : `https://maps.google.com/?q=${encodeURIComponent(social.url)}`;
                }

                return (
                  <a
                    key={social.id}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2.5 rounded-xl bg-[#121212] border border-amber-500/20 text-gray-400 transition-colors cursor-pointer interactive-target hover:text-amber-400 ${hoverClass}`}
                    title={social.platform}
                  >
                    <IconComp className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sitemaps links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Sitemap Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Home', 'About', 'Services', 'Portfolio', 'Skills', 'Experience', 'Testimonials', 'Contact'].map((nav) => (
                <a
                  key={nav}
                  href={`#${nav.toLowerCase()}`}
                  className="text-gray-400 hover:text-amber-400 transition-colors py-0.5 interactive-target"
                >
                  {nav}
                </a>
              ))}
            </div>
          </div>

          {/* Legal/Disclaimer info Column */}
          <div className="md:col-span-4 space-y-4 text-xs">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Creative Scope</h4>
            <p className="text-gray-400 leading-relaxed">
              Design standards calibrated according to elite metrics of Behance, Dribbble, and Awwwards. Original vector assets backed by non-disclosure agreements where requested.
            </p>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Production-Ready Portfolio 2026</span>
            </div>
          </div>

        </div>

        {/* Closing copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500">
          <p>{settings.copyrightText}</p>
          <div className="flex items-center space-x-4">
            <a href="#about" className="hover:text-white transition-colors interactive-target">Privacy Policy</a>
            <span>•</span>
            <a href="#portfolio" className="hover:text-white transition-colors interactive-target">Licensing Rules</a>
          </div>
        </div>

      </div>

      {/* Floating Scroll to Top button (Only reveals when scrolled down) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-4 rounded-2xl bg-amber-500 text-black font-bold shadow-xl hover:bg-amber-400 border border-amber-500/20 cursor-pointer z-40"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ y: -3 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

    </footer>
  );
}
