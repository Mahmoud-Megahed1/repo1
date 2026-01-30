import { accordionVariants } from '@components/custom-accordion';
import { cn } from '@lib/utils';
import LandingLayout from '@modules/landing/components/landing-layout';
import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {
  BookOpen,
  Target,
  Users,
  Award,
  Clock,
  MessageCircle,
  TrendingUp,
  Heart,
  CheckCircle,
  Play,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/$locale/_globalLayout/our-vision')({
  component: RouteComponent,
});

const variants = ['default', 'blue', 'green', 'purple', 'amber'] as const;
const icons = [
  BookOpen,
  Target,
  Users,
  Award,
  Clock,
  MessageCircle,
  TrendingUp,
  Heart,
  CheckCircle,
  Play,
  Star,
] as const;

function RouteComponent() {
  const { t } = useTranslation();
  const values = [
    {
      key: 'results',
      variant: 'green',
      icon: TrendingUp,
    },
    {
      key: 'practice',
      variant: 'blue',
      icon: Users,
    },
    {
      key: 'support',
      variant: 'amber',
      icon: Award,
    },
    { key: 'clarity', variant: 'default', icon: Target },
    { key: 'innovation', variant: 'purple', icon: Star },
  ] as const;

  const features: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
  }> = [
    {
      title: t(
        'Landing.ourVision.sections.methodology.points.pronunciation.title'
      ),
      description: t(
        'Landing.ourVision.sections.methodology.points.pronunciation.description'
      ),
      icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    },
    {
      title: t('Landing.ourVision.sections.methodology.points.speaking.title'),
      description: t(
        'Landing.ourVision.sections.methodology.points.speaking.description'
      ),
      icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    },
    {
      title: t('Landing.ourVision.sections.methodology.points.scenarios.title'),
      description: t(
        'Landing.ourVision.sections.methodology.points.scenarios.description'
      ),
      icon: <Play className="h-6 w-6 text-green-500" />,
      iconBg: 'bg-green-100 dark:bg-green-900/50',
    },
  ] as const;

  const COMMITMENT_FEATURES = [
    'words',
    'images',
    'translation',
    'sentences',
    'audio',
    'recording',
    'writing',
    'grammar',
    'idiom',
    'phrasal',
    'mission',
  ] as const;

  return (
    <LandingLayout>
      <section className="from-background via-background/80 to-accent/20 bg-gradient-to-b">
        <div className="section">
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('Landing.ourVision.title')}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              {t('Landing.ourVision.subtitle')}
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader className="w-full">
                <div className="flex items-center gap-4">
                  <div className={cn(accordionVariants({ variant: 'blue' }))}>
                    {<Target className="h-6 w-6 text-white" />}
                  </div>
                  <div className="rtl:space-y-1">
                    <h2 className="text-xl font-bold md:text-2xl">
                      {t(`Landing.ourVision.sections.vision.title`)}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="rounded-xl border-s-4 border-blue-500 bg-blue-50 p-5 dark:bg-blue-700/15">
                  <p className="text-sm md:text-base">
                    {t('Landing.ourVision.sections.vision.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="w-full">
                <div className="flex items-center gap-4">
                  <div className={cn(accordionVariants({ variant: 'green' }))}>
                    {<Award className="h-6 w-6 text-white" />}
                  </div>
                  <div className="rtl:space-y-1">
                    <h2 className="text-xl font-bold md:text-2xl">
                      {t(`Landing.ourVision.sections.goal.title`)}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="rounded-xl border-s-4 border-green-500 bg-green-50 p-5 dark:bg-green-700/15">
                  <p className="text-sm md:text-base">
                    {t('Landing.ourVision.sections.goal.description')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t('Landing.ourVision.sections.methodology.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.ourVision.sections.methodology.subtitle')}
          </p>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="mb-4 text-2xl font-bold">
                  {t(
                    'Landing.ourVision.sections.methodology.ourStructureApproach'
                  )}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('Landing.ourVision.sections.methodology.description')}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {t(
                      'Landing.ourVision.sections.methodology.points.wordsPerLevel.title'
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {t(
                      'Landing.ourVision.sections.methodology.points.dailyWords.title'
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {features.map(({ icon, description, iconBg, title }) => (
              <Card>
                <CardContent className="flex items-start space-x-4">
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                      iconBg
                    )}
                  >
                    {icon}
                  </div>
                  <div>
                    <CardTitle className="mb-2 text-lg">{title}</CardTitle>
                    <CardDescription className="leading-6">
                      {description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/20">
        <div className="section space-y-12">
          <h2 className="text-center text-3xl font-bold lg:text-4xl">
            {t('Landing.ourVision.sections.mission.title')}
          </h2>
          <Card className="dark:bg-accent/30 mx-auto max-w-3xl">
            <CardHeader className="flex items-center gap-2">
              <div
                className={cn(
                  accordionVariants({ variant: 'default', className: 'w-fit' })
                )}
              >
                <Heart className="size-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold md:text-2xl">
                {t('Landing.ourVision.sections.mission.missionTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {t('Landing.ourVision.sections.mission.missionDescription')}
              </CardDescription>
            </CardContent>
          </Card>

          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ key, variant, icon: Icon }) => (
              <li key={key}>
                <Card className="dark:bg-accent/30 gap-4">
                  <CardHeader className="flex flex-col items-center gap-4">
                    <div
                      className={cn(
                        accordionVariants({
                          variant: variant,
                          className: 'w-fit',
                        })
                      )}
                    >
                      <Icon className="size-6 text-white" />
                    </div>
                    <CardTitle>
                      {t(
                        `Landing.ourVision.sections.mission.values.${key}.title`
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {t(
                        `Landing.ourVision.sections.mission.values.${key}.description`
                      )}
                    </CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t('Landing.ourVision.sections.commitment.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('Landing.ourVision.sections.commitment.description')}
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COMMITMENT_FEATURES.map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={feature}>
                <Card className="dark:bg-accent/30 h-full gap-4">
                  <CardHeader className="flex flex-col gap-4">
                    <div
                      className={cn(
                        accordionVariants({
                          variant: variants[index % variants.length],
                          className: 'w-fit',
                        })
                      )}
                    >
                      <Icon className="size-6 text-white" />
                    </div>
                    <CardTitle>
                      {t(
                        `Landing.ourVision.sections.commitment.features.${feature}.title`
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {t(
                        `Landing.ourVision.sections.commitment.features.${feature}.description`
                      )}
                    </CardDescription>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </LandingLayout>
  );
}
