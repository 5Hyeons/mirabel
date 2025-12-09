import { ExaminationSection } from '@/lib/api/types';
import { useTranslation } from '@/lib/i18n';
import imgCheckIcon from '@/assets/icon-check.svg';

interface ContentBlockProps {
  section: ExaminationSection;
  selectedValue?: string;
  onCheckboxChange?: (optionId: string) => void;
}

export function ContentBlock({ section, selectedValue, onCheckboxChange }: ContentBlockProps) {
  const { t } = useTranslation();

  if (section.type === 'section-header') {
    return (
      <div className="pt-[16px] border-t border-[#e9e9e9]">
        <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[18px] text-[#111111] tracking-[-0.36px] leading-[1.4]">
          {section.title}
        </p>
      </div>
    );
  }

  if (section.type === 'bullet-list') {
    return (
      <div className="flex flex-col gap-[8px]">
        <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
          {section.title}
        </p>
        <ul className="list-disc pl-[24px] space-y-[4px]">
          {section.items?.map((item, index) => (
            <li key={index} className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.type === 'warning') {
    return (
      <div className="flex flex-col gap-[8px]">
        {section.title && (
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
            {section.title}
          </p>
        )}
        {section.content && (
          <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#ff1111] tracking-[-0.32px] leading-[1.4] whitespace-pre-line">
            {section.content}
          </p>
        )}
        {section.items && section.items.length > 0 && (
          <ul className="list-disc pl-[24px] space-y-[4px]">
            {section.items.map((item, index) => (
              <li key={index} className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#ff1111] tracking-[-0.32px] leading-[1.4]">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // checkbox 타입
  if (section.type === 'checkbox') {
    return (
      <div className="border-l-2 border-[#6490ff] pl-[20px] py-[8px]">
        <div className="flex flex-wrap gap-[16px] items-center">
          {section.checkboxOptions?.map((option) => (
            <button
              key={option.id}
              onClick={() => onCheckboxChange?.(option.id)}
              className="flex gap-[10px] items-center"
            >
              <div className={`size-[28px] rounded-[4px] flex items-center justify-center ${
                selectedValue === option.id ? 'bg-[#6490ff]' : 'border-2 border-[#666666]'
              }`}>
                {selectedValue === option.id && (
                  <img alt="checked" className="w-[12px] h-[9px]" src={imgCheckIcon} />
                )}
              </div>
              <p className="font-['Pretendard:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
                {option.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // consent-checkbox 타입 (필수 동의)
  if (section.type === 'consent-checkbox') {
    return (
      <div className="flex flex-col gap-[16px]">
        <div className="border-l-2 border-[#6490ff] pl-[20px] py-[8px] flex flex-col gap-[8px]">
          <div className="flex gap-[8px] items-start">
            <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#6490ff] tracking-[-0.32px] leading-[1.5]">
              {t('common.required')}
            </p>
            <p className="font-['Pretendard:Bold',sans-serif] flex-1 text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
              {section.title}
            </p>
          </div>
          <p className="font-['Pretendard:Medium',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
            {section.content}
          </p>
        </div>

        <div className="flex flex-wrap gap-[24px] items-center">
          {section.checkboxOptions?.map((option) => (
            <button
              key={option.id}
              onClick={() => onCheckboxChange?.(option.id)}
              className="flex gap-[10px] items-center"
            >
              <div className={`size-[28px] rounded-[4px] flex items-center justify-center ${
                selectedValue === option.id ? 'bg-[#6490ff]' : 'border-2 border-[#666666]'
              }`}>
                {selectedValue === option.id && (
                  <img alt="checked" className="w-[12px] h-[9px]" src={imgCheckIcon} />
                )}
              </div>
              <p className="font-['Pretendard:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
                {option.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // type === 'text' or 'highlight'
  return (
    <div className="flex flex-col gap-[8px]">
      {section.title && (
        <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
          {section.title}
        </p>
      )}
      {section.content && (
        <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4] whitespace-pre-line">
          {section.content}
        </p>
      )}
      {section.highlight && (
        <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-[#ff1111] tracking-[-0.32px] leading-[1.4]">
          {section.highlight}
        </p>
      )}
    </div>
  );
}
