import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}>
      
      {/* Background */}
      <div className="absolute inset-0 opacity-60">
        <img 
          src={`${import.meta.env.BASE_URL}images/scene4-shard.png`} 
          className="w-full h-full object-cover"
          alt="Survivor Fragment" 
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
      <div className="noise-overlay" />

      {/* Decorative Shard Shapes */}
      {phase >= 1 && (
        <motion.div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vh] border border-primary/30"
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
          initial={{ rotate: -30, opacity: 0, scale: 2 }}
          animate={{ rotate: 10, opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, type: "spring" }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-end justify-center text-right px-20 w-full mt-40">
        <motion.h2 
          className="text-[6vw] font-display font-bold text-white uppercase tracking-wider leading-none mb-6 drop-shadow-[0_0_15px_rgba(185,28,28,0.8)]"
          initial={{ x: 50, opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          SURVIVOR <br/>
          <span className="text-primary">FRAGMENT</span>
        </motion.h2>

        <motion.div
          className="max-w-3xl bg-black/50 p-6 border-l-4 border-primary"
          initial={{ opacity: 0, x: 20 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[1.8vw] font-body text-text-primary">
            "It wasn't cargo. It was a relay core. Then someone wanted it to disappear."
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
