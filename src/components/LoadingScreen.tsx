import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import finalLogo from '../assets/images/final-logo.jpg';

interface LoadingScreenProps {
  onComplete: () => void;
}

const MESSAGES = [
  'Initializing Creative Studio...',
  'Crafting Original Vectors...',
  'Synchronizing Audio & Motion Cuts...',
  'Polishing High-Contrast Mockups...',
  'Compiling Premium Layouts...',
  'Creative Ready.'
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Increment progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // Give a bit of breathing room before completing
          return 100;
        }
        // Random step increments for more natural feel
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Cycle loading sub-texts as progress increases
    const step = 100 / MESSAGES.length;
    const currentStep = Math.floor(progress / step);
    if (currentStep < MESSAGES.length && currentStep !== msgIndex) {
      setMsgIndex(currentStep);
    }
  }, [progress, msgIndex]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#080808] z-50 flex flex-col justify-center items-center px-4"
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Visual Identity Logo */}
      <div className="relative mb-8">
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={finalLogo}
            alt="Alpha Edit Studio Logo"
            onError={(e) => { (e.target as HTMLImageElement).src = '/final-logo.jpg'; }}
            className="w-20 h-20 object-contain rounded-2xl shadow-2xl shadow-amber-500/20 ring-1 ring-amber-500/30 bg-black/40 p-1"
          />
        </motion.div>
      </div>

      {/* Title */}
      <motion.h1
        className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <span>ALPHA EDIT STUDIO</span>
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
      </motion.h1>

      <motion.p
        className="text-amber-500/80 font-mono text-xs mt-1 uppercase tracking-widest font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.3 }}
      >
        Creative Agency
      </motion.p>

      {/* Progress Counter */}
      <div className="w-full max-w-[280px] mt-10">
        <div className="flex justify-between items-end mb-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              className="text-xs font-sans text-amber-400 font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {MESSAGES[msgIndex] || MESSAGES[MESSAGES.length - 1]}
            </motion.p>
          </AnimatePresence>
          <span className="text-sm font-mono font-semibold text-white">{progress}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-[3px] w-full bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
