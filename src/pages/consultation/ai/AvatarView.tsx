import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { useLocalParticipant, useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState, Track } from 'livekit-client';
import { ChatMessage, AgentState } from '@/lib/types/consultation';
import { useAnimationData } from '@/lib/hooks';

let firstUnityFrameTime: number | null = null;
let unitySentCount = 0;

const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";

interface AvatarViewProps {
  lastMessage?: ChatMessage;
  agentState: AgentState | null;
  userVolume: number;
  onBack: () => void;
}

export function AvatarView({ lastMessage, agentState, userVolume, onBack }: AvatarViewProps) {
  const navigate = useNavigate();

  const { unityProvider, isLoaded, sendMessage } = useUnityContext({
    loaderUrl: '/unity/doctor/Build/doctor.loader.js',
    dataUrl: '/unity/doctor/Build/doctor.data',
    frameworkUrl: '/unity/doctor/Build/doctor.framework.js',
    codeUrl: '/unity/doctor/Build/doctor.wasm',
  });

  const { latestFrame, interruptSignal } = useAnimationData();
  const { localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();
  const room = useRoomContext();
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  const hasUserInteracted = useRef(false);

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

    const handleTrackPublished = async () => {
      const micTrack = localParticipant.getTrackPublication(Track.Source.Microphone);
      if (micTrack) {
        console.log('[AvatarView] Microphone track published, isMuted:', micTrack.isMuted);

        if (micTrack.isMuted) {
          console.log('[AvatarView] Unmuting microphone track...');
          await localParticipant.setMicrophoneEnabled(true);
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

  useEffect(() => {
    if (localParticipant && isLoaded && connectionState === ConnectionState.Connected) {
      const timer = setTimeout(() => {
        if (!hasUserInteracted.current) {
          localParticipant.setMicrophoneEnabled(true);
          setIsMicEnabled(true);
          console.log('[AvatarView] Microphone auto-enabled');
        }
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [localParticipant, isLoaded, connectionState]);

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

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative w-full h-full">
      {/* 상단 헤더 */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-full z-50">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={onBack} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            AI 상담
          </p>
          <button onClick={() => navigate('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* Agent Message */}
      {isLoaded && lastMessage && (
        <div
          className="absolute left-1/2 translate-x-[-50%] w-full px-5 z-10"
          style={{
            top: '100px',
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

      {/* 로딩 오버레이 */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f0f3ff] z-40">
          <div className="flex flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-full bg-[#e1e9ff] flex items-center justify-center mb-6 animate-pulse">
              <span className="text-[40px]">&#129658;</span>
            </div>
            <p className="text-[20px] font-medium text-[#111111] mb-2">AI 의사를 불러오고 있어요</p>
            <p className="text-[14px] text-[#666666]">잠시만 기다려주세요</p>
          </div>
        </div>
      )}

      {/* Volume-reactive gradient */}
      {isLoaded && isMicEnabled && (
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

      {/* 하단 버튼 */}
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
          <img src="/images/icon-mic-mono.png" alt="" width={20} height={20} />
          <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
            {isMicEnabled ? '음소거' : '해제'}
          </p>
        </button>

        {/* 일시중지 버튼 */}
        <button
          onClick={handleInterruptAgent}
          disabled={!isLoaded}
          className="flex-1 h-[56px] bg-[#6490ff] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center gap-[4px] active:scale-95 transition-transform disabled:opacity-50"
        >
          <img src="/images/icon-stop.png" alt="" width={20} height={20} />
          <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
            일시중지
          </p>
        </button>

        {/* 종료 버튼 */}
        <button
          onClick={onBack}
          disabled={!isLoaded}
          className="w-[86px] h-[56px] bg-[#fd4848] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center gap-[4px] active:scale-95 transition-transform disabled:opacity-50"
        >
          <img src="/images/icon-call-slash-mono.png" alt="" width={20} height={20} />
          <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
            종료
          </p>
        </button>
      </div>
    </div>
  );
}
