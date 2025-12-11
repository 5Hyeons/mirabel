import { useMemo } from 'react';
import { useConsultationStore } from '@/lib/store/consultation-store';
import { useFontSizeStore } from '@/lib/store/font-size-store';
import { useTranslation } from '@/lib/i18n';
import { ChatMessage } from '@/lib/types/consultation';
import imgIconArrowLeft from '@/assets/icon-arrow-left.svg';
import imgIconGlobe from '@/assets/icon-globe.webp';
import imgIconSize from '@/assets/icon-size.webp';

interface ConsultationSummaryProps {
  onBack: () => void;
  onEndConsultation: () => void;
}

interface MessagePair {
  id: string;
  userMessage: ChatMessage | null;
  aiMessage: ChatMessage | null;
}

export function ConsultationSummary({ onBack, onEndConsultation }: ConsultationSummaryProps) {
  const { t, language } = useTranslation();
  const { messages, removeMessage } = useConsultationStore();
  const { fontSize, toggleFontSize } = useFontSizeStore();
  const fontSizeLabel = fontSize === 'normal' ? '' : fontSize === 'large' ? ' (L)' : ' (XL)';

  // Group messages into user/AI pairs
  const groupedMessages = useMemo(() => {
    const pairs: MessagePair[] = [];
    let currentPair: MessagePair | null = null;

    // Only include final messages
    const finalMessages = messages.filter(m => m.isFinal !== false);

    for (const msg of finalMessages) {
      if (msg.isUser) {
        // Start a new pair with user message
        if (currentPair) {
          pairs.push(currentPair);
        }
        currentPair = {
          id: msg.id,
          userMessage: msg,
          aiMessage: null,
        };
      } else {
        // AI message
        if (currentPair && currentPair.aiMessage === null) {
          // Add to current pair
          currentPair.aiMessage = msg;
          pairs.push(currentPair);
          currentPair = null;
        } else {
          // AI message without user message (e.g., greeting)
          pairs.push({
            id: msg.id,
            userMessage: null,
            aiMessage: msg,
          });
        }
      }
    }

    // Push remaining pair if exists
    if (currentPair) {
      pairs.push(currentPair);
    }

    return pairs;
  }, [messages]);

  const handleDelete = (pair: MessagePair) => {
    if (pair.userMessage) {
      removeMessage(pair.userMessage.id);
    }
    if (pair.aiMessage) {
      removeMessage(pair.aiMessage.id);
    }
  };

  return (
    <div className="bg-[#f0f3ff] h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="content-stretch flex items-center pb-[12px] pt-[32px] px-[20px] shrink-0 w-full">
        <div className="basis-0 content-stretch flex gap-[4px] grow h-[36px] items-center min-h-px min-w-px shrink-0">
          <button onClick={onBack} className="shrink-0 size-[24px]">
            <img alt="뒤로가기" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
        </div>
        <div className="content-stretch flex gap-[4px] items-center p-[8px] shrink-0">
          <img alt="" className="shrink-0 size-[20px]" src={imgIconGlobe} />
          <p className="font-bold leading-[1.4] shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
            {language === 'ko' ? t('language.korean') : t('language.english')}
          </p>
        </div>
        <button
          onClick={toggleFontSize}
          className="content-stretch flex gap-[4px] items-center p-[8px] shrink-0"
        >
          <img alt="" className="shrink-0 size-[20px]" src={imgIconSize} />
          <p className="font-bold leading-[1.4] shrink-0 text-[14px] text-[rgba(17,17,17,0.5)] text-nowrap text-right tracking-[-0.28px]">
            {t('common.sizeAdjust')}{fontSizeLabel}
          </p>
        </button>
      </div>

      {/* Title */}
      <div className="content-stretch flex flex-col gap-[10px] items-center justify-center leading-[1.3] p-[20px] shrink-0 text-center w-full">
        <div className="font-bold shrink-0 text-[#222222] text-scale-23 tracking-[-0.46px] w-full">
          <p className="mb-0">{t('consultationSummary.title1')}</p>
          <p>{t('consultationSummary.title2')}</p>
        </div>
        <p className="font-normal shrink-0 text-[#666666] text-scale-16 tracking-[-0.32px] w-full">
          {t('consultationSummary.deliveryNotice')}
        </p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-[16px] pb-[16px]">
        <div className="flex flex-col gap-[10px] items-center">
          {groupedMessages.map((pair) => (
            <div key={pair.id} className="flex flex-col gap-[10px] w-full">
              {/* User Message */}
              {pair.userMessage && (
                <div className="backdrop-blur-[10px] bg-[#bcceff] border-[#dddddd] border border-solid flex gap-[8px] items-center leading-[1.4] p-[16px] rounded-[8px] w-full">
                  <p className="basis-0 font-normal grow min-h-px min-w-px text-scale-16 text-black tracking-[-0.32px]">
                    {pair.userMessage.message}
                  </p>
                  <button
                    onClick={() => handleDelete(pair)}
                    className="shrink-0 font-medium text-[#666666] text-[14px] text-right tracking-[-0.28px] hover:text-[#444444] transition-colors"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              )}

              {/* AI Message */}
              {pair.aiMessage && (
                <div className="backdrop-blur-[10px] bg-white border-[#dddddd] border border-solid flex flex-col items-start justify-center p-[16px] rounded-[8px] w-full">
                  <p className="font-normal leading-[1.4] text-scale-16 text-black tracking-[-0.32px] w-full">
                    {pair.aiMessage.message}
                  </p>
                </div>
              )}
            </div>
          ))}

          {groupedMessages.length === 0 && (
            <div className="text-center py-[40px] text-[#666666] w-full">
              <p>{t('consultationSummary.noHistory')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-[8px] px-[16px] shrink-0 w-full"
        style={{ paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={onBack}
          className="basis-0 bg-[#666666] flex gap-[4px] grow h-[56px] items-center justify-center min-w-px px-[12px] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
        >
          <p className="font-bold leading-[1.2] text-scale-16 text-center text-white tracking-[-0.32px]">
            {t('consultationSummary.goBack')}
          </p>
        </button>
        <button
          onClick={onEndConsultation}
          className="basis-0 bg-[#6490ff] flex gap-[4px] grow h-[56px] items-center justify-center min-w-px px-[12px] rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
        >
          <p className="font-bold leading-[1.2] text-scale-16 text-center text-white tracking-[-0.32px]">
            {t('consultationSummary.endConsultation')}
          </p>
        </button>
      </div>
    </div>
  );
}
