/**
 * 동의서 완료
 */

import { useNavigate } from 'react-router-dom';

const imgCheckIcon = "/images/icon-check-circle.svg";
const imgDoctorAvatar = "/images/doctor-avatar-complete.png";
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

export function ConsentComplete() {
  const navigate = useNavigate();

  const handleAdditionalInquiry = () => {
    navigate('/consultation/ai');
  };

  const handleComplete = () => {
    if (window.confirm('검사 사전교육을 완료하시겠습니까?')) {
      window.close();
    }
  };

  return (
    <div className="bg-white overflow-clip relative rounded-[8px] w-full h-full">
      {/* 상단 헤더 */}
      <div className="absolute bg-white content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={() => navigate(-1)} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            &nbsp;
          </p>
          <button onClick={() => navigate('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 완료 메시지 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[116px] px-4">
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

      {/* 의사 아바타 이미지 */}
      <div className="absolute bottom-[84px] h-[358.75px] left-[calc(50%+3.768px)] translate-x-[-50%] w-[255.538px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt="Doctor Avatar"
            src={imgDoctorAvatar}
            className="absolute max-w-none"
            style={{
              height: '278.88%',
              width: '391.57%',
              left: '-140.95%',
              top: '-53.83%',
            }}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-0 content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-0 to-[#f0f3ff] w-full">
        {/* 툴팁 */}
        <div className="relative left-0 w-full px-4 mb-5">
          <div className="relative inline-block">
            <div className="bg-[#111111] box-border content-stretch flex gap-[10px] items-center justify-center p-[10px] rounded-[8px]">
              <div className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium leading-[1.4] text-[14px] text-center text-white tracking-[-0.28px]">
                <p className="mb-0">AI 의사에게 </p>
                <p className="mb-0">궁금한 점을 물어보세요</p>
              </div>
            </div>
            <div className="absolute left-[25px] -bottom-[10px]">
              <svg width="21" height="12" viewBox="0 0 21 12" fill="none">
                <path d="M0 0L10.5 12L21 0" fill="#111111" />
              </svg>
            </div>
          </div>
        </div>
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
