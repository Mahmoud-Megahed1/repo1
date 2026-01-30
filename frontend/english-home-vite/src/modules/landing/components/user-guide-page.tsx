import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { CONTACT_INFO } from '@shared/constants';
import { BookOpen, Clock, Target, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LandingLayout from './landing-layout';

interface TaskItem {
  title: string;
  description: string;
  tip: string;
}

export function UserGuidePage() {
  const { t } = useTranslation();

  return (
    <LandingLayout>
      <div className="container mx-auto space-y-12 px-4 py-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-primary text-4xl font-bold">
            {t('UserGuide.title')}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
            {t('UserGuide.subtitle')}
          </p>
        </div>

        {/* Philosophy Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="text-primary h-6 w-6" />
              <CardTitle className="text-2xl">
                {t('UserGuide.philosophy.title')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              {t('UserGuide.philosophy.description')}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-primary mb-2 font-semibold">
                  {t('UserGuide.philosophy.selfLearning.title')}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.philosophy.selfLearning.description')}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-primary mb-2 font-semibold">
                  {t('UserGuide.philosophy.challenge.title')}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.philosophy.challenge.description')}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-primary mb-2 font-semibold">
                  {t('UserGuide.philosophy.foundation.title')}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.philosophy.foundation.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="text-primary h-6 w-6" />
              <CardTitle className="text-2xl">
                {t('UserGuide.gettingStarted.title')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              {t('UserGuide.gettingStarted.description')}
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">
                  {t('UserGuide.gettingStarted.features.dashboard.title')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.gettingStarted.features.dashboard.description')}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {t('UserGuide.gettingStarted.features.dashboard.action')}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">
                  {t('UserGuide.gettingStarted.features.words.title')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.gettingStarted.features.words.description')}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {t('UserGuide.gettingStarted.features.words.action')}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-primary mb-2 text-2xl font-bold">
                  {t('UserGuide.gettingStarted.features.progress.title')}
                </div>
                <p className="text-muted-foreground text-sm">
                  {t('UserGuide.gettingStarted.features.progress.description')}
                </p>
                <p className="mt-2 text-sm font-medium">
                  {t('UserGuide.gettingStarted.features.progress.action')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="text-primary h-6 w-6" />
                <CardTitle className="text-2xl">
                  {t('UserGuide.dailyTasks.title')}
                </CardTitle>
              </div>
              <Badge variant="default" className="text-sm">
                {t('UserGuide.dailyTasks.duration')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t('UserGuide.dailyTasks.description')}
            </p>
            <div className="space-y-4">
              {(
                t('UserGuide.dailyTasks.tasks', {
                  returnObjects: true,
                }) as TaskItem[]
              ).map((task, index) => (
                <div key={index} className="flex gap-4 rounded-lg border p-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 font-semibold">{task.title}</h4>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {task.description}
                    </p>
                    <div className="bg-accent/40 dark:bg-accent/80 rounded p-2 text-sm">
                      <span className="text-primary font-medium">
                        {t('UserGuide.dailyTasks.tip')}:{' '}
                      </span>
                      {task.tip}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick FAQ */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Zap className="text-primary h-6 w-6" />
              <CardTitle className="text-2xl">
                {t('UserGuide.quickFaq.title')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(
                t('UserGuide.quickFaq.questions', {
                  returnObjects: true,
                }) as Array<{ question: string; answer: string }>
              ).map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-lg font-semibold">{faq.question}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                  {index < 3 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <p className="text-center font-medium">
              {t('TermsAndConditions.contactInfo.title')}
            </p>
            <Separator className="mt-2 opacity-50" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-center">
              <a
                href={`mailto:${CONTACT_INFO.support}`}
                className="text-primary font-medium"
              >
                {CONTACT_INFO.support}
              </a>
              <p className="text-muted-foreground text-sm">
                {t('PrivacyPolicy.lastUpdated')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LandingLayout>
  );
}
