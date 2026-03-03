// Student Report Dashboard Page — Matches Client Mockup
import axiosClient from '@lib/axios-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import {
    Swords,
    CalendarDays,
    Sparkles,
    BookOpen,
    MessageSquareQuote,
    Link2,
    CheckCircle,
    Target,
    BarChart3,
    Clock,
    Award,
    Mic,
    Eye,
    Headphones,
    PenTool,
    BookOpenCheck,
    Volume2,
    Layers,
    ShieldCheck,
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

// ─── SVG: Brain Illustration ─────────────────────────────────────────────
function BrainSvg() {
    return (
        <svg viewBox="0 0 220 180" className="w-full max-w-[320px] mx-auto drop-shadow-2xl" aria-hidden="true">
            <defs>
                <linearGradient id="leftBrain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity="0.75" />
                </linearGradient>
                <linearGradient id="rightBrain" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.75" />
                </linearGradient>
                <filter id="brainGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="softGlow">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ambient glow behind brain */}
            <ellipse cx="110" cy="90" rx="70" ry="55" fill="#06b6d4" opacity="0.04" filter="url(#softGlow)" />
            <ellipse cx="110" cy="90" rx="70" ry="55" fill="#d97706" opacity="0.03" filter="url(#softGlow)" />

            {/* Left Hemisphere */}
            <path
                d="M108 85 C108 42, 86 14, 60 17 C34 20, 20 42, 22 64 C24 86, 36 102, 48 112 C60 122, 82 128, 108 122 Z"
                fill="url(#leftBrain)"
                filter="url(#brainGlow)"
            />
            {/* Left folds */}
            <path d="M42 45 Q58 52, 65 68" stroke="#0e7490" strokeWidth="1.5" fill="none" opacity="0.45" />
            <path d="M36 68 Q54 62, 70 78" stroke="#0e7490" strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M48 90 Q65 85, 80 95" stroke="#0e7490" strokeWidth="1.2" fill="none" opacity="0.35" />
            <path d="M55 108 Q72 100, 90 105" stroke="#0e7490" strokeWidth="1" fill="none" opacity="0.3" />

            {/* Right Hemisphere */}
            <path
                d="M112 85 C112 42, 134 14, 160 17 C186 20, 200 42, 198 64 C196 86, 184 102, 172 112 C160 122, 138 128, 112 122 Z"
                fill="url(#rightBrain)"
                filter="url(#brainGlow)"
            />
            {/* Right folds */}
            <path d="M178 45 Q162 52, 155 68" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.45" />
            <path d="M184 68 Q166 62, 150 78" stroke="#92400e" strokeWidth="1.5" fill="none" opacity="0.4" />
            <path d="M172 90 Q155 85, 140 95" stroke="#92400e" strokeWidth="1.2" fill="none" opacity="0.35" />
            <path d="M165 108 Q148 100, 130 105" stroke="#92400e" strokeWidth="1" fill="none" opacity="0.3" />

            {/* Center divide */}
            <line x1="110" y1="14" x2="110" y2="125" stroke="#52525b" strokeWidth="0.8" opacity="0.25" strokeDasharray="3,3" />

            {/* Neural dots */}
            <circle cx="60" cy="50" r="2" fill="#22d3ee" opacity="0.6" />
            <circle cx="45" cy="75" r="1.5" fill="#22d3ee" opacity="0.5" />
            <circle cx="75" cy="100" r="1.5" fill="#22d3ee" opacity="0.4" />
            <circle cx="160" cy="50" r="2" fill="#fbbf24" opacity="0.6" />
            <circle cx="175" cy="75" r="1.5" fill="#fbbf24" opacity="0.5" />
            <circle cx="145" cy="100" r="1.5" fill="#fbbf24" opacity="0.4" />
        </svg>
    );
}

// ─── Sub-Skill Node (connected to brain) ─────────────────────────────────
function SubSkillNode({ icon: Icon, label }: { icon: any; label: string }) {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/70 border border-zinc-700/40 backdrop-blur-sm">
            <Icon className="w-3 h-3 text-zinc-400 flex-shrink-0" />
            <span className="text-[10px] text-zinc-300 font-medium whitespace-nowrap">{label}</span>
        </div>
    );
}

// ─── Progress Ring ───────────────────────────────────────────────────────
function ProgressRing({ percent, size = 140, strokeWidth = 10, color = '#d97706', bgColor = 'rgba(255,255,255,0.05)', label, value }: {
    percent: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    label: string;
    value: string | number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center gap-3">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke={bgColor} strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke={color} strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-zinc-100">{value}</span>
                    <span className="text-[10px] text-zinc-400 text-center leading-tight uppercase tracking-wider font-medium max-w-[80px]">{label}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Shield Badge (Level Knight) ─────────────────────────────────────────
function ShieldBadge({ title, size = 'lg' }: { title: string; size?: 'sm' | 'lg' }) {
    const w = size === 'lg' ? 'w-20 h-24' : 'w-14 h-18';
    return (
        <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 80 100" className={`${w} drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]`}>
                <defs>
                    <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde68a" />
                        <stop offset="30%" stopColor="#fbbf24" />
                        <stop offset="60%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                    <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#451a03" />
                        <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                </defs>
                {/* Outer shield */}
                <path d="M40 5 L72 20 L72 55 C72 70 58 85 40 95 C22 85 8 70 8 55 L8 20 Z"
                    fill="url(#shieldGold)" stroke="#fde68a" strokeWidth="1" />
                {/* Inner shield */}
                <path d="M40 12 L65 24 L65 52 C65 64 54 76 40 84 C26 76 15 64 15 52 L15 24 Z"
                    fill="url(#shieldInner)" stroke="#b45309" strokeWidth="0.5" opacity="0.8" />
                {/* Eagle icon */}
                <text x="40" y="56" textAnchor="middle" fill="#fbbf24" fontSize="22" fontWeight="bold">🦅</text>
                {/* Laurel left */}
                <path d="M14 70 Q8 60, 12 50" stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
                {/* Laurel right */}
                <path d="M66 70 Q72 60, 68 50" stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
            </svg>
            <span className="text-xs font-bold text-amber-400 bg-zinc-900/80 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.15)]">
                {title}
            </span>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'text-zinc-400' }: {
    icon: any;
    label: string;
    value: string | number;
    color?: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-zinc-700/40 bg-zinc-800/40 backdrop-blur-sm px-4 py-3 transition-all duration-300 hover:border-zinc-600/60 hover:bg-zinc-800/70 group">
            <div className={`p-2 rounded-lg bg-zinc-800/80 ${color} group-hover:bg-zinc-700/80 transition-colors`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-semibold truncate">{label}</p>
                <p className="text-base font-bold text-zinc-100">{value}</p>
            </div>
        </div>
    );
}

// ─── Compact Stat Row (for top-right panel) ──────────────────────────────
function CompactStat({ icon: Icon, label, value, iconColor = 'text-amber-500' }: {
    icon: any;
    label: string;
    value: string | number;
    iconColor?: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`} />
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">{label}</span>
            <span className="text-sm font-black text-zinc-100 ml-auto">{value}</span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── MAIN REPORT PAGE ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
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
                <div className="flex flex-col items-center gap-5">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium tracking-wide animate-pulse">Generating your report...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3 p-8 rounded-2xl border border-red-500/20 bg-red-500/5">
                    <ShieldCheck className="w-10 h-10 text-red-400 mx-auto" />
                    <p className="text-lg text-red-400 font-bold">Failed to load report</p>
                    <p className="text-zinc-500 text-sm">Please try again later</p>
                </div>
            </div>
        );
    }

    const levelLabel = report.currentLevel?.name?.replace('LEVEL_', '') || 'A1';
    const levelTitle = `Level ${levelLabel} Knight`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f] text-zinc-100 py-6 px-4">
            <div className="max-w-7xl mx-auto space-y-5">

                {/* ══════════════════════════════════════════════════════════
                     ROW 1: LINGUISTIC FOOTPRINT (left) + ARSENAL STATS (right)
                   ══════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* ─── LEFT: YOUR LINGUISTIC FOOTPRINT ─── */}
                    <section className="lg:col-span-7 rounded-2xl border border-zinc-800/50 bg-[#12121a] p-6 md:p-8 relative overflow-hidden">
                        {/* Decorative glows */}
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/8 rounded-full blur-[80px] pointer-events-none" />

                        <h2 className="text-lg md:text-xl font-black tracking-[0.25em] uppercase text-zinc-200 mb-6 italic">
                            YOUR LINGUISTIC FOOTPRINT
                        </h2>

                        <div className="relative min-h-[380px] md:min-h-[420px]">
                            {/* Brain Center */}
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                <BrainSvg />
                            </div>

                            {/* ── Top Left: Speaking ── */}
                            <div className="absolute top-[2%] left-[0%] z-10">
                                <h3 className="text-xl md:text-2xl font-black text-cyan-400 tracking-wide mb-2">Speaking</h3>
                                <div className="flex flex-col gap-1.5 ml-1">
                                    <SubSkillNode icon={Mic} label="Audio Mastered" />
                                    <SubSkillNode icon={Volume2} label="Speaking" />
                                    <SubSkillNode icon={PenTool} label="Words Written" />
                                </div>
                            </div>

                            {/* ── Top Right: Grammar ── */}
                            <div className="absolute top-[2%] right-[0%] z-10 text-right">
                                <h3 className="text-xl md:text-2xl font-black text-amber-400 tracking-wide mb-2">Grammar</h3>
                                <div className="flex flex-col gap-1.5 items-end mr-1">
                                    <SubSkillNode icon={Eye} label="Visual Learning" />
                                    <SubSkillNode icon={PenTool} label="Words Written" />
                                </div>
                            </div>

                            {/* ── Bottom Left: Reading ── */}
                            <div className="absolute bottom-[2%] left-[0%] z-10">
                                <h3 className="text-xl md:text-2xl font-black text-cyan-400 tracking-wide mb-2">Reading</h3>
                                <div className="flex flex-col gap-1.5 ml-1">
                                    <SubSkillNode icon={Eye} label="Visual Associations" />
                                    <SubSkillNode icon={BookOpenCheck} label="Words Read" />
                                </div>
                            </div>

                            {/* ── Bottom Right: Speaking ── */}
                            <div className="absolute bottom-[2%] right-[0%] z-10 text-right">
                                <h3 className="text-xl md:text-2xl font-black text-amber-400 tracking-wide mb-2">Speaking</h3>
                                <div className="flex flex-col gap-1.5 items-end mr-1">
                                    <SubSkillNode icon={Eye} label="Visual Associations" />
                                    <SubSkillNode icon={PenTool} label="Words Written" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ─── RIGHT: LINGUISTIC ARSENAL (compact stats) ─── */}
                    <section className="lg:col-span-5 rounded-2xl border border-zinc-800/50 bg-[#12121a] p-6 relative overflow-hidden flex flex-col">
                        {/* Shield badge top-right */}
                        <div className="absolute top-4 right-4 z-10 scale-75 origin-top-right">
                            <ShieldBadge title={levelTitle} size="sm" />
                        </div>

                        <h2 className="text-lg font-black tracking-[0.2em] uppercase text-zinc-200 mb-5">
                            Linguistic Arsenal
                        </h2>

                        {/* Mastered Words Ring */}
                        <div className="flex items-center gap-6 mb-5">
                            <div className="flex-shrink-0">
                                <ProgressRing
                                    percent={Math.min(100, (report.arsenal.masteredWords / 500) * 100)}
                                    color="#fbbf24"
                                    bgColor="rgba(251,191,36,0.08)"
                                    label="Mastered Words"
                                    value={report.arsenal.masteredWords}
                                    size={110}
                                    strokeWidth={10}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <CompactStat icon={Layers} label="Idioms & Phrasal Verbs" value={report.arsenal.idioms + report.arsenal.phrasalVerbs} iconColor="text-purple-400" />
                                <CompactStat icon={Mic} label="Voice Training" value={`${report.skills.speaking.tasksCompleted}h`} iconColor="text-cyan-400" />
                            </div>
                        </div>

                        {/* Fluency Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold mb-1.5">
                                <span className="text-zinc-400">Words Mastered <span className="text-emerald-400">{report.arsenal.fluencyPercent}%</span></span>
                                <span className="text-zinc-400">Fluency</span>
                            </div>
                            <div className="h-2.5 bg-zinc-800/80 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1500 ease-out"
                                    style={{ width: `${report.arsenal.fluencyPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Stat Grid */}
                        <div className="grid grid-cols-2 gap-2 flex-1">
                            <CompactStat icon={BookOpen} label="Grammar Rules" value={report.arsenal.grammarRules} iconColor="text-amber-500" />
                            <CompactStat icon={CheckCircle} label="Quizzes Completed" value={report.quizzes.completed} iconColor="text-emerald-400" />
                            <CompactStat icon={Target} label="Correct Answers" value={report.quizzes.correctAnswers} iconColor="text-cyan-400" />
                            <CompactStat icon={BarChart3} label="Completed" value={`${report.quizzes.averageScore}%`} iconColor="text-purple-400" />
                            <CompactStat icon={Award} label="Current Streak" value={`${report.journey.currentStreak} Days`} iconColor="text-amber-400" />
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════════════════════════
                     ROW 2: JOURNEY TIMELINE (left) + KNOWLEDGE FORTRESS (right)
                   ══════════════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

                    {/* ─── Journey Timeline ─── */}
                    <section className="md:col-span-5 rounded-2xl border border-zinc-800/50 bg-[#12121a] p-5 flex items-center gap-4">
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="p-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/40">
                                <CalendarDays className="w-5 h-5 text-zinc-300" />
                            </div>
                            <span className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Journey Timeline</span>
                        </div>
                        <div className="flex-1 flex items-center justify-end gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/40">
                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs font-bold text-zinc-300 uppercase">
                                    Active {report.journey.activeSince
                                        ? new Date(report.journey.activeSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                        : '—'}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Streak</span>
                                <p className="text-lg font-black text-amber-400">{report.journey.currentStreak} Days</p>
                            </div>
                        </div>
                    </section>

                    {/* ─── Knowledge Fortress ─── */}
                    <section className="md:col-span-7 rounded-2xl border border-zinc-800/50 bg-[#12121a] p-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black tracking-[0.2em] uppercase text-zinc-200 mb-2">Knowledge Fortress</h2>
                            <div className="flex flex-wrap gap-2">
                                {['LEVEL_A1', 'LEVEL_A2', 'LEVEL_B1', 'LEVEL_B2', 'LEVEL_C1', 'LEVEL_C2'].map((level) => {
                                    const isCompleted = report.completedLevels.includes(level);
                                    const isCurrent = report.currentLevel?.name === level;
                                    const isPurchased = report.purchasedLevels.includes(level);
                                    const label = level.replace('LEVEL_', '');

                                    return (
                                        <div key={level} className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${isCompleted
                                            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                                            : isCurrent
                                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
                                                : isPurchased
                                                    ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
                                                    : 'border-zinc-700/30 bg-zinc-800/30 text-zinc-600'
                                            }`}>
                                            {label}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                            <ShieldBadge title={levelTitle} />
                        </div>
                    </section>
                </div>

                {/* ══════════════════════════════════════════════════════════
                     ROW 3: FULL LINGUISTIC ARSENAL (bottom section with rings)
                   ══════════════════════════════════════════════════════════ */}
                <section className="rounded-2xl border border-zinc-800/50 bg-[#12121a] p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

                    <h2 className="text-lg font-black tracking-[0.2em] uppercase text-zinc-200 mb-8 flex items-center gap-3">
                        <Swords className="w-5 h-5 text-amber-500" />
                        Linguistic Arsenal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-start">

                        {/* Left Side: Two Progress Rings */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
                            <div className="flex flex-col items-center gap-2">
                                <ProgressRing
                                    percent={Math.min(100, (report.skills.listening.tasksCompleted / 20) * 100)}
                                    color="#22d3ee"
                                    bgColor="rgba(34,211,238,0.08)"
                                    label="Voice Training"
                                    value={`${report.skills.listening.tasksCompleted}h`}
                                    size={150}
                                    strokeWidth={12}
                                />
                                <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Voice Training</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ProgressRing
                                    percent={Math.min(100, (report.arsenal.masteredWords / 500) * 100)}
                                    color="#fbbf24"
                                    bgColor="rgba(251,191,36,0.08)"
                                    label="Mastered Words"
                                    value={report.arsenal.masteredWords}
                                    size={150}
                                    strokeWidth={12}
                                />
                                <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Reading Speed</span>
                            </div>
                        </div>

                        {/* Right Side: Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard icon={MessageSquareQuote} label="Idioms" value={report.arsenal.idioms} color="text-purple-400" />
                            <StatCard icon={Link2} label="Phrasal Verbs" value={report.arsenal.phrasalVerbs} color="text-cyan-400" />
                            <StatCard icon={Headphones} label="Reading Speed" value={`+${(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x`} color="text-emerald-400" />
                            <StatCard icon={BookOpen} label="Grammar Rules" value={`${report.arsenal.grammarRules} (${report.quizzes.averageScore}%)`} color="text-amber-400" />
                            <StatCard icon={CheckCircle} label="Quizzes Completed" value={`${report.quizzes.completed} Days`} color="text-emerald-400" />
                            <StatCard icon={Award} label="Current Streak" value={`${report.journey.currentStreak} Days`} color="text-amber-400" />
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════════════
                     ROW 4: AI PREDICTION (bottom bar)
                   ══════════════════════════════════════════════════════════ */}
                <section className="rounded-2xl border border-zinc-800/50 bg-gradient-to-r from-[#12121a] via-[#15151f] to-[#12121a] px-6 py-5 flex items-center gap-4 relative overflow-hidden">
                    {/* Decorative sparkle */}
                    <div className="absolute -right-8 -bottom-8 opacity-5">
                        <Sparkles className="w-32 h-32 text-purple-400" />
                    </div>

                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>

                    <div className="flex-1 relative z-10">
                        <p className="text-xs text-purple-300 uppercase tracking-[0.2em] font-bold mb-1">AI Prediction</p>
                        {report.aiPrediction ? (
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                Based on your progress, you're projected to reach{' '}
                                <span className="font-black text-amber-400">{report.aiPrediction.nextLevel}</span>{' '}
                                level in{' '}
                                <span className="font-black text-cyan-400">{report.aiPrediction.estimatedDays} days</span>!
                            </p>
                        ) : (
                            <p className="text-sm text-zinc-400">Keep practicing to unlock AI-powered predictions.</p>
                        )}
                    </div>

                    {/* Decorative star */}
                    <div className="absolute bottom-3 right-6 text-amber-500/20">
                        <Sparkles className="w-8 h-8" />
                    </div>
                </section>

                {/* ══════════ FOOTER ══════════ */}
                <div className="text-center py-3 opacity-40">
                    <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-zinc-400">
                        Report generated • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
