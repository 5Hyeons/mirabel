/**
 * 검사 안내 - 검사 설명 (페이지네이션)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import imgIconArrowRight from '@/assets/icon-arrow-right.svg';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconHome from '@/assets/icon-home.svg';

interface ProcedureSection {
  title: string;
  content: string;
}

interface ProcedurePage {
  sections: ProcedureSection[];
}

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
  const { t, language } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [procedurePages, setProcedurePages] = useState<ProcedurePage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProcedureData = async () => {
      try {
        const response = await fetch(`/mock-data.${language}.json`);
        const data = await response.json();
        setProcedurePages(data.procedurePages || []);
      } catch (error) {
        console.error('Failed to load procedure data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProcedureData();
  }, [language]);

  const totalPages = procedurePages.length;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/consent/checkbox');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">{t('common.loading')}</div>
      </div>
    );
  }

  if (procedurePages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">{t('examination.loadError')}</div>
      </div>
    );
  }

  const currentSections = procedurePages[currentPage].sections;

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] w-full h-full">
      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-0 right-0 top-[116px] px-4">
        {/* 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col font-['Noto_Sans_KR:Regular',_sans-serif] font-normal gap-[8px] items-start leading-[0] relative shrink-0 w-full">
            <div className="relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="leading-[1.4] mb-0">
                {t('procedure.title1')}
              </p>
              <p className="leading-[1.4]">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">{t('procedure.title2')}</span>
              </p>
            </div>
            <div className="leading-[1.4] relative shrink-0 text-[#666666] text-[14px] tracking-[-0.28px] w-full">
              <p className="mb-0">{t('procedure.duration1')}</p>
              <p>{t('procedure.duration2')}</p>
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
            {t('procedure.manual')}
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
              {t('common.next')}
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
