import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 4000)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      transition={{ duration: 1 }}
    >
      {/* Background Image */}
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene1-bg.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
        initial={{ scale: 1.2, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 10, ease: 'easeOut' }}
      />

      {/* Static / Glitch effect overlay */}
      <motion.div 
        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ repeat: Infinity, duration: 0.5, ease: 'linear' }}
      />

      <div className="z-10 text-center max-w-4xl px-8 flex flex-col items-center justify-center h-full">
        <motion.p 
          className="text-[3vw] font-bold text-white tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          In the end, they did not burn the world.
        </motion.p>
        
        <motion.h1 
          className="text-[6vw] font-black text-[#B91C1C] leading-none glitch-text"
          data-text="They buried the signal."
          initial={{ opacity: 0, scale: 0.8 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        >
          They buried the signal.
        </motion.h1>
      </div>

      {/* Red scanlines moving down */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-red-600/50 shadow-[0_0_10px_red]"
        animate={{ y: ['-10vh', '110vh'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
