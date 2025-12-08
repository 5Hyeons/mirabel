import imgIconGlobe from '@/assets/icon-globe.png';
import imgIconSize from '@/assets/icon-size.png';

export function HomeHeader() {
  return (
    <div className="bg-[#f0f3ff] w-full">
      <div className="flex items-center pb-[12px] pt-[32px] px-[20px]">
        <div className="flex-1" /> {/* 왼쪽 빈 공간 */}

        <div className="flex gap-[4px] items-center p-[8px]">
          <div className="size-[20px]">
            <img alt="" className="block max-w-none size-full" src={imgIconGlobe} />
          </div>
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
            한국어
          </p>
        </div>

        <div className="flex gap-[4px] items-center p-[8px]">
          <div className="size-[20px]">
            <img alt="" className="block max-w-none size-full" src={imgIconSize} />
          </div>
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[14px] text-[rgba(17,17,17,0.5)] tracking-[-0.28px]">
            크기 조절
          </p>
        </div>
      </div>
    </div>
  );
}
