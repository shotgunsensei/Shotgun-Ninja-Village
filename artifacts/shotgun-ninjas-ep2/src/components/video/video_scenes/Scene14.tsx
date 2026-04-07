import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene14() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.zoomThrough}
    >
      {/* Red transforming to Blue */}
      <motion.div
        className="absolute inset-0 bg-red-900"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-blue-600 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.4] }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
         {[...Array(20)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-[2px] h-[20vh] bg-blue-400 rounded-full"
             style={{ 
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
             }}
             initial={{ opacity: 0, y: 50, scaleY: 0 }}
             animate={phase >= 1 ? { opacity: [0, 1, 0], y: -100, scaleY: [0, 1, 0] } : { opacity: 0, y: 50, scaleY: 0 }}
             transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
           />
         ))}
      </div>

      <motion.h2 
        className="text-[6vw] font-display text-white uppercase tracking-widest z-10 text-center leading-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1, type: "spring" }}
      >
        SIGNAL<br/>
        <span className="text-blue-300">RECLAIMED</span>
      </motion.h2>

    </motion.div>
  );
}
