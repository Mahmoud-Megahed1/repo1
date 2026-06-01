import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  subValue,
  icon = <span className="text-3xl">📊</span>,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
      </div>
      <p className="text-cyan-400/70 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-cyan-300 neon-text">{value}</p>
      {subValue && <p className="text-xs text-cyan-400/50 mt-2">{subValue}</p>}
    </motion.div>
  );
}
