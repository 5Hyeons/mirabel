/**
 * 건강 상태 체크 페이지
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '@/lib/store/patient-store';
import { HealthCheckData } from '@/lib/api/types';
import { ScrollableContainer } from '@/components/shared/ScrollableContainer';
import { BottomButton } from '@/components/shared/BottomButton';
import { HealthCheckHeader } from '@/components/health-check/HealthCheckHeader';
import { ProgressIndicator } from '@/components/health-check/ProgressIndicator';
import { DoctorGreeting } from '@/components/health-check/DoctorGreeting';
import { CheckboxList } from '@/components/health-check/CheckboxList';

export function HealthCheck() {
  const navigate = useNavigate();
  const { setHealthCheckState } = usePatientStore();
  const [healthCheckData, setHealthCheckData] = useState<HealthCheckData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHealthCheckData = async () => {
      try {
        const response = await fetch('/mock-data.json');
        const data = await response.json();
        setHealthCheckData(data.healthCheck);
      } catch (error) {
        console.error('Failed to load health check data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHealthCheckData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
    setHealthCheckState(selected);

    if (!healthCheckData) return;

    // 선택된 항목의 카테고리 확인
    const selectedItems = healthCheckData.items.filter(item => selected.includes(item.id));
    const hasCaution = selectedItems.some(item => item.category === 'caution');
    const hasDanger = selectedItems.some(item => item.category === 'danger');

    // 주의 또는 위험 항목이 있으면 안내 화면으로
    if (hasCaution || hasDanger) {
      navigate('/health-check/warning');
    } else {
      // 없음/모르겠어요만 선택 시 바로 녹음 화면으로
      navigate('/health-check/recording');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">로딩 중...</div>
      </div>
    );
  }

  if (!healthCheckData) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f0f3ff]">
        <div className="text-[#666666]">데이터를 불러올 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f3ff]">
      <div>
        <HealthCheckHeader />
        <ProgressIndicator current={1} total={3} />
      </div>

      <ScrollableContainer>
        <DoctorGreeting />
        <div className="px-[24px] pb-[16px] flex flex-col gap-[16px]">
          <CheckboxList
            items={healthCheckData.items}
            selected={selected}
            onChange={setSelected}
          />

          <BottomButton
            text="확인"
            onClick={handleSubmit}
            active={selected.length > 0}
            disabled={selected.length === 0}
          />
        </div>
      </ScrollableContainer>
    </div>
  );
}
