import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, PlayCircle, UserSquare, Mail, Radio, Globe, ArrowUpRight, Users, ShoppingBag, Database, Code, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { transmissions } from "@/data/transmissions";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  UniverseFooter,
  EcosystemCard,
  recoveredSystems,
  extendedSystems,
  ecosystem,
} from "@workspace/sn-ecosystem";
import {
  queueSignal,
  flushQueuedSignals,
  getQueuedSignals,
  clearQueuedSignals,
  exportQueuedSignalsAsCsv,
} from "@/lib/signalQueue";
import { createSignup, ApiError, useGetSignupsCount } from "@workspace/api-client-react";
import { ShareButton } from "@/components/shared/ShareButton";
import { markWatched, getWatched, getNextUnwatched } from "@/lib/watchProgress";
import { markEnlisted } from "@/lib/operatorRecord";
import { OperatorRecord } from "@/components/shared/OperatorRecord";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

function TypewriterText({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  useEffect(() => {
    if (!visible || count >= text.length) return;
    const t = setTimeout(() => setCount(c => c + 1), 20);
    return () => clearTimeout(t);
  }, [count, text.length, visible]);
  return (
    <span>
      {text.slice(0, count)}
      {count < text.length && <span className="inline-block w-2 h-5 bg-primary animate-pulse ml-0.5 align-middle" aria-hidden="true" />}
    </span>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

function isAdminView() {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("admin") === "1";
  } catch {
    return false;
  }
}

function SignalForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [queuedCount, setQueuedCount] = useState(0);
  const [admin] = useState(isAdminView);

  useEffect(() => {
    let cancelled = false;
    flushQueuedSignals("queue-flush")
      .then(({ remaining }) => {
        if (!cancelled) setQueuedCount(remaining);
      })
      .catch(() => {
        if (!cancelled) setQueuedCount(getQueuedSignals().length);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      setMessage("Signal address invalid. Check format and retry.");
      return;
    }

    setStatus("submitting");
    try {
      const result = await createSignup({ email, source: "village-home" });
      markEnlisted();
      setStatus("ok");
      setMessage(
        result.alreadySubscribed
          ? "Channel already locked. You're on the list."
          : "Channel locked. Mission briefings inbound.",
      );
      form.reset();
      setQueuedCount(getQueuedSignals().length);
    } catch (err) {
      // Distinguish API rejections (4xx) from genuine network/unavailable failures.
      // Only the latter should fall back to the local queue — 4xx means the input
      // was rejected by the server and queueing it would just retry forever.
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        const detail =
          (err.data && typeof err.data === "object" && "message" in err.data
            ? String((err.data as { message?: unknown }).message ?? "")
            : "") || "Signal rejected. Check the address and retry.";
        setStatus("error");
        setMessage(detail);
        return;
      }

      // Network failure, 5xx, or parse error — queue locally so the address isn't lost.
      const queued = queueSignal(email);
      setQueuedCount(getQueuedSignals().length);
      if (queued) {
        setStatus("ok");
        setMessage("Uplink unavailable. Signal queued locally — we'll retry on your next visit.");
        form.reset();
      } else {
        setStatus("error");
        setMessage("Signal failed and could not be queued. Please retry.");
      }
      // eslint-disable-next-line no-console
      console.warn("Signup endpoint failed", err);
    }
  };

  const downloadCsv = () => {
    const csv = exportQueuedSignalsAsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `queued-signals-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto mb-3">
        <input
          type="email"
          name="email"
          required
          aria-label="Email address"
          placeholder="signal@address.com"
          className="flex-1 px-4 py-3 bg-background border border-border text-white font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="clip-diagonal bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-6 py-3 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === "submitting" ? "Locking..." : "Lock In"} <ChevronRight size={18} />
        </button>
      </form>
      {status === "ok" && (
        <p role="status" className="font-mono text-xs text-secondary mb-3">{message}</p>
      )}
      {status === "error" && (
        <p role="alert" className="font-mono text-xs text-primary mb-3">{message}</p>
      )}
      {admin && queuedCount > 0 && (
        <div className="font-mono text-xs text-muted-foreground mb-3 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>{queuedCount} signal{queuedCount === 1 ? "" : "s"} queued locally (uplink failed).</span>
          <button
            type="button"
            onClick={downloadCsv}
            className="underline hover:text-secondary"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              clearQueuedSignals();
              setQueuedCount(0);
            }}
            className="underline hover:text-primary"
          >
            Clear queue
          </button>
        </div>
      )}
    </>
  );
}

import { NextWaypoint } from "@/components/shared/NextWaypoint";

export default function Home() {
  usePageMeta({
    title: "Command Hub",
    description: "Enter the Shotgun Ninjas universe. Watch transmissions, meet Kage-9, and join the village. Three episodes, two recovered systems, one expanding network.",
  });

  const watched = getWatched();
  const nextTx = getNextUnwatched(transmissions.map(t => t.num));
  const continueTx = nextTx ? transmissions.find(t => t.num === nextTx) : null;
  const { data: signups } = useGetSignupsCount();

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 z-0">
          <img src={asset("images/hero.png")} alt="" aria-hidden="true" role="presentation" fetchPriority="high" decoding="async" width="1920" height="1080" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="relative z-10 container px-4 md:px-6 mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
                <Radio size={14} className="animate-pulse" />
                Network Waking
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white uppercase tracking-tighter mb-4 leading-[0.9] glitch-text" data-text="THE NETWORK IS WAKING">
                THE NETWORK IS WAKING
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground font-mono max-w-xl mb-8 border-l-2 border-primary pl-4 text-left">
                <TypewriterText text="Kage-9 moves through a signal war no one else can see. Three transmissions recovered. Two systems online. The network remembers." />
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <a
                  href={continueTx ? continueTx.href : transmissions[0].href}
                  onClick={() => continueTx && markWatched(continueTx.num)}
                  className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2"
                >
                  <PlayCircle size={20} /> {continueTx ? `Continue: Transmission ${continueTx.num}` : "Watch Transmission 01"}
                </a>
                <a
                  href="#join-archive"
                  className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-8 py-3 font-display text-xl uppercase tracking-widest transition-all inline-flex items-center gap-2 bg-background/50 backdrop-blur"
                >
                  Join the Archive <ChevronRight size={20} />
                </a>
              </div>
              
              <ShareButton title="The Network is Waking — Enter the Shotgun Ninjas Command Hub." />
            </div>

            <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 via-transparent to-secondary/20 blur-2xl" />
                <img
                  src={asset("images/kage-9-operator.png")}
                  alt="Kage-9"
                  width="288"
                  height="384"
                  decoding="async"
                  className="relative w-full aspect-[3/4] object-cover object-top drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRILOGY: RECOVERED TRANSMISSIONS ── */}
      <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <motion.div {...fadeUp}>
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2 glitch-text" data-text="RECOVERED TRANSMISSIONS">
              RECOVERED TRANSMISSIONS
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              Three operations. Three recovered signals. Watch in sequence.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {transmissions.map((tx, i) => {
            const isWatched = watched.includes(tx.num);
            return (
            <motion.a
              key={tx.num}
              href={tx.href}
              onClick={() => markWatched(tx.num)}
              className={`group tactical-border bg-card overflow-hidden flex flex-col md:flex-row transition-all hover:border-primary block ${isWatched ? 'border-primary/30' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-full md:w-2/5 aspect-video relative overflow-hidden">
                <img
                  src={asset(tx.img)}
                  alt={tx.title}
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="360"
                  className={`w-full h-full object-cover filter brightness-75 contrast-125 group-hover:scale-105 transition-transform duration-700 ${isWatched ? 'grayscale opacity-80' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/60" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-background/80 backdrop-blur border border-primary/40 font-mono text-[10px] text-primary uppercase tracking-widest">
                  Transmission {tx.num}
                </div>
                {isWatched && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-primary/20 backdrop-blur border border-primary/40 font-mono text-[10px] text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Radio size={10} /> Signal Received / Watched
                  </div>
                )}
              </div>

              <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-display text-white uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">
                  {tx.title}
                </h3>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-3 max-w-xl">
                  {tx.brief}
                </p>
                <div className="border-l-2 border-border pl-3 mb-4">
                  <p className="font-mono text-sm italic text-white/70">"{tx.quote}"</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 border border-secondary/20">
                    {tx.system}
                  </span>
                  {tx.next && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {tx.next}
                    </span>
                  )}
                </div>
                <div className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-4 py-2 font-display text-sm uppercase tracking-widest inline-flex items-center gap-2 self-start group-hover:bg-primary group-hover:text-white transition-all">
                  <PlayCircle size={16} /> {isWatched ? "Rewatch Transmission" : "Watch Transmission"}
                </div>
              </div>
            </motion.a>
          )})}
        </div>

        <OperatorRecord className="mt-8" />
      </section>

      {/* ── KAGE-9 SPOTLIGHT ── */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
          <motion.div {...fadeUp}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-48 md:w-56 flex-shrink-0">
                <div className="tactical-border bg-card p-1 relative overflow-hidden">
                  <img
                    src={asset("images/kage-9-operator.png")}
                    alt="Kage-9"
                    loading="lazy"
                    decoding="async"
                    width="224"
                    height="299"
                    className="w-full aspect-[3/4] object-cover object-top drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  />
                  <div className="absolute inset-0 scanlines opacity-30" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Operator Dossier</div>
                <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-1">
                  Kage-9
                </h2>
                <p className="text-lg font-display text-muted-foreground uppercase tracking-wider mb-4">
                  Hayaku Kageru
                </p>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-6 max-w-2xl">
                  Systems warrior. Precision builder. Covert guardian. He emerged from the collapse of a network that protected creative and technical knowledge. Survived because he learned how systems fail. Now recovers and reforges them — one mission at a time.
                </p>
                <div className="bg-muted/50 border-l-2 border-secondary p-4 font-mono text-sm italic text-white/80 mb-6 max-w-lg">
                  "Noise spreads fastest where no one checks the signal."
                </div>
                <Link
                  href="/operators"
                  className="clip-diagonal border border-primary/50 hover:bg-primary/10 text-primary px-6 py-2 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
                >
                  <UserSquare size={18} /> View Operator Dossier <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── RECOVERED SYSTEMS ── */}
      <section className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <motion.div {...fadeUp}>
          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
              RECOVERED SYSTEMS
            </h2>
            <p className="text-muted-foreground font-mono text-sm border-l-2 border-primary pl-4 max-w-lg">
              Command platforms pulled from the field. Each one recovered during a mission. Each one operational.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {recoveredSystems.map((sys, i) => (
            <motion.div
              key={sys.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <EcosystemCard product={sys} variant="compact" />
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp}>
          <div className="mb-6">
            <h3 className="text-2xl font-display text-muted-foreground uppercase tracking-widest">
              Extended Network
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extendedSystems.map((sys) => (
              <EcosystemCard key={sys.id} product={sys} variant="compact" />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── ECOSYSTEM TRIAD ── */}
      <section className="border-t border-border">
        <div className="container mx-auto px-4 py-14 md:py-18 max-w-6xl">
          <motion.div {...fadeUp}>
            <div className="mb-8 text-center">
              <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-2">
                ENTER THE VILLAGE
              </h2>
              <p className="text-muted-foreground font-mono text-sm max-w-md mx-auto mb-4">
                Watch. Connect. Support. Three paths into the network.
              </p>
              <Link
                href="/alignment"
                className="inline-flex items-center gap-2 border border-blue-400/30 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-white px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-all"
              >
                <Activity size={14} className="animate-pulse" /> Take the Operator Alignment Quiz
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div {...fadeUp}>
              <Link href="/archive" className="tactical-border bg-card p-5 group hover:border-primary transition-all block h-full">
                <div className="p-2.5 border border-primary/30 bg-background inline-block mb-3">
                  <Database size={20} className="text-primary" />
                </div>
                <h3 className="text-xl font-display text-white uppercase tracking-widest mb-1.5 group-hover:text-primary transition-colors">
                  Mission Archive
                </h3>
                <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-3">
                  Three recovered transmissions. The full trilogy — from signal breach to system recovery.
                </p>
                <span className="clip-diagonal bg-primary/20 border border-primary/40 text-primary px-3 py-1 font-display text-sm uppercase tracking-widest inline-flex items-center gap-1.5 group-hover:bg-primary group-hover:text-white transition-all">
                  Watch Now <ChevronRight size={12} />
                </span>
              </Link>
            </motion.div>

            <motion.div {...fadeUp}>
              <Link href="/community" className="tactical-border bg-card p-5 group hover:border-secondary transition-all block h-full">
                <div className="p-2.5 border border-secondary/30 bg-background inline-block mb-3">
                  <Users size={20} className="text-secondary" />
                </div>
                <h3 className="text-xl font-display text-white uppercase tracking-widest mb-1.5 group-hover:text-secondary transition-colors">
                  The Village
                </h3>
                <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-3">
                  Discuss lore, share builds, and shape the future of the Shotgun Ninjas network.
                </p>
                <span className="clip-diagonal bg-secondary/20 border border-secondary/40 text-secondary px-3 py-1 font-display text-sm uppercase tracking-widest inline-flex items-center gap-1.5 group-hover:bg-secondary group-hover:text-white transition-all">
                  Enter Community <ChevronRight size={12} />
                </span>
              </Link>
            </motion.div>

            <motion.div {...fadeUp}>
              <Link href="/merch" className="tactical-border bg-card p-5 group hover:border-orange-500 transition-all block h-full">
                <div className="p-2.5 border border-orange-500/30 bg-background inline-block mb-3">
                  <ShoppingBag size={20} className="text-orange-500" />
                </div>
                <h3 className="text-xl font-display text-white uppercase tracking-widest mb-1.5 group-hover:text-orange-500 transition-colors">
                  Merch
                </h3>
                <p className="text-muted-foreground font-mono text-xs leading-relaxed mb-3">
                  Operator-grade gear. The Ronin Supply line. Every purchase directly funds the next transmission.
                </p>
                <span className="clip-diagonal bg-orange-500/20 border border-orange-500/40 text-orange-500 px-3 py-1 font-display text-sm uppercase tracking-widest inline-flex items-center gap-1.5 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  Browse Merch <ChevronRight size={12} />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── JOIN THE ARCHIVE ── */}
      <section id="join-archive" className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
              <Mail size={14} /> Classified Channel
            </div>

            <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-4 glitch-text" data-text="JOIN THE ARCHIVE">
              JOIN THE ARCHIVE
            </h2>

            <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-xl mx-auto mb-8">
              New transmissions incoming. Recovered systems deploying. Enter your signal address for mission briefings, early access, and classified drops before they reach the public feed.
            </p>

            <SignalForm />

            <div className="flex flex-col items-center gap-2 mt-4 mb-2">
              <p className="font-mono text-xs text-muted-foreground">
                No spam. No noise. Only signal.
              </p>
              {signups && (
                <div className="font-mono text-[10px] text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 border border-primary/20">
                  <Activity size={10} className="inline mr-1 animate-pulse" /> {signups.count.toLocaleString()} Operators Enlisted
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SHOTGUN NINJAS UNIVERSE ── */}
      <section className="border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl relative z-10">
          <motion.div {...fadeUp}>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-widest">
                <Globe size={14} /> Network Hub
              </div>

              <h2 className="text-4xl md:text-5xl font-display text-white uppercase tracking-widest mb-4 glitch-text" data-text="THE SHOTGUN NINJAS UNIVERSE">
                THE SHOTGUN NINJAS UNIVERSE
              </h2>

              <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-2xl mx-auto mb-8">
                This command hub is one node in a larger network. The full Shotgun Ninjas universe — expanded lore, future transmissions, operator briefings, and platform access — lives at the main site. Everything connects back to one signal.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a
                  href="https://shotgunninjas.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clip-diagonal bg-primary hover:bg-primary/90 text-white px-8 py-3 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
                >
                  <Globe size={20} /> Enter ShotgunNinjas.com <ArrowUpRight size={18} />
                </a>
                <a
                  href="https://www.operatoros.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clip-diagonal bg-secondary hover:bg-secondary/90 text-white px-8 py-3 font-display text-lg uppercase tracking-widest transition-all inline-flex items-center gap-2"
                >
                  <Code size={20} /> Access OperatorOS <ArrowUpRight size={18} />
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {ecosystem.map((p) => (
                  <a
                    key={p.id}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-border bg-card/50 p-3 text-center hover:border-primary/50 transition-all"
                  >
                    <span className="block font-display text-sm text-white uppercase tracking-widest transition-colors group-hover:text-primary">
                      {p.name}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground mt-1">{p.urlLabel}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NextWaypoint waypoints={[{ href: "/shotgun-ninjas-ep1/", title: "Transmission 01", desc: "Watch the first episode now.", cta: "Watch", isExternal: true }]} />
      <UniverseFooter LinkComponent={Link} />
    </div>
  );
}
