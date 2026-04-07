import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene15() {
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
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-40">
        <img
          src={`${import.meta.env.BASE_URL}images/scene15-trace.png`}
          className="w-full h-full object-cover"
          alt="Trace complete"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/50" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '25px 25px' }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.p
          className="text-[1.5vw] text-[#3B82F6] uppercase tracking-[0.3em] mb-8"
          style={{ fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          TORQUESHED // TRACE LOCKED
        </motion.p>

        <motion.h2
          className="text-[6vw] font-bold uppercase tracking-wider leading-none mb-6 text-[#3B82F6]"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 40px rgba(59,130,246,0.4)' }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          TRACE COMPLETE
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#6B7280] max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          "Another module. Another fracture in the network."
        </motion.p>
      </div>
    </motion.div>
  );
}
