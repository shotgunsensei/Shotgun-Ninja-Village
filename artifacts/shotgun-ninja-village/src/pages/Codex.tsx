import { Link } from "wouter";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { UniverseFooter } from "@workspace/sn-ecosystem";
import { brandAsset, factions } from "@/data/brand";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Codex() {
  usePageMeta({
    title: "Village Codex",
    description:
      "Meet the four operator archetypes and explore the original Shotgun Ninjas world.",
  });
  return (
    <div className="village-page">
      <section className="codex-intro">
        <p className="eyebrow">Field guide / 004 archetypes</p>
        <h1>
          One village.
          <br />
          <span>Four ways to fight the noise.</span>
        </h1>
        <p className="lede">
          Builders, guardians, tracers, and breakers. Different instincts. A
          shared signal. Find the mark that feels like yours.
        </p>
        <Link href="/alignment" className="brand-button">
          Find your alignment <ArrowRight size={18} />
        </Link>
      </section>
      <section className="faction-grid" aria-label="Operator archetypes">
        {factions.map((faction, i) => (
          <article
            className="faction-card"
            key={faction.id}
            style={{ "--faction": faction.color } as React.CSSProperties}
          >
            <div className="faction-topline">
              <span>
                0{i + 1} / {faction.verb}
              </span>
              <span>SN / VILLAGE</span>
            </div>
            <img
              className="faction-emblem"
              src={brandAsset(`factions/${faction.id}.svg`)}
              width="200"
              height="200"
              alt={`${faction.name} emblem`}
            />
            <p className="eyebrow">{faction.district}</p>
            <h2>{faction.name}</h2>
            <p>{faction.description}</p>
            <Link href="/grid" className="text-link">
              Explore the district <ArrowUpRight size={16} />
            </Link>
          </article>
        ))}
      </section>
      <section className="codex-story">
        <img
          src={brandAsset("village-key-art.webp")}
          width="1536"
          height="1024"
          loading="lazy"
          decoding="async"
          alt="Original cel-shaded red-armored operator overlooking the lantern-lit village"
        />
        <div>
          <p className="eyebrow">The signal survives here</p>
          <h2>
            A haven built
            <br />
            from the fragments.
          </h2>
          <p>
            Across the Forge Grid, Noise Sectors, Archive Fractures, and
            Operator Havens, the village gathers the people who recover what the
            static tried to erase.
          </p>
          <Link href="/operators" className="text-link">
            Meet Kage-9 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <UniverseFooter LinkComponent={Link} />
    </div>
  );
}
