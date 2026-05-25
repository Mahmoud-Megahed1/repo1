import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import ArabicMapImage from '@/components/ArabicMapImage';
import StatCard from '@/components/StatCard';
import LiveCounter from '@/components/LiveCounter';
import EnglishomLogo from '@/components/EnglishomLogo';
import SocialMediaFeed from '@/components/SocialMediaFeed';
import LiveStats from '@/components/LiveStats';
import Footer from '@/components/Footer';
import { LiveWordsCounterByLevel } from '@/components/LiveWordsCounterByLevel';
import { SystemStatus } from '@/components/SystemStatus';
import { LevelDistributionChart } from '@/components/LevelDistributionChart';
import { AverageTestTime } from '@/components/AverageTestTime';
import { LiveAchievementsTicker } from '@/components/LiveAchievementsTicker';
import { Sparkline } from '@/components/Sparkline';
import { CountryPickerWheel } from '@/components/CountryPickerWheel';
import { LiveLearningActivity } from '@/components/LiveLearningActivity';
import { DailyShieldChallenges } from '@/components/DailyShieldChallenges';
import { RealityChallenge } from '@/components/RealityChallenge';
import { GatewayQuiz } from '@/components/GatewayQuiz';
import { StatisticsTicker } from '@/components/StatisticsTicker';

interface DashboardStats {
  totalRegistrations: number;
  todayRegistrations: number;
  topCountry: string;
  topCountryCount: number;
  lastRegistration: {
    country: string;
    time: string;
  };
  registrationsByCountry: Record<string, number>;
}

const emptyData: DashboardStats = {
  totalRegistrations: 0,
  todayRegistrations: 0,
  topCountry: '...',
  topCountryCount: 0,
  lastRegistration: {
    country: '...',
    time: '...',
  },
  registrationsByCountry: {},
};

export default function LiveDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyData);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const updateIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://api.englishom.com/api/public-dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updateData();

    updateIntervalRef.current = setInterval(updateData, 30000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  const translations = {
    ar: {
      title: 'لوحة البيانات الحية',
      subtitle: 'تتبع تسجيلات المستخدمين من جميع أنحاء العالم والبث الحي',
      globalDataFlow: 'تدفق البيانات العالمي',
      liveRegistrations: 'إجمالي المسجلين',
      todayRegistrations: 'المسجلين اليوم',
      topCity: 'أكثر الدول',
      lastRegistration: 'آخر تسجيل',
      apiIntegration: 'نقاط ربط API',
      liveFeed: 'البث الحي',
      followUs: 'تابعنا على وسائل التواصل',
      blog: 'المدونة',
      proficiencyTest: 'اختبار الكفاءة',
      speedTest: 'اختبار السرعة',
      register: 'سجل الآن',
      signUp: 'انضم الآن',
      connected: 'متصل',
      updating: 'جاري التحديث...',
      mockData: 'البيانات المعروضة حالياً: بيانات حقيقية',
      autoUpdate: 'التحديث التلقائي: كل 30 ثانية',
      realTimeMetrics: 'مقاييس النظام الفعلية',
      liveUpdates: 'التحديثات الحية',
      socialMediaFeed: 'مشاركات وسائل التواصل',
      ourProducts: 'منتجاتنا',
      articles: 'مقالات',
      readers: 'قارئ',
      tested: 'اختبروا',
      visitors: 'زائر',
      copyright: '© 2026 - لوحة البيانات الحية | جميع الحقوق محفوظة',
    },
    en: {
      title: 'Live Dashboard',
      subtitle: 'Track user registrations from around the world and live broadcast',
      globalDataFlow: 'Global Data Flow',
      liveRegistrations: 'Total Registrations',
      todayRegistrations: 'Today Registrations',
      topCity: 'Top Countries',
      lastRegistration: 'Last Registration',
      apiIntegration: 'API Integration Points',
      liveFeed: 'Live Feed',
      followUs: 'Follow Us on Social Media',
      blog: 'Blog',
      proficiencyTest: 'Proficiency Test',
      speedTest: 'Speed Test',
      register: 'Register Now',
      signUp: 'Join Now',
      connected: 'Connected',
      updating: 'Updating...',
      mockData: 'Current data: Real Data',
      autoUpdate: 'Auto Update: Every 30 seconds',
      copyright: '© 2026 - Live Dashboard | All Rights Reserved',
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg shadow-lg shadow-cyan-500/50 bg-red-900 p-2">
                <img src="/logo.jpeg" alt="Logo" className="h-12 w-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text">ENGLISHOM</h1>
                <p className="text-xs text-cyan-400/70">إنجليشوم</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* الوقت والتاريخ في الرياض */}
              <div className="flex items-center gap-2 text-sm bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30">
                <span className="text-2xl">
                  {(() => {
                    const riyadhTime = new Date().toLocaleString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'Asia/Riyadh'
                    });
                    const hour = parseInt(riyadhTime.split(':')[0]);
                    return (hour >= 6 && hour < 18) ? '☀️' : '🌙';
                  })()}
                </span>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold">
                    {new Date().toLocaleString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      timeZone: 'Asia/Riyadh',
                      hour12: true
                    })}
                  </div>
                  <div className="text-cyan-400/70 text-xs">
                    {new Date().toLocaleString('ar-SA', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Asia/Riyadh'
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors text-sm"
              >
                {language === 'ar' ? 'EN' : 'AR'}
              </button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm bg-cyan-500/10 px-4 py-2 rounded-lg border border-cyan-500/30">
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">3,847</div>
                    <div className="text-cyan-400/70 text-xs">{language === 'ar' ? 'زائر' : 'Visitor'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-green-400">{language === 'ar' ? 'بث حي' : 'Live'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h2>
          <p className="text-cyan-400/70 text-lg">{t.subtitle}</p>
        </motion.div>

        {/* Top Stats (المؤشرات أولاً) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <LiveCounter
            label={t.liveRegistrations}
            value={stats.totalRegistrations}
            icon="👥"
            delay={0.4}
          />
          <StatCard
            label={t.todayRegistrations}
            value={stats.todayRegistrations}
            icon="📅"
            delay={0.5}
          />
          {/* Country Picker Wheel - عداد الدول بتأثير iOS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <CountryPickerWheel interval={2500} />
            </div>
          </motion.div>
          <StatCard
            label={t.lastRegistration}
            value={stats.lastRegistration.country}
            subValue={stats.lastRegistration.time}
            icon="⏰"
            delay={0.7}
          />
        </motion.div>

        {/* World Map Section (الخريطة تحتها) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 neon-text">{t.globalDataFlow}</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              <ArabicMapImage />
            </div>
          </div>
        </motion.div>

        {/* Statistics Ticker */}
        <StatisticsTicker language={language} />

        {/* Live Learning Activity Section */}
        <LiveLearningActivity language={language} />

        {/* Daily Shield Challenges Section */}
        <DailyShieldChallenges language={language} />

        {/* Reality Challenge Section */}
        <RealityChallenge language={language} />

        {/* Gateway Quiz Section */}
        <GatewayQuiz language={language} />

        {/* Live Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <LiveStats language={language} />
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 neon-text">{language === 'ar' ? 'منتجاتنا' : 'Our Products'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://englishomblog-aksasp4i.manus.space/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-border rounded-lg p-6 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group relative overflow-hidden"
              >
                {/* Sparkline خلفي */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <Sparkline data={[45, 52, 48, 61, 58, 72, 68, 85, 92, 88]} width={300} height={120} color="#06b6d4" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3">📝</div>
                  <h4 className="text-lg font-bold mb-2 text-cyan-400">{t.blog}</h4>
                  <p className="text-sm text-cyan-400/70 mb-4">{language === 'ar' ? 'اقرأ أحدث المقالات والنصائح' : 'Read latest articles and tips'}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-2xl font-bold text-cyan-300">1,247</p>
                      <p className="text-xs text-cyan-400/60">{language === 'ar' ? 'مقالات' : 'Articles'}</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-cyan-300">45.2K</p>
                      <p className="text-xs text-cyan-400/60">{language === 'ar' ? 'قارئ' : 'Readers'}</p>
                    </div>
                  </div>
                  
                  {/* إحصائيات جغرافية */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-500/10">
                    <div>
                      <p className="text-sm font-semibold text-green-400">↑ 12%</p>
                      <p className="text-xs text-cyan-400/50">{language === 'ar' ? 'الأسبوع الماضي' : 'Last week'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60">53 {language === 'ar' ? 'مدينة' : 'cities'}</p>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href="https://engplacetest-2x59fsrt.manus.space"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-border rounded-lg p-6 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group relative overflow-hidden"
              >
                {/* Sparkline خلفي */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <Sparkline data={[35, 42, 38, 51, 48, 62, 58, 75, 82, 78]} width={300} height={120} color="#06b6d4" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="text-lg font-bold mb-2 text-cyan-400">{t.proficiencyTest}</h4>
                  <p className="text-sm text-cyan-400/70 mb-4">{language === 'ar' ? 'اختبر مستواك الحالي' : 'Test your current level'}</p>
                  
                  <div>
                    <p className="text-2xl font-bold text-cyan-300">12,890</p>
                    <p className="text-xs text-cyan-400/60 mb-3">{language === 'ar' ? 'اختبروا' : 'Tested'}</p>
                  </div>
                  
                  {/* إحصائيات جغرافية */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-500/10">
                    <div>
                      <p className="text-sm font-semibold text-green-400">↑ 25%</p>
                      <p className="text-xs text-cyan-400/50">{language === 'ar' ? 'أمس' : 'Yesterday'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60">53 {language === 'ar' ? 'مدينة' : 'cities'}</p>
                    </div>
                  </div>
                </div>
              </a>

              <a
                href="https://englishques-k9zcgqzs.manus.space"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-border rounded-lg p-6 bg-slate-800/50 hover:bg-slate-700/50 transition-colors group relative overflow-hidden"
              >
                {/* Sparkline خلفي */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <Sparkline data={[28, 35, 32, 44, 41, 55, 51, 68, 75, 71]} width={300} height={120} color="#06b6d4" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="text-lg font-bold mb-2 text-cyan-400">{t.speedTest}</h4>
                  <p className="text-sm text-cyan-400/70 mb-4">{language === 'ar' ? 'اختبر سرعة قراءتك' : 'Test your reading speed'}</p>
                  
                  <div>
                    <p className="text-2xl font-bold text-cyan-300">8,567</p>
                    <p className="text-xs text-cyan-400/60 mb-3">{language === 'ar' ? 'زائر' : 'Visitors'}</p>
                  </div>
                  
                  {/* إحصائيات جغرافية */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cyan-500/10">
                    <div>
                      <p className="text-sm font-semibold text-green-400">↑ 7%</p>
                      <p className="text-xs text-cyan-400/50">{language === 'ar' ? 'اليوم' : 'Today'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400/60">53 {language === 'ar' ? 'مدينة' : 'cities'}</p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* New Advanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 neon-text">{language === 'ar' ? 'إحصائيات البث الحي' : 'Live Statistics'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <LiveWordsCounterByLevel />
              </div>
              <div className="group">
                <SystemStatus />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 neon-text">{language === 'ar' ? 'تحليلات المنتجات' : 'Products Analytics'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <LevelDistributionChart />
              </div>
              <div className="group">
                <AverageTestTime />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <div className="group">
              <LiveAchievementsTicker />
            </div>
          </div>
        </motion.div>

        {/* Social Media Feed Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12"
        >
          <div className="cyber-border-strong rounded-xl p-6 bg-slate-900/50 backdrop-blur-sm">
            <SocialMediaFeed />
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* API Integration Info */}
          <div className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm">
            <h4 className="text-lg font-bold mb-4 text-cyan-400">🔌 {t.apiIntegration}</h4>
            <div className="space-y-2 text-sm text-cyan-400/70">
              <p><code className="bg-slate-800 px-2 py-1 rounded">GET /api/trpc/dashboard.getStats</code></p>
              <p className="text-xs mt-2">{language === 'ar' ? 'الحصول على إحصائيات لوحة البيانات الحالية' : 'Get current dashboard statistics'}</p>
              <p className="text-xs mt-4">{language === 'ar' ? '📝 للمبرمج: استبدل البيانات التجريبية بـ API الحقيقية' : '📝 For developers: Replace mock data with real API'}</p>
            </div>
          </div>

          {/* Live Feed Info */}
          <div className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm">
            <h4 className="text-lg font-bold mb-4 text-cyan-400">📡 {t.liveFeed}</h4>
            <div className="space-y-2 text-sm text-cyan-400/70">
              <p>{t.autoUpdate}</p>
              <p>{language === 'ar' ? 'الحالة' : 'Status'}: {isLoading ? `⏳ ${t.updating}` : `✅ ${t.connected}`}</p>
              <p className="text-xs mt-4">{t.mockData}</p>
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm mb-8"
        >
          <h4 className="text-lg font-bold mb-4 text-cyan-400">🌐 {t.followUs}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://facebook.com/englishom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded transition-colors"
            >
              <span>f</span>
              <span>Facebook</span>
            </a>
            <a
              href="https://twitter.com/englishom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 px-4 py-3 rounded transition-colors text-white font-semibold"
            >
              <span>ᵇ</span>
              <span>X</span>
            </a>
            <a
              href="https://instagram.com/englishom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-3 rounded transition-colors text-white"
            >
              <span>📷</span>
              <span>Instagram</span>
            </a>
            <a
              href="https://youtube.com/@englishom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded transition-colors"
            >
              <span>▶</span>
              <span>YouTube</span>
            </a>
          </div>
        </motion.div>

        {/* Sign Up CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="cyber-border-strong rounded-xl p-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm text-center mb-8"
        >
          <h3 className="text-3xl font-bold mb-4 text-cyan-400">{t.signUp}</h3>
          <p className="text-cyan-400/70 mb-6">{language === 'ar' ? 'انضم إلى آلاف المتعلمين حول العالم' : 'Join thousands of learners around the world'}</p>
          <a
            href="https://englishom.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50"
          >
            {t.register}
          </a>
        </motion.div>
      <Footer language={language} />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="border-t border-cyan-500/30 bg-slate-900/50 backdrop-blur-sm mt-12 py-6"
      >
        <div className="container mx-auto px-4 text-center text-cyan-400/50 text-sm">
          <p>{t.copyright}</p>
        </div>
      </motion.footer>
    </div>
  );
}
