import type { RecipeStep, Difficulty } from '../types';

export const calculateTotalTime = (steps: RecipeStep[]): number => {
  return steps.reduce((sum, step) => sum + step.durationMinutes, 0);
};

export const calculateComplexityScore = (difficulty: Difficulty, stepsCount: number): number => {
  const base = { Easy: 1, Medium: 2, Hard: 3 };
  return base[difficulty] * stepsCount;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const calculateStepProgress = (stepRemainingSec: number, stepDurationSec: number): number => {
  const stepElapsedSec = Math.max(0, stepDurationSec - stepRemainingSec);
  return Math.round((stepElapsedSec / stepDurationSec) * 100);
};

export const calculateOverallProgress = (overallRemainingSec: number, totalDurationSec: number): number => {
  const overallElapsedSec = totalDurationSec - overallRemainingSec;
  return Math.round((overallElapsedSec / totalDurationSec) * 100);
};