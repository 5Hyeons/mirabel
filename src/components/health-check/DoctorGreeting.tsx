import imgDoctorAvatar from '@/assets/doctor-avatar.webp';

export function DoctorGreeting() {
  return (
    <div className="h-[152px] w-full relative mb-[16px]">
      {/* 아바타 (오른쪽) */}
      <div className="absolute bottom-0 right-0 w-[180px] h-[160px]">
        <img
          alt="Dr.Lee"
          src={imgDoctorAvatar}
          className="w-full h-full object-contain object-bottom"
        />
      </div>

      {/* 텍스트 (왼쪽) */}
      <div className="absolute left-0 top-0 w-[360px] p-[20px] flex flex-col gap-[10px]">
        <div className="text-[23px] text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
          <p>검사 전 건강 상태를</p>
          <p>확인하겠습니다</p>
        </div>

        <div className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
          <p>현재 또는 과거의 병력을</p>
          <p>모두 선택해주세요</p>
        </div>
      </div>
    </div>
  );
}
