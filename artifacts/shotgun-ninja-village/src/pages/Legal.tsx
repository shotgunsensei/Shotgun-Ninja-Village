import React from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { Scale, Shield, RefreshCw, Mail, FileText, ExternalLink } from "lucide-react";
import { UniverseFooter } from "@/components/shared/UniverseFooter";
import { usePageMeta } from "@/hooks/usePageMeta";

type SectionKey = "terms" | "privacy" | "refunds" | "contact";

const sections: Record<SectionKey, { label: string; icon: React.ElementType; title: string; desc: string }> = {
  terms: {
    label: "Terms of Service",
    icon: Scale,
    title: "Terms of Service",
    desc: "The rules of engagement for using Shotgun Ninja Village.",
  },
  privacy: {
    label: "Privacy Policy",
    icon: Shield,
    title: "Privacy Policy",
    desc: "What we collect, what we don't, and how your data is handled.",
  },
  refunds: {
    label: "Refunds & Shipping",
    icon: RefreshCw,
    title: "Refunds, Returns & Shipping",
    desc: "Policies for Ronin Supply merchandise and digital goods.",
  },
  contact: {
    label: "Contact",
    icon: Mail,
    title: "Contact",
    desc: "How to reach Shotgun Ninjas Productions.",
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

const EFFECTIVE_DATE = "May 1, 2026";
const SUPPORT_EMAIL = "support@shotgunninjas.com";
const LEGAL_EMAIL = "legal@shotgunninjas.com";

export default function Legal() {
  const [, params] = useRoute<{ section?: string }>("/legal/:section");
  const sectionKey: SectionKey = (params?.section as SectionKey) in sections
    ? (params!.section as SectionKey)
    : "terms";
  const meta = sections[sectionKey];
  usePageMeta({ title: meta.title, description: meta.desc });

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col">
      <section className="relative w-full py-12 md:py-16 border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest">
              <FileText size={12} /> Legal Suite
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tighter mb-3">
              {meta.title}
            </h1>
            <p className="font-mono text-sm text-muted-foreground">{meta.desc}</p>
            <p className="font-mono text-[11px] text-muted-foreground/70 mt-2 uppercase tracking-widest">
              Effective: {EFFECTIVE_DATE}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav className="flex flex-wrap gap-2 py-4" aria-label="Legal sections">
            {(Object.keys(sections) as SectionKey[]).map((key) => {
              const s = sections[key];
              const Icon = s.icon;
              const active = key === sectionKey;
              return (
                <Link
                  key={key}
                  href={`/legal/${key}`}
                  className={`inline-flex items-center gap-2 px-3 py-2 border font-mono text-[11px] uppercase tracking-widest transition-all ${
                    active
                      ? "bg-primary/15 border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-white hover:border-primary/40"
                  }`}
                >
                  <Icon size={12} /> {s.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div {...fadeUp} className="prose-legal space-y-6 font-mono text-sm text-muted-foreground leading-relaxed">
            {sectionKey === "terms" && <TermsBody />}
            {sectionKey === "privacy" && <PrivacyBody />}
            {sectionKey === "refunds" && <RefundsBody />}
            {sectionKey === "contact" && <ContactBody />}
          </motion.div>
        </div>
      </section>

      <div className="mt-auto">
        <UniverseFooter />
      </div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl text-white uppercase tracking-widest pt-2 pb-1 border-b border-border">
      {children}
    </h2>
  );
}

function TermsBody() {
  return (
    <>
      <p>
        Welcome to Shotgun Ninja Village ("the Site"), operated by Shotgun Ninjas Productions ("we", "us"). By accessing
        or using the Site you agree to these Terms of Service. If you do not agree, please do not use the Site.
      </p>
      <H>1. Use of the Site</H>
      <p>
        The Site provides access to entertainment content, community discussion, recovered creative systems, and the
        Ronin Supply merchandise catalog. You agree to use the Site lawfully and to respect other community members.
      </p>
      <H>2. Accounts & Community</H>
      <p>
        Some features (community channels, supporter tiers) require an account. You are responsible for activity on your
        account. We may suspend access for harassment, spam, or violations of community guidelines.
      </p>
      <H>3. Purchases</H>
      <p>
        Merchandise is fulfilled through our partner storefront. Pricing, availability, and shipping are governed by
        that provider and our Refunds policy. Limited drops are made-to-order and may be non-refundable once production
        begins.
      </p>
      <H>4. Intellectual Property</H>
      <p>
        All characters, transmissions, artwork, music, and brand assets associated with Shotgun Ninjas, Kage-9, and
        related properties are © Shotgun Ninjas Productions. Personal, non-commercial sharing of public episodes is
        permitted with attribution. Commercial reuse requires written permission.
      </p>
      <H>5. User Content</H>
      <p>
        Content you post in community spaces remains yours. You grant us a non-exclusive license to display, distribute,
        and moderate that content within the Site and its public archives.
      </p>
      <H>6. Disclaimers</H>
      <p>
        The Site is provided "as is" without warranties. The Shotgun Ninjas universe is a work of fiction; any in-world
        references to organizations, technologies, or events are not real.
      </p>
      <H>7. Changes</H>
      <p>
        We may update these terms. Material changes will be announced on the Site. Continued use after changes
        constitutes acceptance.
      </p>
      <H>8. Contact</H>
      <p>
        Questions about these terms: <a href={`mailto:${LEGAL_EMAIL}`} className="text-secondary hover:text-white">{LEGAL_EMAIL}</a>
      </p>
    </>
  );
}

function PrivacyBody() {
  return (
    <>
      <p>
        This Privacy Policy explains what information Shotgun Ninja Village collects and how we use it.
      </p>
      <H>What We Collect</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>Email address — only when you opt in to transmissions or create a community account.</li>
        <li>Community profile data — username, avatar, posts (managed by our community provider).</li>
        <li>Order data — name, shipping address, items purchased (handled by our merchandise provider).</li>
        <li>Basic technical data — browser, device, and pages visited (for performance and abuse prevention).</li>
      </ul>
      <H>What We Don't Do</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>We do not sell your personal information.</li>
        <li>We do not run third-party advertising trackers on this site.</li>
        <li>We do not store payment card numbers — checkout is handled by our payment processor.</li>
      </ul>
      <H>Cookies</H>
      <p>
        We use a minimal set of cookies for session management and preference storage. Third-party services (community,
        merchandise) may set their own cookies under their respective policies.
      </p>
      <H>Data Retention</H>
      <p>
        Account data is retained while your account is active. You may request deletion at any time via the contact
        email below. Order records may be retained for tax and dispute purposes.
      </p>
      <H>Your Rights</H>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct, export, or delete your data. Email{" "}
        <a href={`mailto:${LEGAL_EMAIL}`} className="text-secondary hover:text-white">{LEGAL_EMAIL}</a> to make a request.
      </p>
      <H>Children</H>
      <p>The Site is not directed at children under 13 and we do not knowingly collect data from them.</p>
    </>
  );
}

function RefundsBody() {
  return (
    <>
      <H>Made-to-Order Items</H>
      <p>
        Most Ronin Supply apparel is produced on-demand. Orders enter production within 24–48 hours of placement.
        Cancellations are honored if production has not yet begun.
      </p>
      <H>Returns</H>
      <p>
        Defective, damaged, or incorrect items may be returned within 30 days of delivery for a full replacement or
        refund. Sizing exchanges on made-to-order items are evaluated case-by-case.
      </p>
      <H>Limited Drops</H>
      <p>
        Numbered runs and "Founders" tier items are final sale once production begins, except in the case of defects.
      </p>
      <H>Shipping</H>
      <p>
        Standard production time is 5–10 business days plus carrier transit. International shipping is available;
        duties and import taxes are the responsibility of the recipient.
      </p>
      <H>How to Start a Return</H>
      <p>
        Email <a href={`mailto:${SUPPORT_EMAIL}`} className="text-secondary hover:text-white">{SUPPORT_EMAIL}</a> with
        your order number and a description (and photo, if applicable). We respond within 2 business days.
      </p>
    </>
  );
}

function ContactBody() {
  return (
    <>
      <H>General Support</H>
      <p>
        For order help, technical issues, or general questions:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-secondary hover:text-white">{SUPPORT_EMAIL}</a>
      </p>
      <H>Legal & Privacy</H>
      <p>
        For takedown requests, privacy inquiries, or legal matters:{" "}
        <a href={`mailto:${LEGAL_EMAIL}`} className="text-secondary hover:text-white">{LEGAL_EMAIL}</a>
      </p>
      <H>Press & Partnerships</H>
      <p>
        For press, licensing, or collaborations: reach out via the main hub at{" "}
        <a href="https://shotgunninjas.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white inline-flex items-center gap-1">
          shotgunninjas.com <ExternalLink size={11} />
        </a>
      </p>
      <H>Community</H>
      <p>
        For real-time conversation, join the village at{" "}
        <Link href="/community" className="text-secondary hover:text-white">/community</Link>.
      </p>
      <H>Response Times</H>
      <p>We aim to respond to all support emails within 2 business days. Press inquiries: within 5 business days.</p>
    </>
  );
}
