import type { SessionUser } from "../auth/session";

export interface CommunityCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  requiredTier?: "supporter" | "founder";
  topicCreationRole?: "admin";
}

export const communityCategories: CommunityCategory[] = [
  {
    slug: "dojo-announcements",
    name: "Dojo Announcements",
    description:
      "Official updates, new transmissions, system launches, and village-wide briefings.",
    icon: "megaphone",
    color: "text-primary",
    position: 0,
    topicCreationRole: "admin",
  },
  {
    slug: "village-gate",
    name: "Village Gate",
    description: "Introduce yourself. State your callsign. Enter the network.",
    icon: "door-open",
    color: "text-secondary",
    position: 1,
  },
  {
    slug: "lore-episodes",
    name: "Lore & Episodes",
    description:
      "Break down transmissions, discuss the story, and share theories about the signal war.",
    icon: "book-open",
    color: "text-cyan-400",
    position: 2,
  },
  {
    slug: "arsenal-builds",
    name: "Arsenal Builds",
    description:
      "Share your creative builds, tool setups, and field configurations.",
    icon: "wrench",
    color: "text-amber-400",
    position: 3,
  },
  {
    slug: "the-forge",
    name: "The Forge",
    description:
      "Creators, builders, and operators: share what you are making and get feedback.",
    icon: "hammer",
    color: "text-blue-400",
    position: 4,
  },
  {
    slug: "merch-flex",
    name: "Merch Flex",
    description:
      "Show off your village gear, unboxings, fit pics, and collection shots.",
    icon: "shirt",
    color: "text-emerald-400",
    position: 5,
  },
  {
    slug: "support-suggestions",
    name: "Support & Suggestions",
    description:
      "Feedback, feature requests, bug reports, and improvement ideas.",
    icon: "message-circle",
    color: "text-slate-300",
    position: 6,
  },
  {
    slug: "ronin-lounge",
    name: "Ronin Lounge",
    description:
      "Supporter space for behind-the-scenes notes, early previews, and direct feedback.",
    icon: "lock",
    color: "text-amber-400",
    position: 7,
    requiredTier: "supporter",
  },
  {
    slug: "founders-chamber",
    name: "Founders Chamber",
    description:
      "Private founder channel for first looks and direct input on the future of the Village.",
    icon: "crown",
    color: "text-primary",
    position: 8,
    requiredTier: "founder",
  },
];

const tierRank = { free: 0, supporter: 1, founder: 2 } as const;

export function getCategory(slug: string): CommunityCategory | null {
  return communityCategories.find((category) => category.slug === slug) ?? null;
}

export function canAccessCategory(
  category: CommunityCategory,
  user: SessionUser | null,
): boolean {
  if (!category.requiredTier) return true;
  if (user?.role === "admin" || user?.role === "moderator") return true;
  if (!user) return false;
  const userRank = tierRank[user.tier as keyof typeof tierRank] ?? 0;
  return userRank >= tierRank[category.requiredTier];
}

export function canCreateTopic(
  category: CommunityCategory,
  user: SessionUser,
): boolean {
  if (category.topicCreationRole === "admin" && user.role !== "admin")
    return false;
  return canAccessCategory(category, user);
}
