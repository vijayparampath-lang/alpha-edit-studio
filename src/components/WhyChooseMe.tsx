import { motion } from 'motion/react';
import { Sparkles, Video, Zap, Trophy, Heart, Shield, Search, MessageSquare, Flame } from 'lucide-react';

const REASONS = [
  { title: 'Creative & Modern Designs', description: 'Fresh, innovative designs influenced by top-tier modern visual arts, typography scales, and luxury agency layouts.', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Professional Video Editing', description: 'High-tempo vertical cuts, sound design sync, speed-ramping, and precision grading optimized for retention.', icon: Video, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Ultra-Fast Delivery', description: 'Optimized project frameworks allowing for lightning-quick turnarounds without compromising visual fidelity.', icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'High Quality Work', description: 'Obsessive production benchmarks ensuring pixel-perfect alignment, proper bleed margins, and lossless compression.', icon: Trophy, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Client-Focused Approach', description: 'Collaborative pipeline prioritizing your business objectives, structured feedback loops, and creative consultation.', icon: Heart, color: 'text-amber-500 bg-amber-500/10' },
  { title: '100% Original Vectors', description: 'Every single asset, mark, or geometry is crafted from scratch. Absolute safety from copyright claims.', icon: Shield, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Attention to Detail', description: 'Subtle typesetting balances, typographic kerning, color harmony ratios, and smooth motion curves.', icon: Search, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Reliable Communication', description: 'Full professional availability across chat, email, or video briefs, with clear project milestone scheduling.', icon: MessageSquare, color: 'text-amber-500 bg-amber-500/10' },
  { title: 'Creative Problem Solving', description: 'Analyzing audience behavior to engineer visual elements specifically suited to capture attention.', icon: Flame, color: 'text-amber-500 bg-amber-500/10' }
];

export default function WhyChooseMe() {
  return (
    <section className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">OPERATIONAL CORE</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            WHY PARTNER WITH US
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Features Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                className="p-8 rounded-2xl border border-amber-500/20 bg-[#121212] transition-all duration-300 shadow-xl relative group flex flex-col justify-between hover:border-amber-500/40"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-3.5 rounded-2xl ${reason.color} group-hover:scale-110 transition-transform duration-300 border border-amber-500/30`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                {/* Micro hover lights */}
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
