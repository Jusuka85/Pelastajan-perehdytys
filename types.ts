

export interface TaskItem {
  id: string;
  label: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  items: TaskItem[];
}

export interface TaskState {
  date: string;
  traineeSigned: boolean;
  trainerSigned: boolean;
  traineeName?: string;
  trainerName?: string;
}

export type UserRole = 'trainee' | 'supervisor';

export interface UserProgress {
  userId: string;
  userName: string;
  tasks: Record<string, TaskState>;
  lastUpdated: string;
}

export interface TraineeQrData {
  type: 'TRAINEE_PROGRESS';
  name: string;
  completedTaskIds: string[];
  timestamp: number;
}

// Internal structure for minified template data
export interface TemplateRawData {
  intro: string;
  s: {
    i?: string; // id (optional to save space)
    t: string; // title
    s?: string; // subtitle
    it: {      // items
      i?: string; // id (optional to save space)
      l: string; // label
    }[];
  }[];
}

export interface OrganizationSettings {
  name: string;      // e.g. "Satakunnan hyvinvointialue"
  subtitle: string;  // e.g. "Pelastustoimi"
  city: string;      // e.g. "Porissa" (used in signature line)
}

// Global declaration for the loaded script
declare global {
  class Html5QrcodeScanner {
    constructor(elementId: string, config: any, verbose?: boolean);
    render(onSuccess: (decodedText: string, decodedResult: any) => void, onError?: (errorMessage: string) => void): void;
    clear(): Promise<void>;
  }

  class Html5Qrcode {
    constructor(elementId: string, verbose?: boolean);
    start(
      cameraIdOrConfig: string | { facingMode: string } | { deviceId: string }, 
      config: { fps: number; qrbox?: number | { width: number; height: number }; aspectRatio?: number }, 
      onSuccess: (decodedText: string, decodedResult: any) => void, 
      onError?: (errorMessage: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): Promise<void>;
  }
}
