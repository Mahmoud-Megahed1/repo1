import React, { useEffect, useRef, useState } from 'react';

interface City {
  name: string;
  lat: number;
  lng: number;
  count: number;
  isTarget?: boolean;
}

interface VisibleWorldMapProps {
  registrationsByCity: {
    [key: string]: number;
  };
}

const CITIES: City[] = [
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, count: 0 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, count: 0 },
  { name: 'Amman', lat: 31.9454, lng: 35.9284, count: 0 },
  { name: 'London', lat: 51.5074, lng: -0.1278, count: 0 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, count: 0 },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, count: 0, isTarget: true },
];

// تحويل الإحداثيات الجغرافية إلى إحداثيات Canvas
const latLngToCanvas = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

interface Meteor {
  id: string;
  fromCity: City;
  startTime: number;
  duration: number;
}

export default function VisibleWorldMap({ registrationsByCity }: VisibleWorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const meteorIdRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const citiesWithCounts: City[] = CITIES.map(city => ({
    ...city,
    count: registrationsByCity[city.name] || 0,
  }));

  const width = 1200;
  const height = 600;

  // رسم الخريطة والشهب
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // خلفية
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // شبكة خلفية
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // رسم القارات (مبسطة)
      ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;

      // North America
      ctx.beginPath();
      ctx.ellipse(200, 150, 80, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // South America
      ctx.beginPath();
      ctx.ellipse(280, 350, 60, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Europe
      ctx.beginPath();
      ctx.ellipse(450, 120, 70, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Africa
      ctx.beginPath();
      ctx.ellipse(520, 280, 80, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Asia
      ctx.beginPath();
      ctx.ellipse(750, 200, 150, 100, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Australia
      ctx.beginPath();
      ctx.ellipse(850, 420, 60, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const targetCity = citiesWithCounts.find(c => c.isTarget)!;
      const targetCoords = latLngToCanvas(targetCity.lat, targetCity.lng, width, height);

      // رسم خطوط الاتصال من المدن للرياض
      citiesWithCounts
        .filter(c => !c.isTarget)
        .forEach(city => {
          const fromCoords = latLngToCanvas(city.lat, city.lng, width, height);
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(fromCoords.x, fromCoords.y);
          ctx.lineTo(targetCoords.x, targetCoords.y);
          ctx.stroke();
          ctx.setLineDash([]);
        });

      // رسم الشهب
      const now = Date.now();
      meteors.forEach(meteor => {
        const elapsed = now - meteor.startTime;
        const progress = Math.min(elapsed / meteor.duration, 1);

        if (progress < 1) {
          const fromCoords = latLngToCanvas(meteor.fromCity.lat, meteor.fromCity.lng, width, height);
          const currentX = fromCoords.x + (targetCoords.x - fromCoords.x) * progress;
          const currentY = fromCoords.y + (targetCoords.y - fromCoords.y) * progress;

          // رسم ذيل الشهاب
          const gradient = ctx.createLinearGradient(fromCoords.x, fromCoords.y, currentX, currentY);
          gradient.addColorStop(0, 'rgba(255, 0, 255, 0)');
          gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(fromCoords.x, fromCoords.y);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();

          // رسم رأس الشهاب (أكثر وضوحاً)
          const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 15);
          headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
          headGradient.addColorStop(0.5, 'rgba(0, 255, 255, 1)');
          headGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

          ctx.fillStyle = headGradient;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
          ctx.fill();

          // توهج إضافي
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(currentX, currentY, 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // رسم النبضات عند الرياض
      const pulseTime = (now % 1500) / 1500;
      const pulseRadius = 15 + pulseTime * 50;
      const pulseOpacity = 1 - pulseTime;

      ctx.strokeStyle = `rgba(0, 255, 255, ${pulseOpacity * 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(targetCoords.x, targetCoords.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // رسم المدن
      citiesWithCounts.forEach(city => {
        const coords = latLngToCanvas(city.lat, city.lng, width, height);

        if (city.isTarget) {
          // الرياض - نجمة كبيرة
          ctx.fillStyle = '#00ffff';
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, 14, 0, Math.PI * 2);
          ctx.fill();

          // توهج الرياض
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, 14, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // المدن الأخرى
          ctx.fillStyle = '#0099ff';
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, 10, 0, Math.PI * 2);
          ctx.fill();

          // توهج
          ctx.strokeStyle = 'rgba(0, 153, 255, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }

        // اسم المدينة
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, coords.x, coords.y - 30);

        // عدد المسجلين
        if (city.count > 0) {
          ctx.fillStyle = '#00ffff';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(city.count.toLocaleString('ar-SA'), coords.x, coords.y + 35);
        }
      });
    };

    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [meteors, citiesWithCounts]);

  // إنشاء شهب جديدة
  useEffect(() => {
    const createMeteor = () => {
      const sourceCities = citiesWithCounts.filter(c => !c.isTarget);
      if (sourceCities.length === 0) return;

      const randomCity = sourceCities[Math.floor(Math.random() * sourceCities.length)];
      const duration = 3000 + Math.random() * 2000; // 3-5 ثواني

      const newMeteor: Meteor = {
        id: `meteor-${meteorIdRef.current++}`,
        fromCity: randomCity,
        startTime: Date.now(),
        duration,
      };

      setMeteors(prev => [...prev, newMeteor]);

      // حذف الشهاب بعد انتهاء الرحلة
      setTimeout(() => {
        setMeteors(prev => prev.filter(m => m.id !== newMeteor.id));
      }, duration);
    };

    const interval = setInterval(createMeteor, 1500); // شهاب جديد كل 1.5 ثانية
    return () => clearInterval(interval);
  }, [citiesWithCounts]);

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-sm text-cyan-300 space-y-2 bg-slate-900/80 px-4 py-3 rounded border border-cyan-500/30">
        <div className="font-bold text-cyan-400">📍 تتبع البيانات العالمي</div>
        <div>🔵 مدينة مصدر</div>
        <div>⭐ الرياض (الهدف)</div>
        <div>💫 شهب البيانات</div>
      </div>
    </div>
  );
}
