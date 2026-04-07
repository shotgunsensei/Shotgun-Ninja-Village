import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene16() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.fadeBlur}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3B82F6_0%,_#0A0A0F_70%)] opacity-20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, letterSpacing: '0px' }}
          animate={{ opacity: 1, scale: 1, letterSpacing: '10px' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-4"
        >
          <h2 className="text-[6vw] font-display font-bold text-white uppercase leading-none tracking-tighter">
            SHOTGUN NINJAS
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="bg-red-600 px-6 py-2"
        >
          <h3 className="text-[2.5vw] font-mono text-white tracking-widest uppercase">
            FORGE PROTOCOL: ACTIVE
          </h3>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="mt-12 text-[1.5vw] font-mono text-blue-400 tracking-[0.5em] uppercase"
        >
          EPISODE_02 // END
        </motion.div>
      </div>

    </motion.div>
  );
}
