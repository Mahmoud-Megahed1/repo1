import { useEffect, useState } from 'react';
import { NumberDisplay } from './NumberDisplay';

export function SystemStatus() {
  const [responseTime, setResponseTime] = useState(120);

  useEffect(() => {
    // Simulate response time variations
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 40) - 20; // -20 to +20
      const newTime = Math.max(100, Math.min(200, 120 + variation));
      setResponseTime(newTime);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 border border-green-500/30 overflow-hidden">
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-green-400">
            حالة النظام
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">نشط</span>
          </div>
        </div>

        {/* Server Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Server Status:</span>
            <span className="text-green-400 font-semibold">100% Operational</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full w-full" />
          </div>
        </div>

        {/* Response Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Response Time:</span>
            <span className="text-cyan-400"><NumberDisplay value={responseTime} variant="neon" size="md" format="number" />ms</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(10, Math.min(100, (responseTime / 200) * 100))}%` }}
            />
          </div>
        </div>

        {/* Uptime */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Uptime:</span>
            <span className="text-emerald-400">99.9%</span>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
