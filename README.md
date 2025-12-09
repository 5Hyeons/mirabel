# Mirabel

AI 아바타 의료 상담 웹 애플리케이션

## 개요

내시경 검사 전 환자 교육 및 동의서 작성을 위한 AI 아바타 상담 시스템입니다. LiveKit 실시간 음성 통신과 Unity WebGL 3D 아바타를 결합하여 자연스러운 대화형 경험을 제공합니다.

## 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Real-time Communication**: LiveKit
- **3D Avatar**: Unity WebGL + TalkMotion SDK
- **Deployment**: Vercel

## 주요 기능

### 1. AI 의료 상담
- 실시간 음성 대화 (STT/TTS)
- 3D 아바타 립싱크 애니메이션
- 대화 내역 요약 및 저장

### 2. 동의서 작성
- 체크박스 동의
- 전자 서명
- 음성 동의

### 3. 건강 체크
- 사전 문진
- 주의사항 안내
- 검사 절차 설명

## 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트
│   ├── health-check/    # 건강 체크 관련
│   ├── home/            # 홈 화면 관련
│   └── shared/          # 공통 컴포넌트
├── lib/
│   ├── api/             # API 타입 및 mock
│   ├── hooks/           # 커스텀 훅
│   ├── store/           # Zustand 스토어
│   └── types/           # TypeScript 타입
├── pages/
│   ├── consent/         # 동의서 페이지
│   ├── consultation/    # AI 상담 페이지
│   └── examination/     # 검사 안내 페이지
└── assets/              # 이미지, 아이콘 (WebP)
```

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 환경 변수

Vercel 환경 변수로 설정:

```
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-livekit-server.com
```

## Unity WebGL 빌드

Unity 빌드 파일은 `public/unity/doctor/Build/` 디렉토리에 위치:

- `doctor.loader.js`
- `doctor.data`
- `doctor.framework.js`
- `doctor.wasm`

## 배포

Vercel에 자동 배포됩니다. `api/livekit/token.ts`에서 LiveKit 토큰 생성 Serverless Function이 포함되어 있습니다.

## 라이선스

Private
