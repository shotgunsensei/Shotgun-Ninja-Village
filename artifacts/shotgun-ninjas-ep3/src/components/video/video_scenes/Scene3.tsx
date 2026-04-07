import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
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
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%', opacity: 0.5 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      
      {/* Background */}
      <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
        <img 
          src={`${import.meta.env.BASE_URL}images/scene3-yard.png`} 
          className="w-full h-full object-cover"
          alt="Silence in the yard" 
        />
      </div>

      <div className="noise-overlay" />

      {/* Decorative Scanline */}
      <motion.div
        className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ left: ['-10%', '110%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-12">
        <motion.h2 
          className="text-[6vw] font-display font-bold text-white uppercase tracking-wider leading-none mb-6 drop-shadow-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 1, type: "spring" }}
        >
          SILENCE IN THE <span className="text-white/50">YARD</span>
        </motion.h2>

        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[2vw] font-body text-text-primary">
            "When machines die clean, the damage makes sense. This one had been taught to lie."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
