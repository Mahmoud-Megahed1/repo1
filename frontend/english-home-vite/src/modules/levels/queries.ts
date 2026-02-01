import type { LevelId } from '@shared/types/entities';
import { useQuery } from '@tanstack/react-query';
import {
    Award,
    Book,
    Briefcase,
    CircleCheck,
    CircleUser,
    Landmark,
    type LucideIcon,
} from 'lucide-react';
import {
    getAllLevels,
    getCertification,
    getLevelById,
    getUserLevels,
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

export function useLocalizedLevels(locale = 'en') {
    const { data, ...rest } = useAllLevels();
    const levelIcons: Record<LevelId, LucideIcon> = {
        LEVEL_A1: Book,
        LEVEL_A2: CircleUser,
        LEVEL_B1: CircleCheck,
        LEVEL_B2: Award,
        LEVEL_C1: Briefcase,
        LEVEL_C2: Landmark,
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
            }) => ({
                title: locale === 'ar' ? titleAr : titleEn,
                description: locale === 'ar' ? descriptionAr : descriptionEn,
                levelId: level_name,
                levelLabel: level_name.split('_')[1],
                icon: levelIcons[level_name],
                ...data,
            })
        ) || [];
    return { localizedLevels, ...rest };
}

export function useLocalizedLevelById(levelId: LevelId, locale = 'en') {
    const { data, ...rest } = useLevelById(levelId);
    const { descriptionAr, descriptionEn, level_name, titleAr, titleEn, price } =
        data?.data || {};
    const level = {
        levelId: level_name,
        price,
        title: locale === 'ar' ? titleAr : titleEn,
        description: locale === 'ar' ? descriptionAr : descriptionEn,
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
