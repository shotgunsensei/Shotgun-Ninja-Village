import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene6() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F]"
      {...sceneTransitions.fadeBlur}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/scene6-forge.png`}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.2, opacity: 0, filter: 'brightness(0)' }}
        animate={{ scale: 1, opacity: 1, filter: 'brightness(1)' }}
        transition={{ duration: 4.5, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />

      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      >
        <h2 className="text-[6vw] font-display text-white uppercase tracking-widest text-center leading-none">
          THE FORGE<br/>
          <span className="text-blue-500">AWAKENS</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}
