import {
  categories as mockCategories,
  featuredTopics as mockTopics,
  memberPerks as mockPerks,
  communityStats as mockStats,
  type ForumCategory,
  type ForumTopic,
  type MemberPerk,
  type CommunityStats,
} from "@/data/community";
import {
  communityConfig,
  isLiveCommunity,
  isSsoEnabled,
  isEmbedEnabled,
} from "@/config/integrations";

export async function getCategories(): Promise<ForumCategory[]> {
  if (isLiveCommunity()) {
    return fetchDiscourseCategories();
  }
  return [...mockCategories].sort((a, b) => a.position - b.position);
}

export async function getFeaturedTopics(): Promise<ForumTopic[]> {
  if (isLiveCommunity()) {
    return fetchDiscourseTopics();
  }
  return mockTopics;
}

export async function getMemberPerks(): Promise<MemberPerk[]> {
  return mockPerks;
}

export async function getCommunityStats(): Promise<CommunityStats> {
  if (isLiveCommunity()) {
    return fetchDiscourseStats();
  }
  return mockStats;
}

export function getCommunityUrl(path = ""): string {
  if (isLiveCommunity() && communityConfig.discourse.url) {
    return `${communityConfig.discourse.url}${path}`;
  }
  return "#community-coming-soon";
}

export function getCommunityHomeUrl(): string {
  return getCommunityUrl("/latest");
}

export function getCategoryUrl(slug: string): string {
  return getCommunityUrl(`/c/${slug}`);
}

export function getTopicUrl(id: string): string {
  return getCommunityUrl(`/t/${id}`);
}

export function getSignupUrl(): string {
  if (communityConfig.signup.url) {
    return communityConfig.signup.url;
  }
  if (isLiveCommunity() && communityConfig.discourse.url) {
    return `${communityConfig.discourse.url}/signup`;
  }
  return communityConfig.signup.fallbackUrl;
}

export function getLoginUrl(returnPath?: string): string {
  if (isSsoEnabled()) {
    const base = communityConfig.sso.loginUrl;
    return returnPath ? `${base}?return_path=${encodeURIComponent(returnPath)}` : base;
  }
  if (isLiveCommunity() && communityConfig.discourse.url) {
    return `${communityConfig.discourse.url}/login`;
  }
  return "#login-not-configured";
}

export function getEmbedUrl(canonicalPageUrl: string): string | null {
  if (!isEmbedEnabled() || !communityConfig.discourse.url) return null;
  return `${communityConfig.discourse.url}/embed/comments?embed_url=${encodeURIComponent(canonicalPageUrl)}`;
}

export function isCategoryGated(slug: string): boolean {
  return communityConfig.gatedCategories.includes(slug);
}

export function getRequiredGroup(category: ForumCategory): string | null {
  return category.requiredGroup ?? null;
}

export function isLive(): boolean {
  return isLiveCommunity();
}

async function fetchDiscourseCategories(): Promise<ForumCategory[]> {
  try {
    const res = await fetch(`${communityConfig.discourse.url}/categories.json`);
    if (!res.ok) throw new Error(`Discourse API ${res.status}`);
    const data = await res.json();
    return (data.category_list?.categories ?? []).map((c: any) => ({
      id: `cat-${c.id}`,
      slug: c.slug,
      discourseId: c.id,
      name: c.name,
      description: c.description || "",
      icon: mapDiscourseIcon(c.slug),
      color: `text-[#${c.color}]`,
      topicCount: c.topic_count || 0,
      postCount: c.post_count || 0,
      position: c.position ?? 99,
      locked: c.read_restricted ?? false,
      requiredGroup: c.read_restricted ? (c.group_permissions?.[0]?.group_name ?? undefined) : undefined,
      latestPosterAvatars: [],
    }));
  } catch {
    return [...mockCategories].sort((a, b) => a.position - b.position);
  }
}

async function fetchDiscourseTopics(): Promise<ForumTopic[]> {
  try {
    const res = await fetch(`${communityConfig.discourse.url}/latest.json`);
    if (!res.ok) throw new Error(`Discourse API ${res.status}`);
    const data = await res.json();
    const users = new Map((data.users ?? []).map((u: any) => [u.id, u]));
    return (data.topic_list?.topics ?? []).slice(0, 8).map((t: any) => {
      const poster = users.get(t.posters?.[0]?.user_id);
      return {
        id: String(t.id),
        categorySlug: findCategorySlug(t.category_id),
        title: t.title,
        author: poster?.username ?? "unknown",
        authorAvatar: poster?.username?.substring(0, 2).toUpperCase() ?? "",
        replyCount: t.reply_count ?? 0,
        viewCount: t.views ?? 0,
        lastActivity: formatRelativeTime(t.last_posted_at),
        pinned: t.pinned ?? false,
        hot: (t.reply_count ?? 0) > 20,
        excerpt: t.excerpt ?? "",
      };
    });
  } catch {
    return mockTopics;
  }
}

async function fetchDiscourseStats(): Promise<CommunityStats> {
  try {
    const res = await fetch(`${communityConfig.discourse.url}/about.json`);
    if (!res.ok) throw new Error(`Discourse API ${res.status}`);
    const data = await res.json();
    const about = data.about ?? {};
    return {
      totalMembers: about.stats?.user_count ?? mockStats.totalMembers,
      onlineNow: about.stats?.active_users_last_day ?? mockStats.onlineNow,
      totalTopics: about.stats?.topic_count ?? mockStats.totalTopics,
      totalPosts: about.stats?.post_count ?? mockStats.totalPosts,
      newestMember: about.stats?.last_registered_username ?? mockStats.newestMember,
    };
  } catch {
    return mockStats;
  }
}

function mapDiscourseIcon(slug: string): string {
  const map: Record<string, string> = {
    "dojo-announcements": "megaphone",
    "village-gate": "door-open",
    "lore-episodes": "book-open",
    "arsenal-builds": "wrench",
    "the-forge": "hammer",
    "merch-flex": "shirt",
    "ronin-lounge": "lock",
    "founders-chamber": "crown",
    "support-suggestions": "message-circle",
  };
  return map[slug] ?? "message-circle";
}

function findCategorySlug(discourseId: number): string {
  const match = mockCategories.find((c) => c.discourseId === discourseId);
  return match?.slug ?? "general";
}

function formatRelativeTime(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
