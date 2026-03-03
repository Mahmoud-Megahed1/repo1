// Student Report Dashboard Page
import axiosClient from '@lib/axios-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import {
    Brain,
    Swords,
    CalendarDays,
    Sparkles,
    BookOpen,
    MessageSquareQuote,
    GitMerge,
    CheckCircle,
    Target,
    BarChart3
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────
interface StudentReport {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
    };
    currentLevel: {
        name: string;
        title: string;
        currentDay: number;
        isCompleted: boolean;
    } | null;
    skills: {
        reading: { tasksCompleted: number };
        writing: { tasksCompleted: number };
        listening: { tasksCompleted: number };
        speaking: { tasksCompleted: number };
        grammar: { tasksCompleted: number };
    };
    arsenal: {
        masteredWords: number;
        grammarRules: number;
        idioms: number;
        phrasalVerbs: number;
        fluencyPercent: number;
    };
    quizzes: {
        completed: number;
        averageScore: number;
        correctAnswers: number;
    };
    journey: {
        activeSince: string | null;
        currentStreak: number;
        totalActiveDays: number;
        totalCompletedDays: number;
    };
    aiPrediction: {
        nextLevel: string;
        estimatedDays: number;
    } | null;
    purchasedLevels: string[];
    completedLevels: string[];
}

// ─── Route ───────────────────────────────────────────────────────────────
export const Route = createFileRoute(
    '/$locale/_globalLayout/_auth/app/report'
)({
    component: ReportPage,
});

// ─── SVG Components ──────────────────────────────────────────────────────

function BrainSvg() {
    return (
        <svg viewBox="0 0 200 160" className="w-full max-w-[280px] mx-auto" aria-hidden="true">
            {/* Left Hemisphere - Cyan/Teal */}
            <defs>
                <linearGradient id="leftBrain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="rightBrain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.7" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Left Brain */}
            <path
                d="M98 80 C98 40, 78 15, 55 18 C32 21, 20 40, 22 60 C24 80, 35 95, 45 105 C55 115, 75 120, 98 115 Z"
                fill="url(#leftBrain)"
                className="animate-pulse"
                style={{ animationDuration: '4s' }}
            />
            {/* Brain folds left */}
            <path d="M40 45 Q55 50, 60 65" stroke="#0e7490" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M35 65 Q50 60, 65 75" stroke="#0e7490" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M45 85 Q60 80, 75 90" stroke="#0e7490" strokeWidth="1.5" fill="none" opacity="0.4" />

            {/* Right Brain */}
            <path
                d="M102 80 C102 40, 122 15, 145 18 C168 21, 180 40, 178 60 C176 80, 165 95, 155 105 C145 115, 125 120, 102 115 Z"
                fill="url(#rightBrain)"
                className="animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '1s' }}
            />
            {/* Brain folds right */}
            <path d="M160 45 Q145 50, 140 65" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M165 65 Q150 60, 135 75" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M155 85 Q140 80, 125 90" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.4" />

            {/* Center line */}
            <line x1="100" y1="15" x2="100" y2="118" stroke="#374151" strokeWidth="1" opacity="0.3" />

            {/* Glow effect */}
            <circle cx="100" cy="65" r="40" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" filter="url(#glow)" />
        </svg>
    );
}

function ProgressRing({ percent, size = 120, strokeWidth = 8, color = '#d97706', label, value }: {
    percent: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label: string;
    value: string | number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    className="text-zinc-700/30"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 1.5s ease-in-out',
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <span className="text-2xl font-bold text-amber-400">{value}</span>
                <span className="text-[10px] text-zinc-400 text-center leading-tight max-w-[70px]">{label}</span>
            </div>
        </div>
    );
}

function ShieldBadge({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 80 100" className="w-16 h-20 drop-shadow-lg">
                <defs>
                    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                </defs>
                <path
                    d="M40 5 L72 20 L72 55 C72 70 58 85 40 95 C22 85 8 70 8 55 L8 20 Z"
                    fill="url(#shieldGold)"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                />
                <text x="40" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="serif">
                    🦅
                </text>
            </svg>
            <span className="text-xs font-bold text-amber-400 bg-zinc-800 px-3 py-1 rounded-full border border-amber-500/30">
                {title}
            </span>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = false }: {
    icon: any;
    label: string;
    value: string | number;
    accent?: boolean;
}) {
    return (
        <div className={`
      flex items-center gap-3 rounded-xl border px-4 py-3
      ${accent
                ? 'border-amber-500/30 bg-amber-500/5'
                : 'border-zinc-700/50 bg-zinc-800/50'
            }
      transition-all duration-300 hover:border-amber-500/50 hover:bg-zinc-800/80
    `}>
            <div className={`p-2 rounded-lg ${accent ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-zinc-400 uppercase tracking-widest truncate">{label}</p>
                <p className={`text-lg font-black ${accent ? 'text-amber-400' : 'text-zinc-100'}`}>{value}</p>
            </div>
        </div>
    );
}

// ─── Main Report Page ────────────────────────────────────────────────────
function ReportPage() {
    useEffect(() => {
        useBreadcrumbStore
            .getState()
            .setItems([{ label: 'Student Report', isCurrent: true }]);
    }, []);

    const { data: report, isLoading, error } = useQuery<StudentReport>({
        queryKey: ['student-report'],
        queryFn: async () => {
            const res = await axiosClient.get<StudentReport>('/users/report');
            return res.data;
        },
        refetchOnMount: true,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-400 animate-pulse">Loading your report...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-xl text-red-400">⚠️ Failed to load report</p>
                    <p className="text-zinc-500 text-sm">Please try again later</p>
                </div>
            </div>
        );
    }

    const levelTitle = report.currentLevel?.title || 'Beginner';

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-zinc-100 py-8 px-4 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ══════════ HEADER ══════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 bg-clip-text text-transparent">
                            Student Report
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base mt-2 font-medium tracking-wide">
                            {report.user.firstName} {report.user.lastName} • <span className="text-amber-500">{levelTitle}</span>
                        </p>
                    </div>
                </div>

                {/* ══════════ MAIN GRID ══════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Linguistic Footprint */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <section className="flex-1 rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col">
                            {/* Decorative Background Glows */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05)_0%,transparent_70%)] pointer-events-none" />
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                            <h2 className="text-2xl font-bold text-center mb-10 tracking-[0.2em] uppercase text-zinc-200 drop-shadow-sm flex items-center justify-center gap-3">
                                <Brain className="w-6 h-6 text-cyan-400" />
                                Linguistic Footprint
                            </h2>

                            <div className="relative flex-1 flex flex-col items-center justify-center min-h-[400px]">
                                {/* Central Brain Graphic */}
                                <div className="absolute inset-0 flex items-center justify-center scale-125 z-0">
                                    <BrainSvg />
                                </div>

                                {/* The 4 Skills Nodes around the Brain */}
                                <div className="absolute inset-0 z-10">
                                    {/* Top Left: Reading */}
                                    <div className="absolute top-[10%] left-[5%] text-left">
                                        <h3 className="text-2xl font-black text-cyan-400 tracking-wider drop-shadow-lg">READING</h3>
                                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">{report.skills.reading.tasksCompleted} Tasks</p>
                                    </div>

                                    {/* Top Right: Writing */}
                                    <div className="absolute top-[10%] right-[5%] text-right">
                                        <h3 className="text-2xl font-black text-amber-400 tracking-wider drop-shadow-lg">WRITING</h3>
                                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">{report.skills.writing.tasksCompleted} Tasks</p>
                                    </div>

                                    {/* Bottom Left: Listening */}
                                    <div className="absolute bottom-[10%] left-[5%] text-left">
                                        <h3 className="text-2xl font-black text-cyan-400 tracking-wider drop-shadow-lg">LISTENING</h3>
                                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">{report.skills.listening.tasksCompleted} Tasks</p>
                                    </div>

                                    {/* Bottom Right: Speaking */}
                                    <div className="absolute bottom-[10%] right-[5%] text-right">
                                        <h3 className="text-2xl font-black text-amber-400 tracking-wider drop-shadow-lg">SPEAKING</h3>
                                        <p className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-widest">{report.skills.speaking.tasksCompleted} Tasks</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Arsenal, Timeline, Prediction */}
                    <div className="lg:col-span-7 flex flex-col gap-8">

                        {/* ══════════ LINGUISTIC ARSENAL ══════════ */}
                        <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 relative overflow-hidden">
                            <h2 className="text-xl font-bold mb-8 tracking-[0.15em] uppercase text-zinc-300 flex items-center gap-3">
                                <Swords className="text-amber-500 w-6 h-6" /> Linguistic Arsenal
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left Side: Rings */}
                                <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
                                    <ProgressRing
                                        percent={Math.min(100, (report.arsenal.masteredWords / 1000) * 100)}
                                        color="#fbbf24"
                                        label="Mastered Words"
                                        value={report.arsenal.masteredWords}
                                        size={140}
                                        strokeWidth={12}
                                    />
                                    <ProgressRing
                                        percent={report.arsenal.fluencyPercent}
                                        color="#22d3ee"
                                        label="Fluency Level"
                                        value={`${report.arsenal.fluencyPercent}%`}
                                        size={140}
                                        strokeWidth={12}
                                    />
                                </div>

                                {/* Right Side: Stat Grid */}
                                <div className="grid grid-cols-1 gap-4 flex-1">
                                    <StatCard icon={BookOpen} label="Grammar Rules" value={report.arsenal.grammarRules} accent />
                                    <StatCard icon={MessageSquareQuote} label="Idioms" value={report.arsenal.idioms} />
                                    <StatCard icon={GitMerge} label="Phrasal Verbs" value={report.arsenal.phrasalVerbs} />
                                    <StatCard icon={CheckCircle} label="Quizzes Done" value={report.quizzes.completed} accent />
                                    <StatCard icon={Target} label="Correct Answers" value={report.quizzes.correctAnswers} />
                                    <StatCard icon={BarChart3} label="Average Score" value={`${report.quizzes.averageScore}%`} />
                                </div>
                            </div>
                        </section>

                        {/* ══════════ TIMELINE & PROGRESS ══════════ */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Journey Timeline */}
                            <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold tracking-[0.1em] uppercase text-zinc-300 flex items-center gap-2">
                                        <CalendarDays className="text-emerald-400 w-5 h-5" /> Journey Timeline
                                    </h2>
                                    <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                        Active
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Active Streak</p>
                                            <p className="text-3xl font-black text-amber-400">{report.journey.currentStreak} Days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Total Days</p>
                                            <p className="text-xl font-bold text-zinc-300">{report.journey.totalActiveDays}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                                            <span>Level Progress</span>
                                            <span className="text-cyan-400">{report.journey.totalCompletedDays} / 50</span>
                                        </p>
                                        <div className="h-2.5 bg-zinc-800/80 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${Math.min(100, (report.journey.totalCompletedDays / 50) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shield Badge & Prediction */}
                            <section className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
                                <div className="mb-6 scale-125">
                                    <ShieldBadge title={levelTitle} />
                                </div>

                                {report.aiPrediction ? (
                                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 w-full relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-10">
                                            <Sparkles className="w-24 h-24 text-purple-400" />
                                        </div>
                                        <div className="flex flex-col gap-1 relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-4 h-4 text-purple-400" />
                                                <p className="text-xs text-purple-300 uppercase tracking-widest font-bold">AI Prediction</p>
                                            </div>
                                            <p className="text-sm text-zinc-300 leading-relaxed text-left">
                                                Trending towards <span className="text-amber-400 font-bold">{report.aiPrediction.nextLevel}</span> in <span className="text-cyan-400 font-bold">{report.aiPrediction.estimatedDays} days</span>. Keep going!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 w-full">
                                        <p className="text-sm text-zinc-400">Keep practicing to unlock AI predictions.</p>
                                    </div>
                                )}
                            </section>

                        </div>
                    </div>
                </div>

                {/* ══════════ FOOTER ══════════ */}
                <div className="text-center pt-8 pb-4 opacity-50">
                    <p className="text-xs font-medium tracking-widest uppercase">
                        Report generated • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
