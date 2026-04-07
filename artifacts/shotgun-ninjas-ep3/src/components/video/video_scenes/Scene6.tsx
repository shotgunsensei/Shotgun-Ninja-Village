import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-50">
        <img
          src={`${import.meta.env.BASE_URL}images/scene6-torqueshed.png`}
          className="w-full h-full object-cover"
          alt="TorqueShed console"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-transparent to-[#0A0A0F]/60" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-[#3B82F6]"
        initial={{ scaleX: 0 }}
        animate={phase >= 1 ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.h2
          className="text-[7vw] font-bold uppercase tracking-[0.2em] leading-none mb-4 text-[#3B82F6]"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 40px rgba(59,130,246,0.5)' }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          TORQUESHED
        </motion.h2>

        <motion.p
          className="text-[2vw] text-[#F9FAFB] max-w-4xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          Built to reconstruct failure.
        </motion.p>

        <motion.p
          className="text-[2vw] text-[#60A5FA] mt-2"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Built to make machines testify.
        </motion.p>
      </div>
    </motion.div>
  );
}
