'use client';

import { useEffect, useRef } from 'react';

interface Flash {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  cityName: string;
  createdAt: number;
}

export default function LiveFlashingMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    flashes: [] as Flash[],
    flashIdCounter: 0,
    lastFlashTime: 0,
    mapImage: null as HTMLImageElement | null,
    mapLoaded: false,
    animationFrameId: null as number | null,
  });

  // مدن من جميع الدول العربية (بدون أسماء الدول)
  const cities = [
    // مصر
    { name: 'Cairo', x: 0.48, y: 0.65 },
    { name: 'Alexandria', x: 0.46, y: 0.62 },
    { name: 'Giza', x: 0.47, y: 0.66 },
    // السودان
    { name: 'Khartoum', x: 0.50, y: 0.72 },
    { name: 'Omdurman', x: 0.49, y: 0.73 },
    // ليبيا
    { name: 'Tripoli', x: 0.42, y: 0.68 },
    { name: 'Benghazi', x: 0.48, y: 0.70 },
    // تونس
    { name: 'Tunis', x: 0.40, y: 0.72 },
    { name: 'Sfax', x: 0.42, y: 0.75 },
    // الجزائر
    { name: 'Algiers', x: 0.36, y: 0.68 },
    { name: 'Oran', x: 0.34, y: 0.70 },
    // المغرب
    { name: 'Casablanca', x: 0.32, y: 0.72 },
    { name: 'Fez', x: 0.34, y: 0.68 },
    // موريتانيا
    { name: 'Nouakchott', x: 0.28, y: 0.78 },
    // الصومال
    { name: 'Mogadishu', x: 0.58, y: 0.82 },
    // جيبوتي
    { name: 'Djibouti', x: 0.60, y: 0.80 },
    // إريتريا
    { name: 'Asmara', x: 0.62, y: 0.78 },
    // اليمن
    { name: 'Sanaa', x: 0.62, y: 0.85 },
    { name: 'Aden', x: 0.64, y: 0.88 },
    // عمّان
    { name: 'Amman', x: 0.51, y: 0.42 },
    // فلسطين
    { name: 'Jerusalem', x: 0.50, y: 0.40 },
    // لبنان
    { name: 'Beirut', x: 0.50, y: 0.32 },
    // سوريا
    { name: 'Damascus', x: 0.52, y: 0.35 },
    { name: 'Aleppo', x: 0.52, y: 0.30 },
    // العراق
    { name: 'Baghdad', x: 0.58, y: 0.38 },
    { name: 'Basra', x: 0.60, y: 0.42 },
    // الكويت
    { name: 'Kuwait', x: 0.62, y: 0.40 },
    // قطر
    { name: 'Doha', x: 0.64, y: 0.48 },
    // البحرين
    { name: 'Manama', x: 0.65, y: 0.46 },
    // الإمارات
    { name: 'Dubai', x: 0.68, y: 0.50 },
    { name: 'Abu Dhabi', x: 0.67, y: 0.52 },
    // عمّان
    { name: 'Muscat', x: 0.72, y: 0.55 },
  ];

  // إحداثيات الرياض (مركز التجميع)
  const riyadhX = 0.62;
  const riyadhY = 0.52;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // تعيين حجم Canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // تحميل الخريطة العربية
    const mapImage = new Image();
    mapImage.crossOrigin = 'anonymous';
    mapImage.src = '/manus-storage/arab-world-map_9a86bbf1.jpg';
    
    mapImage.onload = () => {
      stateRef.current.mapLoaded = true;
    };

    stateRef.current.mapImage = mapImage;

    const animate = () => {
      const now = Date.now();
      const state = stateRef.current;

      // 1. رسم الخريطة أو خلفية داكنة
      if (state.mapLoaded && state.mapImage) {
        ctx.drawImage(state.mapImage, 0, 0, canvas.width, canvas.height);
      } else {
        // خلفية داكنة (وضع الليل النيون)
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // شبكة خطوط خفيفة
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 50) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 50) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
      }

      // 2. إضافة ومضة جديدة كل 400ms
      if (now - state.lastFlashTime > 400 && state.flashes.length < 20) {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const newFlash: Flash = {
          id: state.flashIdCounter++,
          startX: randomCity.x * canvas.width,
          startY: randomCity.y * canvas.height,
          endX: riyadhX * canvas.width,
          endY: riyadhY * canvas.height,
          progress: 0,
          cityName: randomCity.name,
          createdAt: now,
        };
        state.flashes.push(newFlash);
        state.lastFlashTime = now;
      }

      // 3. تحديث الومضات
      state.flashes = state.flashes
        .map((flash) => ({
          ...flash,
          progress: flash.progress + 0.025,
        }))
        .filter((flash) => flash.progress < 1);

      // 4. رسم الومضات
      state.flashes.forEach((flash) => {
        const x = flash.startX + (flash.endX - flash.startX) * flash.progress;
        // حركة عمودية: تطلع وتنزل
        const verticalWave = Math.sin(flash.progress * Math.PI) * 25;
        const y = flash.startY + (flash.endY - flash.startY) * flash.progress + verticalWave;

        const opacity = 1 - flash.progress;

        // خط متوهج من المدينة للرياض
        ctx.strokeStyle = `rgba(0, 150, 255, ${opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flash.startX, flash.startY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // الومضة البيضاء الساطعة
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // حلقة زرقاء حول الومضة
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.stroke();

        // اسم المدينة يظهر عند انطلاق الومضة ويختفي عند الوصول للرياض
        // يظهر فقط في النصف الأول من الرحلة
        if (flash.progress < 0.7) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(flash.cityName, x, y - 20);
        }
      });

      // 5. رسم الرياض (مركز التجميع)
      const riyadhScreenX = riyadhX * canvas.width;
      const riyadhScreenY = riyadhY * canvas.height;

      // دائرة الرياض الكبيرة
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(riyadhScreenX, riyadhScreenY, 15, 0, Math.PI * 2);
      ctx.fill();

      // حلقات نبضية حول الرياض
      const pulseSize = 25 + Math.sin(now * 0.003) * 10;
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - Math.sin(now * 0.003) * 0.3})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(riyadhScreenX, riyadhScreenY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      // 6. رسم نص LIVE في الزاوية العلوية اليمنى
      ctx.fillStyle = '#00FF00';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('● LIVE', canvas.width - 20, 40);

      // استمرار الحركة
      state.animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // معالج تغيير حجم النافذة
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{ display: 'block' }}
    />
  );
}
