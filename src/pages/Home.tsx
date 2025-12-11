/**
 * 통합 홈 페이지 (검사 정보 + 의사 정보 + 검사 내용)
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/lib/store/patient-store';
import { useTranslation } from '@/lib/i18n';
import { useLanguageStore } from '@/lib/store/language-store';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import { BottomButton } from '@/components/shared/BottomButton';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PatientInfoSection } from '@/components/home/PatientInfoSection';
import { DoctorInfoSection } from '@/components/home/DoctorInfoSection';
import { ExaminationContent } from '@/components/home/ExaminationContent';

export function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { loading, error, patientData, loadPatientData } = usePatientStore();
  const [checkboxComplete, setCheckboxComplete] = useState(false);

  useEffect(() => {
    const token = 'mock-token-123';
    loadPatientData(token);
  }, [loadPatientData, language]);

  useEffect(() => {
    // 스크롤 위치 초기화
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#6490ff]">
        <div className="text-white text-2xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-5">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{t('common.error')}</h1>
        <p className="text-center mb-4">{error}</p>
        <button
          onClick={() => loadPatientData('mock-token-123')}
          className="bg-[#6490ff] text-white px-6 py-3 rounded-lg"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#666666]">{t('home.loadError')}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      <HomeHeader />

      <ScrollableContainer>
        <div className="flex flex-col items-center p-[16px] gap-[16px]">
          <p className="font-['Noto_Sans_KR:Medium',sans-serif] font-medium text-scale-24 text-[#222222] tracking-[-0.48px] leading-[1.3] text-center w-full whitespace-pre-line">
            {t('home.title')}
          </p>

          <PatientInfoSection patientData={patientData} />
          <DoctorInfoSection patientData={patientData} />
          <ExaminationContent
            examinationType="stomach"
            onCheckboxComplete={setCheckboxComplete}
          />

          <BottomButton
            text={t('home.startButton')}
            onClick={() => navigate('/health-check')}
            active={checkboxComplete}
            disabled={!checkboxComplete}
          />
        </div>
      </ScrollableContainer>
    </div>
  );
}
