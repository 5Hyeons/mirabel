import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '@/lib/store/language-store';

export function Start() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#6490ff] gap-[32px]">
      <div className="flex flex-col items-center gap-[16px]">
        <h1 className="text-white text-[28px] font-bold tracking-[-0.56px]">
          {language === 'ko' ? '온라인 수면내시경' : 'Online Sedated Endoscopy'}
        </h1>
        <p className="text-white/80 text-[18px] tracking-[-0.36px]">
          {language === 'ko' ? '안내 서비스' : 'Guidance Service'}
        </p>
      </div>

      {/* 언어 선택 */}
      <div className="flex gap-[12px]">
        <button
          onClick={() => setLanguage('ko')}
          className={`px-[24px] py-[12px] rounded-[8px] font-medium text-[16px] transition-all ${
            language === 'ko'
              ? 'bg-white text-[#6490ff]'
              : 'bg-white/20 text-white border border-white/40'
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-[24px] py-[12px] rounded-[8px] font-medium text-[16px] transition-all ${
            language === 'en'
              ? 'bg-white text-[#6490ff]'
              : 'bg-white/20 text-white border border-white/40'
          }`}
        >
          English
        </button>
      </div>

      <button
        onClick={() => navigate('/home')}
        className="bg-white text-[#6490ff] font-bold text-[18px] px-[48px] py-[16px] rounded-[12px] shadow-lg active:scale-95 transition-transform"
      >
        {language === 'ko' ? '시작하기' : 'Start'}
      </button>
    </div>
  );
}
