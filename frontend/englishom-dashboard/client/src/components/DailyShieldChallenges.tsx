import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DailyShieldChallengesProps {
  language?: 'ar' | 'en';
}

export const DailyShieldChallenges: React.FC<DailyShieldChallengesProps> = ({ language = 'ar' }) => {
  const [shieldsEarned, setShieldsEarned] = useState(1420);
  const [displayShields, setDisplayShields] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShieldsEarned((prev) => prev + Math.floor(Math.random() * 5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(shieldsEarned / 30);
    const timer = setInterval(() => {
      if (current < shieldsEarned) {
        current += increment;
        setDisplayShields(Math.min(current, shieldsEarned));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [shieldsEarned]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="cyber-border-strong rounded-xl p-8 bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold neon-text">
            {language === 'ar' ? '🛡️ تحديات الدروع اليومية' : '🛡️ Daily Shield Challenges'}
          </h3>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            🛡️
          </motion.div>
        </div>

        <div className="mb-6">
          <p className="text-cyan-400/80 mb-4">
            {language === 'ar'
              ? '🎯 الالتزام اليومي: جلسة استماع وحفظ لـ 7 أسئلة يومية لتهيئة الطالب وكسر رهبة الاختبارات المستقبلية.'
              : '🎯 Daily Commitment: 7 daily questions for listening and memorization to prepare students and overcome test anxiety.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg p-6 border border-orange-500/30"
          >
            <p className="text-sm text-orange-400/70 mb-2">
              {language === 'ar' ? 'الدروع المكتسبة اليوم' : 'Shields Earned Today'}
            </p>
            <motion.p
              key={displayShields}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-orange-300 mb-2"
            >
              {displayShields.toLocaleString()}
            </motion.p>
            <p className="text-xs text-orange-400/60">
              {language === 'ar' ? 'طالباً حصدوا درع اليوم' : 'students earned shields today'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30"
          >
            <p className="text-sm text-purple-400/70 mb-2">
              {language === 'ar' ? 'معدل الإكمال' : 'Completion Rate'}
            </p>
            <motion.p
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-4xl font-bold text-purple-300 mb-2"
            >
              94%
            </motion.p>
            <p className="text-xs text-purple-400/60">
              {language === 'ar' ? 'من الطلاب أكملوا التحدي' : 'of students completed the challenge'}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyShieldChallenges;
