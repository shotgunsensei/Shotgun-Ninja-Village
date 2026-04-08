import { Link } from "wouter";
import { UniverseFooter } from "@/components/shared/UniverseFooter";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex-1 w-full flex items-center justify-center">
        <div className="tactical-border bg-card p-8 max-w-md mx-4 text-center">
          <div className="font-display text-6xl text-primary mb-4">404</div>
          <h1 className="text-2xl font-display text-white uppercase tracking-widest mb-4">
            Signal Lost
          </h1>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            The requested node could not be located in the current grid sector.
          </p>
          <Link
            href="/"
            className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-6 py-2 font-display text-lg uppercase tracking-widest transition-all inline-block"
          >
            Return to Signal Feed
          </Link>
        </div>
      </div>
      <UniverseFooter />
    </div>
  );
}
