import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PublicStats {
  wordsWrittenToday: number;
  audioMinutesListened: number;
  voiceRecordingsToday: number;
  shieldsEarnedToday: number;
  shieldCompletionRate: number;
  recordedStoriesCount: number;
  totalSpeakingSeconds: number;
  passedStudentsCount: number;
  quizSuccessRate: number;
  citiesCount: number;
  isPublished: boolean;
}

interface PublicStatsManagerProps {
  initialStats: PublicStats;
  onSave: (stats: PublicStats) => void;
  isSaving?: boolean;
}

export const PublicStatsManager: React.FC<PublicStatsManagerProps> = ({
  initialStats,
  onSave,
  isSaving = false,
}) => {
  const [stats, setStats] = useState<PublicStats>(initialStats);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof PublicStats, value: string | boolean) => {
    const newStats = {
      ...stats,
      [field]: typeof value === 'boolean' ? value : parseInt(value) || 0,
    };
    setStats(newStats);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(stats);
    setHasChanges(false);
  };

  const handleReset = () => {
    setStats(initialStats);
    setHasChanges(false);
  };

  const sections = [
    {
      title: 'Live Learning Activity',
      icon: '🎓',
      fields: [
        { key: 'wordsWrittenToday', label: 'Words Written Today' },
        { key: 'audioMinutesListened', label: 'Audio Minutes Listened' },
        { key: 'voiceRecordingsToday', label: 'Voice Recordings Today' },
      ],
    },
    {
      title: 'Daily Shield Challenges',
      icon: '🛡️',
      fields: [
        { key: 'shieldsEarnedToday', label: 'Shields Earned Today' },
        { key: 'shieldCompletionRate', label: 'Shield Completion Rate (%)' },
      ],
    },
    {
      title: 'Reality Challenge',
      icon: '⏳',
      fields: [
        { key: 'recordedStoriesCount', label: 'Recorded Stories Count' },
        { key: 'totalSpeakingSeconds', label: 'Total Speaking Seconds' },
      ],
    },
    {
      title: 'Gateway Quiz',
      icon: '🎉',
      fields: [
        { key: 'passedStudentsCount', label: 'Passed Students Count' },
        { key: 'quizSuccessRate', label: 'Quiz Success Rate (%)' },
      ],
    },
    {
      title: 'General',
      icon: '🌍',
      fields: [
        { key: 'citiesCount', label: 'Cities Count' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold neon-text">Public Dashboard Stats Manager</h2>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stats.isPublished}
              onChange={(e) => handleChange('isPublished', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
        </div>
      </div>

      {/* Stats Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">{section.icon}</span>
              {section.title}
            </h3>

            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="flex flex-col gap-2">
                  <label className="text-sm text-cyan-400/70">{field.label}</label>
                  <Input
                    type="number"
                    value={String(stats[field.key as keyof PublicStats])}
                    onChange={(e) => handleChange(field.key as keyof PublicStats, e.target.value)}
                    className="bg-slate-800/50 border-cyan-500/30 text-cyan-300"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-4 justify-end pt-6 border-t border-cyan-500/20"
      >
        <Button
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PublicStatsManager;
