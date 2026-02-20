import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Phone,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { useReactivate } from '@/modules/auth/mutations';
import { cn } from '@lib/utils';
import { useAuth } from './contexts/auth-context';

type Props = {
  userName?: string;
  suspensionReason?: string;
  isFirstSuspension?: boolean;
};

const SuspendedAccountPage: React.FC<Props> = ({
  userName: propUserName,
  suspensionReason: propSuspensionReason,
  isFirstSuspension: propIsFirstSuspension,
}) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const isAr = i18n.language === 'ar';

  const userName = propUserName || user?.firstName || (isAr ? 'طالبنا العزيز' : 'Dear Student');
  const suspensionReason = propSuspensionReason || user?.suspensionReason;
  // If we have a suspension reason that mentions the grace period, it's the first one
  const isFirstSuspension = propIsFirstSuspension !== undefined
    ? propIsFirstSuspension
    : (user?.suspensionReason?.includes('فرصة حماية') || !user?.hasUsedInactivityGrace);

  const [willCare, setWillCare] = useState(false);
  const [willCommit, setWillCommit] = useState(false);

  const { mutate, isPending } = useReactivate();

  const handleReactivate = () => {
    if (willCare && willCommit) {
      mutate({ data: { willCare, willCommit } });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Main Reactivation Card */}
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl transition-all duration-500">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(circle,white_0%,transparent_70%)] rotate-12"></div>
            </div>

            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner relative z-10">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-white relative z-10">
              {isAr ? `نفتقد وجودك معنا يا ${userName}!` : `We miss you, ${userName}!`}
            </h1>
            <p className="text-blue-100 text-lg relative z-10">
              {isAr ? 'أنجازك في انتظار عودتك لإكمال رحلة النجاح' : 'Your achievement is waiting for your return to complete the success journey'}
            </p>
          </div>

          {/* Content */}
          <div className="px-10 py-10">
            <div className="mb-10 text-center">
              <blockquote className="text-xl font-medium text-gray-800 leading-relaxed italic">
                {isAr
                  ? `"جدد طاقتك، توكل على الله، ونحن معك خطوة بخطوة."`
                  : `"Renew your energy, trust in Allah, and we are with you step by step."`
                }
              </blockquote>
            </div>

            {/* Important Notice */}
            <div className="mb-10 rounded-2xl border border-amber-100 bg-amber-50/50 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-500" />
                <h3 className="font-bold text-amber-900 text-lg">
                  {isAr ? 'تنبيه هام بخصوص اشتراكك' : 'Important Note About Your Subscription'}
                </h3>
              </div>
              <div className="text-amber-800 leading-relaxed">
                {suspensionReason && (
                  <p className="mb-3 p-3 rounded-xl bg-amber-100/50 border border-amber-200/50 text-sm font-bold">
                    {isAr ? `سبب الإيقاف: ${suspensionReason}` : `Suspension Reason: ${suspensionReason}`}
                  </p>
                )}
                <p className="whitespace-pre-line">
                  {isFirstSuspension
                    ? (isAr
                      ? `رصيد أيامك في أمان..
بادرنا بحفظ أيام اشتراكك تقديراً لظروف غيابك، وستجدها كاملة بانتظارك. 
نود تنبيهك أن ميزة 'الإيقاف المؤقت' تُمنح لمرة واحدة، لذا استغل هذه الفرصة واستأنف رحلتك التعليمية.`
                      : `Your subscription balance is safe..
We have saved your subscription days out of appreciation for your absence, and you will find them complete waiting for you.
We would like to remind you that the 'Pause' feature is granted only once, so take this opportunity and resume your educational journey.`)
                    : (isAr
                      ? 'تم إيقاف الدخول لحسابك بسبب الانقطاع المتكرر. يرجى التفعيل للعودة لدروسك.'
                      : 'Access to your account has been stopped due to repeated interruptions. Please reactivate to return to your lessons.')
                  }
                </p>
              </div>
            </div>

            {/* Commitment Form */}
            <div className="space-y-6 mb-10">
              <h3 className="text-lg font-bold text-gray-900 border-s-4 border-blue-600 ps-3 py-1">
                {isAr ? 'عهد الالتزام والطلبات' : 'Commitment & Requests'}
              </h3>

              <div className="space-y-4">
                <label
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                    willCare ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-gray-50/30 hover:border-blue-200"
                  )}
                >
                  <Checkbox
                    checked={willCare}
                    onCheckedChange={(checked) => setWillCare(checked as boolean)}
                    className="mt-1 h-6 w-6 rounded-lg data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{isAr ? 'سأمنح دراستي الأولوية التي تستحقها' : 'I will give my studies the priority they deserve'}</p>
                    <p className="text-sm text-gray-600">{isAr ? 'أعدكم بأنني سأولي دراستي الاهتمام الكافي ولن أهمل دروسي اليومية.' : 'I promise that I will give my studies sufficient attention and will not neglect my daily lessons.'}</p>
                  </div>
                </label>

                <label
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group",
                    willCommit ? "border-blue-600 bg-blue-50/50" : "border-gray-100 bg-gray-50/30 hover:border-blue-200"
                  )}
                >
                  <Checkbox
                    checked={willCommit}
                    onCheckedChange={(checked) => setWillCommit(checked as boolean)}
                    className="mt-1 h-6 w-6 rounded-lg data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{isAr ? 'ألتزم بمواصلة الدراسة' : 'I commit to continuing studies'}</p>
                    <p className="text-sm text-gray-600">{isAr ? 'أؤكد التزامي بإنهاء المنهج وتحقيق أهدافي التعليمية في Englishom.' : 'I confirm my commitment to completing the curriculum and achieving my educational goals at Englishom.'}</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleReactivate}
              disabled={!willCare || !willCommit || isPending}
              className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all duration-300"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{isAr ? 'جاري تفعيل الحساب...' : 'Reactivating...'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>{isAr ? 'تفعيل الحساب والبدء الآن' : 'Reactivate Account & Start Now'}</span>
                </div>
              )}
            </Button>

            <p className="mt-6 text-center text-sm text-gray-500">
              {isAr ? 'بالنقر على الزر أعلاه، أنت توافق على شروط الالتزام الجديدة.' : 'By clicking the button above, you agree to the new commitment terms.'}
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-10 text-center space-y-6">
          <p className="text-gray-600">
            {isAr ? 'تواجه مشكلة؟ نحن هنا للمساعدة' : 'Having trouble? We are here to help'}
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="https://wa.me/qr/NLKCDGU2XBMEE1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Phone className="h-4 w-4" />
              </div>
              {isAr ? 'تواصل مع الدعم الفني (واتساب)' : 'Contact Technical Support (WhatsApp)'}
            </a>

            <a
              href="https://englishom.com"
              className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
            >
              www.englishom.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendedAccountPage;
