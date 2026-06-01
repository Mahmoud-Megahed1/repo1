import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { NumberDisplay } from './NumberDisplay';
import { BarChart2, Headphones, PenTool, Shield, Mic, Award, Timer } from 'lucide-react';

interface StatisticsTickerProps {
  language?: 'ar' | 'en';
}

const iconClass = "w-4 h-4 inline-block mr-1 align-text-bottom";

export const StatisticsTicker: React.FC<StatisticsTickerProps> = ({ language = 'ar' }) => {
  const [items, setItems] = useState<ReactNode[]>([]);

  useEffect(() => {
    const tickerItems: ReactNode[] = language === 'ar' ? [
      <><Headphones className={iconClass} /> استماع إلى 4,300 جملة الآن...</>,
      <><PenTool className={iconClass} /> كتابة 12,000 كلمة اليوم...</>,
      <><Shield className={iconClass} /> 500 طالب حصلوا على الدرع اليوم...</>,
      <><Mic className={iconClass} /> 340 تحدي واقع مسجل اليوم...</>,
      <><Award className={iconClass} /> 1,105 طالب انتقلوا لليوم التالي...</>,
      <><Timer className={iconClass} /> 8,500 ثانية من التحدث بالإنجليزية...</>,
      <><BarChart2 className={iconClass} /> معدل الاجتياز 88% من المحاولة الأولى...</>,
    ] : [
      <><Headphones className={iconClass} /> Listening to 4,300 sentences now...</>,
      <><PenTool className={iconClass} /> Writing 12,000 words today...</>,
      <><Shield className={iconClass} /> 500 students earned shields today...</>,
      <><Mic className={iconClass} /> 340 reality challenges recorded today...</>,
      <><Award className={iconClass} /> 1,105 students advanced to next day...</>,
      <><Timer className={iconClass} /> 8,500 seconds of English speaking...</>,
      <><BarChart2 className={iconClass} /> 88% first attempt success rate...</>,
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
          <span className="text-sm font-bold text-cyan-400 whitespace-nowrap flex items-center gap-1">
            <BarChart2 className="w-4 h-4" /> {language === 'ar' ? 'الإحصائيات الحية:' : 'Live Stats:'}
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
                <span key={index} className="text-sm text-cyan-300/80 flex-shrink-0 flex items-center">
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
