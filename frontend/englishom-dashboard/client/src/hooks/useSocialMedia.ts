import { trpc } from '@/lib/trpc';

/**
 * Hook to fetch social media posts
 */
export function useSocialMediaPosts(limit: number = 5) {
  return trpc.socialMedia.getAllPosts.useQuery({ limit });
}

/**
 * Hook to fetch posts from a specific platform
 */
export function useSocialMediaPostsByPlatform(
  platform: 'facebook' | 'twitter' | 'youtube' | 'instagram' | 'tiktok',
  limit: number = 5
) {
  return trpc.socialMedia.getPostsByPlatform.useQuery({ platform, limit });
}

/**
 * Hook to fetch statistics for all platforms
 */
export function useSocialMediaStats() {
  return trpc.socialMedia.getAllStats.useQuery();
}

/**
 * Hook to fetch statistics for a specific platform
 */
export function useSocialMediaStatsByPlatform(
  platform: 'facebook' | 'twitter' | 'youtube' | 'instagram' | 'tiktok'
) {
  return trpc.socialMedia.getStatsByPlatform.useQuery({ platform });
}

/**
 * Hook to fetch trending content
 */
export function useTrendingContent(limit: number = 10) {
  return trpc.socialMedia.getTrendingContent.useQuery({ limit });
}

/**
 * Hook to fetch platform overview
 */
export function usePlatformOverview() {
  return trpc.socialMedia.getPlatformOverview.useQuery();
}
