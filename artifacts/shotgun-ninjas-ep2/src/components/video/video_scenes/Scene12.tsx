import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene12() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.wipeLeft}
    >
      <div className="absolute inset-0 bg-red-950" />
      
      {/* Slice effect */}
      {phase >= 1 && (
        <motion.div
          className="absolute inset-0 bg-blue-500 z-10 mix-blend-screen"
          initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      )}

      {phase >= 2 && (
        <motion.div
          className="absolute inset-0 bg-[#0A0A0F] z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
           <motion.div
              className="absolute top-1/2 left-0 w-full h-[10px] bg-blue-400 shadow-[0_0_30px_#60A5FA] -translate-y-1/2"
              initial={{ scaleY: 0, rotate: -15 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.1 }}
           />
           <motion.div
             className="absolute inset-0 bg-blue-500 mix-blend-screen"
             initial={{ opacity: 0.8 }}
             animate={{ opacity: 0 }}
             transition={{ duration: 1 }}
           />
        </motion.div>
      )}

      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-30"
        initial={{ opacity: 0, scale: 1.5 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h2 className="text-[8vw] font-display text-white uppercase tracking-tighter italic">
          BREACH
        </h2>
      </motion.div>

    </motion.div>
  );
}
