/**
 * In-Memory Cache System
 * تخزين مؤقت في الذاكرة لتقليل الضغط على قاعدة البيانات
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private store = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // تنظيف البيانات المنتهية الصلاحية كل دقيقة
    this.startCleanup();
  }

  /**
   * حفظ بيانات في الذاكرة المؤقتة
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  /**
   * الحصول على بيانات من الذاكرة المؤقتة
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // التحقق من انتهاء صلاحية البيانات
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * حذف بيانات من الذاكرة المؤقتة
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * تنظيف الذاكرة المؤقتة
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * تنظيف الذاكرة المؤقتة
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let deletedCount = 0;

      const keysToDelete: string[] = [];
      this.store.forEach((entry, key) => {
        if (now - entry.timestamp > entry.ttl) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach(key => {
        this.store.delete(key);
        deletedCount++;
      })

      if (deletedCount > 0) {
        console.log(`[Cache] تم حذف ${deletedCount} عنصر منتهي الصلاحية`);
      }
    }, 60000); // كل دقيقة
  }

  /**
   * إيقاف عملية التنظيف
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * الحصول على إحصائيات الذاكرة المؤقتة
   */
  getStats(): { size: number; keys: string[] } {
    const keys: string[] = [];
    this.store.forEach((_, key) => {
      keys.push(key);
    });
    return {
      size: this.store.size,
      keys,
    };
  }
}

// إنشاء نسخة واحدة من الـ Cache (Singleton)
export const cache = new Cache();

/**
 * مفاتيح الـ Cache المستخدمة
 */
export const CACHE_KEYS = {
  PUBLIC_STATS: 'public_stats',
  LIVE_STATS: 'live_stats',
  ACHIEVEMENTS: 'achievements',
  LEARNING_ACTIVITY: 'learning_activity',
  SHIELD_CHALLENGES: 'shield_challenges',
  REALITY_CHALLENGE: 'reality_challenge',
  GATEWAY_QUIZ: 'gateway_quiz',
  CITIES_PICKER: 'cities_picker',
} as const;

/**
 * مدة صلاحية الـ Cache (بالثواني)
 */
export const CACHE_TTL = {
  SHORT: 30, // 30 ثانية
  MEDIUM: 300, // 5 دقائق
  LONG: 900, // 15 دقيقة
} as const;
