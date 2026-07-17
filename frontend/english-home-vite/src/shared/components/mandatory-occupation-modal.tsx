import { useAuth } from '@shared/components/contexts/auth-context';
import { updateUserOccupation } from '@shared/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@ui/dialog';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { UserCheck } from 'lucide-react';

const OCCUPATION_OPTIONS = [
  { key: 'school_student', labelAr: 'طالب مدرسة', labelEn: 'School Student' },
  { key: 'university_student', labelAr: 'طالب جامعي', labelEn: 'University Student' },
  { key: 'employee', labelAr: 'موظف', labelEn: 'Employee' },
  { key: 'job_seeker', labelAr: 'باحث عن عمل', labelEn: 'Job Seeker' },
  { key: 'interested', labelAr: 'مهتم', labelEn: 'Interested' },
  { key: 'other', labelAr: 'أخرى', labelEn: 'Other' },
] as const;

export function MandatoryOccupationModal() {
  const { user, isSuccess } = useAuth();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isOpen = !!(isSuccess && user && (!user.occupation || user.occupation.trim() === ''));

  const { mutate, isPending } = useMutation({
    mutationFn: async (occupation: string) => {
      if (!user?._id) return;
      return await updateUserOccupation(user._id, occupation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError(isAr ? 'يرجى اختيار صفتك الحالية' : 'Please select your role');
      return;
    }

    let finalOccupation = selected;
    if (selected === 'other') {
      if (!customText.trim()) {
        setError(isAr ? 'يرجى كتابة صفتك الحالية' : 'Please specify your role');
        return;
      }
      finalOccupation = customText.trim();
    } else {
      const found = OCCUPATION_OPTIONS.find((o) => o.key === selected);
      finalOccupation = isAr ? found?.labelAr || selected : found?.labelEn || selected;
    }

    setError('');
    mutate(finalOccupation);
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md border-primary/20 bg-card p-6 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCheck className="h-7 w-7" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            {isAr ? 'بصفتك الحالية: "أنا..."' : 'Select Your Role'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {isAr
              ? 'يرجى تحديد الخيار الأنسب لك لتخصيص تجربتك واستكمال استخدام المنصة'
              : 'Please select the option that best describes you'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid gap-2.5">
            {OCCUPATION_OPTIONS.map((opt) => {
              const label = isAr ? opt.labelAr : opt.labelEn;
              const isSelected = selected === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelected(opt.key);
                    setError('');
                  }}
                  className={`flex items-center justify-between w-full p-3 rounded-lg border text-sm font-medium transition-all text-start ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-sm font-bold'
                      : 'border-border/60 hover:bg-accent hover:border-border'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>

          {selected === 'other' && (
            <div className="space-y-1.5 animate-in fade-in-50">
              <Input
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setError('');
                }}
                placeholder={isAr ? 'اكتب وظيفتك أو صفتك الحالية هنا...' : 'Specify your role here...'}
                className="w-full text-sm"
                autoFocus
              />
            </div>
          )}

          {error && <p className="text-xs font-semibold text-destructive text-center">{error}</p>}

          <Button type="submit" disabled={isPending} className="w-full py-5 text-base font-bold">
            {isPending ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ ومتابعة' : 'Save & Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
