import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene15() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.morphExpand}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene15-lattice.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 2, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 5, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]" />

      <motion.div 
        className="absolute top-[15%] w-full text-center z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
      >
        <p className="text-[2vw] font-mono text-red-500 tracking-[0.5em] uppercase">
          THE WAR IS LARGER
        </p>
      </motion.div>

    </motion.div>
  );
}
