import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene9() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.zoomThrough}
    >
      {/* Radar rings */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute w-[40vw] h-[40vw] rounded-full border border-blue-500/30"
          initial={{ scale: i * 0.2 }}
          animate={phase >= 1 ? { scale: i * 0.25, opacity: [0.3, 0.8, 0.3] } : { scale: i * 0.2 }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* Target locked */}
      <motion.div
        className="absolute w-[10vw] h-[10vw] border-2 border-red-500 z-10 flex items-center justify-center"
        initial={{ opacity: 0, scale: 2 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1, rotate: [0, 90, 180, 270, 360] } : { opacity: 0, scale: 2 }}
        transition={{ duration: 2, ease: "circOut", rotate: { duration: 4, repeat: Infinity, ease: "linear" } }}
      >
        <div className="w-[1vw] h-[1vw] bg-red-500 rounded-full" />
      </motion.div>

      {/* Data streams */}
      <div className="absolute left-[5%] top-[10%] flex flex-col gap-2 z-20">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`data-${i}`}
            className="h-[2px] bg-blue-400/50"
            initial={{ width: 0 }}
            animate={phase >= 1 ? { width: '15vw' } : { width: 0 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-[10%] w-full text-center z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      >
        <h3 className="text-[3vw] font-mono text-red-500 tracking-widest uppercase">
          COUNTERFEIT HUB // LOCATED
        </h3>
      </motion.div>
    </motion.div>
  );
}
