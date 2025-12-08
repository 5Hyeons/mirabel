import imgDoctorAvatar from '@/assets/doctor-avatar.png';

export function DoctorGreeting() {
  return (
    <div className="h-[240px] w-full relative">
      {/* 의사 아바타 배경 (오른쪽 하단) */}
      <div className="absolute bottom-0 right-0 w-[280px] h-[240px] overflow-hidden">
        <img
          alt="Dr.Lee"
          src={imgDoctorAvatar}
          className="absolute object-contain"
          style={{
            width: '260px',
            height: '260px',
            right: '-10px',
            bottom: '-10px'
          }}
        />
      </div>

      {/* 텍스트 (아바타 위에 겹침) */}
      <div className="absolute left-0 top-0 w-[360px] p-[20px] flex flex-col gap-[10px]">
        <div className="text-[23px] text-[#222222] tracking-[-0.46px] leading-[1.3]">
          <p>안녕하세요, Dr.Lee 에요</p>
          <p>
            검사 전, <span className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold">건강 상태를</span>
          </p>
          <p>
            <span className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold">간단히 확인</span>하겠습니다
          </p>
        </div>

        <div className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
          <p>현재 또는 과거의 병력을</p>
          <p>모두 선택해주세요</p>
        </div>
      </div>
    </div>
  );
}
