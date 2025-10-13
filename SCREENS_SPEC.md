# 화면별 상세 명세서

## 📱 개요

본 문서는 **내시경 환자 AI 상담 플랫폼**의 모든 화면에 대한 상세 명세를 제공합니다. 각 화면마다 UI 컴포넌트 구조, 상태 관리, 사용자 인터랙션, 데이터 바인딩, 유효성 검증, 에러 처리, 접근성을 포함합니다.

---

## 📄 목차

1. [진입화면 (예약 확인)](#1-진입화면-예약-확인)
2. [검사 안내 - 의사 소개](#2-검사-안내---의사-소개)
3. [검사 안내 - 검사 설명](#3-검사-안내---검사-설명)
4. [동의서 - 체크박스 동의](#4-동의서---체크박스-동의)
5. [동의서 - 전자 서명](#5-동의서---전자-서명)
6. [동의서 - 음성 녹음](#6-동의서---음성-녹음)
7. [동의서 완료](#7-동의서-완료)
8. [AI 상담 화면](#8-ai-상담-화면)

---

## 1. 진입화면 (예약 확인)

### 📍 Figma Reference
- **Node ID**: `77:6188`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-6188&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <IconGlobe />
  </Header>

  <HeroSection>
    <DoctorImage src="/doctor-avatar.png" />
    <Title>
      안녕하세요.
      온라인 <Strong>위/대장 내시경 사전교육</Strong>입니다.
    </Title>
  </HeroSection>

  <InfoCard>
    <CardTitle>예약 정보</CardTitle>
    <InfoRow label="환자 정보">
      <Name>{patientName}</Name>
      <BirthDate>{birthDate}</BirthDate>
    </InfoRow>
    <InfoRow label="예약 병원">
      <HospitalName>{hospitalName}</HospitalName>
    </InfoRow>
    <InfoRow label="검사일">
      <ExaminationDate>{examinationDate}</ExaminationDate>
    </InfoRow>
    <Notice>
      수면내시경 검사 예약이 정상적으로 확인되었습니다.
      검사 당일 안내사항을 준수해 주세요.
    </Notice>
    <PrimaryButton onClick={handleNext}>
      검사 설명 보기 <IconArrowRight />
    </PrimaryButton>
  </InfoCard>
</Screen>
```

---

### 🔧 상태 관리

```typescript
interface WelcomeScreenState {
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;
}

interface PatientData {
  patientId: string;
  name: string;
  birthDate: string;          // "1990.00.00"
  hospitalName: string;
  doctorName: string;
  examinationDate: string;    // "2025. 11.24 (목) 오전 11시"
  examinationType: string;    // "수면 마취수 내과"
}

// Zustand Store
const usePatientStore = create<WelcomeScreenState>((set) => ({
  loading: true,
  error: null,
  patientData: null,
  setPatientData: (data) => set({ patientData: data, loading: false }),
  setError: (error) => set({ error, loading: false })
}));
```

---

### 📡 데이터 로딩

```typescript
// components/WelcomeScreen.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientStore } from '@/store/patient';

export default function WelcomeScreen() {
  const router = useRouter();
  const { loading, error, patientData, setPatientData, setError } = usePatientStore();

  useEffect(() => {
    async function loadPatientData() {
      try {
        // URL에서 토큰 추출
        const token = window.location.pathname.split('/p/')[1];

        // API 호출
        const response = await fetch(`/api/patient/verify-token/${token}`);

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }

        const data = await response.json();
        setPatientData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadPatientData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorScreen message={error} />;
  if (!patientData) return null;

  return <WelcomeScreenUI patientData={patientData} />;
}
```

---

### 🎯 사용자 인터랙션

1. **"검사 설명 보기" 버튼 클릭**
   - 액션: 다음 화면 (의사 소개)으로 이동
   - 트랜지션: Fade-in (300ms)

```typescript
function handleNext() {
  router.push('/examination/doctor-intro');
}
```

2. **언어 변경 (IconGlobe 클릭)**
   - 액션: 언어 선택 모달 표시 (한국어/English)
   - 구현:
```typescript
const [showLanguageModal, setShowLanguageModal] = useState(false);

function handleLanguageChange(locale: 'ko' | 'en') {
  i18n.changeLanguage(locale);
  setShowLanguageModal(false);
}
```

---

### ✅ 유효성 검증

```typescript
// 토큰 검증
function validateToken(token: string): boolean {
  // 1. 토큰 형식 확인 (JWT)
  if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)) {
    throw new Error('Invalid token format');
  }

  // 2. 토큰 만료 확인 (서버에서 처리)
  return true;
}
```

---

### 🚨 에러 처리

```typescript
// 에러 타입별 처리
enum ErrorType {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR'
}

function ErrorScreen({ errorType }: { errorType: ErrorType }) {
  const messages = {
    [ErrorType.TOKEN_EXPIRED]: {
      title: '링크가 만료되었습니다',
      message: '병원에 문의하여 새로운 링크를 받아주세요.',
      action: '병원 연락처 보기'
    },
    [ErrorType.TOKEN_INVALID]: {
      title: '잘못된 접근입니다',
      message: '유효하지 않은 링크입니다. 병원에서 받은 링크를 다시 확인해주세요.',
      action: '다시 시도'
    },
    [ErrorType.NETWORK_ERROR]: {
      title: '네트워크 오류',
      message: '인터넷 연결을 확인하고 다시 시도해주세요.',
      action: '새로고침'
    },
    [ErrorType.SERVER_ERROR]: {
      title: '일시적인 오류가 발생했습니다',
      message: '잠시 후 다시 시도해주세요.',
      action: '새로고침'
    }
  };

  const { title, message, action } = messages[errorType];

  return (
    <ErrorContainer>
      <ErrorIcon />
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      <RetryButton onClick={handleRetry}>{action}</RetryButton>
    </ErrorContainer>
  );
}
```

---

### ♿ 접근성 (Accessibility)

```tsx
<InfoCard role="region" aria-label="예약 정보">
  <CardTitle id="reservation-title">예약 정보</CardTitle>

  <InfoRow aria-labelledby="patient-info-label">
    <Label id="patient-info-label">환자 정보</Label>
    <Value aria-live="polite">{patientName}</Value>
  </InfoRow>

  <PrimaryButton
    onClick={handleNext}
    aria-label="검사 설명 화면으로 이동"
  >
    검사 설명 보기
  </PrimaryButton>
</InfoCard>

// 키보드 네비게이션
<PrimaryButton
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleNext();
    }
  }}
/>
```

---

### 🎬 애니메이션

```tsx
// Framer Motion 사용
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <InfoCard />
</motion.div>

// 의사 이미지
<motion.img
  src="/doctor-avatar.png"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
/>
```

---

## 2. 검사 안내 - 의사 소개

### 📍 Figma Reference
- **Node ID**: `77:9033`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9033&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <PageTitle>검사 설명서</PageTitle>
    <HomeButton />
  </Header>

  <Content>
    <Title>
      이번 <Strong>[내시경 검사]</Strong>는
      박기호 <Strong>원장님</Strong>이 진행합니다.
    </Title>

    <DoctorCard>
      <DoctorImage src="/doctor-photo.png" alt="박기호 원장님" />
      <DoctorInfo>
        <Specialty>의료진: 박기호 원장</Specialty>
        <ExamInfo>검사일자: 2025. 11. 24 (목) 오전 11시</ExamInfo>
      </DoctorInfo>
      <HospitalLogo src="/hospital-logo.png" />
    </DoctorCard>
  </Content>

  <BottomAction>
    <PrimaryButton onClick={handleConfirm}>확인</PrimaryButton>
  </BottomAction>
</Screen>
```

---

### 🔧 상태 관리

```typescript
interface DoctorIntroState {
  doctorData: DoctorData;
}

interface DoctorData {
  name: string;
  specialty: string;
  hospital: string;
  hospitalLogo: string;
  photo: string;
  examinationDate: string;
}

// 의사 정보는 이전 화면에서 받아온 데이터 사용
const { patientData } = usePatientStore();
const doctorData = {
  name: patientData.doctorName,
  specialty: '박기호 원장',
  hospital: patientData.hospitalName,
  hospitalLogo: '/hospital-logo.png',
  photo: '/doctor-photo.png',
  examinationDate: patientData.examinationDate
};
```

---

### 🎯 사용자 인터랙션

1. **뒤로가기 버튼**
```typescript
function handleBack() {
  router.back();
}
```

2. **홈 버튼**
```typescript
function handleHome() {
  if (confirm('처음 화면으로 돌아가시겠습니까?')) {
    router.push('/');
  }
}
```

3. **확인 버튼**
```typescript
function handleConfirm() {
  router.push('/examination/procedure');
}
```

---

### ♿ 접근성

```tsx
<DoctorCard
  role="article"
  aria-label={`담당 의사: ${doctorData.name}`}
>
  <DoctorImage
    src={doctorData.photo}
    alt={`${doctorData.name} 원장님 사진`}
  />
  <DoctorInfo>
    <Specialty aria-label="의료진">{doctorData.specialty}</Specialty>
    <ExamInfo aria-label="검사 일자">{doctorData.examinationDate}</ExamInfo>
  </DoctorInfo>
</DoctorCard>
```

---

## 3. 검사 안내 - 검사 설명

### 📍 Figma Reference
- **Node ID**: `77:9114`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9114&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <PageTitle>검사 설명서</PageTitle>
    <HomeButton />
  </Header>

  <Content>
    <IntroText>
      지금부터 이번 <Strong>[내시경 검사]</Strong>에 대한
      설명과 동의 절차를 진행하겠습니다.
    </IntroText>
    <SubText>
      2-3분 정도 소요되며,
      예약자 본인이 꼭 들으며 숙지해야합니다.
    </SubText>

    <ContentSection>
      <SectionTitle>검사 개요</SectionTitle>
      <SectionContent>
        의식하 진정, 즉 수면 위내시경 검사는 주사로
        수면제를 정맥으로 투여하여 환자의 긴장을 완화시켜 편안한
        상태에서 검사를 받도록 하는 검사가 있습니다. 그러나 환자의
        입으로가 가능한 진정 상태에서 검사를 진행합니다
        ...
      </SectionContent>
    </ContentSection>

    <ContentSection>
      <SectionTitle>진정 효과의 개인차</SectionTitle>
      <SectionContent>
        환자에 따라서 약물에 대한 반응이 다르기 때문에
        얼얼한 양이 약제를 사용했더라도 수면이나
        진정 상태가 충분하지 아니하거나 깊게지, 너어버리 깊은
        진정도가 낮아져 검사 자체가 어려워질 수 있습니다.
      </SectionContent>
    </ContentSection>

    <ContentSection>
      <SectionTitle>가능한 부작용</SectionTitle>
      <SectionContent>
        부작용으로는 호흡곤란, 저산소증 같은 호흡기
        ...
      </SectionContent>
    </ContentSection>
  </Content>

  <Pagination>
    <PageIndicator>다음 1 / 4</PageIndicator>
    <PrimaryButton onClick={handleNext}>다음 1 / 4 <IconArrowRight /></PrimaryButton>
  </Pagination>
</Screen>
```

---

### 🔧 상태 관리

```typescript
interface ExaminationInfoState {
  currentPage: number;
  totalPages: number;
  sections: Section[];
  isLastPage: boolean;
}

interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: '검사 개요',
    content: '의식하 진정, 즉 수면 위내시경 검사는...'
  },
  {
    title: '진정 효과의 개인차',
    content: '환자에 따라서 약물에 대한 반응이...'
  },
  {
    title: '가능한 부작용',
    content: '부작용으로는 호흡곤란, 저산소증...'
  },
  // ... 4 페이지 분량
];

const useExaminationStore = create<ExaminationInfoState>((set) => ({
  currentPage: 1,
  totalPages: 4,
  sections,
  isLastPage: false,
  nextPage: () => set((state) => ({
    currentPage: state.currentPage + 1,
    isLastPage: state.currentPage + 1 === state.totalPages
  })),
  prevPage: () => set((state) => ({
    currentPage: state.currentPage - 1,
    isLastPage: false
  }))
}));
```

---

### 🎯 사용자 인터랙션

1. **다음 버튼**
```typescript
function handleNext() {
  const { currentPage, totalPages, nextPage } = useExaminationStore();

  if (currentPage < totalPages) {
    nextPage();
  } else {
    // 마지막 페이지: 동의서 화면으로 이동
    router.push('/consent/checkbox');
  }
}
```

2. **스와이프 제스처** (모바일)
```typescript
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => handleNext(),
  onSwipedRight: () => handlePrev(),
  preventScrollOnSwipe: true,
  trackMouse: true
});

<Content {...handlers}>
  ...
</Content>
```

---

### 🎬 애니메이션 (페이지 전환)

```tsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={currentPage}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.3 }}
  >
    <ContentSection sections={getCurrentPageSections()} />
  </motion.div>
</AnimatePresence>
```

---

## 4. 동의서 - 체크박스 동의

### 📍 Figma Reference
- **Node ID**: `77:9190`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9190&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <PageTitle>동의서 작성</PageTitle>
    <HomeButton />
  </Header>

  <Content>
    <DocumentIcon />
    <Title>
      추가 검사 및 비용 발생에 대한
      동의가 <Strong>필요해요</Strong>
    </Title>

    <ConsentCard>
      <ConsentLabel required>추가 검사 및 비용발생 동의</ConsentLabel>
      <ConsentContent>
        내시경 검사에서 이상이 발견되면 정확한 진단을
        위하여 즉시 조직검사, 헬리코박터 검사 등 추가
        검사가 발생할 수 있습니다. 이때 추가 비용이 발생
        하게 됩니다. 내시경 검사 중 조직 또는 헬리코박터 검사를
        시행하는 것에 동의하십니까?
      </ConsentContent>

      <OptionGroup>
        <RadioOption
          value="yes"
          checked={agreed === true}
          onChange={() => setAgreed(true)}
        >
          예 (필수)
        </RadioOption>
        <RadioOption
          value="no"
          checked={agreed === false}
          onChange={() => setAgreed(false)}
        >
          아니오
        </RadioOption>
      </OptionGroup>
    </ConsentCard>
  </Content>

  <BottomAction>
    <PrimaryButton
      onClick={handleSubmit}
      disabled={agreed === null}
    >
      필수 동의하기
    </PrimaryButton>
  </BottomAction>
</Screen>
```

---

### 🔧 상태 관리

```typescript
interface ConsentCheckboxState {
  agreed: boolean | null;    // null: 선택 안함, true: 예, false: 아니오
  submitting: boolean;
  error: string | null;
}

const useConsentCheckboxStore = create<ConsentCheckboxState>((set) => ({
  agreed: null,
  submitting: false,
  error: null,
  setAgreed: (agreed) => set({ agreed }),
  submitConsent: async (patientId: string, agreed: boolean) => {
    set({ submitting: true, error: null });
    try {
      const response = await fetch('/api/consent/checkbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, agreed })
      });

      if (!response.ok) throw new Error('Failed to save consent');

      set({ submitting: false });
      return true;
    } catch (error) {
      set({ submitting: false, error: error.message });
      return false;
    }
  }
}));
```

---

### 🎯 사용자 인터랙션

```typescript
async function handleSubmit() {
  const { agreed, submitConsent } = useConsentCheckboxStore();
  const { patientData } = usePatientStore();

  if (agreed === null) {
    alert('동의 여부를 선택해주세요.');
    return;
  }

  const success = await submitConsent(patientData.patientId, agreed);

  if (success) {
    router.push('/consent/signature');
  } else {
    alert('동의서 저장에 실패했습니다. 다시 시도해주세요.');
  }
}
```

---

### ✅ 유효성 검증

```typescript
function validateConsentCheckbox(agreed: boolean | null): { valid: boolean; error?: string } {
  if (agreed === null) {
    return { valid: false, error: '동의 여부를 선택해주세요.' };
  }

  if (agreed === false) {
    // "아니오" 선택 시 추가 확인
    const confirmed = confirm(
      '추가 검사를 동의하지 않으면 검사 진행에 제약이 있을 수 있습니다. 계속하시겠습니까?'
    );
    return { valid: confirmed };
  }

  return { valid: true };
}
```

---

### 🚨 에러 처리

```typescript
function ConsentCheckboxScreen() {
  const { error, submitting } = useConsentCheckboxStore();

  return (
    <>
      {error && (
        <ErrorBanner
          message={error}
          onClose={() => useConsentCheckboxStore.setState({ error: null })}
        />
      )}

      <PrimaryButton
        onClick={handleSubmit}
        disabled={submitting || agreed === null}
        loading={submitting}
      >
        {submitting ? '저장 중...' : '필수 동의하기'}
      </PrimaryButton>
    </>
  );
}
```

---

## 5. 동의서 - 전자 서명

### 📍 Figma Reference
- **Node ID**: `77:10030` (빈 캔버스), `77:10113` (서명 후)
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-10030&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <PageTitle>동의서 작성</PageTitle>
    <HomeButton />
  </Header>

  <Content>
    <PenIcon />
    <Title>
      검사를 진행하기 위해서는
      서명이 <Strong>필요해요</Strong>
    </Title>
    <SubText>서명 영역에 손가락으로 직접 서명해 주세요.</SubText>

    <SignatureCard>
      <SignatureLabel required>전자 서명 입력</SignatureLabel>
      <SignatureCanvas
        ref={signatureCanvasRef}
        penColor="black"
        canvasProps={{
          width: 328,
          height: 200,
          className: 'signature-canvas'
        }}
      />
      <ClearButton onClick={handleClear}>
        지우기 <IconTrash />
      </ClearButton>
    </SignatureCard>
  </Content>

  <BottomAction>
    <PrimaryButton
      onClick={handleSubmit}
      disabled={!hasSignature}
    >
      다음
    </PrimaryButton>
  </BottomAction>
</Screen>
```

---

### 🔧 상태 관리

```typescript
import SignatureCanvas from 'react-signature-canvas';

interface ConsentSignatureState {
  signature: string | null;   // Base64 PNG
  hasSignature: boolean;
  submitting: boolean;
  error: string | null;
}

const useConsentSignatureStore = create<ConsentSignatureState>((set) => ({
  signature: null,
  hasSignature: false,
  submitting: false,
  error: null,
  setSignature: (signature) => set({ signature, hasSignature: !!signature }),
  clearSignature: () => set({ signature: null, hasSignature: false }),
  submitSignature: async (patientId: string, signature: string) => {
    set({ submitting: true, error: null });
    try {
      const response = await fetch('/api/consent/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, signature })
      });

      if (!response.ok) throw new Error('Failed to save signature');

      set({ submitting: false });
      return true;
    } catch (error) {
      set({ submitting: false, error: error.message });
      return false;
    }
  }
}));
```

---

### 🎯 사용자 인터랙션

```typescript
function ConsentSignatureScreen() {
  const signatureCanvasRef = useRef<SignatureCanvas>(null);
  const { hasSignature, setSignature, clearSignature, submitSignature } = useConsentSignatureStore();
  const { patientData } = usePatientStore();

  // 서명 완료 감지
  function handleSignatureEnd() {
    if (signatureCanvasRef.current) {
      const dataURL = signatureCanvasRef.current.toDataURL('image/png');
      setSignature(dataURL);
    }
  }

  // 서명 지우기
  function handleClear() {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      clearSignature();
    }
  }

  // 제출
  async function handleSubmit() {
    if (!hasSignature) {
      alert('서명을 입력해주세요.');
      return;
    }

    const signature = signatureCanvasRef.current?.toDataURL('image/png');
    if (!signature) return;

    const success = await submitSignature(patientData.patientId, signature);

    if (success) {
      router.push('/consent/voice');
    } else {
      alert('서명 저장에 실패했습니다. 다시 시도해주세요.');
    }
  }

  return (
    <SignatureCanvas
      ref={signatureCanvasRef}
      onEnd={handleSignatureEnd}
      penColor="black"
      canvasProps={{
        width: 328,
        height: 200,
        className: 'signature-canvas'
      }}
    />
  );
}
```

---

### ✅ 유효성 검증

```typescript
function validateSignature(signatureCanvas: SignatureCanvas | null): { valid: boolean; error?: string } {
  if (!signatureCanvas) {
    return { valid: false, error: '서명 캔버스를 찾을 수 없습니다.' };
  }

  // 서명이 비어있는지 확인
  if (signatureCanvas.isEmpty()) {
    return { valid: false, error: '서명을 입력해주세요.' };
  }

  // 서명 크기 확인 (너무 작은 서명 방지)
  const dataURL = signatureCanvas.toDataURL();
  const byteSize = (dataURL.length * 3) / 4 - 2; // Base64 → Bytes

  if (byteSize < 1000) {
    return { valid: false, error: '서명이 너무 작습니다. 다시 입력해주세요.' };
  }

  return { valid: true };
}
```

---

### 🎬 서명 애니메이션

```css
/* 서명 캔버스 스타일 */
.signature-canvas {
  border: 2px dashed #6490ff;
  border-radius: 8px;
  background: #ffffff;
  cursor: crosshair;
  touch-action: none; /* 모바일 스크롤 방지 */
}

.signature-canvas:active {
  border-color: #4070ff;
  box-shadow: 0 0 0 4px rgba(100, 144, 255, 0.1);
}
```

---

## 6. 동의서 - 음성 녹음

### 📍 Figma Reference
- **Node ID**: `77:9266` (녹음 전), `89:5995` (녹음 중), `89:6061` (녹음 완료)
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9266&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <PageTitle>동의서 작성</PageTitle>
    <HomeButton />
  </Header>

  <Content>
    <MicIcon />
    <Title>
      검사를 진행하기 위해서는
      음성 녹음 동의가 <Strong>필요해요</Strong>
    </Title>
    <SubText>아래 문구를 음성으로 녹음하여 동의해 주세요</SubText>

    <VoiceCard>
      <VoiceLabel required>녹음</VoiceLabel>
      <VoiceContent>
        "저는 [내시경 검사]에 대한 설명을 충분히 들었으며,
        검사의 목적/성명, 주의사항을 이해하여 동의합니다.
        이에 검사 및 치료에 동의합니다."
      </VoiceContent>

      {recordingState === 'idle' && (
        <RecordButton onClick={handleStartRecording}>
          녹음 시작 <IconMic />
        </RecordButton>
      )}

      {recordingState === 'recording' && (
        <>
          <WaveformVisualizer />
          <Timer>{formatTime(recordingTime)}</Timer>
          <StopButton onClick={handleStopRecording}>
            녹음중 <IconStop />
          </StopButton>
        </>
      )}

      {recordingState === 'completed' && (
        <>
          <AudioPlayer src={audioURL} />
          <Duration>{formatTime(audioDuration)}</Duration>
          <RetryButton onClick={handleRetryRecording}>
            다시 녹음하기 <IconRefresh />
          </RetryButton>
        </>
      )}
    </VoiceCard>
  </Content>

  <BottomAction>
    <PrimaryButton
      onClick={handleSubmit}
      disabled={recordingState !== 'completed'}
    >
      다음
    </PrimaryButton>
  </BottomAction>
</Screen>
```

---

### 🔧 상태 관리

```typescript
type RecordingState = 'idle' | 'recording' | 'completed';

interface ConsentVoiceState {
  recordingState: RecordingState;
  audioBlob: Blob | null;
  audioURL: string | null;
  recordingTime: number;      // 초 단위
  audioDuration: number;       // 초 단위
  submitting: boolean;
  error: string | null;
}

const useConsentVoiceStore = create<ConsentVoiceState>((set) => ({
  recordingState: 'idle',
  audioBlob: null,
  audioURL: null,
  recordingTime: 0,
  audioDuration: 0,
  submitting: false,
  error: null,
  setRecordingState: (state) => set({ recordingState: state }),
  setAudio: (blob, url, duration) => set({ audioBlob: blob, audioURL: url, audioDuration: duration }),
  incrementRecordingTime: () => set((state) => ({ recordingTime: state.recordingTime + 1 })),
  resetRecording: () => set({
    recordingState: 'idle',
    audioBlob: null,
    audioURL: null,
    recordingTime: 0,
    audioDuration: 0
  })
}));
```

---

### 🎯 사용자 인터랙션

```typescript
function ConsentVoiceScreen() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    recordingState,
    recordingTime,
    setRecordingState,
    setAudio,
    incrementRecordingTime,
    resetRecording,
    submitVoice
  } = useConsentVoiceStore();

  // 녹음 시작
  async function handleStartRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(audioBlob);

        // 오디오 길이 계산
        const audio = new Audio(audioURL);
        audio.addEventListener('loadedmetadata', () => {
          setAudio(audioBlob, audioURL, audio.duration);
        });

        setRecordingState('completed');
      };

      mediaRecorderRef.current.start();
      setRecordingState('recording');

      // 타이머 시작
      timerRef.current = setInterval(() => {
        incrementRecordingTime();
      }, 1000);

    } catch (error) {
      alert('마이크 접근 권한이 필요합니다.');
      console.error('Microphone access error:', error);
    }
  }

  // 녹음 중지
  function handleStopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }

  // 다시 녹음
  function handleRetryRecording() {
    resetRecording();
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  }

  // 제출
  async function handleSubmit() {
    if (recordingState !== 'completed' || !audioBlob) {
      alert('음성 녹음을 완료해주세요.');
      return;
    }

    const { patientData } = usePatientStore();
    const success = await submitVoice(patientData.patientId, audioBlob);

    if (success) {
      router.push('/consent/complete');
    } else {
      alert('음성 녹음 저장에 실패했습니다. 다시 시도해주세요.');
    }
  }

  return (
    // ... UI 렌더링
  );
}
```

---

### ✅ 유효성 검증

```typescript
function validateVoiceRecording(audioBlob: Blob | null, duration: number): { valid: boolean; error?: string } {
  if (!audioBlob) {
    return { valid: false, error: '음성 녹음을 완료해주세요.' };
  }

  // 최소 길이 확인 (5초 이상)
  if (duration < 5) {
    return { valid: false, error: '녹음 시간이 너무 짧습니다. 문구를 천천히 낭독해주세요.' };
  }

  // 최대 길이 확인 (2분 이하)
  if (duration > 120) {
    return { valid: false, error: '녹음 시간이 너무 깁니다. 다시 녹음해주세요.' };
  }

  // 파일 크기 확인 (10MB 이하)
  if (audioBlob.size > 10 * 1024 * 1024) {
    return { valid: false, error: '파일 크기가 너무 큽니다.' };
  }

  return { valid: true };
}
```

---

### 🎬 Waveform Visualizer

```typescript
import { useEffect, useRef } from 'react';

function WaveformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = Array(32).fill(0).map(() => Math.random());

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bars = bars.map((bar, i) => {
        const target = Math.random() * 0.8 + 0.2;
        return bar + (target - bar) * 0.1;
      });

      bars.forEach((bar, i) => {
        const x = (i * canvas.width) / bars.length;
        const height = bar * canvas.height;
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x, y, 8, height);
      });

      animationIdRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} width={328} height={60} />;
}
```

---

## 7. 동의서 완료

### 📍 Figma Reference
- **Node ID**: `89:6350`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6350&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <HomeButton />
  </Header>

  <Content>
    <SuccessIcon />
    <Title>
      내시경 설명 및 동의서 작성이
      모두 마무리 되었습니다!
    </Title>

    <DoctorImage src="/doctor-avatar.png" />
    <SpeechBubble>
      AI 의사에게
      궁금한 점을 물어보세요
    </SpeechBubble>
  </Content>

  <BottomActions>
    <SecondaryButton onClick={handleAdditionalInquiry}>
      추가 문의하기
    </SecondaryButton>
    <PrimaryButton onClick={handleComplete}>
      완료
    </PrimaryButton>
  </BottomActions>
</Screen>
```

---

### 🎯 사용자 인터랙션

```typescript
function ConsentCompleteScreen() {
  const router = useRouter();

  // 추가 문의 (AI 상담)
  function handleAdditionalInquiry() {
    router.push('/consultation/ai');
  }

  // 완료 (종료)
  function handleComplete() {
    // 완료 로그 저장
    logCompletion();

    // 종료 확인
    if (confirm('검사 사전교육을 완료하시겠습니까?')) {
      window.close(); // 탭/창 닫기
      // 또는 종료 화면으로 이동
      // router.push('/thank-you');
    }
  }

  async function logCompletion() {
    const { patientData } = usePatientStore();
    await fetch('/api/patient/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientData.patientId,
        completedAt: new Date().toISOString()
      })
    });
  }

  return (
    // ... UI 렌더링
  );
}
```

---

## 8. AI 상담 화면

### 📍 Figma Reference
- **Node ID**: `89:6570`
- **URL**: https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6570&m=dev

### 🎨 UI 구조

```tsx
<Screen>
  <Header>
    <BackButton />
    <HomeButton />
  </Header>

  <UnityWebGLContainer>
    <UnityWebGL />
  </UnityWebGLContainer>

  <StatusIndicator>
    {listeningState === 'listening' && <Icon>듣고 있어요</Icon>}
    {listeningState === 'speaking' && <Icon>말하고 있어요</Icon>}
  </StatusIndicator>

  <Overlay>
    <TopSection>
      <InstructionText>
        추가로 궁금한 사항을 말씀해주세요
        <SubText>수면 내시경도 고통을 느낄 수 있나요?</SubText>
      </InstructionText>
    </TopSection>

    <BottomActions>
      <SecondaryButton onClick={handleInterrupt}>
        답변 멈추기 <IconMute />
      </SecondaryButton>
      <PrimaryButton onClick={handleEnd}>
        끝내기
      </PrimaryButton>
    </BottomActions>
  </Overlay>
</Screen>
```

---

### 🔧 상태 관리

```typescript
type ListeningState = 'idle' | 'listening' | 'speaking';

interface AIConsultationState {
  listeningState: ListeningState;
  livekitConnected: boolean;
  livekitToken: string | null;
  conversationLog: Message[];
  error: string | null;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

const useAIConsultationStore = create<AIConsultationState>((set) => ({
  listeningState: 'idle',
  livekitConnected: false,
  livekitToken: null,
  conversationLog: [],
  error: null,
  setListeningState: (state) => set({ listeningState: state }),
  setLivekitConnected: (connected) => set({ livekitConnected: connected }),
  setLivekitToken: (token) => set({ livekitToken: token }),
  addMessage: (message) => set((state) => ({
    conversationLog: [...state.conversationLog, message]
  }))
}));
```

---

### 📡 LiveKit 연결

```typescript
import { Room, RoomEvent } from 'livekit-client';

function AIConsultationScreen() {
  const roomRef = useRef<Room | null>(null);
  const { setLivekitConnected, setLivekitToken, addMessage } = useAIConsultationStore();
  const { patientData } = usePatientStore();

  useEffect(() => {
    async function connectToLiveKit() {
      try {
        // 1. LiveKit 토큰 요청
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomName: `consultation-${patientData.patientId}`,
            identity: patientData.patientId
          })
        });

        const { token } = await response.json();
        setLivekitToken(token);

        // 2. Room 연결
        const room = new Room();
        roomRef.current = room;

        room.on(RoomEvent.Connected, () => {
          console.log('Connected to LiveKit room');
          setLivekitConnected(true);
        });

        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === 'audio' && participant.identity.startsWith('agent')) {
            // Agent의 오디오 트랙 수신
            const audioElement = track.attach();
            document.body.appendChild(audioElement);
          }
        });

        room.on(RoomEvent.DataReceived, (payload, participant) => {
          // Agent로부터 메시지 수신
          const message = JSON.parse(new TextDecoder().decode(payload));
          addMessage({
            role: 'agent',
            content: message.text,
            timestamp: Date.now()
          });
        });

        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);

      } catch (error) {
        console.error('LiveKit connection error:', error);
        alert('AI 상담 연결에 실패했습니다.');
      }
    }

    connectToLiveKit();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  return (
    // ... UI 렌더링
  );
}
```

---

### 🎯 사용자 인터랙션

```typescript
// 답변 중단 (Interrupt)
async function handleInterrupt() {
  if (!roomRef.current) return;

  try {
    // Agent에게 RPC 호출
    await roomRef.current.localParticipant.performRpc({
      destinationIdentity: 'agent',
      method: 'interrupt',
      payload: ''
    });

    console.log('Interrupt signal sent to agent');
  } catch (error) {
    console.error('Failed to send interrupt:', error);
  }
}

// 상담 종료
async function handleEnd() {
  if (confirm('상담을 종료하시겠습니까?')) {
    // 1. 상담 기록 저장
    const { conversationLog } = useAIConsultationStore();
    await fetch('/api/consultation/save-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patientData.patientId,
        conversationLog,
        endedAt: new Date().toISOString()
      })
    });

    // 2. LiveKit Room 연결 해제
    if (roomRef.current) {
      roomRef.current.disconnect();
    }

    // 3. 완료 화면으로 이동
    router.push('/thank-you');
  }
}
```

---

### 🎮 Unity WebGL 통합

```typescript
import { Unity, useUnityContext } from 'react-unity-webgl';

function UnityWebGLComponent() {
  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: '/unity/Build.loader.js',
    dataUrl: '/unity/Build.data',
    frameworkUrl: '/unity/Build.framework.js',
    codeUrl: '/unity/Build.wasm'
  });

  // Unity → React 통신
  useEffect(() => {
    function handleUnityMessage(message: string) {
      console.log('Message from Unity:', message);

      // 예: 아바타 립싱크 완료 이벤트
      if (message === 'LipSyncComplete') {
        setListeningState('idle');
      }
    }

    addEventListener('UnityMessage', handleUnityMessage);

    return () => {
      removeEventListener('UnityMessage', handleUnityMessage);
    };
  }, []);

  // React → Unity 통신
  function sendAudioToUnity(audioData: Float32Array) {
    // Unity의 "AvatarController" GameObject에 "PlayLipSync" 메서드 호출
    sendMessage('AvatarController', 'PlayLipSync', JSON.stringify(Array.from(audioData)));
  }

  return (
    <Unity
      unityProvider={unityProvider}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
```

---

### 🚨 에러 처리

```typescript
// LiveKit 연결 실패
function handleLivekitError(error: Error) {
  console.error('LiveKit error:', error);

  const errorMessages = {
    'connection-failed': '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
    'token-expired': '인증이 만료되었습니다. 다시 시도해주세요.',
    'microphone-access-denied': '마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.',
    'unknown': '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.'
  };

  const message = errorMessages[error.message] || errorMessages.unknown;

  return (
    <ErrorScreen
      title="연결 오류"
      message={message}
      action="다시 시도"
      onRetry={() => window.location.reload()}
    />
  );
}
```

---

### ♿ 접근성

```tsx
<AIConsultationScreen
  role="application"
  aria-label="AI 의사 상담"
>
  <StatusIndicator
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    {listeningState === 'listening' && '듣고 있습니다'}
    {listeningState === 'speaking' && 'AI 의사가 답변 중입니다'}
  </StatusIndicator>

  <SecondaryButton
    onClick={handleInterrupt}
    aria-label="AI 의사 답변 중단"
  >
    답변 멈추기
  </SecondaryButton>

  <PrimaryButton
    onClick={handleEnd}
    aria-label="AI 상담 종료"
  >
    끝내기
  </PrimaryButton>
</AIConsultationScreen>
```

---

## 🎨 공통 컴포넌트

### Header 컴포넌트

```tsx
interface HeaderProps {
  showBack?: boolean;
  showHome?: boolean;
  showLanguage?: boolean;
  title?: string;
}

function Header({ showBack = true, showHome = true, showLanguage = false, title }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-5 py-3 h-16">
      {showBack ? (
        <button onClick={() => router.back()} aria-label="뒤로가기">
          <IconArrowLeft />
        </button>
      ) : (
        <div />
      )}

      {title && <h1 className="text-lg font-bold">{title}</h1>}

      <div className="flex gap-3">
        {showLanguage && (
          <button onClick={handleLanguageChange} aria-label="언어 변경">
            <IconGlobe />
          </button>
        )}
        {showHome && (
          <button onClick={() => router.push('/')} aria-label="홈으로">
            <IconHome />
          </button>
        )}
      </div>
    </header>
  );
}
```

---

### Button 컴포넌트

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ variant = 'primary', size = 'large', disabled, loading, onClick, children }: ButtonProps) {
  const baseStyles = 'rounded-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#6490ff] text-white hover:bg-[#4070ff]',
    secondary: 'bg-white text-[#6490ff] border-2 border-[#6490ff] hover:bg-[#f0f3ff]'
  };

  const sizeStyles = {
    medium: 'h-12 px-5 text-base',
    large: 'h-14 px-6 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
```

---

## 📝 요약

이 문서는 내시경 환자 AI 상담 플랫폼의 모든 화면에 대한 상세한 구현 명세를 제공합니다. 각 화면은 다음을 포함합니다:

- ✅ UI 컴포넌트 구조 (TSX/React)
- ✅ 상태 관리 (Zustand)
- ✅ 데이터 로딩 및 API 통합
- ✅ 사용자 인터랙션 핸들러
- ✅ 유효성 검증 로직
- ✅ 에러 처리 및 폴백
- ✅ 접근성 (ARIA, 키보드 네비게이션)
- ✅ 애니메이션 (Framer Motion)

개발 시 이 문서를 참고하여 각 화면을 구현하면 됩니다.

---

## 📞 문의

화면 명세 관련 문의사항은 다음으로 연락 주시기 바랍니다:
- **Frontend Lead**: [frontend@example.com]
- **Slack**: #mirabel-frontend
