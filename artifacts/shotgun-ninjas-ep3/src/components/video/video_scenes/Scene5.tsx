import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
      animate={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-35 mix-blend-luminosity">
        <img
          src={`${import.meta.env.BASE_URL}images/scene5-bay.png`}
          className="w-full h-full object-cover"
          alt="Hidden service bay"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B91C1C] to-transparent"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-[15%] right-[5%] w-[20vw] h-[20vw] rounded-full border border-[#3B82F6]/10"
        animate={{ rotate: [0, 360], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-start justify-end h-full pb-[15vh] px-16">
        <motion.h2
          className="text-[5.5vw] font-bold uppercase tracking-wider leading-none mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 60, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          HIDDEN <span className="text-[#B91C1C]">SERVICE BAY</span>
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#6B7280] max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, x: -30 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6 }}
        >
          "The old network kept more than archives. It kept ways to read what damage tried to hide."
        </motion.p>
      </div>
    </motion.div>
  );
}
