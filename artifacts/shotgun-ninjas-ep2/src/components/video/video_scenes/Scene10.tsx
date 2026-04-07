import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene10() {
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
      {...sceneTransitions.clipPolygon}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene10-katana.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, x: -20 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ duration: 3.5, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-l from-blue-900/40 via-transparent to-[#0A0A0F]" />

      <div className="absolute right-[10%] top-[40%] text-right z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-r-4 border-blue-500 pr-6"
        >
          <p className="text-[1.5vw] font-mono text-blue-400 tracking-widest mb-2 uppercase">
            ENERGY OUTPUT: MAXIMUM
          </p>
          <h2 className="text-[4vw] font-display text-white uppercase leading-none tracking-tight">
            KATANA // IGNITED
          </h2>
        </motion.div>
      </div>

    </motion.div>
  );
}
