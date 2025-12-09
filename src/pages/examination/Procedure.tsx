/**
 * 검사 안내 - 검사 설명 (페이지네이션)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgIconArrowRight from '@/assets/icon-arrow-right.svg';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconHome from '@/assets/icon-home.svg';

const examinationPages = [
  {
    sections: [
      {
        title: '검사 개요',
        content: '의식하 진정, 즉 수면 위내시경 검사는 주사로 약물을 투여하여 환자를 어느 정도의 진정 상태에 도달하게 한 후 검사를 함으로써 불편함을 줄여주는 장점이 있습니다. 그러나 환자를 완전히 마취한 상태로 하는 검사는 아니며, 환자의 협조가 가능한 진정 상태에서 검사를 진행합니다.'
      },
      {
        title: '진정 효과의 개인차',
        content: '환자에 따라서 약물에 대한 반응이 다르기 때문에 적절한 양의 약제를 사용했더라도 수면이나 진정 상태가 충분히 이루어지지 않거나, 오히려 협조도가 낮아져 검사 자체가 어려워질 수 있습니다.'
      },
      {
        title: '가능한 부작용',
        content: '부작용으로는 호흡곤란, 저산소증 같은 호흡기계 문제,맥박이 빨라지는 심혈관계 반응, 낙상 등이 생길 수 있습니다. 대부분 특별한 조치 없이 좋아지지만, 드물게는 호흡이나 심장이 멈춰서 생명이 위험한 경우가 있을 수 있으며, 응급조치가 필요할 수도 있습니다.'
      }
    ]
  },
  {
    sections: [
      {
        title: '주의가 필요한 환자',
        content: '특히 호흡기 질환으로 폐 기능에 장애가 있거나,신장이나 심장질환이 있는 경우에는 수면내시경 시 주의가 필요합니다.'
      },
      {
        title: '검사 후 주의사항',
        content: '수면내시경 후에는 완전한 회복과 안정이 필요합니다. 검사 당일에는 운전을 하지 말고, 중요한 약속이나 업무는 피하는 것이 좋습니다. 또한 낙상 등 위험을 예방하기 위해 반드시 보호자와 함께 귀가하셔야 합니다.'
      },
      {
        title: '동의서 서명 안내',
        content: '본인 또는 보호자는 수면내시경의 필요성과 검사 과정, 검사 후 발생할 수 있는 합병증에 대한 설명을 들었으며, 그 내용을 충분히 이해했습니다. 이에 따라 본인은 검사와 처치를 받기를 원하여 병원에 서면으로 신청합니다.'
      }
    ]
  }
];

function IconArrowRightSmallMono({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-[16.3%_30.36%_16.25%_30.3%]">
        <img alt="" className="block max-w-none size-full" src={imgIconArrowRight} />
      </div>
    </div>
  );
}

export function Procedure() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = examinationPages.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/consent/checkbox');
    }
  };

  const currentSections = examinationPages[currentPage].sections;

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] w-full h-full">
      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[116px] px-4">
        {/* 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col font-['Noto_Sans_KR:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] relative shrink-0 w-full">
            <div className="relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="leading-[1.4] mb-0">
                <span>지금부터 이번 </span>
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">[내시경 검사]</span>
                <span>에 대한 </span>
              </p>
              <p className="leading-[1.4]">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">설명과 동의 절차</span>를 진행하겠습니다.
              </p>
            </div>
            <div className="leading-[1.4] relative shrink-0 text-[#666666] text-[14px] tracking-[-0.28px] w-full">
              <p className="mb-0">2-3분 정도 소요되며, </p>
              <p>예약자 본인이 꼭 듣고 숙지해야합니다.</p>
            </div>
          </div>
        </div>

        {/* 콘텐츠 카드 (스크롤 가능) */}
        <div className="bg-white box-border content-stretch flex flex-col gap-[16px] max-h-[435px] overflow-y-auto items-center p-[16px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
            {currentSections.map((section, index) => (
              <div
                key={index}
                className="content-stretch flex flex-col gap-[8px] items-start leading-[1.4] relative shrink-0 text-[16px] text-black tracking-[-0.32px] w-full"
              >
                <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold relative shrink-0 w-full">
                  {section.title}
                </p>
                <p className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal relative shrink-0 w-full">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상단 헤더 (네비게이션) */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button
            onClick={() => navigate(-1)}
            className="relative shrink-0 size-[24px]"
          >
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            검사 설명서
          </p>
          <button
            onClick={() => navigate('/')}
            className="relative shrink-0 size-[24px]"
          >
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 하단 버튼 (그라데이션 배경) */}
      <div className="absolute bg-gradient-to-b bottom-[-1px] content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.55px] to-[#f0f3ff] w-full">
        <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={handleNext}
            className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              다음
            </p>
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              {currentPage + 1} / {totalPages}
            </p>
            <IconArrowRightSmallMono className="overflow-clip relative shrink-0 size-[24px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
