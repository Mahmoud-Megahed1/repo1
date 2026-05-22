# توثيق تكامل API - لوحة البيانات الحية

## نقاط ربط API الرئيسية

### 1. الحصول على إحصائيات لوحة البيانات

**المسار:** `GET /api/trpc/dashboard.getStats`

**الاستجابة المتوقعة:**
```json
{
  "totalRegistrations": 24981,
  "todayRegistrations": 150,
  "topCountry": "مصر",
  "topCountryCount": 4300,
  "lastRegistration": {
    "country": "السعودية",
    "time": "2026-05-12T10:30:00Z"
  },
  "registrationsByCity": {
    "Cairo": 4300,
    "Istanbul": 3100,
    "Amman": 2800,
    "London": 2500,
    "Paris": 2100,
    "Riyadh": 5181
  }
}
```

## خطوات التكامل

### الخطوة 1: إنشاء Procedure في tRPC

في ملف `server/routers.ts`، أضف الـ procedure التالي:

```typescript
dashboard: router({
  getStats: publicProcedure.query(async ({ ctx }) => {
    // استدعاء API الحقيقية الخاصة بك
    const stats = await fetch('YOUR_API_ENDPOINT/stats');
    const data = await stats.json();
    
    return {
      totalRegistrations: data.total,
      todayRegistrations: data.today,
      topCountry: data.topCountry.name,
      topCountryCount: data.topCountry.count,
      lastRegistration: {
        country: data.lastReg.country,
        time: data.lastReg.timestamp,
      },
      registrationsByCity: data.byCity,
    };
  }),
}),
```

### الخطوة 2: تحديث LiveDashboard.tsx

في ملف `client/src/pages/LiveDashboard.tsx`، استبدل البيانات التجريبية بـ API الحقيقية:

```typescript
const updateData = async () => {
  setIsLoading(true);
  try {
    // استخدام tRPC للحصول على البيانات
    const data = await trpc.dashboard.getStats.query();
    setStats(data);
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### الخطوة 3: تحديث معدل التحديث

يمكن تغيير معدل التحديث من 30 ثانية إلى أي قيمة أخرى:

```typescript
// في LiveDashboard.tsx، غير هذا السطر:
updateIntervalRef.current = setInterval(updateData, 30000); // 30 ثانية

// إلى:
updateIntervalRef.current = setInterval(updateData, 10000); // 10 ثوانٍ
```

## البيانات التجريبية الحالية

اللوحة تستخدم حالياً **بيانات تجريبية** (Mock Data) لأغراض التطوير والاختبار. يمكنك رؤية البيانات في:

- **الملف:** `client/src/pages/LiveDashboard.tsx`
- **الدالة:** `generateMockData()`

## التضمين عبر iframe

يمكن تضمين لوحة البيانات في موقعك الرئيسي عبر iframe:

```html
<iframe 
  src="https://your-domain.com/dashboard" 
  width="100%" 
  height="800" 
  frameborder="0"
  allow="fullscreen"
></iframe>
```

أو كرابط مباشر:

```html
<a href="https://your-domain.com/dashboard" target="_blank">
  اكتشف لوحة البيانات الحية
</a>
```

## البيانات المتاحة للتحديث

| الحقل | النوع | الوصف |
|------|------|-------|
| `totalRegistrations` | number | إجمالي عدد المسجلين |
| `todayRegistrations` | number | عدد المسجلين اليوم |
| `topCountry` | string | أكثر دولة تسجيلاً |
| `topCountryCount` | number | عدد المسجلين من أكثر دولة |
| `lastRegistration.country` | string | آخر دولة قام بالتسجيل |
| `lastRegistration.time` | string | وقت آخر تسجيل |
| `registrationsByCity` | object | عدد المسجلين حسب المدينة |

## ملاحظات مهمة

1. **معدل التحديث:** اللوحة تحدث البيانات تلقائياً كل 30 ثانية
2. **الأداء:** تأكد من أن API الخاصة بك قادرة على التعامل مع الطلبات المتكررة
3. **التخزين المؤقت:** يمكنك إضافة caching على جانب الخادم لتحسين الأداء
4. **معالجة الأخطاء:** تأكد من معالجة الأخطاء بشكل صحيح عند فشل الاتصال

## الألوان والتصميم

اللوحة تستخدم نظام ألوان **Cyber-Security Futuristic**:

- **الخلفية:** Graphite Dark (`oklch(0.08 0.01 262)`)
- **النيون الأزرق:** Cyan (`oklch(0.7 0.25 180)`)
- **النيون الأرجواني:** Purple (`oklch(0.7 0.25 270)`)
- **التوهج:** Glow effects مع opacity متغيرة

## الدعم والمساعدة

للمزيد من المعلومات أو الدعم، يرجى التواصل مع فريق التطوير.
