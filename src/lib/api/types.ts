// API 타입 정의

export interface PatientData {
  patientId: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  appointment: {
    appointmentId: string;
    hospitalName: string;
    hospitalLogo: string;
    doctorName: string;
    doctorPhoto: string;
    doctorSpecialty: string;
    examinationDate: string;
    examinationType: string;
  };
}

export interface ConsentCheckboxData {
  patientId: string;
  agreed: boolean;
  consentText: string;
  timestamp: string;
}

export interface ConsentResponse {
  consentId: string;
  success: boolean;
  error?: string;
}

export interface SignatureData {
  patientId: string;
  signature: string;
  timestamp: string;
}

export interface VoiceData {
  patientId: string;
  duration: number;
  timestamp: string;
}

export interface ExaminationPage {
  title: string;
  content: string;
}

export interface MockData {
  patient: PatientData;
  examinationInfo: {
    pages: ExaminationPage[];
  };
  aiResponses: string[];
}
