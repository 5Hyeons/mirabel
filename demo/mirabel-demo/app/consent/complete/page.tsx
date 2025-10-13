/**
 * 동의서 완료
 * Figma Node ID: 89-6350
 * URL: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6350&m=dev
 */

'use client';

import { useRouter } from 'next/navigation';

// 이미지 assets
const imgCheckIcon = "/images/icon-check-circle.svg";
const imgDoctorAvatar = "/images/doctor-avatar-complete.png";
const imgSpeechBubble = "/images/speech-bubble.svg";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";

function IconCheckCircleMono({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-[4.17%_4.16%_4.16%_4.17%]">
        <img alt="" className="block max-w-none size-full" src={imgCheckIcon} />
      </div>
    </div>
  );
}

export default function ConsentComplete() {
  const router = useRouter();

  const handleAdditionalInquiry = () => {
    router.push('/consultation/ai');
  };

  const handleComplete = () => {
    if (window.confirm('검사 사전교육을 완료하시겠습니까?')) {
      // 완료 처리
      window.close();
      // 또는 완료 페이지로
      // router.push('/thank-you');
    }
  };

  return (
    <div className="bg-white overflow-clip relative rounded-[8px] size-full min-h-screen" data-name="동의" data-node-id="89:6350">
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

      {/* 완료 메시지 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[16px] top-[116px] w-[328px]">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">
          <IconCheckCircleMono className="overflow-clip relative shrink-0 size-[40px]" />
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[22px] text-center tracking-[-0.44px] w-full">
              <p className="mb-0">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">내시경 설명 및 동의서 작성</span>
                <span className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal">이</span>
              </p>
              <p>모두 마무리 되었습니다!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 의사 아바타 이미지 (2D) */}
      <div className="absolute bottom-[84px] h-[358.75px] left-[calc(50%+3.768px)] translate-x-[-50%] w-[255.538px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt="Doctor Avatar"
            className="absolute h-[278.88%] left-[-140.95%] max-w-none top-[-53.83%] w-[391.57%]"
            src={imgDoctorAvatar}
          />
        </div>
      </div>

      {/* 툴팁 (말풍선) */}
      <div className="absolute h-[72.449px] left-[16.26px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0)] top-[632px] w-[153px]">
        <div className="absolute bg-[#111111] box-border content-stretch flex gap-[10px] items-center justify-center left-0 p-[10px] rounded-[8px] top-0">
          <div className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium leading-[1.4] relative shrink-0 text-[14px] text-center text-nowrap text-white tracking-[-0.28px] whitespace-pre">
            <p className="mb-0">AI 의사에게 </p>
            <p>궁금한 점을 물어보세요</p>
          </div>
        </div>
        {/* 말풍선 꼬리 */}
        <div className="absolute left-[25.62px] top-[52.57px] size-[20.883px] rotate-0">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
            <path d="M3 2L10.5 15L18 2" fill="#111111" />
          </svg>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-0 content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.89px] to-[#f0f3ff] w-[360px]">
        <div className="bg-white box-border content-stretch flex gap-[16px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={handleAdditionalInquiry}
            className="basis-0 bg-[#bcceff] box-border content-stretch flex gap-[10px] grow h-[60px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#4472e4] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              추가 문의하기
            </p>
          </button>
          <button
            onClick={handleComplete}
            className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              완료
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
