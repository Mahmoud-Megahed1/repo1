'use client';

import { PageHeader } from '@/components/shared/page-header';
import { getTheme } from '@/services/themes';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ThemeForm } from '../../_components/theme-form';
import { Loader2 } from 'lucide-react';

interface EditThemePageProps {
    params: {
        id: string;
    };
}

export default function EditThemePage({ params }: EditThemePageProps) {
    const t = useTranslations();
    const { id } = params;

    const { data: theme, isLoading } = useQuery({
        queryKey: ['theme', id],
        queryFn: async () => {
            const res = await getTheme(id);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader title={t('Admin.themes.edit')} />
            {theme && <ThemeForm initialData={theme} />}
        </div>
    );
}
