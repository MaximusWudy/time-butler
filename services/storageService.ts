import { TimeLog, UserSettings } from '../types';
import { STORAGE_KEYS, MOCK_USER_ID } from '../constants';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getLogs = async (): Promise<TimeLog[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', MOCK_USER_ID, 'logs'));
    const logs: TimeLog[] = [];
    querySnapshot.forEach((doc) => {
      logs.push(doc.data() as TimeLog);
    });
    return logs;
  } catch (e) {
    console.error('Failed to load logs', e);
    return [];
  }
};

export const saveLog = async (log: TimeLog): Promise<void> => {
  try {
    await addDoc(collection(db, 'users', MOCK_USER_ID, 'logs'), log);
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
