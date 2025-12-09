/**
 * 건강 상태 안내 화면
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/lib/store/patient-store';
import { useTranslation } from '@/lib/i18n';
import { HealthCheckData } from '@/lib/api/types';
import { HealthCheckHeader } from '@/components/health-check/HealthCheckHeader';
import { ProgressIndicator } from '@/components/health-check/ProgressIndicator';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import { BottomButton } from '@/components/shared/BottomButton';
import imgDoctorAvatar from '@/assets/doctor-avatar.webp';

export function HealthWarning() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { healthCheckState } = usePatientStore();
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckData | null>(null);
  const [showDanger, setShowDanger] = useState(false);
  const [showCaution, setShowCaution] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/mock-data.${language}.json`);
        const data = await response.json();
        setHealthCheckData(data.healthCheck);

        const selectedItems = healthCheckState || [];
        const hasDanger = data.healthCheck.items
          .filter((item: any) => selectedItems.includes(item.id))
          .some((item: any) => item.category === 'danger');
        const hasCaution = data.healthCheck.items
          .filter((item: any) => selectedItems.includes(item.id))
          .some((item: any) => item.category === 'caution');

        setShowDanger(hasDanger);
        setShowCaution(hasCaution);
      } catch (error) {
        console.error('Failed to load health check data:', error);
      }
    };

    loadData();
  }, [healthCheckState, language]);

  if (!healthCheckData) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      <div>
        <HealthCheckHeader />
        <ProgressIndicator current={1} total={3} />
      </div>

      <ScrollableContainer>
        {/* 의사 인사 영역 - DoctorGreeting과 동일한 스타일 */}
        <div className="h-[152px] w-full relative mb-[24px]">
          <div className="absolute bottom-0 right-0 w-[180px] h-[160px]">
            <img
              alt="Dr.Lee"
              src={imgDoctorAvatar}
              className="w-full h-full object-contain object-bottom"
            />
          </div>

          <div className="absolute left-0 top-0 w-[calc(100%-180px)] pl-[20px] pt-[10px] flex flex-col gap-[15px]">
            <div className="text-[20px] text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
              <p>{t('healthWarning.title1')}</p>
              <p>{t('healthWarning.title2')}</p>
              <p>{t('healthWarning.title3')}</p>
            </div>

            <p className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
              {t('healthWarning.desc1')}
              <br />
              {t('healthWarning.desc2')}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center p-[16px] gap-[16px]">
          <div className="bg-white border border-[#dddddd] border-solid rounded-[8px] p-[16px] flex flex-col gap-[24px] w-full">
            {/* 위험 메시지 */}
            {showDanger && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-start">
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#fd4848] tracking-[-0.32px] leading-[1.5]">
                    {t('healthWarning.danger')}
                  </p>
                  <p className="flex-1 font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                    🫀 {t('healthWarning.heartDisease')}
                  </p>
                </div>
                <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                  {t('healthWarning.heartDesc')}
                </p>
              </div>
            )}

            {/* 주의 메시지 */}
            {showCaution && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-start">
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#fd4848] tracking-[-0.32px] leading-[1.5]">
                    {t('healthWarning.caution')}
                  </p>
                  <p className="flex-1 font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                    🫁 {t('healthWarning.respiratoryDisease')}
                  </p>
                </div>
                <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                  {t('healthWarning.respiratoryDesc')}
                </p>
              </div>
            )}
          </div>

          <BottomButton
            text={t('common.confirm')}
            onClick={() => navigate('/health-check/recording')}
            active={true}
          />
        </div>
      </ScrollableContainer>
    </div>
  );
}
