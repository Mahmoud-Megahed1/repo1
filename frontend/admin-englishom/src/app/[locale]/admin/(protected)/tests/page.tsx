'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShieldCheck, Zap, Award, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TestItem {
  id: 'ques' | 'test' | 'test1';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  publicUrl: string;
  adminUrl: string;
  icon: any;
}

const TESTS: TestItem[] = [
  {
    id: 'ques',
    titleAr: 'مستوى الكفاءة',
    titleEn: 'Proficiency Level',
    descAr: 'اختبار تحدي أسئلة خيارات متعددة سريع لقياس المستوى العام.',
    descEn: 'Fast-paced multiple choice question challenge for general level assessment.',
    publicUrl: 'https://englishom.com/ques/',
    adminUrl: 'https://englishom.com/ques/admin?admin=1',
    icon: Zap,
  },
  {
    id: 'test',
    titleAr: 'اكتشف مستواك',
    titleEn: 'Discover Your Level',
    descAr: 'اختبار التقييم التفاعلي لمهارات اللغة الإنجليزية الأساسية.',
    descEn: 'Interactive assessment test for core English language skills.',
    publicUrl: 'https://englishom.com/test/',
    adminUrl: 'https://englishom.com/test/admin?admin=1',
    icon: BookOpen,
  },
  {
    id: 'test1',
    titleAr: 'مؤشر الإنجاز',
    titleEn: 'Achievement Indicator',
    descAr: 'مقياس التمكن وبناء مهارات التأسيس من إنجلشوم.',
    descEn: 'Mastery Scale & Foundation Building assessment by EnglishOM.',
    publicUrl: 'https://englishom.com/test1/',
    adminUrl: 'https://englishom.com/test1/admin?admin=1',
    icon: Award,
  },
];

export default function TestsAdminPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [availability, setAvailability] = useState<Record<string, boolean>>({
    ques: true,
    test: true,
    test1: true,
  });

  useEffect(() => {
    fetch(`https://api.englishom.com/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.testsAvailability) {
          setAvailability(data.testsAvailability);
          localStorage.setItem('englishom_tests_availability', JSON.stringify(data.testsAvailability));
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('englishom_tests_availability');
        if (saved) {
          try { setAvailability(JSON.parse(saved)); } catch (e) {}
        }
      });
  }, []);

  const handleToggle = async (id: string, currentVal: boolean) => {
    const newVal = !currentVal;
    const updated = { ...availability, [id]: newVal };
    setAvailability(updated);
    localStorage.setItem('englishom_tests_availability', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    try {
      await fetch('https://api.englishom.com/api/settings/tests-availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testsAvailability: { [id]: newVal } }),
      });
    } catch (e) {
      console.error('Failed to sync backend settings:', e);
    }

    toast.success(
      isAr
        ? `تم ${newVal ? 'تفعيل' : 'إيقاف'} ظهور الاختبار بنجاح`
        : `Test ${newVal ? 'activated' : 'deactivated'} successfully`
    );
  };

  const handleOpenAdmin = (adminUrl: string) => {
    // Auto-login super admin session and open test admin panel
    const token = localStorage.getItem('token') || 'super_admin_session';
    document.cookie = `super_admin_session=${token}; path=/; domain=.englishom.com`;
    window.open(adminUrl, '_blank');
  };

  return (
    <div className="space-y-8 p-1 md:p-4" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {isAr ? 'إدارة الاختبارات' : 'Tests Management'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isAr
            ? 'التحكم في إتاحة ونشر اختبارات المنصة والوصول المباشر للوحة إدارة كل اختبار.'
            : 'Manage platform test availability and direct super admin access to test control panels.'}
        </p>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTS.map((test) => {
          const Icon = test.icon;
          const isAvailable = availability[test.id] !== false;

          return (
            <Card
              key={test.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border ${
                isAvailable
                  ? 'border-emerald-500/30 bg-card'
                  : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20'
              }`}
            >
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <Badge
                    variant={isAvailable ? 'default' : 'secondary'}
                    className={`gap-1.5 px-3 py-1 text-xs font-bold ${
                      isAvailable
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'متاح للعامة' : 'Publicly Available'}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        {isAr ? 'غير متاح (قريباً)' : 'Unavailable (Soon)'}
                      </>
                    )}
                  </Badge>
                </div>

                <div>
                  <CardTitle className="text-xl font-extrabold text-foreground">
                    {isAr ? test.titleAr : test.titleEn}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {isAr ? test.descAr : test.descEn}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-2">
                {/* Availability Toggle Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border/80">
                  <span className="text-sm font-bold text-foreground">
                    {isAr ? 'الإتاحة (Availability)' : 'Availability'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={() => handleToggle(test.id, isAvailable)}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={() => handleOpenAdmin(test.adminUrl)}
                    className="w-full gap-2 font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isAr ? 'دخول لوحة التحكّم (Super Admin)' : 'Open Admin Panel'}
                  </Button>

                  <a
                    href={test.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {isAr ? 'معاينة الصفحة العامة' : 'Preview Public Page'}
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
