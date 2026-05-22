/**
 * tRPC Procedures for Social Media Integration
 */

import { publicProcedure, router } from './_core/trpc';
import { z } from 'zod';
import { socialMediaManager } from './socialMediaIntegration';

export const socialMediaRouter = router({
  /**
   * Get all social media posts from all platforms
   */
  getAllPosts: publicProcedure
    .input(z.object({ limit: z.number().default(5).optional() }).optional())
    .query(async ({ input }) => {
      try {
        const limit = input?.limit || 5;
        const posts = await socialMediaManager.getAllPosts(limit);
        return {
          success: true,
          data: posts,
          count: posts.length,
        };
      } catch (error) {
        console.error('Error fetching social media posts:', error);
        return {
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch social media posts',
        };
      }
    }),

  /**
   * Get posts from a specific platform
   */
  getPostsByPlatform: publicProcedure
    .input(
      z.object({
        platform: z.enum(['facebook', 'twitter', 'youtube', 'instagram', 'tiktok']),
        limit: z.number().default(5).optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const allPosts = await socialMediaManager.getAllPosts(input.limit || 5);
        const platformPosts = allPosts.filter((post) => post.platform === input.platform);
        return {
          success: true,
          platform: input.platform,
          data: platformPosts,
          count: platformPosts.length,
        };
      } catch (error) {
        console.error(`Error fetching ${input.platform} posts:`, error);
        return {
          success: false,
          platform: input.platform,
          data: [],
          count: 0,
          error: `Failed to fetch ${input.platform} posts`,
        };
      }
    }),

  /**
   * Get statistics for all platforms
   */
  getAllStats: publicProcedure.query(async () => {
    try {
      const stats = await socialMediaManager.getAllStats();
      const totalFollowers = stats.reduce((sum, s) => sum + s.followers, 0);
      const totalPosts = stats.reduce((sum, s) => sum + s.posts, 0);
      const avgEngagement = stats.length > 0 ? stats.reduce((sum, s) => sum + s.engagement, 0) / stats.length : 0;

      return {
        success: true,
        data: stats,
        summary: {
          totalFollowers,
          totalPosts,
          avgEngagement: parseFloat(avgEngagement.toFixed(2)),
          platforms: stats.length,
        },
      };
    } catch (error) {
      console.error('Error fetching social media stats:', error);
      return {
        success: false,
        data: [],
        summary: {
          totalFollowers: 0,
          totalPosts: 0,
          avgEngagement: 0,
          platforms: 0,
        },
        error: 'Failed to fetch social media statistics',
      };
    }
  }),

  /**
   * Get statistics for a specific platform
   */
  getStatsByPlatform: publicProcedure
    .input(
      z.object({
        platform: z.enum(['facebook', 'twitter', 'youtube', 'instagram', 'tiktok']),
      })
    )
    .query(async ({ input }) => {
      try {
        const stats = await socialMediaManager.getStatsByPlatform(input.platform);
        if (!stats) {
          return {
            success: false,
            data: null,
            error: `Platform ${input.platform} not configured`,
          };
        }
        return {
          success: true,
          data: stats,
        };
      } catch (error) {
        console.error(`Error fetching ${input.platform} stats:`, error);
        return {
          success: false,
          data: null,
          error: `Failed to fetch ${input.platform} statistics`,
        };
      }
    }),

  /**
   * Get trending content across all platforms
   */
  getTrendingContent: publicProcedure
    .input(z.object({ limit: z.number().default(10).optional() }).optional())
    .query(async ({ input }) => {
      try {
        const limit = input?.limit || 10;
        const allPosts = await socialMediaManager.getAllPosts(limit * 2);

        // Sort by engagement (likes + shares + comments)
        const trending = allPosts
          .map((post) => ({
            ...post,
            engagement: post.likes + post.shares + post.comments,
          }))
          .sort((a, b) => b.engagement - a.engagement)
          .slice(0, limit);

        return {
          success: true,
          data: trending,
          count: trending.length,
        };
      } catch (error) {
        console.error('Error fetching trending content:', error);
        return {
          success: false,
          data: [],
          count: 0,
          error: 'Failed to fetch trending content',
        };
      }
    }),

  /**
   * Get platform overview
   */
  getPlatformOverview: publicProcedure.query(async () => {
    try {
      const stats = await socialMediaManager.getAllStats();
      const posts = await socialMediaManager.getAllPosts(3);

      const overview = stats.map((stat) => ({
        platform: stat.platform,
        followers: stat.followers,
        posts: stat.posts,
        engagement: stat.engagement,
        recentPosts: posts.filter((p) => p.platform === stat.platform.toLowerCase()).slice(0, 3),
      }));

      return {
        success: true,
        data: overview,
        totalPlatforms: overview.length,
      };
    } catch (error) {
      console.error('Error fetching platform overview:', error);
      return {
        success: false,
        data: [],
        totalPlatforms: 0,
        error: 'Failed to fetch platform overview',
      };
    }
  }),
});
