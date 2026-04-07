import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene12() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
      animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-50">
        <img
          src={`${import.meta.env.BASE_URL}images/scene12-ambush.png`}
          className="w-full h-full object-cover"
          alt="Industrial ambush"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#DC2626]/15 via-transparent to-[#0A0A0F]" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0 bg-[#DC2626]/5"
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.8 }}
      />

      <div className="relative z-10 flex flex-col items-end justify-center h-full pr-16">
        <motion.p
          className="text-[1.2vw] text-[#DC2626] uppercase tracking-[0.4em] mb-4"
          style={{ fontFamily: 'var(--font-mono)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          THREAT DETECTED
        </motion.p>

        <motion.h2
          className="text-[6vw] font-bold uppercase tracking-wider leading-none mb-6 text-white text-right"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ x: 80, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: 80, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 500, damping: 30 }}
        >
          INDUSTRIAL<br/><span className="text-[#DC2626]">AMBUSH</span>
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#F9FAFB] text-right max-w-2xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
        >
          "Someone else had read the trail."
        </motion.p>
      </div>
    </motion.div>
  );
}
