import type { LevelId } from '@shared/types/entities';
import { useQuery } from '@tanstack/react-query';
import {
    Award,
    Book,
    Briefcase,
    CircleCheck,
    CircleUser,
    Landmark,
    Wind,
    Radio,
    Rocket,
    Flame,
    AlertTriangle,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import {
    getAllLevels,
    getCertification,
    getLevelById,
    getUserLevels,
    getDiscountEligibility,
    getActiveCourse,
} from './services';
export function useUserLevels() {
    const { data, ...rest } = useQuery({
        queryKey: ['userLevels'],
        queryFn: getUserLevels,
    });
    const userLevels = data?.data || [];
    return { userLevels, ...rest };
}

export function useAllLevels() {
    return useQuery({
        queryKey: ['allLevels'],
        queryFn: getAllLevels,
    });
}

export function useLevelById(levelId: LevelId) {
    return useQuery({
        queryKey: ['level', levelId],
        queryFn: () => getLevelById(levelId),
        throwOnError: false,
    });
}

// Level override details
const levelDetails: Record<string, { titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
    LEVEL_A1: {
        titleAr: "منطقة التنفس (15 ثانية)",
        titleEn: "Breathing Zone (15s)",
        descAr: "محطة البداية؛ الوقت صديقك لتستدعي الكلمات وتجيب بهدوء ودون ضغط.",
        descEn: "Starting station; time is your friend to recall words calmly."
    },
    LEVEL_A2: {
        titleAr: "التقاط الإشارة (12 ثانية)",
        titleEn: "Signal Catch (12s)",
        descAr: "ينكمش الوقت ليرتفع إدراكك؛ لا مجال للتردد، فقط ألمع الإجابة الصحيحة.",
        descEn: "Time shrinks to heighten awareness; no hesitation, pick the right answer."
    },
    LEVEL_B1: {
        titleAr: "حافة الانطلاق (10 ثواني)",
        titleEn: "Launch Edge (10s)",
        descAr: "محطة كسر البطء؛ تضعك على أول طريق التفكير المباشر بالإنجليزية.",
        descEn: "Break the slowness; puts you on the direct English thinking path."
    },
    LEVEL_B2: {
        titleAr: "المواجهة السريعة (8 ثواني)",
        titleEn: "Fast Faceoff (8s)",
        descAr: "الخوض في العمق؛ يداهمك الوقت لتختبر سرعة استجابتك في مواقف حقيقية.",
        descEn: "Diving deep; time rushes you to test real-life reaction speed."
    },
    LEVEL_C1: {
        titleAr: "الثواني الحرجة (6 ثواني)",
        titleEn: "Critical Seconds (6s)",
        descAr: "محطة التعثر الإيجابي؛ هنا تخطئ وتتعثر لتجبر عقلك على إلغاء الترجمة الحرفية.",
        descEn: "Positive stumble station; forces your brain to eliminate literal translation."
    },
    LEVEL_C2: {
        titleAr: "الرد اللحظي (4 ثواني)",
        titleEn: "Instant Response (4s)",
        descAr: "ذروة الطلاقة؛ لا وقت للتفكير، الإجابة تخرج تلقائياً من عقلك الباطن.",
        descEn: "Peak fluency; no time to overthink, answers spring automatically."
    }
};

export function useLocalizedLevels(locale = 'en') {
    const { data, ...rest } = useAllLevels();
    const levelIcons: Record<string, LucideIcon> = {
        LEVEL_A1: Wind,
        LEVEL_A2: Radio,
        LEVEL_B1: Rocket,
        LEVEL_B2: Flame,
        LEVEL_C1: AlertTriangle,
        LEVEL_C2: Zap,
    };
    const localizedLevels =
        data?.data.map(
            ({
                descriptionAr,
                descriptionEn,
                titleAr,
                titleEn,
                level_name,
                ...data
            }) => {
                const override = levelDetails[level_name];
                return {
                    title: override 
                        ? (locale === 'ar' ? override.titleAr : override.titleEn)
                        : (locale === 'ar' ? titleAr : titleEn),
                    description: override
                        ? (locale === 'ar' ? override.descAr : override.descEn)
                        : (locale === 'ar' ? descriptionAr : descriptionEn),
                    levelId: level_name,
                    levelLabel: level_name.split('_')[1],
                    icon: levelIcons[level_name] || Book,
                    ...data,
                };
            }
        ) || [];
    return { localizedLevels, ...rest };
}

export function useLocalizedLevelById(levelId: LevelId, locale = 'en') {
    const { data, ...rest } = useLevelById(levelId);
    const { descriptionAr, descriptionEn, level_name, titleAr, titleEn, price } =
        data?.data || {};
    const override = level_name ? levelDetails[level_name] : null;
    const level = {
        levelId: level_name,
        price,
        title: override
            ? (locale === 'ar' ? override.titleAr : override.titleEn)
            : (locale === 'ar' ? titleAr : titleEn),
        description: override
            ? (locale === 'ar' ? override.descAr : override.descEn)
            : (locale === 'ar' ? descriptionAr : descriptionEn),
    };
    return { level, ...rest };
}

export function useCertification(levelName: LevelId, enabled = true) {
    return useQuery({
        queryKey: ['certification', levelName],
        queryFn: () => getCertification(levelName),
        throwOnError: false,
        enabled,
        retry: false, // Don't retry if it fails (e.g. 404)
    });
}

export function useDiscountEligibility() {
    return useQuery({
        queryKey: ['discountEligibility'],
        queryFn: getDiscountEligibility,
        select: (res) => res.data,
        refetchOnMount: true,
    });
}

export function useActiveCourse() {
    return useQuery({
        queryKey: ['active-course'],
        queryFn: getActiveCourse,
        select: (res) => res.data.activeCourse,
        refetchOnMount: true,
    });
}
