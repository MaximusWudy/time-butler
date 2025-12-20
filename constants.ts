import { ActivityType } from './types';

export const ACTIVITY_COLORS: Record<string, string> = {
  [ActivityType.WORK]: '#3b82f6', // Blue 500
  [ActivityType.STUDY]: '#8b5cf6', // Violet 500
  [ActivityType.REST]: '#10b981', // Emerald 500
  [ActivityType.COMMUTE]: '#f59e0b', // Amber 500
  [ActivityType.EXERCISE]: '#ef4444', // Red 500
  [ActivityType.SOCIAL]: '#ec4899', // Pink 500
  [ActivityType.OTHER]: '#64748b', // Slate 500
};

export const DEFAULT_ACTIVITY_OPTS = [
  { type: ActivityType.WORK, icon: 'Briefcase', label: 'Work' },
  { type: ActivityType.STUDY, icon: 'BookOpen', label: 'Study' },
  { type: ActivityType.REST, icon: 'Coffee', label: 'Rest' },
  { type: ActivityType.COMMUTE, icon: 'Car', label: 'Commute' },
  { type: ActivityType.EXERCISE, icon: 'Dumbbell', label: 'Exercise' },
];

export const MOCK_USER_ID = 'user_123';
export const STORAGE_KEYS = {
  LOGS: 'timebutler_logs',
  CURRENT_LOG: 'timebutler_current',
  SETTINGS: 'timebutler_settings'
};
