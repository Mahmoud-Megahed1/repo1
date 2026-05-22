import React from 'react';
import { motion } from 'framer-motion';
import { useTrendingContent } from '@/hooks/useSocialMedia';
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';

interface TrendingContentProps {
  language?: 'ar' | 'en';
  limit?: number;
}

export const TrendingContent: React.FC<TrendingContentProps> = ({ language = 'ar', limit = 10 }) => {
  const { data, isLoading } = useTrendingContent(limit);

  const translations = {
    ar: {
      title: 'المحتوى الشائع',
      likes: 'إعجاب',
      comments: 'تعليق',
      shares: 'مشاركة',
      viewMore: 'عرض المزيد',
      noData: 'لا يوجد محتوى شائع',
    },
    en: {
      title: 'Trending Content',
      likes: 'Likes',
      comments: 'Comments',
      shares: 'Shares',
      viewMore: 'View More',
      noData: 'No trending content',
    },
  };

  const t = translations[language];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'from-blue-600 to-blue-400';
      case 'twitter':
        return 'from-black to-gray-600';
      case 'youtube':
        return 'from-red-600 to-red-400';
      case 'instagram':
        return 'from-pink-600 to-purple-600';
      case 'tiktok':
        return 'from-black to-pink-600';
      default:
        return 'from-cyan-600 to-blue-600';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      facebook: '👍',
      twitter: '🐦',
      youtube: '📺',
      instagram: '📸',
      tiktok: '🎵',
    };
    return icons[platform] || '📱';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!data?.success || !data?.data || data.data.length === 0) {
    return (
      <div className="text-center py-8 text-cyan-400/70">
        {t.noData}
      </div>
    );
  }

  const trendingPosts = data.data;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h3 className="text-2xl font-bold text-cyan-400 mb-6">{t.title}</h3>

      {/* Trending Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trendingPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
          >
            {/* Background gradient by platform */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlatformColor(post.platform)} opacity-5`}></div>

            {/* Content */}
            <div className="relative p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                  <div>
                    <p className="text-sm font-semibold text-cyan-400 capitalize">{post.platform}</p>
                    <p className="text-xs text-cyan-400/50">{post.author}</p>
                  </div>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </a>
              </div>

              {/* Content Text */}
              <p className="text-sm text-cyan-300 line-clamp-3">{post.content}</p>

              {/* Media if available */}
              {post.mediaUrl && (
                <div className="rounded-lg overflow-hidden h-32 bg-cyan-500/10 border border-cyan-500/20">
                  <img
                    src={post.mediaUrl}
                    alt={post.content}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-cyan-500/10">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 text-red-400">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-cyan-400/50">
                  {new Date(post.timestamp).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingContent;
