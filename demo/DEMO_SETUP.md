# 프론트엔드 데모 셋업 가이드

## 🚀 빠른 시작 (5분)

```bash
# 1. 프로젝트 생성
npx create-next-app@latest mirabel-demo --typescript --tailwind --app

# 2. 디렉토리 이동
cd mirabel-demo

# 3. 의존성 설치
npm install zustand react-signature-canvas @types/react-signature-canvas

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 📦 프로젝트 초기화

### 1. Next.js 프로젝트 생성

```bash
npx create-next-app@latest mirabel-demo

# 설정 선택
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias (@/*)? … Yes
```

---

### 2. 의존성 설치

```bash
cd mirabel-demo

# 필수 의존성만 설치
npm install zustand                          # 상태 관리
npm install react-signature-canvas           # 전자 서명
npm install -D @types/react-signature-canvas # TypeScript 타입
```

---

## 📁 디렉토리 구조 생성

```bash
# 디렉토리 생성
mkdir -p app/examination/doctor-intro app/examination/procedure
mkdir -p app/consent/checkbox app/consent/signature app/consent/voice app/consent/complete
mkdir -p app/consultation/ai
mkdir -p components/common components/home components/consent components/consultation
mkdir -p lib/api lib/store lib/utils
mkdir -p public/images public/videos
```

**최종 구조:**
```
mirabel-demo/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # 진입화면
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
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Button.tsx
│   │   └── LoadingSpinner.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   └── InfoCard.tsx
│   ├── consent/
│   │   ├── SignatureCanvas.tsx
│   │   └── VoiceRecorder.tsx
│   └── consultation/
│       └── AIAvatarMock.tsx
├── lib/
│   ├── api/
│   │   ├── mock-api.ts
│   │   └── types.ts
│   ├── store/
│   │   ├── patient-store.ts
│   │   └── consent-store.ts
│   └── utils/
│       ├── validation.ts
│       └── format.ts
├── public/
│   ├── images/
│   │   ├── doctor-avatar.png
│   │   └── doctor-photo.png
│   └── mock-data.json
└── styles/
    └── globals.css
```

---

## 🎨 Tailwind CSS 설정

### 1. `tailwind.config.ts` 수정

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
        background: {
          DEFAULT: '#ffffff',
          light: '#f0f3ff',
        },
        text: {
          primary: '#111111',
          secondary: '#666666',
        },
        accent: {
          red: '#ff6b6b',
        }
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

### 2. `styles/globals.css` 수정

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

:root {
  --primary: #6490ff;
  --primary-hover: #4070ff;
  --background: #ffffff;
  --background-light: #f0f3ff;
  --text-primary: #111111;
  --text-secondary: #666666;
  --accent-red: #ff6b6b;
}

body {
  color: var(--text-primary);
  background: var(--background);
  font-family: 'Noto Sans KR', sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 🗄️ Mock 데이터 준비

### `public/mock-data.json` 복사

```bash
# 이미 준비된 mock-data.json 파일 복사
cp ../demo/mock-data.json public/
```

상세 내용은 `demo/mock-data.json` 참고

---

## 🎨 Figma 추출 코드 사용하기 (픽셀 퍼펙트)

### Figma 추출 코드 사용

`figma-extracted/` 폴더에 모든 화면이 Figma에서 자동 추출되어 준비되어 있습니다!

**Step 1: 파일 복사**
```bash
# figma-extracted/ 파일들을 app/ 폴더로 복사
cp figma-extracted/Home.tsx app/page.tsx
cp figma-extracted/DoctorIntro.tsx app/examination/doctor-intro/page.tsx
cp figma-extracted/ExaminationInfo.tsx app/examination/procedure/page.tsx
cp figma-extracted/ConsentCheckbox.tsx app/consent/checkbox/page.tsx
cp figma-extracted/ConsentSignature.tsx app/consent/signature/page.tsx
cp figma-extracted/ConsentVoice.tsx app/consent/voice/page.tsx
cp figma-extracted/ConsentComplete.tsx app/consent/complete/page.tsx
cp figma-extracted/AIConsultation.tsx app/consultation/ai/page.tsx
```

**Step 2: 이미지 경로 일괄 변경**
```bash
# VSCode에서 전체 검색 (Ctrl+Shift+F)
# 검색: http://localhost:3845/assets/
# 교체: /images/

# 또는 수동으로 각 파일에서 변경
```

**Step 3: 필수 파일 생성**
```bash
# lib/api/types.ts, lib/api/mock-api.ts, lib/store/patient-store.ts 생성
# 상세 코드는 figma-extracted/README_FIGMA_CODE.md 참고
```

**Step 4: 이미지 다운로드**
```
Figma에서 이미지 Export 후 public/images/ 저장
상세 방법은 figma-extracted/README_FIGMA_CODE.md "2. 이미지 Assets 처리" 참고
```

---

## 🧪 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# 1. http://localhost:3000 → 진입화면
# 2. 네비게이션 확인
# 3. 각 화면 동작 확인
```

---

## 📦 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run start
```

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel deploy --prod
```

---

## 📚 상세 가이드

모든 구현 코드 및 트러블슈팅은 다음 문서 참고:
- **`figma-extracted/README_FIGMA_CODE.md`** - Figma 코드 상세 사용 가이드
- **`../API_SPEC.md`** - API 타입 정의
- **`../LIVEKIT_INTEGRATION.md`** - 실제 API 연동 시
