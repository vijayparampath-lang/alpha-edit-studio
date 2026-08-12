import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import PortfolioGrid from './components/PortfolioGrid';
import Skills from './components/Skills';
import WhyChooseMe from './components/WhyChooseMe';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ParticleBackground from './components/ParticleBackground';
import LoadingScreen from './components/LoadingScreen';
import ResumeModal from './components/ResumeModal';
import AdminDashboard from './components/AdminDashboard';
import { AnimatePresence } from 'motion/react';
import { api } from './lib/supabase';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Monitor path and hash for /admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setIsAdminOpen(true);
      } else if (!hash.startsWith('#project-')) {
        // If not project details and not admin, close admin dashboard modal
        setIsAdminOpen(false);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Permanently enforce dark luxury theme
  useEffect(() => {
    localStorage.setItem('vj-portfolio-theme', 'dark');
    setIsDarkMode(true);
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.colorScheme = 'dark';
  }, []);

  const toggleTheme = () => {
    // Theme is permanently locked to dark luxury theme
    setIsDarkMode(true);
    localStorage.setItem('vj-portfolio-theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.colorScheme = 'dark';
  };

  // Perform active section scroll tracking
  useEffect(() => {
    const sections = ['home', 'about', 'services', 'portfolio', 'skills', 'experience', 'testimonials', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SEO & Head tag injections from central settings CMS
  const updateSEOAndHead = async () => {
    try {
      const settings = await api.getSettings();
      const contact = await api.getContact();
      const websiteName = settings?.websiteName || 'Alpha Edit Studio';
      const whatsapp = settings?.whatsappNumber || contact?.phone || '+91 93434 12416';
      const contactEmail = contact?.email || 'alphaeditstudio8@gmail.com';
      const contactAddress = contact?.address || 'Indore, Madhya Pradesh, India';
      const currentOrigin = window.location.origin;

      // Define optimized, unique metadata profiles based on current navigation section
      let seoTitle = 'Alpha Edit Studio | Luxury Post-Production & Creative Agency';
      let seoDesc = 'Discover luxury post-production, custom brand identity, cinematic video edits, and high-retention motion graphics by Alpha Edit Studio.';
      let seoKeywords = 'Alpha Edit Studio, video editing agency, post production house, luxury branding specialist, cinematic video editing, reels creator, motion designer, figma, premiere pro, after effects';

      if (isAdminOpen) {
        seoTitle = 'Admin CMS Cockpit | Alpha Edit Studio';
        seoDesc = 'Secure administrative control panel to manage portfolio projects, upload resume PDFs, edit contact cards, and synchronize social links.';
        seoKeywords = 'admin portal, portfolio cms, database sync, secure administrative panel';
      } else {
        switch (activeSection) {
          case 'home':
            seoTitle = `${websiteName} | Post-Production & Creative Agency`;
            seoDesc = settings?.seoDescription || 'Welcome to Alpha Edit Studio. Explore original logo shapes, luxury brand graphics, and engaging post-production video edits.';
            break;
          case 'about':
            seoTitle = `About Alpha Edit Studio | Post-Production & Branding Experts`;
            seoDesc = 'Learn about Alpha Edit Studio\'s professional journey, artistic philosophy, creative workflows, and passion for crafting flawless visual identities.';
            seoKeywords = 'Alpha Edit Studio bio, agency experience, video editor background, post production Los Angeles';
            break;
          case 'services':
            seoTitle = `Creative Services | Bespoke Branding, Logo Design & Cinematic Post-Production`;
            seoDesc = 'Explore premium services including high-retention video editing, vector brand identity, cinematic trailers, dynamic reels, and custom UI design.';
            seoKeywords = 'branding design services, professional video post production, vector logo design, social media reels, figma UI layouts';
            break;
          case 'portfolio':
            seoTitle = 'Creative Portfolio Showcase | Design & Video Case Studies';
            seoDesc = 'Browse a premium selection of logo geometries, promotional social campaigns, motion posters, and travel documentaries completed for global clients.';
            seoKeywords = 'portfolio showreel, designer portfolio, video production examples, client case studies';
            break;
          case 'skills':
            seoTitle = 'Technical Skillset & Creative Competency Matrix | Alpha Edit Studio';
            seoDesc = 'In-depth breakdown of software expertise and creative mastery. Highly proficient in Adobe Premiere, After Effects, DaVinci Resolve, Photoshop, and Figma.';
            seoKeywords = 'adobe premiere pro, adobe after effects, davinci resolve color grading, figma prototyping, creative design mastery';
            break;
          case 'experience':
            seoTitle = 'Professional Milestones & Track Record | Alpha Edit Studio';
            seoDesc = 'Examine the milestones, corporate partnerships, and creative leadership roles held by Alpha Edit Studio in top-tier advertising and production environments.';
            seoKeywords = 'agency track record, professional achievements, corporate projects, agency history';
            break;
          case 'testimonials':
            seoTitle = 'Client Testimonials & Industry Reviews | Alpha Edit Studio';
            seoDesc = 'Read genuine recommendations and success stories from brand managers, directors, and agency clients who elevated their presence with Alpha Edit Studio.';
            seoKeywords = 'client testimonials, reviews, endorsements, project recommendations';
            break;
          case 'contact':
            seoTitle = 'Get In Touch | Collaborative Design & Video Bookings';
            seoDesc = 'Get custom pricing packages for logo design, branding projects, or video post-production. Drop a message to start our next creative campaign.';
            seoKeywords = 'hire video editor, book branding designer, freelance design quote, contact Alpha Edit Studio';
            break;
        }
      }

      // Update basic DOM properties
      document.title = seoTitle;
      document.documentElement.lang = 'en';

      // Helper to dynamically insert or update Meta tags in Head
      const updateTag = (name: string, value: string, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let element = document.querySelector(selector);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(isProperty ? 'property' : 'name', name);
          document.head.appendChild(element);
        }
        element.setAttribute('content', value);
      };

      // 1. Meta SEO Core
      updateTag('description', seoDesc);
      updateTag('keywords', seoKeywords);
      updateTag('author', 'Alpha Edit Studio');
      updateTag('robots', isAdminOpen ? 'noindex, nofollow' : 'index, follow');
      updateTag('theme-color', '#080808');

      // 2. Open Graph Protocol
      updateTag('og:title', seoTitle, true);
      updateTag('og:description', seoDesc, true);
      updateTag('og:url', currentOrigin + (activeSection !== 'home' ? `#${activeSection}` : ''), true);
      updateTag('og:type', 'website', true);
      updateTag('og:site_name', websiteName, true);
      updateTag('og:image', `${currentOrigin}/final-logo.jpg`, true);

      // 3. Twitter Card Tags
      updateTag('twitter:card', 'summary_large_image');
      updateTag('twitter:title', seoTitle);
      updateTag('twitter:description', seoDesc);
      updateTag('twitter:image', `${currentOrigin}/final-logo.jpg`);

      // 4. Dynamic Canonical Link Update
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', currentOrigin + '/' + (activeSection !== 'home' && !isAdminOpen ? `#${activeSection}` : ''));

      // 5. Schema.org Integrated JSON-LD Structured Graph
      let schemaScript = document.getElementById('seo-structured-data');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-structured-data';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }

      const schemaGraph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['Organization', 'LocalBusiness'],
            '@id': `${currentOrigin}/#organization`,
            'name': websiteName,
            'telephone': whatsapp,
            'email': contactEmail,
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': contactAddress,
              'addressLocality': 'Indore',
              'addressRegion': 'Madhya Pradesh',
              'addressCountry': 'India'
            },
            'image': `${currentOrigin}/final-logo.jpg`,
            'url': currentOrigin,
            'sameAs': [
              'https://linkedin.com',
              'https://instagram.com',
              'https://youtube.com'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${currentOrigin}/#website`,
            'url': currentOrigin,
            'name': websiteName,
            'description': 'Luxury Post-Production & Creative Agency Hub',
            'publisher': {
              '@id': `${currentOrigin}/#organization`
            }
          },
          {
            '@type': 'CreativeWork',
            '@id': `${currentOrigin}/#portfolio-work`,
            'name': 'Alpha Edit Studio Portfolio',
            'author': {
              '@id': `${currentOrigin}/#organization`
            },
            'headline': 'Original logo shapes, luxury branding campaigns, and high-retention video assets',
            'inLanguage': 'en'
          }
        ]
      };

      schemaScript.innerHTML = JSON.stringify(schemaGraph);
    } catch (e) {
      console.error('Failed to update dynamic SEO head tags:', e);
    }
  };

  useEffect(() => {
    updateSEOAndHead();
    window.addEventListener('cms-update', updateSEOAndHead);
    return () => window.removeEventListener('cms-update', updateSEOAndHead);
  }, [activeSection, isAdminOpen, isDarkMode]);

  return (
    <div className="dark text-white bg-[#080808]">
      
      {/* Immersive Loading Intro */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* Custom follow cursor for desktop */}
          <CustomCursor />

          {/* Interactive Particle background */}
          <ParticleBackground isDarkMode={isDarkMode} />

          {/* Global Page Layout Wrapper */}
          <div className="relative min-h-screen z-10 select-none">
            
            {/* Header navbar */}
            <Navbar
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              openResume={() => setIsResumeOpen(true)}
              openAdmin={() => setIsAdminOpen(true)}
              activeSection={activeSection}
            />

            {/* Core page segments */}
            <main>
              <Hero openResume={() => setIsResumeOpen(true)} />
              <About />
              <Services />
              <PortfolioGrid />
              <Skills />
              <WhyChooseMe />
              <Testimonials />
              <FAQ />
              <Contact />
            </main>

            {/* Structured Footer */}
            <Footer />

          </div>

          {/* Dedicated Resume Portal Modal */}
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
          />

          {/* Admin Cockpit Modal */}
          <AnimatePresence>
            {isAdminOpen && (
              <AdminDashboard onClose={() => setIsAdminOpen(false)} />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
