import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import SettingsTabs from './_components/settings-tabs';

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: 'Global' });
    return {
        title: `AI Settings | ${t('appName')}`,
    };
}

export default function AISettingsPage() {
    const t = useTranslations('Admin.aiSettings');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground">
                    {t('manageBehavior')}
                </p>
            </div>
            <SettingsTabs t={t} />
        </div>
    );
}
