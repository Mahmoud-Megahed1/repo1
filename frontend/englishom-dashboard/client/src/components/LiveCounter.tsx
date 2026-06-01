import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveCounterProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  delay?: number;
}

export default function LiveCounter({
  label,
  value,
  icon = <span className="text-3xl">📊</span>,
  delay = 0,
}: LiveCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const difference = value - displayValue;
      const steps = 30;
      const stepValue = difference / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        setDisplayValue(prev => {
          const newValue = Math.floor(prev + stepValue);
          return currentStep >= steps ? value : newValue;
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [value, displayValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="cyber-border-strong rounded-lg p-6 bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm hover:from-slate-900/80 hover:to-slate-800/60 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
        ></motion.div>
      </div>
      <p className="text-cyan-400/70 text-sm mb-2">{label}</p>
      <motion.p
        key={displayValue}
        animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent neon-text"
      >
        {displayValue.toLocaleString('ar-SA')}
      </motion.p>
      <motion.div
        animate={isAnimating ? { opacity: [0, 1, 0] } : {}}
        transition={{ duration: 0.6 }}
        className="text-xs text-cyan-400 mt-2"
      >
        {isAnimating && '⬆️ تحديث حي'}
      </motion.div>
    </motion.div>
  );
}
