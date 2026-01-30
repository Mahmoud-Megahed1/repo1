import { Card } from '@ui/card';
import { Skeleton } from '@ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnalyzingSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Card className="bg-card border-border mt-8 p-8">
      <div className="flex flex-col items-center gap-6">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
        <p className="text-foreground text-lg font-medium">
          {t('Global.analyzingYourSpeech')}...
        </p>
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-3/4" />
          <Skeleton className="mx-auto h-4 w-5/6" />
        </div>
      </div>
    </Card>
  );
};

export default AnalyzingSkeleton;
