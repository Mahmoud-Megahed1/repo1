import { useAuth } from '@components/contexts/auth-context';

const useInsights = () => {
  const { levelsDetails } = useAuth();

  const totalLevels = 6;
  const unlockedLevels = levelsDetails?.length || 0;
  const completedLevels =
    levelsDetails?.filter((level) => level.isCompleted) || [];
  const currentLevel = levelsDetails?.find((level) => !level.isCompleted);
  const overallProgress = (completedLevels.length / totalLevels) * 100;

  const totalDaysCompleted =
    levelsDetails?.reduce((total, level) => {
      return total + (level.isCompleted ? 50 : level.currentDay - 1);
    }, 0) || 0;

  return {
    totalLevels,
    unlockedLevels,
    completedLevels,
    currentLevel,
    overallProgress,
    totalDaysCompleted,
    levelsDetails,
  };
};

export default useInsights;
