import { useEffect, useState } from 'react';
import { Award, Flame, Zap, Sparkles, Rocket, Trophy, FileText, Video, Megaphone } from 'lucide-react';

interface Achievement {
  id: number;
  text: string;
  icon: React.ReactNode;
}

const achievements: Achievement[] = [
  {
    id: 1,
    text: 'أحمد م. من السعودية اجتاز لتوه اختبار المستوى المتوسط بنسبة 92%',
    icon: <Award className="w-6 h-6 text-yellow-400" />,
  },
  {
    id: 2,
    text: 'سارة ع. أكملت الآن 10 أيام متتالية من التعلم المستمر',
    icon: <Flame className="w-6 h-6 text-orange-500" />,
  },
  {
    id: 3,
    text: 'محمد من مصر اكمل 20 يوم متتالية في غضون 7 أيام، أسرع من الخطة',
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
  },
  {
    id: 4,
    text: 'عبدالجليل من عمان اجتاز لتوه اختبار الكفاءة في مستوى A1 بنسبة 91%',
    icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 5,
    text: 'إلهام من العراق استطاعت اجتياز 21 يوم من الدراسة والإنجاز في 8 أيام',
    icon: <Rocket className="w-6 h-6 text-purple-400" />,
  },
  {
    id: 6,
    text: 'علي من سوريا أتم أيام الكورس الـ 50 يوم بنجاح وحصل على الشهادة',
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
  },
  {
    id: 7,
    text: 'مقال جديد في المدونة يتحدث عن عبارات المحادثة اليومية الأساسية',
    icon: <FileText className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 8,
    text: 'مقطع جديد في يوتيوب يشرح الطريق المثلى للتعامل مع المنصة',
    icon: <Video className="w-6 h-6 text-red-500" />,
  },
  {
    id: 9,
    text: 'تغريدة جديدة اليوم تتحدث عن ما نظمناه لك عند التحاق بكورس الطلاقة في 50 يوم',
    icon: <Megaphone className="w-6 h-6 text-blue-400" />,
  },
];

export function LiveAchievementsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayAchievements, setDisplayAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // Shuffle achievements on mount
    const shuffled = [...achievements].sort(() => Math.random() - 0.5);
    setDisplayAchievements(shuffled);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayAchievements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayAchievements.length]);

  const current = displayAchievements[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6 border border-yellow-500/30 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5 animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
          <h3 className="text-sm font-medium text-yellow-400">
            لوحة الشرف الحية للأبطال
          </h3>
        </div>

        {/* Achievement Display */}
        <div className="space-y-3">
          {current && (
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-yellow-500/20 animate-fadeIn">
              <span className="flex-shrink-0 mt-0.5">{current.icon}</span>
              <p className="text-sm text-gray-300 leading-relaxed">
                {current.text}
              </p>
            </div>
          )}

          {/* Progress indicator */}
          <div className="flex gap-1">
            {displayAchievements.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {currentIndex + 1} / {displayAchievements.length}
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />

      {/* CSS for fade in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
