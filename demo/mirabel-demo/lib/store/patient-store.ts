import { create } from 'zustand';
import { apiClient } from '@/lib/api/mock-api';
import { PatientData } from '@/lib/api/types';

interface PatientStore {
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;

  loadPatientData: (token: string) => Promise<void>;
  setError: (error: string) => void;
  clearError: () => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  loading: false,
  error: null,
  patientData: null,

  loadPatientData: async (token: string) => {
    set({ loading: true, error: null });
    try {
      const data = await apiClient.getPatientInfo(token);
      set({ patientData: data, loading: false });
    } catch (error: any) {
      set({ error: error.message || '데이터 로드 실패', loading: false });
    }
  },

  setError: (error: string) => set({ error }),
  clearError: () => set({ error: null })
}));
