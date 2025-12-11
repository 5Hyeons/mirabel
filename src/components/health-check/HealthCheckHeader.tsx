import { useNavigate } from 'react-router-dom';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconSize from '@/assets/icon-size.webp';
import { useTranslation } from '@/lib/i18n';
import { useFontSizeStore } from '@/lib/store/font-size-store';

export function HealthCheckHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { fontSize, toggleFontSize } = useFontSizeStore();
  const fontSizeLabel = fontSize === 'normal' ? '' : fontSize === 'large' ? ' (L)' : ' (XL)';

  return (
    <div className="bg-[#f0f3ff] w-full">
      <div className="flex items-center pb-[12px] pt-[32px] px-[20px]">
        <div className="flex items-center gap-[4px] flex-1">
          <button onClick={() => navigate(-1)} className="size-[24px]">
            <img alt={t('common.back')} className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-16 text-[rgba(17,17,17,0.5)] tracking-[-0.32px]">
            {t('healthCheck.title')}
          </p>
        </div>

        <button
          onClick={toggleFontSize}
          className="flex gap-[4px] items-center p-[8px]"
        >
          <div className="size-[20px]">
            <img alt="" className="block max-w-none size-full" src={imgIconSize} />
          </div>
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-14 text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
            {t('common.sizeAdjust')}{fontSizeLabel}
          </p>
        </button>
      </div>
    </div>
  );
}
