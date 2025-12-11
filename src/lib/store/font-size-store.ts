import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'normal' | 'large' | 'xlarge';

interface FontSizeState {
  fontSize: FontSize;
  toggleFontSize: () => void;
}

const fontSizeOrder: FontSize[] = ['normal', 'large', 'xlarge'];

export const useFontSizeStore = create<FontSizeState>()(
  persist(
    (set, get) => ({
      fontSize: 'normal',
      toggleFontSize: () => {
        const currentIndex = fontSizeOrder.indexOf(get().fontSize);
        const nextIndex = (currentIndex + 1) % fontSizeOrder.length;
        set({ fontSize: fontSizeOrder[nextIndex] });
      },
    }),
    { name: 'mirabel-font-size' }
  )
);

// 콘텐츠 텍스트용 크기 계산 유틸리티
export const fontSizeMultiplier: Record<FontSize, number> = {
  normal: 1,
  large: 1.2,
  xlarge: 1.4,
};

// 기본 크기(px)와 현재 설정을 받아 조정된 크기를 반환
export const getScaledFontSize = (basePx: number, fontSize: FontSize): number => {
  return Math.round(basePx * fontSizeMultiplier[fontSize]);
};
