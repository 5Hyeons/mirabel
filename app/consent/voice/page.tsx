/**
 * 동의서 - 음성 녹음 (3가지 상태)
 * Figma Node IDs:
 *   - 77-9266: 녹음 전
 *   - 89-5995: 녹음 중
 *   - 89-6061: 녹음 완료
 */

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePatientStore } from '@/lib/store/patient-store';
import { apiClient } from '@/lib/api/mock-api';

// 이미지 assets
const imgMicIcon = "/images/icon-mic-large.png";
const imgIconMic = "/images/icon-mic.svg";
const imgIconRefresh = "/images/icon-refresh.svg";
const imgIconPlay = "/images/icon-play.svg";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
const imgIconHome = "/images/icon-home.svg";

type RecordingState = 'idle' | 'recording' | 'completed';

function IconRefreshMono({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-[7.85%_8.07%_7.85%_7.76%]">
        <img alt="" className="block max-w-none size-full" src={imgIconRefresh} />
      </div>
    </div>
  );
}

export default function ConsentVoice() {
  const router = useRouter();
  const { patientData } = usePatientStore();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!patientData) {
    router.push('/');
    return null;
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState('completed');
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');
      setRecordingTime(0);

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert('마이크 접근 권한이 필요합니다.');
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

  const handleRetryRecording = () => {
    setRecordingState('idle');
    setRecordingTime(0);
    setAudioBlob(null);
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      alert('음성 녹음을 완료해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.saveVoiceRecording({
        patientId: patientData.patientId,
        duration: recordingTime,
        timestamp: new Date().toISOString()
      });

      router.push('/consent/complete');
    } catch (error) {
      alert('음성 녹음 저장에 실패했습니다.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#f0f3ff] overflow-clip relative rounded-[8px] size-full min-h-screen" data-name="동의">
      {/* 상단 헤더 */}
      <div className="absolute bg-[#f0f3ff] content-stretch flex flex-col h-[100px] items-center justify-end left-1/2 top-0 translate-x-[-50%] w-[360px]">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-end pb-[12px] pt-[30px] px-[20px] relative shrink-0 w-full">
          <button onClick={() => router.back()} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconArrowLeft} />
          </button>
          <p className="basis-0 font-['Noto_Sans_KR:Bold',_sans-serif] font-bold grow leading-[1.4] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(17,17,17,0.5)] text-center tracking-[-0.32px]">
            동의서 작성
          </p>
          <button onClick={() => router.push('/')} className="relative shrink-0 size-[24px]">
            <img alt="" className="block max-w-none size-full" src={imgIconHome} />
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[16px] top-[116px] w-[328px]">
        {/* 아이콘 및 제목 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="relative shrink-0 size-[60px]">
            <Image alt="" src={imgMicIcon} width={60} height={60} className="object-cover pointer-events-none" />
          </div>
          <div className="content-stretch flex flex-col font-['Noto_Sans_KR:Regular',_sans-serif] font-normal gap-[8px] items-start relative shrink-0 w-full">
            <div className="leading-[0] relative shrink-0 text-[#111111] text-[22px] tracking-[-0.44px] w-full">
              <p className="leading-[1.4] mb-0">검사를 진행하기 위해서는</p>
              <p className="leading-[1.4]">
                <span className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold">음성 녹음 동의</span>가 필요해요
              </p>
            </div>
            <p className="leading-[1.4] relative shrink-0 text-[#666666] text-[14px] tracking-[-0.28px] w-full">
              아래 문구를 음성으로 녹음하여 동의해 주세요
            </p>
          </div>
        </div>

        {/* 녹음 영역 */}
        <div className="border-[#6490ff] border-[0px_0px_0px_2px] border-solid box-border content-stretch flex flex-col gap-[8px] items-start pl-[20px] pr-0 py-0 relative shrink-0 w-full">
          <div className="content-stretch flex font-['Pretendard:Bold',_sans-serif] gap-[8px] items-start leading-[1.5] not-italic relative shrink-0 text-[16px] tracking-[-0.32px] w-full">
            <p className="relative shrink-0 text-[#6490ff] text-nowrap whitespace-pre">필수</p>
            <p className="basis-0 grow min-h-px min-w-px relative shrink-0 text-black">녹음</p>
          </div>

          {/* 녹음 문구 */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-center p-[16px] relative rounded-[8px] shrink-0 w-[308px]">
            <p className="font-['Pretendard:SemiBold',_sans-serif] leading-[1.5] not-italic relative shrink-0 text-[16px] text-black tracking-[-0.32px] w-full">
              "저는 [내시경 검사]에 대한 설명을 충분히 들었으며, 검사의 목적, 방법, 주의사항을 이해하였습니다. 이에 검사 및 치료에 동의합니다"
            </p>
          </div>

          {/* 녹음 상태 표시 */}
          {recordingState === 'idle' && (
            <div className="bg-[#666666] h-[56px] overflow-clip relative rounded-[8px] shrink-0 w-full flex items-center justify-end pr-4">
              <div className="font-['Noto_Sans_KR:Medium',_sans-serif] font-medium text-[14px] text-[rgba(255,255,255,0.7)] tracking-[-0.28px]">
                00:00
              </div>
            </div>
          )}

          {recordingState === 'recording' && (
            <div className="bg-[#ffcdcd] h-[56px] overflow-clip relative rounded-[8px] shrink-0 w-full flex items-center px-4">
              {/* Waveform 애니메이션 */}
              <div className="content-stretch flex gap-[5px] items-center">
                {[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((baseHeight, i) => {
                  // 가운데(7-8번)를 중심으로 점진적으로 증가 (2차 함수)
                  const distanceFromCenter = Math.abs(i - 7.5);
                  const maxScale = 5; // 가운데 최대 (6배)
                  const minScale = 1.1; // 양쪽 최소
                  const scaleValue = maxScale - ((distanceFromCenter / 7.5) ** 2) * (maxScale - minScale);

                  return (
                    <div
                      key={i}
                      className="bg-[rgba(17,17,17,0.5)] rounded-[99px] shrink-0 w-[3px] animate-wave"
                      style={{
                        height: `${baseHeight}px`,
                        animationDelay: `${i * 0.05}s`,
                        transformOrigin: 'center',
                        ['--scale-value' as any]: scaleValue
                      }}
                    />
                  );
                })}
              </div>
              <div className="ml-auto font-['Noto_Sans_KR:Medium',_sans-serif] font-medium text-[14px] text-[#111111] tracking-[-0.28px]">
                {formatTime(recordingTime)}
              </div>
            </div>
          )}

          {recordingState === 'completed' && (
            <>
              <div className="bg-[#bcceff] h-[56px] overflow-clip relative rounded-[8px] shrink-0 w-full flex items-center px-4">
                {/* 재생 버튼 */}
                <button className="relative size-[20px]">
                  <img alt="" className="block max-w-none size-full" src={imgIconPlay} />
                </button>

                {/* Waveform */}
                <div className="content-stretch flex gap-[5px] items-center ml-4">
                  {[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6].map((height, i) => (
                    <div
                      key={i}
                      className="bg-[rgba(17,17,17,0.5)] h-[6px] rounded-[99px] shrink-0 w-[3px]"
                    />
                  ))}
                </div>

                <div className="ml-auto font-['Noto_Sans_KR:Medium',_sans-serif] font-medium text-[14px] text-[#111111] tracking-[-0.28px]">
                  {formatTime(recordingTime)}
                </div>
              </div>

              {/* 다시 녹음하기 버튼 */}
              <button
                onClick={handleRetryRecording}
                className="bg-white border-2 border-[#d7d7d7] border-solid box-border content-stretch flex gap-[4px] h-[56px] items-center justify-center p-[20px] relative rounded-[8px] shrink-0 w-[308px] active:scale-95 transition-transform"
              >
                <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[#666666] text-[16px] text-center text-nowrap tracking-[-0.32px] whitespace-pre">
                  다시 녹음하기
                </p>
                <IconRefreshMono className="overflow-clip relative shrink-0 size-[20px]" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bg-gradient-to-b bottom-[-1px] content-stretch flex flex-col from-[rgba(240,243,255,0)] items-center left-[0.55px] to-[#f0f3ff] w-[360px]">
        <div className="bg-[#f0f3ff] box-border content-stretch flex gap-[16px] h-[100px] items-start justify-center pb-[24px] pt-0 px-[16px] relative shrink-0 w-full">
          {recordingState === 'idle' && (
            <button
              onClick={handleStartRecording}
              className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[8px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
            >
              <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
                녹음 시작
              </p>
              <div className="relative shrink-0 size-[20px]">
                <img alt="" className="block max-w-none size-full" src={imgIconMic} />
              </div>
            </button>
          )}

          {recordingState === 'recording' && (
            <button
              onClick={handleStopRecording}
              className="basis-0 bg-[#fd4848] box-border content-stretch flex gap-[8px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 active:scale-95 transition-transform"
            >
              <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
                녹음중
              </p>
              <div className="overflow-clip relative rounded-[999px] shrink-0 size-[20px] flex items-center justify-center">
                <div className="bg-white rounded-[2px] size-[13.039px]" />
              </div>
            </button>
          )}

          {recordingState === 'completed' && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="basis-0 bg-[#6490ff] box-border content-stretch flex gap-[4px] grow h-[56px] items-center justify-center min-h-px min-w-px p-[20px] relative rounded-[8px] shadow-[0px_2.59px_12.952px_0px_rgba(0,0,0,0.12)] shrink-0 disabled:opacity-50 active:scale-95 transition-all"
            >
              <p className="font-['Noto_Sans_KR:Bold',_sans-serif] font-bold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px] whitespace-pre">
                {submitting ? '저장 중...' : '다음'}
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
