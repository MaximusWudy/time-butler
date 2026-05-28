export enum ActivityType {
  WORK = 'Work',
  STUDY = 'Study',
  REST = 'Rest',
  COMMUTE = 'Commute',
  EXERCISE = 'Exercise',
  SOCIAL = 'Social',
  BUSINESS = 'Business',
  OTHER = 'Other'
}

export interface TimeLog {
  id: string;
  activityType: ActivityType | string;
  startTime: number; // timestamp
  endTime: number | null; // null if currently active
  duration: number; // in seconds (calculated when closed or temporary for current)
}

export interface UserSettings {
  customActivities: string[];
  reminderIntervalMinutes: number; // e.g., 60 minutes
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface AIAnalysis {
  summary: string;
  suggestions: string[];
  score: number;
}
