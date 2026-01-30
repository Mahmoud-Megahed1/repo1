import usePageTitle from '@hooks/use-page-title';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Separator } from '@shared/components/ui/separator';
import { CONTACT_INFO } from '@shared/constants';
import { useTranslation } from 'react-i18next';
import LandingLayout from './landing-layout';

export function TermsAndConditionsPage() {
  const { t } = useTranslation();
  usePageTitle(t('TermsAndConditions.title'));
  return (
    <LandingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-primary mb-4 text-3xl font-bold md:text-4xl">
              {t('TermsAndConditions.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('TermsAndConditions.lastUpdated')}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Section 1: Acceptance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.acceptance.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('TermsAndConditions.sections.acceptance.content.scope')}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.acceptance.content.agreement'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t('TermsAndConditions.sections.acceptance.content.nature')}
                </p>
              </CardContent>
            </Card>

            {/* Section 2: Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.intellectualProperty.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.intellectualProperty.content.ownership'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.intellectualProperty.content.prohibition'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.intellectualProperty.content.personalUse'
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Section 3: Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.registration.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.registration.content.personalAccount'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.registration.content.pricing'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.registration.content.paymentMethods'
                  )}
                </p>
                <p className="text-destructive text-sm font-medium leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.registration.content.refundPolicy'
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Section 4: User Responsibility */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.userResponsibility.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.userResponsibility.content.recordingAccuracy'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.userResponsibility.content.userBehavior'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.userResponsibility.content.dataAndSecurity'
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Section 5: Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.disclaimer.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.disclaimer.content.disclaimerStatement'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t('TermsAndConditions.sections.disclaimer.content.results')}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.disclaimer.content.liability'
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Section 6: Termination */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('TermsAndConditions.sections.termination.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.termination.content.terminationRights'
                  )}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t(
                    'TermsAndConditions.sections.termination.content.accountDeletion'
                  )}
                </p>
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
                    {t('TermsAndConditions.contactInfo.publishDate')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
