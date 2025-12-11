import { useNavigate } from 'react-router-dom';

export function Start() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#6490ff] gap-[32px]">
      <div className="flex flex-col items-center gap-[16px]">
        <h1 className="text-white text-[28px] font-bold tracking-[-0.56px]">
          온라인 수면내시경
        </h1>
        <p className="text-white/80 text-[18px] tracking-[-0.36px]">
          안내 서비스
        </p>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="bg-white text-[#6490ff] font-bold text-[18px] px-[48px] py-[16px] rounded-[12px] shadow-lg active:scale-95 transition-transform"
      >
        시작하기
      </button>
    </div>
  );
}
