interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-[8px] pb-[16px] px-[22px]">
      {/* 진행 바 */}
      <div className="flex h-px w-full gap-0">
        {[...Array(total)].map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-[3px] ${
              index < current ? 'bg-[#6490ff]' : 'bg-[#d8d8d8]'
            }`}
          />
        ))}
      </div>

      {/* 텍스트 */}
      <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[13px] text-[#6490ff] tracking-[-0.26px] leading-[1.4]">
        {current} / {total} 단계
      </p>
    </div>
  );
}
