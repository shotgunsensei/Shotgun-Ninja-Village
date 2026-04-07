import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene18() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>

      <div className="absolute inset-0 opacity-40">
        <img
          src={`${import.meta.env.BASE_URL}images/scene18-ending.png`}
          className="w-full h-full object-cover"
          alt="Kage-9 exits the bay"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/30 to-transparent" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.h1
          className="text-[8vw] font-bold uppercase tracking-[0.15em] leading-none mb-4"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 60px rgba(59,130,246,0.3)' }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        >
          {'FRACTURE SCAN'.split('').map((char, i) => (
            <motion.span
              key={i}
              style={{ display: 'inline-block', color: char === ' ' ? 'transparent' : undefined }}
              className={char !== ' ' ? 'text-[#3B82F6]' : ''}
              initial={{ opacity: 0, y: 40, rotateX: -45 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -45 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: phase >= 1 ? i * 0.04 : 0 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="text-[2vw] text-[#F9FAFB] uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1 }}
        >
          COMPLETE
        </motion.p>

        <motion.div
          className="mt-8 w-48 h-[2px] bg-[#3B82F6]"
          initial={{ width: 0, opacity: 0 }}
          animate={phase >= 2 ? { width: 192, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}
