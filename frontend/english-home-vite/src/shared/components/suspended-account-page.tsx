import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  userEmail?: string;
  suspensionReason?: string;
  suspensionDate?: string;
  suspensionEndDate?: string;
  supportEmail?: string;
  supportPhone?: string;
};

const SuspendedAccountPage: React.FC<Props> = ({
  userEmail = 'user@example.com',
  suspensionReason = 'Temporary violation of community guidelines',
  suspensionDate = '2024-01-15',
  suspensionEndDate = '2024-01-29',
  supportEmail = 'support@englishlearning.com',
  supportPhone = '+1 (555) 123-4567',
}) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    const endDate = new Date(suspensionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleContactSupport = (method: 'email' | 'phone') => {
    if (method === 'email') {
      window.location.href = `mailto:${supportEmail}?subject=${t('Global.suspendedAccount.appealSubject', { email: userEmail })}`;
    } else {
      navigator.clipboard.writeText(supportPhone);
      alert(t('Global.suspendedAccount.phoneNumberCopied'));
    }
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Main Alert Card */}
        <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-lg">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {t('Global.suspendedAccount.title')}
            </h1>
            <p className="text-amber-100">
              {t('Global.suspendedAccount.subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Suspension Info */}
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-500" />
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-amber-900">
                    {t('Global.suspendedAccount.suspensionDetails')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">
                        {t('Global.suspendedAccount.email')}
                      </span>
                      <span className="font-medium text-amber-900">
                        {userEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">
                        {t('Global.suspendedAccount.suspensionDate')}
                      </span>
                      <span className="font-medium text-amber-900">
                        {formatDate(suspensionDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-700">
                        {t('Global.suspendedAccount.endsOn')}
                      </span>
                      <span className="font-medium text-amber-900">
                        {formatDate(suspensionEndDate)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-amber-700">
                        {t('Global.suspendedAccount.reason')}
                      </span>
                      <span className="max-w-xs text-right font-medium text-amber-900">
                        {suspensionReason}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    {t('Global.suspendedAccount.timeRemaining')}
                  </h3>
                </div>
                <div className="mb-2 text-4xl font-bold text-blue-600">
                  {daysRemaining}{' '}
                  {daysRemaining === 1
                    ? t('Global.suspendedAccount.day')
                    : t('Global.suspendedAccount.days')}
                </div>
                <p className="text-blue-700">
                  {t('Global.suspendedAccount.timeRemainingDescription', {
                    date: formatDate(suspensionEndDate),
                  })}
                </p>
              </div>
            </div>

            {/* What This Means */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-gray-600" />
                {t('Global.suspendedAccount.duringSuspension')}
              </h3>
              <div className="rounded-xl bg-gray-50 p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                    <span>
                      {t('Global.suspendedAccount.cannotAccessMaterials')}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                    <span>{t('Global.suspendedAccount.progressSafe')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400"></div>
                    <span>
                      {t('Global.suspendedAccount.communityUnavailable')}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-400"></div>
                    <span className="font-medium text-green-700">
                      {t('Global.suspendedAccount.fullAccessRestored')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Appeal Process */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Calendar className="h-5 w-5 text-purple-600" />
                {t('Global.suspendedAccount.appealProcess')}
              </h3>
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                <p className="mb-4 text-purple-900">
                  {t('Global.suspendedAccount.appealDescription')}
                </p>
                <div className="rounded-lg border border-purple-200 bg-white p-4">
                  <p className="mb-2 text-sm font-medium text-purple-800">
                    {t('Global.suspendedAccount.appealProvide')}
                  </p>
                  <ul className="space-y-1 text-sm text-purple-700">
                    <li>
                      •{' '}
                      {t(
                        'Global.suspendedAccount.appealRequirements.accountEmail'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Global.suspendedAccount.appealRequirements.detailedExplanation'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Global.suspendedAccount.appealRequirements.supportingEvidence'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Global.suspendedAccount.appealRequirements.acknowledgmentGuidelines'
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MessageCircle className="h-5 w-5 text-green-600" />
                {t('Global.suspendedAccount.contactSupport')}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={() => handleContactSupport('email')}
                  className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 transition-all duration-200 hover:bg-green-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-900">
                      {t('Global.suspendedAccount.emailSupport')}
                    </div>
                    <div className="text-sm text-green-700">{supportEmail}</div>
                  </div>
                </button>

                <button
                  onClick={() => handleContactSupport('phone')}
                  className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 transition-all duration-200 hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">
                      {t('Global.suspendedAccount.phoneSupport')}
                    </div>
                    <div className="text-sm text-blue-700">{supportPhone}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
            <p className="text-center text-sm text-gray-600">
              {t('Global.suspendedAccount.footerMessage')}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t('Global.suspendedAccount.additionalInfo')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccountPage;
