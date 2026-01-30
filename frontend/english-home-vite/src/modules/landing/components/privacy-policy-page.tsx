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

export function PrivacyPolicyPage() {
  const { t } = useTranslation();
  usePageTitle(t('PrivacyPolicy.title'));
  return (
    <LandingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-primary mb-4 text-3xl font-bold md:text-4xl">
              {t('PrivacyPolicy.title')}
            </h1>
            <p className="text-muted-foreground mb-4">
              {t('PrivacyPolicy.lastUpdated')}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
              {t('PrivacyPolicy.intro')}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Section 1: Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.dataCollection.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataCollection.intro')}
                </p>

                {/* Data Collection Table */}
                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="border-border min-w-full border-collapse border">
                    <thead>
                      <tr className="bg-muted *:w-1/3 *:text-center">
                        <th className="border-border border p-3 font-semibold">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.headers.type'
                          )}
                        </th>
                        <th className="border-border border p-3 font-semibold">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                          )}
                        </th>
                        <th className="border-border border p-3 font-semibold">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-border border p-3 font-medium">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.registration.type'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.registration.examples'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.registration.purpose'
                          )}
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border-border border p-3 font-medium">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.payment.type'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.payment.examples'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.payment.purpose'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-border border p-3 font-medium">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.performance.type'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.performance.examples'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.performance.purpose'
                          )}
                        </td>
                      </tr>
                      <tr className="bg-muted/30">
                        <td className="border-border border p-3 font-medium">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.type'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.examples'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.purpose'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="border-border border p-3 font-medium">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.usage.type'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.usage.examples'
                          )}
                        </td>
                        <td className="border-border border p-3">
                          {t(
                            'PrivacyPolicy.sections.dataCollection.table.rows.usage.purpose'
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-4 md:hidden">
                  {/* Registration Row */}
                  <div className="border-border bg-card rounded-lg border p-4">
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.type'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.registration.type'
                        )}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.registration.examples'
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.registration.purpose'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Payment Row */}
                  <div className="border-border bg-card rounded-lg border p-4">
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.type'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.payment.type'
                        )}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.payment.examples'
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.payment.purpose'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Performance Row */}
                  <div className="border-border bg-card rounded-lg border p-4">
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.type'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.performance.type'
                        )}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.performance.examples'
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.performance.purpose'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Audio Recordings Row */}
                  <div className="border-border bg-card rounded-lg border p-4">
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.type'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.type'
                        )}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.examples'
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.audioRecordings.purpose'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Usage Row */}
                  <div className="border-border bg-card rounded-lg border p-4">
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.type'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.usage.type'
                        )}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.examples'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.usage.examples'
                        )}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-primary font-semibold">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.headers.purpose'
                        )}
                      </h4>
                      <p className="text-sm">
                        {t(
                          'PrivacyPolicy.sections.dataCollection.table.rows.usage.purpose'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.dataUsage.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataUsage.intro')}
                </p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li className="text-sm leading-relaxed md:text-base">
                    {t(
                      'PrivacyPolicy.sections.dataUsage.purposes.serviceProvision'
                    )}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.dataUsage.purposes.support')}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.dataUsage.purposes.payment')}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t(
                      'PrivacyPolicy.sections.dataUsage.purposes.noHumanIntervention'
                    )}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t(
                      'PrivacyPolicy.sections.dataUsage.purposes.exclusiveUse'
                    )}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.dataUsage.purposes.ownership')}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.dataUsage.purposes.noSharing')}
                  </li>
                </ul>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                  <p className="text-sm font-medium leading-relaxed text-blue-900 md:text-base dark:text-blue-100">
                    {t('PrivacyPolicy.sections.dataUsage.audioCommitment')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.dataProtection.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataProtection.security')}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataProtection.paymentEncryption')}
                </p>
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataProtection.passwordHashing')}
                </p>
              </CardContent>
            </Card>

            {/* Section 4: Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.dataSharing.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.dataSharing.intro')}
                </p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li className="text-sm leading-relaxed md:text-base">
                    {t(
                      'PrivacyPolicy.sections.dataSharing.exceptions.serviceProviders'
                    )}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t(
                      'PrivacyPolicy.sections.dataSharing.exceptions.legalRequirements'
                    )}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 5: User Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.userRights.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.userRights.intro')}
                </p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.userRights.rights.access')}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.userRights.rights.modification')}
                  </li>
                  <li className="text-sm leading-relaxed md:text-base">
                    {t('PrivacyPolicy.sections.userRights.rights.deletion')}
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 6: Cookies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t('PrivacyPolicy.sections.cookies.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed md:text-base">
                  {t('PrivacyPolicy.sections.cookies.description')}
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
                    {t('PrivacyPolicy.lastUpdated')}
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
