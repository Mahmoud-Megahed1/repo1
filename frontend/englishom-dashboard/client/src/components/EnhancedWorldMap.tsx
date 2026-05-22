import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface City {
  name: string;
  x: number;
  y: number;
  count: number;
  isTarget?: boolean;
}

interface EnhancedWorldMapProps {
  registrationsByCity: {
    [key: string]: number;
  };
}

const CITIES: City[] = [
  { name: 'Cairo', x: 52, y: 42, count: 0 },
  { name: 'Istanbul', x: 58, y: 32, count: 0 },
  { name: 'Amman', x: 55, y: 39, count: 0 },
  { name: 'London', x: 28, y: 28, count: 0 },
  { name: 'Paris', x: 32, y: 26, count: 0 },
  { name: 'Riyadh', x: 62, y: 45, count: 0, isTarget: true },
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
        cx={currentX}
        cy={currentY}
        r="3"
        fill="url(#meteorGradient)"
        opacity={Math.max(0, 1 - progress * 0.5)}
        filter="url(#meteorGlow)"
      />
      <line
        x1={fromX}
        y1={fromY}
        x2={currentX}
        y2={currentY}
        stroke="url(#trailGradient)"
        strokeWidth="2"
        opacity={Math.max(0, (1 - progress) * 0.7)}
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
      cx={x}
      cy={y}
      r={4}
      fill="none"
      stroke="url(#pulseGradient)"
      strokeWidth="2.5"
      initial={{ r: 4, opacity: 1 }}
      animate={{ r: 30, opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      filter="url(#pulseGlow)"
    />
  );
};

export default function EnhancedWorldMap({ registrationsByCity }: EnhancedWorldMapProps) {
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
          }, 1000);
        }
      };
      animate();
    };

    const interval = setInterval(createMeteor, 1200);
    return () => clearInterval(interval);
  }, [citiesWithCounts]);

  const targetCity = citiesWithCounts.find(c => c.isTarget)!;

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-cyan-500/20">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="meteorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0.6 }} />
          </linearGradient>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#00ffff', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </linearGradient>
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </radialGradient>

          <filter id="meteorGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* World Map Background - Simplified Continents */}
        <g opacity="0.15" fill="#00ffff" stroke="none">
          {/* North America */}
          <path d="M 80 100 L 150 80 L 160 150 L 100 160 Z" />
          {/* South America */}
          <path d="M 120 200 L 160 180 L 170 300 L 110 280 Z" />
          {/* Europe */}
          <path d="M 250 80 L 350 70 L 360 150 L 260 140 Z" />
          {/* Africa */}
          <path d="M 350 150 L 420 140 L 430 300 L 360 310 Z" />
          {/* Asia */}
          <path d="M 400 80 L 600 60 L 620 200 L 420 220 Z" />
          {/* Australia */}
          <path d="M 580 300 L 620 290 L 630 380 L 590 390 Z" />
        </g>

        {/* Background Grid */}
        <g opacity="0.08" stroke="#00ffff" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
          ))}
        </g>

        {/* Connection Lines from Cities to Riyadh */}
        {citiesWithCounts
          .filter(c => !c.isTarget)
          .map(city => (
            <line
              key={`line-${city.name}`}
              x1={city.x}
              y1={city.y}
              x2={targetCity.x}
              y2={targetCity.y}
              stroke="url(#trailGradient)"
              strokeWidth="1"
              opacity="0.2"
              strokeDasharray="5,5"
            />
          ))}

        {/* Cities */}
        {citiesWithCounts.map(city => (
          <g key={city.name}>
            {/* City Circle */}
            <circle
              cx={city.x}
              cy={city.y}
              r={city.isTarget ? 8 : 6}
              fill={city.isTarget ? '#00ffff' : '#0099ff'}
              opacity={city.isTarget ? 0.95 : 0.8}
              filter="url(#cityGlow)"
            />
            {/* Pulsing Ring for Target (Riyadh) */}
            {city.isTarget && (
              <motion.circle
                cx={city.x}
                cy={city.y}
                r={8}
                fill="none"
                stroke="#00ffff"
                strokeWidth="2"
                initial={{ r: 8, opacity: 1 }}
                animate={{ r: 25, opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity }}
                filter="url(#cityGlow)"
              />
            )}
            {/* City Label */}
            <text
              x={city.x}
              y={city.y - 20}
              textAnchor="middle"
              fill="#00ffff"
              fontSize="14"
              fontWeight="bold"
              opacity="0.9"
            >
              {city.name}
            </text>
            {/* Count Label */}
            {city.count > 0 && (
              <text
                x={city.x}
                y={city.y + 25}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="12"
                fontWeight="bold"
                opacity="0.95"
              >
                {city.count.toLocaleString('ar-SA')}
              </text>
            )}
          </g>
        ))}

        {/* Meteors */}
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

        {/* Ripples */}
        {ripples.map(ripple => (
          <RipplePulse key={ripple.id} x={ripple.x} y={ripple.y} rippleKey={ripple.id} />
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-xs text-cyan-400/70 space-y-1 bg-slate-900/60 px-3 py-2 rounded">
        <div>🔵 مدينة مصدر</div>
        <div>⭐ الرياض (الهدف)</div>
        <div>💫 شهب البيانات</div>
      </div>
    </div>
  );
}
