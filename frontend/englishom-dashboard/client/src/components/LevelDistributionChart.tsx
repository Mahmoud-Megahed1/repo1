import { useEffect, useRef } from 'react';

export function LevelDistributionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Data
    const data = [
      { label: 'A1', value: 40, color: '#06b6d4' }, // cyan
      { label: 'A2', value: 45, color: '#8b5cf6' }, // purple
      { label: 'B1', value: 15, color: '#10b981' }, // emerald
    ];

    let currentAngle = -Math.PI / 2;

    data.forEach((item) => {
      const sliceAngle = (item.value / 100) * 2 * Math.PI;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      // Add glow effect
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Poppins';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.label}`, labelX, labelY);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px Poppins';
      ctx.fillText(`${item.value}%`, labelX, labelY + 16);

      currentAngle += sliceAngle;
    });

    // Draw center circle (donut effect)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-purple-500/30 overflow-hidden">
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-purple-400 mb-4">
          المستوى الأكثر طلباً الآن
        </h3>
        
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          className="w-full max-w-xs mx-auto"
        />

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full mx-auto mb-1" />
            <span className="text-gray-400">A1: 40%</span>
          </div>
          <div>
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1" />
            <span className="text-gray-400">A2: 45%</span>
          </div>
          <div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1" />
            <span className="text-gray-400">B1: 15%</span>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
