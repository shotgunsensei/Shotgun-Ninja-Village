import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.zoomThrough}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene4-cell.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.2, filter: 'brightness(0.5)' }}
        animate={{ scale: 1, filter: 'brightness(1)' }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-transparent to-[#0A0A0F] opacity-80" />

      <div className="absolute top-[20%] right-[10%] text-right z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-r-4 border-red-600 pr-6"
        >
          <p className="text-[1.5vw] font-mono text-red-500 tracking-widest mb-2 uppercase">
            ANOMALY DETECTED
          </p>
          <h2 className="text-[4vw] font-display text-white uppercase leading-none tracking-tight">
            CREATOR CELL
          </h2>
        </motion.div>
      </div>

    </motion.div>
  );
}
