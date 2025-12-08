import { useNavigate } from 'react-router-dom';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconSize from '@/assets/icon-size.png';

export function HealthCheckHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f0f3ff] w-full">
      <div className="flex items-center pb-[12px] pt-[32px] px-[20px]">
        <div className="flex items-center gap-[4px] flex-1">
          <button onClick={() => navigate(-1)} className="size-[24px]">
            <img alt="뒤로가기" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-[rgba(17,17,17,0.5)] tracking-[-0.32px]">
            건강 상태
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
