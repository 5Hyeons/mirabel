/**
 * AI 상담 화면
 * Unity WebGL + LiveKit 통합
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import '@livekit/components-styles';
import { useLiveKit } from '@/lib/hooks';
import { useConsultationStore } from '@/lib/store/consultation-store';
import { useTranslation } from '@/lib/i18n';
import { SessionManager } from './SessionManager';
import { ConsultationSummary } from './ConsultationSummary';
import imgDoctorAvatar from '@/assets/doctor-avatar-complete.webp';
import imgIconSize from '@/assets/icon-size.webp';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconCallSlash from '@/assets/icon-call-slash-mono.webp';

export function AIConsultation() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { token, serverUrl, isConnecting, error, connect, reset } = useLiveKit();
  const { clearMessages } = useConsultationStore();
  const [showSummary, setShowSummary] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Unity WebGL을 먼저 로드 시작
  const unityContext = useUnityContext({
    loaderUrl: '/unity/doctor/Build/doctor.loader.js',
    dataUrl: '/unity/doctor/Build/doctor.data',
    frameworkUrl: '/unity/doctor/Build/doctor.framework.js',
    codeUrl: '/unity/doctor/Build/doctor.wasm',
  });

  const { isLoaded: isUnityLoaded } = unityContext;

  useEffect(() => {
    connect(language);
  }, [connect, language]);

  // 로딩 화면에서 뒤로가기
  const handleBack = () => {
    clearMessages();
    reset();
    navigate(-1);
  };

  // 상담 중 종료 버튼 → 요약 화면 표시
  const handleShowSummary = () => {
    setShowSummary(true);
  };

  // 요약 화면에서 돌아가기 → 상담 화면으로 복귀
  const handleBackToConsultation = () => {
    setShowSummary(false);
  };

  // 요약 화면에서 상담 종료 → 홈으로 이동
  const handleEndConsultation = () => {
    clearMessages();
    reset();
    navigate('/');
  };

  if (error) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-[60px] mb-4">&#9888;&#65039;</div>
          <h1 className="text-[20px] font-bold text-[#111111] mb-2">{t('consultation.connectionError')}</h1>
          <p className="text-[14px] text-[#666666] mb-6">{error}</p>
          <button
            onClick={() => {
              reset();
              connect(language);
            }}
            className="bg-[#6490ff] text-white px-6 py-3 rounded-lg font-bold"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Unity 로드 완료 + LiveKit 연결 완료 전까지 로딩 화면 표시
  const isLoading = !isUnityLoaded || isConnecting || !token;

  // Unity는 항상 렌더링하되, 로딩 중에는 숨김 처리
  // LiveKit 연결은 token이 있을 때만 활성화
  const isLiveKitReady = token && serverUrl;

  return (
    <div className="h-full relative">
      {/* Unity + LiveKit 항상 렌더링 (요약 페이지에서는 숨김 처리) */}
      <div style={{ visibility: isLoading || showSummary ? 'hidden' : 'visible', height: '100%' }}>
        {isLiveKitReady ? (
          <LiveKitRoom
            token={token}
            serverUrl={serverUrl}
            connect={true}
            audio={true}
            video={false}
          >
            <SessionManager
              onBack={handleBack}
              onShowSummary={handleShowSummary}
              unityContext={unityContext}
              conversationStarted={conversationStarted}
              onConversationStart={() => setConversationStarted(true)}
            />
          </LiveKitRoom>
        ) : (
          // LiveKit 연결 전 Unity만 미리 로드
          <div className="h-full">
            <Unity
              unityProvider={unityContext.unityProvider}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>

      {/* 요약 페이지 오버레이 */}
      {showSummary && (
        <div className="absolute inset-0 z-50">
          <ConsultationSummary
            onBack={handleBackToConsultation}
            onEndConsultation={handleEndConsultation}
          />
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isLoading && !showSummary && (
        <div className="absolute inset-0 bg-white flex flex-col z-50">
          {/* 헤더 */}
          <div className="flex items-center pb-[12px] pt-[32px] px-[16px]">
            <div className="flex gap-[4px] grow h-[36px] items-center">
              <button onClick={handleBack} className="w-[24px] h-[24px]">
                <img src={imgIconArrowLeft} alt="뒤로" className="w-full h-full" />
              </button>
            </div>
            <div className="flex gap-[4px] items-center p-[8px]">
              <img src={imgIconSize} alt="" className="w-[20px] h-[20px]" />
              <p className="font-bold text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
                {t('common.sizeAdjust')}
              </p>
            </div>
          </div>

          {/* 아바타 영역 */}
          <div className="flex items-start justify-center pt-[120px] pb-[16px]">
            <div className="relative w-[160px] h-[160px]">
              {/* 회전하는 테두리 */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#6490ff] border-t-transparent animate-spin" />
              {/* 내부 원형 이미지 */}
              <div className="absolute inset-[5px] rounded-full bg-[#f0f3ff] overflow-hidden">
                <img
                  src={imgDoctorAvatar}
                  alt="AI 의사"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>

          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-[10px] items-center justify-center pt-[20px] px-[20px]">
            <p className="text-[23px] text-[#222222] text-center tracking-[-0.46px] leading-[1.3]">
              {t('consultation.connecting')}
            </p>
            <p className="text-[16px] text-[#666666] text-center tracking-[-0.32px]">
              {t('consultation.pleaseWait')}
            </p>
          </div>

          {/* 하단 버튼 */}
          <div className="mt-auto flex gap-[16px] h-[100px] items-start justify-center px-[16px] pt-[8px] pb-[24px]">
            <button
              onClick={handleBack}
              className="flex-1 bg-[#fd4848] h-[56px] rounded-[8px] flex items-center justify-center gap-[4px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]"
            >
              <img src={imgIconCallSlash} alt="" className="w-[20px] h-[20px]" />
              <p className="font-bold text-[16px] text-white tracking-[-0.32px]">
                {t('consultation.exit')}
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
