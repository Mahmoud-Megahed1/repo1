import React from 'react';
import { motion } from 'framer-motion';
import { useSocialMediaStats } from '@/hooks/useSocialMedia';
import { Users, MessageSquare, Share2, TrendingUp } from 'lucide-react';

interface SocialMediaStatsProps {
  language?: 'ar' | 'en';
}

export const SocialMediaStats: React.FC<SocialMediaStatsProps> = ({ language = 'ar' }) => {
  const { data, isLoading } = useSocialMediaStats();

  const translations = {
    ar: {
      title: 'إحصائيات المنصات الاجتماعية',
      followers: 'المتابعون',
      posts: 'المنشورات',
      engagement: 'معدل التفاعل',
      totalFollowers: 'إجمالي المتابعين',
      totalPosts: 'إجمالي المنشورات',
      avgEngagement: 'متوسط التفاعل',
    },
    en: {
      title: 'Social Media Statistics',
      followers: 'Followers',
      posts: 'Posts',
      engagement: 'Engagement Rate',
      totalFollowers: 'Total Followers',
      totalPosts: 'Total Posts',
      avgEngagement: 'Avg Engagement',
    },
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!data?.success || !data?.data) {
    return (
      <div className="text-center py-8 text-cyan-400/70">
        {language === 'ar' ? 'لم يتم العثور على بيانات' : 'No data available'}
      </div>
    );
  }

  const stats = data.data;
  const summary = data.summary;

  return (
    <div className="space-y-6">
      {/* Title */}
      <h3 className="text-2xl font-bold text-cyan-400 mb-6">{t.title}</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-400/70 text-sm">{t.totalFollowers}</p>
              <p className="text-3xl font-bold text-cyan-300 mt-2">
                {(summary?.totalFollowers || 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-cyan-500/50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400/70 text-sm">{t.totalPosts}</p>
              <p className="text-3xl font-bold text-yellow-300 mt-2">
                {(summary?.totalPosts || 0).toLocaleString()}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-yellow-500/50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400/70 text-sm">{t.avgEngagement}</p>
              <p className="text-3xl font-bold text-purple-300 mt-2">
                {(summary?.avgEngagement || 0).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500/50" />
          </div>
        </motion.div>
      </div>

      {/* Platform Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.platform}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-cyan-400">{stat.platform}</h4>
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70 text-sm">{t.followers}</span>
                <span className="text-cyan-300 font-semibold">
                  {stat.followers.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70 text-sm">{t.posts}</span>
                <span className="text-cyan-300 font-semibold">
                  {stat.posts.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70 text-sm">{t.engagement}</span>
                <span className="text-cyan-300 font-semibold">{stat.engagement.toFixed(1)}%</span>
              </div>

              <div className="pt-2 border-t border-cyan-500/10">
                <p className="text-xs text-cyan-400/50">
                  {language === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
                  {new Date(stat.lastUpdated).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaStats;
