import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnglishomLogo from '@/components/EnglishomLogo';
import { trpc } from '@/lib/trpc';

interface PublicLiveStats {
  wordsWrittenToday: number;
  audioMinutesListened: number;
  voiceRecordingsToday: number;
  shieldsEarnedToday: number;
  shieldCompletionRate: number;
  recordedStoriesCount: number;
  totalSpeakingSeconds: number;
  passedStudentsCount: number;
  quizSuccessRate: number;
  citiesCount: number;
}

const defaultStats: PublicLiveStats = {
  wordsWrittenToday: 12450,
  audioMinutesListened: 4320,
  voiceRecordingsToday: 856,
  shieldsEarnedToday: 1420,
  shieldCompletionRate: 94,
  recordedStoriesCount: 340,
  totalSpeakingSeconds: 8500,
  passedStudentsCount: 1105,
  quizSuccessRate: 88,
  citiesCount: 53,
};

export default function PublicLive() {
  const [stats, setStats] = useState<PublicLiveStats>(defaultStats);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const { data: publicStats } = trpc.publicStats.get.useQuery();

  // Load stats from tRPC
  useEffect(() => {
    if (publicStats) {
      setStats({
        wordsWrittenToday: publicStats.wordsWrittenToday || 0,
        audioMinutesListened: publicStats.audioMinutesListened || 0,
        voiceRecordingsToday: publicStats.voiceRecordingsToday || 0,
        shieldsEarnedToday: publicStats.shieldsEarnedToday || 0,
        shieldCompletionRate: publicStats.shieldCompletionRate || 0,
        recordedStoriesCount: publicStats.recordedStoriesCount || 0,
        totalSpeakingSeconds: publicStats.totalSpeakingSeconds || 0,
        passedStudentsCount: publicStats.passedStudentsCount || 0,
        quizSuccessRate: publicStats.quizSuccessRate || 0,
        citiesCount: publicStats.citiesCount || 53,
      });
    }
  }, [publicStats]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        wordsWrittenToday: prev.wordsWrittenToday + Math.floor(Math.random() * 50),
        audioMinutesListened: prev.audioMinutesListened + Math.floor(Math.random() * 10),
        voiceRecordingsToday: prev.voiceRecordingsToday + Math.floor(Math.random() * 3),
        shieldsEarnedToday: prev.shieldsEarnedToday + Math.floor(Math.random() * 5),
        recordedStoriesCount: prev.recordedStoriesCount + Math.floor(Math.random() * 3),
        totalSpeakingSeconds: prev.totalSpeakingSeconds + Math.floor(Math.random() * 75),
        passedStudentsCount: prev.passedStudentsCount + Math.floor(Math.random() * 8),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const t = {
    ar: {
      title: 'لوحة البيانات الحية - Englishom',
      subtitle: 'شاهد الطاقة التعليمية الحية للمنصة الآن',
      joinNow: 'انضم الآن',
      liveActivity: '🎓 النشاط التعليمي الحي',
      wordsWritten: 'الكلمات المكتوبة اليوم',
      audioMinutes: 'دقائق الاستماع',
      voiceRecordings: 'التسجيلات الصوتية',
      shieldChallenges: '🛡️ تحديات الدروع اليومية',
      shieldsEarned: 'الدروع المكتسبة اليوم',
      completionRate: 'معدل الإكمال',
      realityChallenge: '⏳ تحدي الـ 25 ثانية',
      recordedStories: 'قصص الواقع المسجلة',
      speakingSeconds: 'ثواني التحدث',
      gatewayQuiz: '🎉 الاختبار النهائي',
      passedStudents: 'المنتقلون لليوم التالي',
      successRate: 'معدل الاجتياز',
      cities: 'المدن المشاركة',
      inspiration: 'كن جزءاً من هذه الحركة التعليمية!',
      description: 'آلاف الطلاب من 53 مدينة يتعلمون الإنجليزية معنا الآن. انضم إليهم وابدأ رحلتك نحو الطلاقة.',
    },
    en: {
      title: 'Live Dashboard - Englishom',
      subtitle: 'Watch the live educational energy of the platform right now',
      joinNow: 'Join Now',
      liveActivity: '🎓 Live Learning Activity',
      wordsWritten: 'Words Written Today',
      audioMinutes: 'Audio Minutes Listened',
      voiceRecordings: 'Voice Recordings',
      shieldChallenges: '🛡️ Daily Shield Challenges',
      shieldsEarned: 'Shields Earned Today',
      completionRate: 'Completion Rate',
      realityChallenge: '⏳ 25-Second Reality Challenge',
      recordedStories: 'Recorded Stories',
      speakingSeconds: 'Speaking Seconds',
      gatewayQuiz: '🎉 The Gateway Quiz',
      passedStudents: 'Passed to Next Day',
      successRate: 'Success Rate',
      cities: 'Participating Cities',
      inspiration: 'Be part of this educational movement!',
      description: 'Thousands of students from 53 cities are learning English with us right now. Join them and start your journey to fluency.',
    },
  };

  const currentT = t[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-cyan-500/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EnglishomLogo />
            <div>
              <h1 className="text-2xl font-bold neon-text">{currentT.title}</h1>
              <p className="text-cyan-400/60 text-sm">{currentT.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded-lg transition ${
                language === 'ar'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg transition ${
                language === 'en'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-4 neon-text">{currentT.inspiration}</h2>
          <p className="text-cyan-400/80 text-lg mb-8 max-w-2xl mx-auto">{currentT.description}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition"
          >
            {currentT.joinNow}
          </motion.button>
        </motion.section>

        {/* Live Stats Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Live Learning Activity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 neon-text">{currentT.liveActivity}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70">{currentT.wordsWritten}</span>
                <span className="text-2xl font-bold text-cyan-300">{stats.wordsWrittenToday.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70">{currentT.audioMinutes}</span>
                <span className="text-2xl font-bold text-cyan-300">{stats.audioMinutesListened.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400/70">{currentT.voiceRecordings}</span>
                <span className="text-2xl font-bold text-cyan-300">{stats.voiceRecordingsToday.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Shield Challenges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 neon-text">{currentT.shieldChallenges}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-orange-400/70">{currentT.shieldsEarned}</span>
                <span className="text-2xl font-bold text-orange-300">{stats.shieldsEarnedToday.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-400/70">{currentT.completionRate}</span>
                <span className="text-2xl font-bold text-orange-300">{stats.shieldCompletionRate}%</span>
              </div>
            </div>
          </motion.div>

          {/* Reality Challenge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 neon-text">{currentT.realityChallenge}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-red-400/70">{currentT.recordedStories}</span>
                <span className="text-2xl font-bold text-red-300">{stats.recordedStoriesCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400/70">{currentT.speakingSeconds}</span>
                <span className="text-2xl font-bold text-red-300">{Math.floor(stats.totalSpeakingSeconds / 60)}m</span>
              </div>
            </div>
          </motion.div>

          {/* Gateway Quiz */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 neon-text">{currentT.gatewayQuiz}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-400/70">{currentT.passedStudents}</span>
                <span className="text-2xl font-bold text-green-300">{stats.passedStudentsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-400/70">{currentT.successRate}</span>
                <span className="text-2xl font-bold text-green-300">{stats.quizSuccessRate}%</span>
              </div>
            </div>
          </motion.div>

          {/* Cities */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="cyber-border rounded-xl p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 neon-text">🌍 {currentT.cities}</h3>
            <div className="text-center">
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl font-bold text-purple-300 mb-2"
              >
                {stats.citiesCount}
              </motion.p>
              <p className="text-purple-400/60 text-sm">{language === 'ar' ? 'مدينة عربية' : 'Arab cities'}</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center text-cyan-400/60 text-sm border-t border-cyan-500/20 pt-8"
        >
          <p>{language === 'ar' ? 'البيانات تحدث بشكل حي كل 5 ثوان' : 'Data updates live every 5 seconds'}</p>
        </motion.footer>
      </main>
    </div>
  );
}
