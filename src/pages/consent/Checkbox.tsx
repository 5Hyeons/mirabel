/**
 * 동의서 - 체크박스 동의
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/lib/store/patient-store';
import { apiClient } from '@/lib/api/mock-api';
import imgDocumentIcon from '@/assets/icon-document.png';
import imgCheckIcon from '@/assets/icon-check.svg';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconHome from '@/assets/icon-home.svg';

export function ConsentCheckbox() {
  const navigate = useNavigate();
  const { patientData } = usePatientStore();
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!patientData) {
      navigate('/');
    }
  }, [patientData, navigate]);

  if (!patientData) {
    return null;
  }

  const handleSubmit = async () => {
    if (agreed === null) {
      alert('동의 여부를 선택해주세요.');
      return;
    }

    if (agreed === false) {
      const confirm = window.confirm(
        '추가 검사를 동의하지 않으면 검사 진행에 제약이 있을 수 있습니다. 계속하시겠습니까?'
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      await apiClient.saveCheckboxConsent({
        patientId: patientData.patientId,
        agreed,
        consentText: '내시경 검사에서 이상이 발견되면...',
        timestamp: new Date().toISOString()
      });

      navigate('/consent/signature');
    } catch {
      alert('동의서 저장에 실패했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] w-full h-full">
      {/* 상단 헤더 */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={() => navigate(-1)} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            동의서 작성
          </p>
          <button onClick={() => navigate('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[116px] px-4">
        {/* 아이콘 및 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="relative shrink-0 size-[60px]">
            <img alt="" src={imgDocumentIcon} width={60} height={60} className="object-cover pointer-events-none" />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="font-['Noto_Sans_KR:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="mb-0">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">추가 검사 및 비용 발생</span>
                <span>에 대한 </span>
              </p>
              <p>동의가 필요해요</p>
            </div>
          </div>
        </div>

        {/* 동의 내용 */}
        <div className="border-[#6490ff] border-[0px_0px_0px_2px] border-solid box-border content-stretch flex flex-col gap-[8px] items-start leading-[1.5] not-italic px-[20px] py-0 relative shrink-0 text-[16px] tracking-[-0.32px] w-full">
          <div className="content-stretch flex font-['Pretendard:Bold',_sans-serif] gap-[8px] items-start relative shrink-0 w-full">
            <p className="relative shrink-0 text-[#6490ff] text-nowrap whitespace-pre">필수</p>
            <p className="basis-0 grow min-h-px min-w-px relative shrink-0 text-black">
              추가 검사 및 비용발생 동의
            </p>
          </div>
          <p className="font-['Pretendard:Medium',_sans-serif] relative shrink-0 text-black w-full">
            내시경 검사에서 이상이 발견되면 정확한 진단을 위하여 즉시 조직검사, 헬리코박터 검사 등 추가검사를 할 수 있습니다. 이때 추가 비용이 발생하게 됩니다. 내시경 검사 중 조직 검사 또는 헬리코박터 검사를 시행하는 것에 동의하십니까?
          </p>
        </div>

        {/* 체크박스 옵션 */}
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          {/* 예 (필수) */}
          <button
            onClick={() => setAgreed(true)}
            className="basis-0 content-stretch flex gap-[10.877px] grow items-center min-h-px min-w-px relative shrink-0"
          >
            <div className={`${agreed === true ? 'bg-[#6490ff]' : 'bg-[#eaeaea]'} overflow-clip relative rounded-[3.347px] shrink-0 size-[28.448px]`}>
              {agreed === true && (
                <div className="absolute left-[calc(50%+0.004px)] overflow-clip size-[20.081px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                  <div className="absolute inset-[30.1%_19.69%_28.33%_20.1%]">
                    <img alt="" className="block max-w-none size-full" src={imgCheckIcon} />
                  </div>
                </div>
              )}
            </div>
            <p className="basis-0 font-['Pretendard:Regular',_sans-serif] grow leading-[1.5] min-h-px min-w-px not-italic relative shrink-0 text-[16.734px] text-black text-left tracking-[-0.3347px]">
              예 (필수)
            </p>
          </button>

          {/* 아니오 */}
          <button
            onClick={() => setAgreed(false)}
            className="basis-0 content-stretch flex gap-[10.877px] grow items-center min-h-px min-w-px relative shrink-0"
          >
            <div className={`${agreed === false ? 'bg-[#6490ff]' : 'bg-[#eaeaea]'} overflow-clip relative rounded-[3.347px] shrink-0 size-[28.448px]`}>
              {agreed === false && (
                <div className="absolute left-[calc(50%+0.004px)] overflow-clip size-[20.081px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                  <div className="absolute inset-[30.1%_19.69%_28.33%_20.1%]">
                    <img alt="" className="block max-w-none size-full" src={imgCheckIcon} />
                  </div>
                </div>
              )}
            </div>
            <p className="basis-0 font-['Pretendard:Regular',_sans-serif] grow leading-[1.5] min-h-px min-w-px not-italic relative shrink-0 text-[16.734px] text-black text-left tracking-[-0.3347px]">
              아니오
            </p>
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-[-1px] content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.55px] to-[#f0f3ff] w-full">
        <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          <button
            onClick={handleSubmit}
            disabled={agreed === null || submitting}
            className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 disabled:opacity-50 active:scale-95 transition-transform"
          >
            <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
              {submitting ? '저장 중...' : '필수 동의하기'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
