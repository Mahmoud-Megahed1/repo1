'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ExternalLink, Smartphone, Camera, Play, Circle, Facebook, Twitter } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
  link: string;
}

const SocialMediaFeed: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'facebook' | 'twitter' | 'instagram' | 'youtube'>('all');

  // Mock data - يتم استبدالها بـ API حقيقية لاحقاً
  useEffect(() => {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'twitter',
        content: 'تعلم اللغة الإنجليزية! انضم إلى آلاف الطلاب الذين حققوا أحلامهم.',
        author: '@englishom',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 1250,
        comments: 89,
        shares: 342,
        link: 'https://twitter.com/englishom',
      },
      {
        id: '2',
        platform: 'instagram',
        content: 'آخر درس: تحسين مهارات التحدث مع الخبراء',
        author: 'englishom',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 3450,
        comments: 234,
        shares: 567,
        link: 'https://instagram.com/englishom',
      },
      {
        id: '3',
        platform: 'facebook',
        content: 'هل تريد تحسين نطقك؟ اكتشف كيف يمكنك التحدث بطلاقة في 50 يوم فقط!',
        author: 'Platform',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 2100,
        comments: 156,
        shares: 423,
        link: 'https://facebook.com/englishom',
      },
      {
        id: '4',
        platform: 'youtube',
        content: 'فيديو جديد: أفضل 10 نصائح لتحسين نطقك الإنجليزي',
        author: 'Platform',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        likes: 5600,
        comments: 412,
        shares: 789,
        link: 'https://youtube.com/@englishom',
      },
    ];
    setPosts(mockPosts);
  }, []);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.platform === activeTab);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-400';
      case 'instagram':
        return 'bg-pink-500';
      case 'youtube':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getPlatformIcon = (platform: string): React.ReactNode => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      case 'instagram':
        return <Camera className="w-5 h-5" />;
      case 'youtube':
        return <Play className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'X';
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      default:
        return platform;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-cyan-500/30 p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-cyan-400" />
          <span>{typeof window !== 'undefined' && document.documentElement.lang === 'ar' ? 'مشاركات وسائل التواصل' : 'Social Media Feed'}</span>
        </h2>
        
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'facebook', 'twitter', 'instagram', 'youtube'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700 text-cyan-400 hover:bg-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid - مربعات يمين/يسار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            No posts available
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20 ${
                index % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${getPlatformColor(post.platform)} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-400">{getPlatformName(post.platform)}</p>
                    <p className="text-xs text-gray-400">{post.author}</p>
                  </div>
                </div>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 border-t border-cyan-500/10 pt-3">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 hover:text-red-400 transition-colors group">
                    <Heart size={16} className="group-hover:fill-red-400" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <MessageCircle size={16} />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                    <Share2 size={16} />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialMediaFeed;
