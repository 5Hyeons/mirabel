import { PatientData } from '@/lib/api/types';
import { useTranslation } from '@/lib/i18n';

interface PatientInfoSectionProps {
  patientData: PatientData;
}

export function PatientInfoSection({ patientData }: PatientInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#dddddd] border-solid rounded-[10px] px-[16px] py-[24px] flex flex-col gap-[16px] w-full">
      <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[18px] text-[#111111] tracking-[-0.36px] leading-[1.4]">
        {t('home.examInfo')}
      </p>

      <div className="flex flex-col gap-[8px]">
        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
            {t('home.patientInfo')}
          </p>
          <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
          <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
            {patientData.name}
          </p>
          <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
            {patientData.birthDate}
          </p>
        </div>

        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
            {t('home.hospital')}
          </p>
          <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
          <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
            {patientData.appointment.hospitalName}
          </p>
        </div>

        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px] shrink-0">
            {t('home.examDate')}
          </p>
          <div className="w-px h-[22px] bg-[#d8d8d8] shrink-0" />
          <p className="text-[16px] text-[#111111] tracking-[-0.32px] whitespace-nowrap">
            {patientData.appointment.examinationDate}
          </p>
        </div>
      </div>

      <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[14px] text-[#111111] tracking-[-0.28px] leading-[1.4] text-center">
        {t('home.examConfirmed')}
        <br />
        {t('home.followGuidance')}
      </p>
    </div>
  );
}
