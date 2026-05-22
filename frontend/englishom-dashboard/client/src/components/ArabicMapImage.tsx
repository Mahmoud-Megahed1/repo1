import React, { useState, useEffect } from 'react';

interface ArabicMapImageProps {
  className?: string;
}

type ColorType = 'yellow' | 'cyan' | 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'red';

interface City {
  name: string;
  x: string;
  y: string;
  isRiyadh: boolean;
  color: ColorType;
}

interface Pulse {
  id: number;
  x: string;
  y: string;
  city: string;
  isRiyadh: boolean;
  color: ColorType;
}

const ArabicMapImage: React.FC<ArabicMapImageProps> = ({ className = '' }) => {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  // مدن عربية مع إحداثيات دقيقة على الخريطة الأصلية
  const arabicCities = [
    // مدن السعودية
    { name: 'الرياض', x: '55%', y: '45%', isRiyadh: true, color: 'yellow' },
    { name: 'جدة', x: '38%', y: '35%', isRiyadh: false, color: 'cyan' },
    { name: 'مكة', x: '37%', y: '37%', isRiyadh: false, color: 'blue' },
    { name: 'المدينة', x: '35%', y: '28%', isRiyadh: false, color: 'purple' },
    { name: 'الدمام', x: '65%', y: '40%', isRiyadh: false, color: 'green' },
    { name: 'الخبر', x: '67%', y: '41%', isRiyadh: false, color: 'pink' },
    { name: 'الظهران', x: '68%', y: '42%', isRiyadh: false, color: 'orange' },
    { name: 'الأحساء', x: '69%', y: '43%', isRiyadh: false, color: 'red' },
    { name: 'القصيم', x: '50%', y: '36%', isRiyadh: false, color: 'cyan' },
    { name: 'تبوك', x: '42%', y: '20%', isRiyadh: false, color: 'blue' },
    { name: 'حائل', x: '48%', y: '30%', isRiyadh: false, color: 'purple' },
    { name: 'الجوف', x: '54%', y: '23%', isRiyadh: false, color: 'green' },
    // مدن جنوب السعودية
    { name: 'نجران', x: '58%', y: '72%', isRiyadh: false, color: 'pink' },
    { name: 'جازان', x: '46%', y: '78%', isRiyadh: false, color: 'orange' },
    { name: 'عسير', x: '50%', y: '68%', isRiyadh: false, color: 'red' },
    { name: 'الباحة', x: '48%', y: '52%', isRiyadh: false, color: 'cyan' },
    { name: 'أبها', x: '49%', y: '66%', isRiyadh: false, color: 'blue' },
    { name: 'خميس مشيط', x: '50%', y: '70%', isRiyadh: false, color: 'purple' },
    { name: 'بيشة', x: '52%', y: '55%', isRiyadh: false, color: 'green' },
    { name: 'محايل', x: '54%', y: '71%', isRiyadh: false, color: 'pink' },
    { name: 'صبيا', x: '47%', y: '76%', isRiyadh: false, color: 'orange' },
    { name: 'ضباء', x: '44%', y: '73%', isRiyadh: false, color: 'red' },

    // مدن دول الخليج - السعودية (الساحل الشرقي)
    { name: 'الجبيل', x: '65%', y: '38%', isRiyadh: false, color: 'cyan' },
    { name: 'رأس تنورة', x: '66%', y: '39%', isRiyadh: false, color: 'blue' },
    { name: 'الخفجي', x: '68%', y: '36%', isRiyadh: false, color: 'purple' },
    
    // مدن الكويت
    { name: 'مدينة الكويت', x: '63%', y: '35%', isRiyadh: false, color: 'green' },
    { name: 'الأحمدي', x: '64%', y: '36%', isRiyadh: false, color: 'pink' },
    { name: 'الجهراء', x: '62%', y: '34%', isRiyadh: false, color: 'orange' },
    { name: 'حولي', x: '63%', y: '36%', isRiyadh: false, color: 'red' },
    { name: 'الفروانية', x: '62%', y: '35%', isRiyadh: false, color: 'cyan' },
    
    // مدن قطر
    { name: 'الدوحة', x: '58%', y: '37%', isRiyadh: false, color: 'blue' },
    { name: 'الخور', x: '59%', y: '36%', isRiyadh: false, color: 'purple' },
    { name: 'الوكرة', x: '59%', y: '38%', isRiyadh: false, color: 'green' },
    { name: 'أم صلال', x: '58%', y: '35%', isRiyadh: false, color: 'pink' },
    { name: 'الريان', x: '57%', y: '37%', isRiyadh: false, color: 'orange' },
    
    // مدن البحرين
    { name: 'المنامة', x: '60%', y: '33%', isRiyadh: false, color: 'red' },
    { name: 'المحرق', x: '61%', y: '32%', isRiyadh: false, color: 'cyan' },
    { name: 'الرفاع', x: '60%', y: '34%', isRiyadh: false, color: 'blue' },
    { name: 'عراد', x: '60%', y: '35%', isRiyadh: false, color: 'purple' },
    
    // مدن الإمارات
    { name: 'أبوظبي', x: '66%', y: '45%', isRiyadh: false, color: 'green' },
    { name: 'دبي', x: '68%', y: '44%', isRiyadh: false, color: 'pink' },
    { name: 'الشارقة', x: '69%', y: '43%', isRiyadh: false, color: 'orange' },
    { name: 'عجمان', x: '70%', y: '42%', isRiyadh: false, color: 'red' },
    { name: 'رأس الخيمة', x: '71%', y: '41%', isRiyadh: false, color: 'cyan' },
    { name: 'أم القيوين', x: '71%', y: '40%', isRiyadh: false, color: 'blue' },
    { name: 'الفجيرة', x: '72%', y: '39%', isRiyadh: false, color: 'purple' },
    { name: 'العين', x: '65%', y: '48%', isRiyadh: false, color: 'green' },
    
    // مدن عمان
    { name: 'مسقط', x: '73%', y: '50%', isRiyadh: false, color: 'pink' },
    { name: 'صلالة', x: '70%', y: '60%', isRiyadh: false, color: 'orange' },
    { name: 'صور', x: '76%', y: '48%', isRiyadh: false, color: 'red' },
    { name: 'نزوى', x: '72%', y: '52%', isRiyadh: false, color: 'cyan' },
    { name: 'البريمي', x: '68%', y: '45%', isRiyadh: false, color: 'blue' },
    { name: 'السويق', x: '72%', y: '46%', isRiyadh: false, color: 'purple' },

    // مدن الشام
    { name: 'دمشق', x: '48%', y: '26%', isRiyadh: false, color: 'pink' },
    { name: 'حلب', x: '50%', y: '20%', isRiyadh: false, color: 'orange' },
    { name: 'حمص', x: '48%', y: '28%', isRiyadh: false, color: 'red' },
    { name: 'اللاذقية', x: '46%', y: '22%', isRiyadh: false, color: 'cyan' },
    { name: 'طرطوس', x: '45%', y: '24%', isRiyadh: false, color: 'blue' },
    { name: 'عمّان', x: '46%', y: '30%', isRiyadh: false, color: 'purple' },
    { name: 'إربد', x: '45%', y: '26%', isRiyadh: false, color: 'green' },
    { name: 'الزرقاء', x: '47%', y: '31%', isRiyadh: false, color: 'pink' },
    { name: 'بيروت', x: '46%', y: '24%', isRiyadh: false, color: 'orange' },
    { name: 'طرابلس', x: '45%', y: '21%', isRiyadh: false, color: 'red' },
    { name: 'صيدا', x: '46%', y: '26%', isRiyadh: false, color: 'cyan' },

    // مدن مصر
    { name: 'القاهرة', x: '30%', y: '28%', isRiyadh: false, color: 'blue' },
    { name: 'الإسكندرية', x: '28%', y: '20%', isRiyadh: false, color: 'purple' },
    { name: 'الجيزة', x: '29%', y: '29%', isRiyadh: false, color: 'green' },
    { name: 'القليوبية', x: '30%', y: '26%', isRiyadh: false, color: 'pink' },
    { name: 'الشرقية', x: '34%', y: '30%', isRiyadh: false, color: 'orange' },
    { name: 'الدقهلية', x: '32%', y: '24%', isRiyadh: false, color: 'red' },
    { name: 'كفر الشيخ', x: '30%', y: '22%', isRiyadh: false, color: 'cyan' },
    { name: 'البحيرة', x: '28%', y: '23%', isRiyadh: false, color: 'blue' },
    { name: 'المنوفية', x: '29%', y: '25%', isRiyadh: false, color: 'purple' },
    { name: 'بني سويف', x: '30%', y: '33%', isRiyadh: false, color: 'green' },
    { name: 'الفيوم', x: '28%', y: '34%', isRiyadh: false, color: 'pink' },
    { name: 'المنيا', x: '31%', y: '38%', isRiyadh: false, color: 'orange' },
    { name: 'أسيوط', x: '32%', y: '43%', isRiyadh: false, color: 'red' },
    { name: 'سوهاج', x: '33%', y: '48%', isRiyadh: false, color: 'cyan' },
    { name: 'قنا', x: '34%', y: '53%', isRiyadh: false, color: 'blue' },
    { name: 'الأقصر', x: '34%', y: '56%', isRiyadh: false, color: 'purple' },
    { name: 'أسوان', x: '35%', y: '63%', isRiyadh: false, color: 'green' },
    { name: 'السويس', x: '35%', y: '26%', isRiyadh: false, color: 'pink' },
    { name: 'بورسعيد', x: '33%', y: '20%', isRiyadh: false, color: 'orange' },

    // مدن اليمن
    { name: 'صنعاء', x: '53%', y: '58%', isRiyadh: false, color: 'red' },
    { name: 'عدن', x: '56%', y: '68%', isRiyadh: false, color: 'cyan' },
    { name: 'تعز', x: '52%', y: '63%', isRiyadh: false, color: 'blue' },
    { name: 'إب', x: '53%', y: '60%', isRiyadh: false, color: 'purple' },
    { name: 'الحديدة', x: '50%', y: '56%', isRiyadh: false, color: 'green' },
    { name: 'المكلا', x: '63%', y: '70%', isRiyadh: false, color: 'pink' },
    { name: 'حضرموت', x: '60%', y: '66%', isRiyadh: false, color: 'orange' },
  ];

  useEffect(() => {
    // جميع المدن تومض في نفس الوقت بدون استثناء
    const syncInterval = setInterval(() => {
      const newPulses: Pulse[] = arabicCities.map((city): Pulse => ({
        id: Date.now() + Math.random() * 1000,
        x: city.x,
        y: city.y,
        city: city.name,
        isRiyadh: city.isRiyadh,
        color: city.color as ColorType,
      }));
      setPulses(newPulses);
    }, 1000); // جميع المدن تومض بنفس السرعة مثل الرياض

    return () => {
      clearInterval(syncInterval);
    };
  }, [arabicCities]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-900 ${className}`}>
      {/* الخريطة الأساسية */}
      <img
        src="/manus-storage/arabic-map-neon_86333d8f.png"
        alt="خريطة الدول العربية"
        className="w-full h-full object-cover"
      />

      {/* طبقة النبضات */}
      <div className="absolute inset-0 w-full h-full">
        {pulses.map((pulse) => (
          <div
            key={pulse.id}
            className="absolute"
            style={{
              left: pulse.x,
              top: pulse.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* النبضة الرئيسية */}
            <div
              className={`rounded-full ${
                pulse.isRiyadh
                  ? 'bg-yellow-300 shadow-lg shadow-yellow-300'
                  : pulse.color === 'cyan'
                  ? 'bg-cyan-400 shadow-lg shadow-cyan-400'
                  : pulse.color === 'blue'
                  ? 'bg-blue-500 shadow-lg shadow-blue-500'
                  : pulse.color === 'purple'
                  ? 'bg-purple-500 shadow-lg shadow-purple-500'
                  : pulse.color === 'green'
                  ? 'bg-green-400 shadow-lg shadow-green-400'
                  : pulse.color === 'pink'
                  ? 'bg-pink-500 shadow-lg shadow-pink-500'
                  : pulse.color === 'orange'
                  ? 'bg-orange-500 shadow-lg shadow-orange-500'
                  : 'bg-red-500 shadow-lg shadow-red-500'
              }`}
              style={{
                width: pulse.isRiyadh ? '16px' : '12px',
                height: pulse.isRiyadh ? '16px' : '12px',
                animation: pulse.isRiyadh
                  ? 'pulse-riyadh 1s ease-out infinite'
                  : 'pulse-city 2s ease-out forwards',
              }}
            />
            {/* الحلقات المتوسعة */}
            <div
              className={`absolute rounded-full ${
                pulse.isRiyadh
                  ? 'border-2 border-yellow-300'
                  : pulse.color === 'cyan'
                  ? 'border-2 border-cyan-400'
                  : pulse.color === 'blue'
                  ? 'border-2 border-blue-500'
                  : pulse.color === 'purple'
                  ? 'border-2 border-purple-500'
                  : pulse.color === 'green'
                  ? 'border-2 border-green-400'
                  : pulse.color === 'pink'
                  ? 'border-2 border-pink-500'
                  : pulse.color === 'orange'
                  ? 'border-2 border-orange-500'
                  : 'border-2 border-red-500'
              }`}
              style={{
                width: pulse.isRiyadh ? '16px' : '12px',
                height: pulse.isRiyadh ? '16px' : '12px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: pulse.isRiyadh
                  ? 'ring-riyadh 1s ease-out infinite'
                  : 'ring-city 2s ease-out forwards',
              }}
            />
          </div>
        ))}
      </div>

      {/* أنماط الرسوم المتحركة */}
      <style>{`
        @keyframes pulse-riyadh {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0.3;
            transform: scale(1.5);
          }
        }

        @keyframes ring-riyadh {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.5);
          }
        }

        @keyframes pulse-city {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        @keyframes ring-city {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.5);
          }
        }
      `}</style>
    </div>
  );
};

export default ArabicMapImage;
