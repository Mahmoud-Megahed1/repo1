import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface City {
  name: string;
  lat: number;
  lng: number;
  count: number;
  isTarget?: boolean;
}

interface RealWorldMapProps {
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

interface Meteor {
  id: string;
  fromCity: City;
  progress: number;
  duration: number;
}

// تحويل الإحداثيات الجغرافية إلى إحداثيات SVG
const latLngToSvg = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

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
      {/* Meteor Head */}
      <circle
        cx={currentX}
        cy={currentY}
        r="8"
        fill="url(#meteorGradient)"
        opacity={Math.max(0, 1 - progress * 0.3)}
        filter="url(#meteorGlow)"
      />
      {/* Meteor Tail */}
      <line
        x1={fromX}
        y1={fromY}
        x2={currentX}
        y2={currentY}
        stroke="url(#trailGradient)"
        strokeWidth="3"
        opacity={Math.max(0, (1 - progress) * 0.8)}
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
      r={6}
      fill="none"
      stroke="url(#pulseGradient)"
      strokeWidth="3"
      initial={{ r: 6, opacity: 1 }}
      animate={{ r: 50, opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      filter="url(#pulseGlow)"
    />
  );
};

export default function RealWorldMap({ registrationsByCity }: RealWorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [ripples, setRipples] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const meteorIdRef = useRef(0);
  const rippleIdRef = useRef(0);

  const citiesWithCounts = CITIES.map(city => ({
    ...city,
    count: registrationsByCity[city.name] || 0,
  }));

  const width = 1200;
  const height = 600;

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
          const { x, y } = latLngToSvg(targetCity.lat, targetCity.lng, width, height);
          const rippleId = `ripple-${rippleIdRef.current++}`;
          setRipples(prev => [...prev, { id: rippleId, x, y }]);
          setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== rippleId));
          }, 1200);
        }
      };
      animate();
    };

    const interval = setInterval(createMeteor, 1200);
    return () => clearInterval(interval);
  }, [citiesWithCounts]);

  const targetCity = citiesWithCounts.find(c => c.isTarget)!;
  const targetCoords = latLngToSvg(targetCity.lat, targetCity.lng, width, height);

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="meteorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#0099ff', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#ff00ff', stopOpacity: 0.6 }} />
          </linearGradient>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </linearGradient>
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0099ff', stopOpacity: 0 }} />
          </radialGradient>

          {/* Filters */}
          <filter id="meteorGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="trailGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="#0f172a" />

        {/* Grid Background */}
        <g opacity="0.1" stroke="#00ffff" strokeWidth="1">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 50} x2={width} y2={i * 50} />
          ))}
          {Array.from({ length: 25 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2={height} />
          ))}
        </g>

        {/* World Map - Simplified Continents with better visibility */}
        <g opacity="0.2" fill="#00ffff" stroke="#00ffff" strokeWidth="1">
          {/* North America */}
          <ellipse cx="200" cy="150" rx="80" ry="120" />
          {/* South America */}
          <ellipse cx="280" cy="350" rx="60" ry="100" />
          {/* Europe */}
          <ellipse cx="450" cy="120" rx="70" ry="60" />
          {/* Africa */}
          <ellipse cx="520" cy="280" rx="80" ry="120" />
          {/* Asia */}
          <ellipse cx="750" cy="200" rx="150" ry="100" />
          {/* Australia */}
          <ellipse cx="850" cy="420" rx="60" ry="80" />
        </g>

        {/* Connection Lines from Cities to Riyadh */}
        {citiesWithCounts
          .filter(c => !c.isTarget)
          .map(city => {
            const fromCoords = latLngToSvg(city.lat, city.lng, width, height);
            return (
              <line
                key={`line-${city.name}`}
                x1={fromCoords.x}
                y1={fromCoords.y}
                x2={targetCoords.x}
                y2={targetCoords.y}
                stroke="url(#trailGradient)"
                strokeWidth="2"
                opacity="0.25"
                strokeDasharray="8,8"
              />
            );
          })}

        {/* Cities */}
        {citiesWithCounts.map(city => {
          const coords = latLngToSvg(city.lat, city.lng, width, height);
          return (
            <g key={city.name}>
              {/* City Circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={city.isTarget ? 12 : 10}
                fill={city.isTarget ? '#00ffff' : '#0099ff'}
                opacity={city.isTarget ? 1 : 0.9}
                filter="url(#cityGlow)"
              />
              {/* Pulsing Ring for Target (Riyadh) */}
              {city.isTarget && (
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={12}
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="2.5"
                  initial={{ r: 12, opacity: 1 }}
                  animate={{ r: 40, opacity: 0 }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  filter="url(#cityGlow)"
                />
              )}
              {/* City Label */}
              <text
                x={coords.x}
                y={coords.y - 30}
                textAnchor="middle"
                fill="#00ffff"
                fontSize="16"
                fontWeight="bold"
                opacity="1"
              >
                {city.name}
              </text>
              {/* Count Label */}
              {city.count > 0 && (
                <text
                  x={coords.x}
                  y={coords.y + 35}
                  textAnchor="middle"
                  fill="#00ffff"
                  fontSize="14"
                  fontWeight="bold"
                  opacity="1"
                >
                  {city.count.toLocaleString('ar-SA')}
                </text>
              )}
            </g>
          );
        })}

        {/* Meteors */}
        {meteors.map(meteor => {
          const fromCoords = latLngToSvg(meteor.fromCity.lat, meteor.fromCity.lng, width, height);
          return (
            <MeteorTrail
              key={meteor.id}
              fromX={fromCoords.x}
              fromY={fromCoords.y}
              toX={targetCoords.x}
              toY={targetCoords.y}
              progress={meteor.progress}
            />
          );
        })}

        {/* Ripples */}
        {ripples.map(ripple => (
          <RipplePulse key={ripple.id} x={ripple.x} y={ripple.y} rippleKey={ripple.id} />
        ))}
      </svg>

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
