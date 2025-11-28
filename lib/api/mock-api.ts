import { PatientData, ConsentCheckboxData, ConsentResponse, SignatureData, VoiceData, MockData } from './types';

// API 인터페이스 (추후 실제 API로 교체 가능)
interface ApiClient {
  getPatientInfo(token: string): Promise<PatientData>;
  getExaminationInfo(): Promise<MockData['examinationInfo']>;
  saveCheckboxConsent(data: ConsentCheckboxData): Promise<ConsentResponse>;
  saveSignature(data: SignatureData): Promise<ConsentResponse>;
  saveVoiceRecording(data: VoiceData): Promise<ConsentResponse>;
}

// Mock API 구현
class MockApiClient implements ApiClient {
  private mockData: MockData | null = null;

  private async loadMockData(): Promise<MockData> {
    if (this.mockData) return this.mockData;

    const response = await fetch('/mock-data.json');
    this.mockData = await response.json();
    return this.mockData;
  }

  async getPatientInfo(token: string): Promise<PatientData> {
    // 실제로는 token 검증 및 서버 조회
    // Mock: mock-data.json에서 로드
    const data = await this.loadMockData();
    return data.patient;
  }

  async getExaminationInfo(): Promise<MockData['examinationInfo']> {
    const data = await this.loadMockData();
    return data.examinationInfo;
  }

  async saveCheckboxConsent(data: ConsentCheckboxData): Promise<ConsentResponse> {
    // Mock: localStorage에 저장
    localStorage.setItem('consent-checkbox', JSON.stringify(data));

    // 실제 API 호출 시뮬레이션 (500ms 지연)
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

// Export singleton
export const apiClient = new MockApiClient();

// 추후 실제 API 전환 시:
// import { RealApiClient } from './real-api';
// export const apiClient = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
//   ? new MockApiClient()
//   : new RealApiClient();
