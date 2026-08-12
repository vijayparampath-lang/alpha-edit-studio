# Alpha Edit Studio | Premium Post-Production & Branding Agency

A premium, production-ready personal portfolio built with React, Vite, and Tailwind CSS (v4). This portfolio features clean animations, smooth dark/light mode transitions, and a local/cloud CMS dashboard that allows real-time edits to projects, experience cards, skills, testimonials, physical addresses, and active social media profiles.

## ✨ Features

- **🌐 Comprehensive Metadata**: Unique, dynamically injected SEO page titles, meta descriptions, open graph cards, and Twitter tags customized per navigation category.
- **⚡ Performance Optimized**: Preconnected external assets, preloaded core typography elements, and lazy-loaded image/video components to achieve sub-second load times.
- **♿ Fully Accessible (WCAG AA compliant)**: Rigorous heading semantic structures, interactive keyboard target sizing, high color-contrast ratios, and screen-reader ARIA-labels.
- **🎨 Elite Aesthetics**: Smooth, GPU-accelerated motion loops, particle backdrop layers, customizable cursor actions, elegant typography pairings ("Inter" and "JetBrains Mono").
- **💼 Rich Project Showcase**: Complete modal view, inline high-performance video player, responsive multi-image galleries, and interactive zoom views.
- **🛡️ CMS Cockpit**: Fully operational administration center to add, edit, hide, and manage portfolio items, social links, and contact card indices.
- **📄 Interactive Resume Portals**: Built-in PDF reader, interactive online CV viewer, and print-friendly styling layouts.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Storage**: [Supabase](https://supabase.com/) client with automated fallback to `localStorage` for high offline availability.

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## 📐 Vercel & Netlify Deployment

This project is fully configured for hosting on **Vercel** or any standard static platform.

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

*Crafted for production-grade speed, elegance, and maximum search visibility.*
