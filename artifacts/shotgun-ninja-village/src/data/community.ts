export interface ForumCategory {
  id: string;
  slug: string;
  discourseId: number | null;
  name: string;
  description: string;
  icon: string;
  color: string;
  topicCount: number;
  postCount: number;
  position: number;
  locked?: boolean;
  requiredGroup?: string;
  latestPosterAvatars?: string[];
}

export interface ForumTopic {
  id: string;
  categorySlug: string;
  title: string;
  author: string;
  authorAvatar?: string;
  authorBadge?: string;
  replyCount: number;
  viewCount: number;
  lastActivity: string;
  pinned?: boolean;
  hot?: boolean;
  excerpt?: string;
}

export interface MemberPerk {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: "free" | "supporter" | "founder";
  available: boolean;
  discourseGroup?: string;
}

export interface CommunityStats {
  totalMembers: number;
  onlineNow: number;
  totalTopics: number;
  totalPosts: number;
  newestMember: string;
}

export const communityStats: CommunityStats = {
  totalMembers: 847,
  onlineNow: 23,
  totalTopics: 138,
  totalPosts: 1029,
  newestMember: "phantom_relay",
};

export const categories: ForumCategory[] = [
  {
    id: "cat-announce",
    slug: "dojo-announcements",
    discourseId: 4,
    name: "Dojo Announcements",
    description: "Official updates, new transmissions, system launches, and village-wide briefings.",
    icon: "megaphone",
    color: "text-primary",
    topicCount: 12,
    postCount: 87,
    position: 0,
    latestPosterAvatars: ["K9", "SG"],
  },
  {
    id: "cat-gate",
    slug: "village-gate",
    discourseId: 5,
    name: "Village Gate",
    description: "Introduce yourself. State your callsign. Enter the network.",
    icon: "door-open",
    color: "text-secondary",
    topicCount: 34,
    postCount: 156,
    position: 1,
    latestPosterAvatars: ["CW", "NR", "BR"],
  },
  {
    id: "cat-lore",
    slug: "lore-episodes",
    discourseId: 6,
    name: "Lore & Episodes",
    description: "Break down transmissions, discuss the story, share theories about the signal war.",
    icon: "book-open",
    color: "text-purple-400",
    topicCount: 28,
    postCount: 312,
    position: 2,
    latestPosterAvatars: ["SG", "K9", "DX"],
  },
  {
    id: "cat-arsenal",
    slug: "arsenal-builds",
    discourseId: 7,
    name: "Arsenal Builds",
    description: "Share your creative builds, tool setups, and field configurations.",
    icon: "wrench",
    color: "text-orange-400",
    topicCount: 19,
    postCount: 145,
    position: 3,
    latestPosterAvatars: ["NR", "BR"],
  },
  {
    id: "cat-forge",
    slug: "the-forge",
    discourseId: 8,
    name: "The Forge",
    description: "Creators, builders, and operators. Share what you're making. Get feedback.",
    icon: "hammer",
    color: "text-blue-400",
    topicCount: 22,
    postCount: 198,
    position: 4,
    latestPosterAvatars: ["NR", "K9"],
  },
  {
    id: "cat-merch",
    slug: "merch-flex",
    discourseId: 9,
    name: "Merch Flex",
    description: "Show off your village gear. Unboxings, fit pics, and collection shots.",
    icon: "shirt",
    color: "text-green-400",
    topicCount: 15,
    postCount: 89,
    position: 5,
    latestPosterAvatars: ["BR", "CW"],
  },
  {
    id: "cat-lounge",
    slug: "ronin-lounge",
    discourseId: 10,
    name: "Ronin Lounge",
    description: "Supporter-only space. Behind-the-scenes, early access previews, and direct feedback.",
    icon: "lock",
    color: "text-orange-400",
    topicCount: 6,
    postCount: 41,
    position: 6,
    locked: true,
    requiredGroup: "ronin-supporters",
    latestPosterAvatars: ["K9"],
  },
  {
    id: "cat-support",
    slug: "support-suggestions",
    discourseId: 11,
    name: "Support & Suggestions",
    description: "Feedback, feature requests, bug reports, and improvement ideas.",
    icon: "message-circle",
    color: "text-muted-foreground",
    topicCount: 8,
    postCount: 42,
    position: 7,
    latestPosterAvatars: ["SG", "NR"],
  },
];

export const featuredTopics: ForumTopic[] = [
  {
    id: "topic-001",
    categorySlug: "dojo-announcements",
    title: "Transmission 03: Fracture Scan — Now Live",
    author: "Kage-9",
    authorAvatar: "K9",
    authorBadge: "Founder",
    replyCount: 47,
    viewCount: 1240,
    lastActivity: "2h ago",
    pinned: true,
    excerpt: "The third signal has been recovered. Watch it now in the Archive.",
  },
  {
    id: "topic-002",
    categorySlug: "lore-episodes",
    title: "The counterfeit lattice theory — what connects all three transmissions",
    author: "signal_ghost",
    authorAvatar: "SG",
    replyCount: 32,
    viewCount: 890,
    lastActivity: "4h ago",
    hot: true,
    excerpt: "I've been mapping the signal distortion patterns across all three EPs and I think the lattice is the key...",
  },
  {
    id: "topic-003",
    categorySlug: "the-forge",
    title: "Built a BrandForge-inspired dashboard for my own project",
    author: "neon_ronin",
    authorAvatar: "NR",
    authorBadge: "Supporter",
    replyCount: 18,
    viewCount: 456,
    lastActivity: "6h ago",
    excerpt: "Took the BF-OS layout and rebuilt it in React for my freelance brand...",
  },
  {
    id: "topic-004",
    categorySlug: "merch-flex",
    title: "Founding Ninja Tee arrived — the quality is insane",
    author: "blade_runner_44",
    authorAvatar: "BR",
    replyCount: 24,
    viewCount: 672,
    lastActivity: "8h ago",
    hot: true,
    excerpt: "Just got my founder tee. The embroidery on the collar tag is a nice touch.",
  },
  {
    id: "topic-005",
    categorySlug: "village-gate",
    title: "New here — found the universe through a random YouTube clip",
    author: "cipher_wave",
    authorAvatar: "CW",
    replyCount: 11,
    viewCount: 234,
    lastActivity: "12h ago",
    excerpt: "Clicked a random clip, watched Transmission 01, and now I'm deep in the lore...",
  },
  {
    id: "topic-006",
    categorySlug: "arsenal-builds",
    title: "My TorqueShed-inspired tool rack build log",
    author: "drift_ops",
    authorAvatar: "DX",
    authorBadge: "Supporter",
    replyCount: 9,
    viewCount: 187,
    lastActivity: "1d ago",
    excerpt: "After watching EP02 I had to build something. Here's my setup...",
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
    id: "perk-free-3",
    title: "Merch Flex Access",
    description: "Post in the Merch Flex channel and show off your village gear.",
    icon: "shirt",
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
    discourseGroup: "ronin-supporters",
  },
  {
    id: "perk-sup-2",
    title: "Ronin Lounge",
    description: "Access the supporter-only channel for behind-the-scenes and direct feedback.",
    icon: "lock",
    tier: "supporter",
    available: false,
    discourseGroup: "ronin-supporters",
  },
  {
    id: "perk-sup-3",
    title: "Priority Merch Access",
    description: "24-hour early access window on limited drops before public release.",
    icon: "zap",
    tier: "supporter",
    available: false,
    discourseGroup: "ronin-supporters",
  },
  {
    id: "perk-founder-1",
    title: "Founding Ninja Status",
    description: "Permanent founder badge. Numbered. Non-transferable. Legendary.",
    icon: "crown",
    tier: "founder",
    available: false,
    discourseGroup: "founding-ninjas",
  },
  {
    id: "perk-founder-2",
    title: "Founders Chamber",
    description: "Private channel with the core team. Shape the future of the universe.",
    icon: "lock",
    tier: "founder",
    available: false,
    discourseGroup: "founding-ninjas",
  },
  {
    id: "perk-founder-3",
    title: "First-Look Drops",
    description: "See new transmissions, merch, and systems before anyone else.",
    icon: "zap",
    tier: "founder",
    available: false,
    discourseGroup: "founding-ninjas",
  },
];
