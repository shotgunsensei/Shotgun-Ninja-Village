import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene8() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.morphExpand}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene8-ui.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.2 }}
      />
      
      {/* Scanning line */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_15px_#60A5FA]"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 border-[2vw] border-blue-900/30 mix-blend-screen pointer-events-none" />

      <motion.h2 
        className="absolute top-[10%] left-[10%] text-[4vw] font-display text-blue-400 uppercase tracking-widest z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        BRANDFORGE OS
      </motion.h2>

    </motion.div>
  );
}
