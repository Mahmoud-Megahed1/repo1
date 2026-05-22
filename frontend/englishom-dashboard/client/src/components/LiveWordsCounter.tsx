import { useEffect, useState } from 'react';

export function LiveWordsCounter() {
  const [displayCount, setDisplayCount] = useState(0);
  const [targetCount] = useState(1240500);

  useEffect(() => {
    let currentCount = 0;
    const increment = Math.ceil(targetCount / 100);
    
    const interval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        setDisplayCount(targetCount);
        clearInterval(interval);
        // Restart animation after 5 seconds
        setTimeout(() => {
          currentCount = 0;
          setDisplayCount(0);
        }, 5000);
      } else {
        setDisplayCount(currentCount);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [targetCount]);

  const formattedCount = displayCount.toLocaleString('en-US');

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-cyan-500/30 overflow-hidden">
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-cyan-400">
            الكلمات المترجمة/المتعلمة الآن
          </h3>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        </div>
        
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 font-mono tracking-wider">
          {formattedCount}
        </div>
        
        <p className="text-xs text-gray-400 mt-3">
          تم التدرب على {formattedCount} كلمة اليوم
        </p>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
