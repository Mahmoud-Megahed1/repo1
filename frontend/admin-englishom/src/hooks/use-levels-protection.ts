import { useAuth } from '@/components/auth-provider';
import { LevelId } from '@/types/user.types';
import React from 'react';

const useLevelsProtection = (id: LevelId) => {
  const { levelsDetails, isLoading } = useAuth();
  const isLocked = React.useMemo(() => {
    const userLevels = levelsDetails.map((level) => level.levelName);
    return !userLevels.includes(id);
  }, [levelsDetails, id]);

  return { isLocked, isLoading };
};

export default useLevelsProtection;
