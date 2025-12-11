/**
 * 건강 상태 - 완료 화면
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { usePatientStore } from '@/lib/store/patient-store';
import { useFontSizeStore } from '@/lib/store/font-size-store';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import imgCheckCircle from '@/assets/icon-check-circle.svg';
import imgDoctorTooltip from '@/assets/doctor-tooltip.webp';
import imgTooltipPointer from '@/assets/tooltip-pointer.svg';
import imgIconSize from '@/assets/icon-size.webp';

export function HealthComplete() {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { patientData } = usePatientStore();
  const { fontSize, toggleFontSize } = useFontSizeStore();
  const fontSizeLabel = fontSize === 'normal' ? '' : fontSize === 'large' ? ' (L)' : ' (XL)';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 페이지 진입 시 음성 안내 재생
  useEffect(() => {
    let isMounted = true;
    const audioFile = language === 'ko' ? '/audio/complete_outro.wav' : '/audio/complete_outro.en.wav';
    const audio = new Audio(audioFile);

    audio.addEventListener('canplaythrough', () => {
      if (isMounted) {
        audioRef.current = audio;
        audio.play().catch((err) => {
          console.log('[HealthComplete] Audio play failed:', err.message);
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

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      {/* 헤더 */}
      <div className="flex items-center pb-[12px] pt-[32px] px-[16px]">
        <div className="flex gap-[4px] grow h-[36px] items-center">
          <div className="w-[24px] h-[24px]" />
        </div>
        <button
          onClick={toggleFontSize}
          className="flex gap-[4px] items-center p-[8px]"
        >
          <img src={imgIconSize} alt="" className="w-[20px] h-[20px]" />
          <p className="font-bold text-scale-14 text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
            {t('common.sizeAdjust')}{fontSizeLabel}
          </p>
        </button>
      </div>

      <ScrollableContainer>
        {/* 메인 영역 */}
        <div className="min-h-[160px] flex flex-col gap-[10px] items-center justify-center p-[20px]">
          <img src={imgCheckCircle} alt="" className="w-[40px] h-[40px]" />
          <div className="text-scale-23 text-[#222222] text-center tracking-[-0.46px] leading-[1.3]">
            <p>
              <span className="font-bold">{t('healthComplete.title1')}</span>
            </p>
            <p>{t('healthComplete.title2')}</p>
          </div>
        </div>

        {/* 예약 정보 카드 */}
        <div className="flex flex-col items-center px-[16px]">
          <div className="bg-white border border-[#dddddd] rounded-[10px] flex flex-col gap-[16px] items-center px-[16px] py-[24px] w-full">
            {/* 카드 헤더 */}
            <div className="flex gap-[8px] items-center w-full">
              <p className="flex-1 font-bold text-scale-18 text-[#111111] tracking-[-0.36px] leading-[1.4]">
                {t('healthComplete.appointmentInfo')}
              </p>
              <p className="font-medium text-scale-14 text-[#6490ff] tracking-[-0.28px]">
                {t('healthComplete.consultationNeeded')}
              </p>
            </div>

            {/* 정보 목록 */}
            <div className="flex flex-col gap-[8px] w-full">
              <div className="bg-[#f0f3ff] flex gap-[10px] p-[16px] rounded-[8px]">
                <p className="font-bold text-scale-16 text-[#111111] tracking-[-0.32px] w-[calc(66px*var(--font-scale,1))] shrink-0">
                  {t('home.patientInfo')}
                </p>
                <div className="w-px self-stretch bg-[#d8d8d8] shrink-0" />
                <div className="flex-1 flex flex-wrap gap-x-[10px] text-scale-16 text-[#111111] tracking-[-0.32px]">
                  <p>{patientData?.name}</p>
                  <p>{patientData?.birthDate}</p>
                </div>
              </div>

              <div className="bg-[#f0f3ff] flex gap-[10px] p-[16px] rounded-[8px]">
                <p className="font-bold text-scale-16 text-[#111111] tracking-[-0.32px] w-[calc(66px*var(--font-scale,1))] shrink-0">
                  {t('home.hospital')}
                </p>
                <div className="w-px self-stretch bg-[#d8d8d8] shrink-0" />
                <p className="flex-1 text-scale-16 text-[#111111] tracking-[-0.32px] break-words">
                  {patientData?.appointment?.hospitalName}
                </p>
              </div>

              <div className="bg-[#f0f3ff] flex gap-[10px] p-[16px] rounded-[8px]">
                <p className="font-bold text-scale-16 text-[#111111] tracking-[-0.32px] w-[calc(66px*var(--font-scale,1))] shrink-0">
                  {t('home.examDate')}
                </p>
                <div className="w-px self-stretch bg-[#d8d8d8] shrink-0" />
                <p className="flex-1 text-scale-16 text-[#111111] tracking-[-0.32px]">
                  {patientData?.appointment?.examinationDate}
                </p>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="text-scale-14 text-[#111111] text-center tracking-[-0.28px] leading-[1.4]">
              <p>{t('home.examConfirmed')}</p>
              <p>{t('home.followGuidance')}</p>
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
              <p className="font-medium text-scale-14 text-white text-center tracking-[-0.28px]">
                {t('healthComplete.aiConsultation')}
              </p>
            </div>
            <div className="h-[21px] w-[53px] mb-[-8px]">
              <img src={imgTooltipPointer} alt="" className="w-full h-full" />
            </div>
          </div>

          {/* 하단 버튼 */}
          <div
            className="bg-[#f0f3ff] flex gap-[16px] items-end justify-center px-[16px] py-[8px] w-full"
            style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
          >
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current = null;
                }
                navigate('/consultation/ai');
              }}
              className="flex-1 bg-[#bcceff] h-[56px] px-[12px] rounded-[8px] flex items-center justify-center shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]"
            >
              <p className="font-bold text-scale-16 text-[#446fdd] tracking-[-0.32px] leading-[1.2] text-center">
                {t('healthComplete.additionalConsultation')}
              </p>
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current = null;
                }
                navigate('/');
              }}
              className="flex-1 bg-[#6490ff] h-[56px] px-[12px] rounded-[8px] flex items-center justify-center shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)]"
            >
              <p className="font-bold text-scale-16 text-white tracking-[-0.32px] leading-[1.2] text-center">
                {t('common.home')}
              </p>
            </button>
          </div>
        </div>
      </ScrollableContainer>
    </div>
  );
}
