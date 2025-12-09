import { create } from 'zustand';
import { apiClient } from '@/lib/api/mock-api';
import { PatientData } from '@/lib/api/types';

interface PatientStore {
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;
  healthCheckState: string[] | null;

  loadPatientData: (token: string) => Promise<void>;
  setError: (error: string) => void;
  clearError: () => void;
  setHealthCheckState: (ids: string[]) => void;
  clearHealthCheckState: () => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  loading: false,
  error: null,
  patientData: null,
  healthCheckState: null,

  loadPatientData: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getPatientInfo(token);
      set({ patientData: data, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '데이터 로드 실패';
      set({ error: message, loading: false });
    }
  },

  setError: (error: string) => set({ error }),
  clearError: () => set({ error: null }),
  setHealthCheckState: (ids: string[]) => set({ healthCheckState: ids }),
  clearHealthCheckState: () => set({ healthCheckState: null })
}));
