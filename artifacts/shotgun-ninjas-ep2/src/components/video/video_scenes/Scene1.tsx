import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions, elementAnimations } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.clipCircle}
    >
      {/* Glitch lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] bg-red-600/30"
          initial={{ left: '-100%', width: '50%', top: `${Math.random() * 100}%` }}
          animate={{ 
            left: '100%',
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 0.5 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          className="text-red-600 font-mono text-[2vw] tracking-[0.5em] mb-4 uppercase"
        >
          [ SYSTEM.ERR // 0xDEAD ]
        </motion.div>

        <h1 className="text-[8vw] font-display font-bold text-white tracking-tighter leading-none glitch-effect" data-text="SIGNAL DETECTED">
          {'SIGNAL DETECTED'.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 20, rotateX: 90 }}
              animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: 90 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: phase >= 1 ? i * 0.05 : 0 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="h-[2px] w-full bg-red-600 mt-6 origin-left"
        />
      </div>
    </motion.div>
  );
}
