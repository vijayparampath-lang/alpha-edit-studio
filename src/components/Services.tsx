import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/supabase';
import { Service } from '../types';
import * as LucideIcons from 'lucide-react';

export default function Services() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const loadData = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (e) {
      console.error('Error loading Services from CMS:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  return (
    <section id="services" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">CAPABILITY MATRIX</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            AGENCY SERVICES
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Services Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {services.map((service, idx) => {
            // Dynamically resolve icon component
            const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Sparkles;
            const isOpen = activeCard === service.id;

            return (
              <motion.div
                key={service.id}
                className="rounded-2xl border border-amber-500/20 bg-[#121212] backdrop-blur-sm transition-all duration-300 shadow-xl overflow-hidden flex flex-col h-full hover:border-amber-500/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                {/* Visual Header Grid */}
                <div className="p-8 flex-1 space-y-5">
                  <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <IconComponent className="w-6 h-6 animate-pulse" />
                  </div>

                  <h3 className="font-sans text-xl font-extrabold text-white tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Collapsible Action Panel */}
                  <div className="pt-4 border-t border-amber-500/20">
                    <button
                      onClick={() => setActiveCard(isOpen ? null : service.id)}
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-amber-400 hover:text-amber-300 transition-colors uppercase cursor-pointer interactive-target"
                    >
                      <span>{isOpen ? 'Close Detailed list' : 'View full offerings'}</span>
                      <LucideIcons.ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-4 space-y-2"
                        >
                          {service.items && service.items.map((item, itemIdx) => (
                            <motion.div
                              key={item}
                              className="flex items-center space-x-2.5 text-xs text-gray-300 border-l-2 border-amber-500/40 pl-3 py-1.5 hover:border-amber-500 transition-colors"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.04 }}
                            >
                              <LucideIcons.Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="font-sans font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Pre-collapsed list overview */}
                    {!isOpen && service.items && (
                      <div className="mt-4 space-y-2">
                        {service.items.slice(0, 4).map((item) => (
                          <div key={item} className="flex items-center space-x-2.5 text-xs text-gray-400">
                            <div className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                            <span className="font-sans truncate">{item}</span>
                          </div>
                        ))}
                        {service.items.length > 4 && (
                          <p className="text-[10px] text-amber-400/80 font-mono italic pt-1 pl-3 font-medium">
                            + {service.items.length - 4} more services
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Aesthetic accent lines */}
                <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent w-full" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
