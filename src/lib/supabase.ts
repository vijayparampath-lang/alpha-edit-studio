import { createClient } from '@supabase/supabase-js';
import { PortfolioItem, Skill, Experience, Testimonial, Service } from '../types';
import { PORTFOLIO_ITEMS, SKILLS, EXPERIENCE_TIMELINE, TESTIMONIALS, SERVICES } from '../data';

// Extended portfolio item type to support pricing and status
export interface ExtendedPortfolioItem extends PortfolioItem {
  images?: string[];
  status?: 'Active' | 'Hidden';
  price?: number;
  discountPrice?: number;
  isStartingFrom?: boolean;
  customPricingText?: string;
  created_at?: string;
}

export interface AboutCMS {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  resumeUrl: string;
}

export interface ContactCMS {
  email: string;
  phone: string;
  address: string;
}

export interface SettingsCMS {
  websiteName: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  footerText: string;
  copyrightText: string;
  seoTitle: string;
  seoDescription: string;
  themeColor: string;
  accentColor: string;
}

export interface SocialLinkCMS {
  id: string;
  platform: string;
  url: string;
}

// Check for local storage settings first, then env variables
const getSupabaseConfig = () => {
  const url = localStorage.getItem('vj-supabase-url') || ((import.meta as any).env.VITE_SUPABASE_URL as string) || '';
  const key = localStorage.getItem('vj-supabase-anon-key') || ((import.meta as any).env.VITE_SUPABASE_ANON_KEY as string) || '';
  return { url, key };
};

const config = getSupabaseConfig();
export const isSupabaseConfigured = () => {
  const { url, key } = getSupabaseConfig();
  return url.length > 0 && key.length > 0;
};

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
};

// Fallback LocalStorage Database Management
const LS_KEYS = {
  PORTFOLIO: 'vj_cms_portfolio',
  ABOUT: 'vj_cms_about',
  SERVICES: 'vj_cms_services',
  SKILLS: 'vj_cms_skills',
  EXPERIENCE: 'vj_cms_experience',
  TESTIMONIALS: 'vj_cms_testimonials',
  CONTACT: 'vj_cms_contact',
  SOCIALS: 'vj_cms_socials',
  SETTINGS: 'vj_cms_settings'
};

const getLS = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
};

const setLS = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch event for reactive updates in other components
  window.dispatchEvent(new Event('cms-update'));
};

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'f' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
};

// --- INDEXEDDB STORAGE MOCK FOR MEDIA ---
const DB_NAME = 'vj_cms_media_db';
const STORE_NAME = 'media';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function setIndexedDB(key: string, val: Blob | File): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('Failed to save to IndexedDB', e);
  }
}

export async function getIndexedDB(key: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('Failed to read from IndexedDB', e);
    return null;
  }
}

export async function deleteIndexedDB(key: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error('Failed to delete from IndexedDB', e);
  }
}

const resolvedUrlCache = new Map<string, string>();
const reverseUrlMap = new Map<string, string>();

export async function resolveMediaUrl(url: string): Promise<string> {
  if (typeof url === 'string' && url.startsWith('db-media://')) {
    const cached = resolvedUrlCache.get(url);
    if (cached) return cached;

    const id = url.replace('db-media://', '');
    const blob = await getIndexedDB(id);
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      resolvedUrlCache.set(url, objUrl);
      reverseUrlMap.set(objUrl, url);
      return objUrl;
    }
  }
  return url;
}

export async function resolveObjectMediaUrls<T>(obj: T): Promise<T> {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return (await resolveMediaUrl(obj)) as any;
  }
  if (Array.isArray(obj)) {
    const resolvedArray = await Promise.all(obj.map(item => resolveObjectMediaUrls(item)));
    return resolvedArray as any;
  }
  if (typeof obj === 'object') {
    const resolvedObj = { ...obj } as any;
    for (const key of Object.keys(resolvedObj)) {
      resolvedObj[key] = await resolveObjectMediaUrls(resolvedObj[key]);
    }
    return resolvedObj;
  }
  return obj;
}

export function unresolveMediaUrl(url: string): string {
  if (typeof url === 'string') {
    return reverseUrlMap.get(url) || url;
  }
  return url;
}

export function unresolveObjectMediaUrls<T>(obj: T): T {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return unresolveMediaUrl(obj) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => unresolveObjectMediaUrls(item)) as any;
  }
  if (typeof obj === 'object') {
    const unresolvedObj = { ...obj } as any;
    for (const key of Object.keys(unresolvedObj)) {
      unresolvedObj[key] = unresolveObjectMediaUrls(unresolvedObj[key]);
    }
    return unresolvedObj;
  }
  return obj;
}

// Helper to convert data URI (Base64) to Blob
function dataURItoBlob(dataURI: string): { blob: Blob; mime: string } | null {
  try {
    const parts = dataURI.split(',');
    if (parts.length < 2) return null;
    const header = parts[0];
    const data = parts[1];
    
    let mime = 'application/octet-stream';
    const mimeMatch = header.match(/data:(.*?);/);
    if (mimeMatch) {
      mime = mimeMatch[1];
    }
    
    const isBase64 = header.indexOf('base64') >= 0;
    let binaryStr;
    if (isBase64) {
      binaryStr = atob(data);
    } else {
      binaryStr = decodeURIComponent(data);
    }
    
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    
    return { blob: new Blob([bytes], { type: mime }), mime };
  } catch (e) {
    console.error('Error converting data URI to blob', e);
    return null;
  }
}

// Automatic migration function to convert existing Base64 strings to IndexedDB references
export async function autoMigrateBase64ToIndexedDB(): Promise<void> {
  let migrated = false;

  // 1. Migrate Portfolio Items
  const portfolioStr = localStorage.getItem(LS_KEYS.PORTFOLIO);
  if (portfolioStr) {
    try {
      const items = JSON.parse(portfolioStr) as ExtendedPortfolioItem[];
      for (const item of items) {
        if (typeof item.image === 'string' && item.image.startsWith('data:')) {
          const res = dataURItoBlob(item.image);
          if (res) {
            const id = `db-media-${generateUUID()}`;
            await setIndexedDB(id, res.blob);
            item.image = `db-media://${id}`;
            migrated = true;
          }
        }
        if (Array.isArray(item.images)) {
          for (let i = 0; i < item.images.length; i++) {
            const img = item.images[i];
            if (typeof img === 'string' && img.startsWith('data:')) {
              const res = dataURItoBlob(img);
              if (res) {
                const id = `db-media-${generateUUID()}`;
                await setIndexedDB(id, res.blob);
                item.images[i] = `db-media://${id}`;
                migrated = true;
              }
            }
          }
        }
        if (typeof item.videoUrl === 'string' && item.videoUrl.startsWith('data:')) {
          const res = dataURItoBlob(item.videoUrl);
          if (res) {
            const id = `db-media-${generateUUID()}`;
            await setIndexedDB(id, res.blob);
            item.videoUrl = `db-media://${id}`;
            migrated = true;
          }
        }
      }
      if (migrated) {
        localStorage.setItem(LS_KEYS.PORTFOLIO, JSON.stringify(items));
      }
    } catch (e) {
      console.error('Error migrating portfolio items:', e);
    }
  }

  // 2. Migrate About CMS
  const aboutStr = localStorage.getItem(LS_KEYS.ABOUT);
  if (aboutStr) {
    try {
      const about = JSON.parse(aboutStr) as AboutCMS;
      let aboutMigrated = false;
      if (typeof about.profileImage === 'string' && about.profileImage.startsWith('data:')) {
        const res = dataURItoBlob(about.profileImage);
        if (res) {
          const id = `db-media-${generateUUID()}`;
          await setIndexedDB(id, res.blob);
          about.profileImage = `db-media://${id}`;
          aboutMigrated = true;
          migrated = true;
        }
      }
      if (typeof about.resumeUrl === 'string' && about.resumeUrl.startsWith('data:')) {
        const res = dataURItoBlob(about.resumeUrl);
        if (res) {
          const id = `db-media-${generateUUID()}`;
          await setIndexedDB(id, res.blob);
          about.resumeUrl = `db-media://${id}`;
          aboutMigrated = true;
          migrated = true;
        }
      }
      if (aboutMigrated) {
        localStorage.setItem(LS_KEYS.ABOUT, JSON.stringify(about));
      }
    } catch (e) {
      console.error('Error migrating about data:', e);
    }
  }

  // 3. Migrate Testimonials
  const testimonialsStr = localStorage.getItem(LS_KEYS.TESTIMONIALS);
  if (testimonialsStr) {
    try {
      const testimonials = JSON.parse(testimonialsStr) as Testimonial[];
      let testimonialsMigrated = false;
      for (const t of testimonials) {
        if (typeof t.avatar === 'string' && t.avatar.startsWith('data:')) {
          const res = dataURItoBlob(t.avatar);
          if (res) {
            const id = `db-media-${generateUUID()}`;
            await setIndexedDB(id, res.blob);
            t.avatar = `db-media://${id}`;
            testimonialsMigrated = true;
            migrated = true;
          }
        }
      }
      if (testimonialsMigrated) {
        localStorage.setItem(LS_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      }
    } catch (e) {
      console.error('Error migrating testimonials data:', e);
    }
  }

  if (migrated) {
    console.log('Successfully migrated Base64 media elements to IndexedDB!');
    window.dispatchEvent(new Event('cms-update'));
  }
}

// Seeding standard defaults to LocalStorage if empty
export const seedLocalStorageDefaults = (force = false) => {
  if (force || !localStorage.getItem(LS_KEYS.PORTFOLIO)) {
    setLS(LS_KEYS.PORTFOLIO, PORTFOLIO_ITEMS.map(item => ({
      ...item,
      images: [item.image],
      status: 'Active',
      price: undefined,
      discountPrice: undefined,
      isStartingFrom: false,
      customPricingText: ''
    })));
  }
  if (force || !localStorage.getItem(LS_KEYS.SERVICES)) {
    setLS(LS_KEYS.SERVICES, SERVICES);
  }
  if (force || !localStorage.getItem(LS_KEYS.SKILLS)) {
    setLS(LS_KEYS.SKILLS, SKILLS);
  }
  if (force || !localStorage.getItem(LS_KEYS.EXPERIENCE)) {
    setLS(LS_KEYS.EXPERIENCE, EXPERIENCE_TIMELINE);
  }
  if (force || !localStorage.getItem(LS_KEYS.TESTIMONIALS)) {
    setLS(LS_KEYS.TESTIMONIALS, TESTIMONIALS);
  }
  if (force || !localStorage.getItem(LS_KEYS.ABOUT)) {
    setLS(LS_KEYS.ABOUT, {
      name: 'Alpha Edit Studio',
      title: 'Luxury Creative & Post-Production Studio',
      bio: 'Alpha Edit Studio is a premier creative agency specializing in luxury vector branding, bespoke identity design, cinematic video post-production, and high-retention digital motion assets.',
      profileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      resumeUrl: ''
    });
  }
  if (force || !localStorage.getItem(LS_KEYS.CONTACT)) {
    setLS(LS_KEYS.CONTACT, {
      email: 'alphaeditstudio8@gmail.com',
      phone: '+91 93434 12416',
      address: 'Indore, Madhya Pradesh, India'
    });
  }
  if (force || !localStorage.getItem(LS_KEYS.SOCIALS)) {
    setLS(LS_KEYS.SOCIALS, [
      { id: '1', platform: 'YouTube', url: 'https://youtube.com/@alphaeditstudio' },
      { id: '2', platform: 'Instagram', url: 'https://instagram.com/alphaeditstudio' },
      { id: '3', platform: 'LinkedIn', url: 'https://linkedin.com/company/alphaeditstudio' },
      { id: '4', platform: 'Twitter/X', url: 'https://twitter.com/alphaeditstudio' },
      { id: '5', platform: 'Behance', url: 'https://behance.net/alphaeditstudio' },
      { id: '6', platform: 'Dribbble', url: '' },
      { id: '7', platform: 'GitHub', url: '' },
      { id: '8', platform: 'TikTok', url: '' },
      { id: '9', platform: 'WhatsApp', url: 'https://wa.me/919343412416' },
      { id: '10', platform: 'Threads', url: '' },
      { id: '11', platform: 'Pinterest', url: '' },
      { id: '12', platform: 'Facebook', url: '' },
      { id: '13', platform: 'Telegram', url: '' },
      { id: '14', platform: 'Discord', url: '' },
      { id: '15', platform: 'Personal Blog', url: '' }
    ]);
  }
  if (force || !localStorage.getItem(LS_KEYS.SETTINGS)) {
    setLS(LS_KEYS.SETTINGS, {
      websiteName: 'Alpha Edit Studio',
      logoText: 'AES',
      heroTitle: 'PREMIUM POST-PRODUCTION & CREATIVE BRANDING STUDIO',
      heroSubtitle: 'Crafting high-retention cinematic edits, aesthetic brand vectors, and luxury identity systems that capture absolute attention.',
      whatsappNumber: '+91 93434 12416',
      footerText: 'Luxury post-production studio crafting original geometric vector branding structures and cinematic motion assets for global brands and creators.',
      copyrightText: '© 2026 Alpha Edit Studio. All rights reserved.',
      seoTitle: 'Alpha Edit Studio | Premium Post-Production & Branding Agency',
      seoDescription: 'Official portfolio of Alpha Edit Studio. Specializing in luxury graphic design, high-retention video editing, cinematic motion graphics, and brand identity.',
      themeColor: '#f59e0b',
      accentColor: '#eab308'
    });
  }
};

// Initialize the LocalStorage with static data on load
seedLocalStorageDefaults();
autoMigrateBase64ToIndexedDB().catch(err => console.error('Auto-migration failed:', err));

// DYNAMIC CMS API ROUTER (Tries Supabase first, falls back to LocalStorage)
export const api = {
  // --- PORTFOLIO ITEMS ---
  async getPortfolioItems(): Promise<ExtendedPortfolioItem[]> {
    const supabase = getSupabaseClient();
    let dataToResolve: ExtendedPortfolioItem[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('portfolio_items')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          dataToResolve = data as ExtendedPortfolioItem[];
        } else {
          console.error('Supabase fetch error, using local fallback:', error);
          dataToResolve = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
        }
      } catch (e) {
        console.error('Supabase exception:', e);
        dataToResolve = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
      }
    } else {
      dataToResolve = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
    }
    return await resolveObjectMediaUrls(dataToResolve);
  },

  async savePortfolioItem(item: ExtendedPortfolioItem): Promise<boolean> {
    console.log('savePortfolioItem input:', item);
    // 1. Always save to LocalStorage first to guarantee immediate local persistence & UI updates
    const items = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
    const existingIndex = items.findIndex(x => x.id === item.id);
    const updatedItem = {
      ...item,
      id: item.id || generateUUID(),
      images: Array.isArray(item.images) ? item.images.filter(Boolean) : (item.image ? [item.image] : []),
      tags: Array.isArray(item.tags) ? item.tags : [],
      status: item.status || 'Active'
    };
    if (existingIndex > -1) {
      items[existingIndex] = updatedItem;
    } else {
      items.unshift(updatedItem);
    }
    
    // Map through items and unresolve any blob: URLs back to db-media:// (or Supabase URLs)
    const unresolvedItems = items.map(x => unresolveObjectMediaUrls(x));
    setLS(LS_KEYS.PORTFOLIO, unresolvedItems);
    console.log('Saved to local storage, count is:', items.length);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const payload = {
          id: updatedItem.id,
          title: updatedItem.title,
          category: updatedItem.category,
          subcategory: updatedItem.subcategory,
          description: updatedItem.description,
          image: updatedItem.image,
          images: updatedItem.images,
          videoUrl: updatedItem.videoUrl || '',
          videoPlatform: updatedItem.videoPlatform || '',
          tags: updatedItem.tags || [],
          client: updatedItem.client || '',
          year: updatedItem.year,
          isFeatured: !!updatedItem.isFeatured,
          status: updatedItem.status || 'Active',
          price: updatedItem.price !== undefined && updatedItem.price !== null ? Number(updatedItem.price) : null,
          discountPrice: updatedItem.discountPrice !== undefined && updatedItem.discountPrice !== null ? Number(updatedItem.discountPrice) : null,
          isStartingFrom: !!updatedItem.isStartingFrom,
          customPricingText: updatedItem.customPricingText || '',
          created_at: updatedItem.created_at || new Date().toISOString()
        };

        const unresolvedPayload = unresolveObjectMediaUrls(payload);
        console.log('Syncing to Supabase with payload:', unresolvedPayload);
        const { error } = await supabase
          .from('portfolio_items')
          .upsert(unresolvedPayload);
        if (error) {
          console.error('Supabase save error:', error);
          throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
        }
        console.log('Supabase sync successful.');
      } catch (e: any) {
        console.error('Supabase save exception:', e);
        throw e;
      }
    }

    return true;
  },

  async deletePortfolioItem(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    // Helper to extract file path from a Supabase storage URL
    const extractPathFromUrl = (url: string, bucket = 'portfolio-media') => {
      const marker = `/public/${bucket}/`;
      const index = url.indexOf(marker);
      if (index !== -1) {
        return url.substring(index + marker.length);
      }
      return null;
    };

    // 1. Get current items to find the item we are about to delete
    // This allows us to clean up its media storage references
    const items = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
    const itemToDelete = items.find(x => String(x.id) === String(id));

    // 2. Delete from Supabase Database and Storage if configured
    if (supabase) {
      try {
        // Try to delete media from storage
        if (itemToDelete) {
          const urlsToClean = [itemToDelete.image, itemToDelete.videoUrl, ...(itemToDelete.images || [])].filter(Boolean) as string[];
          for (const url of urlsToClean) {
            const path = extractPathFromUrl(url);
            if (path) {
              await supabase.storage.from('portfolio-media').remove([path]);
            }
          }
        }

        // Delete row from database
        const { error } = await supabase
          .from('portfolio_items')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete error:', error);
          throw new Error(`Supabase database deletion failed: ${error.message} (Code: ${error.code})`);
        }
      } catch (e) {
        console.error('Supabase delete exception:', e);
        throw e;
      }
    }

    // 3. Always clean up LocalStorage as well to maintain perfect alignment
    const filtered = items.filter(x => String(x.id) !== String(id));
    setLS(LS_KEYS.PORTFOLIO, filtered);

    // 4. Force dispatch standard state change event for active observers
    window.dispatchEvent(new Event('cms-update'));

    return true;
  },

  // --- ABOUT CMS ---
  async getAbout(): Promise<AboutCMS> {
    const supabase = getSupabaseClient();
    let dataToResolve: AboutCMS;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('about_cms')
          .select('*')
          .single();
        if (!error && data) {
          dataToResolve = data as AboutCMS;
        } else {
          dataToResolve = getLS<AboutCMS>(LS_KEYS.ABOUT, {
            name: 'Alpha Edit Studio',
            title: 'Creative Agency Credentials & Capabilities',
            bio: '',
            profileImage: '',
            resumeUrl: ''
          });
        }
      } catch (e) {
        console.error('Supabase about fetch error:', e);
        dataToResolve = getLS<AboutCMS>(LS_KEYS.ABOUT, {
          name: 'Alpha Edit Studio',
          title: 'Creative Agency Credentials & Capabilities',
          bio: '',
          profileImage: '',
          resumeUrl: ''
        });
      }
    } else {
      dataToResolve = getLS<AboutCMS>(LS_KEYS.ABOUT, {
        name: 'Alpha Edit Studio',
        title: 'Creative Agency Credentials & Capabilities',
        bio: '',
        profileImage: '',
        resumeUrl: ''
      });
    }
    return await resolveObjectMediaUrls(dataToResolve);
  },

  async saveAbout(about: AboutCMS): Promise<boolean> {
    const unresolved = unresolveObjectMediaUrls(about);
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    setLS(LS_KEYS.ABOUT, unresolved);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('about_cms')
          .upsert({ id: 'singleton', ...unresolved });
      } catch (e) {
        console.error('Supabase about save exception:', e);
      }
    }
    return true;
  },

  // --- SERVICES CMS ---
  async getServices(): Promise<Service[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('services_cms')
          .select('*');
        if (!error && data) return data as Service[];
      } catch (e) {
        console.error('Supabase services fetch exception:', e);
      }
    }
    return getLS<Service[]>(LS_KEYS.SERVICES, []);
  },

  async saveService(service: Service): Promise<boolean> {
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    const items = getLS<Service[]>(LS_KEYS.SERVICES, []);
    const idx = items.findIndex(x => x.id === service.id);
    const updated = { ...service, id: service.id || generateUUID() };
    if (idx > -1) {
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    setLS(LS_KEYS.SERVICES, items);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('services_cms')
          .upsert({
            id: updated.id,
            title: updated.title,
            icon: updated.icon,
            description: updated.description,
            items: updated.items
          });
      } catch (e) {
        console.error('Supabase service save exception:', e);
      }
    }
    return true;
  },

  async deleteService(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('services_cms')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase service delete exception:', e);
      }
    }
    const items = getLS<Service[]>(LS_KEYS.SERVICES, []);
    setLS(LS_KEYS.SERVICES, items.filter(x => x.id !== id));
    return true;
  },

  // --- SKILLS CMS ---
  async getSkills(): Promise<Skill[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('skills_cms')
          .select('*');
        if (!error && data) return data as Skill[];
      } catch (e) {
        console.error('Supabase skills fetch exception:', e);
      }
    }
    return getLS<Skill[]>(LS_KEYS.SKILLS, []);
  },

  async saveSkill(skill: Skill): Promise<boolean> {
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    const items = getLS<Skill[]>(LS_KEYS.SKILLS, []);
    const idx = items.findIndex(x => x.name === skill.name);
    if (idx > -1) {
      items[idx] = skill;
    } else {
      items.push(skill);
    }
    setLS(LS_KEYS.SKILLS, items);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('skills_cms')
          .upsert({
            id: skill.name, // using name as id for simplicity or uuid
            name: skill.name,
            level: Number(skill.level),
            category: skill.category,
            icon: skill.icon
          });
      } catch (e) {
        console.error('Supabase skill save exception:', e);
      }
    }
    return true;
  },

  async deleteSkill(name: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('skills_cms')
          .delete()
          .eq('name', name);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase skill delete exception:', e);
      }
    }
    const items = getLS<Skill[]>(LS_KEYS.SKILLS, []);
    setLS(LS_KEYS.SKILLS, items.filter(x => x.name !== name));
    return true;
  },

  // --- EXPERIENCE CMS ---
  async getExperiences(): Promise<Experience[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('experience_timeline')
          .select('*')
          .order('id', { ascending: true });
        if (!error && data) return data as Experience[];
      } catch (e) {
        console.error('Supabase experiences fetch exception:', e);
      }
    }
    return getLS<Experience[]>(LS_KEYS.EXPERIENCE, []);
  },

  async saveExperience(exp: Experience): Promise<boolean> {
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    const items = getLS<Experience[]>(LS_KEYS.EXPERIENCE, []);
    const idx = items.findIndex(x => x.id === exp.id);
    const updated = { ...exp, id: exp.id || generateUUID() };
    if (idx > -1) {
      items[idx] = updated;
    } else {
      items.push(updated);
    }
    setLS(LS_KEYS.EXPERIENCE, items);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('experience_timeline')
          .upsert({
            id: updated.id,
            role: updated.role,
            company: updated.company,
            period: updated.period,
            description: updated.description,
            highlights: updated.highlights
          });
      } catch (e) {
        console.error('Supabase experience save exception:', e);
      }
    }
    return true;
  },

  async deleteExperience(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('experience_timeline')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase experience delete exception:', e);
      }
    }
    const items = getLS<Experience[]>(LS_KEYS.EXPERIENCE, []);
    setLS(LS_KEYS.EXPERIENCE, items.filter(x => x.id !== id));
    return true;
  },

  // --- TESTIMONIALS CMS ---
  async getTestimonials(): Promise<Testimonial[]> {
    const supabase = getSupabaseClient();
    let dataToResolve: Testimonial[] = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*');
        if (!error && data) {
          dataToResolve = data as Testimonial[];
        } else {
          dataToResolve = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []);
        }
      } catch (e) {
        console.error('Supabase testimonials fetch exception:', e);
        dataToResolve = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []);
      }
    } else {
      dataToResolve = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []);
    }
    return await resolveObjectMediaUrls(dataToResolve);
  },

  async saveTestimonial(test: Testimonial): Promise<boolean> {
    const unresolved = unresolveObjectMediaUrls(test);
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    const items = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []).map(x => unresolveObjectMediaUrls(x));
    const idx = items.findIndex(x => x.id === unresolved.id);
    if (idx > -1) {
      items[idx] = unresolved;
    } else {
      items.push(unresolved);
    }
    setLS(LS_KEYS.TESTIMONIALS, items);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('testimonials')
          .upsert({
            id: unresolved.id,
            name: unresolved.name,
            role: unresolved.role,
            company: unresolved.company,
            comment: unresolved.comment,
            rating: Number(unresolved.rating),
            avatar: unresolved.avatar
          });
      } catch (e) {
        console.error('Supabase testimonial save exception:', e);
      }
    }
    return true;
  },

  async deleteTestimonial(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('testimonials')
          .delete()
          .eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.error('Supabase testimonial delete exception:', e);
      }
    }
    const items = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []);
    setLS(LS_KEYS.TESTIMONIALS, items.filter(x => x.id !== id));
    return true;
  },

  // --- CONTACT INFO CMS ---
  async getContact(): Promise<ContactCMS> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_cms')
          .select('*')
          .single();
        if (!error && data) return data as ContactCMS;
      } catch (e) {
        console.error('Supabase contact fetch error:', e);
      }
    }
    return getLS<ContactCMS>(LS_KEYS.CONTACT, {
      email: 'alphaeditstudio8@gmail.com',
      phone: '+91 93434 12416',
      address: 'Indore, Madhya Pradesh, India'
    });
  },

  async saveContact(contact: ContactCMS): Promise<boolean> {
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    setLS(LS_KEYS.CONTACT, contact);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('contact_cms')
          .upsert({ id: 'singleton', ...contact });
      } catch (e) {
        console.error('Supabase contact save exception:', e);
      }
    }
    return true;
  },

  // --- SETTINGS CMS ---
  async getSettings(): Promise<SettingsCMS> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('settings_cms')
          .select('*')
          .single();
        if (!error && data) return data as SettingsCMS;
      } catch (e) {
        console.error('Supabase settings fetch error:', e);
      }
    }
    return getLS<SettingsCMS>(LS_KEYS.SETTINGS, {
      websiteName: 'Alpha Edit Studio',
      logoText: 'AES',
      heroTitle: 'PREMIUM POST-PRODUCTION & CREATIVE BRANDING STUDIO',
      heroSubtitle: 'Crafting high-retention cinematic edits, aesthetic brand vectors, and luxury identity systems that capture absolute attention.',
      whatsappNumber: '+91 93434 12416',
      footerText: 'Luxury post-production studio crafting original geometric vector branding structures and cinematic motion assets for global brands and creators.',
      copyrightText: '© 2026 Alpha Edit Studio. All rights reserved.',
      seoTitle: 'Alpha Edit Studio | Premium Post-Production & Branding Agency',
      seoDescription: 'Official portfolio of Alpha Edit Studio. Specializing in luxury graphic design, high-retention video editing, cinematic motion graphics, and brand identity.',
      themeColor: '#f59e0b',
      accentColor: '#eab308'
    });
  },

  async saveSettings(settings: SettingsCMS): Promise<boolean> {
    // 1. Always write to LocalStorage first to guarantee immediate local persistence & UI updates
    setLS(LS_KEYS.SETTINGS, settings);

    // 2. Try to sync to Supabase in the background if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('settings_cms')
          .upsert({ id: 'singleton', ...settings });
      } catch (e) {
        console.error('Supabase settings save exception:', e);
      }
    }
    return true;
  },

  // --- SOCIAL LINKS CMS ---
  async getSocials(): Promise<SocialLinkCMS[]> {
    const DEFAULT_PLATFORMS = [
      { platform: 'YouTube', defaultUrl: 'https://youtube.com/@alphaeditstudio' },
      { platform: 'Instagram', defaultUrl: 'https://instagram.com/alphaeditstudio' },
      { platform: 'LinkedIn', defaultUrl: 'https://linkedin.com/company/alphaeditstudio' },
      { platform: 'Twitter/X', defaultUrl: 'https://twitter.com/alphaeditstudio' },
      { platform: 'Behance', defaultUrl: 'https://behance.net/alphaeditstudio' },
      { platform: 'Dribbble', defaultUrl: '' },
      { platform: 'GitHub', defaultUrl: '' },
      { platform: 'TikTok', defaultUrl: '' },
      { platform: 'WhatsApp', defaultUrl: 'https://wa.me/919343412416' },
      { platform: 'Threads', defaultUrl: '' },
      { platform: 'Pinterest', defaultUrl: '' },
      { platform: 'Facebook', defaultUrl: '' },
      { platform: 'Telegram', defaultUrl: '' },
      { platform: 'Discord', defaultUrl: '' },
      { platform: 'Portfolio Website', defaultUrl: '' },
      { platform: 'Email', defaultUrl: 'alphaeditstudio8@gmail.com' },
      { platform: 'Phone', defaultUrl: '+91 93434 12416' },
      { platform: 'Location', defaultUrl: 'Indore, Madhya Pradesh, India' }
    ];

    let itemsToReturn: SocialLinkCMS[] = [];

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*');
        if (!error && data) {
          itemsToReturn = data as SocialLinkCMS[];
        }
      } catch (e) {
        console.error('Supabase socials fetch exception:', e);
      }
    }

    if (itemsToReturn.length === 0) {
      itemsToReturn = getLS<SocialLinkCMS[]>(LS_KEYS.SOCIALS, []);
    }

    // Merge any missing platforms to support the complete set of platforms
    let changed = false;
    DEFAULT_PLATFORMS.forEach((def) => {
      const exists = itemsToReturn.some(x => x.platform.toLowerCase() === def.platform.toLowerCase());
      if (!exists) {
        itemsToReturn.push({
          id: String(itemsToReturn.length + 1),
          platform: def.platform,
          url: def.defaultUrl
        });
        changed = true;
      }
    });

    if (changed || !localStorage.getItem(LS_KEYS.SOCIALS)) {
      setLS(LS_KEYS.SOCIALS, itemsToReturn);
    }

    return itemsToReturn;
  },

  async saveSocials(socials: SocialLinkCMS[]): Promise<boolean> {
    // 1. Always save to local storage first
    setLS(LS_KEYS.SOCIALS, socials);

    // 2. Synchronize to Supabase if configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const currentIds = socials.map(s => s.id).filter(id => id && !id.startsWith('temp-'));
        if (currentIds.length > 0) {
          await supabase.from('social_links').delete().not('id', 'in', `(${currentIds.join(',')})`);
        } else {
          await supabase.from('social_links').delete().neq('id', '0');
        }

        for (const soc of socials) {
          // If ID is temporary/empty, create a clean numeric or string ID
          const cleanId = !soc.id || soc.id.startsWith('temp-') ? String(Date.now() + Math.floor(Math.random() * 1000)) : soc.id;
          await supabase.from('social_links').upsert({
            id: cleanId,
            platform: soc.platform,
            url: soc.url
          });
        }
      } catch (e) {
        console.error('Supabase socials save exception:', e);
      }
    }
    return true;
  },

  // --- STORAGE MEDIA UPLOAD ---
  async uploadFile(file: File, bucket = 'portfolio-media'): Promise<string> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (!error) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
          return data.publicUrl;
        } else {
          console.error('Supabase storage upload error:', error);
        }
      } catch (e) {
        console.error('Supabase storage upload exception:', e);
      }
    }

    // Local Storage Mock Upload (Saved to IndexedDB to bypass LocalStorage 5MB quota)
    const id = `db-media-${generateUUID()}`;
    await setIndexedDB(id, file);
    return `db-media://${id}`;
  },

  async deleteFile(url: string, bucket = 'resumes'): Promise<boolean> {
    if (!url) return false;
    const unresolvedUrl = unresolveMediaUrl(url);

    if (unresolvedUrl.startsWith('db-media://')) {
      const id = unresolvedUrl.replace('db-media://', '');
      await deleteIndexedDB(id);
      return true;
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const marker = `/public/${bucket}/`;
        const index = unresolvedUrl.indexOf(marker);
        if (index !== -1) {
          const path = unresolvedUrl.substring(index + marker.length);
          const { error } = await supabase.storage.from(bucket).remove([path]);
          if (error) {
            console.error('Supabase storage delete error:', error);
            return false;
          }
          return true;
        }
      } catch (e) {
        console.error('Supabase storage delete exception:', e);
      }
    }
    return false;
  },

  // --- BULK SEED TO SUPABASE UTILITY ---
  async seedSupabase(): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase is not configured yet. Please configure credentials first.' };
    }

    try {
      // 1. Seed About
      const localAbout = getLS<AboutCMS>(LS_KEYS.ABOUT, {} as AboutCMS);
      if (localAbout.name) {
        await supabase.from('about_cms').upsert({ id: 'singleton', ...localAbout });
      }

      // 2. Seed Contact
      const localContact = getLS<ContactCMS>(LS_KEYS.CONTACT, {} as ContactCMS);
      if (localContact.email) {
        await supabase.from('contact_cms').upsert({ id: 'singleton', ...localContact });
      }

      // 3. Seed Portfolio Items
      const localPortfolio = getLS<ExtendedPortfolioItem[]>(LS_KEYS.PORTFOLIO, []);
      for (const item of localPortfolio) {
        await supabase.from('portfolio_items').upsert({
          id: item.id,
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
          description: item.description,
          image: item.image,
          images: item.images || [item.image],
          videoUrl: item.videoUrl || '',
          tags: item.tags || [],
          client: item.client || '',
          year: item.year,
          isFeatured: !!item.isFeatured,
          status: item.status || 'Active',
          price: item.price !== undefined ? Number(item.price) : null,
          discountPrice: item.discountPrice !== undefined ? Number(item.discountPrice) : null,
          isStartingFrom: !!item.isStartingFrom,
          customPricingText: item.customPricingText || '',
          created_at: item.created_at || new Date().toISOString()
        });
      }

      // 4. Seed Services
      const localServices = getLS<Service[]>(LS_KEYS.SERVICES, []);
      for (const s of localServices) {
        await supabase.from('services_cms').upsert({
          id: s.id,
          title: s.title,
          icon: s.icon,
          description: s.description,
          items: s.items
        });
      }

      // 5. Seed Skills
      const localSkills = getLS<Skill[]>(LS_KEYS.SKILLS, []);
      for (const sk of localSkills) {
        await supabase.from('skills_cms').upsert({
          id: sk.name,
          name: sk.name,
          level: sk.level,
          category: sk.category,
          icon: sk.icon
        });
      }

      // 6. Seed Experiences
      const localExps = getLS<Experience[]>(LS_KEYS.EXPERIENCE, []);
      for (const exp of localExps) {
        await supabase.from('experience_timeline').upsert({
          id: exp.id,
          role: exp.role,
          company: exp.company,
          period: exp.period,
          description: exp.description,
          highlights: exp.highlights
        });
      }

      // 7. Seed Testimonials
      const localTests = getLS<Testimonial[]>(LS_KEYS.TESTIMONIALS, []);
      for (const test of localTests) {
        await supabase.from('testimonials').upsert({
          id: test.id,
          name: test.name,
          role: test.role,
          company: test.company,
          comment: test.comment,
          rating: test.rating,
          avatar: test.avatar
        });
      }

      // 8. Seed Social Links
      const localSocials = getLS<SocialLinkCMS[]>(LS_KEYS.SOCIALS, []);
      for (const soc of localSocials) {
        await supabase.from('social_links').upsert({
          id: soc.id,
          platform: soc.platform,
          url: soc.url
        });
      }

      // 9. Seed Settings CMS
      const localSettings = getLS<SettingsCMS>(LS_KEYS.SETTINGS, {} as SettingsCMS);
      if (localSettings && localSettings.websiteName) {
        await supabase.from('settings_cms').upsert({
          id: 'singleton',
          ...localSettings
        });
      }

      return { success: true, message: 'All portfolio data and schemas successfully synchronized to your Supabase project!' };
    } catch (e: any) {
      console.error('Error during Supabase seeding:', e);
      return { success: false, message: `Sync failed: ${e.message || 'Check database permissions or schemas.'}` };
    }
  }
};
