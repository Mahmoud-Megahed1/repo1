import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Share2, TrendingUp, Award, Clock, ArrowLeft, Search, Star, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { ProgressJourney } from "@/components/ProgressJourney";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MyResults() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  // Student phone for guest users
  const [studentPhone, setStudentPhone] = useState<string>("");
  const [searchPhoneInput, setSearchPhoneInput] = useState<string>("");
  const isAr = language === "ar";

  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("englishom_student_phone");
      if (savedPhone) {
        setStudentPhone(savedPhone);
        setSearchPhoneInput(savedPhone);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const { data: progress, isLoading: progressLoading } = trpc.quiz.getUserProgress.useQuery(
    { studentPhone: studentPhone || undefined },
    { enabled: true }
  );

  const { data: achievements = [], isLoading: achievementsLoading } = trpc.quiz.getUserAchievements.useQuery(
    { studentPhone: studentPhone || undefined },
    { enabled: true }
  );

  const { data: history = [], isLoading: historyLoading } = trpc.quiz.getQuizHistory.useQuery(
    { limit: 20, studentPhone: studentPhone || undefined },
    { enabled: true }
  );

  const isLoading = progressLoading || achievementsLoading || historyLoading;

  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhoneInput.trim()) return;
    setStudentPhone(searchPhoneInput.trim());
    try {
      localStorage.setItem("englishom_student_phone", searchPhoneInput.trim());
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const shareResults = () => {
    const text = isAr 
      ? `حصلت على متوسط دقة ${progress?.averageAccuracy || 0}% في اختبار كفاءة اللغة الإنجليزية (EnglishOM)! 🎯 أفضل مستوى لي: ${progress?.bestLevel || "N/A"}`
      : `I scored ${progress?.averageAccuracy || 0}% on EnglishOM Ques! 🎯 My best level: ${progress?.bestLevel || "N/A"}`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: "EnglishOM Ques Results",
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert(isAr ? "تم نسخ النتائج إلى الحافظة!" : "Results copied to clipboard!");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-background transition-colors duration-300 ${isAr ? "rtl" : "ltr"}`}>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Title & Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">
              {isAr ? "نتائجي" : "My Results"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isAr ? "سجل اختباراتك ورحلة تقدمك وإنجازاتك الشخصية" : "Your quiz history, progress journey, and achievements"}
            </p>
          </div>

          <Button variant="outline" onClick={() => setLocation("/")} className="gap-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            {isAr ? "العودة إلى الرئيسية" : "Back to Home"}
          </Button>
        </div>

        {/* Search Phone Bar for Guests */}
        {!user && (
          <Card className="p-4 border border-[#4A3B32]/20 dark:border-[#FCDFC2]/30 bg-card rounded-2xl shadow-sm">
            <form onSubmit={handleSearchPhone} className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                {isAr ? "البحث برقم الهاتف / الإيميل:" : "Search by Phone / Email:"}
              </span>
              <Input
                type="text"
                value={searchPhoneInput}
                onChange={(e) => setSearchPhoneInput(e.target.value)}
                placeholder={isAr ? "أدخل رقمك الذي امتحنت به..." : "Enter your phone or email..."}
                className="bg-background max-w-md"
                dir="ltr"
              />
              <Button type="submit" className="bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold gap-1.5 w-full sm:w-auto px-6 rounded-xl">
                <Search className="w-4 h-4" />
                {isAr ? "بحث" : "Search"}
              </Button>
            </form>
          </Card>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A3B32] dark:text-[#FCDFC2]" />
            <p className="text-muted-foreground text-sm">{isAr ? "جاري تحميل البيانات..." : "Loading results..."}</p>
          </div>
        ) : (
          <>
            {/* Top 4 Statistics Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border border-border/80 rounded-2xl shadow-sm hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {isAr ? "الاختبارات المأخوذة" : "Quizzes Taken"}
                    </p>
                    <p className="text-3xl font-extrabold text-foreground">{progress?.totalQuizzesTaken || 0}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 text-[#4A3B32] dark:text-[#FCDFC2] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border border-border/80 rounded-2xl shadow-sm hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {isAr ? "متوسط الدقة" : "Average Accuracy"}
                    </p>
                    <p className="text-3xl font-extrabold text-foreground">{progress?.averageAccuracy || 0}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 text-[#4A3B32] dark:text-[#FCDFC2] flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border border-border/80 rounded-2xl shadow-sm hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {isAr ? "أفضل مستوى" : "Best Level"}
                    </p>
                    <p className="text-3xl font-extrabold text-[#4A3B32] dark:text-[#FCDFC2]">{progress?.bestLevel || "A1"}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 text-[#4A3B32] dark:text-[#FCDFC2] flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 border border-border/80 rounded-2xl shadow-sm hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      {isAr ? "الوقت الإجمالي المستغرق" : "Total Time Spent"}
                    </p>
                    <p className="text-3xl font-extrabold text-foreground">{formatTime(progress?.totalTimeSpent || 0)}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 text-[#4A3B32] dark:text-[#FCDFC2] flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Achievements Section */}
            <Card className="p-6 md:p-8 border border-border shadow-sm rounded-2xl">
              <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#4A3B32] dark:text-[#FCDFC2] fill-current" />
                {isAr ? "الإنجازات" : "Achievements"}
              </h2>

              {achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex flex-col items-center text-center p-5 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-[#4A3B32]/40 dark:hover:border-[#FCDFC2]/40 transition-all">
                      <div className="w-12 h-12 rounded-full bg-[#4A3B32]/10 dark:bg-[#FCDFC2]/15 text-[#4A3B32] dark:text-[#FCDFC2] flex items-center justify-center text-2xl mb-3 shadow-inner">
                        ⭐
                      </div>
                      <p className="font-extrabold text-sm text-foreground mb-1">{achievement.badgeName}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{achievement.badgeDescription}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl border border-dashed">
                  {isAr ? "لا توجد إنجازات مسجلة حتى الآن. استمر في إجراء الاختبارات لفتح الإنجازات!" : "No achievements yet. Keep taking quizzes to unlock badges!"}
                </div>
              )}
            </Card>

            {/* Progress Journey */}
            <Card className="p-6 md:p-8 border border-border shadow-sm rounded-2xl">
              <ProgressJourney
                attempts={history.map((h: any) => ({
                  date: new Date(h.completedAt),
                  accuracy: h.accuracy,
                  level: h.level,
                }))}
              />

              <div className="mt-6 pt-4 border-t border-border">
                <Button onClick={shareResults} className="w-full gap-2 bg-[#4A3B32] text-[#FCDFC2] hover:bg-[#3B2E26] dark:bg-[#FCDFC2] dark:text-[#120F0D] dark:hover:bg-[#f3cfad] font-bold py-6 text-base rounded-xl shadow-lg">
                  <Share2 size={18} />
                  {isAr ? "مشاركة النتائج" : "Share Results"}
                </Button>
              </div>
            </Card>

            {/* Quiz History Table Section */}
            <Card className="p-6 md:p-8 border border-border shadow-sm rounded-2xl">
              <h2 className="text-xl font-extrabold text-foreground mb-6">
                {isAr ? "سجل الاختبارات" : "Quiz History"}
              </h2>

              {history && history.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-muted/70 text-foreground font-bold">
                      <tr className="border-b border-border">
                        <th className="text-start py-3 px-6 w-1/3">{isAr ? "المستوى" : "Level"}</th>
                        <th className="text-center py-3 px-6 w-1/3">{isAr ? "الدقة" : "Accuracy"}</th>
                        <th className="text-start py-3 px-6 w-1/3">{isAr ? "التاريخ" : "Date"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {history.map((result: any) => (
                        <tr key={result.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-6 text-foreground font-extrabold text-start">
                            <span className="inline-block px-3 py-1 rounded-lg bg-[#4A3B32]/10 text-[#4A3B32] dark:bg-[#FCDFC2]/15 dark:text-[#FCDFC2] font-bold border border-[#4A3B32]/20 dark:border-[#FCDFC2]/30">
                              {result.level}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-foreground font-bold text-center">{result.accuracy}%</td>
                          <td className="py-3 px-6 text-muted-foreground text-xs text-start font-medium">
                            {new Date(result.completedAt).toLocaleDateString(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" })} - {new Date(result.completedAt).toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm bg-muted/30 rounded-xl border border-dashed">
                  {isAr ? "لا يوجد سجل اختبارات حتى الآن." : "No quiz history recorded yet."}
                </div>
              )}
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
