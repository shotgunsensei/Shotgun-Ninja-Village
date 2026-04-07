import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';
import { Scene8 } from './video_scenes/Scene8';
import { Scene9 } from './video_scenes/Scene9';
import { Scene10 } from './video_scenes/Scene10';
import { Scene11 } from './video_scenes/Scene11';
import { Scene12 } from './video_scenes/Scene12';
import { Scene13 } from './video_scenes/Scene13';
import { Scene14 } from './video_scenes/Scene14';
import { Scene15 } from './video_scenes/Scene15';
import { Scene16 } from './video_scenes/Scene16';

const SCENE_DURATIONS = {
  scene1: 3000,
  scene2: 4000,
  scene3: 3500,
  scene4: 4000,
  scene5: 3500,
  scene6: 4500,
  scene7: 3500,
  scene8: 4000,
  scene9: 4500,
  scene10: 3500,
  scene11: 4000,
  scene12: 3000,
  scene13: 4000,
  scene14: 4500,
  scene15: 5000,
  scene16: 4000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0A0F] font-body text-white scanlines">
      {/* Persistent Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[120vw] h-[120vh] rounded-full blur-[120px] mix-blend-screen"
          animate={{
            x: currentScene < 8 ? '-10%' : '20%',
            y: currentScene < 8 ? '-10%' : '10%',
            background: currentScene < 6 
              ? 'radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 60%)' 
              : currentScene < 13 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 60%)'
                : 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 60%)',
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="s1" />}
        {currentScene === 1 && <Scene2 key="s2" />}
        {currentScene === 2 && <Scene3 key="s3" />}
        {currentScene === 3 && <Scene4 key="s4" />}
        {currentScene === 4 && <Scene5 key="s5" />}
        {currentScene === 5 && <Scene6 key="s6" />}
        {currentScene === 6 && <Scene7 key="s7" />}
        {currentScene === 7 && <Scene8 key="s8" />}
        {currentScene === 8 && <Scene9 key="s9" />}
        {currentScene === 9 && <Scene10 key="s10" />}
        {currentScene === 10 && <Scene11 key="s11" />}
        {currentScene === 11 && <Scene12 key="s12" />}
        {currentScene === 12 && <Scene13 key="s13" />}
        {currentScene === 13 && <Scene14 key="s14" />}
        {currentScene === 14 && <Scene15 key="s15" />}
        {currentScene === 15 && <Scene16 key="s16" />}
      </AnimatePresence>
    </div>
  );
}
