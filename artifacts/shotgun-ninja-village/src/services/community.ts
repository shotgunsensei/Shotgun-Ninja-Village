import {
  categories as mockCategories,
  featuredTopics as mockTopics,
  memberPerks as mockPerks,
  type ForumCategory,
  type ForumTopic,
  type MemberPerk,
} from "@/data/community";
import { communityConfig, isLiveCommunity } from "@/config/integrations";

export async function getCategories(): Promise<ForumCategory[]> {
  if (isLiveCommunity()) {
    return fetchDiscourseCategories();
  }
  return mockCategories;
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

export function getCommunityUrl(path = ""): string {
  if (isLiveCommunity() && communityConfig.discourse.url) {
    return `${communityConfig.discourse.url}${path}`;
  }
  return "#community-coming-soon";
}

export function getCategoryUrl(slug: string): string {
  return getCommunityUrl(`/c/${slug}`);
}

export function getTopicUrl(id: string): string {
  return getCommunityUrl(`/t/${id}`);
}

async function fetchDiscourseCategories(): Promise<ForumCategory[]> {
  return mockCategories;
}

async function fetchDiscourseTopics(): Promise<ForumTopic[]> {
  return mockTopics;
}
