
import { TaskState, Section, OrganizationSettings } from './types';
import { DEFAULT_ORG_SETTINGS } from './constants';

const STORAGE_KEY = 'pelastaja_perehdytys_data_v1';

export interface AppData {
  traineeName: string;
  tasks: Record<string, TaskState>;
  customSections?: Section[]; 
  introText?: string; 
  organizationSettings?: OrganizationSettings; // New field
  lastUpdated: string;
}

const defaultData: AppData = {
  traineeName: '',
  tasks: {},
  organizationSettings: DEFAULT_ORG_SETTINGS,
  lastUpdated: new Date().toISOString()
};

export const storageService = {
  save: (data: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Tallennus epäonnistui", e);
    }
  },

  load: (): AppData => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      // Merge with default data to ensure new fields (like organizationSettings) exist for old users
      return data ? { ...defaultData, ...JSON.parse(data) } : defaultData;
    } catch (e) {
      console.error("Lataus epäonnistui", e);
      return defaultData;
    }
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
