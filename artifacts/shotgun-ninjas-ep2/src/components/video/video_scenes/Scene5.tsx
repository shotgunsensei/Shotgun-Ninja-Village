import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene5() {
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
      {...sceneTransitions.clipPolygon}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene5-corridor.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1, z: 0 }}
        animate={{ scale: 1.1, z: 100 }}
        transition={{ duration: 3.5, ease: "linear" }}
      />
      
      <div className="absolute inset-0 bg-black/60" />

      {/* Flickering lights effect */}
      <motion.div 
        className="absolute inset-0 bg-red-600 mix-blend-overlay"
        animate={{ opacity: [0, 0.4, 0, 0.8, 0, 0.2] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div 
        className="absolute bottom-[10%] w-full text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <p className="text-[2vw] font-mono text-red-500 tracking-[0.5em] uppercase">
          ENTERING SAFEHOUSE
        </p>
      </motion.div>

    </motion.div>
  );
}
