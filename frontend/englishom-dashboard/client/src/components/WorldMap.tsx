import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface City {
  name: string;
  x: number;
  y: number;
  count: number;
  isTarget?: boolean;
}

interface WorldMapProps {
  registrationsByCity: {
    [key: string]: number;
  };
}

const CITIES: City[] = [
  { name: 'Cairo', x: 55, y: 35, count: 0 },
  { name: 'Istanbul', x: 60, y: 25, count: 0 },
  { name: 'Amman', x: 58, y: 32, count: 0 },
  { name: 'London', x: 25, y: 20, count: 0 },
  { name: 'Paris', x: 28, y: 18, count: 0 },
  { name: 'Riyadh', x: 65, y: 38, count: 0, isTarget: true },
];

interface Meteor {
  id: string;
  fromCity: City;
  progress: number;
  duration: number;
}

const MeteorTrail: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
}> = ({ fromX, fromY, toX, toY, progress }) => {
  const currentX = fromX + (toX - fromX) * progress;
  const currentY = fromY + (toY - fromY) * progress;

  return (
    <>
      <circle
        cx={`${currentX}%`}
        cy={`${currentY}%`}
        r="2"
        fill="url(#meteorGradient)"
        opacity={Math.max(0, 1 - progress * 0.5)}
        filter="url(#meteorGlow)"
      />
      <line
        x1={`${fromX}%`}
        y1={`${fromY}%`}
        x2={`${currentX}%`}
        y2={`${currentY}%`}
        stroke="url(#trailGradient)"
        strokeWidth="1.5"
        opacity={Math.max(0, (1 - progress) * 0.6)}
        filter="url(#trailGlow)"
      />
    </>
  );
};

interface RipplePulseProps {
  x: number;
  y: number;
  rippleKey: string;
}

const RipplePulse: React.FC<RipplePulseProps> = ({ x, y, rippleKey }) => {
  return (
    <motion.circle
      key={rippleKey}
      cx={`${x}%`}
      cy={`${y}%`}
      r={3}
      fill="none"
      stroke="url(#pulseGradient)"
      strokeWidth="2"
      initial={{ r: 3, opacity: 1 }}
      animate={{ r: 12, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      filter="url(#pulseGlow)"
    />
  );
};

export default function WorldMap({ registrationsByCity }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const meteorIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  const citiesWithCounts = CITIES.map(city => ({
    ...city,
    count: registrationsByCity[city.name] || 0,
  }));

  useEffect(() => {
    const createMeteor = () => {
      const sourceCities = citiesWithCounts.filter(c => !c.isTarget);
      if (sourceCities.length === 0) return;

      const randomCity = sourceCities[Math.floor(Math.random() * sourceCities.length)];
      const targetCity = citiesWithCounts.find(c => c.isTarget)!;
      const duration = 2000 + Math.random() * 1000;

      const newMeteor: Meteor = {
        id: `meteor-${meteorIdRef.current++}`,
        fromCity: randomCity,
        progress: 0,
        duration,
      };

      setMeteors(prev => [...prev, newMeteor]);

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setMeteors(prev =>
          prev.map(m =>
            m.id === newMeteor.id ? { ...m, progress } : m
          )
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setMeteors(prev => prev.filter(m => m.id !== newMeteor.id));
          const rippleId = `ripple-${rippleIdRef.current++}`;
          setRipples(prev => [...prev, { id: rippleId, x: targetCity.x, y: targetCity.y }]);
          setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
          }, 800);
        }
      };
      animate();
    };

    const interval = setInterval(createMeteor, 1500);
    return () => clearInterval(interval);
  }, [citiesWithCounts]);

  const targetCity = citiesWithCounts.find(c => c.isTarget)!;

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="meteorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0.5 }} />
          </linearGradient>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#00ffff', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </linearGradient>
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </radialGradient>

          <filter id="meteorGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.1" stroke="#00ffff" strokeWidth="0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 6} x2="100" y2={i * 6} />
          ))}
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 6} y1="0" x2={i * 6} y2="60" />
          ))}
        </g>

        {citiesWithCounts
          .filter(c => !c.isTarget)
          .map(city => (
            <line
              key={`line-${city.name}`}
              x1={`${city.x}%`}
              y1={`${city.y}%`}
              x2={`${targetCity.x}%`}
              y2={`${targetCity.y}%`}
              stroke="url(#trailGradient)"
              strokeWidth="0.5"
              opacity="0.2"
              strokeDasharray="2,2"
            />
          ))}

        {citiesWithCounts.map(city => (
          <g key={city.name}>
            <circle
              cx={`${city.x}%`}
              cy={`${city.y}%`}
              r={city.isTarget ? '2.5' : '1.5'}
              fill={city.isTarget ? '#00ffff' : '#0099ff'}
              opacity={city.isTarget ? 0.9 : 0.7}
              filter="url(#cityGlow)"
            />
            {city.isTarget && (
              <motion.circle
                cx={`${city.x}%`}
                cy={`${city.y}%`}
                r={2.5}
                fill="none"
                stroke="#00ffff"
                strokeWidth="0.5"
                initial={{ r: 2.5, opacity: 1 }}
                animate={{ r: 4, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                filter="url(#cityGlow)"
              />
            )}
            <text
              x={`${city.x}%`}
              y={`${city.y - 3}%`}
              textAnchor="middle"
              className="text-xs fill-cyan-300 font-semibold"
              opacity="0.8"
            >
              {city.name}
            </text>
            {city.count > 0 && (
              <text
                x={`${city.x}%`}
                y={`${city.y + 2}%`}
                textAnchor="middle"
                className="text-xs fill-cyan-400 font-bold"
                opacity="0.9"
              >
                {city.count.toLocaleString('ar-SA')}
              </text>
            )}
          </g>
        ))}

        {meteors.map(meteor => (
          <MeteorTrail
            key={meteor.id}
            fromX={meteor.fromCity.x}
            fromY={meteor.fromCity.y}
            toX={targetCity.x}
            toY={targetCity.y}
            progress={meteor.progress}
          />
        ))}

        {ripples.map(ripple => (
          <RipplePulse key={ripple.id} x={ripple.x} y={ripple.y} rippleKey={ripple.id} />
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 text-xs text-cyan-400/70 space-y-1">
        <div>🔵 مدينة مصدر</div>
        <div>⭐ الرياض (الهدف)</div>
        <div>💫 شهب البيانات</div>
      </div>
    </div>
  );
}
