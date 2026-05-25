import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Globe, Activity, CheckCircle, Headphones, Mic, Shield } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface StatItem {
  id: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  unit?: string;
}

interface LiveStatsProps {
  language?: 'ar' | 'en';
}

const LiveStats: React.FC<LiveStatsProps> = ({ language = 'ar' }) => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isArabic = language === 'ar';

  const { data: publicStats, isLoading: isTrpcLoading } = trpc.publicStats.get.useQuery(undefined, {
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!publicStats) return;

    const realStats: StatItem[] = [
      {
        id: 'words-written',
        label: isArabic ? 'كلمات كُتبت اليوم' : 'Words Written Today',
        value: publicStats.wordsWrittenToday || 0,
        icon: <Activity className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
        unit: isArabic ? 'كلمة' : 'words',
      },
      {
        id: 'passed-students',
        label: isArabic ? 'الطلاب المجتازين' : 'Passed Students',
        value: publicStats.passedStudentsCount || 0,
        icon: <CheckCircle className="w-6 h-6" />,
        color: 'from-blue-500 to-cyan-600',
        unit: isArabic ? 'طالب' : 'student',
      },
      {
        id: 'audio-minutes',
        label: isArabic ? 'دقائق الاستماع' : 'Audio Minutes',
        value: publicStats.audioMinutesListened || 0,
        icon: <Headphones className="w-6 h-6" />,
        color: 'from-purple-500 to-pink-600',
        unit: isArabic ? 'دقيقة' : 'min',
      },
      {
        id: 'shields-earned',
        label: isArabic ? 'الدروع المكتسبة اليوم' : 'Shields Earned',
        value: publicStats.shieldsEarnedToday || 0,
        icon: <Shield className="w-6 h-6" />,
        color: 'from-orange-500 to-red-600',
        unit: isArabic ? 'درع' : 'shield',
      },
    ];

    setStats(realStats);
    setIsLoading(false);
  }, [publicStats, isArabic]);

  const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => (
    <div className={`bg-gradient-to-br ${stat.color} p-0.5 rounded-lg shadow-lg`}>
      <div className="bg-slate-900 rounded-lg p-6 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-cyan-400`}>{stat.icon}</div>
          {stat.trend !== undefined && (
            <div className={`text-sm font-semibold ${stat.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stat.trend >= 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-cyan-400">
            {stat.value.toLocaleString()}
          </p>
          {stat.unit && <p className="text-gray-500 text-xs">{stat.unit}</p>}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-slate-700 rounded mb-4"></div>
            <div className="h-10 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
          <span className="text-3xl">📊</span>
          <span>{isArabic ? 'إحصائيات البث الحي' : 'Live Statistics'}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          {isArabic ? 'مقاييس النظام الفعلية' : 'Real-time platform metrics'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
        <p className="text-cyan-400 text-sm font-semibold mb-2">
          {isArabic ? '💡 التحديثات الحية' : '💡 Live Updates'}
        </p>
        <p className="text-gray-400 text-xs">
          {isArabic 
            ? 'يتم تحديث هذه الإحصائيات في الوقت الفعلي من خلال لوحة التحكم الخاصة بالإدارة.'
            : 'These statistics are updated in real-time through the admin control panel.'}
        </p>
      </div>
    </div>
  );
};

export default LiveStats;
