import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

interface SectionHeadingProps {
  title: string;
  subtitle: string;
  glitch?: boolean;
  className?: string;
}

export function SectionHeading({ title, subtitle, glitch, className = "" }: SectionHeadingProps) {
  return (
    <motion.div {...fadeUp} className={className}>
      <div className="mb-10">
        <h2
          className={`text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2 ${glitch ? "glitch-text" : ""}`}
          {...(glitch ? { "data-text": title } : {})}
        >
          {title}
        </h2>
        <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
