import { useState, useMemo, useEffect } from 'react';
import { Rocket, Zap, Target, TrendingUp, AlertTriangle, Clock, BarChart3, Calendar, Timer, Award, ArrowUp, ArrowDown, Minus, GraduationCap, Loader2, LogIn, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const TOTAL_COURSE_DAYS = 50;
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const API_BASE = 'https://api.englishom.com/api';

type LevelDetails = {
  levelName: string;
  currentDay: number;
  isCompleted: boolean;
  purchaseDate: string;
  expiresAt: string;
  daysLeft: number;
  isExpired: boolean;
};

type LoadingState = 'loading' | 'loaded' | 'no-auth' | 'no-course' | 'error';

export default function App() {
  const [planDays, setPlanDays] = useState(0);
  const [studentDays, setStudentDays] = useState(0);
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [activeLevelName, setActiveLevelName] = useState<string>('');

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingState('no-auth');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setLoadingState('no-auth');
            return;
          }
          throw new Error('Failed to fetch');
        }

        const data = await res.json();
        const levels: LevelDetails[] = data.levelsDetails || [];

        if (levels.length === 0) {
          setLoadingState('no-course');
          return;
        }

        // Find the active (non-completed, non-expired) level
        const activeLevel = levels.find(l => !l.isCompleted && !l.isExpired) || levels[0];

        if (activeLevel) {
          // studentDays = completed days (currentDay - 1, since currentDay is the NEXT day to study)
          const completed = Math.max(0, activeLevel.currentDay - 1);
          setStudentDays(completed);
          setActiveLevelName(activeLevel.levelName);

          // planDays = calendar days elapsed since purchase (expected 1 lesson/day)
          if (activeLevel.purchaseDate) {
            const purchase = new Date(activeLevel.purchaseDate);
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
            setPlanDays(Math.min(Math.max(1, elapsed), TOTAL_COURSE_DAYS));
          }

          setLoadingState('loaded');
        } else {
          setLoadingState('no-course');
        }
      } catch {
        setLoadingState('error');
      }
    };

    fetchProgress();
  }, []);

  const velocity = useMemo(() => {
    if (planDays === 0) return 1;
    return Number((studentDays / planDays).toFixed(2));
  }, [studentDays, planDays]);

  const expectedRemainingDays = useMemo(() => {
    if (velocity <= 0) return TOTAL_COURSE_DAYS;
    const remainingDaysAtCurrentPace = (TOTAL_COURSE_DAYS - studentDays) / velocity;
    return Math.ceil(remainingDaysAtCurrentPace);
  }, [studentDays, velocity]);

  const totalExpectedDays = studentDays + expectedRemainingDays;
  const timeSavedDays = Math.max(0, TOTAL_COURSE_DAYS - totalExpectedDays);
  
  const progressValue = Math.min((studentDays / TOTAL_COURSE_DAYS) * 100, 100);
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progressValue / 100) * CIRCLE_CIRCUMFERENCE;

  const statusInfo = useMemo(() => {
    if (velocity >= 2) return { icon: <Zap className="text-yellow-400" size={28}/>, title: 'أداء خيالي!', msg: `أنت تسير بسرعة ${velocity}x — ستنهي الكورس في ${totalExpectedDays} يوم فقط!`, color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30' };
    if (velocity > 1.5) return { icon: <Rocket className="text-blue-400" size={28}/>, title: 'متفوق جداً!', msg: `أنت تسير بسرعة ${velocity}x من الخطة. استمر في هذا الزخم!`, color: 'from-blue-500/20 to-sky-500/10', border: 'border-blue-500/30' };
    if (velocity > 1) return { icon: <TrendingUp className="text-emerald-400" size={28}/>, title: 'متفوق!', msg: `أنت تسير بسرعة ${velocity}x — تقدم رائع!`, color: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/30' };
    if (velocity === 1) return { icon: <Target className="text-purple-400" size={28}/>, title: 'على المسار الصحيح', msg: 'أنت تسير حسب الخطة تماماً. التزامك هو مفتاح النجاح!', color: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30' };
    if (velocity > 0.5) return { icon: <Clock className="text-orange-400" size={28}/>, title: 'متأخر قليلاً', msg: `أنت تسير بسرعة ${velocity}x — يمكنك زيادة السرعة قليلاً!`, color: 'from-orange-500/20 to-amber-500/10', border: 'border-orange-500/30' };
    return { icon: <AlertTriangle className="text-red-400" size={28}/>, title: 'تحتاج للتسارع', msg: `أنت تسير ببطء (${velocity}x). حاول زيادة وتيرتك!`, color: 'from-red-500/20 to-rose-500/10', border: 'border-red-500/30' };
  }, [velocity, totalExpectedDays]);

  const difference = studentDays - planDays;

  const getDifferenceIcon = () => {
    if (difference > 0) return <ArrowUp className="w-5 h-5 text-emerald-400" />;
    if (difference < 0) return <ArrowDown className="w-5 h-5 text-red-400" />;
    return <Minus className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://englishom.com" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg text-white">Englishom</span>
            </a>
            <span className="text-slate-500 text-sm">|</span>
            <span className="text-slate-400 text-sm font-medium">لوحة أداء الطالب</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="https://englishom.com" className="text-sm text-slate-400 hover:text-white transition-colors">الرئيسية</a>
            <a href="https://englishom.com/test" className="text-sm text-slate-400 hover:text-white transition-colors">اختبار المستوى</a>
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            لوحة أداء الطالب
          </h1>
        </div>
        <p className="text-slate-400 text-base mr-11">تابع تقدمك وسرعة إنجازك في الكورس</p>
      </div>

      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="flex-1 flex items-center justify-center py-32">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            <p className="text-slate-400 text-sm">جاري تحميل بيانات التقدم...</p>
          </motion.div>
        </div>
      )}

      {/* Not Authenticated */}
      {loadingState === 'no-auth' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">سجل دخولك أولاً</h2>
            <p className="text-slate-400 text-sm leading-relaxed">يجب تسجيل الدخول لعرض بيانات تقدمك الفعلية في الكورس.</p>
            <a
              href="https://englishom.com/ar/login"
              onClick={() => { localStorage.setItem('redirectUrl', window.location.pathname + window.location.search + window.location.hash); }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              تسجيل الدخول
            </a>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">حدث خطأ</h2>
            <p className="text-slate-400 text-sm leading-relaxed">لم نتمكن من تحميل بيانات تقدمك. تأكد من اتصالك بالإنترنت.</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">
              إعادة المحاولة
            </button>
          </motion.div>
        </div>
      )}

      {/* No Course State */}
      {loadingState === 'no-course' && (
        <div className="flex-1 flex items-center justify-center py-32 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 max-w-md text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">لا يوجد اشتراك نشط</h2>
            <p className="text-slate-400 text-sm leading-relaxed">أنت الآن في فترة التجربة المجانية ولم تقم بالاشتراك في أي مستوى حتى الآن. اشترك الآن لتبدأ في تتبع تقدمك بدقة واحترافية!</p>
            <a
              href="https://englishom.com/#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <Target className="w-4 h-4" />
              تصفح خطط الاشتراك
            </a>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      {loadingState === 'loaded' && <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* Speedometer Section */}
          <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
            
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="circular-progress absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r={CIRCLE_RADIUS} className="progress-bg" />
                <circle 
                  cx="100" cy="100" r={CIRCLE_RADIUS} 
                  className="progress-fill" 
                  style={{ strokeDashoffset }} 
                />
              </svg>
              <div className="flex flex-col items-center z-10">
                <span className="text-5xl font-bold text-white">
                  {velocity}x
                </span>
                <span className="text-slate-400 text-xs mt-1.5 font-medium tracking-wider uppercase">سرعة الإنجاز</span>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <div className="flex justify-between items-center text-sm px-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  إنجاز الطالب
                </span>
                <span className="font-bold text-white">{studentDays} <span className="text-xs text-slate-500 font-normal">يوم</span></span>
              </div>
              <div className="flex justify-between items-center text-sm px-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  الخطة
                </span>
                <span className="font-bold text-white">{planDays} <span className="text-xs text-slate-500 font-normal">يوم</span></span>
              </div>
              <div className="h-px bg-white/10 mx-1"></div>
              <div className="flex justify-between items-center text-sm px-1">
                <span className="text-slate-300 font-medium">التقدم الكلي</span>
                <span className="font-bold text-xl text-emerald-400">{Math.round(progressValue)}%</span>
              </div>
            </div>
          </motion.section>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-cyan p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-cyan-400/70" />
                    <h3 className="text-sm font-semibold text-cyan-100">إنجاز الطالب</h3>
                  </div>
                  <p className="text-xs text-cyan-300/50">الأيام المنجزة</p>
                </div>
                <div className="mt-4 flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-bold text-cyan-400">{studentDays}</span>
                  <span className="text-sm text-cyan-400/60">يوم</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-red p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-red-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-red-400/70" />
                    <h3 className="text-sm font-semibold text-red-100">الخطة المتوقعة</h3>
                  </div>
                  <p className="text-xs text-red-300/50">اليوم الحالي</p>
                </div>
                <div className="mt-4 flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-bold text-red-400">{planDays}</span>
                  <span className="text-sm text-red-400/60">يوم</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-purple p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-purple-400/70" />
                    <h3 className="text-sm font-semibold text-purple-100">التقدم الكلي</h3>
                  </div>
                  <p className="text-xs text-purple-300/50">نسبة الإكمال</p>
                </div>
                <div className="mt-4 flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-bold text-purple-400">{Math.round(progressValue)}</span>
                  <span className="text-sm text-purple-400/60">%</span>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} className="glass-card card-green p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="z-10">
                  <div className="flex items-center gap-2 mb-1">
                    {getDifferenceIcon()}
                    <h3 className="text-sm font-semibold text-emerald-100">الفرق</h3>
                  </div>
                  <p className="text-xs text-emerald-300/50">التفوق على الخطة</p>
                </div>
                <div className="mt-4 flex items-baseline gap-1 z-10">
                  <span className="text-3xl font-bold text-emerald-400">{difference > 0 ? `+${difference}` : difference}</span>
                  <span className="text-sm text-emerald-400/60">يوم</span>
                </div>
              </motion.div>
            </div>

            {/* Status Message */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={`glass-card p-6 flex items-start gap-4 bg-gradient-to-l ${statusInfo.color} ${statusInfo.border}`}>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                {statusInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{statusInfo.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{statusInfo.msg}</p>
              </div>
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Timeline */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">التوقعات الزمنية</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">الانتهاء المتوقع</span>
                    <span className="font-bold text-white">{expectedRemainingDays} <span className="text-xs font-normal text-slate-500">يوم متبقي</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">الأيام المتبقية من الكورس</span>
                    <span className="font-bold text-white">{Math.max(0, TOTAL_COURSE_DAYS - studentDays)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">التوفير الزمني</span>
                    <span className="font-bold text-emerald-400">{timeSavedDays} <span className="text-xs font-normal">أيام</span></span>
                  </div>
                </div>
              </div>

              {/* Live Progress Data */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
                  <Activity className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">سرعة الدراسة مقابل الخطة</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2.5">
                      <label className="text-sm text-slate-300">إنجاز الطالب (أيام)</label>
                      <span className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">{studentDays}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((studentDays / TOTAL_COURSE_DAYS) * 100, 100)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2.5">
                      <label className="text-sm text-slate-300">الخطة المتوقعة (أيام)</label>
                      <span className="text-sm font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">{planDays}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((planDays / TOTAL_COURSE_DAYS) * 100, 100)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      />
                    </div>
                  </div>
                  {activeLevelName && (
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">المستوى الحالي</span>
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                          {activeLevelName.replace('LEVEL_', '')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; 2026 Englishom. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <a href="https://englishom.com" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">الرئيسية</a>
            <a href="https://englishom.com/test" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">اختبار المستوى</a>
            <a href="https://englishom.com/ar/contact" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
