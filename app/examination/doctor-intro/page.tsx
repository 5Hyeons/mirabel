/**
 * 검사 안내 - 의사 소개
 * Figma Node ID: 77-9033
 * URL: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9033&m=dev
 */

'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePatientStore } from '@/lib/store/patient-store';

// 이미지 assets
const imgDoctorPhoto = "/images/doctor-photo.png";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";

export default function DoctorIntro() {
  const router = useRouter();
  const { patientData } = usePatientStore();

  if (!patientData) {
    router.push('/');
    return null;
  }

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] size-full min-h-screen" data-name="검사안내" data-node-id="77:9033">
      {/* 상단 헤더 */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-[360px]">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => router.back()}
            className="relative shrink-0 size-[24px]"
            aria-label="뒤로가기"
          >
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>

          {/* 페이지 제목 */}
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            검사 설명서
          </p>

          {/* 홈 버튼 */}
          <button
            onClick={() => router.push('/')}
            className="relative shrink-0 size-[24px]"
            aria-label="홈으로"
          >
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[16px] top-[116px] w-[328px]">
        {/* 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="leading-[1.4] mb-0">
                <span>이번 </span>
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">[내시경 검사]</span>
                <span>는 </span>
              </p>
              <p className="leading-[1.4]">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">박기호 원장님</span>
                <span>이 진행합니다. </span>
              </p>
            </div>
          </div>
        </div>

        {/* 의사 정보 카드 */}
        <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[16px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 w-full">
          {/* 의료진 정보 */}
          <div className="flex flex-col font-['Noto_Sans_KR:Medium',_sans-serif] font-medium justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#666666] text-[16px] tracking-[-0.32px] w-full">
            <p className="leading-[1.4] mb-0">의료진 : 박기호 원장</p>
            <p className="leading-[1.4]">
              <span>검사일자 : </span>
              {patientData.appointment.examinationDate}
            </p>
          </div>

          {/* 의사 사진 */}
          <div className="aspect-[768/580] relative rounded-[12.952px] shrink-0 w-full overflow-hidden">
            <Image
              alt="박기호 원장님"
              src={imgDoctorPhoto}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 360px) 100vw, 328px"
            />
          </div>
        </div>
      </div>

      {/* 하단 버튼 (그라데이션 배경) */}
      <div className="absolute bg-gradient-to-b bottom-[-1px] content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.5px] to-[#f0f3ff] w-[360px]">
        <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={() => router.push('/examination/procedure')}
            className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              확인
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
