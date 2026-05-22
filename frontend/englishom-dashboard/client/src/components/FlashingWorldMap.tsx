import React, { useEffect, useRef, useState } from 'react';

interface Flash {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  color: string;
}

export default function FlashingWorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const flashIdRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // إحداثيات المدن (نسبة مئوية من حجم الخريطة)
  const cities = [
    { name: 'Cairo', x: 0.52, y: 0.45, color: '#00FFFF' },
    { name: 'Istanbul', x: 0.54, y: 0.32, color: '#00FFFF' },
    { name: 'Amman', x: 0.54, y: 0.42, color: '#00FFFF' },
    { name: 'London', x: 0.38, y: 0.28, color: '#00FFFF' },
    { name: 'Paris', x: 0.41, y: 0.26, color: '#00FFFF' },
  ];

  const riyadhX = 0.56;
  const riyadhY = 0.48;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // تعيين حجم الـ Canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // تحميل الخريطة
    const mapImage = new Image();
    mapImage.src = '/manus-storage/world-map_7aaf5ef3.png';

    let lastFlashTime = 0;
    const flashInterval = 800; // ومضة جديدة كل 800ms

    const animate = () => {
      // رسم الخريطة
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

      // إضافة ومضة جديدة
      const now = Date.now();
      if (now - lastFlashTime > flashInterval && flashes.length < 10) {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const newFlash: Flash = {
          id: flashIdRef.current++,
          startX: randomCity.x * canvas.width,
          startY: randomCity.y * canvas.height,
          endX: riyadhX * canvas.width,
          endY: riyadhY * canvas.height,
          progress: 0,
          color: randomCity.color,
        };
        setFlashes((prev) => [...prev, newFlash]);
        lastFlashTime = now;
      }

      // رسم الومضات
      setFlashes((prevFlashes) => {
        const updatedFlashes = prevFlashes
          .map((flash) => ({
            ...flash,
            progress: flash.progress + 0.02, // سرعة الحركة
          }))
          .filter((flash) => flash.progress <= 1);

        // رسم الومضات على الـ Canvas
        updatedFlashes.forEach((flash) => {
          const x = flash.startX + (flash.endX - flash.startX) * flash.progress;
          const y = flash.startY + (flash.endY - flash.startY) * flash.progress;

          // رسم الومضة
          const radius = 4;
          ctx.fillStyle = flash.color;
          ctx.shadowColor = flash.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // رسم الذيل
          ctx.strokeStyle = flash.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 1 - flash.progress;
          ctx.beginPath();
          ctx.moveTo(flash.startX, flash.startY);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        });

        // رسم الرياض (الهدف)
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(riyadhX * canvas.width, riyadhY * canvas.height, 6, 0, Math.PI * 2);
        ctx.fill();

        // نبضة عند الرياض
        const pulseRadius = 8 + Math.sin(now / 200) * 3;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(riyadhX * canvas.width, riyadhY * canvas.height, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        return updatedFlashes;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    mapImage.onload = () => {
      animate();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
