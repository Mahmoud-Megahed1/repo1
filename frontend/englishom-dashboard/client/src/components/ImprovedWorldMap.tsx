import React, { useEffect, useRef, useState } from 'react';

interface City {
  name: string;
  nameAr: string;
  x: number;
  y: number;
  count: number;
  region: 'europe' | 'middle_east' | 'africa' | 'asia';
}

const cities: City[] = [
  { name: 'London', nameAr: 'لندن', x: 0.35, y: 0.35, count: 2500, region: 'europe' },
  { name: 'Paris', nameAr: 'باريس', x: 0.32, y: 0.33, count: 2100, region: 'europe' },
  { name: 'Istanbul', nameAr: 'إسطنبول', x: 0.48, y: 0.38, count: 3100, region: 'middle_east' },
  { name: 'Cairo', nameAr: 'القاهرة', x: 0.45, y: 0.52, count: 4300, region: 'africa' },
  { name: 'Amman', nameAr: 'عمّان', x: 0.48, y: 0.48, count: 2800, region: 'middle_east' },
  { name: 'Riyadh', nameAr: 'الرياض', x: 0.55, y: 0.55, count: 5181, region: 'middle_east' },
  { name: 'Dubai', nameAr: 'دبي', x: 0.58, y: 0.54, count: 2800, region: 'middle_east' },
];

const ImprovedWorldMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [meteors, setMeteors] = useState<Array<{
    id: string;
    fromCity: City;
    progress: number;
    color: string;
  }>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const meteorIdRef = useRef(0);
  const lastMeteorTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawMap = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
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

      // Draw continents (simplified)
      drawContinents(ctx, width, height);

      // Draw connection lines
      const riyadh = cities.find(c => c.name === 'Riyadh')!;
      cities.forEach(city => {
        if (city.name !== 'Riyadh') {
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(city.x * width, city.y * height);
          ctx.lineTo(riyadh.x * width, riyadh.y * height);
          ctx.stroke();
        }
      });

      // Draw cities
      cities.forEach(city => {
        const x = city.x * width;
        const y = city.y * height;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 30, y - 30, 60, 60);

        // City circle
        ctx.fillStyle = city.name === 'Riyadh' ? '#ffeb3b' : '#00ffff';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // City label
        ctx.fillStyle = '#00ffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(city.name, x, y - 20);

        // Count
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(`${city.count}`, x, y + 20);
      });

      // Draw meteors
      meteors.forEach(meteor => {
        const fromX = meteor.fromCity.x * width;
        const fromY = meteor.fromCity.y * height;
        const toX = riyadh.x * width;
        const toY = riyadh.y * height;

        const currentX = fromX + (toX - fromX) * meteor.progress;
        const currentY = fromY + (toY - fromY) * meteor.progress;

        // Meteor trail
        const trailGradient = ctx.createLinearGradient(fromX, fromY, currentX, currentY);
        trailGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        trailGradient.addColorStop(0.5, meteor.color);
        trailGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Meteor head
        const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 8);
        headGradient.addColorStop(0, meteor.color);
        headGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = headGradient;
        ctx.fillRect(currentX - 8, currentY - 8, 16, 16);

        // Glow
        ctx.shadowColor = meteor.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = meteor.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw pulse at Riyadh
      const time = Date.now() / 1000;
      const pulseRadius = 30 + Math.sin(time * 3) * 10;
      ctx.strokeStyle = `rgba(255, 235, 59, ${0.5 - Math.sin(time * 3) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(riyadh.x * width, riyadh.y * height, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawContinents = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Simplified continent shapes
      ctx.fillStyle = 'rgba(100, 150, 200, 0.1)';
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;

      // North America
      ctx.beginPath();
      ctx.ellipse(width * 0.15, height * 0.35, width * 0.08, height * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // South America
      ctx.beginPath();
      ctx.ellipse(width * 0.2, height * 0.6, width * 0.06, height * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Europe
      ctx.beginPath();
      ctx.ellipse(width * 0.35, height * 0.3, width * 0.06, height * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Africa
      ctx.beginPath();
      ctx.ellipse(width * 0.45, height * 0.55, width * 0.08, height * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Asia
      ctx.beginPath();
      ctx.ellipse(width * 0.6, height * 0.4, width * 0.15, height * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Australia
      ctx.beginPath();
      ctx.ellipse(width * 0.75, height * 0.7, width * 0.05, height * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    const animate = () => {
      drawMap();

      // Update meteors
      setMeteors(prev => {
        const updated = prev
          .map(m => ({ ...m, progress: m.progress + 0.01 }))
          .filter(m => m.progress < 1);

        // Add new meteor
        const now = Date.now();
        if (now - lastMeteorTimeRef.current > 500 && updated.length < 8) {
          lastMeteorTimeRef.current = now;
          const randomCity = cities[Math.floor(Math.random() * (cities.length - 1))];
          const colors = ['#00ffff', '#00ff88', '#ff00ff', '#00ffff'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          updated.push({
            id: `meteor-${meteorIdRef.current++}`,
            fromCity: randomCity,
            progress: 0,
            color,
          });
        }

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [meteors]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-full"
      />
    </div>
  );
};

export default ImprovedWorldMap;
