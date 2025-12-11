import { useState } from 'react';
import imgIconGlobe from '@/assets/icon-globe.webp';
import imgIconSize from '@/assets/icon-size.webp';
import { useTranslation } from '@/lib/i18n';
import { LanguageModal } from '@/components/shared/LanguageModal';
import { useFontSizeStore } from '@/lib/store/font-size-store';

export function HomeHeader() {
  const { t, language } = useTranslation();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const { fontSize, toggleFontSize } = useFontSizeStore();

  const languageLabel = language === 'ko' ? t('language.korean') : t('language.english');
  const fontSizeLabel = fontSize === 'normal' ? '' : fontSize === 'large' ? ' (L)' : ' (XL)';

  return (
    <div className="bg-[#f0f3ff] w-full">
      <div className="flex items-center pb-[12px] pt-[32px] px-[20px]">
        <div className="flex-1" /> {/* 왼쪽 빈 공간 */}

        <div className="relative">
          <button
            onClick={() => setIsLanguageModalOpen(!isLanguageModalOpen)}
            className="flex gap-[4px] items-center p-[8px]"
          >
            <div className="size-[20px]">
              <img alt="" className="block max-w-none size-full" src={imgIconGlobe} />
            </div>
            <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-14 text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
              {languageLabel}
            </p>
          </button>
          <LanguageModal
            isOpen={isLanguageModalOpen}
            onClose={() => setIsLanguageModalOpen(false)}
          />
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
