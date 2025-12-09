import { PatientData } from '@/lib/api/types';
import { useTranslation } from '@/lib/i18n';
import imgDoctorPhoto from '@/assets/doctor-photo.webp';

interface DoctorInfoSectionProps {
  patientData: PatientData;
}

export function DoctorInfoSection({ patientData }: DoctorInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-[#dddddd] border-solid rounded-[8px] p-[16px] flex flex-col gap-[16px] w-full">
      <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[18px] text-[#111111] tracking-[-0.36px] leading-[1.4]">
        {t('home.doctorInfo')}
      </p>

      <div className="font-['Noto_Sans_KR:Medium',sans-serif] font-medium text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.4]">
        <p>{t('home.medicalStaff')} {patientData.appointment.doctorName} {t('home.director')}</p>
        <p>{patientData.appointment.doctorSpecialty}</p>
      </div>

      <div className="w-full rounded-[12.952px] overflow-hidden" style={{ aspectRatio: '768/580' }}>
        <img
          src={imgDoctorPhoto}
          alt={`${patientData.appointment.doctorName} ${t('home.director')}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
