import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title, url = window.location.href, className = "" }: { title: string; url?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // user cancelled or failed, fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 border border-border bg-card/50 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-white px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all ${className}`}
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
      {copied ? "Copied Signal" : "Share Signal"}
    </button>
  );
}
