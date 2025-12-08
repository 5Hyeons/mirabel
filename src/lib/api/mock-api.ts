import { PatientData, ConsentCheckboxData, ConsentResponse, SignatureData, VoiceData, MockData } from './types';

interface ApiClient {
  getPatientInfo(token: string): Promise<PatientData>;
  getExaminationInfo(): Promise<MockData['examinationInfo']>;
  saveCheckboxConsent(data: ConsentCheckboxData): Promise<ConsentResponse>;
  saveSignature(data: SignatureData): Promise<ConsentResponse>;
  saveVoiceRecording(data: VoiceData): Promise<ConsentResponse>;
}

class MockApiClient implements ApiClient {
  private mockData: MockData | null = null;

  private async loadMockData(): Promise<MockData> {
    if (this.mockData) return this.mockData;

    const response = await fetch('/mock-data.json');
    const data: MockData = await response.json();
    this.mockData = data;
    return data;
  }

  async getPatientInfo(_token: string): Promise<PatientData> {
    const data = await this.loadMockData();
    return data.patient;
  }

  async getExaminationInfo(): Promise<MockData['examinationInfo']> {
    const data = await this.loadMockData();
    return data.examinationInfo;
  }

  async saveCheckboxConsent(data: ConsentCheckboxData): Promise<ConsentResponse> {
    localStorage.setItem('consent-checkbox', JSON.stringify(data));

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      consentId: `MOCK_CB_${Date.now()}`,
      success: true
    };
  }

  async saveSignature(data: SignatureData): Promise<ConsentResponse> {
    localStorage.setItem('consent-signature', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      consentId: `MOCK_SIG_${Date.now()}`,
      success: true
    };
  }

  async saveVoiceRecording(data: VoiceData): Promise<ConsentResponse> {
    localStorage.setItem('consent-voice', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      consentId: `MOCK_VOICE_${Date.now()}`,
      success: true
    };
  }
}

export const apiClient = new MockApiClient();
