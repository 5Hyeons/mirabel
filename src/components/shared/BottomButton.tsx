interface BottomButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}

export function BottomButton({ text, onClick, disabled = false, active = false }: BottomButtonProps) {
  const bgColor = active ? 'bg-[#6490ff]' : 'bg-[#666666]';

  return (
    <div className="bg-gradient-to-b from-transparent to-[#f0f3ff] w-full">
      <div
        className="bg-[#f0f3ff] flex h-[70px] items-end justify-center px-[16px] pt-[8px]"
        style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={onClick}
          disabled={disabled}
          className={`w-full ${bgColor} flex h-[56px] items-center justify-center rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] disabled:opacity-50 active:scale-95 transition-all`}
        >
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-scale-16 text-white tracking-[-0.32px] leading-[1.4]">
            {text}
          </p>
        </button>
      </div>
    </div>
  );
}
