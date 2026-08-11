import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Activity, ShieldAlert, Cpu, ArrowRight, Share2, ShoppingBag, Users, Globe } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { UniverseFooter } from "@workspace/sn-ecosystem";
import { ShareButton } from "@/components/shared/ShareButton";

const QUESTIONS: {
  id: number;
  text: string;
  options: {
    text: string;
    score: Partial<Record<"builder" | "protector" | "tracer" | "breaker", number>>;
  }[];
}[] = [
  {
    id: 1,
    text: "When a critical system fails in the field, what is your immediate protocol?",
    options: [
      { text: "Analyze the failure points and map the decay.", score: { builder: 2, tracer: 1 } },
      { text: "Lock down the perimeter. Nothing else gets in.", score: { protector: 2, breaker: 0 } },
      { text: "Exploit the breach before the system recovers.", score: { breaker: 2, tracer: 1 } },
      { text: "Salvage the core components and rebuild instantly.", score: { builder: 2, protector: 1 } },
    ]
  },
  {
    id: 2,
    text: "Select your preferred tactical loadout for a blind drop.",
    options: [
      { text: "High-yield ordnance. Make an impact.", score: { protector: 2, breaker: 1 } },
      { text: "Precision energy blade. Clean cuts.", score: { builder: 1, tracer: 2 } },
      { text: "Stealth lattice and signal jammers.", score: { breaker: 2, tracer: 1 } },
      { text: "A blank slate. Improvise with what's there.", score: { builder: 2, protector: 0 } },
    ]
  },
  {
    id: 3,
    text: "You intercept a heavily corrupted signal packet. Your move?",
    options: [
      { text: "Trace it back to the origin point.", score: { tracer: 3 } },
      { text: "Purge it from the network completely.", score: { protector: 2, builder: 1 } },
      { text: "Reverse-engineer the corruption.", score: { breaker: 2, builder: 1 } },
      { text: "Store it in the archive for later study.", score: { builder: 2, tracer: 1 } },
    ]
  },
  {
    id: 4,
    text: "What is the most valuable currency in the Grid?",
    options: [
      { text: "Raw speed.", score: { tracer: 2, breaker: 1 } },
      { text: "Verified truth.", score: { builder: 2, protector: 1 } },
      { text: "System dominance.", score: { breaker: 3 } },
      { text: "Structural integrity.", score: { protector: 3 } },
    ]
  },
  {
    id: 5,
    text: "How do you respond to counterfeit operators in your sector?",
    options: [
      { text: "Expose their flaws to the network.", score: { tracer: 2, builder: 1 } },
      { text: "Overwhelm them with authentic force.", score: { protector: 2, breaker: 1 } },
      { text: "Hijack their frequency and lock them out.", score: { breaker: 2, tracer: 1 } },
      { text: "Ignore them. Build something better.", score: { builder: 3 } },
    ]
  }
];

const ARCHETYPES = {
  builder: {
    name: "The Forge Ghost",
    icon: Cpu,
    color: "text-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-400/10",
    desc: "You see the grid as raw material. Where others see noise and collapse, you see architecture waiting to be recovered. Your strength is precision, patience, and the ability to rebuild what the static destroyed."
  },
  protector: {
    name: "The Heavy Vanguard",
    icon: Target,
    color: "text-red-500",
    border: "border-red-500",
    bg: "bg-red-500/10",
    desc: "You are the shield wall. You rely on heavy ordnance and structural integrity to hold the line against corruption. When the signal gets chaotic, you are the anchor that keeps the mission from falling apart."
  },
  tracer: {
    name: "The Signal Hunter",
    icon: Activity,
    color: "text-green-400",
    border: "border-green-400",
    bg: "bg-green-400/10",
    desc: "Speed and clarity define you. You move through the noise to find the origin point. You don't waste time on static; you trace the real signal, expose the truth, and cut through the counterfeits with surgical precision."
  },
  breaker: {
    name: "The System Breaker",
    icon: ShieldAlert,
    color: "text-orange-500",
    border: "border-orange-500",
    bg: "bg-orange-500/10",
    desc: "You use the grid's flaws as weapons. You exploit breaches, jam counterfeit signals, and turn the network's corruption against itself. You don't play by the rules of the architecture—you rewrite them."
  }
};

export default function Alignment() {
  usePageMeta({ title: "Operator Alignment", description: "Tactical calibration sequence. Discover your operator archetype." });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ builder: 0, protector: 0, tracer: 0, breaker: 0 });
  const [result, setResult] = useState<keyof typeof ARCHETYPES | null>(null);

  const handleOptionSelect = (optionScores: Partial<Record<string, number>>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, val]) => {
      if (val) {
        newScores[key as keyof typeof scores] += val;
      }
    });
    setScores(newScores);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate result
      const topArchetype = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as keyof typeof ARCHETYPES;
      setResult(topArchetype);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({ builder: 0, protector: 0, tracer: 0, breaker: 0 });
    setResult(null);
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-12 md:py-20 max-w-3xl">
        
        {!result ? (
          <div className="w-full">
            <div className="mb-10 text-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
                  <Activity size={14} className="animate-pulse" /> Calibration Sequence
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-widest mb-2 glitch-text" data-text="OPERATOR ALIGNMENT">
                OPERATOR ALIGNMENT
              </h1>
              <p className="text-muted-foreground font-mono text-sm max-w-lg mx-auto">
                Identify your tactical archetype. Which path through the grid do you take?
              </p>
            </div>

            <div className="mb-6 flex justify-between items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
              <span>Diagnostic {currentStep + 1} // {QUESTIONS.length}</span>
              <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}% Synced</span>
            </div>
            
            <div className="h-1 bg-card border border-border w-full mb-8 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card/50 tactical-border p-6 md:p-8"
              >
                <h2 className="text-2xl md:text-3xl font-display text-white uppercase tracking-widest mb-8 leading-tight">
                  {QUESTIONS[currentStep].text}
                </h2>

                <div className="space-y-3">
                  {QUESTIONS[currentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt.score)}
                      className="w-full text-left p-4 border border-border bg-background hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-6 h-6 border border-muted-foreground/30 flex items-center justify-center font-mono text-[10px] text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors">
                          0{i + 1}
                        </div>
                        <span className="font-mono text-sm text-white/90 group-hover:text-white transition-colors">
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
                Calibration Complete
              </div>
              <h2 className="text-3xl font-display text-muted-foreground uppercase tracking-widest">
                Your Archetype is
              </h2>
            </div>

            <div className={`tactical-border bg-card p-8 md:p-12 text-center mb-8 border-t-4 ${ARCHETYPES[result].border} relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-b ${ARCHETYPES[result].bg} to-transparent opacity-50`} />
              <div className="absolute inset-0 scanlines opacity-20" />
              
              <div className="relative z-10">
                {React.createElement(ARCHETYPES[result].icon, { 
                  size: 64, 
                  className: `mx-auto mb-6 ${ARCHETYPES[result].color} drop-shadow-[0_0_15px_rgba(currentColor,0.5)]`
                })}
                <h1 className={`text-5xl md:text-7xl font-display font-bold uppercase tracking-widest mb-4 ${ARCHETYPES[result].color}`}>
                  {ARCHETYPES[result].name}
                </h1>
                <p className="font-mono text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto mb-8">
                  {ARCHETYPES[result].desc}
                </p>

                <ShareButton 
                  title={`I am ${ARCHETYPES[result].name} in the Shotgun Ninjas universe. What's your alignment?`} 
                  className="mx-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Link href="/community" className="border border-border bg-card/40 p-4 hover:border-secondary hover:bg-card transition-all text-center group">
                <Users size={20} className="mx-auto mb-2 text-secondary group-hover:scale-110 transition-transform" />
                <span className="block font-display text-lg text-white uppercase tracking-widest mb-1">Join The Village</span>
                <span className="block font-mono text-[10px] text-muted-foreground">Find other operators</span>
              </Link>
              <Link href="/merch" className="border border-border bg-card/40 p-4 hover:border-primary hover:bg-card transition-all text-center group">
                <ShoppingBag size={20} className="mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <span className="block font-display text-lg text-white uppercase tracking-widest mb-1">Gear Up</span>
                <span className="block font-mono text-[10px] text-muted-foreground">Get operator apparel</span>
              </Link>
              <a href="https://shotgunninjas.com" target="_blank" rel="noopener noreferrer" className="border border-border bg-card/40 p-4 hover:border-blue-400 hover:bg-card transition-all text-center group">
                <Globe size={20} className="mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="block font-display text-lg text-white uppercase tracking-widest mb-1">Main Hub</span>
                <span className="block font-mono text-[10px] text-muted-foreground">Return to central</span>
              </a>
            </div>

            <div className="text-center">
              <button 
                onClick={resetQuiz}
                className="font-mono text-xs text-muted-foreground hover:text-white underline decoration-muted-foreground/30 hover:decoration-white transition-all"
              >
                Recalibrate (Retake Quiz)
              </button>
            </div>

          </motion.div>
        )}
        
      </div>
      <UniverseFooter LinkComponent={Link} />
    </div>
  );
}
