import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/supabase';
import { Skill } from '../types';
import * as LucideIcons from 'lucide-react';

const SKILL_THEMES: Record<string, { bg: string; text: string; fill: string; glow: string }> = {
  'Adobe Photoshop': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  'Adobe Illustrator': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', fill: 'bg-yellow-500', glow: 'shadow-yellow-500/20' },
  'Figma': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-gradient-to-r from-amber-500 to-yellow-400', glow: 'shadow-amber-500/20' },
  'Canva Pro': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  'Adobe Premiere Pro': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  'Adobe After Effects': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', fill: 'bg-yellow-500', glow: 'shadow-yellow-500/20' },
  'CapCut': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  'DaVinci Resolve': { bg: 'bg-amber-500/10', text: 'text-amber-400', fill: 'bg-gradient-to-r from-amber-600 to-yellow-400', glow: 'shadow-amber-500/20' },
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  const loadData = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (e) {
      console.error('Error loading skills from CMS:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">CREATIVE ENGINE</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            SOFTWARE FLUENCY & STACK
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {skills.map((skill, idx) => {
            const theme = SKILL_THEMES[skill.name] || {
              bg: 'bg-amber-500/10',
              text: 'text-amber-400',
              fill: 'bg-amber-500',
              glow: 'shadow-amber-500/15',
            };
            const IconComp = (LucideIcons as any)[skill.icon] || LucideIcons.Layers;

            return (
              <motion.div
                key={skill.name}
                className="p-6 rounded-2xl border border-amber-500/20 bg-[#121212] shadow-xl backdrop-blur-sm space-y-4"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-extrabold text-sm text-white tracking-wide">
                        {skill.name}
                      </h4>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400/80 font-medium">
                        {skill.category} Tool
                      </span>
                    </div>
                  </div>
                  <span className={`font-mono text-xs font-bold ${theme.text}`}>
                    {skill.level}%
                  </span>
                </div>

                {/* Meter track */}
                <div className="h-2 w-full bg-black rounded-full overflow-hidden relative border border-amber-500/20">
                  <motion.div
                    className={`h-full rounded-full ${theme.fill} ${theme.glow} shadow-lg`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
