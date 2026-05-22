import React, { useEffect, useState } from 'react';

interface ArabicMapProps {
  className?: string;
}

const ArabicMap: React.FC<ArabicMapProps> = ({ className = '' }) => {
  const [pulses, setPulses] = useState<Array<{ id: number; x: number; y: number; city: string }>>([]);

  // مدن عربية رئيسية مع إحداثياتها التقريبية على الخريطة
  const arabicCities = [
    { name: 'الرياض', x: 65, y: 45 },
    { name: 'جدة', x: 40, y: 35 },
    { name: 'الدمام', x: 75, y: 38 },
    { name: 'القاهرة', x: 35, y: 25 },
    { name: 'الإسكندرية', x: 32, y: 18 },
    { name: 'الجيزة', x: 34, y: 26 },
    { name: 'الأقصر', x: 38, y: 35 },
    { name: 'أسوان', x: 40, y: 42 },
    { name: 'الإمارات', x: 72, y: 42 },
    { name: 'دبي', x: 73, y: 43 },
    { name: 'أبوظبي', x: 70, y: 44 },
    { name: 'الكويت', x: 68, y: 32 },
    { name: 'البحرين', x: 65, y: 30 },
    { name: 'قطر', x: 62, y: 35 },
    { name: 'عمّان', x: 48, y: 28 },
    { name: 'بيروت', x: 50, y: 22 },
    { name: 'دمشق', x: 52, y: 24 },
    { name: 'بغداد', x: 58, y: 28 },
    { name: 'الموصل', x: 60, y: 22 },
    { name: 'صنعاء', x: 55, y: 55 },
    { name: 'عدن', x: 60, y: 62 },
    { name: 'مسقط', x: 75, y: 50 },
    { name: 'الخرطوم', x: 45, y: 48 },
    { name: 'طرابلس', x: 28, y: 20 },
    { name: 'بنغازي', x: 38, y: 18 },
    { name: 'الجزائر', x: 20, y: 22 },
    { name: 'تونس', x: 32, y: 15 },
    { name: 'الرباط', x: 12, y: 18 },
    { name: 'فاس', x: 16, y: 16 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCity = arabicCities[Math.floor(Math.random() * arabicCities.length)];
      const newPulse = {
        id: Date.now(),
        x: randomCity.x,
        y: randomCity.y,
        city: randomCity.name,
      };
      setPulses((prev) => [...prev, newPulse]);

      // إزالة النبضة بعد انتهاء الرسوم المتحركة
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
      }, 2000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* خريطة الدول العربية بسيطة - أسود خفيف مع حدود خضراء */}
        <defs>
          <style>{`
            .arab-country {
              fill: #1a2332;
              stroke: #22c55e;
              stroke-width: 0.5;
              opacity: 0.8;
            }
            .arab-country:hover {
              fill: #2a3f52;
              opacity: 1;
            }
          `}</style>
        </defs>

        {/* السعودية */}
        <polygon
          className="arab-country"
          points="45,30 70,25 75,50 60,60 40,55 35,40"
        />

        {/* مصر */}
        <polygon
          className="arab-country"
          points="30,15 40,12 42,40 35,45 28,35"
        />

        {/* العراق */}
        <polygon
          className="arab-country"
          points="50,20 65,18 68,35 55,38 48,30"
        />

        {/* الإمارات والخليج */}
        <polygon
          className="arab-country"
          points="68,35 78,33 80,48 70,50 65,42"
        />

        {/* اليمن */}
        <polygon
          className="arab-country"
          points="48,50 65,48 70,70 50,75 42,60"
        />

        {/* عمّان والشام */}
        <polygon
          className="arab-country"
          points="45,20 55,18 58,32 48,35 42,28"
        />

        {/* لبنان وسوريا */}
        <polygon
          className="arab-country"
          points="48,15 52,14 54,25 50,26 46,20"
        />

        {/* الكويت والبحرين وقطر */}
        <polygon
          className="arab-country"
          points="62,28 70,27 72,38 65,39 60,32"
        />

        {/* عمّان */}
        <polygon
          className="arab-country"
          points="45,25 50,24 52,32 48,33 44,28"
        />

        {/* السودان */}
        <polygon
          className="arab-country"
          points="35,45 50,42 52,65 38,68 32,55"
        />

        {/* ليبيا */}
        <polygon
          className="arab-country"
          points="20,15 40,12 42,35 25,38 18,25"
        />

        {/* تونس والجزائر والمغرب */}
        <polygon
          className="arab-country"
          points="10,12 35,10 38,28 15,30 8,20"
        />

        {/* عمّان */}
        <polygon
          className="arab-country"
          points="50,18 55,17 57,28 52,30 48,22"
        />

        {/* النبضات من المدن */}
        {pulses.map((pulse) => (
          <g key={pulse.id}>
            {/* الدائرة الأولى */}
            <circle
              cx={pulse.x}
              cy={pulse.y}
              r="1.5"
              fill="none"
              stroke="#00ff00"
              strokeWidth="0.3"
              opacity="1"
              style={{
                animation: 'pulse-ring 2s ease-out forwards',
              }}
            />
            {/* النقطة المركزية */}
            <circle
              cx={pulse.x}
              cy={pulse.y}
              r="0.6"
              fill="#00ff00"
              opacity="1"
              style={{
                animation: 'pulse-dot 2s ease-out forwards',
              }}
            />
            {/* الدائرة الثانية */}
            <circle
              cx={pulse.x}
              cy={pulse.y}
              r="1"
              fill="none"
              stroke="#00ff00"
              strokeWidth="0.2"
              opacity="0.5"
              style={{
                animation: 'pulse-ring-2 2s ease-out forwards',
              }}
            />
          </g>
        ))}
      </svg>

      {/* أنماط الرسوم المتحركة */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            r: 1.5;
            opacity: 1;
          }
          100% {
            r: 4;
            opacity: 0;
          }
        }

        @keyframes pulse-ring-2 {
          0% {
            r: 1;
            opacity: 0.8;
          }
          100% {
            r: 3;
            opacity: 0;
          }
        }

        @keyframes pulse-dot {
          0% {
            r: 0.6;
            opacity: 1;
          }
          50% {
            r: 0.8;
            opacity: 1;
          }
          100% {
            r: 0.6;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ArabicMap;
