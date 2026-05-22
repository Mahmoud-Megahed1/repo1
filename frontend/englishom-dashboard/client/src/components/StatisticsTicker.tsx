import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumberDisplay } from './NumberDisplay';

interface StatisticsTickerProps {
  language?: 'ar' | 'en';
}

export const StatisticsTicker: React.FC<StatisticsTickerProps> = ({ language = 'ar' }) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const tickerItems = language === 'ar' ? [
      '🎧 استماع إلى 4,300 جملة الآن...',
      '✍️ كتابة 12,000 كلمة اليوم...',
      '🛡️ 500 طالب حصلوا على الدرع اليوم...',
      '🎙️ 340 تحدي واقع مسجل اليوم...',
      '🎉 1,105 طالب انتقلوا لليوم التالي...',
      '⏳ 8,500 ثانية من التحدث بالإنجليزية...',
      '📊 معدل الاجتياز 88% من المحاولة الأولى...',
    ] : [
      '🎧 Listening to 4,300 sentences now...',
      '✍️ Writing 12,000 words today...',
      '🛡️ 500 students earned shields today...',
      '🎙️ 340 reality challenges recorded today...',
      '🎉 1,105 students advanced to next day...',
      '⏳ 8,500 seconds of English speaking...',
      '📊 88% first attempt success rate...',
    ];

    setItems(tickerItems);
  }, [language]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 overflow-hidden"
    >
      <div className="cyber-border rounded-lg bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm p-3 overflow-hidden">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="text-sm font-bold text-cyan-400 whitespace-nowrap">
            {language === 'ar' ? '📊 الإحصائيات الحية:' : '📊 Live Stats:'}
          </span>
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ['0%', '-100%'] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {[...items, ...items].map((item, index) => (
                <span key={index} className="text-sm text-cyan-300/80 flex-shrink-0">
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsTicker;
