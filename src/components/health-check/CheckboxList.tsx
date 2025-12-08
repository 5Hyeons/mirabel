import { HealthCheckItem } from '@/lib/api/types';
import imgCheckIcon from '@/assets/icon-check.svg';

interface CheckboxListProps {
  items: HealthCheckItem[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function CheckboxList({ items, selected, onChange }: CheckboxListProps) {
  const handleToggle = (itemId: string) => {
    // "없음" 선택 시 다른 항목 모두 해제
    if (itemId === 'hc-1') {
      onChange(['hc-1']);
      return;
    }

    // 다른 항목 선택 시 "없음" 해제
    const newSelected = selected.filter(id => id !== 'hc-1');

    if (newSelected.includes(itemId)) {
      // 이미 선택된 항목 → 해제
      onChange(newSelected.filter(id => id !== itemId));
    } else {
      // 선택 안 된 항목 → 추가
      onChange([...newSelected, itemId]);
    }
  };

  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((item) => {
        const isChecked = selected.includes(item.id);

        return (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="flex items-center gap-[12px] text-left"
          >
            <div
              className={`size-[28px] rounded-[4px] flex items-center justify-center flex-shrink-0 ${
                isChecked
                  ? 'bg-[#6490ff]'
                  : 'border-2 border-[#666666]'
              }`}
            >
              {isChecked && (
                <div className="size-[20px] flex items-center justify-center">
                  <img alt="checked" className="w-[12px] h-[9px]" src={imgCheckIcon} />
                </div>
              )}
            </div>
            <p className={`flex-1 text-[16px] text-black tracking-[-0.32px] leading-[1.5] whitespace-pre-line ${
              item.bold ? "font-['Noto_Sans_KR:Bold',sans-serif] font-bold" : "font-['Noto_Sans_KR:Regular',sans-serif] font-normal"
            }`}>
              {item.text}
            </p>
          </button>
        );
      })}
    </div>
  );
}
