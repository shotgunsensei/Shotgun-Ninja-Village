import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene7() {
  const [lines, setLines] = useState<string[]>([]);
  const maxLines = 15;

  useEffect(() => {
    const sequence = [
      "> BRANDFORGE OS BOOT SEQ INIT...",
      "> KERNEL v9.0.4 [OK]",
      "> MEMORY CHECK [OK]",
      "> CONNECTING TO LATTICE...",
      "> WARNING: COUNTERFEIT SIGNAL INTERFERENCE DETECTED",
      "> BYPASSING NOISE WALL...",
      "> TACTICAL UI MODULE: ONLINE",
      "> WEAPON SYNC: ENERGY KATANA [CONNECTED]",
      "> REROUTING...",
      "> READY."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < sequence.length) {
        setLines(prev => [...prev, sequence[current]]);
        current++;
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#0A0A0F] flex flex-col justify-end p-[5vw]"
      {...sceneTransitions.slideUp}
    >
      <div className="w-full max-w-[60vw] text-blue-400 font-mono text-[1.5vw] leading-relaxed">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
          >
            {line}
          </motion.div>
        ))}
        {lines.length < 10 && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-3 h-[1.2em] bg-blue-400 align-middle ml-2"
          />
        )}
      </div>
    </motion.div>
  );
}
