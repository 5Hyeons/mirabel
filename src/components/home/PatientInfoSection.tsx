import { PatientData } from '@/lib/api/types';

interface PatientInfoSectionProps {
  patientData: PatientData;
}

export function PatientInfoSection({ patientData }: PatientInfoSectionProps) {
  return (
    <div className="bg-white border border-[#dddddd] border-solid rounded-[10px] px-[16px] py-[24px] flex flex-col gap-[16px] w-full">
      <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[18px] text-[#111111] tracking-[-0.36px] leading-[1.4]">
        검사 정보
      </p>

      <div className="flex flex-col gap-[8px]">
        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px]">
            환자 정보
          </p>
          <div className="h-full w-px bg-[#d8d8d8]" />
          <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#111111] tracking-[-0.32px]">
            {patientData.name}
          </p>
          <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#111111] tracking-[-0.32px]">
            {patientData.birthDate}
          </p>
        </div>

        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px]">
            예약 병원
          </p>
          <div className="h-full w-px bg-[#d8d8d8]" />
          <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#111111] tracking-[-0.32px]">
            {patientData.appointment.hospitalName}
          </p>
        </div>

        <div className="bg-[#f0f3ff] flex gap-[10px] items-center p-[16px] rounded-[8px]">
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-[#111111] tracking-[-0.32px] w-[66px]">
            검사일
          </p>
          <div className="h-full w-px bg-[#d8d8d8]" />
          <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#111111] tracking-[-0.32px]">
            {patientData.appointment.examinationDate}
          </p>
        </div>
      </div>

      <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[14px] text-[#111111] tracking-[-0.28px] leading-[1.4] text-center">
        수면내시경 검사 예약이 확인되었습니다.
        <br />
        검사 당일 안내사항을 꼭 지켜해 주세요.
      </p>
    </div>
  );
}
