import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene13() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>

      <div className="absolute inset-0 opacity-55">
        <img
          src={`${import.meta.env.BASE_URL}images/scene13-kage-action.png`}
          className="w-full h-full object-cover"
          alt="Quickdraw in the bay"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.15), transparent 70%)' }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.15, repeat: 3, delay: 0.3 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-[12vh] px-12">
        <motion.h2
          className="text-[7vw] font-bold uppercase tracking-wider leading-none mb-4 text-white"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 40px rgba(220,38,38,0.6)' }}
          initial={{ scale: 2, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 2, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 600, damping: 35 }}
        >
          QUICKDRAW
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#DC2626]"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          "Precision still wins at close range."
        </motion.p>
      </div>
    </motion.div>
  );
}
