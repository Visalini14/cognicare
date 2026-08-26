import type { AdaptiveDifficultyState, GameType } from '../types';

const STORAGE_KEY_PREFIX = 'cognicare_adaptive_level_';

export const INITIAL_ADAPTIVE_STATE: AdaptiveDifficultyState = {
  currentLevel: 1,
  consecutiveCorrect: 0,
  totalPlayed: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  avgResponseTime: 0,
  lastUpdated: new Date().toISOString(),
};

/**
 * Gets current adaptive difficulty state for a user & game type.
 */
export function getAdaptiveState(userId: string, gameType: GameType): AdaptiveDifficultyState {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}_${gameType}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading adaptive difficulty state', e);
  }
  return { ...INITIAL_ADAPTIVE_STATE };
}

/**
 * Updates adaptive state based on answer correctness.
 * Rules:
 * - 3 consecutive correct -> +1 level (max 5)
 * - 1 incorrect -> -1 level (min 1)
 */
export function updateAdaptiveState(
  userId: string,
  gameType: GameType,
  isCorrect: boolean,
  responseTimeSec: number
): { newState: AdaptiveDifficultyState; levelChanged: 'increased' | 'decreased' | 'unchanged' } {
  const current = getAdaptiveState(userId, gameType);

  let newLevel = current.currentLevel;
  let newConsecutive = current.consecutiveCorrect;
  let levelChanged: 'increased' | 'decreased' | 'unchanged' = 'unchanged';

  if (isCorrect) {
    newConsecutive += 1;
    if (newConsecutive >= 3 && newLevel < 5) {
      newLevel += 1;
      newConsecutive = 0; // reset after level upgrade
      levelChanged = 'increased';
    }
  } else {
    newConsecutive = 0;
    if (newLevel > 1) {
      newLevel -= 1;
      levelChanged = 'decreased';
    }
  }

  const newTotalPlayed = current.totalPlayed + 1;
  const newTotalCorrect = current.totalCorrect + (isCorrect ? 1 : 0);
  const newAvgResponseTime = current.avgResponseTime > 0
    ? Number(((current.avgResponseTime * current.totalPlayed + responseTimeSec) / newTotalPlayed).toFixed(1))
    : responseTimeSec;

  const newState: AdaptiveDifficultyState = {
    currentLevel: newLevel,
    consecutiveCorrect: newConsecutive,
    totalPlayed: newTotalPlayed,
    totalCorrect: newTotalCorrect,
    totalQuestions: current.totalQuestions + 1,
    avgResponseTime: newAvgResponseTime,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}_${gameType}`, JSON.stringify(newState));
  } catch (e) {
    console.error('Error saving adaptive difficulty state', e);
  }

  return { newState, levelChanged };
}

export interface DifficultyParams {
  pairs: number;
  sequenceLength: number;
  optionCount: number;
  displaySpeedMs: number;
  previewTimeMs: number;
  difficultyTier: number;
  showHints: boolean;
}

/**
 * Returns parameters customized to difficulty level (1-5)
 */
export function getGameDifficultyParams(gameType: GameType, level: number): DifficultyParams {
  const boundedLevel = Math.max(1, Math.min(5, level));

  switch (gameType) {
    case 'memory-match': {
      const pairCounts = [3, 4, 5, 6, 8];
      return {
        pairs: pairCounts[boundedLevel - 1] ?? 3,
        sequenceLength: 3,
        optionCount: 4,
        displaySpeedMs: 1000,
        previewTimeMs: boundedLevel >= 4 ? 1000 : 1500,
        difficultyTier: boundedLevel,
        showHints: true,
      };
    }

    case 'pattern-recall': {
      const sequenceLengths = [3, 4, 5, 6, 7];
      return {
        pairs: 3,
        sequenceLength: sequenceLengths[boundedLevel - 1] ?? 3,
        optionCount: 4,
        displaySpeedMs: Math.max(600, 1200 - (boundedLevel - 1) * 120),
        previewTimeMs: 1000,
        difficultyTier: boundedLevel,
        showHints: true,
      };
    }

    case 'recognition-quiz': {
      const optionCounts = [2, 3, 4, 4, 4];
      return {
        pairs: 3,
        sequenceLength: 3,
        optionCount: optionCounts[boundedLevel - 1] ?? 2,
        displaySpeedMs: 1000,
        previewTimeMs: 1000,
        difficultyTier: boundedLevel,
        showHints: true,
      };
    }

    case 'family-recognition': {
      return {
        pairs: 3,
        sequenceLength: 3,
        optionCount: Math.min(4, Math.max(2, boundedLevel + 1)),
        displaySpeedMs: 1000,
        previewTimeMs: 1000,
        difficultyTier: boundedLevel,
        showHints: boundedLevel <= 2,
      };
    }

    default:
      return {
        pairs: 3,
        sequenceLength: 3,
        optionCount: 2,
        displaySpeedMs: 1000,
        previewTimeMs: 1000,
        difficultyTier: boundedLevel,
        showHints: true,
      };
  }
}
