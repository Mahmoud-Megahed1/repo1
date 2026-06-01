import React, { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Keyboard, Headphones, Mic } from 'lucide-react';

interface LiveLearningActivityProps {
  language?: 'ar' | 'en';
}

export const LiveLearningActivity: React.FC<LiveLearningActivityProps> = ({ language = 'ar' }) => {
  const [wordsWritten, setWordsWritten] = useState(12450);
  const [audioMinutes, setAudioMinutes] = useState(4320);
  const [voiceRecordings, setVoiceRecordings] = useState(856);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordsWritten((prev) => prev + Math.floor(Math.random() * 50));
      setAudioMinutes((prev) => prev + Math.floor(Math.random() * 10));
      setVoiceRecordings((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: language === 'ar' ? 'الكلمات المكتوبة اليوم' : 'Words Written Today',
      value: wordsWritten,
      icon: <Keyboard className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: language === 'ar' ? 'دقائق الاستماع' : 'Audio Minutes Listened',
      value: audioMinutes,
      icon: <Headphones className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: language === 'ar' ? 'التسجيلات الصوتية' : 'Voice Recordings Today',
      value: voiceRecordings,
      icon: <Mic className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <h3 className="text-2xl font-bold mb-6 neon-text flex items-center gap-2">
        <GraduationCap className="w-6 h-6" /> {language === 'ar' ? 'النشاط التعليمي الحي' : 'Live Learning Activity'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`cyber-border rounded-xl p-6 bg-gradient-to-br ${stat.color} bg-opacity-10 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <div className="text-right">
                <p className="text-sm text-cyan-400/70 mb-1">{stat.label}</p>
                <motion.p
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-cyan-300"
                >
                  {stat.value.toLocaleString()}
                </motion.p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LiveLearningActivity;
