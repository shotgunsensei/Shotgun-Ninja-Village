import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}>
      
      {/* Background */}
      <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
        <img 
          src={`${import.meta.env.BASE_URL}images/scene1-industrial.png`} 
          className="w-full h-full object-cover"
          alt="Dead industrial sector" 
        />
      </div>

      <div className="noise-overlay" />

      {/* Grid lines */}
      <motion.div 
        className="absolute inset-0 border-[rgba(59,130,246,0.1)] border-2"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-12">
        <motion.div 
          className="w-32 h-1 bg-primary mb-8"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: phase >= 1 ? 128 : 0, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.h1 
          className="text-[6vw] font-display font-bold text-text-primary uppercase tracking-wider leading-none mb-4"
          initial={{ y: 50, opacity: 0, rotateX: 45 }}
          animate={phase >= 1 ? { y: 0, opacity: 1, rotateX: 0 } : { y: 50, opacity: 0, rotateX: 45 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          SIGNAL TRAIL <span className="text-primary">TO STEEL</span>
        </motion.h1>

        <motion.p 
          className="text-[2vw] font-body text-text-secondary max-w-4xl"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={phase >= 2 ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          "Counterfeit systems never stop at perception. If left alone, they move into infrastructure."
        </motion.p>
      </div>
    </motion.div>
  );
}
