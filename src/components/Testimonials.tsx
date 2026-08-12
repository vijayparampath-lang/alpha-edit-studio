import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/supabase';
import { Testimonial } from '../types';
import { Quote, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadData = async () => {
    try {
      const data = await api.getTestimonials();
      setTestimonials(data);
    } catch (e) {
      console.error('Error loading testimonials from CMS:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) {
    return null; // Don't render section if empty
  }

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">CLIENT SATISFACTION</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            WHAT OUR PARTNERS SAY
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />

          {/* Placeholder Informational Badge */}
          <div className="inline-flex items-center space-x-2 mt-6 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-gray-400 max-w-lg text-center">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>CMS Synchronized:</strong> Testimonials are loaded dynamically and managed in the Admin Cockpit CMS.</span>
          </div>
        </div>

        {/* Carousel layout container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card Frame */}
          <div className="relative overflow-hidden min-h-[300px] md:min-h-[260px] bg-[#121212] border border-amber-500/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-xl flex flex-col justify-between">
            <Quote className="absolute top-6 right-8 w-12 h-12 text-amber-500/10 select-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Rating stars */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Number(activeTestimonial.rating || 5) }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Comment quote text */}
                <p className="font-sans text-gray-300 text-sm md:text-base leading-relaxed italic">
                  "{activeTestimonial.comment}"
                </p>

                {/* User Info card */}
                <div className="flex items-center space-x-4 pt-4 border-t border-amber-500/20">
                  {activeTestimonial.avatar && (
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <h4 className="font-sans font-bold text-sm text-white">
                      {activeTestimonial.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {activeTestimonial.role}, <span className="text-amber-400 font-semibold">{activeTestimonial.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 transition-all cursor-pointer interactive-target"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Micro dots indicators */}
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === i ? 'w-6 bg-amber-500' : 'bg-amber-500/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 transition-all cursor-pointer interactive-target"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
