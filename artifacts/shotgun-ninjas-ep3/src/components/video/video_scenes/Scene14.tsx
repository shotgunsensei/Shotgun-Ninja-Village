import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene14() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      exit={{ clipPath: 'inset(0 0 0 100%)' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>

      <div className="absolute inset-0 opacity-45">
        <img
          src={`${import.meta.env.BASE_URL}images/scene14-blade.png`}
          className="w-full h-full object-cover"
          alt="Energy katana strike"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0F]/80" />
      <div className="noise-overlay" />

      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 1920 1080">
        <motion.line
          x1="200" y1="900" x2="1700" y2="200"
          stroke="#60A5FA" strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.line
          x1="200" y1="900" x2="1700" y2="200"
          stroke="#60A5FA" strokeWidth="20" opacity="0.15"
          initial={{ pathLength: 0 }}
          animate={phase >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.svg>

      <div className="relative z-10 flex flex-col items-start justify-center h-full pl-16">
        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-6 text-[#60A5FA]"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 0 30px rgba(96,165,250,0.5)' }}
          initial={{ x: -50, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 500, damping: 30 }}
        >
          BLADE THROUGH<br/>THE RAIL ARM
        </motion.h2>

        <motion.p
          className="text-[1.8vw] text-[#F9FAFB] max-w-2xl"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
        >
          "Keep the route open. Finish the scan."
        </motion.p>
      </div>
    </motion.div>
  );
}
