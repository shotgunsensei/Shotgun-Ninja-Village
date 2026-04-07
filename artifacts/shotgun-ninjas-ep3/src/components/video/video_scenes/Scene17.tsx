import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene17() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'inset(0 50% 0 50%)' }}
      animate={{ clipPath: 'inset(0 0% 0 0%)' }}
      exit={{ clipPath: 'inset(0 50% 0 50%)' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-50">
        <img
          src={`${import.meta.env.BASE_URL}images/scene17-module.png`}
          className="w-full h-full object-cover"
          alt="Network waking"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/70 via-transparent to-[#0A0A0F]/70" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-8"
          style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(90deg, #3B82F6, #60A5FA, #F9FAFB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.8, opacity: 0, y: 30 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        >
          THE NETWORK WAS WAKING
        </motion.h2>

        <motion.div className="flex flex-col items-center gap-1">
          {['One forge.', 'One bay.', 'One fragment at a time.'].map((line, i) => (
            <motion.p
              key={i}
              className="text-[1.8vw] text-[#60A5FA]"
              style={{ fontFamily: 'var(--font-body)' }}
              initial={{ opacity: 0, y: 15 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.5, delay: i * 0.25 }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
