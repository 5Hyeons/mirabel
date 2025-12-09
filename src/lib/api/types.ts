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

export interface CheckboxOption {
  id: string;
  label: string;
}

export interface ExaminationSection {
  title: string;
  content?: string;
  items?: string[];
  type: 'text' | 'highlight' | 'bullet-list' | 'warning' | 'section-header' | 'checkbox' | 'consent-checkbox';
  textColor?: string;
  highlight?: string;
  checkboxOptions?: CheckboxOption[];
  checkboxLabel?: string;
  required?: boolean;
}

export interface ExaminationType {
  type: string;
  sections: ExaminationSection[];
}

export interface HealthCheckItem {
  id: string;
  text: string;
  bold?: boolean;
  category: 'normal' | 'caution' | 'danger';
}

export interface WarningMessage {
  title: string;
  content: string;
}

export interface HealthCheckData {
  title: string;
  doctorMessage: string;
  items: HealthCheckItem[];
  warnings: {
    danger: WarningMessage;
    caution: WarningMessage;
  };
}

export interface MockData {
  patient: PatientData;
  examinationInfo: {
    pages: ExaminationPage[];
  };
  examinationTypes: Record<string, ExaminationType>;
  healthCheck: HealthCheckData;
  aiResponses: string[];
}
