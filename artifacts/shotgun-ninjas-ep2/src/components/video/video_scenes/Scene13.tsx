import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene13() {
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
      {...sceneTransitions.fadeBlur}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene13-machinery.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, filter: 'hue-rotate(-20deg)' }}
        animate={{ scale: 1, filter: 'hue-rotate(0deg)' }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent" />

      <motion.div 
        className="absolute bottom-[20%] w-full text-center z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="text-[2vw] font-mono text-white tracking-[0.3em] uppercase mix-blend-overlay">
          THE SOURCE OF THE COUNTERFEIT
        </p>
      </motion.div>

    </motion.div>
  );
}
