import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cache, CACHE_KEYS, CACHE_TTL } from './cache';
import {
  sanitizeAchievementData,
  sanitizeAchievementsArray,
  validateNoPersonalData,
  createSafeAchievementMessage,
  containsForbiddenContent,
  AchievementData,
} from './privacy';

describe('Cache System', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterEach(() => {
    cache.clear();
  });

  it('should store and retrieve data', () => {
    const testData = { value: 'test' };
    cache.set(CACHE_KEYS.PUBLIC_STATS, testData, CACHE_TTL.SHORT);

    const retrieved = cache.get(CACHE_KEYS.PUBLIC_STATS);
    expect(retrieved).toEqual(testData);
  });

  it('should return null for non-existent keys', () => {
    const retrieved = cache.get('non-existent-key');
    expect(retrieved).toBeNull();
  });

  it('should delete cached data', () => {
    cache.set(CACHE_KEYS.PUBLIC_STATS, { value: 'test' }, CACHE_TTL.SHORT);
    cache.delete(CACHE_KEYS.PUBLIC_STATS);

    const retrieved = cache.get(CACHE_KEYS.PUBLIC_STATS);
    expect(retrieved).toBeNull();
  });

  it('should provide cache statistics', () => {
    cache.set(CACHE_KEYS.PUBLIC_STATS, { value: 'test1' }, CACHE_TTL.SHORT);
    cache.set(CACHE_KEYS.LIVE_STATS, { value: 'test2' }, CACHE_TTL.SHORT);

    const stats = cache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.keys).toContain(CACHE_KEYS.PUBLIC_STATS);
    expect(stats.keys).toContain(CACHE_KEYS.LIVE_STATS);
  });
});

describe('Privacy System', () => {
  const testAchievement: AchievementData = {
    id: '123',
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    city: 'الرياض',
    country: 'السعودية',
    achievement: 'اجتياز اختبار المستوى A1 بنسبة 92%',
    timestamp: Date.now(),
  };

  it('should sanitize achievement data correctly', () => {
    const sanitized = sanitizeAchievementData(testAchievement);

    expect(sanitized.id).toBe('123');
    expect(sanitized.displayName).toBe('أحمد م.');
    expect(sanitized.city).toBe('الرياض');
    expect(sanitized.achievement).toBe('اجتياز اختبار المستوى A1 بنسبة 92%');
    expect(sanitized.timestamp).toBe(testAchievement.timestamp);
  });

  it('should not contain email in sanitized data', () => {
    const sanitized = sanitizeAchievementData(testAchievement);
    expect(sanitized.displayName).not.toContain('@');
    expect(sanitized.displayName).not.toContain('example.com');
  });

  it('should not contain phone number in sanitized data', () => {
    const sanitized = sanitizeAchievementData(testAchievement);
    expect(sanitized.displayName).not.toContain('966');
    expect(sanitized.displayName).not.toContain('501234567');
  });

  it('should validate sanitized data has no personal info', () => {
    const sanitized = sanitizeAchievementData(testAchievement);
    const isValid = validateNoPersonalData(sanitized);
    expect(isValid).toBe(true);
  });

  it('should sanitize array of achievements', () => {
    const achievements = [testAchievement, testAchievement];
    const sanitized = sanitizeAchievementsArray(achievements);

    expect(sanitized).toHaveLength(2);
    sanitized.forEach(item => {
      expect(item.displayName).toBe('أحمد م.');
      expect(validateNoPersonalData(item)).toBe(true);
    });
  });

  it('should create safe achievement message', () => {
    const sanitized = sanitizeAchievementData(testAchievement);
    const message = createSafeAchievementMessage(sanitized);

    expect(message).toContain('أحمد م.');
    expect(message).toContain('الرياض');
    expect(message).toContain('اجتياز اختبار المستوى A1 بنسبة 92%');
    expect(message).not.toContain('@');
    expect(message).not.toContain('966');
  });

  it('should detect email addresses', () => {
    expect(containsForbiddenContent('test@example.com')).toBe(true);
    expect(containsForbiddenContent('user.name@domain.co.uk')).toBe(true);
  });

  it('should detect international phone numbers', () => {
    expect(containsForbiddenContent('+966501234567')).toBe(true);
    expect(containsForbiddenContent('+1-800-123-4567')).toBe(true);
  });

  it('should detect long number sequences', () => {
    expect(containsForbiddenContent('1234567890')).toBe(true);
  });

  it('should not flag safe content', () => {
    expect(containsForbiddenContent('أحمد م. من الرياض')).toBe(false);
    expect(containsForbiddenContent('طالب من القاهرة')).toBe(false);
  });
});
