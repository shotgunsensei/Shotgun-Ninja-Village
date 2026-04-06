import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 4500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col justify-center pl-[10vw] overflow-hidden"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.8 }}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene2-builder.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-50 sepia-[0.3] saturate-[0.8]"
        initial={{ scale: 1.1, x: -50 }}
        animate={{ scale: 1.15, x: 0 }}
        transition={{ duration: 8, ease: 'linear' }}
      />

      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene2-screens.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={phase >= 2 ? { opacity: 0.4, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.5 }}
      />

      <div className="z-10 max-w-3xl space-y-6">
        <motion.p 
          className="text-[2.5vw] font-bold text-white/90 leading-tight uppercase"
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={phase >= 1 ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : { opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          transition={{ duration: 0.8 }}
        >
          Messages were hijacked. Tools were replaced.
        </motion.p>

        <motion.h2 
          className="text-[4vw] font-black text-white leading-none tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Truth was drowned in <span className="text-[#B91C1C] glitch-text" data-text="noise">noise</span>.
        </motion.h2>

        <div className="pt-8">
          <motion.p 
            className="text-[2.2vw] text-gray-300 font-mono"
            initial={{ opacity: 0 }}
            animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            The builders felt it first. Not as an explosion.
          </motion.p>
          <motion.p 
            className="text-[3vw] font-bold text-gray-500 tracking-widest mt-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={phase >= 4 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
          >
            AS SILENCE.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
