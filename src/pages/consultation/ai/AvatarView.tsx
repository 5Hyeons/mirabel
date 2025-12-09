import { useState, useEffect, useRef } from 'react';
import { Unity } from 'react-unity-webgl';
import { useLocalParticipant, useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { ChatMessage, AgentState } from '@/lib/types/consultation';
import { useAnimationData } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconGlobe from '@/assets/icon-globe.webp';
import imgIconSize from '@/assets/icon-size.webp';
import type { useUnityContext } from 'react-unity-webgl';

// Phone icon component for "대화 시작" button
function IconCall({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" fill="white"/>
    </svg>
  );
}

let firstUnityFrameTime: number | null = null;
let unitySentCount = 0;

interface AvatarViewProps {
  lastMessage?: ChatMessage;
  agentState: AgentState | null;
  userVolume: number;
  onBack: () => void;
  onShowSummary: () => void;
  unityContext: ReturnType<typeof useUnityContext>;
  conversationStarted: boolean;
  onStartConversation: () => void;
}

export function AvatarView({ lastMessage, agentState, userVolume, onBack, onShowSummary, unityContext, conversationStarted, onStartConversation }: AvatarViewProps) {
  // Agent is ready when state is 'listening' (uses existing agent_state_changed RPC)
  const isAgentReady = agentState === 'listening';
  const { t, language } = useTranslation();

  const { unityProvider, isLoaded, sendMessage } = unityContext;

  const { latestFrame, interruptSignal } = useAnimationData();
  const { localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();
  const room = useRoomContext();
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [sampleQuestions, setSampleQuestions] = useState<string[]>([]);

  const hasUserInteracted = useRef(false);

  // Load sample questions from mock data
  useEffect(() => {
    const loadSampleQuestions = async () => {
      try {
        const response = await fetch(`/mock-data.${language}.json`);
        const data = await response.json();
        if (data.aiConsultation?.sampleQuestions) {
          setSampleQuestions(data.aiConsultation.sampleQuestions);
        }
      } catch (error) {
        console.error('Failed to load sample questions:', error);
      }
    };
    loadSampleQuestions();
  }, [language]);

  useEffect(() => {
    if (!localParticipant) return;

    const setupTrackListeners = (micTrack: ReturnType<typeof localParticipant.getTrackPublication>) => {
      if (!micTrack) return null;

      const updateMicState = () => {
        const isEnabled = !micTrack.isMuted;
        setIsMicEnabled(isEnabled);
        console.log('[AvatarView] Mic track state changed:', {
          isMuted: micTrack.isMuted,
          isEnabled,
          trackSid: micTrack.trackSid,
        });
      };

      updateMicState();
      micTrack.on('muted', updateMicState);
      micTrack.on('unmuted', updateMicState);

      return () => {
        micTrack.off('muted', updateMicState);
        micTrack.off('unmuted', updateMicState);
      };
    };

    let cleanup = setupTrackListeners(localParticipant.getTrackPublication(Track.Source.Microphone));

    // 대화 시작 전이면 마이크 비활성화 (초기 상태)
    if (!conversationStarted) {
      localParticipant.setMicrophoneEnabled(false);
      setIsMicEnabled(false);
      console.log('[AvatarView] Microphone disabled on mount (before conversation start)');
    }

    const handleTrackPublished = async () => {
      const micTrack = localParticipant.getTrackPublication(Track.Source.Microphone);
      if (micTrack) {
        console.log('[AvatarView] Microphone track published, isMuted:', micTrack.isMuted);

        // 대화 시작 전이면 마이크 비활성화
        if (!conversationStarted) {
          await localParticipant.setMicrophoneEnabled(false);
          setIsMicEnabled(false);
          console.log('[AvatarView] Microphone disabled on track publish (before conversation start)');
        }

        cleanup?.();
        cleanup = setupTrackListeners(micTrack);
      }
    };

    localParticipant.on('localTrackPublished', handleTrackPublished);

    if (!cleanup) {
      console.log('[AvatarView] No microphone track found, waiting for publish...');
    }

    return () => {
      cleanup?.();
      localParticipant.off('localTrackPublished', handleTrackPublished);
    };
  }, [localParticipant]);

  // Auto-enable microphone only after conversation has started
  useEffect(() => {
    if (localParticipant && isLoaded && connectionState === ConnectionState.Connected && conversationStarted) {
      const timer = setTimeout(() => {
        if (!hasUserInteracted.current) {
          localParticipant.setMicrophoneEnabled(true);
          setIsMicEnabled(true);
          console.log('[AvatarView] Microphone auto-enabled after conversation started');
        }
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [localParticipant, isLoaded, connectionState, conversationStarted]);

  const toggleMic = async () => {
    if (localParticipant) {
      hasUserInteracted.current = true;
      const newState = !isMicEnabled;

      try {
        await localParticipant.setMicrophoneEnabled(newState);
        setIsMicEnabled(newState);
      } catch (error) {
        console.error('[AvatarView] Failed to toggle microphone:', error);
      }
    }
  };

  const handleInterrupt = () => {
    if (isLoaded) {
      sendMessage('ReactBridge', 'OnAnimationData', 'interrupted');
      console.log('[AvatarView] Interrupt sent to Unity');
    }
  };

  const handleInterruptAgent = async () => {
    if (!localParticipant || !room) return;

    try {
      handleInterrupt();

      const remoteParticipants = Array.from(room.remoteParticipants.values());
      const agentParticipant = remoteParticipants.find(p => p.identity.startsWith('agent'));

      if (agentParticipant) {
        await localParticipant.performRpc({
          destinationIdentity: agentParticipant.identity,
          method: 'interrupt_agent',
          payload: '',
        });
        console.log('[AvatarView] RPC interrupt_agent sent');
      } else {
        console.warn('[AvatarView] No agent participant found for RPC');
      }
    } catch (error) {
      console.error('[AvatarView] Failed to interrupt agent:', error);
    }
  };

  // 종료 버튼 클릭 핸들러 - Agent 말 끊고 요약 페이지로 이동
  const handleEndClick = async () => {
    await handleInterruptAgent();
    onShowSummary();
  };

  useEffect(() => {
    if (interruptSignal > 0 && isLoaded) {
      sendMessage('ReactBridge', 'OnAnimationData', 'interrupted');
      console.log('[AvatarView -> Unity] Interrupt sent');
    }
  }, [interruptSignal, isLoaded, sendMessage]);

  useEffect(() => {
    if (isLoaded && agentState) {
      try {
        const message = JSON.stringify({
          action: 'setAgentState',
          state: agentState
        });
        sendMessage('ReactBridge', 'OnReactMessage', message);
      } catch (error) {
        console.error('[AvatarView] Failed to send agent state:', error);
      }
    }
  }, [isLoaded, agentState, sendMessage]);

  useEffect(() => {
    if (isLoaded && latestFrame) {
      try {
        const now = performance.now();

        if (firstUnityFrameTime === null) {
          firstUnityFrameTime = now;
          console.log('[AvatarView -> Unity] First frame sent');
        }

        unitySentCount++;

        let frameString: string;

        if (latestFrame.length === 208) {
          const frameArray = Array.from(latestFrame);
          frameString = frameArray.join(',');
        } else {
          frameString = new TextDecoder().decode(latestFrame);
          console.log('[AvatarView -> Unity] Final signal sent');
        }

        sendMessage('ReactBridge', 'OnAnimationData', frameString);

        if (unitySentCount % 20 === 0) {
          const elapsed = now - (firstUnityFrameTime || now);
          const avgInterval = elapsed / unitySentCount;
          const estimatedFPS = avgInterval > 0 ? 1000 / avgInterval : 0;

          console.log(`[AvatarView -> Unity] Sent ${unitySentCount} frames:`, {
            elapsedMs: Math.round(elapsed),
            estimatedFPS: estimatedFPS.toFixed(1),
          });
        }
      } catch (error) {
        console.error('[AvatarView] Failed to send animation data:', error);
      }
    }
  }, [isLoaded, latestFrame, sendMessage]);

  // Show ready screen until conversation has started
  // Button will be enabled only when agent is ready
  const showReadyScreen = !conversationStarted;

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative w-full h-full">
      {/* 상단 헤더 - 대화 시작 전 */}
      {showReadyScreen && (
        <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col items-start left-0 top-0 w-full z-50">
          {/* Header */}
          <div className="content-stretch flex items-center pb-[12px] pt-[32px] px-[20px] relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex gap-[4px] grow h-[36px] items-center min-h-px min-w-px relative shrink-0">
              <button onClick={onBack} className="relative shrink-0 size-[24px]">
                <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
              </button>
            </div>
            <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0">
              <img alt="" className="relative shrink-0 size-[20px]" src={imgIconGlobe} />
              <p className="font-bold leading-[1.4] relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
                {language === 'ko' ? t('language.korean') : t('language.english')}
              </p>
            </div>
            <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0">
              <img alt="" className="relative shrink-0 size-[20px]" src={imgIconSize} />
              <p className="font-bold leading-[1.4] relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
                {t('common.sizeAdjust')}
              </p>
            </div>
          </div>

          {/* FAQ 힌트 바 */}
          <div className="backdrop-blur-[10px] bg-white content-stretch flex gap-[8px] h-[46px] items-center leading-[1.4] max-w-full px-[16px] py-[8px] relative rounded-[8px] shrink-0 text-nowrap w-full mx-auto">
            <p className="basis-0 font-normal grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#666666] text-[16px] tracking-[-0.32px]">
              Q. {sampleQuestions[0] || '...'}
            </p>
            <p className="font-medium relative shrink-0 text-[#dddddd] text-[14px] text-center tracking-[-0.28px]">
              {t('avatar.seeMore')}
            </p>
          </div>

          {/* 메인 텍스트 */}
          <div className="content-stretch flex flex-col font-normal gap-[10px] items-center justify-center leading-[1.3] p-[20px] relative shrink-0 text-center w-full">
            <div className="relative shrink-0 text-[#222222] text-[23px] tracking-[-0.46px] w-full">
              <p className="mb-0">{t('avatar.questionTitle1')}</p>
              <p>{t('avatar.questionTitle2')}</p>
            </div>
            <p className="relative shrink-0 text-[#666666] text-[16px] tracking-[-0.32px] w-full">
              {t('avatar.tapToSpeak')}
            </p>
          </div>
        </div>
      )}

      {/* 상단 헤더 - 대화 중 (대화 시작 화면과 동일한 디자인) */}
      {!showReadyScreen && (
        <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col items-start left-0 top-0 w-full z-50">
          {/* Header */}
          <div className="content-stretch flex items-center pb-[12px] pt-[32px] px-[20px] relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex gap-[4px] grow h-[36px] items-center min-h-px min-w-px relative shrink-0">
              <button onClick={onBack} className="relative shrink-0 size-[24px]">
                <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
              </button>
            </div>
            <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0">
              <img alt="" className="relative shrink-0 size-[20px]" src={imgIconGlobe} />
              <p className="font-bold leading-[1.4] relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
                {language === 'ko' ? t('language.korean') : t('language.english')}
              </p>
            </div>
            <div className="content-stretch flex gap-[4px] items-center p-[8px] relative shrink-0">
              <img alt="" className="relative shrink-0 size-[20px]" src={imgIconSize} />
              <p className="font-bold leading-[1.4] relative shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
                {t('common.sizeAdjust')}
              </p>
            </div>
          </div>

          {/* FAQ 힌트 바 */}
          <div className="backdrop-blur-[10px] bg-white content-stretch flex gap-[8px] h-[46px] items-center leading-[1.4] max-w-full px-[16px] py-[8px] relative rounded-[8px] shrink-0 text-nowrap w-full mx-auto">
            <p className="basis-0 font-normal grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#666666] text-[16px] tracking-[-0.32px]">
              Q. {sampleQuestions[0] || '...'}
            </p>
            <p className="font-medium relative shrink-0 text-[#dddddd] text-[14px] text-center tracking-[-0.28px]">
              {t('avatar.seeMore')}
            </p>
          </div>
        </div>
      )}

      {/* Agent Message - 대화 중에만 표시 */}
      {!showReadyScreen && isLoaded && lastMessage && (
        <div
          className="absolute left-1/2 translate-x-[-50%] w-full px-5 z-10"
          style={{
            top: '126px',
            bottom: 'calc(420px + 100px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="text-center">
            <p className="text-[20px] leading-[1.4] tracking-[-0.46px] text-black">
              {lastMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* Unity Canvas Area */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ bottom: '100px', height: '420px', zIndex: 45 }}
      >
        <div style={{ width: 'min(360px, 100vw)', height: '420px' }}>
          <Unity
            unityProvider={unityProvider}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* 로딩은 AIConsultation에서 처리됨 - Unity + LiveKit 모두 완료 후 이 컴포넌트 렌더링 */}

      {/* Volume-reactive gradient - 대화 중에만 */}
      {!showReadyScreen && isLoaded && isMicEnabled && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '220px',
            background: 'linear-gradient(to top, rgba(150, 180, 255, 0.5), transparent)',
            opacity: userVolume > 0.02 ? Math.min((userVolume - 0.02) * 3, 1) : 0,
            transition: 'opacity 0.2s ease-in-out',
            pointerEvents: 'none',
            zIndex: 60,
          }}
        />
      )}

      {/* Unity->Footer 그라데이션 */}
      {isLoaded && (
        <div
          className="absolute left-1/2 translate-x-[-50%] w-full pointer-events-none"
          style={{
            bottom: '100px',
            height: '70px',
            background: 'linear-gradient(to bottom, transparent, #f0f3ff)',
            zIndex: 50,
          }}
        />
      )}

      {/* 하단 버튼 - 대화 시작 전 */}
      {showReadyScreen && (
        <div className="absolute bottom-0 left-0 w-full z-70">
          {/* 그라데이션 */}
          <div className="w-full h-[100px] bg-gradient-to-b from-transparent to-[rgba(240,243,255,0.8)]" />
          {/* 버튼 영역 */}
          <div
            className="bg-[#f0f3ff] content-stretch flex gap-[16px] h-[100px] items-end justify-center pb-[38px] pt-[8px] px-[16px] w-full"
            style={{ paddingBottom: 'calc(38px + env(safe-area-inset-bottom, 0px))' }}
          >
            <button
              onClick={onStartConversation}
              disabled={!isLoaded || !isAgentReady}
              className="flex-1 bg-[#6490ff] content-stretch flex gap-[8px] h-[56px] items-center justify-center p-[20px] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] active:scale-95 transition-transform disabled:opacity-50"
            >
              <IconCall className="shrink-0" />
              <p className="font-bold leading-[1.4] text-[16px] text-center text-nowrap text-white tracking-[-0.32px]">
                {isAgentReady ? t('avatar.startConversation') : t('avatar.preparing')}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* 하단 버튼 - 대화 중 */}
      {!showReadyScreen && (
        <div
          className="absolute bottom-0 left-1/2 translate-x-[-50%] w-full flex gap-[16px] items-end justify-center px-[16px] pt-[8px]"
          style={{
            paddingBottom: 'calc(38px + env(safe-area-inset-bottom, 0px))',
            zIndex: 70,
          }}
        >
          {/* 음소거 버튼 */}
          <button
            onClick={toggleMic}
            disabled={!isLoaded}
            className={`w-[86px] h-[56px] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center gap-[4px] active:scale-95 transition-transform disabled:opacity-50 ${
              isMicEnabled ? 'bg-[#666666]' : 'bg-[#ff6464]'
            }`}
          >
            <img src="/images/icon-mic-mono.webp" alt="" width={20} height={20} />
            <p className="font-bold text-[16px] text-white tracking-[-0.32px]">
              {isMicEnabled ? t('avatar.mute') : t('avatar.unmute')}
            </p>
          </button>

          {/* 일시중지 버튼 */}
          <button
            onClick={handleInterruptAgent}
            disabled={!isLoaded}
            className="flex-1 h-[56px] bg-[#6490ff] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center gap-[4px] active:scale-95 transition-transform disabled:opacity-50"
          >
            <img src="/images/icon-stop.webp" alt="" width={20} height={20} />
            <p className="font-bold text-[16px] text-white tracking-[-0.32px]">
              {t('avatar.pause')}
            </p>
          </button>

          {/* 종료 버튼 */}
          <button
            onClick={handleEndClick}
            disabled={!isLoaded}
            className="w-[86px] h-[56px] bg-[#fd4848] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center gap-[4px] active:scale-95 transition-transform disabled:opacity-50"
          >
            <img src="/images/icon-call-slash-mono.webp" alt="" width={20} height={20} />
            <p className="font-bold text-[16px] text-white tracking-[-0.32px]">
              {t('avatar.end')}
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
