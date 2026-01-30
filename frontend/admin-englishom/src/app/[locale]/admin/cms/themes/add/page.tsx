'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useTranslations } from 'next-intl';
import { ThemeForm } from '../_components/theme-form';

export default function AddThemePage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <PageHeader title={t('Admin.themes.add')} />
      <ThemeForm />
    </div>
  );
}
