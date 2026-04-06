import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 6000)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 1.2 }}
    >
      <AnimatePresence mode="popLayout">
        {phase < 3 && (
          <motion.img 
            key="beacon"
            src={`${import.meta.env.BASE_URL}images/scene5-beacon.png`}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
          />
        )}
        {phase >= 3 && phase < 4 && (
          <motion.img 
            key="path"
            src={`${import.meta.env.BASE_URL}images/scene5-path.png`}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          />
        )}
        {phase >= 4 && (
          <motion.img 
            key="exit"
            src={`${import.meta.env.BASE_URL}images/scene5-exit.png`}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4 }}
          />
        )}
      </AnimatePresence>

      <div className="z-10 w-full px-16 flex flex-col items-center justify-center h-full">
        {/* Phase 1-2 Text */}
        <div className="text-center w-full max-w-4xl absolute top-1/3">
          <motion.h2 
            className="text-[4vw] font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 1 && phase < 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            But one signal survived.
          </motion.h2>
          
          <motion.p 
            className="text-[2.5vw] font-bold text-[#E0F2FE] mt-4 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={phase >= 2 && phase < 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            That means one thing. The Forge still lives.
          </motion.p>
        </div>

        {/* Phase 3 Text */}
        <div className="text-center absolute bottom-1/4">
          <motion.div 
            className="text-[6vw] font-black text-[#3B82F6] bg-black/60 px-8 py-2 rounded-xl backdrop-blur-md uppercase tracking-tighter"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={phase === 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.5 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            SIGNAL FOUND.
          </motion.div>
        </div>

        {/* Phase 4-5 Text */}
        <div className="text-center absolute bottom-16 space-y-4">
          <motion.div 
            className="text-[3vw] font-mono font-bold text-white tracking-[0.2em] bg-red-600/90 px-6 py-2 rounded uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={phase >= 4 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            NEXT: FORGE PROTOCOL
          </motion.div>
          
          <motion.div 
            className="text-[2vw] font-mono text-[#3B82F6] tracking-[0.4em] uppercase font-bold"
            initial={{ opacity: 0 }}
            animate={phase >= 5 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          >
            THE GRID IS WAKING
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
