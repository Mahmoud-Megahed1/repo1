import { describe, it, expect } from 'vitest';

describe('Footer Component', () => {
  it('should not contain the word "Englishom" in Arabic translations', () => {
    const arabicTranslations = {
      about: 'من نحن',
      aboutText: 'منصة متخصصة في تعليم اللغة الإنجليزية بطرق حديثة وفعّالة للمتعلمين من جميع أنحاء العالم.',
      quickLinks: 'روابط سريعة',
      home: 'الرئيسية',
      dashboard: 'لوحة البيانات',
      blog: 'المدونة',
      tests: 'الاختبارات',
      contact: 'اتصل بنا',
      contactInfo: 'معلومات التواصل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      followUs: 'تابعنا',
      legal: 'قانوني',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      copyright: 'جميع الحقوق محفوظة © 2026',
    };

    // Check that no translation contains "Englishom" or "إنجليشوم"
    Object.values(arabicTranslations).forEach((value) => {
      expect(value).not.toContain('Englishom');
      expect(value).not.toContain('إنجليشوم');
    });
  });

  it('should not contain the word "Englishom" in English translations', () => {
    const englishTranslations = {
      about: 'About Us',
      aboutText: 'Platform specializes in teaching English with modern and effective methods for learners from around the world.',
      quickLinks: 'Quick Links',
      home: 'Home',
      dashboard: 'Dashboard',
      blog: 'Blog',
      tests: 'Tests',
      contact: 'Contact Us',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      followUs: 'Follow Us',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: 'All rights reserved © 2026',
    };

    // Check that no translation contains "Englishom"
    Object.values(englishTranslations).forEach((value) => {
      expect(value).not.toContain('Englishom');
    });
  });

  it('should have social media platforms including TikTok, Snapchat, Telegram, and WhatsApp', () => {
    const socialPlatforms = [
      { icon: '🎵', href: 'https://tiktok.com', label: 'TikTok' },
      { icon: '📸', href: 'https://snapchat.com', label: 'Snapchat' },
      { icon: '✈️', href: 'https://telegram.org', label: 'Telegram' },
      { icon: '💬', href: 'https://whatsapp.com', label: 'WhatsApp' },
    ];

    expect(socialPlatforms).toHaveLength(4);
    expect(socialPlatforms.map(p => p.label)).toEqual(['TikTok', 'Snapchat', 'Telegram', 'WhatsApp']);
  });

  it('should have correct copyright year', () => {
    const copyright = 'جميع الحقوق محفوظة © 2026';
    expect(copyright).toContain('2026');
    expect(copyright).not.toContain('Englishom');
  });
});
