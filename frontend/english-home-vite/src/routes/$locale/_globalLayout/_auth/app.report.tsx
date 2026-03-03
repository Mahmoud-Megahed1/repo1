// Student Report Dashboard Page — Exact Pixel-Perfect Match of Client Mockup
import axiosClient from '@lib/axios-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import {
    CalendarDays,
    BookOpen,
    Map,
    CheckSquare,
    CheckCircle2,
    Plus,
    Mic,
    Bot,
    Clock,
    MessageSquareQuote,
    Link2
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────
interface StudentReport {
    user: { firstName: string; lastName: string; email: string; createdAt: string; };
    currentLevel: { name: string; title: string; currentDay: number; isCompleted: boolean; } | null;
    skills: { reading: { tasksCompleted: number }; writing: { tasksCompleted: number }; listening: { tasksCompleted: number }; speaking: { tasksCompleted: number }; grammar: { tasksCompleted: number }; };
    arsenal: { masteredWords: number; grammarRules: number; idioms: number; phrasalVerbs: number; fluencyPercent: number; };
    quizzes: { completed: number; averageScore: number; correctAnswers: number; };
    journey: { activeSince: string | null; currentStreak: number; totalActiveDays: number; totalCompletedDays: number; };
    aiPrediction: { nextLevel: string; estimatedDays: number; } | null;
    purchasedLevels: string[];
    completedLevels: string[];
}

export const Route = createFileRoute('/$locale/_globalLayout/_auth/app/report')({
    component: ReportPage,
});

// ─── SVGs & Exact UI Elements ──────────────────────────────────────────────

// Connecting lines for brain nodes
const LineSvg = ({ isRight = false, y = "50%" }) => (
    <svg className={`absolute top-[${y}] w-12 h-px -translate-y-1/2 ${isRight ? '-start-12' : '-end-12'}`} aria-hidden="true">
        <line x1="0" y1="0" x2="100%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" className={isRight ? 'text-amber-500/30' : 'text-cyan-500/30'} />
    </svg>
);

function SubSkillNode({ icon, label, isRight = false }: { icon: any; label: string; isRight?: boolean }) {
    return (
        <div className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[11px] backdrop-blur-sm z-10 transition-colors ${isRight
            ? 'border-amber-500/20 bg-[#1a1811] text-amber-200/70 hover:border-amber-500/40'
            : 'border-cyan-500/20 bg-[#121c21] text-cyan-200/70 hover:border-cyan-500/40'
            }`}>
            {icon}
            <span className="whitespace-nowrap font-medium tracking-wide">{label}</span>
            <LineSvg isRight={isRight} />
        </div>
    );
}

// Giant Gold Coin for Mastered Words (Top right panel)
function GoldCoin({ value, label }: { value: number | string; label: string }) {
    return (
        <div className="relative w-28 h-28 rounded-full shadow-[0_4px_20px_rgba(251,191,36,0.3)] flex flex-col items-center justify-center p-3 z-10"
            style={{ background: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)' }}>
            {/* Inner ring */}
            <div className="absolute inset-1 rounded-full border border-amber-200/50" />
            <span className="text-4xl font-black text-white drop-shadow-md leading-none">{value}</span>
            <span className="text-[9px] text-white/90 font-bold uppercase tracking-widest mt-1 text-center leading-tight drop-shadow-md">{label}</span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
function ReportPage() {
    const { i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    useEffect(() => {
        useBreadcrumbStore.getState().setItems([{ label: isAr ? 'تقرير الطالب' : 'Student Report', isCurrent: true }]);
    }, [isAr]);

    const { data: report, isLoading, error } = useQuery<StudentReport>({
        queryKey: ['student-report'],
        queryFn: async () => (await axiosClient.get<StudentReport>('/users/report')).data,
    });

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (error || !report) return <div className="min-h-screen flex items-center text-red-400 justify-center">Failed to load report.</div>;

    const levelLabel = report.currentLevel?.name?.replace('LEVEL_', '') || 'A1';
    const levelTitle = `Level ${levelLabel} Knight`;

    // Translation Map (Fallback exact text to match mockup visual)
    const t = {
        footprint: isAr ? 'بصمتك اللغوية' : 'YOUR LINGUISTIC FOOTPRINT',
        arsenal: isAr ? 'ترسانتك اللغوية' : 'Linguistic Arsenal',
        journeyTimeline: isAr ? 'الجدول الزمني' : 'Journey Timeline',
        knowledgeFortress: isAr ? 'حصن المعرفة' : 'Knowledge Fortress',
        aiPrediction: isAr ? 'توقعات الذكاء الاصطناعي:' : 'AI Prediction:',
        speaking: isAr ? 'التحدث' : 'Speaking',
        listening: isAr ? 'الاستماع' : 'Listening',
        reading: isAr ? 'القراءة' : 'Reading',
        writing: isAr ? 'الكتابة' : 'Writing',
        grammar: isAr ? 'القواعد' : 'Grammar',
        activeStreak: isAr ? 'سلسلة النشاط' : 'ACTIVE STREAK',
        masteredWords: isAr ? 'كلمات متقنة' : 'Mastered Words',
        idiomsPhrasal: isAr ? 'مصطلحات وأفعال مركبة' : 'IDIOMS & PHRASAL VERBS',
        voiceTraining: isAr ? 'تدريب صوتي' : 'VOICE TRAINING',
        wordsMastered: isAr ? 'كلمات متقنة' : 'WORDS MASTERED',
        fluency: isAr ? 'الفصاحة' : 'FLUENCY',
        grammarRulesUnlocked: isAr ? 'قواعد مفتوحة' : 'GRAMMAR RULES UNLOCKED',
        correctAnswers: isAr ? 'إجابات صحيحة' : 'CORRECT ANSWERS',
        quizzesCompleted: isAr ? 'اختبارات مكتملة' : 'QUIZZES COMPLETED',
        currentStreak: isAr ? 'سلسلة النشاط' : 'CURRENT STREAK',
        hours: isAr ? 'ساعات' : 'HOURS',
        days: isAr ? 'أيام' : 'DAYS',
        active: isAr ? 'نشط' : 'ACTIVE',
        grammarRules: isAr ? 'قواعد نحوية' : 'Grammar Rules',
        accuracy: isAr ? 'دقة' : 'Accuracy',
        idioms: isAr ? 'مصطلحات' : 'Idioms',
        phrasalVerbs: isAr ? 'أفعال مركبة' : 'Phrasal Verbs',
        readingSpeed: isAr ? 'سرعة القراءة' : 'Reading Speed',
    };

    return (
        <div className="min-h-[1200px] w-full" style={{ backgroundColor: '#0d1117' }} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="max-w-[1100px] mx-auto p-8 space-y-6 font-sans">

                {/* ════ ROW 1: Top Section ════ */}
                <div className="grid grid-cols-[1.2fr_1fr] gap-6">

                    {/* --- LINGUISTIC FOOTPRINT (LEFT) --- */}
                    <div className="relative rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-8 shadow-2xl flex flex-col">
                        <div className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest text-center italic mt-2 drop-shadow-md">
                            {t.footprint}
                            <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mt-2" />
                        </h2>

                        <div className="flex-1 relative mt-10 min-h-[350px]">
                            {/* Detailed Brain Picture centered */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                                <img src="/images/report/brain.png" alt="Brain" className="w-[300px] object-contain drop-shadow-[0_0_40px_rgba(251,191,36,0.1)]" draggable={false} />
                            </div>

                            {/* Left Skills (Cyan) */}
                            <div className="absolute start-4 top-10 flex flex-col gap-12">
                                <div>
                                    <h3 className="text-cyan-400 font-black text-2xl tracking-widest uppercase mb-4 ms-2 drop-shadow-md">{t.listening}</h3>
                                    <div className="space-y-4 relative z-10">
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Audio Mastered" />
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label={t.speaking} />
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Words Written" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-cyan-400 font-black text-2xl tracking-widest uppercase mb-4 ms-2 drop-shadow-md">{t.reading}</h3>
                                    <div className="space-y-4 relative z-10">
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Visual Associations" />
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Words Read" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Skills (Gold) */}
                            <div className="absolute end-4 top-10 flex flex-col gap-12 items-end text-end">
                                <div>
                                    <h3 className="text-amber-400 font-black text-2xl tracking-widest uppercase mb-4 me-2 drop-shadow-md">{t.writing}</h3>
                                    <div className="space-y-4 relative z-10">
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Visual Learning" isRight />
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Words Written" isRight />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-amber-400 font-black text-2xl tracking-widest uppercase mb-4 me-2 drop-shadow-md">{t.speaking}</h3>
                                    <div className="space-y-4 relative z-10">
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Visual Associations" isRight />
                                        <SubSkillNode icon={<BookOpen className="w-3 h-3" />} label="Words Written" isRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- LINGUISTIC ARSENAL TOP (RIGHT) --- */}
                    <div className="relative rounded-[2rem] bg-gradient-to-b from-[#1b1c20] to-[#121418] border border-zinc-800/80 p-8 shadow-2xl overflow-hidden flex flex-col justify-between">

                        {/* Top layout: Coin + Label + Title */}
                        <div className="flex gap-6 relative z-10">
                            <GoldCoin value={report.arsenal.masteredWords} label={t.masteredWords} />

                            <div className="flex-1 pt-2">
                                <h1 className="text-2xl font-black text-white tracking-widest mb-4">Linguistic Arsenal</h1>

                                <div className="flex items-center gap-3 bg-zinc-800/20 w-max px-3 py-1.5 rounded-lg border border-zinc-700/50">
                                    <BookOpen className="w-4 h-4 text-zinc-400" />
                                    <span className="text-[11px] font-bold tracking-widest text-zinc-300 uppercase">{t.idiomsPhrasal}</span>
                                    <Plus className="w-5 h-5 text-purple-500 ms-2" />
                                    <span className="text-xl font-black text-white">{report.arsenal.idioms + report.arsenal.phrasalVerbs}</span>
                                </div>

                                <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] mt-3 ms-2">
                                    {t.voiceTraining}: {report.skills.speaking.tasksCompleted} {t.hours}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar Section exactly like mockup */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase mb-2">
                                <span className="text-zinc-400">{t.wordsMastered}</span>
                                <span className="text-[#00d084] flex items-center gap-2">
                                    {report.arsenal.fluencyPercent}% <span className="text-zinc-500">{t.fluency} {report.skills.listening.tasksCompleted} {t.hours}</span> <Mic className="w-3 h-3 text-zinc-500" />
                                </span>
                            </div>

                            <div className="h-2 bg-[#1a1f26] rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-[#00d084] rounded-full transition-all duration-1000" style={{ width: `${report.arsenal.fluencyPercent}%` }} />
                            </div>
                            <div className="flex justify-end mb-2">
                                <span className="text-[#00d084] font-black">{report.arsenal.fluencyPercent}%</span>
                            </div>

                            <p className="text-[9px] text-zinc-600 font-bold tracking-[0.15em] mb-6 uppercase">
                                SENTENCES TAKEN: {report.skills.writing.tasksCompleted} | VOICES SHARED: {report.skills.listening.tasksCompleted} HOURS
                            </p>

                            {/* 2x2 Stats Grid exactly like mockup */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-8">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2">
                                        <Map className="w-4 h-4 text-zinc-500 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-tight uppercase">GRAMMAR RULES<br />UNLOCKED</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-zinc-100">{report.arsenal.grammarRules}</span>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-zinc-500 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-tight uppercase">{t.quizzesCompleted}<br />COMPLETED: {report.quizzes.averageScore}%</span>
                                        </div>
                                    </div>
                                    <span className="text-xl font-black text-zinc-100">{report.quizzes.completed}</span>
                                </div>
                                <div className="flex items-start justify-between gap-3 pt-2">
                                    <div className="flex items-start gap-2">
                                        <CheckSquare className="w-4 h-4 text-zinc-500 mt-0.5" />
                                        <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-tight mt-0.5 uppercase">{t.correctAnswers}</span>
                                    </div>
                                    <span className="text-lg font-black text-zinc-100">{report.quizzes.correctAnswers}</span>
                                </div>
                                <div className="flex items-start justify-between gap-3 pt-2">
                                    <div className="flex items-start gap-2">
                                        <CheckSquare className="w-4 h-4 text-zinc-500 mt-0.5" />
                                        <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-tight mt-0.5 uppercase">{t.currentStreak}</span>
                                    </div>
                                    <span className="text-lg font-black text-zinc-100">{report.journey.currentStreak} {t.days}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ════ ROW 2: Knowledge Fortress & Journey Timeline ════ */}
                <div className="flex flex-col items-center w-full mt-6 mb-6 relative">
                    <h2 className="text-2xl font-black tracking-widest uppercase text-white mb-6 drop-shadow-md">{t.knowledgeFortress}</h2>

                    <div className="flex w-full items-center gap-6 relative z-10 px-2 lg:px-6">
                        {/* Left: Journey Timeline Pill */}
                        <div className="flex items-center gap-4 px-8 py-4 rounded-2xl border border-zinc-700/50 bg-[#14171d] min-w-[320px] shadow-lg">
                            <CalendarDays className="w-6 h-6 text-zinc-400" />
                            <span className="text-xl font-bold text-white tracking-wide">{t.journeyTimeline}</span>
                        </div>

                        {/* Middle: Active Pill */}
                        <div className="flex items-center gap-8 px-8 py-4 rounded-2xl border border-zinc-700/50 bg-[#14171d] flex-1 justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-zinc-400" />
                                <span className="text-sm font-bold text-zinc-300 tracking-widest uppercase">
                                    {t.active} {report.journey.activeSince ? new Date(report.journey.activeSince).toLocaleDateString(isAr ? 'ar' : 'en', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-zinc-400 tracking-widest uppercase">{t.activeStreak}&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white text-lg">{report.journey.currentStreak} {t.days}</span></span>
                        </div>
                    </div>

                    {/* Right Shield */}
                    <div className="absolute end-4 -top-8 z-20 flex flex-col items-center">
                        <img src="/images/report/shield.png" alt="Level Shield" className="w-[120px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] select-none" />
                        <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-3 drop-shadow-md">
                            {levelTitle}
                        </span>
                    </div>
                </div>

                {/* ════ ROW 3: Linguistic Arsenal Bottom Cards ════ */}
                <div className="relative rounded-[2rem] bg-gradient-to-br from-[#1b1c20] to-[#121418] border border-zinc-800/80 p-8 shadow-2xl pt-6">
                    <h2 className="text-2xl text-white font-normal tracking-wide mb-8">Linguistic Arsenal</h2>

                    <div className="grid grid-cols-[auto_1fr] gap-12">
                        {/* Two big rings on left */}
                        <div className="flex items-center gap-12 ps-4 pb-4">
                            {/* Cyan Ring (Book Inside) */}
                            <div className="flex flex-col items-center gap-4 border-r border-zinc-800 pr-12">
                                <div className="relative w-36 h-36">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="#1f2937" strokeWidth="8" />
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" strokeDasharray="402" strokeDashoffset={402 - (402 * (report.arsenal.fluencyPercent / 100))} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BookOpen className="w-12 h-12 text-zinc-300" strokeWidth={1} />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] text-zinc-300">{t.voiceTraining}:</p>
                                    <p className="text-[13px] text-zinc-300">{report.skills.speaking.tasksCompleted} {t.hours}</p>
                                </div>
                            </div>

                            {/* Gold Ring (Text Inside) */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative w-36 h-36">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="#1f2937" strokeWidth="8" />
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" strokeDasharray="402" strokeDashoffset={402 - (402 * Math.min(1, report.arsenal.masteredWords / 500))} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-amber-100">{report.arsenal.masteredWords}</span>
                                        <span className="text-[10px] text-zinc-400 mt-0.5 leading-tight text-center px-4">{t.masteredWords}</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] text-zinc-300">{t.readingSpeed}:</p>
                                    <p className="text-[13px] text-zinc-300">+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</p>
                                </div>
                            </div>
                        </div>

                        {/* Right side stats: 2x2 grid identical to mockup boxes */}
                        <div className="grid grid-cols-2 gap-5 pe-12">
                            {/* Box 1 */}
                            <div className="rounded-2xl border border-zinc-700/40 bg-[#161a23] p-5 flex items-center gap-4 shadow-lg">
                                <MessageSquareQuote className="w-6 h-6 text-zinc-400" />
                                <span className="text-[15px] font-medium text-zinc-300">{t.idioms}: {report.arsenal.idioms}</span>
                                <div className="ms-auto w-4 h-0.5 bg-cyan-400 rounded" />
                            </div>
                            {/* Box 2 */}
                            <div className="rounded-2xl border border-zinc-700/40 bg-[#161a23] p-5 flex items-center gap-4 shadow-lg relative">
                                <Link2 className="w-6 h-6 text-zinc-400" />
                                <span className="text-[15px] font-medium text-zinc-300">{t.phrasalVerbs}: {report.arsenal.phrasalVerbs}</span>
                                <div className="absolute top-0 end-8 w-8 h-1 bg-cyan-400 rounded-b-md" />
                            </div>
                            {/* Box 3 */}
                            <div className="rounded-2xl border border-zinc-700/40 bg-[#161a23] p-5 shadow-lg flex flex-col justify-center">
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-3xl font-light text-zinc-300 leading-none">{report.skills.reading.tasksCompleted}</span>
                                    <span className="text-sm font-medium text-zinc-400 mb-0.5">{t.readingSpeed}:<br />+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</span>
                                </div>
                                <p className="text-xs font-semibold text-zinc-400">{t.quizzesCompleted}<br />{report.quizzes.completed} {t.days}!</p>
                            </div>
                            {/* Box 4 */}
                            <div className="rounded-2xl border border-zinc-700/40 bg-[#161a23] p-5 shadow-lg flex flex-col justify-center relative">
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-3xl font-light text-zinc-300 leading-none">{report.arsenal.grammarRules}</span>
                                    <span className="text-sm font-medium text-zinc-400 mb-0.5">{t.grammarRules}:<br />({report.quizzes.averageScore}% {t.accuracy})</span>
                                </div>
                                <p className="text-xs font-semibold text-zinc-400">{t.currentStreak}:</p>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-16 bg-amber-400/50 blur-[1px]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════ ROW 4: AI Prediction ════ */}
                <div className="rounded-3xl border border-zinc-800 bg-[#14171d] p-5 flex items-center gap-4 shadow-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Bot className="w-8 h-8 text-[#5c85ff]" strokeWidth={1.5} />
                    <p className="text-[13px] text-zinc-300 z-10 font-medium">
                        {report.aiPrediction ? (
                            <>{t.aiPrediction} {isAr ? 'بناءً على تقدمك، من المتوقع أن تصل إلى المستوى' : 'Based on your progress, you\'re projected to reach'} <span className="font-bold">{report.aiPrediction.nextLevel}</span> {isAr ? `في ${report.aiPrediction.estimatedDays} يوماً!` : `level in ${report.aiPrediction.estimatedDays} days!`}</>
                        ) : (
                            <>{t.aiPrediction} {isAr ? 'واصل التدريب لفتح توقعات الذكاء الاصطناعي.' : 'Keep practicing to unlock AI-powered predictions!'}</>
                        )}
                    </p>
                    <div className="ms-auto w-4 h-4 rounded-sm bg-white/80 rotate-45 mr-2 opacity-50" />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
