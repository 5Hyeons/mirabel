/**
 * AI 상담 화면
 * Figma Node ID: 89-6570
 *
 * Unity WebGL + LiveKit 통합
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import { useLiveKit } from '@/lib/hooks';
import { SessionManager } from './SessionManager';

export default function AIConsultation() {
  const router = useRouter();
  const { token, serverUrl, isConnecting, error, connect, reset } = useLiveKit();

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, [connect]);

  // Handle back to previous page
  const handleBack = () => {
    reset();
    router.back();
  };

  // Connection error state
  if (error) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-[60px] mb-4">⚠️</div>
          <h1 className="text-[20px] font-bold text-[#111111] mb-2">연결 오류</h1>
          <p className="text-[14px] text-[#666666] mb-6">{error}</p>
          <button
            onClick={() => {
              reset();
              connect();
            }}
            className="bg-[#6490ff] text-white px-6 py-3 rounded-lg font-bold"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // Connecting state
  if (isConnecting || !token) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-[120px] h-[120px] rounded-full bg-[#e1e9ff] flex items-center justify-center mb-6 mx-auto animate-pulse">
            <span className="text-[40px]">🩺</span>
          </div>
          <p className="text-[20px] font-medium text-[#111111] mb-2">AI 의사에 연결중...</p>
          <p className="text-[14px] text-[#666666]">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // Connected - render LiveKitRoom
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
    >
      <SessionManager onBack={handleBack} />
    </LiveKitRoom>
  );
}
