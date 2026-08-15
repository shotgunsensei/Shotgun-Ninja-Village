export interface BadgeView {
  id: string;
  label: string;
  description: string;
  earned: boolean;
}

export interface VillageUser {
  id: string;
  email?: string;
  displayName: string;
  callsign: string;
  bio: string;
  avatarColor: "crimson" | "cyan" | "amber" | "emerald" | "violet";
  role: "member" | "moderator" | "admin";
  tier: "free" | "supporter" | "founder";
  newsletterOptIn?: boolean;
  archetype: "builder" | "protector" | "tracer" | "breaker" | null;
  watchedTransmissions: string[];
  createdAt: string;
  badges: BadgeView[];
}

export interface CommunityCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  position: number;
  requiredTier?: "supporter" | "founder";
  topicCreationRole?: "admin";
  locked: boolean;
  canAccess: boolean;
  canCreateTopic: boolean;
  topicCount: number;
  postCount: number;
}

export interface CommunityStats {
  totalMembers: number;
  onlineNow: number;
  totalTopics: number;
  totalPosts: number;
  newestMember: string | null;
}

export interface TopicSummary {
  id: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  viewCount: number;
  pinned: boolean;
  locked: boolean;
  createdAt: string;
  lastPostedAt: string;
  authorId: string;
  author: string;
  authorDisplayName: string;
  authorTier: string;
  authorArchetype: string | null;
  replyCount: number;
  isMine: boolean;
}

export interface TopicPost {
  id: string;
  body: string;
  isOriginal: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: string;
  authorDisplayName: string;
  authorTier: string;
  authorArchetype: string | null;
  avatarColor: VillageUser["avatarColor"];
  isMine: boolean;
}

export type TopicDetail = Omit<TopicSummary, "replyCount">;

export class VillageApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = "VillageApiError";
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(`/api${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) {
    throw new VillageApiError(
      response.status,
      typeof data?.message === "string"
        ? data.message
        : "The Village uplink failed",
      typeof data?.field === "string" ? data.field : undefined,
    );
  }
  return data as T;
}

export interface RegisterAccountInput {
  displayName: string;
  email: string;
  callsign: string;
  password: string;
  newsletterOptIn: boolean;
  termsAccepted: true;
  archetype?: VillageUser["archetype"];
  watchedTransmissions?: string[];
}

export const accountApi = {
  register: (input: RegisterAccountInput) =>
    apiRequest<{ user: VillageUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    apiRequest<{ user: VillageUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () => apiRequest<void>("/auth/logout", { method: "POST" }),
  me: () => apiRequest<{ user: VillageUser }>("/auth/me"),
  update: (
    input: Partial<
      Pick<
        VillageUser,
        "displayName" | "callsign" | "bio" | "avatarColor" | "newsletterOptIn"
      >
    >,
  ) =>
    apiRequest<{ user: VillageUser }>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  syncProgress: (input: {
    archetype?: NonNullable<VillageUser["archetype"]>;
    watchedTransmissions?: string[];
  }) =>
    apiRequest<{ user: VillageUser }>("/auth/progress", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
};

export const communityApi = {
  categories: () =>
    apiRequest<{ categories: CommunityCategory[] }>("/community/categories"),
  stats: () => apiRequest<CommunityStats>("/community/stats"),
  topics: (filters: { category?: string; q?: string; page?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.q) params.set("q", filters.q);
    if (filters.page && filters.page > 1)
      params.set("page", String(filters.page));
    const query = params.toString();
    return apiRequest<{
      topics: TopicSummary[];
      page: number;
      hasMore: boolean;
    }>(`/community/topics${query ? `?${query}` : ""}`);
  },
  topic: (id: string) =>
    apiRequest<{ topic: TopicDetail; posts: TopicPost[] }>(
      `/community/topics/${encodeURIComponent(id)}`,
    ),
  createTopic: (input: { categorySlug: string; title: string; body: string }) =>
    apiRequest<{ id: string }>("/community/topics", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateTopic: (id: string, title: string) =>
    apiRequest<{ ok: true }>(`/community/topics/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  removeTopic: (id: string) =>
    apiRequest<void>(`/community/topics/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  reply: (id: string, body: string) =>
    apiRequest<{ id: string }>(
      `/community/topics/${encodeURIComponent(id)}/replies`,
      { method: "POST", body: JSON.stringify({ body }) },
    ),
  updatePost: (id: string, body: string) =>
    apiRequest<{ ok: true }>(`/community/posts/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    }),
  removePost: (id: string) =>
    apiRequest<void>(`/community/posts/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  operator: (callsign: string) =>
    apiRequest<{ user: VillageUser }>(
      `/community/operators/${encodeURIComponent(callsign)}`,
    ),
};

export function formatRelativeTime(value: string): string {
  const time = new Date(value).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
