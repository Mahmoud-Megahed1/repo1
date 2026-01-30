import { Link } from '@shared/i18n/routing';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReadyToStart = () => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {t('App.dashboard.getStarted.title')}
        </CardTitle>
        <CardDescription>
          {t('App.dashboard.getStarted.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link to="/app/levels" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('App.dashboard.getStarted.cta')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReadyToStart;
