# Figma 추출 코드 사용 가이드

## 🎉 완료된 화면 목록

모든 화면이 **Figma 디자인과 픽셀 퍼펙트**하게 추출되었습니다!

| 화면 | 파일명 | Figma Node ID | 상태 |
|------|--------|--------------|------|
| 진입화면 (예약 확인) | `Home.tsx` | 77-6188 | ✅ 완료 |
| 검사 안내 - 의사 소개 | `DoctorIntro.tsx` | 77-9033 | ✅ 완료 |
| 검사 안내 - 검사 설명 | `ExaminationInfo.tsx` | 77-9114 | ✅ 완료 |
| 동의서 - 체크박스 동의 | `ConsentCheckbox.tsx` | 77-9190 | ✅ 완료 |
| 동의서 - 전자 서명 | `ConsentSignature.tsx` | 77-10030 | ✅ 완료 |
| 동의서 - 음성 녹음 | `ConsentVoice.tsx` | 77-9266, 89-5995, 89-6061 | ✅ 완료 |
| 동의서 완료 | `ConsentComplete.tsx` | 89-6350 | ✅ 완료 |
| AI 상담 | `AIConsultation.tsx` | 89-6570 | ✅ 완료 |

---

## 📂 파일 구조

```
demo/figma-extracted/
├── Home.tsx                # 진입화면
├── DoctorIntro.tsx         # 의사 소개
├── ExaminationInfo.tsx     # 검사 설명 (페이지네이션)
├── ConsentCheckbox.tsx     # 체크박스 동의
├── ConsentSignature.tsx    # 전자 서명 (react-signature-canvas 사용)
├── ConsentVoice.tsx        # 음성 녹음 (3가지 상태 포함)
├── ConsentComplete.tsx     # 동의서 완료
├── AIConsultation.tsx      # AI 상담 (데모: 2D 이미지)
└── README_FIGMA_CODE.md    # 이 파일
```

---

## 🚀 사용 방법

### 1. Next.js 프로젝트에 통합

```bash
# 1. 파일 복사
cp figma-extracted/*.tsx ../mirabel-demo/app/

# 또는 각 파일을 적절한 위치로:
cp Home.tsx ../mirabel-demo/app/page.tsx
cp DoctorIntro.tsx ../mirabel-demo/app/examination/doctor-intro/page.tsx
cp ExaminationInfo.tsx ../mirabel-demo/app/examination/procedure/page.tsx
cp ConsentCheckbox.tsx ../mirabel-demo/app/consent/checkbox/page.tsx
cp ConsentSignature.tsx ../mirabel-demo/app/consent/signature/page.tsx
cp ConsentVoice.tsx ../mirabel-demo/app/consent/voice/page.tsx
cp ConsentComplete.tsx ../mirabel-demo/app/consent/complete/page.tsx
cp AIConsultation.tsx ../mirabel-demo/app/consultation/ai/page.tsx
```

---

### 2. 이미지 Assets 처리

**문제**: Figma 이미지가 `http://localhost:3845/assets/` 경로로 되어 있음

**해결책 Option 1: 이미지 다운로드 (추천)**
```bash
# 각 화면에서 사용된 이미지를 다운로드하여 public/images/로 이동
# 예시:
# imgDoctorAvatar.png
# imgDoctorPhoto.png
# imgIconArrowLeft.svg
# imgIconHome.svg
# 등등...

# 그 다음 코드에서 경로 수정:
const imgDoctorAvatar = "/images/doctor-avatar.png";
const imgIconArrowLeft = "/images/icon-arrow-left.svg";
```

**해결책 Option 2: Figma에서 직접 Export**
```
1. Figma 파일 열기
2. 각 이미지 레이어 선택
3. 우클릭 → Export → PNG/SVG
4. public/images/ 폴더에 저장
```

**해결책 Option 3: 로컬호스트 유지 (개발 중에만)**
```typescript
// Figma Desktop App이 실행 중이면 localhost:3845 접근 가능
// 배포 전에 반드시 실제 이미지로 교체 필요!
```

---

### 3. 필수 의존성 확인

각 화면에서 사용하는 라이브러리:

```bash
# 이미 설치했어야 함
npm install zustand                      # 상태 관리
npm install react-signature-canvas       # ConsentSignature.tsx
npm install @types/react-signature-canvas -D

# Next.js 기본 제공
# - useRouter (next/navigation)
# - Image (next/image) - 필요 시 사용
```

---

### 4. 상태 관리 Store 생성

**lib/store/patient-store.ts** (필수)
```typescript
import { create } from 'zustand';
import { PatientData } from '@/lib/api/types';

interface PatientStore {
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;
  loadPatientData: (token: string) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set) => ({
  loading: false,
  error: null,
  patientData: null,
  loadPatientData: async (token: string) => {
    set({ loading: true });
    try {
      const response = await fetch('/mock-data.json');
      const data = await response.json();
      set({ patientData: data.patient, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

---

### 5. Mock API 구현

**lib/api/mock-api.ts** (필수)
```typescript
export const apiClient = {
  async getPatientInfo(token: string) {
    const response = await fetch('/mock-data.json');
    const data = await response.json();
    return data.patient;
  },

  async saveCheckboxConsent(data: any) {
    localStorage.setItem('consent-checkbox', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500)); // API 시뮬레이션
    return { consentId: `MOCK_CB_${Date.now()}`, success: true };
  },

  async saveSignature(data: any) {
    localStorage.setItem('consent-signature', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));
    return { consentId: `MOCK_SIG_${Date.now()}`, success: true };
  },

  async saveVoiceRecording(data: any) {
    localStorage.setItem('consent-voice', JSON.stringify(data));
    await new Promise(resolve => setTimeout(resolve, 500));
    return { consentId: `MOCK_VOICE_${Date.now()}`, success: true };
  }
};
```

---

### 6. TypeScript 타입 정의

**lib/api/types.ts** (필수)
```typescript
export interface PatientData {
  patientId: string;
  name: string;
  birthDate: string;
  phoneNumber: string;
  appointment: {
    appointmentId: string;
    hospitalName: string;
    hospitalLogo: string;
    doctorName: string;
    doctorPhoto: string;
    doctorSpecialty: string;
    examinationDate: string;
    examinationType: string;
  };
}

export interface ConsentCheckboxData {
  patientId: string;
  agreed: boolean;
  consentText: string;
  timestamp: string;
}

export interface SignatureData {
  patientId: string;
  signature: string;
  timestamp: string;
}

export interface VoiceData {
  patientId: string;
  duration: number;
  timestamp: string;
}
```

---

## 🎨 Tailwind CSS 설정

**tailwind.config.ts** 수정 필요:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6490ff',
          hover: '#4070ff',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 📝 화면별 특이사항

### Home.tsx (진입화면)
- ✅ Figma 레이아웃 그대로
- ⚠️ 의사 아바타 이미지 절대 위치 (`absolute`) 사용
- 🔧 `usePatientStore`로 환자 정보 로드

### DoctorIntro.tsx (의사 소개)
- ✅ 심플한 구조
- 🖼️ 의사 사진 `aspect-[768/580]` 비율 유지

### ExaminationInfo.tsx (검사 설명)
- ✅ 페이지네이션 기능 포함 (useState)
- 📄 `examinationPages` 배열로 페이지 관리
- 🔧 마지막 페이지에서 동의서로 자동 이동

### ConsentCheckbox.tsx (체크박스 동의)
- ✅ 커스텀 체크박스 UI (Figma 디자인)
- 🔧 `agreed` 상태로 선택 관리
- ⚠️ "아니오" 선택 시 확인 다이얼로그

### ConsentSignature.tsx (전자 서명)
- ✅ `react-signature-canvas` 라이브러리 사용
- 🖊️ 서명 캔버스 위치: 점선 border
- 🗑️ 지우기 버튼 포함
- 🔧 서명 완료 시 "다음" 버튼 활성화

### ConsentVoice.tsx (음성 녹음)
- ✅ **3가지 상태** 포함:
  1. `idle`: 녹음 전 (녹음 시작 버튼)
  2. `recording`: 녹음 중 (Waveform 애니메이션, 빨간 버튼)
  3. `completed`: 녹음 완료 (재생 버튼, 다시 녹음하기)
- 🎙️ MediaRecorder API 사용
- ⏱️ 타이머 기능
- 🌊 Waveform 시각화 (Figma 디자인)

### ConsentComplete.tsx (동의서 완료)
- ✅ 완료 아이콘 (체크 마크)
- 🗨️ 말풍선 툴팁 (CSS로 구현)
- 🤖 의사 아바타 이미지 (2D, 3D 아님!)
- 🔀 2개 버튼: "추가 문의하기" / "완료"

### AIConsultation.tsx (AI 상담)
- ⚠️ **데모 버전**: 2D 이미지 사용
- 🔧 **실제 버전**: Unity WebGL로 교체 필요
- 📡 LiveKit 연동은 `LIVEKIT_INTEGRATION.md` 참고
- 💬 상태 인디케이터: "듣고 있어요" / "말하고 있어요"

---

## 🔧 실제 프로젝트 적용 단계

### Step 1: 프로젝트 셋업
```bash
# Next.js 프로젝트 생성
npx create-next-app@latest mirabel-demo --typescript --tailwind --app
cd mirabel-demo

# 의존성 설치
npm install zustand react-signature-canvas
npm install -D @types/react-signature-canvas
```

### Step 2: 디렉토리 구조 생성
```bash
mkdir -p lib/api lib/store lib/utils
mkdir -p public/images
```

### Step 3: 파일 복사
```bash
# 이 폴더의 파일들을 Next.js 프로젝트로 복사
# app/ 폴더 구조에 맞게 배치
```

### Step 4: 이미지 처리
```bash
# Option A: Figma에서 직접 Export
# 1. Figma에서 이미지 선택
# 2. Export → PNG/SVG
# 3. public/images/로 저장

# Option B: Figma localhost 이미지를 다운로드
# 브라우저에서 http://localhost:3845/assets/... 접속하여 다운로드
```

### Step 5: 상태 관리 및 API 구현
```bash
# lib/store/patient-store.ts 생성
# lib/api/mock-api.ts 생성
# lib/api/types.ts 생성
```

### Step 6: Mock 데이터 준비
```bash
# public/mock-data.json 복사
cp ../mock-data.json public/
```

### Step 7: 실행 및 테스트
```bash
npm run dev
# http://localhost:3000 접속
```

---

## ⚠️ 주의사항

### 1. 이미지 경로 변경 필수
모든 `.tsx` 파일에서 이미지 경로를 수정해야 합니다:

```typescript
// Before (Figma localhost)
const imgDoctorAvatar = "http://localhost:3845/assets/566b019...png";

// After (실제 프로젝트)
const imgDoctorAvatar = "/images/doctor-avatar.png";
```

**일괄 변경 스크립트:**
```bash
# VSCode에서 전체 검색 (Ctrl+Shift+F)
# 검색: http://localhost:3845/assets/
# 교체: /images/

# 그 다음 각 이미지를 다운로드하여 public/images/에 저장
```

---

### 2. 폰트 설정

**Noto Sans KR** 및 **Pretendard** 폰트 로드 필요:

**app/layout.tsx**:
```tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

**Pretendard 추가** (styles/globals.css):
```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
```

---

### 3. 반응형 레이아웃

현재 코드는 **360px 고정 너비**입니다. 반응형으로 만들려면:

```tsx
// Before (고정)
<div className="w-[360px]">

// After (반응형)
<div className="max-w-[360px] w-full mx-auto">
```

---

### 4. 실제 API 연동

Mock API를 실제 API로 교체:

```typescript
// lib/api/mock-api.ts → lib/api/real-api.ts

export const apiClient = {
  async getPatientInfo(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/verify-token/${token}`);
    return response.json();
  },

  async saveCheckboxConsent(data: ConsentCheckboxData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consent/checkbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // ... 나머지 메서드
};
```
---

## 🐛 알려진 이슈 및 해결책

### Issue 1: 폰트가 제대로 안 보임
**원인**: Noto Sans KR, Pretendard 폰트 미설치

**해결**:
```tsx
// app/layout.tsx에서 폰트 import
import { Noto_Sans_KR } from 'next/font/google';
```

---

### Issue 2: 이미지가 안 보임
**원인**: localhost:3845 경로가 작동하지 않음

**해결**:
```bash
# Figma Desktop App 실행 확인
# 또는 이미지를 직접 다운로드하여 public/images/로 이동
```

---

### Issue 3: 서명 캔버스가 작동하지 않음
**원인**: react-signature-canvas 설치 안 됨

**해결**:
```bash
npm install react-signature-canvas @types/react-signature-canvas
```

---

### Issue 4: 음성 녹음이 안 됨
**원인**: HTTPS 없이는 MediaRecorder API 작동 안 함

**해결**:
```bash
# 로컬 개발 시 localhost는 허용됨
# 배포 시 반드시 HTTPS 사용 (Vercel은 자동 HTTPS)
```

---

## 🚀 배포 준비

### Vercel 배포
```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 배포
vercel deploy --prod

# 3. 환경 변수 설정 (Vercel Dashboard)
# NEXT_PUBLIC_API_URL (추후 실제 API 연동 시)
```

### 환경 변수
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_API_URL=https://api.mirabel.com (추후)
```

---

## 🎓 학습 자료

- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand
- **react-signature-canvas**: https://www.npmjs.com/package/react-signature-canvas
