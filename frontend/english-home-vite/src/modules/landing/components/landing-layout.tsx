import React from 'react';
import { LandingFooter } from './landing-footer';
import { LandingHeader } from './landing-header';
import { CtaSection } from './cta-section';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      {children}
      <CtaSection />
      <LandingFooter />
    </div>
  );
};

export default LandingLayout;
