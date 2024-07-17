export const API_URL =
  import.meta.env.VITE_BASE_API_URL || 'http://catsapi.test/json';

export * from './auth';
export * from './user';
export * from './photo';
export * from './comment';
export * from './stats';
export * from './chat';
