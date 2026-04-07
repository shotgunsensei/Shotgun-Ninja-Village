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
import { Scene17 } from './video_scenes/Scene17';
import { Scene18 } from './video_scenes/Scene18';

const SCENE_DURATIONS = {
  signalTrail: 4500,
  wreck: 4000,
  yard: 4000,
  survivor: 4500,
  bay: 3500,
  torqueshed: 5000,
  autopsy: 4000,
  falseFailure: 3500,
  trajectory: 4000,
  lattice: 4500,
  echo: 3500,
  ambush: 2500,
  quickdraw: 2500,
  blade: 3000,
  trace: 4000,
  realization: 4500,
  module: 4500,
  ending: 5000,
};

const bgColors = [
  '#0A0A0F', '#0A0A0F', '#0A0A0F', '#0A0A0F', '#0A0A0F',
  '#080A12', '#080A14', '#080A16', '#080A18', '#060A1A',
  '#060A1C', '#0A0A0F', '#0A0A0F', '#060A1A', '#060A1C',
  '#060A1A', '#060A1C', '#0A0A0F',
];

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  const emberOpacity = currentScene < 6 ? 0.25 : currentScene < 12 ? 0.1 : 0.05;
  const blueOpacity = currentScene < 6 ? 0.05 : currentScene < 12 ? 0.2 : 0.3;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: bgColors[currentScene] || '#0A0A0F' }}>
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, #B91C1C, transparent)' }}
        animate={{
          x: ['-15vw', '30vw', '10vw', '-5vw', '40vw', '-10vw', '25vw', '0vw', '35vw', '15vw', '-5vw', '50vw', '20vw', '10vw', '-10vw', '30vw', '5vw', '-15vw'][currentScene],
          y: ['10vh', '40vh', '20vh', '60vh', '15vh', '50vh', '30vh', '10vh', '45vh', '25vh', '55vh', '5vh', '35vh', '50vh', '20vh', '40vh', '15vh', '10vh'][currentScene],
          opacity: emberOpacity,
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
        animate={{
          x: ['60vw', '50vw', '70vw', '40vw', '55vw', '45vw', '60vw', '50vw', '65vw', '55vw', '70vw', '35vw', '45vw', '60vw', '50vw', '40vw', '55vw', '60vw'][currentScene],
          y: ['50vh', '20vh', '60vh', '30vh', '45vh', '10vh', '40vh', '55vh', '25vh', '50vh', '15vh', '60vh', '35vh', '20vh', '45vh', '30vh', '50vh', '50vh'][currentScene],
          opacity: blueOpacity,
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)' }}
        animate={{
          left: ['10%', '30%', '50%', '20%', '40%', '15%', '35%', '55%', '25%', '45%', '10%', '60%', '30%', '20%', '50%', '35%', '15%', '10%'][currentScene],
          width: ['40%', '60%', '30%', '50%', '35%', '70%', '45%', '55%', '65%', '40%', '50%', '25%', '60%', '45%', '55%', '50%', '70%', '40%'][currentScene],
          top: ['50%', '20%', '80%', '35%', '65%', '15%', '45%', '75%', '30%', '55%', '85%', '25%', '60%', '40%', '70%', '50%', '20%', '50%'][currentScene],
          opacity: currentScene >= 6 ? 0.6 : 0.2,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute w-16 h-16 border border-white/10 rounded"
        animate={{
          x: ['80vw', '10vw', '70vw', '20vw', '60vw', '15vw', '75vw', '30vw', '65vw', '25vw', '70vw', '5vw', '50vw', '80vw', '35vw', '55vw', '15vw', '80vw'][currentScene],
          y: ['10vh', '70vh', '30vh', '50vh', '20vh', '60vh', '40vh', '15vh', '65vh', '35vh', '55vh', '75vh', '25vh', '45vh', '70vh', '30vh', '60vh', '10vh'][currentScene],
          rotate: [0, 45, 90, 135, 180, 225, 270, 315, 0, 45, 90, 135, 180, 225, 270, 315, 0, 45][currentScene],
          borderColor: currentScene >= 6 ? 'rgba(59,130,246,0.2)' : 'rgba(185,28,28,0.15)',
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="noise-overlay" />

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="signalTrail" />}
        {currentScene === 1 && <Scene2 key="wreck" />}
        {currentScene === 2 && <Scene3 key="yard" />}
        {currentScene === 3 && <Scene4 key="survivor" />}
        {currentScene === 4 && <Scene5 key="bay" />}
        {currentScene === 5 && <Scene6 key="torqueshed" />}
        {currentScene === 6 && <Scene7 key="autopsy" />}
        {currentScene === 7 && <Scene8 key="falseFailure" />}
        {currentScene === 8 && <Scene9 key="trajectory" />}
        {currentScene === 9 && <Scene10 key="lattice" />}
        {currentScene === 10 && <Scene11 key="echo" />}
        {currentScene === 11 && <Scene12 key="ambush" />}
        {currentScene === 12 && <Scene13 key="quickdraw" />}
        {currentScene === 13 && <Scene14 key="blade" />}
        {currentScene === 14 && <Scene15 key="trace" />}
        {currentScene === 15 && <Scene16 key="realization" />}
        {currentScene === 16 && <Scene17 key="module" />}
        {currentScene === 17 && <Scene18 key="ending" />}
      </AnimatePresence>
    </div>
  );
}
