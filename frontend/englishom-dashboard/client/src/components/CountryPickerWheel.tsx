import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountryPickerWheelProps {
  countries?: string[];
  interval?: number;
  className?: string;
}

const defaultCities = [
  'الرياض',
  'جدة',
  'القاهرة',
  'الاسكندرية',
  'دبي',
  'أبو u0638بي',
  'عمان',
  'مسقاط',
  'بغداد',
  'بابل',
  'بيروت',
  'طرابلس',
  'عمان',
  'صنعاء',
  'عدن',
  'الرباط',
  'فاس',
  'مراكش',
  'الجزائر',
  'وهران',
  'قسنطينة',
  'بنزرت',
  'سوسة',
  'قابس',
  'الخرطوم',
  'الأبيض',
  'مقدشو',
  'طرابلس',
  'بنغازي',
  'طرابلس الغرب',
  'رام الله',
  'رام الله',
  'نابلس',
  'جنين',
  'غزة',
  'بيت لحم',
  'القدس',
  'رام الله',
  'بيت المقدس',
  'عمان',
  'زرقاء',
  'إربد',
  'معان',
  'العقبة',
  'الزرقاء',
  'الكويت',
  'الفروانية',
  'الاحمدي',
  'الجهراء',
  'العاصمة',
  'العاصمة القديمة',
  'العاصمة الجديدة',
  'الرياض',
];

export const CountryPickerWheel: React.FC<CountryPickerWheelProps> = ({
  countries = defaultCities,
  interval = 3000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % countries.length);
    }, interval);
    return () => clearInterval(timer);
  }, [countries.length, interval]);

  const getPrevIndex = () => (currentIndex - 1 + countries.length) % countries.length;
  const getNextIndex = () => (currentIndex + 1) % countries.length;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* العنصر السابق - باهت */}
      <motion.div
        key={`prev-${getPrevIndex()}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="text-xs text-cyan-400/40 h-6 flex items-center"
      >
        {countries[getPrevIndex()]}
      </motion.div>

      {/* العنصر الحالي - مركز وبارز */}
      <motion.div
        key={`current-${currentIndex}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        className="text-sm font-bold text-cyan-300 h-8 flex items-center px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
      >
        {countries[currentIndex]}
      </motion.div>

      {/* العنصر التالي - باهت */}
      <motion.div
        key={`next-${getNextIndex()}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.4, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="text-xs text-cyan-400/40 h-6 flex items-center"
      >
        {countries[getNextIndex()]}
      </motion.div>
    </div>
  );
};

export default CountryPickerWheel;
