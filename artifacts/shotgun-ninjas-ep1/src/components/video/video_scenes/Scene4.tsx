import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ opacity: 1, clipPath: 'circle(100% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene4-archive.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10 }}
      />

      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene4-fragments.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={phase >= 3 ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 1.1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_100%)] opacity-80" />

      <div className="z-10 grid grid-cols-2 gap-8 w-full max-w-7xl px-12">
        <div className="space-y-8 mt-20">
          <motion.p 
            className="text-[2.2vw] text-white/80 font-bold border-l-4 border-red-600 pl-4 bg-black/30 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            The old network was supposed to be gone. Erased. Stripped down to myth.
          </motion.p>
          
          <motion.p 
            className="text-[2.5vw] text-[#3B82F6] font-bold border-l-4 border-[#3B82F6] pl-4 bg-black/30 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, x: -30 }}
            animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            But broken systems leave patterns. And patterns can be traced.
          </motion.p>
        </div>

        <div className="space-y-8 mt-40">
          <motion.p 
            className="text-[2.2vw] text-white/80 font-bold text-right border-r-4 border-red-600 pr-4 bg-black/30 py-2 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            They did not destroy it. They dismantled it from the inside.
          </motion.p>

          <motion.h3 
            className="text-[3vw] text-white font-black text-right uppercase leading-tight bg-black/50 p-4 backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            Someone wanted the builders blind.
            <br />
            <span className="text-[#B91C1C]">Someone wanted the tools buried.</span>
          </motion.h3>
        </div>
      </div>
      
      {/* Scanning effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#3B82F6]/0 pointer-events-none mix-blend-screen"
        animate={{ y: ['-10vh', '110vh'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
