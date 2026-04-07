import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene8() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'inset(50% 0 50% 0)' }}
      animate={{ clipPath: 'inset(0% 0 0% 0)' }}
      exit={{ clipPath: 'inset(50% 0 50% 0)' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-45">
        <img
          src={`${import.meta.env.BASE_URL}images/scene8-autopsy.png`}
          className="w-full h-full object-cover"
          alt="False failure pattern"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-l from-[#B91C1C]/20 via-transparent to-transparent" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0 border-2 border-[#DC2626]/30 m-8"
        animate={{ borderColor: ['rgba(220,38,38,0.3)', 'rgba(220,38,38,0.8)', 'rgba(220,38,38,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.p
        className="absolute top-8 right-12 text-[1.2vw] text-[#DC2626] uppercase tracking-[0.3em]"
        style={{ fontFamily: 'var(--font-mono)' }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        PATTERN ANOMALY DETECTED
      </motion.p>

      <div className="relative z-10 flex flex-col items-start justify-center h-full px-16">
        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-6 text-[#DC2626]"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 30px rgba(220,38,38,0.4)' }}
          initial={{ x: -60, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: -60, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          FALSE FAILURE <br/>EXPOSED
        </motion.h2>

        <motion.div
          className="bg-black/60 backdrop-blur-sm border-l-4 border-[#DC2626] p-6 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[1.8vw] text-[#F9FAFB]" style={{ fontFamily: 'var(--font-body)' }}>
            "It was sabotage? <span className="text-[#DC2626]">Sabotage with rehearsal.</span>"
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
