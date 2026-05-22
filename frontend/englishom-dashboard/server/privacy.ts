/**
 * نظام حماية الخصوصية
 * تصفية البيانات الشخصية من البيانات العامة
 */

export interface AchievementData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  achievement: string;
  timestamp: number;
}

export interface SanitizedAchievementData {
  id: string;
  displayName: string;
  city: string;
  achievement: string;
  timestamp: number;
}

/**
 * تصفية بيانات الإنجاز لإزالة المعلومات الشخصية
 */
export function sanitizeAchievementData(
  data: AchievementData
): SanitizedAchievementData {
  // الحصول على الحرف الأول من الاسم الأخير
  const lastNameInitial = data.lastName.charAt(0).toUpperCase();
  
  // إنشاء اسم عرض آمن (أحمد م.)
  const displayName = `${data.firstName} ${lastNameInitial}.`;

  return {
    id: data.id,
    displayName,
    city: data.city,
    achievement: data.achievement,
    timestamp: data.timestamp,
  };
}

/**
 * تصفية مصفوفة من بيانات الإنجازات
 */
export function sanitizeAchievementsArray(
  achievements: AchievementData[]
): SanitizedAchievementData[] {
  return achievements.map(sanitizeAchievementData);
}

/**
 * التحقق من أن البيانات لا تحتوي على معلومات شخصية
 */
export function validateNoPersonalData(data: SanitizedAchievementData): boolean {
  // التحقق من عدم وجود بريد إلكتروني
  if (data.displayName.includes('@')) {
    return false;
  }

  // التحقق من عدم وجود أرقام هاتف (أرقام متتالية طويلة)
  if (/\d{7,}/.test(data.displayName)) {
    return false;
  }

  // التحقق من أن الاسم يحتوي على حرف واحد فقط من الاسم الأخير
  const parts = data.displayName.split(' ');
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.length > 2) {
      // إذا كان الجزء الأخير أطول من حرفين، قد يكون اسم كامل
      return false;
    }
  }

  return true;
}

/**
 * إنشاء رسالة إنجاز آمنة للعرض العام
 */
export function createSafeAchievementMessage(
  sanitized: SanitizedAchievementData
): string {
  const date = new Date(sanitized.timestamp);
  const timeString = date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${sanitized.displayName} من ${sanitized.city} - ${sanitized.achievement} (${timeString})`;
}

/**
 * قائمة الكلمات المحظورة التي قد تحتوي على معلومات شخصية
 */
const FORBIDDEN_PATTERNS = [
  /@/, // بريد إلكتروني
  /\+\d{1,3}/, // رقم هاتف دولي
  /\d{10,}/, // أرقام متتالية طويلة
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // بريد إلكتروني
];

/**
 * التحقق من وجود محتوى محظور
 */
export function containsForbiddenContent(text: string): boolean {
  return FORBIDDEN_PATTERNS.some(pattern => pattern.test(text));
}
