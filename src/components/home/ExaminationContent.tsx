import { useEffect, useState } from 'react';
import { ExaminationType } from '@/lib/api/types';
import { ContentBlock } from './ContentBlock';
import { useTranslation } from '@/lib/i18n';

interface ExaminationContentProps {
  examinationType: string;
  onCheckboxComplete?: (complete: boolean) => void;
}

export function ExaminationContent({ examinationType, onCheckboxComplete }: ExaminationContentProps) {
  const { t, language } = useTranslation();
  const [content, setContent] = useState<ExaminationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkboxes, setCheckboxes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(`/mock-data.${language}.json`);
        const data = await response.json();
        setContent(data.examinationTypes[examinationType]);
      } catch (error) {
        console.error('Failed to load examination content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [examinationType, language]);

  useEffect(() => {
    // 필수 체크박스가 모두 선택됐는지 확인
    const required = ['tissue-yes', 'dental-confirm', 'warning-understood', 'consent-yes'];
    const allSelected = required.every(key => Object.values(checkboxes).includes(key));
    onCheckboxComplete?.(allSelected);
  }, [checkboxes, onCheckboxComplete]);

  const handleCheckboxChange = (sectionIndex: number, optionId: string) => {
    setCheckboxes(prev => ({
      ...prev,
      [`section-${sectionIndex}`]: optionId
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[8px] p-[16px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]">
        <p className="text-center text-[#666666]">{t('common.loading')}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-white rounded-[8px] p-[16px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]">
        <p className="text-center text-[#666666]">{t('examination.loadError')}</p>
      </div>
    );
  }

  // consent-checkbox 섹션 분리
  const mainSections = content.sections.filter(s => s.type !== 'consent-checkbox');
  const consentSection = content.sections.find(s => s.type === 'consent-checkbox');

  return (
    <div className="flex flex-col gap-[24px] w-full">
      {/* 메인 카드 */}
      <div className="bg-white border border-[#dddddd] border-solid rounded-[8px] p-[16px] flex flex-col gap-[24px]">
        <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-18 text-[#111111] tracking-[-0.36px] leading-[1.4]">
          {t('examination.consentForm')}
        </p>

        {mainSections.map((section, index) => (
          <ContentBlock
            key={index}
            section={section}
            selectedValue={checkboxes[`section-${index}`]}
            onCheckboxChange={(optionId) => handleCheckboxChange(index, optionId)}
          />
        ))}
      </div>

      {/* 추가 검사 동의 (별도 영역) */}
      {consentSection && (
        <ContentBlock
          section={consentSection}
          selectedValue={checkboxes['section-consent']}
          onCheckboxChange={(optionId) => {
            setCheckboxes(prev => ({
              ...prev,
              'section-consent': optionId
            }));
          }}
        />
      )}
    </div>
  );
}
