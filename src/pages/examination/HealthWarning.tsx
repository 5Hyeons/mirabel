/**
 * 건강 상태 안내 화면
 */

import { useEffect, useState, useRef } from 'react';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // 페이지 진입 시 음성 안내 재생
  useEffect(() => {
    let isMounted = true;
    const audioFile = language === 'ko' ? '/audio/warning_notice.wav' : '/audio/warning_notice.en.wav';
    const audio = new Audio(audioFile);

    audio.addEventListener('canplaythrough', () => {
      if (isMounted) {
        audioRef.current = audio;
        audio.play().catch((err) => {
          console.log('[HealthWarning] Audio play failed:', err.message);
        });
      }
    });

    audio.load();

    return () => {
      isMounted = false;
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [language]);

  // 다음 페이지 이동
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    navigate('/health-check/recording');
  };

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
        {/* 의사 인사 영역 */}
        <div className="min-h-[152px] w-full flex mb-[16px]">
          <div className="flex-1 pl-[20px] pt-[10px] flex flex-col gap-[10px]">
            <div className="text-scale-20 text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
              <p>{t('healthWarning.title1')}</p>
              <p>{t('healthWarning.title2')}</p>
              <p>{t('healthWarning.title3')}</p>
            </div>

            <p className="text-scale-16 text-[#666666] tracking-[-0.32px] leading-[1.3]">
              {t('healthWarning.desc1')}
              <br />
              {t('healthWarning.desc2')}
            </p>
          </div>

          <div className="w-[170px] h-[160px] shrink-0 self-end">
            <img
              alt="Dr.Lee"
              src={imgDoctorAvatar}
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        </div>

        <div className="flex flex-col items-center px-[16px] gap-[16px]">
          {/* 위험 카드 */}
          {showDanger && (
            <div className="bg-white border border-[#dddddd] rounded-[8px] p-[16px] w-full">
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-center">
                  <div className="bg-[#fd4848] rounded-full px-[10px] py-[2px]">
                    <span className="text-scale-12 text-white font-semibold">
                      {t('healthWarning.danger')}
                    </span>
                  </div>
                  <p className="flex-1 font-['Pretendard:Bold',sans-serif] font-bold text-scale-16 text-black tracking-[-0.32px] leading-[1.5]">
                    🫀 {t('healthWarning.heartDisease')}
                  </p>
                </div>
                <div className="text-scale-14 text-[#4f5161] tracking-[-0.28px] leading-[2] font-medium">
                  <p><span className="font-black text-[#fd4848]">|</span>   {t('healthWarning.heartDesc1')}</p>
                  <p><span className="font-black text-[#fd4848]">|</span>   {t('healthWarning.heartDesc2')}</p>
                  <p><span className="font-black text-[#fd4848]">|</span>   {t('healthWarning.heartDesc3')}</p>
                </div>
              </div>
            </div>
          )}

          {/* 주의 카드 */}
          {showCaution && (
            <div className="bg-white border border-[#dddddd] rounded-[8px] p-[16px] w-full">
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-center">
                  <div className="bg-[#ff8e26] rounded-full px-[10px] py-[2px]">
                    <span className="text-scale-12 text-white font-semibold">
                      {t('healthWarning.caution')}
                    </span>
                  </div>
                  <p className="flex-1 font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-16 text-black tracking-[-0.32px] leading-[1.4]">
                    🫁  {t('healthWarning.respiratoryDisease')}
                  </p>
                </div>
                <div className="text-scale-14 text-[#4f5161] tracking-[-0.28px] leading-[2] font-medium">
                  <p><span className="font-black text-[#ff8e26]">|</span>   {t('healthWarning.respiratoryDesc1')}</p>
                  <p><span className="font-black text-[#ff8e26]">|</span>   {t('healthWarning.respiratoryDesc2')}</p>
                  <p><span className="font-black text-[#ff8e26]">|</span>   {t('healthWarning.respiratoryDesc3')}</p>
                </div>
              </div>
            </div>
          )}

          {/* 노란 안내 문구 */}
          <div className="bg-[#fff8d8] border border-[#fed200] rounded-[8px] p-[16px] w-full">
            <p className="text-scale-13 text-[#786300] text-center leading-[1.4] tracking-[-0.26px]">
              <span className="font-bold">⚠️</span> {t('healthCheck.unknownWarningLine1')}
              <br />
              {t('healthCheck.unknownWarningLine2')}
            </p>
          </div>

          <BottomButton
            text={t('healthWarning.nextStep')}
            onClick={handleNext}
            active={true}
          />
        </div>
      </ScrollableContainer>
    </div>
  );
}
