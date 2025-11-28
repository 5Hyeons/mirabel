/**
 * 진입화면 (예약 확인)
 * Figma Node ID: 77-6188
 * URL: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-6188&m=dev
 *
 * 이 파일은 Figma에서 자동 추출된 코드를 기반으로 작성되었습니다.
 * 실제 사용 시 이미지 경로와 상태 관리를 적절히 수정하세요.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePatientStore } from '@/lib/store/patient-store';

// 이미지 assets (public/images/ 폴더)
const imgDoctorAvatar = "/images/doctor-avatar.png";
const imgIconArrowRight = "/images/icon-arrow-right.svg";
const imgIconGlobe = "/images/icon-globe.svg";

// 아이콘 컴포넌트
function IconArrowRightSmallMono({ className }: { className?: string }) {
  return (
    <div className={className} data-name="icon-arrow-right-small-mono">
      <div className="absolute inset-[16.3%_30.36%_16.25%_30.3%]">
        <img alt="" className="block max-w-none size-full" src={imgIconArrowRight} />
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { loading, error, patientData, loadPatientData } = usePatientStore();

  useEffect(() => {
    // Mock token (실제로는 URL에서 추출: /p/[token])
    const token = 'mock-token-123';
    loadPatientData(token);
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#6490ff]">
        <div className="text-white text-2xl">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-5">
        <h1 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h1>
        <p className="text-center mb-4">{error}</p>
        <button
          onClick={() => loadPatientData('mock-token-123')}
          className="bg-[#6490ff] text-white px-6 py-3 rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!patientData) return null;

  return (
    <div className="bg-[#6490ff] overflow-clip relative rounded-[8px] w-full h-full" data-name="예약 확인 성공" data-node-id="77:6188">
      {/* 의사 아바타 이미지 (배경) */}
      <div className="absolute h-[242.317px] left-[calc(62.5%+9.664px)] top-[95.55px] translate-x-[-50%] w-[262.672px]" data-name="_0036 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            alt="Doctor Avatar"
            src={imgDoctorAvatar}
            width={929}
            height={929}
            className="absolute max-w-none"
            style={{
              height: '383.53%',
              width: '353.82%',
              left: '-95.31%',
              top: '-127.61%',
            }}
            priority
          />
        </div>
      </div>

      {/* 헤더 (언어 변경 버튼) */}
      <div className="absolute content-stretch flex flex-col h-[100px] items-center justify-end left-0 top-0 w-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <div className="flex-1" />
          <button
            className="relative shrink-0 size-[24px]"
            aria-label="언어 변경"
            onClick={() => {/* TODO: 언어 변경 모달 */}}
          >
            <img alt="" className="block max-w-none size-full" src={imgIconGlobe} />
          </button>
        </div>
      </div>

      {/* 제목 */}
      <div className="absolute box-border content-stretch flex gap-[10px] items-center justify-center left-0 p-[20px] top-[100px] w-full">
        <div className="basis-0 font-['Noto_Sans_KR:Medium',_sans-serif] font-medium grow leading-[0] min-h-px min-w-px relative shrink-0 text-[0px] text-white tracking-[-0.48px]">
          <p className="leading-[1.4] mb-0 text-[24px]">안녕하세요.</p>
          <p className="leading-[1.4] mb-0 text-[24px]">
            <span>온라인 </span>
            <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold text-white">위/대장 내시경 </span>
          </p>
          <p className="leading-[1.4] text-[24px]">
            <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold text-white">사전교육</span>입니다.
          </p>
        </div>
      </div>

      {/* 예약 정보 카드 */}
      <div className="absolute bg-white border border-[#dddddd] border-solid box-border content-stretch flex flex-col gap-[16px] items-center justify-center left-4 right-4 px-[16px] py-[24px] rounded-[10px] top-[347.5px]">
        {/* 카드 타이틀 */}
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <div className="basis-0 flex flex-col font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#111111] text-[18px] tracking-[-0.36px]">
            <p className="leading-[1.4]">예약 정보</p>
          </div>
        </div>

        {/* 환자 정보 */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[10px] items-center p-[16px] relative rounded-[8px] shrink-0 w-full">
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#111111] text-[16px] tracking-[-0.32px] w-[66px]">
              환자 정보
            </p>
            <div className="flex flex-row items-center self-stretch">
              <div className="bg-[#d8d8d8] h-full shrink-0 w-px" />
            </div>
            <p className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              {patientData.name}
            </p>
            <p className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              {patientData.birthDate}
            </p>
          </div>

          {/* 예약 병원 */}
          <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[10px] items-center p-[16px] relative rounded-[8px] shrink-0 w-full">
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#111111] text-[16px] tracking-[-0.32px] w-[66px]">
              예약 병원
            </p>
            <div className="flex flex-row items-center self-stretch">
              <div className="bg-[#d8d8d8] h-full shrink-0 w-px" />
            </div>
            <p className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              {patientData.appointment.hospitalName}
            </p>
          </div>

          {/* 검사일 */}
          <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[10px] items-center p-[16px] relative rounded-[8px] shrink-0 w-full">
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#111111] text-[16px] tracking-[-0.32px] w-[66px]">
              검사일
            </p>
            <div className="flex flex-row items-center self-stretch">
              <div className="bg-[#d8d8d8] h-full shrink-0 w-px" />
            </div>
            <p className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              {patientData.appointment.examinationDate}
            </p>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[13.5px] text-center tracking-[-0.0px] w-full">
          <p className="mb-0">수면내시경 검사 예약이 정상적으로 확인되었습니다. </p>
          <p>검사 당일 안내사항을 준수해 주세요.</p>
        </div>

        {/* 검사 설명 보기 버튼 */}
        <button
          onClick={() => router.push('/examination/doctor-intro')}
          className="bg-[#6490ff] box-border content-stretch flex gap-[4px] h-[56px] items-center justify-center p-[20px] relative rounded-[8px] shrink-0 w-full active:scale-95 transition-transform"
        >
          <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
            검사 설명 보기
          </p>
          <IconArrowRightSmallMono className="overflow-clip relative shrink-0 size-[24px]" />
        </button>
      </div>
    </div>
  );
}
