import type { ComponentType, AnchorHTMLAttributes } from "react";
import { ExternalLink, Users, ShoppingBag, Database, ChevronRight } from "lucide-react";

export type UniverseFooterLinkComponent = ComponentType<
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
>;

interface CrossLink {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  hoverColor: string;
}

const allLinks: Record<string, CrossLink> = {
  archive: {
    href: "/archive",
    label: "Mission Archive",
    sublabel: "Watch the trilogy.",
    icon: Database,
    color: "text-primary border-primary/30",
    hoverColor: "hover:border-primary",
  },
  community: {
    href: "/community",
    label: "The Village",
    sublabel: "Join the discussion.",
    icon: Users,
    color: "text-secondary border-secondary/30",
    hoverColor: "hover:border-secondary",
  },
  merch: {
    href: "/merch",
    label: "Ronin Supply",
    sublabel: "Support the mission.",
    icon: ShoppingBag,
    color: "text-orange-500 border-orange-500/30",
    hoverColor: "hover:border-orange-500",
  },
};

const legalLinks = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refunds", label: "Refunds" },
  { href: "/legal/contact", label: "Contact" },
];

const HUB_URL = "https://shotgunninjas.com";

export interface UniverseFooterProps {
  /**
   * Keys of cross-links to hide (e.g. ["community"] when rendered on the Community page).
   */
  exclude?: string[];
  /**
   * Optional Link component used for in-app navigation (e.g. wouter's <Link> or react-router's).
   * Falls back to a plain <a> tag, which is useful for sister sites that don't share a router.
   */
  LinkComponent?: UniverseFooterLinkComponent;
  /**
   * Base URL prefix to apply to internal links so sister sites can point at the village
   * (e.g. "https://shotgunninjas.com"). Leave undefined to keep links relative.
   */
  internalBaseUrl?: string;
}

const DefaultLink: UniverseFooterLinkComponent = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

export function UniverseFooter({
  exclude = [],
  LinkComponent = DefaultLink,
  internalBaseUrl,
}: UniverseFooterProps) {
  const links = Object.entries(allLinks).filter(([key]) => !exclude.includes(key));
  const year = new Date().getFullYear();
  const resolveHref = (href: string) =>
    internalBaseUrl ? `${internalBaseUrl.replace(/\/$/, "")}${href}` : href;

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {links.length > 0 && (
          <div className={`grid grid-cols-1 ${links.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"} gap-3 mb-8`}>
            {links.map(([key, link]) => {
              const Icon = link.icon;
              return (
                <LinkComponent
                  key={key}
                  href={resolveHref(link.href)}
                  className={`group border bg-card/50 p-4 flex items-center gap-3 transition-all ${link.color} ${link.hoverColor}`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-display text-sm text-white uppercase tracking-widest group-hover:text-inherit transition-colors">{link.label}</span>
                    <span className="block font-mono text-[10px] text-muted-foreground">{link.sublabel}</span>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-inherit transition-colors" />
                </LinkComponent>
              );
            })}
          </div>
        )}

        <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-4 pb-2 border-t border-border/50">
          {legalLinks.map((l) => (
            <LinkComponent
              key={l.href}
              href={resolveHref(l.href)}
              className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
            >
              {l.label}
            </LinkComponent>
          ))}
          <a
            href={HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-widest text-secondary hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ShotgunNinjas.com <ExternalLink size={10} />
          </a>
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
          <p className="font-mono text-[11px] text-muted-foreground">
            © {year} Shotgun Ninjas Productions. Built by{" "}
            <a
              href={HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-white transition-colors"
            >
              Shotgun Ninjas Productions
            </a>
            .
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Part of the Shotgun Ninjas ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
