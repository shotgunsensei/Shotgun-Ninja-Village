import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene10() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 2400),
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
          src={`${import.meta.env.BASE_URL}images/scene10-lattice.png`}
          className="w-full h-full object-cover"
          alt="Mechanical lattice"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/80 via-transparent to-[#0A0A0F]/80" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.p
          className="text-[1.2vw] text-[#3B82F6] uppercase tracking-[0.4em] mb-6"
          style={{ fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          BRANDFORGE + TORQUESHED SYNC
        </motion.p>

        <motion.h2
          className="text-[6vw] font-bold uppercase tracking-wider leading-none mb-6"
          style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(90deg, #B91C1C, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          THE MECHANICAL LATTICE
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#F9FAFB] max-w-4xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          "Signal was only the first layer. The lattice had learned to move through steel."
        </motion.p>
      </div>
    </motion.div>
  );
}
