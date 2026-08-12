import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, ExtendedPortfolioItem } from '../lib/supabase';
import { Search, Filter, Play, ChevronLeft, ChevronRight, X, ZoomIn, DollarSign, Calendar, User, Tag, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';
import PortfolioVideoPlayer from './PortfolioVideoPlayer';

const CATEGORIES = [
  'All',
  'Logo Design',
  'Social Media',
  'Posters',
  'Branding',
  'Video Editing',
  'Reels',
  'Motion Graphics',
  'UI Design'
];

export default function PortfolioGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ExtendedPortfolioItem[]>([]);
  const [activeItem, setActiveItem] = useState<ExtendedPortfolioItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getPortfolioItems();
      // Filter Active projects by default unless they are admin, but since this is frontend, we only display Active status
      const activeProjects = data.filter(item => !item.status || item.status === 'Active');
      setItems(activeProjects);
    } catch (e) {
      console.error('Error loading portfolio items from CMS:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('cms-update', loadData);
    return () => window.removeEventListener('cms-update', loadData);
  }, []);

  // Hash-based browser back and deep-linking support (including image zoom sub-route)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        const isZoom = hash.endsWith('-zoom');
        const id = hash.replace('#project-', '').replace('-zoom', '');
        const found = items.find(item => String(item.id) === id);
        if (found) {
          setActiveItem(found);
          if (isZoom) {
            setLightboxOpen(true);
          } else {
            setLightboxOpen(false);
          }
        } else {
          setActiveItem(null);
          setLightboxOpen(false);
        }
      } else {
        setActiveItem(null);
        setLightboxOpen(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (items.length > 0) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [items]);

  // Keyboard navigation support: ESC key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          if (activeItem) {
            window.location.hash = `project-${activeItem.id}`;
          } else {
            setLightboxOpen(false);
          }
        } else if (activeItem) {
          handleBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeItem]);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Modal Navigation
  const handleBack = () => {
    setActiveItem(null);
    window.location.hash = 'portfolio';
  };

  const handlePrevItem = () => {
    if (!activeItem) return;
    const currentIndex = filteredItems.findIndex((x) => x.id === activeItem.id);
    let prevItem: ExtendedPortfolioItem;
    if (currentIndex > 0) {
      prevItem = filteredItems[currentIndex - 1];
    } else {
      prevItem = filteredItems[filteredItems.length - 1]; // wrap to end
    }
    (window as any).vjProjectNavigated = true;
    window.location.hash = `project-${prevItem.id}`;
  };

  const handleNextItem = () => {
    if (!activeItem) return;
    const currentIndex = filteredItems.findIndex((x) => x.id === activeItem.id);
    let nextItem: ExtendedPortfolioItem;
    if (currentIndex < filteredItems.length - 1) {
      nextItem = filteredItems[currentIndex + 1];
    } else {
      nextItem = filteredItems[0]; // wrap to start
    }
    (window as any).vjProjectNavigated = true;
    window.location.hash = `project-${nextItem.id}`;
  };

  // Helper to render pricing structure
  const renderPricing = (item: ExtendedPortfolioItem) => {
    if (item.customPricingText) {
      return (
        <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
          {item.customPricingText}
        </span>
      );
    }

    if (item.price !== undefined && item.price !== null) {
      const isDiscounted = item.discountPrice !== undefined && item.discountPrice !== null && Number(item.discountPrice) > 0;
      return (
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          {item.isStartingFrom && <span className="text-gray-500 font-bold uppercase text-[9px]">Starting From</span>}
          {isDiscounted ? (
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-extrabold font-mono">${item.discountPrice}</span>
              <span className="text-gray-500 line-through text-[10px]">${item.price}</span>
            </div>
          ) : (
            <span className="text-amber-400 font-extrabold font-mono">${item.price}</span>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-[#080808] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
          {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="font-mono text-xs text-amber-500 font-bold uppercase tracking-[0.25em]">CREATIVE OUTPUT</span>
          <h2 className="font-sans text-3xl md:text-5xl font-black text-white tracking-tight mt-2">
            DESIGN & VIDEO GALLERY
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mt-4" />
        </div>

        {/* Search & Category Filter bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-[#121212] p-4 rounded-2xl border border-amber-500/20 backdrop-blur-sm shadow-xl">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none snap-x">
            <Filter className="w-4 h-4 text-amber-500 shrink-0 mr-1 hidden sm:block" />
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap snap-center cursor-pointer interactive-target ${
                    isActive
                      ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20'
                      : 'text-gray-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <input
              type="text"
              placeholder="Search assets, tags, clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-amber-500/20 rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-mono font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isVideoCategory = ['Video Editing', 'Reels', 'Motion Graphics'].includes(item.category);
              const pricingLine = renderPricing(item);

              return (
                <motion.div
                  key={item.id}
                  layoutId={`portfolio-card-${item.id}`}
                  className="group relative rounded-2xl border border-amber-500/20 bg-[#121212] overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col h-full cursor-pointer interactive-target"
                  onClick={() => {
                    setActiveItem(item);
                    setActiveImageIndex(0);
                    (window as any).vjProjectNavigated = true;
                    window.location.hash = `project-${item.id}`;
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Card Image Wrapper */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-950">
                    <img
                      src={item.image}
                      alt={`${item.title} - ${item.subcategory} Project Portfolio`}
                      title={item.title}
                      loading="lazy"
                      width="400"
                      height="300"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                    {/* Media Type Indicator */}
                    {isVideoCategory ? (
                      <div className="absolute top-4 right-4 p-2.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/20 animate-pulse">
                        <Play className="w-3.5 h-3.5 fill-black" />
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4 p-2.5 rounded-full bg-amber-500 text-black shadow-lg shadow-amber-500/20">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Quick Category Tag */}
                    <span className="absolute bottom-4 left-4 text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-black/90 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {item.subcategory}
                    </span>
                  </div>

                  {/* Card Details Panel */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-sans font-bold text-sm text-white tracking-wide group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h3>
                        {pricingLine && (
                          <div className="shrink-0 mt-0.5">
                            {pricingLine}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-500/10">
                      {item.tags && item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono font-medium text-amber-400/80 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-[#121212] border border-dashed border-amber-500/30 rounded-3xl">
            <Search className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-white font-bold text-base">No creative items match your filters</h3>
            <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">Try typing a different search query or expanding your category selection filter.</p>
          </div>
        )}

        {/* Project Details Modal */}
        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBack}
              />

              {/* Modal Card content */}
              <motion.div
                layoutId={`portfolio-card-${activeItem.id}`}
                className="relative bg-[#0d0d0d] border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-amber-950/20 flex flex-col z-10"
              >
                {/* Modal Header controls */}
                <div className="flex items-center justify-between p-5 border-b border-amber-500/20 bg-[#121212] z-20">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
                    Alpha Edit Studio • {activeItem.subcategory}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold transition-colors cursor-pointer text-xs font-sans shadow-lg shadow-amber-500/20"
                      title="Back to Gallery"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Gallery</span>
                    </button>
                    <div className="h-6 w-[1px] bg-amber-500/20" />
                    <button
                      onClick={handlePrevItem}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                      title="Previous Project"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextItem}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                      title="Next Project"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleBack}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Modal Scrollable container */}
                <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6 bg-[#0d0d0d]">
                  {/* Media Presentation Display */}
                  <div className="rounded-xl overflow-hidden bg-black border border-amber-500/20 relative shadow-inner aspect-[16/9] flex items-center justify-center">
                    {activeItem.videoUrl ? (
                      <PortfolioVideoPlayer
                        videoUrl={activeItem.videoUrl}
                        videoPlatform={activeItem.videoPlatform}
                        posterUrl={activeItem.image}
                        title={activeItem.title}
                      />
                    ) : (
                      <div className="relative group/light w-full h-full cursor-zoom-in" onClick={() => { if (activeItem) { window.location.hash = `project-${activeItem.id}-zoom`; } setLightboxOpen(true); }}>
                        <img
                          src={activeItem.images && activeItem.images.length > 0 ? activeItem.images[activeImageIndex] : activeItem.image}
                          alt={`${activeItem.title} - Showcase Display - Visual Artwork`}
                          title={`${activeItem.title} - Display`}
                          loading="lazy"
                          width="800"
                          height="450"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover/light:bg-black/60 transition-colors flex items-center justify-center opacity-0 group-hover/light:opacity-100">
                          <span className="px-4 py-2 rounded-xl bg-[#121212] text-xs font-bold text-amber-400 tracking-wider uppercase border border-amber-500/30 flex items-center space-x-2">
                            <ZoomIn className="w-4 h-4 text-amber-500" />
                            <span>Zoom Image</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
 
                  {/* Multiple Images Selector Row */}
                  {!activeItem.videoUrl && activeItem.images && activeItem.images.length > 1 && (
                    <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-thin">
                      {activeItem.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                            activeImageIndex === idx ? 'border-amber-500 scale-95' : 'border-amber-500/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`${activeItem.title} - Alternate View Thumbnail ${idx + 1}`}
                            title={`${activeItem.title} - Alternate View ${idx + 1}`}
                            loading="lazy"
                            width="80"
                            height="56"
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Metadata Matrix Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
                    {/* Information Narrative Column */}
                    <div className="md:col-span-8 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-sans text-2xl font-black text-white tracking-tight">
                          {activeItem.title}
                        </h3>
                        {renderPricing(activeItem) && (
                          <div className="shrink-0 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-xl">
                            <span className="text-[10px] text-amber-400 font-mono block uppercase leading-none mb-1">Pricing Detail</span>
                            {renderPricing(activeItem)}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                        {activeItem.description}
                      </p>
                    </div>

                    {/* Key-Value details Column */}
                    <div className="md:col-span-4 bg-[#121212] p-5 rounded-2xl border border-amber-500/20 text-xs space-y-3.5">
                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                        <div className="flex items-center space-x-2 text-amber-500 font-mono">
                          <User className="w-3.5 h-3.5" />
                          <span>CLIENT</span>
                        </div>
                        <span className="text-white font-bold">{activeItem.client || 'Agency Showcase'}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                        <div className="flex items-center space-x-2 text-amber-500 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>YEAR</span>
                        </div>
                        <span className="text-white font-bold">{activeItem.year}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                        <div className="flex items-center space-x-2 text-amber-500 font-mono">
                          <Tag className="w-3.5 h-3.5" />
                          <span>CATEGORY</span>
                        </div>
                        <span className="text-amber-400 font-bold">{activeItem.subcategory}</span>
                      </div>

                      {activeItem.link && (
                        <div className="pt-2">
                          <a
                            href={activeItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20"
                          >
                            <span>Visit Live Project</span>
                          </a>
                        </div>
                      )}

                      <div className="pt-2">
                        <span className="text-amber-500 text-[10px] font-mono tracking-widest block mb-2 uppercase">Tags</span>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {activeItem.tags && activeItem.tags.map((t) => (
                            <span key={t} className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-amber-500/20">
                        <span className="text-amber-500 text-[10px] font-mono tracking-widest block mb-2 uppercase">Share Project</span>
                        <div className="flex items-center space-x-2">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200 cursor-pointer border border-amber-500/20"
                            title="Share on Facebook"
                            aria-label="Share on Facebook"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out Alpha Edit Studio's creative project: ${activeItem.title}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200 cursor-pointer border border-amber-500/20"
                            title="Share on Twitter"
                            aria-label="Share on Twitter"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200 cursor-pointer border border-amber-500/20"
                            title="Share on LinkedIn"
                            aria-label="Share on LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out Alpha Edit Studio's project: ${activeItem.title} - ${window.location.href}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-2.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200 cursor-pointer text-[10px] font-mono font-bold leading-none border border-amber-500/20"
                            title="Share on WhatsApp"
                            aria-label="Share on WhatsApp"
                          >
                            WA
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Image Full-Screen Lightbox Portal */}
        <AnimatePresence>
          {lightboxOpen && activeItem && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 cursor-zoom-out"
              onClick={() => {
                window.location.hash = `project-${activeItem.id}`;
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.hash = `project-${activeItem.id}`;
                }}
                className="absolute top-6 right-6 p-3 rounded-full bg-gray-900 text-white border border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors z-55"
                title="Close Zoom"
              >
                <X className="w-5 h-5" />
              </button>
              <motion.img
                src={activeItem.images && activeItem.images.length > 0 ? activeItem.images[activeImageIndex] : activeItem.image}
                alt={activeItem.title}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
