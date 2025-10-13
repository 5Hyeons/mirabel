/**
 * AI 상담 화면
 * Figma Node ID: 89-6570
 * URL: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6570&m=dev
 *
 * 데모에서는 Unity WebGL 대신 2D 이미지 사용
 * 실제 프로젝트에서는 Unity WebGL + LiveKit로 교체
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 이미지 assets
const imgDoctorAvatar = "/images/doctor-avatar-ai.png";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";
const imgIconLoudspeaker = "/images/icon-loudspeaker.svg";
const imgListeningIcon = "/images/icon-listening.svg";

type ListeningState = 'idle' | 'listening' | 'speaking';

export default function AIConsultation() {
  const router = useRouter();
  const [listeningState, setListeningState] = useState<ListeningState>('listening');

  const handleInterrupt = () => {
    // TODO: 실제로는 LiveKit Agent에 RPC 전송
    setListeningState('idle');
    console.log('Interrupt signal sent');
  };

  const handleEnd = () => {
    if (window.confirm('상담을 종료하시겠습니까?')) {
      // TODO: 상담 기록 저장
      router.push('/');
    }
  };

  return (
    <div className="bg-white overflow-clip relative rounded-[8px] size-full min-h-screen" data-name="AI 상담" data-node-id="89:6570">
      {/* 상단 헤더 */}
      <div className="absolute bg-white content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-[360px]">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={() => router.back()} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            &nbsp;
          </p>
          <button onClick={() => router.push('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 의사 아바타 (데모: 2D 이미지 / 실제: Unity WebGL) */}
      <div className="absolute bottom-[83.06px] h-[417.539px] left-[calc(50%-0.742px)] translate-x-[-50%] w-[287.78px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt="AI Doctor Avatar"
            className="absolute h-[235.96%] left-[-124.53%] max-w-none top-[-47.95%] w-[342.36%]"
            src={imgDoctorAvatar}
          />
        </div>
      </div>

      {/* 상담 안내 텍스트 */}
      <div className="absolute box-border content-stretch flex flex-col gap-[10px] items-center justify-center left-0 px-[20px] py-[10px] top-[165px] w-[360px]">
        <div className="flex flex-col font-['Noto_Sans_KR:Bold',_sans-serif] font-bold justify-center leading-[0] max-h-[62px] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#111111] text-[20px] text-center text-nowrap tracking-[-0.4px] w-[min-content]">
          <p className="[white-space-collapse:collapse] leading-[1.4] overflow-ellipsis overflow-hidden">
            추가로 궁금한 사항을 말씀해주세요
          </p>
        </div>
        <div className="flex flex-col font-['Noto_Sans_KR:Regular',_sans-serif] font-normal justify-center leading-[0] max-h-[56px] min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[#666666] text-[16px] text-center text-nowrap tracking-[-0.32px] w-[min-content]">
          <p className="[white-space-collapse:collapse] leading-[1.4] overflow-ellipsis overflow-hidden">
            수면 내시경도 고통을 느낄 수도 있나요?
          </p>
        </div>

        {/* 상태 인디케이터 */}
        <div className="bg-[#e1e9ff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[4px] relative rounded-[4px] shrink-0">
          <div className="relative shrink-0 size-[5.508px]">
            <img alt="" className="block max-w-none size-full" src={imgListeningIcon} />
          </div>
          <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#6490ff] text-[11px] text-nowrap tracking-[-0.22px] whitespace-pre">
            {listeningState === 'listening' && '듣고 있어요'}
            {listeningState === 'speaking' && '말하고 있어요'}
            {listeningState === 'idle' && '대기 중'}
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-0 content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.89px] to-[#f0f3ff] w-[360px]">
        <div className="bg-white box-border content-stretch flex gap-[16px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={handleInterrupt}
            className="basis-0 bg-[#bcceff] box-border content-stretch flex gap-[10px] grow h-[60px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#4472e4] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              답변 멈추기
            </p>
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={imgIconLoudspeaker} />
            </div>
          </button>
          <button
            onClick={handleEnd}
            className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              끝내기
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
