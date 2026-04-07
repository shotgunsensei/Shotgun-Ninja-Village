import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene11() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.morphExpand}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene11-wall.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.2, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-red-900/30 mix-blend-color-burn" />

      {/* Noise static */}
      <motion.div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay"
        animate={{ backgroundPosition: ['0px 0px', '10px 10px', '-10px -10px', '20px -20px'] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />

      <motion.div 
        className="absolute bottom-[10%] w-full text-center z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-[5vw] font-display text-red-500 uppercase tracking-tighter leading-none glitch-effect" data-text="THE NOISE WALL">
          THE NOISE WALL
        </h2>
      </motion.div>

    </motion.div>
  );
}
