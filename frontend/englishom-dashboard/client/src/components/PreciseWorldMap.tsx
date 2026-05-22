import React, { useEffect, useRef, useState } from 'react';

interface Meteor {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  color: string;
  startTime: number;
  duration: number;
}

interface PreciseWorldMapProps {
  registrationsByCity: {
    [key: string]: number;
  };
}

// مواقع المدن (تقريبية على الخريطة)
const CITIES = [
  { name: 'Cairo', x: 0.55, y: 0.55, label: 'Cairo', count: 43 },
  { name: 'Istanbul', x: 0.52, y: 0.35, label: 'Istanbul', count: 31 },
  { name: 'Amman', x: 0.56, y: 0.48, label: 'Amman', count: 26 },
  { name: 'London', x: 0.42, y: 0.3, label: 'London', count: 0 },
  { name: 'Paris', x: 0.44, y: 0.28, label: 'Paris', count: 0 },
  { name: 'Dubai', x: 0.62, y: 0.52, label: 'Dubai', count: 28 },
  { name: 'Riyadh', x: 0.58, y: 0.56, label: 'Riyadh', count: 0, isTarget: true },
];

const COLORS = ['#00ffff', '#ff00ff', '#00ff88', '#ff0088', '#00ccff', '#ff00cc'];

export default function PreciseWorldMap({ registrationsByCity }: PreciseWorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const meteorIdRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const width = 1200;
  const height = 600;

  // رسم الخريطة والشهب
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWorldMap = () => {
      // خلفية داكنة
      ctx.fillStyle = '#1a2332';
      ctx.fillRect(0, 0, width, height);

      // شبكة خلفية
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // رسم القارات (مبسطة بيضاوية)
      ctx.fillStyle = 'rgba(0, 100, 120, 0.3)';
      ctx.strokeStyle = 'rgba(0, 200, 200, 0.4)';
      ctx.lineWidth = 2;

      // North America
      ctx.beginPath();
      ctx.ellipse(200, 180, 90, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // South America
      ctx.beginPath();
      ctx.ellipse(280, 420, 70, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Europe
      ctx.beginPath();
      ctx.ellipse(480, 140, 80, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Africa
      ctx.beginPath();
      ctx.ellipse(550, 340, 90, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Asia
      ctx.beginPath();
      ctx.ellipse(750, 220, 170, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Australia
      ctx.beginPath();
      ctx.ellipse(880, 450, 70, 90, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // رسم خطوط الاتصال من المدن للرياض
      const riyadh = CITIES.find(c => c.isTarget)!;
      const riyadhX = riyadh.x * width;
      const riyadhY = riyadh.y * height;

      CITIES.filter(c => !c.isTarget).forEach(city => {
        const fromX = city.x * width;
        const fromY = city.y * height;

        ctx.strokeStyle = 'rgba(0, 255, 200, 0.15)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(riyadhX, riyadhY);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // رسم الشهب
      const now = Date.now();
      meteors.forEach(meteor => {
        const elapsed = now - meteor.startTime;
        const progress = Math.min(elapsed / meteor.duration, 1);

        const currentX = meteor.x + (meteor.targetX - meteor.x) * progress;
        const currentY = meteor.y + (meteor.targetY - meteor.y) * progress;

        // ذيل الشهاب
        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, currentX, currentY);
        gradient.addColorStop(0, `${meteor.color}00`);
        gradient.addColorStop(0.5, `${meteor.color}cc`);
        gradient.addColorStop(1, `${meteor.color}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // رأس الشهاب (توهج)
        const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 18);
        headGradient.addColorStop(0, `${meteor.color}ff`);
        headGradient.addColorStop(0.5, `${meteor.color}88`);
        headGradient.addColorStop(1, `${meteor.color}00`);

        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
        ctx.fill();

        // توهج إضافي
        ctx.strokeStyle = `${meteor.color}aa`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 15, 0, Math.PI * 2);
        ctx.stroke();
      });

      // نبضات عند الرياض
      const pulseTime = (now % 1200) / 1200;
      const pulseRadius = 12 + pulseTime * 40;
      const pulseOpacity = (1 - pulseTime) * 0.8;

      ctx.strokeStyle = `rgba(0, 255, 200, ${pulseOpacity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(riyadhX, riyadhY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // رسم المدن
      CITIES.forEach((city, idx) => {
        const x = city.x * width;
        const y = city.y * height;

        if (city.isTarget) {
          // الرياض - نجمة كبيرة مضيئة
          ctx.fillStyle = '#00ffcc';
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.fill();

          // توهج الرياض
          ctx.strokeStyle = 'rgba(0, 255, 200, 0.9)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.stroke();

          // توهج خارجي
          ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, 28, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // المدن الأخرى
          ctx.fillStyle = '#00ccff';
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fill();

          // توهج
          ctx.strokeStyle = 'rgba(0, 200, 255, 0.7)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // اسم المدينة
        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(city.label, x, y - 28);

        // عدد المسجلين
        if (city.count > 0) {
          ctx.fillStyle = '#00ffcc';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(city.count + 'K', x, y + 32);
        }
      });
    };

    const animate = () => {
      drawWorldMap();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [meteors]);

  // إنشاء شهب جديدة
  useEffect(() => {
    const createMeteor = () => {
      const sourceCities = CITIES.filter(c => !c.isTarget);
      if (sourceCities.length === 0) return;

      const randomCity = sourceCities[Math.floor(Math.random() * sourceCities.length)];
      const riyadh = CITIES.find(c => c.isTarget)!;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const duration = 2500 + Math.random() * 1500;

      const newMeteor: Meteor = {
        id: `meteor-${meteorIdRef.current++}`,
        x: randomCity.x * width,
        y: randomCity.y * height,
        targetX: riyadh.x * width,
        targetY: riyadh.y * height,
        progress: 0,
        color,
        startTime: Date.now(),
        duration,
      };

      setMeteors(prev => [...prev, newMeteor]);

      setTimeout(() => {
        setMeteors(prev => prev.filter(m => m.id !== newMeteor.id));
      }, duration);
    };

    const interval = setInterval(createMeteor, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-cyan-500/50 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full display-block"
      />
    </div>
  );
}
