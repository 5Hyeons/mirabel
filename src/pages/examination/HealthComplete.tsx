/**
 * 건강 상태 - 완료 화면
 */

import { useNavigate } from 'react-router-dom';
import imgCheckCircle from '@/assets/icon-check-circle.svg';
import imgDoctorTooltip from '@/assets/doctor-tooltip.png';
import imgTooltipPointer from '@/assets/tooltip-pointer.svg';
import imgIconSize from '@/assets/icon-size.png';

export function HealthComplete() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center pb-[12px] pt-[32px] px-[16px]">
        <div className="flex gap-[4px] grow h-[36px] items-center">
          <div className="w-[24px] h-[24px]" />
        </div>
        <div className="flex gap-[4px] items-center p-[8px]">
          <img src={imgIconSize} alt="" className="w-[20px] h-[20px]" />
          <p className="font-bold text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
            크기 조절
          </p>
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="h-[160px] flex flex-col gap-[10px] items-center justify-center p-[20px]">
        <img src={imgCheckCircle} alt="" className="w-[40px] h-[40px]" />
        <div className="text-[23px] text-[#222222] text-center tracking-[-0.46px] leading-[1.3]">
          <p>
            <span className="font-bold">내시경 설명 및 동의서 작성</span>
            <span>이</span>
          </p>
          <p>모두 마무리 되었습니다!</p>
        </div>
      </div>

      {/* 예약 정보 카드 */}
      <div className="flex flex-col items-center px-[16px]">
        <div className="bg-white border border-[#dddddd] rounded-[10px] flex flex-col gap-[16px] items-center px-[16px] py-[24px] w-full">
          {/* 카드 헤더 */}
          <div className="flex gap-[8px] items-center w-full">
            <p className="flex-1 font-bold text-[18px] text-[#111111] tracking-[-0.36px] leading-[1.4]">
              예약 정보
            </p>
            <p className="font-medium text-[14px] text-[#6490ff] tracking-[-0.28px]">
              대면상담필요
            </p>
          </div>

          {/* 정보 목록 */}
          <div className="flex flex-col gap-[8px] w-full">
            <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
              <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
                환자 정보
              </p>
              <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
              <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
                홍길동
              </p>
              <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
                1990.00.00
              </p>
            </div>

            <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
              <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
                예약 병원
              </p>
              <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
              <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
                시흥 마음속 내과
              </p>
            </div>

            <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
              <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
                검사일
              </p>
              <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
              <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
                2025. 11.24 (목) 오전 11시
              </p>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="text-[14px] text-[#111111] text-center tracking-[-0.28px] leading-[1.4]">
            <p>수면내시경 검사 예약이 확인되었습니다.</p>
            <p>검사 당일 안내사항을 꼭 지켜해 주세요.</p>
          </div>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="mt-auto bg-gradient-to-b from-transparent to-[#f0f3ff] flex flex-col items-start w-full">
        {/* 툴팁 영역 */}
        <div className="flex flex-col items-start px-[16px] pb-[8px]">
          <div className="h-[115px] w-[108px] mb-[-8px] overflow-hidden">
            <img
              alt="Dr.Lee"
              src={imgDoctorTooltip}
              className="w-full h-full object-contain object-bottom"
            />
          </div>
          <div className="bg-[#111111] rounded-[8px] p-[10px] mb-[-8px]">
            <p className="font-medium text-[14px] text-white text-center tracking-[-0.28px] whitespace-nowrap">
              AI 의료 상담이 필요하신가요?
            </p>
          </div>
          <div className="h-[21px] w-[53px] mb-[-8px]">
            <img src={imgTooltipPointer} alt="" className="w-full h-full" />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-[16px] h-[100px] items-start justify-center px-[16px] pt-[8px] pb-[24px] w-full">
          <button
            onClick={() => navigate('/consultation/ai')}
            className="flex-1 bg-[#bcceff] h-[56px] rounded-[8px] flex items-center justify-center shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]"
          >
            <p className="font-bold text-[16px] text-[#446fdd] tracking-[-0.32px]">
              AI 추가 상담
            </p>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#6490ff] h-[56px] rounded-[8px] flex items-center justify-center shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]"
          >
            <p className="font-bold text-[16px] text-white tracking-[-0.32px]">
              홈으로
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
