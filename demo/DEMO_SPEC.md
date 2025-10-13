# 프론트엔드 데모 명세서

## 🎯 데모 목적

이 데모는 백엔드/LiveKit 없이 **순수 프론트엔드만으로** 내시경 환자 AI 상담 플랫폼의 UI/UX를 검증하기 위한 프로토타입입니다.

### 주요 목표
1. ✅ **빠른 프로토타이핑**: 1-2일 안에 작동하는 데모 완성
2. ✅ **UI/UX 검증**: 실제 사용자 플로우 테스트
3. ✅ **프레젠테이션**: 병원/투자자 대상 시연
4. ⚠️ **확장 가능한 구조**: 추후 백엔드 연동 시 최소한의 수정으로 전환 가능

---

## 🛠 기술 스택

### Core (필수)
```json
{
  "framework": "Next.js 14.x (App Router)",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.x",
  "stateManagement": "Zustand 4.x"
}
```

### Additional Libraries
```json
{
  "signature": "react-signature-canvas (필수 - 전자 서명)"
}
```

**Note**: Figma 추출 코드는 위 라이브러리만 사용합니다. 추가 애니메이션이 필요하면 Framer Motion 설치 가능.

---

## 📁 프로젝트 구조

```
demo/
├── figma-extracted/              # ⭐ Figma 추출 코드 (픽셀 퍼펙트)
│   ├── Home.tsx                 # 진입화면 (77-6188)
│   ├── DoctorIntro.tsx          # 의사 소개 (77-9033)
│   ├── ExaminationInfo.tsx      # 검사 설명 (77-9114)
│   ├── ConsentCheckbox.tsx      # 체크박스 동의 (77-9190)
│   ├── ConsentSignature.tsx     # 전자 서명 (77-10030)
│   ├── ConsentVoice.tsx         # 음성 녹음 (77-9266, 89-5995, 89-6061)
│   ├── ConsentComplete.tsx      # 동의서 완료 (89-6350)
│   ├── AIConsultation.tsx       # AI 상담 (89-6570)
│   └── README_FIGMA_CODE.md     # 사용 가이드
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # 진입화면 (Home)
│   ├── examination/
│   │   ├── doctor-intro/page.tsx
│   │   └── procedure/page.tsx
│   ├── consent/
│   │   ├── checkbox/page.tsx
│   │   ├── signature/page.tsx
│   │   ├── voice/page.tsx
│   │   └── complete/page.tsx
│   └── consultation/
│       └── ai/page.tsx
├── components/                   # React 컴포넌트
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Button.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   └── InfoCard.tsx
│   ├── consent/
│   │   ├── SignatureCanvas.tsx
│   │   └── VoiceRecorder.tsx
│   └── consultation/
│       └── AIAvatarMock.tsx
├── lib/                          # 유틸리티 및 서비스
│   ├── api/
│   │   ├── mock-api.ts          # Mock API (추후 실제 API로 교체)
│   │   └── types.ts             # API 타입 정의 (API_SPEC.md와 일치)
│   ├── store/
│   │   ├── patient-store.ts
│   │   └── consent-store.ts
│   └── utils/
│       ├── validation.ts
│       └── format.ts
├── public/
│   ├── images/                   # 이미지 assets
│   │   ├── doctor-avatar.png
│   │   └── hospital-logo.png
│   └── mock-data.json           # Mock 데이터
└── styles/
    └── globals.css
```

---

## 🎭 Mock 전략 (확장 가능)

### 핵심 원칙
1. **API 레이어 분리**: Mock API와 Real API를 인터페이스로 분리하여 쉽게 교체 가능
2. **타입 정의**: API_SPEC.md와 동일한 TypeScript 타입 사용
3. **상태 관리**: Zustand로 전역 상태 관리

**상세 구현 코드**: `figma-extracted/README_FIGMA_CODE.md` 참고

---

## 📄 화면별 Mock 전략

### 모든 화면 구현 완료
8개 화면이 **Figma에서 자동 추출**되어 `figma-extracted/` 폴더에 준비되어 있습니다:

1. **진입화면** (`Home.tsx`) - Mock: `mock-data.json`에서 환자 정보 로드
2. **검사 안내** (`DoctorIntro.tsx`, `ExaminationInfo.tsx`) - Mock: `mock-data.json`에서 검사 설명 로드
3. **동의서** (`ConsentCheckbox.tsx`, `ConsentSignature.tsx`, `ConsentVoice.tsx`) - Mock: `localStorage`에 저장
4. **동의서 완료** (`ConsentComplete.tsx`) - 완료 메시지 표시
5. **AI 상담** (`AIConsultation.tsx`) - Mock: 2D 이미지 + 상태 인디케이터

**각 화면의 상세 구현**: `figma-extracted/` 폴더의 각 `.tsx` 파일 참고

---

## 🚀 배포 전략

### Vercel (추천)
```bash
# 프로젝트 루트에서
npx vercel deploy

# 환경 변수 설정
NEXT_PUBLIC_USE_MOCK_API=true
```

### Netlify
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## ⚡ 확장 가능성

### 1. Mock → Real API 전환
```typescript
// .env.local
NEXT_PUBLIC_USE_MOCK_API=false  # Mock 비활성화
NEXT_PUBLIC_API_URL=https://api.mirabel.com
```

### 2. 점진적 전환
```typescript
// 일부 API만 실제 연동
export const apiClient = {
  getPatientInfo: mockApiClient.getPatientInfo,     // Still mock
  saveCheckboxConsent: realApiClient.saveCheckboxConsent, // Real API
  saveSignature: realApiClient.saveSignature,       // Real API
  // ...
};
```

### 3. 추후 추가할 기능
- ✅ 실제 백엔드 API 연동
- ✅ LiveKit + Unity WebGL 통합
- ✅ 데이터베이스 저장
- ✅ 병원 관리자 대시보드

---

## 🎨 디자인 시스템 (Figma 기반)

### 색상
```css
:root {
  --primary: #6490ff;
  --primary-hover: #4070ff;
  --background: #ffffff;
  --background-light: #f0f3ff;
  --text-primary: #111111;
  --text-secondary: #666666;
  --accent-red: #ff6b6b;
}
```

### 타이포그래피
```css
.title {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
}

.body {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
}
```

---

## 🐛 제한사항 (데모 전용)

❌ **포함되지 않는 기능**:
- 실제 백엔드 API 통신
- LiveKit 실시간 음성 통신
- Unity WebGL 3D 아바타
- 데이터베이스 저장
- 사용자 인증 (JWT)
- 병원 관리자 페이지

✅ **포함되는 기능**:
- 완전한 UI/UX 플로우
- 프론트엔드 상태 관리
- 로컬 데이터 저장 (localStorage)
- 전자 서명 캔버스
- 음성 녹음 (로컬만)
- AI 상담 Mock (비디오 또는 이미지)

---

## 📚 참고 문서

- `../SCREENS_SPEC.md` - 화면별 상세 명세
- `../API_SPEC.md` - API 타입 정의 참고
- `../PROJECT_SPEC.md` - 전체 프로젝트 개요
- `DEMO_SETUP.md` - 실제 셋업 가이드 (다음 파일)

---
