import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GatewayQuizProps {
  language?: 'ar' | 'en';
}

export const GatewayQuiz: React.FC<GatewayQuizProps> = ({ language = 'ar' }) => {
  const [passedStudents, setPassedStudents] = useState(1105);
  const [successRate, setSuccessRate] = useState(88);
  const [displayPassed, setDisplayPassed] = useState(0);
  const [displayRate, setDisplayRate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassedStudents((prev) => prev + Math.floor(Math.random() * 8));
      setSuccessRate((prev) => Math.min(prev + Math.random() * 0.5, 95));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(passedStudents / 35);
    const timer = setInterval(() => {
      if (current < passedStudents) {
        current += increment;
        setDisplayPassed(Math.min(current, passedStudents));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [passedStudents]);

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      if (current < successRate) {
        current += 0.5;
        setDisplayRate(Math.min(current, successRate));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [successRate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="cyber-border-strong rounded-xl p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold neon-text">
            {language === 'ar' ? '🎉 الاختبار النهائي والانتقال' : '🎉 The Gateway Quiz'}
          </h3>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl"
          >
            🎯
          </motion.div>
        </div>

        <p className="text-cyan-400/80 mb-6">
          {language === 'ar'
            ? '🔐 الاختبار النهائي: 15 سؤالاً للانتقال لليوم التالي - يثبت مدى جدية المنصة وكفاءة الطلاب.'
            : '🔐 The Final Quiz: 15 questions to advance to the next day - proving platform seriousness and student competency.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30"
          >
            <p className="text-sm text-green-400/70 mb-2">
              {language === 'ar' ? 'المنتقلون لليوم التالي' : 'Passed to Next Day'}
            </p>
            <motion.p
              key={displayPassed}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-green-300 mb-2"
            >
              {displayPassed.toLocaleString()}
            </motion.p>
            <p className="text-xs text-green-400/60">
              {language === 'ar' ? 'طالباً اجتازوا الاختبار النهائي بنجاح' : 'students passed the final quiz successfully'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg p-6 border border-teal-500/30"
          >
            <p className="text-sm text-teal-400/70 mb-2">
              {language === 'ar' ? 'معدل الاجتياز من المحاولة الأولى' : 'First Attempt Success Rate'}
            </p>
            <div className="flex items-baseline gap-2">
              <motion.p
                key={Math.floor(displayRate)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-teal-300"
              >
                {Math.floor(displayRate)}%
              </motion.p>
            </div>
            <p className="text-xs text-teal-400/60 mt-2">
              {language === 'ar' ? 'معدل الاجتياز الإجمالي' : 'overall success rate'}
            </p>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${displayRate}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GatewayQuiz;
