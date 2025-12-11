import imgDoctorAvatar from '@/assets/doctor-avatar.webp';
import { useTranslation } from '@/lib/i18n';

export function DoctorGreeting() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[152px] w-full flex mb-[24px]">
      {/* 텍스트 (왼쪽) */}
      <div className="flex-1 pl-[20px] pt-[10px] flex flex-col gap-[15px]">
        <div className="text-scale-20 text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
          <p>{t('healthCheck.greeting1')}</p>
          <p>{t('healthCheck.greeting2')}</p>
        </div>

        <div className="text-scale-16 text-[#666666] tracking-[-0.32px] leading-[1.3]">
          <p>{t('healthCheck.selectHistory')}</p>
          <p>{t('healthCheck.selectAll')}</p>
        </div>
      </div>

      {/* 아바타 (오른쪽) */}
      <div className="w-[170px] h-[160px] shrink-0 self-end">
        <img
          alt="Dr.Lee"
          src={imgDoctorAvatar}
          className="w-full h-full object-contain object-bottom"
        />
      </div>
    </div>
  );
}
