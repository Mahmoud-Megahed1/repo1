// Student Report Dashboard Page
import axiosClient from '@lib/axios-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';

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
function StatCard({ icon, label, value, accent = false }: {
    icon: string;
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
            <span className="text-xl">{icon}</span>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-400 truncate">{label}</p>
                <p className={`text-lg font-bold ${accent ? 'text-amber-400' : 'text-zinc-100'}`}>{value}</p>
            </div>
        </div>
    );
}

// ─── Skill Node ──────────────────────────────────────────────────────────
function SkillNode({ label, count, side }: { label: string; count: number; side: 'left' | 'right' }) {
    return (
        <div className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.5)]" />
            <div className={`text-xs ${side === 'right' ? 'text-right' : 'text-left'}`}>
                <span className="font-bold text-zinc-100 text-sm">{label}</span>
                <span className="block text-zinc-500">{count} tasks</span>
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
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 py-6 px-4">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ══════════ HEADER ══════════ */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            Student Report
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            {report.user.firstName} {report.user.lastName}
                        </p>
                    </div>
                    <ShieldBadge title={levelTitle} />
                </div>

                {/* ══════════ SECTION 1: LINGUISTIC FOOTPRINT ══════════ */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8 relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl" />

                    <h2 className="text-lg font-bold text-center mb-6 tracking-wider uppercase text-zinc-300">
                        🧠 Your Linguistic Footprint
                    </h2>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center relative">
                        {/* Left Skills */}
                        <div className="flex flex-col gap-5">
                            <SkillNode label="Speaking" count={report.skills.speaking.tasksCompleted} side="left" />
                            <SkillNode label="Listening" count={report.skills.listening.tasksCompleted} side="left" />
                        </div>

                        {/* Brain Center */}
                        <div className="relative">
                            <BrainSvg />
                        </div>

                        {/* Right Skills */}
                        <div className="flex flex-col gap-5">
                            <SkillNode label="Reading" count={report.skills.reading.tasksCompleted} side="right" />
                            <SkillNode label="Writing" count={report.skills.writing.tasksCompleted} side="right" />
                        </div>
                    </div>

                    {/* Grammar label below */}
                    <div className="flex justify-center mt-4">
                        <div className="flex items-center gap-2 bg-zinc-800/60 rounded-full px-4 py-2 border border-zinc-700/50">
                            <span className="text-amber-400 font-bold text-sm">Grammar</span>
                            <span className="text-zinc-400 text-xs">{report.skills.grammar.tasksCompleted} rules</span>
                        </div>
                    </div>
                </section>

                {/* ══════════ SECTION 2: LINGUISTIC ARSENAL ══════════ */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8">
                    <h2 className="text-lg font-bold mb-6 tracking-wider uppercase text-zinc-300">
                        ⚔️ Linguistic Arsenal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
                        {/* Progress Rings */}
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className="relative">
                                <ProgressRing
                                    percent={Math.min(100, (report.arsenal.masteredWords / 1000) * 100)}
                                    color="#d97706"
                                    label="Mastered Words"
                                    value={report.arsenal.masteredWords}
                                    size={130}
                                    strokeWidth={10}
                                />
                            </div>
                            <div className="relative">
                                <ProgressRing
                                    percent={report.arsenal.fluencyPercent}
                                    color="#06b6d4"
                                    label="Fluency"
                                    value={`${report.arsenal.fluencyPercent}%`}
                                    size={130}
                                    strokeWidth={10}
                                />
                            </div>
                        </div>

                        {/* Arsenal Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard icon="📖" label="Grammar Rules" value={report.arsenal.grammarRules} accent />
                            <StatCard icon="💬" label="Idioms" value={report.arsenal.idioms} />
                            <StatCard icon="🔗" label="Phrasal Verbs" value={report.arsenal.phrasalVerbs} />
                            <StatCard icon="✅" label="Quizzes Done" value={report.quizzes.completed} accent />
                            <StatCard icon="🎯" label="Correct Answers" value={report.quizzes.correctAnswers} />
                            <StatCard icon="📊" label="Average Score" value={`${report.quizzes.averageScore}%`} />
                        </div>
                    </div>
                </section>

                {/* ══════════ SECTION 3: JOURNEY TIMELINE ══════════ */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8">
                    <h2 className="text-lg font-bold mb-6 tracking-wider uppercase text-zinc-300">
                        📅 Journey Timeline
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-4 text-center">
                            <p className="text-2xl font-bold text-cyan-400">{report.journey.currentStreak}</p>
                            <p className="text-xs text-zinc-400 mt-1">Current Streak</p>
                            <p className="text-[10px] text-zinc-500">days</p>
                        </div>
                        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-4 text-center">
                            <p className="text-2xl font-bold text-amber-400">{report.journey.totalActiveDays}</p>
                            <p className="text-xs text-zinc-400 mt-1">Active Days</p>
                            <p className="text-[10px] text-zinc-500">total</p>
                        </div>
                        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-4 text-center">
                            <p className="text-2xl font-bold text-emerald-400">{report.journey.totalCompletedDays}</p>
                            <p className="text-xs text-zinc-400 mt-1">Days Completed</p>
                            <p className="text-[10px] text-zinc-500">across all levels</p>
                        </div>
                        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700/50 p-4 text-center">
                            <p className="text-2xl font-bold text-purple-400">
                                {report.journey.activeSince
                                    ? new Date(report.journey.activeSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                    : '—'}
                            </p>
                            <p className="text-xs text-zinc-400 mt-1">Member Since</p>
                            <p className="text-[10px] text-zinc-500">active</p>
                        </div>
                    </div>

                    {/* Visual timeline bar */}
                    <div className="mt-6 relative">
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (report.journey.totalCompletedDays / 50) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] text-zinc-500">
                            <span>Day 1</span>
                            <span>Day 25</span>
                            <span>Day 50</span>
                        </div>
                    </div>
                </section>

                {/* ══════════ SECTION 4: KNOWLEDGE FORTRESS ══════════ */}
                <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm p-5 md:p-8">
                    <h2 className="text-lg font-bold mb-6 tracking-wider uppercase text-zinc-300">
                        🛡️ Knowledge Fortress
                    </h2>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {['LEVEL_A1', 'LEVEL_A2', 'LEVEL_B1', 'LEVEL_B2', 'LEVEL_C1', 'LEVEL_C2'].map((level) => {
                            const isPurchased = report.purchasedLevels.includes(level);
                            const isCompleted = report.completedLevels.includes(level);
                            const isCurrent = report.currentLevel?.name === level;
                            const label = level.replace('LEVEL_', '');

                            return (
                                <div
                                    key={level}
                                    className={`
                    flex flex-col items-center gap-1 rounded-xl border-2 px-5 py-3 min-w-[70px] transition-all duration-300
                    ${isCompleted
                                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                                            : isCurrent
                                                ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(217,119,6,0.2)] scale-105'
                                                : isPurchased
                                                    ? 'border-cyan-500/50 bg-cyan-500/5'
                                                    : 'border-zinc-700/30 bg-zinc-800/30 opacity-40'
                                        }
                  `}
                                >
                                    <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-zinc-500'
                                        }`}>
                                        {label}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">
                                        {isCompleted ? '✅ Done' : isCurrent ? '🔥 Active' : isPurchased ? '📦 Owned' : '🔒 Locked'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {report.currentLevel && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-zinc-400">
                                Currently on <span className="text-amber-400 font-bold">Day {report.currentLevel.currentDay}</span> of{' '}
                                <span className="font-medium text-zinc-300">{report.currentLevel.title}</span>
                            </p>
                        </div>
                    )}
                </section>

                {/* ══════════ SECTION 5: AI PREDICTION ══════════ */}
                {report.aiPrediction && (
                    <section className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/5 via-zinc-900 to-cyan-500/5 backdrop-blur-sm p-5 md:p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🤖</div>
                            <div>
                                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-1">AI Prediction</h3>
                                <p className="text-zinc-300">
                                    Based on your progress, you're projected to reach{' '}
                                    <span className="font-bold text-amber-400">{report.aiPrediction.nextLevel}</span>{' '}
                                    level in approximately{' '}
                                    <span className="font-bold text-cyan-400">{report.aiPrediction.estimatedDays} days</span>!
                                </p>
                                <p className="text-xs text-zinc-500 mt-2">
                                    Keep your streak going to achieve this faster! 🚀
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ══════════ FOOTER ══════════ */}
                <div className="text-center py-4">
                    <p className="text-xs text-zinc-600">
                        Report generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
