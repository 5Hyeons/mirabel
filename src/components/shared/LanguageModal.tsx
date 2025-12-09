import { useEffect, useRef } from 'react';
import { useTranslation, Language } from '@/lib/i18n';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { language, setLanguage, t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ko', label: t('language.korean') },
    { code: 'en', label: t('language.english') },
  ];

  return (
    <div
      ref={modalRef}
      className="absolute top-full right-0 mt-[8px] bg-white rounded-[8px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)] overflow-hidden z-50 min-w-[120px]"
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`w-full px-[16px] py-[12px] text-[14px] font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-center transition-colors ${
            language === lang.code
              ? 'bg-[#6490ff] text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
