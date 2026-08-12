import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, ContactCMS } from '../lib/supabase';
import { Mail, Phone, MapPin, CheckCircle, Send, AlertCircle, MessageCircle, Briefcase } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [contact, setContact] = useState<ContactCMS>({
    email: 'alphaeditstudio8@gmail.com',
    phone: '+91 93434 12416',
    address: 'Indore, Madhya Pradesh, India'
  });

  const loadData = async () => {
    try {
      const data = await api.getContact();
      setContact(data);
    } catch (e) {
      console.error('Error loading contact info from CMS:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  const validate = () => {
    const tempErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formState.name.trim()) {
      tempErrors.name = 'Please provide your full name.';
      isValid = false;
    }

    if (!formState.email.trim()) {
      tempErrors.email = 'Email address is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      tempErrors.email = 'Please provide a valid email format.';
      isValid = false;
    }

    if (!formState.message.trim()) {
      tempErrors.message = 'Please input your creative brief or message.';
      isValid = false;
    } else if (formState.message.length < 10) {
      tempErrors.message = 'Message should be at least 10 characters long.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable form upload
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: '', email: '', message: '' });
      
      // Auto dismiss success window after 6s
      setTimeout(() => setIsSuccess(false), 6000);
    }, 2000);
  };

  const rawPhone = contact.phone.replace(/[^\d+]/g, '');

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">SECURE A BRIEF</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            LET'S WORK TOGETHER
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Contact Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <h3 className="font-sans text-2xl font-black text-white tracking-tight">
                HAVE A CREATIVE CONCEPT?
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Whether you need a full brand identity package, high-converting social media creatives, dynamic YouTube thumbnail templates, or viral vertical reels edited to absolute perfection—Alpha Edit Studio is ready to help you execute.
              </p>

              {/* Work modes */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['Freelance Contracts', 'Full-Time Positions', 'Remote Consulting'].map((mode) => (
                  <span key={mode} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-semibold font-sans">
                    <Briefcase className="w-3.5 h-3.5 shrink-0" />
                    <span>{mode}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Channels Cards */}
            <div className="space-y-4">
              {/* Phone/WhatsApp */}
              <a
                href={`https://wa.me/${rawPhone || '919343412416'}?text=Hi%20Alpha%20Edit%20Studio%2C%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20collaborate%21`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-4 p-5 rounded-2xl border border-amber-500/20 bg-[#121212] transition-colors group cursor-pointer interactive-target"
              >
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform border border-amber-500/20">
                  <MessageCircle className="w-5 h-5 fill-amber-500/10" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block">WhatsApp Chat</span>
                  <span className="font-sans font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{contact.phone}</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contact.email}?subject=Project Inquiry`}
                className="flex items-center space-x-4 p-5 rounded-2xl border border-amber-500/20 bg-[#121212] transition-colors group cursor-pointer interactive-target"
              >
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-105 transition-transform border border-amber-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block">Email Address</span>
                  <span className="font-sans font-bold text-sm text-white group-hover:text-amber-400 transition-colors">{contact.email}</span>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center space-x-4 p-5 rounded-2xl border border-amber-500/20 bg-[#121212] cursor-default">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block">Location HQ</span>
                  <span className="font-sans font-bold text-sm text-white">{contact.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl border border-amber-500/20 bg-[#121212] backdrop-blur-sm shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6 flex-1 flex flex-col justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="space-y-5">
                      <h4 className="font-sans text-lg font-bold text-white tracking-wide">
                        TRANSMIT DIRECT INQUIRY
                      </h4>
                      
                      {/* Name input */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block font-semibold">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          placeholder="What should we call you?"
                          className={`w-full bg-[#080808] border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${
                            errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-amber-500/20'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-[11px] font-sans flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block font-semibold">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          placeholder="Where can we reply to you?"
                          className={`w-full bg-[#080808] border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${
                            errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-amber-500/20'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-[11px] font-sans flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* Message brief input */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block font-semibold">Project Brief or Concept</label>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Describe your design, video specs, or branding milestones..."
                          className={`w-full bg-[#080808] border rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors resize-none ${
                            errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-amber-500/20'
                          }`}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-[11px] font-sans flex items-center space-x-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.message}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit action */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2.5 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed interactive-target"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                            <span>SECURED CONNECTING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>TRANSMIT MESSAGE BRIEF</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center text-center h-full py-16 space-y-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="p-5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5 animate-bounce">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-sans text-xl font-black text-white tracking-tight uppercase">
                        TRANSMISSION SECURED!
                      </h4>
                      <p className="text-gray-300 text-xs md:text-sm max-w-sm leading-relaxed mx-auto">
                        Your project brief has been successfully synchronized. Alpha Edit Studio will review your specs and follow up with you via email within 12 hours.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      SEND ANOTHER BRIEF
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
