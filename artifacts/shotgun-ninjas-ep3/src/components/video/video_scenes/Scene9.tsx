import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene9() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 1, ease: 'circOut' }}>

      <div className="absolute inset-0 opacity-30">
        <img
          src={`${import.meta.env.BASE_URL}images/scene9-trajectory.png`}
          className="w-full h-full object-cover"
          alt="Relay core trajectory"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/60" />
      <div className="noise-overlay" />

      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
        <motion.path
          d="M 200 800 Q 600 200, 960 540 Q 1300 900, 1700 300"
          stroke="#3B82F6" strokeWidth="2" fill="none"
          initial={{ pathLength: 0 }}
          animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx="1700" cy="300" r="8" fill="#DC2626"
          initial={{ opacity: 0, scale: 0 }}
          animate={phase >= 2 ? { opacity: 1, scale: [1, 1.5, 1] } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6 }}
        />
      </motion.svg>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-6 text-white"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ y: 40, opacity: 0, rotateX: -30 }}
          animate={phase >= 1 ? { y: 0, opacity: 1, rotateX: 0 } : { y: 40, opacity: 0, rotateX: -30 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          RELAY CORE <span className="text-[#3B82F6]">TRAJECTORY</span>
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#6B7280] max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          "They didn't just hide the truth. They redirected the payload."
        </motion.p>
      </div>
    </motion.div>
  );
}
