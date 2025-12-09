import imgDoctorAvatar from '@/assets/doctor-avatar.webp';
import { useTranslation } from '@/lib/i18n';

export function DoctorGreeting() {
  const { t } = useTranslation();

  return (
    <div className="h-[152px] w-full relative mb-[24px]">
      {/* 아바타 (오른쪽) */}
      <div className="absolute bottom-0 right-0 w-[180px] h-[160px]">
        <img
          alt="Dr.Lee"
          src={imgDoctorAvatar}
          className="w-full h-full object-contain object-bottom"
        />
      </div>

      {/* 텍스트 (왼쪽) - 상단 정렬 */}
      <div className="absolute left-0 top-0 w-[calc(100%-170px)] pl-[20px] pt-[10px] flex flex-col gap-[15px]">
        <div className="text-[20px] text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
          <p>{t('healthCheck.greeting1')}</p>
          <p>{t('healthCheck.greeting2')}</p>
        </div>

        <div className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
          <p>{t('healthCheck.selectHistory')}</p>
          <p>{t('healthCheck.selectAll')}</p>
        </div>
      </div>
    </div>
  );
}
