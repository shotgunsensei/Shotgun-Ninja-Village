import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 4500)
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-end pr-[10vw] overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1 }}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene3-kage.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.1, objectPosition: 'center 60%' }}
        animate={{ scale: 1.05, objectPosition: 'center 40%' }}
        transition={{ duration: 10, ease: 'easeOut' }}
      />

      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene3-face.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-lighten"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={phase >= 3 ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 1.1 }}
        transition={{ duration: 2 }}
      />
      
      <motion.div 
        className="absolute w-[20vw] h-[20vw] rounded-full bg-[#3B82F6] mix-blend-screen opacity-20 blur-[100px]"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ top: '30%', right: '40%' }}
      />

      <div className="z-10 max-w-2xl text-right bg-black/40 p-8 backdrop-blur-sm border-r-4 border-[#3B82F6]">
        <motion.p 
          className="text-[2.2vw] font-bold text-white mb-6"
          initial={{ opacity: 0, x: 20 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.8 }}
        >
          Most people forgot what a real signal looked like.
          <br/><span className="text-[#3B82F6]">He didn't.</span>
        </motion.p>

        <motion.h1 
          className="text-[5vw] font-black text-white leading-none tracking-tight uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Hayaku Kageru
        </motion.h1>
        
        <motion.h2
          className="text-[4vw] font-bold text-[#B91C1C] mb-4"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          KAGE-9
        </motion.h2>

        <motion.div 
          className="flex flex-col items-end text-[#9CA3AF] font-mono text-[1.5vw] space-y-1"
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span>&gt; SIGNAL HUNTER</span>
          <span>&gt; ARCHIVE GHOST</span>
          <span className="text-white">&gt; LAST BLADE OF A BROKEN NETWORK</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
