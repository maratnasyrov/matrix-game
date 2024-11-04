import { Result } from '../types';

export const isClassicGame = (data: Result | null) => {
  return (
    data !== null &&
    data.step.type === 1 &&
    data.step.payload.nextStepType === 1
  );
};

export const isBonusStarted = (data: Result | null) => {
  return (
    data !== null &&
    data.step.type === 1 &&
    data.step.payload.nextStepType === 2
  );
};

export const isBonusFinished = (data: Result | null) => {
  return (
    data !== null &&
    data.step.type === 2 &&
    data.step.payload.nextStepType === 1
  );
};

export const isBonusGame = (data: Result | null) => {
  return (
    data !== null &&
    data.step.type === 2 &&
    data.step.payload.nextStepType === 2
  );
};
