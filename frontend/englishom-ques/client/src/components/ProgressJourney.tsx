import { useLanguage } from "@/contexts/LanguageContext";

interface QuizAttempt {
  date: Date;
  accuracy: number;
  level: string;
}

interface ProgressJourneyProps {
  attempts: QuizAttempt[];
}

export function ProgressJourney({ attempts }: ProgressJourneyProps) {
  const { language } = useLanguage();

  if (attempts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        {language === "ar" ? "لا توجد محاولات سابقة" : "No quiz attempts yet"}
      </div>
    );
  }

  const maxAccuracy = Math.max(...attempts.map(a => a.accuracy));
  const avgAccuracy = Math.round(
    attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl text-center shadow-sm">
          <p className="text-xs text-muted-foreground mb-1 font-semibold">
            {language === "ar" ? "أفضل درجة" : "Best Score"}
          </p>
          <p className="text-2xl font-black text-[#4A3B32] dark:text-[#FCDFC2]">{maxAccuracy}%</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl text-center shadow-sm">
          <p className="text-xs text-muted-foreground mb-1 font-semibold">
            {language === "ar" ? "متوسط" : "Average"}
          </p>
          <p className="text-2xl font-black text-[#4A3B32] dark:text-[#FCDFC2]">{avgAccuracy}%</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl text-center shadow-sm">
          <p className="text-xs text-muted-foreground mb-1 font-semibold">
            {language === "ar" ? "المحاولات" : "Attempts"}
          </p>
          <p className="text-2xl font-black text-[#4A3B32] dark:text-[#FCDFC2]">{attempts.length}</p>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
        <p className="text-base font-extrabold text-foreground mb-4">
          {language === "ar" ? "رحلة التقدم" : "Progress Journey"}
        </p>
        <div className="space-y-3">
          {attempts.slice(-7).reverse().map((attempt, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs font-semibold text-muted-foreground w-14 whitespace-nowrap">
                {new Date(attempt.date).toLocaleDateString(
                  language === "ar" ? "ar-SA" : "en-US",
                  { month: "short", day: "numeric" }
                )}
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-full h-8 flex items-center overflow-hidden p-0.5 border border-border/50">
                  <div
                    className="bg-[#4A3B32] text-[#FCDFC2] dark:bg-[#FCDFC2] dark:text-[#120F0D] h-full rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.max(12, attempt.accuracy)}%` }}
                  >
                    {attempt.accuracy}%
                  </div>
                </div>
              </div>
              <div className="text-xs font-black px-2.5 py-1 rounded-md bg-muted text-foreground w-12 text-center">
                {attempt.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
