import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene16() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 bg-[#0A0A0F]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}>

      <div className="absolute inset-0 opacity-45">
        <img
          src={`${import.meta.env.BASE_URL}images/scene16-realization.png`}
          className="w-full h-full object-cover"
          alt="Survivor realization"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />
      <div className="noise-overlay" />

      <div className="relative z-10 flex flex-col items-start justify-end h-full pb-[15vh] px-16">
        <motion.div
          className="bg-black/70 backdrop-blur-md border border-white/10 p-8 rounded-lg max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-[1.8vw] text-[#F9FAFB] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            "This wasn't an accident. It was <span className="text-[#DC2626]">extraction</span>."
          </motion.p>

          <motion.p
            className="text-[1.8vw] text-[#3B82F6]"
            style={{ fontFamily: 'var(--font-body)' }}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            "Now we know what they're building."
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
