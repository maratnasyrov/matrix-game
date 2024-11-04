import { Result } from '../types';

export const isResultExist = (data: Result | null) => {
  return data !== null;
};
