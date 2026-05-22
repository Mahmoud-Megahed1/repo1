import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RealityChallengeProps {
  language?: 'ar' | 'en';
}

export const RealityChallenge: React.FC<RealityChallengeProps> = ({ language = 'ar' }) => {
  const [recordedStories, setRecordedStories] = useState(340);
  const [totalSeconds, setTotalSeconds] = useState(8500);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecordedStories((prev) => prev + Math.floor(Math.random() * 3));
      setTotalSeconds((prev) => prev + Math.floor(Math.random() * 75));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let current = 0;
    const increment = Math.ceil(totalSeconds / 40);
    const timer = setInterval(() => {
      if (current < totalSeconds) {
        current += increment;
        setDisplaySeconds(Math.min(current, totalSeconds));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [totalSeconds]);

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="cyber-border-strong rounded-xl p-8 bg-gradient-to-br from-red-900/20 to-pink-900/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold neon-text">
            {language === 'ar' ? '⏳ تحدي واقع اليوم - الـ 25 ثانية' : '⏳ Today\'s Reality Challenge - 25 Seconds'}
          </h3>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl"
          >
            🎙️
          </motion.div>
        </div>

        <p className="text-cyan-400/80 mb-6">
          {language === 'ar'
            ? '📝 اكتب قصة يومك بصوتك: 25 ثانية من التحدث بالإنجليزية لوصف واقع يومك وتحسين مهارات التحدث.'
            : '📝 Tell your daily story in your voice: 25 seconds of English speaking to describe your day and improve speaking skills.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg p-6 border border-red-500/30"
          >
            <p className="text-sm text-red-400/70 mb-2">
              {language === 'ar' ? 'قصص الواقع المسجلة' : 'Recorded Reality Stories'}
            </p>
            <motion.p
              key={recordedStories}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-red-300 mb-2"
            >
              {recordedStories.toLocaleString()}
            </motion.p>
            <p className="text-xs text-red-400/60">
              {language === 'ar' ? 'تحدي واقع مسجل اليوم' : 'reality challenges recorded today'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg p-6 border border-pink-500/30"
          >
            <p className="text-sm text-pink-400/70 mb-2">
              {language === 'ar' ? 'إجمالي ثواني التحدث' : 'Total Speaking Seconds'}
            </p>
            <motion.p
              key={displaySeconds}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold text-pink-300 mb-2"
            >
              {formatSeconds(displaySeconds)}
            </motion.p>
            <p className="text-xs text-pink-400/60">
              {language === 'ar' ? 'من التحدث بالإنجليزية اليوم' : 'of English speaking today'}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealityChallenge;
