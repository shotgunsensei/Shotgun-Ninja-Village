import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene2() {
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
      {...sceneTransitions.morphExpand}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene2-wasteland.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.1, x: 20 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-red-900/20 mix-blend-color-burn" />

      <div className="absolute bottom-[15%] left-[10%] z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="border-l-4 border-red-600 pl-6"
        >
          <h2 className="text-[4vw] font-display text-white uppercase leading-none tracking-tight">
            Kage-9
          </h2>
          <p className="text-[1.5vw] font-mono text-red-500 tracking-widest mt-2 uppercase">
            Sector 7 // Wasteland
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
}
