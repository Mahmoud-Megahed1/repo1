import { BarChart2, Zap, Headphones, Lightbulb } from 'lucide-react';

export function AverageTestTime() {
  const testTimes = [
    { name: 'اختبار الكفاءة', time: '12 دقيقة', icon: <BarChart2 className="w-5 h-5 text-orange-400" /> },
    { name: 'اختبار السرعة', time: '8 دقائق', icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { name: 'اختبار الاستماع', time: '15 دقيقة', icon: <Headphones className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-orange-500/30 overflow-hidden">
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-orange-400 mb-4">
          متوسط وقت الاختبارات
        </h3>

        <div className="space-y-3">
          {testTimes.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl flex items-center">{test.icon}</span>
                <span className="text-sm text-gray-300">{test.name}</span>
              </div>
              <span className="text-sm font-semibold text-orange-400">{test.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
          <p className="text-xs text-gray-400">
            <Lightbulb className="w-4 h-4 text-yellow-400 inline-block mr-1" /> <span className="text-orange-300">نصيحة:</span> جرب الاختبارات الآن واختبر مستواك الحقيقي!
          </p>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
