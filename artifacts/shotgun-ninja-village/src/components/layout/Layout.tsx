import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, useLocation } from "wouter";
import {
  Cpu,
  Database,
  Download,
  FileText,
  Globe,
  Map,
  Menu,
  MessageSquare,
  Shield,
  ShoppingBag,
  Sword,
  UserCircle,
  Users,
  UserSquare,
  X,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { OperatorAvatar } from "@/components/community/OperatorAvatar";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { cn } from "@/lib/utils";

const storyLinks = [
  { href: "/", label: "Signal Feed", sublabel: "Start here", icon: Shield },
  {
    href: "/archive",
    label: "Archive",
    sublabel: "Watch episodes",
    icon: Database,
  },
  {
    href: "/operators",
    label: "Operator Files",
    sublabel: "Meet the characters",
    icon: UserSquare,
  },
  {
    href: "/grid",
    label: "Grid Map",
    sublabel: "Explore the world",
    icon: Map,
  },
  {
    href: "/arsenal",
    label: "Arsenal",
    sublabel: "Inspect the gear",
    icon: Sword,
  },
  {
    href: "/intel",
    label: "Forge Intel",
    sublabel: "Tools and platforms",
    icon: Cpu,
  },
];

const villageLinks = [
  {
    href: "/community",
    label: "Message Boards",
    sublabel: "Read, post, connect",
    icon: MessageSquare,
  },
  {
    href: "/alignment",
    label: "Alignment",
    sublabel: "Find your archetype",
    icon: Users,
  },
  {
    href: "/merch",
    label: "Ronin Supply",
    sublabel: "Village merch",
    icon: ShoppingBag,
  },
];

function isRouteActive(location: string, href: string): boolean {
  if (href === "/") return location === "/";
  return location === href || location.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  sublabel,
  icon: Icon,
  location,
  onNavigate,
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  location: string;
  onNavigate?: () => void;
}) {
  const active = isRouteActive(location, href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 border-l-2 px-3 py-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        active
          ? "border-primary bg-primary/10 text-white"
          : "border-transparent text-muted-foreground hover:border-white/20 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon
        size={16}
        className={cn(
          "shrink-0",
          active ? "text-primary" : "text-slate-500 group-hover:text-slate-300",
        )}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block truncate font-display text-base uppercase leading-tight">
          {label}
        </span>
        <span className="block truncate font-mono text-[9px] text-muted-foreground">
          {sublabel}
        </span>
      </span>
    </Link>
  );
}

function Navigation({
  location,
  onNavigate,
}: {
  location: string;
  onNavigate?: () => void;
}) {
  const { user } = useAuth();
  const { canInstall, install } = useInstallPrompt();
  return (
    <div className="flex h-full flex-col bg-background/98">
      <div className="border-b border-border p-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="block font-display text-2xl font-bold uppercase text-primary">
            Shotgun Ninjas
          </span>
          <span className="mt-0.5 block font-mono text-[9px] uppercase text-muted-foreground">
            Village Network // Online
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="Primary navigation"
      >
        <NavGroup
          title="Story & Universe"
          links={storyLinks}
          location={location}
          onNavigate={onNavigate}
        />
        <NavGroup
          title="Village"
          links={villageLinks}
          location={location}
          onNavigate={onNavigate}
          className="mt-5 border-t border-border/70 pt-4"
        />
        <div className="mt-5 border-t border-border/70 pt-4">
          <p className="mb-2 px-3 font-mono text-[9px] uppercase text-slate-500">
            Network
          </p>
          <a
            href="https://shotgunninjas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-muted-foreground hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-white"
          >
            <Globe size={15} className="text-cyan-300" />
            <span>
              <span className="block font-display text-base uppercase">
                Main Site
              </span>
              <span className="block font-mono text-[9px] text-muted-foreground">
                ShotgunNinjas.com ↗
              </span>
            </span>
          </a>
          <a
            href="https://www.operatoros.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-muted-foreground hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-white"
          >
            <Cpu size={15} className="text-cyan-300" />
            <span>
              <span className="block font-display text-base uppercase">
                OperatorOS
              </span>
              <span className="block font-mono text-[9px] text-muted-foreground">
                Ecosystem gateway ↗
              </span>
            </span>
          </a>
          <Link
            href="/legal/terms"
            onClick={onNavigate}
            className="flex items-center gap-3 border-l-2 border-transparent px-3 py-2 font-mono text-[10px] uppercase text-muted-foreground hover:text-white"
          >
            <FileText size={13} /> Legal & contact
          </Link>
        </div>
      </nav>

      <div className="space-y-3 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {user ? (
          <Link
            href="/account"
            onClick={onNavigate}
            className="flex items-center gap-3 border border-primary/35 bg-primary/5 p-3 hover:bg-primary/10"
          >
            <OperatorAvatar
              callsign={user.callsign}
              color={user.avatarColor}
              className="size-9"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-base uppercase text-white">
                @{user.callsign}
              </span>
              <span className="block font-mono text-[9px] uppercase text-muted-foreground">
                {user.badges.filter((badge) => badge.earned).length} badges ·
                Manage account
              </span>
            </span>
          </Link>
        ) : (
          <Link
            href="/account?mode=signup"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 bg-primary px-3 py-2.5 font-mono text-[10px] uppercase text-white hover:bg-primary/90"
          >
            <UserCircle size={14} /> Create free account
          </Link>
        )}
        {canInstall && (
          <button
            onClick={() => void install()}
            className="flex w-full items-center justify-center gap-2 border border-border px-3 py-2 font-mono text-[9px] uppercase text-muted-foreground hover:border-white/30 hover:text-white"
          >
            <Download size={12} /> Install Village app
          </button>
        )}
      </div>
    </div>
  );
}

function NavGroup({
  title,
  links,
  location,
  onNavigate,
  className,
}: {
  title: string;
  links: typeof storyLinks;
  location: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 px-3 font-mono text-[9px] uppercase text-slate-500">
        {title}
      </p>
      <div className="space-y-0.5">
        {links.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            location={location}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background text-foreground md:flex-row">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-50 -translate-y-20 bg-primary px-4 py-2 font-mono text-xs uppercase text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-15 scanlines"
        aria-hidden="true"
      />

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Link
          href="/"
          className="font-display text-xl font-bold uppercase text-primary"
        >
          SN // Village
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/account"
            aria-label={
              user
                ? `Account for ${user.callsign}`
                : "Sign in or create account"
            }
            className="flex size-9 items-center justify-center border border-border text-muted-foreground hover:text-white"
          >
            {user ? (
              <OperatorAvatar
                callsign={user.callsign}
                color={user.avatarColor}
                className="size-8 border-0"
              />
            ) : (
              <UserCircle size={18} />
            )}
          </Link>
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                className="flex size-9 items-center justify-center border border-primary/40 text-primary"
                aria-label="Open navigation"
              >
                <Menu size={19} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[min(88vw,19rem)] border-r border-primary/35 bg-background shadow-2xl duration-150 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left">
                <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
                <Dialog.Close
                  className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center border border-border bg-background text-muted-foreground hover:text-white"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </Dialog.Close>
                <Navigation
                  location={location}
                  onNavigate={() => setMenuOpen(false)}
                />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>

      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 border-r border-border md:block">
        <Navigation location={location} />
      </aside>
      <main
        id="main-content"
        tabIndex={-1}
        className="relative min-h-[100dvh] min-w-0 flex-1 overflow-x-hidden focus:outline-none"
      >
        {children}
      </main>
    </div>
  );
}
