import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene7() {
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
      initial={{ opacity: 0, rotateY: -90, transformPerspective: 1200 }}
      animate={{ opacity: 1, rotateY: 0, transformPerspective: 1200 }}
      exit={{ opacity: 0, rotateY: 90, transformPerspective: 1200 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-40">
        <img
          src={`${import.meta.env.BASE_URL}images/scene8-autopsy.png`}
          className="w-full h-full object-cover"
          alt="Machine autopsy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/50 to-[#0A0A0F]" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute top-0 left-[50%] w-[1px] h-full bg-[#3B82F6]/30"
        initial={{ scaleY: 0 }}
        animate={phase >= 1 ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1.2 }}
        style={{ transformOrigin: 'top' }}
      />

      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
        <motion.circle
          cx="960" cy="540" r="200"
          stroke="#3B82F6" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={phase >= 1 ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.circle
          cx="960" cy="540" r="300"
          stroke="#3B82F6" strokeWidth="0.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={phase >= 2 ? { pathLength: 1, opacity: 0.2 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </motion.svg>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.p
          className="text-[1.5vw] text-[#3B82F6] uppercase tracking-[0.3em] mb-6"
          style={{ fontFamily: 'var(--font-mono)' }}
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          DIAGNOSTIC ACTIVE
        </motion.p>

        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-6 text-white"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 40, opacity: 0 }}
          animate={phase >= 1 ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          MACHINE <span className="text-[#3B82F6]">AUTOPSY</span>
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#6B7280] max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.8 }}
        >
          "Every failure leaves a chain. Every chain leaves a signature."
        </motion.p>
      </div>
    </motion.div>
  );
}
