import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import {
  Award,
  BookOpen,
  Calendar,
  Layers,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const featureIcons = {
  interactive: BookOpen,
  speaking: Mic,
  progress: TrendingUp,
  levels: Layers,
  daily: Calendar,
  certificate: Award,
};

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    'interactive',
    'speaking',
    'progress',
    'levels',
    'daily',
    'certificate',
  ] as const;

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            {t('Landing.features.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.features.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = featureIcons[feature];
            return (
              <Card
                key={feature}
                className="animate-bounce-slow group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 0.4}s`,
                  animationDuration: '4s',
                }}
              >
                <CardHeader>
                  <div className="bg-primary/10 group-hover:bg-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                    <Icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">
                    {t(`Landing.features.items.${feature}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {t(`Landing.features.items.${feature}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
