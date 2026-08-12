import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, AboutCMS } from '../lib/supabase';
import { Experience } from '../types';
import { Briefcase, Eye, Award, CheckCircle2 } from 'lucide-react';

const STATS = [
  { value: '250+', label: 'Projects Completed', description: 'Logos, videos, brand identities', icon: Award, color: 'from-amber-500 to-yellow-500' },
  { value: '25M+', label: 'Cumulative Views', description: 'Reels, shorts & campaigns', icon: Eye, color: 'from-amber-600 to-yellow-400' },
  { value: '80+', label: 'Global Clients', description: 'Agencies, startups & creators', icon: Briefcase, color: 'from-yellow-500 to-amber-500' },
  { value: '100%', label: 'Delivery Quality', description: 'Precision post-production', icon: CheckCircle2, color: 'from-amber-500 to-yellow-600' }
];

export default function About() {
  const [about, setAbout] = useState<AboutCMS>({
    name: 'Alpha Edit Studio',
    title: 'Post-Production & Creative Agency',
    bio: 'We are a premier post-production and creative branding agency. We specialize in high-end vector branding, luxury identity design, and premium cinematic video post-production.',
    profileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    resumeUrl: ''
  });
  const [timeline, setTimeline] = useState<Experience[]>([]);

  const loadData = async () => {
    try {
      const aData = await api.getAbout();
      const tData = await api.getExperiences();
      setAbout(aData);
      setTimeline(tData);
    } catch (e) {
      console.error('Error loading dynamic about CMS data:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Dynamic Background Circle */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">CREATIVE ENGINE</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            ABOUT US & AGENCY TRACK RECORD
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Narrative & Stats Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Detailed Biography Column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-sans text-2xl font-bold text-white tracking-tight leading-snug">
              We translate ambitious visual goals into luxury digital realities.
            </h3>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              We are <span className="text-white font-semibold">{about.name}</span>, a premier <span className="text-amber-400 font-semibold">{about.title}</span> specializing in vector branding, high-engagement post-production video editing, and dynamic motion assets.
            </p>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              {about.bio || "We create top-tier digital systems that empower organizations and global creators to establish highly authoritative brand identities. By balancing rigorous structural layouts with dynamic cinematic transitions, we deliver premium results designed to leave a lasting impression."}
            </p>

            {about.profileImage && (
              <div className="pt-2">
                <img 
                  src={about.profileImage} 
                  alt={`${about.name} - Profile Portrait`} 
                  title={`${about.name} - ${about.title}`}
                  loading="lazy"
                  width="400"
                  height="192"
                  className="w-full h-48 object-cover rounded-2xl border border-amber-500/20 shadow-xl shadow-amber-950/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Quick Summary Badges */}
            <div className="pt-4 grid grid-cols-2 gap-3">
              {['Creative Problem Solving', 'Attention to Detail', '100% Original Vectors', 'Optimized Visual Hooking'].map((b) => (
                <div key={b} className="flex items-center space-x-2 text-xs font-sans text-gray-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bento Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-[#121212] border border-amber-500/20 hover:border-amber-500/40 backdrop-blur-sm shadow-xl flex flex-col justify-between group cursor-default"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-mono text-3xl md:text-4xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                        {stat.value}
                      </span>
                      <span className="font-sans font-bold text-xs text-gray-200 mt-2 tracking-wide uppercase">
                        {stat.label}
                      </span>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${stat.color} text-black shadow-lg shadow-amber-500/20 font-black`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-amber-400/80 font-mono text-[11px] mt-4 uppercase tracking-wider font-medium">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Experience Timeline Section */}
        <div id="experience" className="mt-28 scroll-mt-24">
          <div className="flex flex-col items-center text-center mb-14">
            <h3 className="font-sans text-xl font-bold text-white tracking-widest uppercase">
              AGENCY MILESTONES & JOURNEY
            </h3>
            <p className="text-xs text-amber-400 font-mono mt-1">VERIFIED CONTRACTS & CREATIVE PARTNERSHIPS</p>
          </div>

          <div className="relative max-w-4xl mx-auto pl-6 md:pl-0">
            {/* Center Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-600/20" />

            {/* Timeline cards */}
            <div className="space-y-12">
              {timeline.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    {/* Node marker */}
                    <div className="absolute left-[-29px] md:left-1/2 md:translate-x-[-7px] w-3.5 h-3.5 bg-amber-500 rounded-full ring-4 ring-amber-500/20 z-10" />

                    {/* Timeline Item Container */}
                    <div className={`w-full md:w-[45%] ${isEven ? 'md:order-1' : 'md:order-2 md:text-left'}`}>
                      <motion.div
                        className="p-6 rounded-2xl bg-[#121212] border border-amber-500/20 backdrop-blur-sm shadow-xl space-y-3"
                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="flex justify-between items-start flex-col sm:flex-row">
                          <div>
                            <h4 className="font-sans font-extrabold text-sm text-amber-400 tracking-wider uppercase">
                              {item.role}
                            </h4>
                            <p className="text-gray-400 text-xs font-semibold mt-1">
                              {item.company}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full mt-2 sm:mt-0">
                            {item.period}
                          </span>
                        </div>

                        <p className="text-gray-400 text-xs leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 space-y-1">
                          {item.highlights && item.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start space-x-2 text-xs">
                              <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                              <span className="text-gray-300">{h}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Spacer block for desktop alignment */}
                    <div className="hidden md:block w-[45%] md:order-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
