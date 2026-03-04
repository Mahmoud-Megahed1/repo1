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
    Link2,
    Eye,
    FileText,
    ScrollText
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

// Connecting lines for brain nodes with arrows
const LineSvg = ({ isRight = false }) => (
    <svg className={`absolute top-1/2 w-12 lg:w-20 h-4 -translate-y-1/2 ${isRight ? '-start-12 lg:-start-20' : '-end-12 lg:-end-20'}`} viewBox="0 0 80 16" preserveAspectRatio="none">
        <line x1={isRight ? "80" : "0"} y1="8" x2={isRight ? "6" : "74"} y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className={isRight ? 'text-amber-500/40' : 'text-cyan-500/40'} />
        <polygon points={isRight ? "8,4 0,8 8,12" : "72,4 80,8 72,12"} fill="currentColor" className={isRight ? 'text-amber-500/80' : 'text-cyan-500/80'} />
    </svg>
);

function SubSkillNode({ icon, label, isRight = false }: { icon: any; label: string; isRight?: boolean }) {
    return (
        <div className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs backdrop-blur-md z-10 shadow-lg ${isRight
            ? 'border-amber-500/30 bg-[#1a1710]/95 text-amber-200/80 shadow-[0_0_15px_rgba(251,191,36,0.05)]'
            : 'border-cyan-500/30 bg-[#111a1f]/95 text-cyan-200/80 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
            }`}>
            {icon}
            <span className="whitespace-nowrap font-medium tracking-wide">{label}</span>
            <LineSvg isRight={isRight} />
        </div>
    );
}

// Giant Gold Pill for Mastered Words (Top right panel) - Pill Shaped
function GoldCoin({ value, label }: { value: number | string; label: string }) {
    return (
        <div className="relative w-[5.5rem] h-[8.5rem] rounded-[2.5rem] shadow-[0_4px_30px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center p-3 z-10 border-2 border-amber-300/40 mt-1 shrink-0"
            style={{ background: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)' }}>
            <div className="absolute inset-1 rounded-[2.2rem] border border-amber-100/30" />
            <span className="text-4xl font-black text-white drop-shadow-md leading-none mb-1">{value}</span>
            <span className="text-[9px] text-white/95 font-bold uppercase tracking-widest mt-1 text-center leading-tight drop-shadow-md px-1">{label}</span>
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0d1016]"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (error || !report) return <div className="min-h-screen flex items-center text-red-400 justify-center bg-[#0d1016]">Failed to load report.</div>;

    const levelLabel = report.currentLevel?.name?.replace('LEVEL_', '') || 'A1';
    const levelTitle = `Level ${levelLabel} Knight`;

    // Translation Map (Fallback exact text to match mockup visual)
    const t = {
        footprint: isAr ? 'بصمتك اللغوية' : 'YOUR LINGUISTIC FOOTPRINT',
        arsenal: 'Linguistic Arsenal', // Kept English as in mockup for stylistic matching
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
        <div className="min-h-screen w-full bg-[#0d1117] py-8 pb-16" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="max-w-[1100px] mx-auto px-6 space-y-6 lg:space-y-8 font-sans">

                {/* ════ ROW 1: Top Section ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8">

                    {/* --- LINGUISTIC FOOTPRINT (LEFT) --- */}
                    <div className="relative rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-6 lg:p-8 shadow-2xl flex flex-col">
                        <div className="absolute inset-x-20 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

                        <h2 className="text-xl md:text-2xl font-black text-gray-200 uppercase tracking-widest italic text-center mt-2 drop-shadow-md">
                            {t.footprint}
                            <div className="h-0.5 w-64 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mt-2 opacity-80" />
                        </h2>

                        <div className="flex-1 relative mt-12 min-h-[380px]">
                            {/* Detailed Brain Picture centered */}
                            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                                <img src="/images/report/brain.png" alt="Brain" className="w-[300px] object-contain drop-shadow-[0_0_40px_rgba(251,191,36,0.05)]" draggable={false} />
                            </div>

                            {/* Left Skills (Cyan) */}
                            <div className="absolute start-0 lg:start-4 inset-y-0 flex flex-col justify-between py-[8%] w-[42%] lg:w-[38%]">
                                {/* Listening (Top Left) */}
                                <div>
                                    <h3 className="text-cyan-400 font-extrabold text-[22px] tracking-widest uppercase mb-4 drop-shadow-lg drop-shadow-cyan-500/20">LISTENING</h3>
                                    <div className="space-y-4 relative z-10">
                                        <SubSkillNode icon={<FileText className="w-3.5 h-3.5" />} label="Audio Mastered" />
                                        <div className="ps-4">
                                            <SubSkillNode icon={<Eye className="w-3.5 h-3.5" />} label="Speaking" />
                                        </div>
                                        <div className="ps-8">
                                            <SubSkillNode icon={<BookOpen className="w-3.5 h-3.5" />} label="Words Written" />
                                        </div>
                                    </div>
                                </div>
                                {/* Reading (Bottom Left) */}
                                <div className="mt-8">
                                    <h3 className="text-cyan-400 font-extrabold text-[22px] tracking-widest uppercase mb-4 drop-shadow-lg drop-shadow-cyan-500/20">READING</h3>
                                    <div className="space-y-4 relative z-10">
                                        <div className="ps-4">
                                            <SubSkillNode icon={<Eye className="w-3.5 h-3.5" />} label="Visual Associations" />
                                        </div>
                                        <SubSkillNode icon={<BookOpen className="w-3.5 h-3.5" />} label="Words Read" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Skills (Gold) */}
                            <div className="absolute end-0 lg:end-4 inset-y-0 flex flex-col justify-between py-[8%] w-[42%] lg:w-[38%] items-end">
                                {/* Writing (Top Right) */}
                                <div className="flex flex-col items-end">
                                    <h3 className="text-amber-400 font-extrabold text-[22px] tracking-widest uppercase mb-4 drop-shadow-lg drop-shadow-amber-500/20">WRITING</h3>
                                    <div className="space-y-4 relative z-10 flex flex-col items-end">
                                        <SubSkillNode icon={<Eye className="w-3.5 h-3.5" />} label="Visual Learning" isRight />
                                        <div className="pe-4">
                                            <SubSkillNode icon={<BookOpen className="w-3.5 h-3.5" />} label="Words Written" isRight />
                                        </div>
                                    </div>
                                </div>
                                {/* Speaking (Bottom Right) */}
                                <div className="mt-8 flex flex-col items-end">
                                    <h3 className="text-amber-400 font-extrabold text-[22px] tracking-widest uppercase mb-4 drop-shadow-lg drop-shadow-amber-500/20">SPEAKING</h3>
                                    <div className="space-y-4 relative z-10 flex flex-col items-end">
                                        <div className="pe-4">
                                            <SubSkillNode icon={<Eye className="w-3.5 h-3.5" />} label="Visual Associations" isRight />
                                        </div>
                                        <SubSkillNode icon={<BookOpen className="w-3.5 h-3.5" />} label="Words Written" isRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- LINGUISTIC ARSENAL TOP (RIGHT) --- */}
                    <div className="relative rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-8 shadow-2xl flex flex-col justify-between">

                        {/* Top layout: Coin + Label + Title */}
                        <div className="flex items-start gap-8 relative z-10 pt-2">
                            <GoldCoin value={report.arsenal.masteredWords} label={t.masteredWords} />

                            <div className="flex-1 pt-3">
                                <h1 className="text-[26px] font-black text-white tracking-wide mb-5">{t.arsenal}</h1>

                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                    <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">{t.idiomsPhrasal}</span>
                                    <Plus className="w-5 h-5 text-purple-500 ms-1 -me-1" />
                                    <span className="text-xl font-bold text-white">{report.arsenal.idioms + report.arsenal.phrasalVerbs}</span>
                                </div>

                                <p className="text-[10px] text-zinc-400 font-bold tracking-[0.1em] ms-1 uppercase">
                                    {t.voiceTraining}: {report.skills.speaking.tasksCompleted} {t.hours}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar Section */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase mb-2">
                                <span className="text-zinc-400">{t.wordsMastered}</span>
                                <span className="text-[#00d084] flex items-center gap-1.5 font-bold text-[11px]">
                                    {report.arsenal.fluencyPercent}% <span className="text-zinc-500 font-medium tracking-wide">FLUENCY {report.skills.listening.tasksCompleted} HOURS</span> <Mic className="w-3.5 h-3.5 text-zinc-500" />
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-[6px] bg-[#1a1f26] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00d084] rounded-full" style={{ width: `${report.arsenal.fluencyPercent}%` }} />
                                </div>
                                <span className="text-[#00d084] font-bold text-sm leading-none">{report.arsenal.fluencyPercent}%</span>
                            </div>

                            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.1em] mt-4 uppercase">
                                SENTENCES TAKEN: {report.skills.writing.tasksCompleted} | VOICES SHARED: {report.skills.listening.tasksCompleted} HOURS
                            </p>

                            {/* 2x2 Stats Grid exactly like mockup */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-7 mt-8 border-t border-gray-800/50 pt-6">
                                {/* Col 1 */}
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex items-start justify-between pe-2">
                                        <div className="flex items-start gap-2">
                                            <Map className="w-4 h-4 text-zinc-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-snug uppercase">GRAMMAR RULES<br />UNLOCKED</span>
                                            </div>
                                        </div>
                                        <span className="text-base font-bold text-white">{report.arsenal.grammarRules}</span>
                                    </div>
                                    <div className="flex items-center justify-between pe-2">
                                        <div className="flex items-center gap-2">
                                            <CheckSquare className="w-4 h-4 text-zinc-400" />
                                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-snug uppercase">CORRECT ANSWERS</span>
                                        </div>
                                        <span className="text-base font-bold text-white">{report.quizzes.correctAnswers}</span>
                                    </div>
                                </div>

                                {/* Col 2 */}
                                <div className="flex flex-col gap-6 w-full">
                                    <div className="flex items-start justify-between pe-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-zinc-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-snug uppercase">QUIZZES COMPLETED<br />COMPLETED: {report.quizzes.averageScore}%</span>
                                            </div>
                                        </div>
                                        <span className="text-base font-bold text-white">{report.quizzes.completed}</span>
                                    </div>
                                    <div className="flex items-start justify-between pe-2">
                                        <div className="flex items-start gap-2">
                                            <CheckSquare className="w-4 h-4 text-zinc-400 mt-0.5" />
                                            <span className="text-[10px] text-zinc-400 font-bold tracking-widest leading-snug uppercase">CURRENT<br />STREAK</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center pt-1">
                                            <span className="text-base font-bold text-white leading-none">{report.journey.currentStreak}</span>
                                            <span className="text-[10px] font-bold text-white leading-tight uppercase mt-1">DAYS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ════ ROW 2: Knowledge Fortress & Journey Timeline ════ */}
                <div className="flex flex-col items-center w-full py-2 relative">
                    <h2 className="text-2xl font-bold tracking-widest uppercase text-gray-200 mb-6 drop-shadow-md">{t.knowledgeFortress}</h2>

                    <div className="flex w-full justify-center items-center gap-4 relative z-10 px-2 flex-wrap lg:flex-nowrap max-w-4xl">
                        {/* Left: Journey Timeline Pill */}
                        <div className="flex items-center gap-4 px-8 py-3.5 rounded-[1rem] border border-zinc-700/50 bg-[#14171d] shadow-lg">
                            <CalendarDays className="w-6 h-6 text-zinc-400" />
                            <span className="text-lg font-bold text-white tracking-wide">{t.journeyTimeline}</span>
                        </div>

                        {/* Middle: Active Pill */}
                        <div className="flex items-center rounded-[1rem] border border-zinc-700/50 bg-[#14171d] flex-1 justify-center divide-x divide-zinc-700/50 shadow-inner max-w-xl overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4">
                                <Clock className="w-5 h-5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase truncate">
                                    ACTIVE {report.journey.activeSince ? new Date(report.journey.activeSince).toLocaleDateString(isAr ? 'ar' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-zinc-800/20">
                                <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">ACTIVE STREAK</span>
                                <span className="text-white text-base font-bold whitespace-nowrap">{report.journey.currentStreak} DAYS</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Shield */}
                    <div className="absolute end-4 -top-8 z-20 flex flex-col items-center">
                        <img src="/images/report/shield.png" alt="Level Shield" className="w-[120px] lg:w-[140px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] select-none bg-transparent" />
                        <span className="bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1 text-[11px] font-bold text-gray-300 uppercase tracking-widest mt-1 drop-shadow-md">
                            {levelTitle}
                        </span>
                    </div>
                </div>

                {/* ════ ROW 3: Linguistic Arsenal Bottom Cards ════ */}
                <div className="rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-8 shadow-2xl relative">
                    <h2 className="text-xl md:text-2xl text-gray-300 font-normal tracking-wide mb-8">Linguistic Arsenal</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-center">
                        {/* Two big rings on left */}
                        <div className="flex items-center gap-12 ps-4">
                            {/* Cyan Ring (Book Inside) */}
                            <div className="flex flex-col items-center gap-5 border-r border-zinc-800/60 pr-12">
                                <div className="relative w-32 h-32 flex items-center justify-center rounded-full">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="58" fill="none" stroke="#1f2937" strokeWidth="8" />
                                        <circle cx="64" cy="64" r="58" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round" strokeDasharray="364" strokeDashoffset={364 - (364 * (report.arsenal.fluencyPercent / 100))} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                    </svg>
                                    <BookOpen className="w-10 h-10 text-zinc-300" strokeWidth={1.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] text-zinc-400">Voice Training:</p>
                                    <p className="text-[13px] text-zinc-200 font-medium">{report.skills.speaking.tasksCompleted} Hours</p>
                                </div>
                            </div>

                            {/* Gold Ring (Text Inside) */}
                            <div className="flex flex-col items-center gap-5">
                                <div className="relative w-32 h-32 flex items-center justify-center rounded-full">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle cx="64" cy="64" r="58" fill="none" stroke="#1f2937" strokeWidth="8" />
                                        <circle cx="64" cy="64" r="58" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" strokeDasharray="364" strokeDashoffset={364 - (364 * Math.min(1, report.arsenal.masteredWords / 500))} style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/40 rounded-full m-2">
                                        <span className="text-3xl font-bold text-amber-100">{report.arsenal.masteredWords}</span>
                                        <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight text-center px-4 uppercase font-bold">Mastered<br />Words</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] text-zinc-400">Reading Speed:</p>
                                    <p className="text-[13px] text-zinc-200 font-medium">+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</p>
                                </div>
                            </div>
                        </div>

                        {/* Right side stats: 2x2 grid identical to mockup boxes */}
                        <div className="grid grid-cols-2 gap-4 lg:pe-4">
                            {/* Box 1 */}
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] flex flex-col justify-center shadow-lg relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4">
                                    <ScrollText className="w-7 h-7 text-zinc-400 stroke-[1.5]" />
                                    <span className="text-base text-zinc-200 tracking-wide">Idioms: {report.arsenal.idioms}</span>
                                </div>
                            </div>

                            {/* Box 2 */}
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] flex flex-col justify-center shadow-lg relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4">
                                    <Link2 className="w-7 h-7 text-zinc-400 stroke-[1.5]" />
                                    <span className="text-base text-zinc-200 tracking-wide">Phrasal Verbs: {report.arsenal.phrasalVerbs}</span>
                                </div>
                            </div>

                            {/* Box 3 */}
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] shadow-lg flex flex-col justify-center relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl font-light text-zinc-200 leading-none">{report.skills.reading.tasksCompleted}</span>
                                    <span className="text-[13px] font-medium text-zinc-400 leading-snug">Reading Speed:<br /><span className="text-zinc-300">+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</span></span>
                                </div>
                                <p className="text-[13px] text-zinc-500 tracking-wide font-medium">Quizzes Completed<br />{report.quizzes.completed} Days!</p>
                            </div>

                            {/* Box 4 */}
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] shadow-lg flex flex-col justify-center relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="absolute end-0 top-1/2 -translate-y-1/2 w-[3px] h-16 bg-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl font-light text-zinc-200 leading-none">{report.arsenal.grammarRules}</span>
                                    <span className="text-[13px] font-medium text-zinc-400 leading-snug">Grammar Rules:<br /><span className="text-zinc-300">({report.quizzes.averageScore}% Accuracy)</span></span>
                                </div>
                                <p className="text-[13px] text-zinc-500 tracking-wide font-medium">Current Streak:</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ════ ROW 4: AI Prediction ════ */}
                <div className="rounded-2xl border border-zinc-800 bg-[#161a23] p-4 px-6 flex items-center gap-4 shadow-lg overflow-hidden relative">
                    <Bot className="w-7 h-7 text-blue-400/80" strokeWidth={1.5} />
                    <p className="text-[13px] text-zinc-300 z-10 font-medium">
                        {report.aiPrediction ? (
                            <>AI Prediction: Based your progress, youre projected to reach <span className="font-bold">{report.aiPrediction.nextLevel}</span> level in {report.aiPrediction.estimatedDays} days!</>
                        ) : (
                            <>AI Prediction: Keep practicing to unlock AI-powered predictions!</>
                        )}
                    </p>
                    {/* decorative star/sparkle bottom right edge */}
                    <div className="absolute -bottom-2 -end-2 w-8 h-8 opacity-40 rotate-45 bg-gradient-to-tr from-transparent via-blue-400/10 to-transparent" />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
