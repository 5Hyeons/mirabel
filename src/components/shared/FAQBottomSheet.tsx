import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface FAQBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export function FAQBottomSheet({ isOpen, onClose, questions, onSelectQuestion }: FAQBottomSheetProps) {
  const { t } = useTranslation();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset drag offset when opening
  useEffect(() => {
    if (isOpen) {
      setDragOffset(0);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    // Only allow dragging down (positive diff)
    if (diff > 0) {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // If dragged more than 100px, close the sheet
    if (dragOffset > 100) {
      onClose();
    }

    // Reset offset with animation
    setDragOffset(0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-[100]"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[20px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] pt-[16px] pb-[24px] px-[16px] max-w-[480px] mx-auto"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="w-[40px] h-[4px] bg-gray-300 rounded-full mx-auto mb-[16px]" />

        {/* Header */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          <p className="font-bold text-[20px] text-[#222222] leading-[1.3] tracking-[-0.4px]">
            {t('faq.title')}
          </p>
          <p className="text-[16px] text-[#666666] leading-[1.3] tracking-[-0.32px]">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* FAQ list */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onSelectQuestion(question)}
              className="bg-[#dde7ff] rounded-[8px] px-[16px] py-[10px] text-left active:scale-[0.98] transition-transform"
            >
              <p className="text-[16px] text-[#6490ff] leading-[1.4] tracking-[-0.32px]">
                Q. {question}
              </p>
            </button>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full h-[56px] bg-[#6490ff] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          <p className="font-bold text-[16px] text-white leading-[1.4] tracking-[-0.32px]">
            {t('faq.close')}
          </p>
        </button>
      </div>
    </>
  );
}
