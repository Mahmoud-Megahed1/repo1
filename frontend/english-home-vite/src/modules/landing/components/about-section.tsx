import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Award, Target, Users, Users2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const aboutIcons = {
  story: Target,
  team: Users,
  quality: Award,
  join: Users2,
};

export function AboutSection() {
  const { t } = useTranslation();

  const aboutSections = ['story', 'team', 'quality', 'join'] as const;

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            {t('Landing.about.title')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {t('Landing.about.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {aboutSections.map((section) => {
            const IconComponent = aboutIcons[section];
            return (
              <Card
                key={section}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <IconComponent className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">
                    {t(`Landing.about.sections.${section}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`Landing.about.sections.${section}.description`)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
