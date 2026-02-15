import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useVoluntaryPause, useVoluntaryResume } from '@/modules/auth/mutations';
import { useAuth } from '@/shared/components/contexts/auth-context';
import { Clock, Info, Play, Snowflake } from 'lucide-react';
import { Slider } from '@/shared/components/ui/slider';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const FreezeSubscriptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const { user } = useAuth();
    const [duration, setDuration] = useState([5]);

    const { mutate: pause, isPending: isPausing } = useVoluntaryPause();
    const { mutate: resume, isPending: isResuming } = useVoluntaryResume();

    const handlePause = () => {
        pause({ data: { durationDays: duration[0] } }, {
            onSuccess: () => onClose()
        });
    };

    const handleResume = () => {
        resume(undefined, {
            onSuccess: () => onClose()
        });
    };

    const remainingDays = 20 - (user?.totalPausedDays || 0);
    const remainingAttempts = 2 - (user?.voluntaryPauseAttempts || 0);

    if (user?.isVoluntaryPaused) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md rounded-3xl pb-8">
                    <DialogHeader className="items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <Snowflake className="h-8 w-8 animate-pulse" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">
                            {isAr ? 'اشتراكك متجمد حالياً' : 'Your Subscription is Frozen'}
                        </DialogTitle>
                        <DialogDescription className="text-balance text-base mt-2">
                            {isAr
                                ? `اشتراكك متوقف مؤقتاً وسيتفعل تلقائياً بتاريخ ${new Date(user.pauseScheduledEndDate!).toLocaleDateString('ar-EG')}. هل تود العودة للدراسة الآن؟`
                                : `Your subscription is paused and will automatically reactivate on ${new Date(user.pauseScheduledEndDate!).toLocaleDateString()}. Would you like to resume now?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 sm:flex-col gap-3">
                        <Button
                            onClick={handleResume}
                            disabled={isResuming}
                            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg"
                        >
                            {isResuming ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>{isAr ? 'جاري الاستئناف...' : 'Resuming...'}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Play className="h-5 w-5" />
                                    <span>{isAr ? 'استئناف الدراسة الآن' : 'Resume Studies Now'}</span>
                                </div>
                            )}
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full text-gray-500">
                            {isAr ? 'إغلاق' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-3xl pb-8">
                <DialogHeader className="items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Clock className="h-8 w-8" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {isAr ? 'تجميد الاشتراك مؤقتاً' : 'Freeze Subscription'}
                    </DialogTitle>
                    <DialogDescription className="text-balance text-base mt-2">
                        {isAr
                            ? 'يمكنك إيقاف استهلاك أيام اشتراكك لفترة محددة إذا كنت مشغولاً. لديك فرصتان فقط بإجمالي 20 يوماً.'
                            : 'You can pause your subscription days for a specific period if you are busy. You have only 2 attempts with a total of 20 days.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-8">
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                            <p className="text-xs text-blue-600 font-medium uppercase mb-1">{isAr ? 'الأيام المتبقية' : 'Remaining Days'}</p>
                            <p className="text-2xl font-bold text-blue-900">{remainingDays}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                            <p className="text-xs text-purple-600 font-medium uppercase mb-1">{isAr ? 'الفرص المتبقية' : 'Remaining Attempts'}</p>
                            <p className="text-2xl font-bold text-purple-900">{remainingAttempts}</p>
                        </div>
                    </div>

                    {/* Duration Selection */}
                    {remainingAttempts > 0 && remainingDays > 0 ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <label className="font-bold text-gray-900">{isAr ? 'مدة التجميد بالساعات' : 'Freeze Duration'}</label>
                                <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-lg">
                                    {duration[0]} {isAr ? 'يوم' : 'Days'}
                                </span>
                            </div>
                            <Slider
                                value={duration}
                                onValueChange={setDuration}
                                max={Math.min(remainingDays, 20)}
                                min={1}
                                step={1}
                                className="py-4"
                            />

                            <div className="flex gap-3 text-sm bg-gray-50 p-4 rounded-2xl text-gray-600">
                                <Info className="h-5 w-5 text-indigo-500 shrink-0" />
                                <p>
                                    {isAr
                                        ? 'سيتم استئناف الاشتراك تلقائياً بعد انتهاء المدة المحددة، ويمكنك العودة يدوياً في أي وقت.'
                                        : 'Subscription will automatically resume after the set period, and you can resume manually at any time.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl border-2 border-dashed border-red-100 bg-red-50 text-center">
                            <p className="text-red-700 font-medium">
                                {remainingAttempts <= 0
                                    ? (isAr ? 'لقد استنفدت جميع فرص التجميد المتاحة (مرتين).' : 'You have used all available freeze attempts (2 times).')
                                    : (isAr ? 'لم يتبق لديك رصيد أيام متاح للتجميد.' : 'You have no remaining days available to freeze.')}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-2 sm:flex-col gap-3">
                    <Button
                        onClick={handlePause}
                        disabled={isPausing || remainingAttempts <= 0 || remainingDays <= 0}
                        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-lg shadow-indigo-100"
                    >
                        {isPausing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span>{isAr ? 'جاري المعالجة...' : 'Processing...'}</span>
                            </div>
                        ) : (
                            <span>{isAr ? 'تجميد الاشتراك الآن' : 'Freeze Subscription Now'}</span>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="w-full text-gray-500">
                        {isAr ? 'تراجع' : 'Cancel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FreezeSubscriptionModal;
