import { useState, useMemo } from 'react';
import { Rocket, Zap, Target, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const TOTAL_COURSE_DAYS = 50;
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function App() {
  const [planDays, setPlanDays] = useState(10);
  const [studentDays, setStudentDays] = useState(15);

  // AI BUGS FIXED:
  // 1. Calculate velocity securely as numbers instead of formatting to strings
  const velocity = useMemo(() => {
    if (planDays === 0) return 1;
    return Number((studentDays / planDays).toFixed(2));
  }, [studentDays, planDays]);

  // 2. Fix the Infinity issue when velocity is 0
  const expectedRemainingDays = useMemo(() => {
    if (velocity <= 0) return TOTAL_COURSE_DAYS; // Safe fallback
    const remainingDaysAtCurrentPace = (TOTAL_COURSE_DAYS - studentDays) / velocity;
    return Math.ceil(remainingDaysAtCurrentPace);
  }, [studentDays, velocity]);

  const totalExpectedDays = studentDays + expectedRemainingDays;
  const timeSavedDays = Math.max(0, TOTAL_COURSE_DAYS - totalExpectedDays);
  
  const progressValue = Math.min((studentDays / TOTAL_COURSE_DAYS) * 100, 100);
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (progressValue / 100) * CIRCLE_CIRCUMFERENCE;

  // 3. Fix type coercion in messages
  const statusInfo = useMemo(() => {
    if (velocity >= 2) return { icon: <Zap className="text-yellow-400" size={32}/>, title: 'أداء خيالي!', msg: `أنت تسير بسرعة ${velocity}x! ستنهي الكورس في ${totalExpectedDays} يوم فقط!` };
    if (velocity > 1.5) return { icon: <Rocket className="text-blue-400" size={32}/>, title: 'متفوق جداً!', msg: `أنت تسير بسرعة ${velocity}x من الخطة. استمر في هذا الزخم!` };
    if (velocity > 1) return { icon: <TrendingUp className="text-green-400" size={32}/>, title: 'متفوق!', msg: `أنت تسير بسرعة ${velocity}x. تقدم رائع!` };
    if (velocity === 1) return { icon: <Target className="text-purple-400" size={32}/>, title: 'على المسار الصحيح', msg: 'أنت تسير حسب الخطة تماماً. التزامك هو مفتاح النجاح!' };
    if (velocity > 0.5) return { icon: <Clock className="text-orange-400" size={32}/>, title: 'متأخر قليلاً', msg: `أنت تسير بسرعة ${velocity}x. يمكنك زيادة السرعة قليلاً!` };
    return { icon: <AlertTriangle className="text-red-400" size={32}/>, title: 'تحتاج للتسارع', msg: `أنت تسير ببطء (${velocity}x). حاول زيادة وتيرتك!` };
  }, [velocity, totalExpectedDays]);

  const difference = studentDays - planDays;

  return (
    <div dir="rtl" className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-4">
          لوحة أداء الطالب
        </h1>
        <p className="text-lg text-slate-300">تابع تقدمك وإنجازاتك في الكورس</p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Speedometer Section */}
        <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="circular-progress absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#00ff88" />
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
              <span className="text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                {velocity}x
              </span>
              <span className="text-slate-400 text-sm mt-1 font-medium tracking-wide">سرعة الإنجاز</span>
            </div>
          </div>

          <div className="mt-8 w-full space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">إنجاز الطالب:</span>
              <span className="font-bold text-lg text-white">{studentDays} <span className="text-xs text-slate-400 font-normal">يوم</span></span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">الخطة:</span>
              <span className="font-bold text-lg text-white">{planDays} <span className="text-xs text-slate-400 font-normal">يوم</span></span>
            </div>
            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-700/50">
              <span className="text-slate-300 font-medium">التقدم الكلي:</span>
              <span className="font-bold text-2xl text-emerald-400">{Math.round(progressValue)}%</span>
            </div>
          </div>
        </motion.section>

        {/* Right Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ y: -5 }} className="glass-card card-cyan p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <h3 className="text-sm font-semibold text-cyan-100">إنجاز الطالب</h3>
                <p className="text-xs text-cyan-300/70 mt-1">الأيام المنجزة</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1 z-10">
                <span className="text-3xl font-bold text-cyan-400">{studentDays}</span>
                <span className="text-sm text-cyan-400/80">يوم</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card card-red p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <h3 className="text-sm font-semibold text-red-100">الخطة المتوقعة</h3>
                <p className="text-xs text-red-300/70 mt-1">اليوم الحالي</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1 z-10">
                <span className="text-3xl font-bold text-red-400">{planDays}</span>
                <span className="text-sm text-red-400/80">يوم</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card card-purple p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <h3 className="text-sm font-semibold text-purple-100">التقدم الكلي</h3>
                <p className="text-xs text-purple-300/70 mt-1">نسبة الإكمال</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1 z-10">
                <span className="text-3xl font-bold text-purple-400">{Math.round(progressValue)}</span>
                <span className="text-sm text-purple-400/80">%</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="glass-card card-green p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="z-10">
                <h3 className="text-sm font-semibold text-emerald-100">الفرق</h3>
                <p className="text-xs text-emerald-300/70 mt-1">التفوق على الخطة</p>
              </div>
              <div className="mt-4 flex items-baseline gap-1 z-10">
                <span className="text-3xl font-bold text-emerald-400">{difference > 0 ? `+${difference}` : difference}</span>
                <span className="text-sm text-emerald-400/80">يوم</span>
              </div>
            </motion.div>
          </div>

          {/* Motivational Message */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-800/50 shadow-inner">
              {statusInfo.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{statusInfo.title}</h3>
              <p className="text-slate-300 leading-relaxed">{statusInfo.msg}</p>
            </div>
          </motion.div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Timeline */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-slate-700/50 pb-3">التوقعات الزمنية</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">تاريخ الانتهاء المتوقع:</span>
                  <span className="font-bold text-white">{expectedRemainingDays} <span className="text-sm font-normal text-slate-400">يوم</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">الأيام المتبقية:</span>
                  <span className="font-bold text-white">{Math.max(0, TOTAL_COURSE_DAYS - studentDays)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">التوفير الزمني:</span>
                  <span className="font-bold text-emerald-400">{timeSavedDays} <span className="text-sm font-normal">أيام</span></span>
                </div>
              </div>
            </div>

            {/* Controls (For Demo/Testing) */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6 text-white border-b border-slate-700/50 pb-3">محاكي التحديثات (للتجربة)</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-slate-300">إنجاز الطالب (أيام)</label>
                    <span className="text-sm font-bold text-cyan-400">{studentDays}</span>
                  </div>
                  <input 
                    type="range" min="0" max="60" value={studentDays} 
                    onChange={(e) => setStudentDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-slate-300">الخطة الحالية (أيام)</label>
                    <span className="text-sm font-bold text-red-400">{planDays}</span>
                  </div>
                  <input 
                    type="range" min="0" max="50" value={planDays} 
                    onChange={(e) => setPlanDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
