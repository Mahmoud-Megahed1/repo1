import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NumberDisplay } from './NumberDisplay';

interface LevelStats {
  level: 'A1' | 'A2' | 'B1' | 'B2';
  words: number;
  color: string;
}

export function LiveWordsCounterByLevel() {
  const [stats, setStats] = useState<LevelStats[]>([
    { level: 'A1', words: 450, color: 'from-green-500 to-emerald-500' },
    { level: 'A2', words: 380, color: 'from-blue-500 to-cyan-500' },
    { level: 'B1', words: 280, color: 'from-purple-500 to-pink-500' },
    { level: 'B2', words: 130, color: 'from-orange-500 to-red-500' },
  ]);

  const [displayStats, setDisplayStats] = useState<Record<string, number>>({
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
  });

  useEffect(() => {
    // Animate counters
    const intervals = stats.map((stat) => {
      let currentCount = 0;
      const increment = Math.ceil(stat.words / 50);

      return setInterval(() => {
        currentCount += increment;
        if (currentCount >= stat.words) {
          setDisplayStats((prev) => ({ ...prev, [stat.level]: stat.words }));
          clearInterval(intervals[stats.findIndex((s) => s.level === stat.level)]);
        } else {
          setDisplayStats((prev) => ({ ...prev, [stat.level]: currentCount }));
        }
      }, 30);
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [stats]);

  const totalWords = stats.reduce((sum, stat) => sum + stat.words, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-cyan-500/30 overflow-hidden"
    >
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-cyan-400">
            الكلمات المتعلمة الآن
          </h3>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        </div>

        {/* Total Count */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="text-4xl">
            <NumberDisplay value={totalWords} variant="gradient" size="4xl" />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            إجمالي الكلمات المتعلمة عبر جميع المستويات
          </p>
        </motion.div>

        {/* Level Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              className={`bg-gradient-to-br ${stat.color} bg-opacity-10 rounded-lg p-3 border border-${stat.color.split('-')[1]}-500/30`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{stat.level}</span>
                <span className="text-xs text-gray-300">
                  {Math.round((stat.words / totalWords) * 100)}%
                </span>
              </div>
              <div className="text-lg">
                <NumberDisplay value={displayStats[stat.level]} variant="default" size="lg" />
              </div>
              <p className="text-xs text-gray-400 mt-1">كلمة</p>

              {/* Progress bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stat.words / totalWords) * 100}%` }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info text */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          توزيع الكلمات المتعلمة حسب المستويات اللغوية
        </p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

export default LiveWordsCounterByLevel;
