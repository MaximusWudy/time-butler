import { TimeLog, UserSettings } from '../types';
import { STORAGE_KEYS } from '../constants';

export const getLogs = (): TimeLog[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load logs', e);
    return [];
  }
};

export const saveLogs = (logs: TimeLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
};

export const getCurrentLog = (): TimeLog | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_LOG);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveCurrentLog = (log: TimeLog | null): void => {
  if (log) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_LOG, JSON.stringify(log));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_LOG);
  }
};

export const getSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { customActivities: [], reminderIntervalMinutes: 60 };
  } catch (e) {
    return { customActivities: [], reminderIntervalMinutes: 60 };
  }
};
