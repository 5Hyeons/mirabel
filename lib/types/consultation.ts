// LiveKit 메타데이터
export interface ClientMetadata {
  language: string;
  patientId?: string;
}

// 토큰 요청/응답
export interface TokenRequest {
  room: string;
  identity: string;
  livekitUrl: string;
  metadata: ClientMetadata;
}

export interface TokenResponse {
  token: string;
}

// Chat 메시지
export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: number;
  sender?: string;
  isFinal?: boolean;
  isMarkdown?: boolean;
}

// Agent 상태
export type AgentState = 'initializing' | 'idle' | 'listening' | 'thinking' | 'speaking';

// 화면 타입
export type ScreenType = 'chat' | 'avatar';
