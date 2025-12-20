import { TimeLog, UserSettings } from '../types';
import { STORAGE_KEYS, MOCK_USER_ID } from '../constants';

const API_URL = 'http://localhost:3000/api';

export const getLogs = async (): Promise<TimeLog[]> => {
  try {
    const response = await fetch(`${API_URL}/logs/${MOCK_USER_ID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }
    return await response.json();
  } catch (e) {
    console.error('Failed to load logs', e);
    return [];
  }
};

export const saveLog = async (log: TimeLog): Promise<void> => {
  try {
    await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: MOCK_USER_ID, log }),
    });
  } catch (e) {
    console.error('Failed to save log', e);
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
