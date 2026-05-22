import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Globe, Activity } from 'lucide-react';

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

  useEffect(() => {
    // Mock data
    const mockStats: StatItem[] = [
      {
        id: 'active-now',
        label: isArabic ? 'نشط الآن' : 'Active Now',
        value: 2847,
        icon: <Activity className="w-6 h-6" />,
        color: 'from-green-500 to-emerald-600',
        trend: 12,
        unit: isArabic ? 'مستخدم' : 'users',
      },
      {
        id: 'total-users',
        label: isArabic ? 'إجمالي المستخدمين' : 'Total Users',
        value: 24981,
        icon: <Users className="w-6 h-6" />,
        color: 'from-blue-500 to-cyan-600',
        trend: 8,
        unit: isArabic ? 'مسجل' : 'registered',
      },
      {
        id: 'daily-registrations',
        label: isArabic ? 'التسجيلات اليوم' : 'Today\'s Registrations',
        value: 342,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'from-purple-500 to-pink-600',
        trend: 15,
        unit: isArabic ? 'مستخدم جديد' : 'new users',
      },
      {
        id: 'countries',
        label: isArabic ? 'الدول' : 'Countries',
        value: 198,
        icon: <Globe className="w-6 h-6" />,
        color: 'from-orange-500 to-red-600',
        trend: 3,
        unit: isArabic ? 'دولة' : 'countries',
      },
    ];

    setStats(mockStats);
    setIsLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prevStats) =>
        prevStats.map((stat) => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 5) - 2,
          trend: stat.trend ? stat.trend + Math.floor(Math.random() * 3) - 1 : undefined,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isArabic]);

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
            ? 'يتم تحديث هذه الإحصائيات في الوقت الفعلي. يتم تحديث البيانات كل 3 ثوان لعرض أحدث نشاط على المنصة.'
            : 'These statistics are updated in real-time. Data is refreshed every 3 seconds to show the latest platform activity.'}
        </p>
      </div>
    </div>
  );
};

export default LiveStats;
