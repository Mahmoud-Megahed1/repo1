import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { PublicStatsManager } from '@/components/PublicStatsManager';
import { useLocation } from 'wouter';

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

export default function AdminPublicStats() {
  const [, navigate] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch public stats
  const { data: publicStats, isLoading: isLoadingStats } = trpc.publicStats.get.useQuery();
  
  // Update mutation
  const updateMutation = trpc.publicStats.update.useMutation({
    onSuccess: (data) => {
      setStats({
        wordsWrittenToday: data?.wordsWrittenToday || 0,
        audioMinutesListened: data?.audioMinutesListened || 0,
        voiceRecordingsToday: data?.voiceRecordingsToday || 0,
        shieldsEarnedToday: data?.shieldsEarnedToday || 0,
        shieldCompletionRate: data?.shieldCompletionRate || 0,
        recordedStoriesCount: data?.recordedStoriesCount || 0,
        totalSpeakingSeconds: data?.totalSpeakingSeconds || 0,
        passedStudentsCount: data?.passedStudentsCount || 0,
        quizSuccessRate: data?.quizSuccessRate || 0,
        citiesCount: data?.citiesCount || 53,
        isPublished: (data?.isPublished || 1) === 1,
      });
      setIsSaving(false);
    },
    onError: (error) => {
      console.error('Failed to update stats:', error);
      setIsSaving(false);
    },
  });

  // Initialize stats from query
  useEffect(() => {
    if (publicStats && !isLoadingStats) {
      setStats({
        wordsWrittenToday: publicStats.wordsWrittenToday || 0,
        audioMinutesListened: publicStats.audioMinutesListened || 0,
        voiceRecordingsToday: publicStats.voiceRecordingsToday || 0,
        shieldsEarnedToday: publicStats.shieldsEarnedToday || 0,
        shieldCompletionRate: publicStats.shieldCompletionRate || 0,
        recordedStoriesCount: publicStats.recordedStoriesCount || 0,
        totalSpeakingSeconds: publicStats.totalSpeakingSeconds || 0,
        passedStudentsCount: publicStats.passedStudentsCount || 0,
        quizSuccessRate: publicStats.quizSuccessRate || 0,
        citiesCount: publicStats.citiesCount || 53,
        isPublished: (publicStats.isPublished || 1) === 1,
      });
      setIsLoading(false);
    }
  }, [publicStats]);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSave = async (updatedStats: PublicStats) => {
    setIsSaving(true);
    await updateMutation.mutateAsync({
      wordsWrittenToday: updatedStats.wordsWrittenToday,
      audioMinutesListened: updatedStats.audioMinutesListened,
      voiceRecordingsToday: updatedStats.voiceRecordingsToday,
      shieldsEarnedToday: updatedStats.shieldsEarnedToday,
      shieldCompletionRate: updatedStats.shieldCompletionRate,
      recordedStoriesCount: updatedStats.recordedStoriesCount,
      totalSpeakingSeconds: updatedStats.totalSpeakingSeconds,
      passedStudentsCount: updatedStats.passedStudentsCount,
      quizSuccessRate: updatedStats.quizSuccessRate,
      citiesCount: updatedStats.citiesCount,
      isPublished: updatedStats.isPublished ? 1 : 0,
    });
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-cyan-400/70">Only administrators can access this page.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-cyan-500/20 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-text">Admin: Public Dashboard Stats</h1>
          <p className="text-cyan-400/60 text-sm mt-2">Manage the statistics displayed on the public /live page</p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-cyan-400/60"
          >
            <p>Loading...</p>
          </motion.div>
        ) : stats ? (
          <PublicStatsManager
            initialStats={stats}
            onSave={handleSave}
            isSaving={isSaving}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-red-400"
          >
            <p>Failed to load stats</p>
          </motion.div>
        )}
      </main>

      {/* Info Box */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 py-12"
      >
        <div className="cyber-border rounded-lg p-6 bg-slate-900/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 text-cyan-300">ℹ️ Information</h3>
          <ul className="space-y-2 text-cyan-400/70 text-sm">
            <li>• These statistics are displayed on the public <code className="bg-slate-800/50 px-2 py-1 rounded">/live</code> page</li>
            <li>• Only admins can modify these values</li>
            <li>• The public page updates automatically every 5 seconds</li>
            <li>• Toggle "Published" to show/hide the public page</li>
            <li>• All changes are saved to the database immediately</li>
          </ul>
        </div>
      </motion.section>
    </div>
  );
}
