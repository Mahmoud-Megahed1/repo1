import { AboutSection } from './about-section';
import { FeaturesSection } from './features-section';
import FAQ from './fqa';
import { HeroSection } from './hero-section';
import LandingLayout from './landing-layout';
import { LevelsSection } from './levels-section';
import { TestimonialsSection } from './testimonials-section';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

export function LandingPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const locale = (params as any).locale || 'en';

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const success = searchParams.get('success');
    const pending = searchParams.get('pending');

    if (success === 'true' && pending === 'false') {
      navigate({ to: `/${locale}/app/levels` });
    }
  }, [navigate, locale]);

  return (
    <LandingLayout>
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="levels">
          <LevelsSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <FAQ />
        <div id="about">
          <AboutSection />
        </div>
      </main>
    </LandingLayout>
  );
}
