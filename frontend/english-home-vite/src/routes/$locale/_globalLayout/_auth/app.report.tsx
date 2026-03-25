// Student Report Dashboard Page — Desktop Brain Diagram + Mobile Accordion
import axiosClient from '@lib/axios-client';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBreadcrumbStore } from '@hooks/use-breadcrumb-store';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/components/ui/tooltip';
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
    ScrollText,
    ChevronDown,
    Headphones,
    Volume2,
    BookMarked,
    Image,
    Type,
    Trophy,
    Pen,
    Gauge,
    MessageCircle,
    Ear,
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

// ─── Skill Feature Data ──────────────────────────────────────────────────
interface SkillFeature {
    labelEn: string;
    labelAr: string;
    tooltipEn: string;
    tooltipAr: string;
    icon: React.ReactNode;
}

interface SkillCategoryData {
    id: string;
    titleEn: string;
    titleAr: string;
    groupLabelEn: string;
    groupLabelAr: string;
    variant: 'cyan' | 'amber';
    features: SkillFeature[];
}

const CATEGORIES: SkillCategoryData[] = [
    {
        id: 'listening',
        titleEn: 'LISTENING',
        titleAr: 'الاستماع',
        groupLabelEn: 'LIVING',
        groupLabelAr: 'استيعاب',
        variant: 'cyan',
        features: [
            {
                labelEn: 'Audio Mastered',
                labelAr: 'إتقان الصوتيات',
                tooltipEn: 'Tracks the total number of audio files fully listened to by the student.',
                tooltipAr: 'تتبع عدد الملفات الصوتية التي استمع إليها الطالب بالكامل.',
                icon: <Headphones className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Audio Recognition',
                labelAr: 'تمييز الصوت',
                tooltipEn: 'The ability to understand the word immediately upon hearing it.',
                tooltipAr: 'قدرة الطالب على فهم الكلمة بمجرد سماعها.',
                icon: <Ear className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Echo Precision',
                labelAr: 'دقة الترديد',
                tooltipEn: 'Linking auditory input with the student\'s mental representation.',
                tooltipAr: 'ربط ما يسمعه الطالب بقدرته على تمثيله ذهنياً.',
                icon: <Volume2 className="w-3.5 h-3.5" />,
            },
        ],
    },
    {
        id: 'reading',
        titleEn: 'READING',
        titleAr: 'القراءة',
        groupLabelEn: 'LIVING',
        groupLabelAr: 'استيعاب',
        variant: 'cyan',
        features: [
            {
                labelEn: 'Words Read',
                labelAr: 'الكلمات المقروءة',
                tooltipEn: 'Direct tracking of the number of words the student has visually processed.',
                tooltipAr: 'تتبع مباشر لعدد الكلمات التي مر عليها بصر الطالب.',
                icon: <BookMarked className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Visual Associations',
                labelAr: 'الارتباطات البصرية',
                tooltipEn: 'Linking words with images to reinforce meaning in memory.',
                tooltipAr: 'ربط الكلمات بالصور لترسيخ المعنى في الذاكرة.',
                icon: <Image className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Sentence Meaning',
                labelAr: 'فهم الجمل',
                tooltipEn: 'The ability to grasp the word\'s meaning within the sentence context.',
                tooltipAr: 'قدرة الطالب على استيعاب معنى الكلمة داخل السياق.',
                icon: <Type className="w-3.5 h-3.5" />,
            },
        ],
    },
    {
        id: 'writing',
        titleEn: 'WRITING',
        titleAr: 'الكتابة',
        groupLabelEn: 'PRODUCING',
        groupLabelAr: 'إنتاج',
        variant: 'amber',
        features: [
            {
                labelEn: 'Daily Mastery',
                labelAr: 'تثبيت الكلمات',
                tooltipEn: 'Success indicator for full mastery of the daily 20 words.',
                tooltipAr: 'مؤشر النجاح والتمكن الكامل من الـ 20 كلمة اليومية.',
                icon: <Trophy className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Spelling Accuracy',
                labelAr: 'دقة الإملاء',
                tooltipEn: 'Measuring the spelling correctness of each target word.',
                tooltipAr: 'قياس مدى صحة كتابة الحروف لكل كلمة مستهدفة.',
                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Words Written',
                labelAr: 'الكلمات المكتوبة',
                tooltipEn: 'Statistics of the total words written by the student in gaps.',
                tooltipAr: 'إحصائية لعدد الكلمات التي كتبها الطالب في الفراغات.',
                icon: <Pen className="w-3.5 h-3.5" />,
            },
        ],
    },
    {
        id: 'speaking',
        titleEn: 'SPEAKING',
        titleAr: 'التحدث',
        groupLabelEn: 'PRODUCING',
        groupLabelAr: 'إنتاج',
        variant: 'amber',
        features: [
            {
                labelEn: 'Audio Recorded',
                labelAr: 'التسجيلات الصوتية',
                tooltipEn: 'Tracking the total number of voice tasks completed.',
                tooltipAr: 'تتبع إجمالي المهام الصوتية التي تم إنجازها.',
                icon: <Mic className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Phonetic Precision',
                labelAr: 'الدقة الصوتية',
                tooltipEn: 'Focusing on correct pronunciation and phonetic accuracy.',
                tooltipAr: 'التركيز على صحة مخارج الحروف ونطق الكلمات.',
                icon: <MessageCircle className="w-3.5 h-3.5" />,
            },
            {
                labelEn: 'Vocal Fluency',
                labelAr: 'الطلاقة اللفظية',
                tooltipEn: 'Measuring speed and continuity of speech without hesitation.',
                tooltipAr: 'قياس سرعة واستمرارية التحدث دون توقف.',
                icon: <Gauge className="w-3.5 h-3.5" />,
            },
        ],
    },
];

// ─── Desktop: Connector Line (L-shaped elbow path with glowing dot) ───────
function ConnectorLine({ side, variant = 'cyan', width = 80, yOffset = 0 }: { side: 'left' | 'right'; variant?: 'cyan' | 'amber'; width?: number; yOffset?: number }) {
    const isLeft = side === 'left';
    const color = variant === 'cyan' ? '#22d3ee' : '#fbbf24';
    const glow = variant === 'cyan'
        ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]'
        : 'drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]';

    const h = Math.abs(yOffset) > 0 ? width * 0.55 : width; // bend point
    const svgH = Math.max(12, Math.abs(yOffset) + 12);
    const cy = 6; // center Y for start

    // Build an L-shaped SVG path
    let pathD: string;
    let dotX: number, dotY: number;

    if (isLeft) {
        // Left badge → right toward brain
        if (yOffset === 0) {
            pathD = `M 0 ${cy} H ${width}`;
            dotX = width; dotY = cy;
        } else {
            pathD = `M 0 ${cy} H ${h} L ${width} ${cy + yOffset}`;
            dotX = width; dotY = cy + yOffset;
        }
    } else {
        // Right badge → left toward brain
        if (yOffset === 0) {
            pathD = `M ${width} ${cy} H 0`;
            dotX = 0; dotY = cy;
        } else {
            pathD = `M ${width} ${cy} H ${width - h} L 0 ${cy + yOffset}`;
            dotX = 0; dotY = cy + yOffset;
        }
    }

    const badgeX = isLeft ? 0 : width;

    return (
        <svg width={width} height={svgH} className="overflow-visible shrink-0">
            <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinejoin="round" />
            <circle cx={dotX} cy={dotY} r="3.5" fill={color} className={glow} />
            <circle cx={badgeX} cy={cy} r="1.5" fill={color} opacity="0.7" />
        </svg>
    );
}

// ─── Desktop: Skill Node (badge + connector + tooltip) ──────────────────
function DesktopSkillNode({
    icon,
    label,
    tooltip,
    side,
    variant = 'cyan',
    width = 80,
    yOffset = 0,
}: {
    icon: React.ReactNode;
    label: string;
    tooltip: React.ReactNode;
    side: 'left' | 'right';
    variant?: 'cyan' | 'amber';
    width?: number;
    yOffset?: number;
}) {
    const isLeft = side === 'left';
    const isCyan = variant === 'cyan';
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div dir="ltr" className={`flex items-center group hover:z-20 transition-all duration-200 hover:scale-[1.03] cursor-help ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs backdrop-blur-md shadow-lg whitespace-nowrap z-10 ${isCyan
                        ? 'border-cyan-500/30 bg-[#0f1a20]/90 text-cyan-50 hover:border-cyan-400/60'
                        : 'border-amber-500/30 bg-[#1a1508]/90 text-amber-50 hover:border-amber-400/60'
                        }`}>
                        {icon}
                        <span className="font-bold tracking-wide">{label}</span>
                    </div>
                    <div className={isLeft ? "-ml-0.5" : "-mr-0.5"}>
                        <ConnectorLine side={side} variant={variant} width={width} yOffset={yOffset} />
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side={isLeft ? 'left' : 'right'}
                sideOffset={8}
                className="max-w-[260px] text-center bg-zinc-900 text-zinc-100 border border-zinc-700 shadow-xl px-3 py-2 text-xs leading-relaxed"
            >
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

// ─── Mobile: Skill Badge with CLICK-to-expand (not hover) ────────────────
function MobileSkillBadge({
    icon,
    label,
    tooltip,
    variant = 'cyan',
}: {
    icon: React.ReactNode;
    label: string;
    tooltip: React.ReactNode;
    variant?: 'cyan' | 'amber';
}) {
    const [open, setOpen] = useState(false);
    const colors = variant === 'cyan'
        ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-200'
        : 'border-amber-500/30 bg-amber-950/40 text-amber-200';
    const activeColors = variant === 'cyan'
        ? 'border-cyan-400/60 bg-cyan-950/60 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
        : 'border-amber-400/60 bg-amber-950/60 shadow-[0_0_12px_rgba(251,191,36,0.15)]';

    return (
        <div className="flex flex-col w-full">
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold tracking-wide transition-all duration-200 backdrop-blur-sm active:scale-95 touch-manipulation ${colors} ${open ? activeColors : ''}`}
            >
                {icon}
                <span>{label}</span>
            </button>
            {open && (
                <div className="mt-1.5 mx-1 px-3 py-2.5 rounded-lg bg-zinc-900/95 border border-zinc-700 text-xs text-zinc-200 leading-relaxed">
                    {tooltip}
                </div>
            )}
        </div>
    );
}

// ─── Mobile: Accordion Card ─────────────────────────────────────────────
function MobileCategoryCard({
    category,
    isAr,
    isOpen,
    onToggle,
    tooltipBuilder,
}: {
    category: SkillCategoryData;
    isAr: boolean;
    isOpen: boolean;
    onToggle: () => void;
    tooltipBuilder: (f: SkillFeature) => React.ReactNode;
}) {
    const isCyan = category.variant === 'cyan';
    const borderColor = isCyan ? 'border-cyan-500/25' : 'border-amber-500/25';
    const borderGlow = isCyan
        ? 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]'
        : 'hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.08)]';
    const groupColor = isCyan ? 'text-cyan-500/60' : 'text-amber-500/60';
    const titleColor = isCyan ? 'text-cyan-300' : 'text-amber-200';
    const expandBorder = isOpen
        ? isCyan ? 'border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.1)]' : 'border-amber-500/40 shadow-[0_0_40px_rgba(251,191,36,0.1)]'
        : '';
    const chevronColor = isCyan ? 'text-cyan-400' : 'text-amber-400';

    return (
        <div className={`rounded-2xl bg-[#161a23] border ${borderColor} ${borderGlow} ${expandBorder} transition-all duration-300 overflow-hidden`}>
            <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 cursor-pointer group">
                <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${groupColor}`}>
                            {isAr ? category.groupLabelAr : category.groupLabelEn}
                        </span>
                        <span className={`text-xl font-black tracking-wide ${titleColor}`}>
                            {isAr ? category.titleAr : category.titleEn}
                        </span>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 ${chevronColor} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="px-5 pb-4 pt-1">
                    <div className="flex flex-wrap gap-2">
                        {category.features.map((feature, idx) => (
                            <MobileSkillBadge
                                key={idx}
                                icon={feature.icon}
                                label={isAr ? feature.labelAr : feature.labelEn}
                                tooltip={tooltipBuilder(feature)}
                                variant={category.variant}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Gold Pill for Mastered Words ──────────────────────────────────────────
function GoldCoin({ value, label }: { value: number | string; label: string }) {
    return (
        <div
            className="relative w-[5.5rem] h-[8.5rem] rounded-[2.5rem] shadow-[0_4px_30px_rgba(251,191,36,0.35)] flex flex-col items-center justify-center p-3 z-10 border-2 border-amber-300/40 mt-1 shrink-0"
            style={{ background: 'linear-gradient(135deg, #fde68a 0%, #d97706 100%)' }}
        >
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

    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        listening: true,
        reading: false,
        writing: true,
        speaking: false,
    });

    const toggleCategory = (id: string) => {
        setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        useBreadcrumbStore.getState().setItems([{ label: isAr ? 'تقرير الطالب' : 'Student Report', isCurrent: true }]);
    }, [isAr]);

    const { data: report, isLoading, error } = useQuery<StudentReport>({
        queryKey: ['student-report'],
        queryFn: async () => (await axiosClient.get<StudentReport>('/users/report')).data,
    });

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0d1117]"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
    if (error || !report) return <div className="min-h-screen flex items-center text-red-400 justify-center bg-[#0d1117]">Failed to load report.</div>;

    const levelLabel = report.currentLevel?.name?.replace('LEVEL_', '') || 'A1';
    const levelTitle = `LEVEL ${levelLabel} KNIGHT`;

    // Helper: get feature label by lang
    const fl = (f: SkillFeature) => isAr ? f.labelAr : f.labelEn;

    // Map each feature to its stat value from the report
    const featureStats: Record<string, { value: number | string; unitEn: string; unitAr: string }> = {
        'Audio Mastered': { value: report.skills.listening.tasksCompleted, unitEn: 'audio files completed', unitAr: 'ملف صوتي مكتمل' },
        'Audio Recognition': { value: report.skills.listening.tasksCompleted, unitEn: 'words recognized', unitAr: 'كلمة تم تمييزها' },
        'Echo Precision': { value: report.skills.listening.tasksCompleted, unitEn: 'echo tasks', unitAr: 'مهمة ترديد' },
        'Words Read': { value: report.skills.reading.tasksCompleted, unitEn: 'words read', unitAr: 'كلمة مقروءة' },
        'Visual Associations': { value: report.skills.reading.tasksCompleted, unitEn: 'associations made', unitAr: 'ارتباط بصري' },
        'Sentence Meaning': { value: report.skills.reading.tasksCompleted, unitEn: 'sentences analyzed', unitAr: 'جملة تم تحليلها' },
        'Daily Mastery': { value: report.arsenal.masteredWords, unitEn: 'words mastered / 20 daily', unitAr: 'كلمة متقنة / 20 يومياً' },
        'Spelling Accuracy': { value: `${report.quizzes.averageScore}%`, unitEn: 'accuracy rate', unitAr: 'نسبة الدقة' },
        'Words Written': { value: report.skills.writing.tasksCompleted, unitEn: 'words written', unitAr: 'كلمة مكتوبة' },
        'Audio Recorded': { value: report.skills.speaking.tasksCompleted, unitEn: 'recordings completed', unitAr: 'تسجيل مكتمل' },
        'Phonetic Precision': { value: `${report.quizzes.averageScore}%`, unitEn: 'pronunciation accuracy', unitAr: 'دقة النطق' },
        'Vocal Fluency': { value: `${report.arsenal.fluencyPercent}%`, unitEn: 'fluency score', unitAr: 'درجة الطلاقة' },
    };

    // Build rich tooltip: purpose text + stat value
    const buildTooltip = (f: SkillFeature): React.ReactNode => {
        const stat = featureStats[f.labelEn];
        const purposeText = isAr ? f.tooltipAr : f.tooltipEn;
        return (
            <div className="space-y-1.5">
                <p>{purposeText}</p>
                {stat && (
                    <div className="border-t border-zinc-600/50 pt-1.5 flex items-center gap-1.5">
                        <span className="text-amber-400 font-black text-sm">{stat.value}</span>
                        <span className="text-zinc-400 text-[10px]">{isAr ? stat.unitAr : stat.unitEn}</span>
                    </div>
                )}
            </div>
        );
    };

    // Categories refs
    const listening = CATEGORIES[0];
    const reading = CATEGORIES[1];
    const writing = CATEGORIES[2];
    const speaking = CATEGORIES[3];

    // Connector side & variant are now passed inline to each DesktopSkillNode
    // In LTR: listening/reading(cyan) on left, writing/speaking(amber) on right
    // In RTL: layout mirrors — writing/speaking(amber) on left, listening/reading(cyan) on right

    const t = {
        footprint: isAr ? 'بصمتك اللغوية' : 'YOUR LINGUISTIC FOOTPRINT',
        arsenal: 'Linguistic Arsenal',
        journeyTimeline: isAr ? 'الجدول الزمني' : 'Journey Timeline',
        knowledgeFortress: isAr ? 'حصن المعرفة' : 'Knowledge Fortress',
        aiPrediction: isAr ? 'توقعات الذكاء الاصطناعي:' : 'AI Prediction:',
        speaking: isAr ? 'التحدث' : 'Speaking',
        listening: isAr ? 'الاستماع' : 'Listening',
        reading: isAr ? 'القراءة' : 'Reading',
        writing: isAr ? 'الكتابة' : 'Writing',
        activeStreak: isAr ? 'سلسلة النشاط' : 'ACTIVE STREAK',
        masteredWords: isAr ? 'كلمات متقنة' : 'Mastered\nWords',
        idiomsPhrasal: isAr ? 'مصطلحات وأفعال مركبة' : 'IDIOMS & PHRASAL VERBS',
        voiceTraining: isAr ? 'تدريب صوتي' : 'VOICE TRAINING',
        wordsMastered: isAr ? 'كلمات متقنة' : 'WORDS MASTERED',
        fluency: isAr ? 'الفصاحة' : 'FLUENCY',
        hours: isAr ? 'ساعات' : 'HOURS',
        days: isAr ? 'أيام' : 'DAYS',
        active: isAr ? 'نشط' : 'ACTIVE',
        idioms: isAr ? 'مصطلحات' : 'Idioms',
        phrasalVerbs: isAr ? 'أفعال مركبة' : 'Phrasal Verbs',
        readingSpeed: isAr ? 'سرعة القراءة' : 'Reading Speed',
        accuracy: isAr ? 'دقة' : 'Accuracy',
        grammarRules: isAr ? 'قواعد نحوية' : 'Grammar Rules',
    };

    return (
        <div className="min-h-screen w-full bg-[#0d1117] py-8 pb-16" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="max-w-[1100px] mx-auto px-4 lg:px-6 space-y-6 lg:space-y-8 font-sans">

                {/* ═══════════ ROW 1: Top Section ═══════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8">

                    {/* ─── LINGUISTIC FOOTPRINT ─── */}
                    <div className="relative rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-5 lg:p-8 shadow-2xl flex flex-col">
                        <div className="absolute inset-x-20 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

                        <h2 className="text-lg md:text-2xl font-black text-gray-200 uppercase tracking-widest italic text-center mt-2 drop-shadow-md">
                            {t.footprint}
                            <div className="h-0.5 w-48 md:w-64 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto mt-2 opacity-80" />
                        </h2>

                        {/* ══════ DESKTOP: Brain Diagram with Arrows ══════ */}
                        {/* Layout is ALWAYS the same for both EN/AR: Cyan(Listening+Reading) on LEFT, Amber(Writing+Speaking) on RIGHT */}
                        <div style={{ direction: 'ltr', unicodeBidi: 'isolate' }} className="hidden lg:flex relative items-center justify-between w-full mt-10 mb-4 h-[420px]">
                            {/* LEFT COLUMN: Listening + Reading (cyan) — always */}
                            <div className="flex flex-col justify-between h-full relative z-10 w-[38%] py-2">
                                {/* LISTENING */}
                                <div>
                                    <h3 className="text-cyan-400 font-bold text-3xl tracking-wide mb-5 drop-shadow-md">
                                        {t.listening}
                                    </h3>
                                    <div className="flex flex-col gap-4 items-start">
                                        <DesktopSkillNode icon={listening.features[0].icon} label={fl(listening.features[0])} tooltip={buildTooltip(listening.features[0])} side="left" variant="cyan" width={100} />
                                        <DesktopSkillNode icon={listening.features[1].icon} label={fl(listening.features[1])} tooltip={buildTooltip(listening.features[1])} side="left" variant="cyan" width={80} />
                                        <DesktopSkillNode icon={listening.features[2].icon} label={fl(listening.features[2])} tooltip={buildTooltip(listening.features[2])} side="left" variant="cyan" width={90} />
                                    </div>
                                </div>
                                {/* READING */}
                                <div className="mt-6">
                                    <h3 className="text-cyan-400 font-bold text-3xl tracking-wide mb-5 drop-shadow-md">
                                        {t.reading}
                                    </h3>
                                    <div className="flex flex-col gap-4 items-start">
                                        <DesktopSkillNode icon={reading.features[1].icon} label={fl(reading.features[1])} tooltip={buildTooltip(reading.features[1])} side="left" variant="cyan" width={70} />
                                        <DesktopSkillNode icon={reading.features[0].icon} label={fl(reading.features[0])} tooltip={buildTooltip(reading.features[0])} side="left" variant="cyan" width={90} />
                                        <DesktopSkillNode icon={reading.features[2].icon} label={fl(reading.features[2])} tooltip={buildTooltip(reading.features[2])} side="left" variant="cyan" width={110} />
                                    </div>
                                </div>
                            </div>

                            {/* CENTER: Brain Image */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[45%] z-0">
                                <img
                                    src="/images/report/brain.png"
                                    alt="Brain"
                                    className="w-[300px] object-contain drop-shadow-[0_0_60px_rgba(251,191,36,0.18)] select-none opacity-95"
                                    draggable={false}
                                />
                            </div>

                            {/* RIGHT COLUMN: Writing + Speaking (amber) — always */}
                            <div className="flex flex-col justify-between h-full relative z-10 w-[38%] py-2">
                                {/* WRITING */}
                                <div className="flex flex-col items-end">
                                    <h3 className="text-[#f5ebd6] font-extrabold text-3xl tracking-wide w-full text-end mb-5 drop-shadow-md">
                                        {t.writing}
                                    </h3>
                                    <div className="flex flex-col items-end gap-4">
                                        <DesktopSkillNode icon={writing.features[0].icon} label={fl(writing.features[0])} tooltip={buildTooltip(writing.features[0])} side="right" variant="amber" width={100} />
                                        <DesktopSkillNode icon={writing.features[1].icon} label={fl(writing.features[1])} tooltip={buildTooltip(writing.features[1])} side="right" variant="amber" width={80} />
                                        <DesktopSkillNode icon={writing.features[2].icon} label={fl(writing.features[2])} tooltip={buildTooltip(writing.features[2])} side="right" variant="amber" width={90} />
                                    </div>
                                </div>
                                {/* SPEAKING */}
                                <div className="mt-6 flex flex-col items-end">
                                    <h3 className="text-[#f5ebd6] font-extrabold text-3xl tracking-wide w-full text-end mb-5 drop-shadow-md">
                                        {t.speaking}
                                    </h3>
                                    <div className="flex flex-col items-end gap-4">
                                        <DesktopSkillNode icon={speaking.features[0].icon} label={fl(speaking.features[0])} tooltip={buildTooltip(speaking.features[0])} side="right" variant="amber" width={70} />
                                        <DesktopSkillNode icon={speaking.features[1].icon} label={fl(speaking.features[1])} tooltip={buildTooltip(speaking.features[1])} side="right" variant="amber" width={90} />
                                        <DesktopSkillNode icon={speaking.features[2].icon} label={fl(speaking.features[2])} tooltip={buildTooltip(speaking.features[2])} side="right" variant="amber" width={110} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ══════ MOBILE: Brain Image + Accordion ══════ */}
                        <div className="lg:hidden">
                            {/* Brain Image — compact */}
                            <div className="flex justify-center my-5">
                                <img
                                    src="/images/report/brain.png"
                                    alt="Brain"
                                    className="w-[130px] md:w-[180px] object-contain drop-shadow-[0_0_40px_rgba(251,191,36,0.15)] select-none opacity-95"
                                    draggable={false}
                                />
                            </div>
                            {/* Accordion Cards */}
                            <div className="flex flex-col gap-3">
                                {CATEGORIES.map((cat) => (
                                    <MobileCategoryCard
                                        key={cat.id}
                                        category={cat}
                                        isAr={isAr}
                                        isOpen={!!openCategories[cat.id]}
                                        onToggle={() => toggleCategory(cat.id)}
                                        tooltipBuilder={buildTooltip}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── LINGUISTIC ARSENAL TOP (RIGHT) ─── */}
                    <div className="relative rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-8 shadow-2xl flex flex-col justify-between">
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

                        <div className="mt-8">
                            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase mb-2">
                                <span className="text-zinc-400">{t.wordsMastered}</span>
                                <span className="text-[#00d084] flex items-center gap-1.5 font-bold text-[11px]">
                                    {report.arsenal.fluencyPercent}% <span className="text-zinc-500 font-medium tracking-wide">{t.fluency} {report.skills.listening.tasksCompleted} {t.hours}</span> <Mic className="w-3.5 h-3.5 text-zinc-500" />
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-[6px] bg-[#1a1f26] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00d084] rounded-full transition-all duration-1000" style={{ width: `${report.arsenal.fluencyPercent}%` }} />
                                </div>
                                <span className="text-[#00d084] font-bold text-sm leading-none">{report.arsenal.fluencyPercent}%</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 font-bold tracking-[0.1em] mt-4 uppercase">
                                SENTENCES TAKEN: {report.skills.writing.tasksCompleted} | VOICES SHARED: {report.skills.listening.tasksCompleted} {t.hours}
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-7 mt-8 border-t border-gray-800/50 pt-6">
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

                {/* ═══════════ ROW 2: Knowledge Fortress & Journey Timeline ═══════════ */}
                <div className="flex flex-col items-center w-full py-2 relative">
                    <h2 className="text-2xl font-bold tracking-widest uppercase text-gray-200 mb-6 drop-shadow-md">{t.knowledgeFortress}</h2>
                    <div className="flex w-full justify-center items-center gap-4 relative z-10 px-2 flex-wrap lg:flex-nowrap max-w-4xl">
                        <div className="flex items-center gap-4 px-8 py-3.5 rounded-[1rem] border border-zinc-700/50 bg-[#14171d] shadow-lg">
                            <CalendarDays className="w-6 h-6 text-zinc-400" />
                            <span className="text-lg font-bold text-white tracking-wide">{t.journeyTimeline}</span>
                        </div>
                        <div className="flex items-center rounded-[1rem] border border-zinc-700/50 bg-[#14171d] flex-1 justify-center divide-x divide-zinc-700/50 shadow-inner max-w-xl overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4">
                                <Clock className="w-5 h-5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase truncate">
                                    {t.active} {report.journey.activeSince ? new Date(report.journey.activeSince).toLocaleDateString(isAr ? 'ar' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-4 bg-zinc-800/20">
                                <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase">{t.activeStreak}</span>
                                <span className="text-white text-base font-bold whitespace-nowrap">{report.journey.currentStreak} {t.days}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute end-4 -top-8 z-20 flex flex-col items-center">
                        <img
                            src="/images/report/shield.png"
                            alt="Level Shield"
                            className="w-[120px] lg:w-[150px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] select-none opacity-95"
                            style={{ filter: 'contrast(1.2)' }}
                            draggable={false}
                        />
                        <span className="bg-[#1a1e27] border border-zinc-700/60 rounded-lg px-4 py-1.5 text-[11px] font-black text-amber-400/90 uppercase tracking-widest mt-2 drop-shadow-md">
                            {levelTitle}
                        </span>
                    </div>
                </div>

                {/* ═══════════ ROW 3: Linguistic Arsenal Bottom Cards ═══════════ */}
                <div className="rounded-[2rem] bg-[#161a23] border border-zinc-800/80 p-8 shadow-2xl relative">
                    <h2 className="text-xl md:text-2xl text-gray-300 font-normal tracking-wide mb-8">Linguistic Arsenal</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 lg:gap-16 items-center">
                        <div className="flex items-center gap-12 ps-4">
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
                                    <p className="text-[13px] text-zinc-400">{t.readingSpeed}:</p>
                                    <p className="text-[13px] text-zinc-200 font-medium">+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:pe-4">
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] flex flex-col justify-center shadow-lg relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4">
                                    <ScrollText className="w-7 h-7 text-zinc-400 stroke-[1.5]" />
                                    <span className="text-base text-zinc-200 tracking-wide">{t.idioms}: {report.arsenal.idioms}</span>
                                </div>
                            </div>
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] flex flex-col justify-center shadow-lg relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4">
                                    <Link2 className="w-7 h-7 text-zinc-400 stroke-[1.5]" />
                                    <span className="text-base text-zinc-200 tracking-wide">{t.phrasalVerbs}: {report.arsenal.phrasalVerbs}</span>
                                </div>
                            </div>
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] shadow-lg flex flex-col justify-center relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl font-light text-zinc-200 leading-none">{report.skills.reading.tasksCompleted}</span>
                                    <span className="text-[13px] font-medium text-zinc-400 leading-snug">{t.readingSpeed}:<br /><span className="text-zinc-300">+{(report.skills.reading.tasksCompleted * 0.1).toFixed(1)}x</span></span>
                                </div>
                                <p className="text-[13px] text-zinc-500 tracking-wide font-medium">Quizzes Completed<br />{report.quizzes.completed} {t.days}!</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-zinc-700/50 bg-[#161a23] p-[1.5rem] shadow-lg flex flex-col justify-center relative overflow-hidden">
                                <div className="w-8 h-[2px] bg-cyan-400 rounded-full mb-5" />
                                <div className="absolute end-0 top-1/2 -translate-y-1/2 w-[3px] h-16 bg-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-4xl font-light text-zinc-200 leading-none">{report.arsenal.grammarRules}</span>
                                    <span className="text-[13px] font-medium text-zinc-400 leading-snug">{t.grammarRules}:<br /><span className="text-zinc-300">({report.quizzes.averageScore}% {t.accuracy})</span></span>
                                </div>
                                <p className="text-[13px] text-zinc-500 tracking-wide font-medium">Current Streak:</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════ ROW 4: AI Prediction ═══════════ */}
                <div className="rounded-2xl border border-zinc-800 bg-[#161a23] p-4 px-6 flex items-center gap-4 shadow-lg overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Bot className="w-7 h-7 text-blue-400/80 shrink-0" strokeWidth={1.5} />
                    <p className="text-[13px] text-zinc-300 z-10 font-medium">
                        {report.aiPrediction ? (
                            <>{t.aiPrediction} {isAr ? 'بناءً على تقدمك، من المتوقع أن تصل إلى المستوى' : 'Based on your progress, you\'re projected to reach'} <span className="font-bold">{report.aiPrediction.nextLevel}</span> {isAr ? `في ${report.aiPrediction.estimatedDays} يوماً!` : `level in ${report.aiPrediction.estimatedDays} days!`}</>
                        ) : (
                            <>{t.aiPrediction} {isAr ? 'واصل التدريب لفتح توقعات الذكاء الاصطناعي.' : 'Keep practicing to unlock AI-powered predictions!'}</>
                        )}
                    </p>
                    <div className="ms-auto w-5 h-5 rounded-sm bg-white/10 rotate-45 shrink-0" />
                </div>
            </div>
        </div>
    );
}

export default ReportPage;
