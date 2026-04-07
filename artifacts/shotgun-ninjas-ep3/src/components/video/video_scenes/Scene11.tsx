import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene11() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ opacity: 0, scale: 0.3, borderRadius: '50%' }}
      animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
      exit={{ opacity: 0, scale: 2.5, filter: 'blur(30px)' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>

      <div className="absolute inset-0 opacity-35">
        <img
          src={`${import.meta.env.BASE_URL}images/scene11-echo.png`}
          className="w-full h-full object-cover"
          alt="Saboteur echo"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0F]/80" />
      <div className="noise-overlay" />

      <motion.div
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vh] border border-[#DC2626]/20 rounded-full"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12">
        <motion.h2
          className="text-[5vw] font-bold uppercase tracking-wider leading-none mb-6 text-white"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, rotateX: -45 }}
          animate={phase >= 1 ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -45 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          SABOTEUR <span className="text-[#DC2626]">ECHO</span>
        </motion.h2>

        <motion.div className="flex flex-col items-center gap-2">
          {['Not chaos.', 'Not coincidence.', 'Craft.'].map((line, i) => (
            <motion.p
              key={i}
              className={`text-[2vw] ${i === 2 ? 'text-[#DC2626] font-bold text-[3vw]' : 'text-[#6B7280]'}`}
              style={{ fontFamily: i === 2 ? 'var(--font-display)' : 'var(--font-body)' }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
