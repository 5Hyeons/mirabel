/**
 * 건강 상태 안내 화면
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/lib/store/patient-store';
import { HealthCheckData } from '@/lib/api/types';
import { HealthCheckHeader } from '@/components/health-check/HealthCheckHeader';
import { ProgressIndicator } from '@/components/health-check/ProgressIndicator';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import { BottomButton } from '@/components/shared/BottomButton';
import imgDoctorAvatar from '@/assets/doctor-avatar.webp';

export function HealthWarning() {
  const navigate = useNavigate();
  const { healthCheckState } = usePatientStore();
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckData | null>(null);
  const [showDanger, setShowDanger] = useState(false);
  const [showCaution, setShowCaution] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/mock-data.json');
        const data = await response.json();
        setHealthCheckData(data.healthCheck);

        const selectedItems = healthCheckState || [];
        const hasDanger = data.healthCheck.items
          .filter((item: any) => selectedItems.includes(item.id))
          .some((item: any) => item.category === 'danger');
        const hasCaution = data.healthCheck.items
          .filter((item: any) => selectedItems.includes(item.id))
          .some((item: any) => item.category === 'caution');

        setShowDanger(hasDanger);
        setShowCaution(hasCaution);
      } catch (error) {
        console.error('Failed to load health check data:', error);
      }
    };

    loadData();
  }, [healthCheckState]);

  if (!healthCheckData) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      <div>
        <HealthCheckHeader />
        <ProgressIndicator current={1} total={3} />
      </div>

      {/* 의사 인사 영역 */}
      <div className="h-[240px] w-full relative">
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

        <div className="absolute left-0 top-0 w-[360px] p-[20px] flex flex-col gap-[10px]">
          <div className="text-[23px] text-[#222222] tracking-[-0.46px] leading-[1.3]">
            <p>선택하신 항목은</p>
            <p>
              <span className="font-['Noto_Sans_KR:Bold',sans-serif] font-bold">검사 전 의사 확인</span>이
            </p>
            <p>반드시 필요합니다</p>
          </div>

          <p className="text-[16px] text-[#666666] tracking-[-0.32px] leading-[1.3]">
            검사 중 주의가 필요하여
            <br />
            의료진이 사전 확인을 진행합니다.
          </p>
        </div>
      </div>

      <ScrollableContainer>
        <div className="flex flex-col items-center p-[16px] gap-[16px]">
          <div className="bg-white border border-[#dddddd] border-solid rounded-[8px] p-[16px] flex flex-col gap-[24px] w-full">
            {/* 위험 메시지 */}
            {showDanger && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-start">
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#fd4848] tracking-[-0.32px] leading-[1.5]">
                    위험
                  </p>
                  <p className="flex-1 font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                    🫀 심장 질환
                  </p>
                </div>
                <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                  수면내시경 중 사용하는 진정약이 혈압이나
                  <br />
                  맥박을 일시적으로 변화시킬 수 있습니다.
                  <br />
                  심장 질환이 있는 경우, 이런 변화에 민감하게 반응해 혈압이 떨어지거나 맥박이 불규칙해질 수 있어 주의가 필요합니다.
                </p>
              </div>
            )}

            {/* 주의 메시지 */}
            {showCaution && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex gap-[8px] items-start">
                  <p className="font-['Pretendard:Bold',sans-serif] text-[16px] text-[#fd4848] tracking-[-0.32px] leading-[1.5]">
                    주의
                  </p>
                  <p className="flex-1 font-['Noto_Sans_KR:Bold',sans-serif] font-bold text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                    🫁 호흡기 질환
                  </p>
                </div>
                <p className="font-['Noto_Sans_KR:Regular',sans-serif] text-[16px] text-black tracking-[-0.32px] leading-[1.4]">
                  수면내시경 중 사용하는 진정약이 혈압이나
                  <br />
                  맥박을 일시적으로 변화시킬 수 있습니다.
                  <br />
                  심장 질환이 있는 경우, 이런 변화에 민감하게 반응해 혈압이 떨어지거나 맥박이 불규칙해질 수 있어 주의가 필요합니다.
                </p>
              </div>
            )}
          </div>

          <BottomButton
            text="확인"
            onClick={() => navigate('/health-check/recording')}
            active={true}
          />
        </div>
      </ScrollableContainer>
    </div>
  );
}
