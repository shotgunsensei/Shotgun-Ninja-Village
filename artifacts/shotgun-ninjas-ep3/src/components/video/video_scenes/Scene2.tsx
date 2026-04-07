import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
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
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark"
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
      
      {/* Background */}
      <div className="absolute inset-0 opacity-50 mix-blend-luminosity">
        <img 
          src={`${import.meta.env.BASE_URL}images/scene2-wreck.png`} 
          className="w-full h-full object-cover"
          alt="Wrecked Transport Unit" 
        />
      </div>

      <div className="noise-overlay" />

      {/* Decorative */}
      <motion.div
        className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] border border-primary/20 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center text-left px-20 w-full">
        <motion.div
          className="absolute left-10 top-0 bottom-0 w-1 bg-primary/50 origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.h2 
          className="text-[5vw] font-display font-bold text-white uppercase tracking-wider leading-none mb-6 ml-8"
          initial={{ x: -50, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        >
          THE WRECKED <br/>
          <span className="text-primary">TRANSPORT UNIT</span>
        </motion.h2>

        <motion.div
          className="bg-black/60 backdrop-blur-md border border-white/10 p-8 rounded-lg ml-8 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[1.8vw] font-body text-text-secondary">
            "Official reports said failure. The machine said otherwise."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
