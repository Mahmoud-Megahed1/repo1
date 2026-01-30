import {
  AlertTriangle,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldX,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  userEmail?: string;
  blockReason?: string;
  blockDate?: string;
  supportEmail?: string;
  supportPhone?: string;
};

const BlockedAccountPage: React.FC<Props> = ({
  userEmail = 'user@example.com',
  blockReason = 'Violation of platform terms of service',
  blockDate = '2024-01-15',
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

  const handleContactSupport = (method: 'email' | 'phone') => {
    if (method === 'email') {
      window.location.href = `mailto:${supportEmail}?subject=${t('Global.blockedAccount.appealSubject', { email: userEmail })}`;
    } else {
      // In a real app, this might open a phone dialer or copy to clipboard
      navigator.clipboard.writeText(supportPhone);
      alert(t('Global.blockedAccount.phoneNumberCopied'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Main Alert Card */}
        <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-lg">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
              <ShieldX className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              {t('Global.blockedAccount.title')}
            </h1>
            <p className="text-red-100">
              {t('Global.blockedAccount.subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Account Info */}
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-500" />
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-red-900">
                    {t('Global.blockedAccount.accountDetails')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700">
                        {t('Global.blockedAccount.email')}
                      </span>
                      <span className="font-medium text-red-900">
                        {userEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">
                        {t('Global.blockedAccount.blockDate')}
                      </span>
                      <span className="font-medium text-red-900">
                        {formatDate(blockDate)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-red-700">
                        {t('Global.blockedAccount.reason')}
                      </span>
                      <span className="max-w-xs text-right font-medium text-red-900">
                        {blockReason}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 text-blue-600" />
                {t('Global.blockedAccount.nextSteps')}
              </h3>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <p className="mb-4 text-blue-900">
                  {t('Global.blockedAccount.nextStepsDescription')}
                </p>
                <div className="rounded-lg border border-blue-200 bg-white p-4">
                  <p className="mb-2 text-sm font-medium text-blue-800">
                    {t('Global.blockedAccount.contactSupportProvide')}
                  </p>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>
                      •{' '}
                      {t(
                        'Global.blockedAccount.contactSupportRequirements.accountEmail'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Global.blockedAccount.contactSupportRequirements.blockNoticeDate'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Global.blockedAccount.contactSupportRequirements.relevantContext'
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
                {t('Global.blockedAccount.contactSupport')}
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
                      {t('Global.blockedAccount.emailSupport')}
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
                      {t('Global.blockedAccount.phoneSupport')}
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
              {t('Global.blockedAccount.footerMessage')}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t('Global.blockedAccount.additionalInfo')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockedAccountPage;
