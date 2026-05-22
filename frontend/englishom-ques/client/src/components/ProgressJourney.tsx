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
      <div className="text-center py-8 text-muted-foreground">
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
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "ar" ? "أفضل درجة" : "Best Score"}
          </p>
          <p className="text-2xl font-bold text-accent">{maxAccuracy}%</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "ar" ? "متوسط" : "Average"}
          </p>
          <p className="text-2xl font-bold text-accent">{avgAccuracy}%</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">
            {language === "ar" ? "المحاولات" : "Attempts"}
          </p>
          <p className="text-2xl font-bold text-accent">{attempts.length}</p>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm font-semibold text-foreground mb-4">
          {language === "ar" ? "رحلة التقدم" : "Progress Journey"}
        </p>
        <div className="space-y-3">
          {attempts.slice(-5).reverse().map((attempt, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-xs text-muted-foreground w-12">
                {new Date(attempt.date).toLocaleDateString(
                  language === "ar" ? "ar-SA" : "en-US",
                  { month: "short", day: "numeric" }
                )}
              </div>
              <div className="flex-1">
                <div className="bg-background rounded-full h-8 flex items-center overflow-hidden">
                  <div
                    className="bg-accent h-full flex items-center justify-center text-xs font-bold text-accent-foreground transition-all duration-300"
                    style={{ width: `${attempt.accuracy}%` }}
                  >
                    {attempt.accuracy > 20 && `${attempt.accuracy}%`}
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold text-foreground w-16 text-right">
                {attempt.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
