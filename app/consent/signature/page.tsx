/**
 * 동의서 - 전자 서명
 * Figma Node ID: 77-10030 (빈 캔버스), 77-10113 (서명 후)
 * URL: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-10030&m=dev
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SignatureCanvas from 'react-signature-canvas';
import { usePatientStore } from '@/lib/store/patient-store';
import { apiClient } from '@/lib/api/mock-api';

// 이미지 assets
const imgPenIcon = "/images/icon-pen.png";
const imgIconBin = "/images/icon-bin.svg";
const imgDottedLine = "/images/dotted-line.svg";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";

function IconBinMono({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-[3.58%_10.42%_7.75%_10.42%]">
        <img alt="" className="block max-w-none size-full" src={imgIconBin} />
      </div>
    </div>
  );
}

export default function ConsentSignature() {
  const router = useRouter();
  const { patientData } = usePatientStore();
  const signatureCanvasRef = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!patientData) {
      router.push('/');
    }
  }, [patientData, router]);

  if (!patientData) {
    return null;
  }

  const handleSignatureEnd = () => {
    if (signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  const handleClear = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      setHasSignature(false);
    }
  };

  const handleSubmit = async () => {
    if (!hasSignature || !signatureCanvasRef.current) {
      alert('서명을 입력해주세요.');
      return;
    }

    const signature = signatureCanvasRef.current.toDataURL('image/png');

    setSubmitting(true);
    try {
      await apiClient.saveSignature({
        patientId: patientData.patientId,
        signature,
        timestamp: new Date().toISOString()
      });

      router.push('/consent/voice');
    } catch (error) {
      alert('서명 저장에 실패했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] w-full h-full" data-name="동의" data-node-id="77:10030">
      {/* 상단 헤더 */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={() => router.back()} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            동의서 작성
          </p>
          <button onClick={() => router.push('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[116px] px-4">
        {/* 아이콘 및 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="relative shrink-0 size-[60px]">
            <Image alt="" src={imgPenIcon} width={60} height={60} className="object-cover pointer-events-none" />
          </div>
          <div className="content-stretch flex flex-col font-['Noto_Sans_KR:Regular',_sans-serif] font-normal gap-[8px] items-start relative shrink-0 w-full">
            <div className="leading-[0] relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="leading-[1.4] mb-0">검사를 진행하기 위해서는</p>
              <p className="leading-[1.4]">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">서명</span>이 필요해요
              </p>
            </div>
            <p className="leading-[1.4] relative shrink-0 text-[#666666] text-[14px] tracking-[-0.28px] w-full">
              서명 영역에 손가락으로 직접 서명해 주세요.
            </p>
          </div>
        </div>

        {/* 서명 영역 */}
        <div className="border-[#6490ff] border-[0px_0px_0px_2px] border-solid box-border content-stretch flex flex-col gap-[8px] items-start px-[20px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex font-['Pretendard:Bold',_sans-serif] gap-[8px] items-start leading-[1.5] not-italic relative shrink-0 text-[16px] tracking-[-0.32px] w-full">
            <p className="relative shrink-0 text-[#6490ff] text-nowrap whitespace-pre">필수</p>
            <p className="basis-0 grow min-h-px min-w-px relative shrink-0 text-black">
              전자 서명 입력
            </p>
          </div>

          {/* 서명 캔버스 */}
          <div className="relative h-[150px] w-full">
            <SignatureCanvas
              ref={signatureCanvasRef}
              onEnd={handleSignatureEnd}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 150,
                className: 'border-2 border-dashed border-[#6490ff] rounded-[8px] bg-white cursor-crosshair w-full'
              }}
            />
            {!hasSignature && (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Pretendard:SemiBold',_sans-serif] leading-[1.5] not-italic opacity-60 text-[#666666] text-[14px] text-nowrap tracking-[-0.28px] whitespace-pre pointer-events-none">
                서명해주세요
              </p>
            )}
          </div>

          {/* 지우기 버튼 */}
          <button
            onClick={handleClear}
            className="bg-white border-2 border-[#d7d7d7] border-solid box-border content-stretch flex gap-[4px] h-[56px] items-center justify-center p-[20px] relative rounded-[8px] shrink-0 w-full active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#666666] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              지우기
            </p>
            <IconBinMono className="overflow-clip relative shrink-0 size-[24px]" />
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-[-1px] content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.55px] to-[#f0f3ff] w-full">
        <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={handleSubmit}
            disabled={!hasSignature || submitting}
            className="basis-0 bg-[#6490ff] disabled:bg-[#666666] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shrink-0 disabled:opacity-70 active:scale-95 transition-all"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-white text-center text-nowrap tracking-[-0.32px] whitespace-pre">
              {submitting ? '저장 중...' : '다음'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
