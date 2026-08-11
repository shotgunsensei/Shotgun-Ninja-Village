import React from "react";
import { Link } from "wouter";
import { ChevronRight, Target, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Waypoint {
  href: string;
  title: string;
  desc: string;
  cta?: string;
  isExternal?: boolean;
}

export function NextWaypoint({ waypoints }: { waypoints: Waypoint[] }) {
  return (
    <section className="border-t border-border bg-card/10">
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Target size={20} className="text-primary" />
            <h2 className="text-2xl md:text-3xl font-display text-white uppercase tracking-widest">
              Next Waypoint
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </div>

          <div className={`grid grid-cols-1 ${waypoints.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"} gap-4 max-w-4xl`}>
            {waypoints.map((wp, i) => {
              const content = (
                <>
                  <h3 className="text-xl font-display text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                    {wp.title}
                  </h3>
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-4">
                    {wp.desc}
                  </p>
                  <span className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-4 py-2 font-display text-sm uppercase tracking-widest inline-flex items-center gap-2 group-hover:bg-primary group-hover:text-white transition-all mt-auto self-start">
                    {wp.cta || "Proceed"} {wp.isExternal ? <ArrowUpRight size={16} /> : <ChevronRight size={16} />}
                  </span>
                </>
              );

              return wp.isExternal ? (
                <a
                  key={i}
                  href={wp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tactical-border bg-card p-6 md:p-8 group hover:border-primary transition-all flex flex-col h-full"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={i}
                  href={wp.href}
                  className="tactical-border bg-card p-6 md:p-8 group hover:border-primary transition-all flex flex-col h-full"
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
