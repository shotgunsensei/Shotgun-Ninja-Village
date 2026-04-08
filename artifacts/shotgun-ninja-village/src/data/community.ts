export interface ForumCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  topicCount: number;
  postCount: number;
  locked?: boolean;
}

export interface ForumTopic {
  id: string;
  categorySlug: string;
  title: string;
  author: string;
  authorBadge?: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  pinned?: boolean;
  hot?: boolean;
}

export interface MemberPerk {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: "free" | "supporter" | "founder";
  available: boolean;
}

export const categories: ForumCategory[] = [
  {
    id: "cat-announce",
    slug: "dojo-announcements",
    name: "Dojo Announcements",
    description: "Official updates, new transmissions, system launches, and village-wide briefings.",
    icon: "megaphone",
    color: "text-primary",
    topicCount: 12,
    postCount: 87,
  },
  {
    id: "cat-gate",
    slug: "village-gate",
    name: "Village Gate",
    description: "Introduce yourself. State your callsign. Enter the network.",
    icon: "door-open",
    color: "text-secondary",
    topicCount: 34,
    postCount: 156,
  },
  {
    id: "cat-lore",
    slug: "lore-episodes",
    name: "Lore & Episodes",
    description: "Break down transmissions, discuss the story, share theories about the signal war.",
    icon: "book-open",
    color: "text-purple-400",
    topicCount: 28,
    postCount: 312,
  },
  {
    id: "cat-arsenal",
    slug: "arsenal-builds",
    name: "Arsenal Builds",
    description: "Share your creative builds, tool setups, and field configurations.",
    icon: "wrench",
    color: "text-orange-400",
    topicCount: 19,
    postCount: 145,
  },
  {
    id: "cat-forge",
    slug: "the-forge",
    name: "The Forge",
    description: "Creators, builders, and operators. Share what you're making. Get feedback.",
    icon: "hammer",
    color: "text-blue-400",
    topicCount: 22,
    postCount: 198,
  },
  {
    id: "cat-merch",
    slug: "merch-flex",
    name: "Merch Flex",
    description: "Show off your village gear. Unboxings, fit pics, and collection shots.",
    icon: "shirt",
    color: "text-green-400",
    topicCount: 15,
    postCount: 89,
  },
  {
    id: "cat-support",
    slug: "support-suggestions",
    name: "Support & Suggestions",
    description: "Feedback, feature requests, bug reports, and improvement ideas.",
    icon: "message-circle",
    color: "text-muted-foreground",
    topicCount: 8,
    postCount: 42,
  },
];

export const featuredTopics: ForumTopic[] = [
  {
    id: "topic-001",
    categorySlug: "dojo-announcements",
    title: "Transmission 03: Fracture Scan — Now Live",
    author: "Kage-9",
    authorBadge: "Founder",
    replyCount: 47,
    viewCount: 1240,
    lastActivity: "2h ago",
    pinned: true,
  },
  {
    id: "topic-002",
    categorySlug: "lore-episodes",
    title: "The counterfeit lattice theory — what connects all three transmissions",
    author: "signal_ghost",
    replyCount: 32,
    viewCount: 890,
    lastActivity: "4h ago",
    hot: true,
  },
  {
    id: "topic-003",
    categorySlug: "the-forge",
    title: "Built a BrandForge-inspired dashboard for my own project",
    author: "neon_ronin",
    authorBadge: "Supporter",
    replyCount: 18,
    viewCount: 456,
    lastActivity: "6h ago",
  },
  {
    id: "topic-004",
    categorySlug: "merch-flex",
    title: "Founding Ninja Tee arrived — the quality is insane",
    author: "blade_runner_44",
    replyCount: 24,
    viewCount: 672,
    lastActivity: "8h ago",
    hot: true,
  },
  {
    id: "topic-005",
    categorySlug: "village-gate",
    title: "New here — found the universe through a random YouTube clip",
    author: "cipher_wave",
    replyCount: 11,
    viewCount: 234,
    lastActivity: "12h ago",
  },
];

export const memberPerks: MemberPerk[] = [
  {
    id: "perk-free-1",
    title: "Village Access",
    description: "Join discussions, post topics, and connect with operators across the network.",
    icon: "door-open",
    tier: "free",
    available: true,
  },
  {
    id: "perk-free-2",
    title: "Transmission Alerts",
    description: "Get notified when new episodes, systems, or classified drops go live.",
    icon: "bell",
    tier: "free",
    available: true,
  },
  {
    id: "perk-sup-1",
    title: "Supporter Badge",
    description: "Visible supporter flair on your profile and all posts.",
    icon: "award",
    tier: "supporter",
    available: false,
  },
  {
    id: "perk-sup-2",
    title: "Private Chambers",
    description: "Access supporter-only discussion areas and behind-the-scenes content.",
    icon: "lock",
    tier: "supporter",
    available: false,
  },
  {
    id: "perk-founder-1",
    title: "Founding Ninja Status",
    description: "Permanent founder badge. Numbered. Non-transferable. Legendary.",
    icon: "crown",
    tier: "founder",
    available: false,
  },
  {
    id: "perk-founder-2",
    title: "Early Access Drops",
    description: "First access to limited merch drops and digital exclusives before public release.",
    icon: "zap",
    tier: "founder",
    available: false,
  },
];
