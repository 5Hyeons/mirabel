/**
 * 건강 상태 - 음성 녹음 화면
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { HealthCheckHeader } from '@/components/health-check/HealthCheckHeader';
import { ProgressIndicator } from '@/components/health-check/ProgressIndicator';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import imgDoctorAvatar from '@/assets/doctor-avatar.webp';
import imgIconPlay from '@/assets/icon-play.svg';
import imgIconRefresh from '@/assets/icon-refresh.svg';
import imgTooltipPointer from '@/assets/tooltip-pointer.svg';

type RecordingState = 'idle' | 'recording' | 'completed';

export function HealthRecording() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setRecordingState('completed');
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch {
      alert(t('healthRecording.micPermission'));
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleRetry = () => {
    setRecordingState('idle');
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      <div>
        <HealthCheckHeader />
        <ProgressIndicator current={2} total={3} />
      </div>

      <ScrollableContainer>
        {/* 의사 인사 영역 - DoctorGreeting과 동일한 스타일 */}
        <div className="h-[152px] w-full relative mb-[24px]">
          <div className="absolute bottom-0 right-0 w-[180px] h-[160px]">
            <img
              alt="Dr.Lee"
              src={imgDoctorAvatar}
              className="w-full h-full object-contain object-bottom"
            />
          </div>

          <div className="absolute left-0 top-0 w-[calc(100%-180px)] pl-[20px] pt-[10px] flex flex-col gap-[15px]">
            <div className="text-[20px] text-[#222222] tracking-[-0.46px] leading-[1.3] font-['Noto_Sans_KR:Bold',sans-serif] font-bold">
              <p>{t('healthRecording.title1')}</p>
              <p>{t('healthRecording.title2')}</p>
              <p>{t('healthRecording.title3')}</p>
            </div>

            <p className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
              {t('healthRecording.instruction1')}
              <br />
              {t('healthRecording.instruction2')}
            </p>
          </div>
        </div>
        <div className="flex flex-col px-[20px] py-[16px] gap-[24px]">

          {/* 녹음 스크립트 */}
          <div className="border-l-2 border-[#6490ff] pl-[20px] flex flex-col gap-[8px]">
            <div className="flex gap-[8px] items-start">
              <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#6490ff] tracking-[-0.32px] leading-[1.5]">
                {t('common.required')}
              </p>
              <p className="font-['Pretendard:Bold',sans-serif] flex-1 text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
                {t('healthRecording.recording')}
              </p>
            </div>

            <div className="bg-white rounded-[8px] p-[16px]">
              <p className="font-['Pretendard:SemiBold',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.5]">
                "{t('healthRecording.script')}"
              </p>
            </div>
          </div>

          {/* 녹음 상태 표시 */}
          {recordingState === 'recording' && (
            <div className="bg-[#ffcdcd] h-[56px] rounded-[8px] flex items-center px-4">
              <div className="flex gap-[5px] items-center">
                {[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((baseHeight, i) => {
                  const distanceFromCenter = Math.abs(i - 7.5);
                  const maxScale = 5;
                  const minScale = 1.1;
                  const scaleValue = maxScale - ((distanceFromCenter / 7.5) ** 2) * (maxScale - minScale);

                  return (
                    <div
                      key={i}
                      className="bg-[rgba(17,17,17,0.5)] rounded-[99px] shrink-0 w-[3px] animate-wave"
                      style={{
                        height: `${baseHeight}px`,
                        animationDelay: `${i * 0.05}s`,
                        transformOrigin: 'center',
                        ['--scale-value' as string]: scaleValue
                      }}
                    />
                  );
                })}
              </div>
              <p className="ml-auto font-['Noto_Sans_KR:Medium',sans-serif] font-medium text-[14px] text-[#111111] tracking-[-0.28px]">
                {formatTime(recordingTime)}
              </p>
            </div>
          )}

          {recordingState === 'completed' && (
            <div className="bg-[#bcceff] h-[56px] rounded-[8px] flex items-center px-4">
              <button className="size-[20px]">
                <img alt="재생" className="block max-w-none size-full" src={imgIconPlay} />
              </button>

              <div className="flex gap-[5px] items-center ml-4">
                {[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[rgba(17,17,17,0.5)] h-[6px] rounded-[99px] shrink-0 w-[3px]"
                  />
                ))}
              </div>

              <p className="ml-auto font-['Noto_Sans_KR:Medium',sans-serif] font-medium text-[14px] text-[#111111] tracking-[-0.28px]">
                {formatTime(recordingTime)}
              </p>
            </div>
          )}

          {/* 툴팁 + 버튼 묶음 */}
          {recordingState === 'idle' && (
            <div className="flex flex-col w-full gap-[4px]">
              {/* 툴팁 */}
              <div className="flex flex-col items-start">
                <div className="bg-[#111111] rounded-[8px] px-[10px] py-[10px] mb-[-8px]">
                  <p className="font-['Noto_Sans_KR:Medium',sans-serif] font-medium text-[14px] text-white text-center tracking-[-0.28px] leading-[1.4]">
                    {t('healthRecording.pressToStart')}
                  </p>
                </div>
                <div className="h-[20px] w-[20px] ml-[15px]">
                  <img src={imgTooltipPointer} alt="" className="block w-full h-full" />
                </div>
              </div>

              {/* 버튼 */}
              <button
                onClick={handleStartRecording}
                className="w-full bg-[#6490ff] h-[56px] rounded-[8px] flex items-center justify-center gap-[8px]"
              >
                <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
                  {t('healthRecording.startRecording')}
                </p>
                <div className="size-[20px] bg-white rounded-full flex items-center justify-center">
                  <div className="w-[12px] h-[12px] bg-[#ff0000] rounded-full" />
                </div>
              </button>
            </div>
          )}

          {recordingState === 'recording' && (
            <button
              onClick={handleStopRecording}
              className="w-full bg-[#ff0000] h-[56px] rounded-[8px] flex items-center justify-center gap-[8px]"
            >
              <div className="w-[12px] h-[12px] bg-white" />
              <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
                {t('healthRecording.recordingInProgress')}
              </p>
            </button>
          )}

          {recordingState === 'completed' && (
            <div className="flex gap-[16px]">
              <button
                onClick={handleRetry}
                className="flex-1 bg-[#666666] h-[56px] rounded-[8px] flex items-center justify-center gap-[8px]"
              >
                <div className="size-[20px]">
                  <img alt={t('healthRecording.recordAgain')} className="block max-w-none size-full" src={imgIconRefresh} />
                </div>
                <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
                  {t('healthRecording.recordAgain')}
                </p>
              </button>

              <button
                onClick={() => navigate('/health-check/complete')}
                className="flex-1 bg-[#6490ff] h-[56px] rounded-[8px] flex items-center justify-center"
              >
                <p className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-white tracking-[-0.32px]">
                  {t('common.next')}
                </p>
              </button>
            </div>
          )}
        </div>
      </ScrollableContainer>
    </div>
  );
}
