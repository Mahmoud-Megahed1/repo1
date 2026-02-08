import { getTranslations } from 'next-intl/server';
import LessonAIInstructions from './_components/lesson-ai-instructions';

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale, namespace: 'Global' });
    return {
        title: `AI Settings | ${t('title')}`,
    };
}

export default function AISettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">AI Settings</h2>
                <p className="text-muted-foreground">
                    Manage AI behavior and instructions for lessons.
                </p>
            </div>
            <LessonAIInstructions />
        </div>
    );
}
