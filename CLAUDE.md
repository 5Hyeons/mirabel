# CLAUDE.md

이 파일은 Claude Code가 mirabel 프로젝트 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

**Mirabel**은 내시경 검사 전 환자 교육 및 동의서 작성을 위한 AI 아바타 의료 상담 웹 애플리케이션입니다.

### 기술 스택

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (PostCSS 기반)
- **State**: Zustand
- **Real-time**: LiveKit (음성 통신, RPC)
- **3D Avatar**: Unity WebGL + TalkMotion SDK (NoServer 모드)
- **Deployment**: Vercel (Serverless Functions)

## 프로젝트 구조

```
mirabel/
├── api/                          # Vercel Serverless Functions
│   └── livekit/token.ts          # LiveKit 토큰 생성 API
├── public/
│   ├── images/                   # 정적 이미지 (WebP)
│   └── unity/doctor/Build/       # Unity WebGL 빌드
├── src/
│   ├── assets/                   # 이미지 에셋 (WebP)
│   ├── components/               # 재사용 컴포넌트
│   │   ├── health-check/         # 건강 체크 UI
│   │   ├── home/                 # 홈 화면 UI
│   │   └── shared/               # 공통 컴포넌트
│   ├── lib/
│   │   ├── api/                  # API 타입 및 mock
│   │   ├── hooks/                # 커스텀 훅
│   │   │   ├── useAnimationData.ts   # 아바타 애니메이션 데이터
│   │   │   ├── useAudioContext.ts    # 오디오 컨텍스트 관리
│   │   │   ├── useLiveKit.ts         # LiveKit 연결 관리
│   │   │   └── useTrackVolume.ts     # 마이크 볼륨 추적
│   │   ├── store/                # Zustand 스토어
│   │   │   ├── consultation-store.ts # 상담 메시지 저장
│   │   │   └── patient-store.ts      # 환자 정보 저장
│   │   └── types/                # TypeScript 타입 정의
│   └── pages/                    # 페이지 컴포넌트
│       ├── consent/              # 동의서 (체크박스, 서명, 음성)
│       ├── consultation/ai/      # AI 상담 화면
│       └── examination/          # 검사 안내 화면
└── vercel.json                   # Vercel 배포 설정
```

## 주요 파일 설명

### AI 상담 (`src/pages/consultation/ai/`)

| 파일 | 역할 |
|------|------|
| `AIConsultation.tsx` | 메인 상담 화면, Unity + LiveKit 통합 |
| `SessionManager.tsx` | LiveKit 세션 관리, RPC/Transcription 핸들러 |
| `AvatarView.tsx` | 3D 아바타 UI, 마이크 제어, 애니메이션 전송 |
| `ConsultationSummary.tsx` | 상담 내역 요약 페이지 |

### 커스텀 훅 (`src/lib/hooks/`)

| 훅 | 용도 |
|-----|------|
| `useLiveKit` | LiveKit 토큰 발급 및 연결 관리 |
| `useAnimationData` | Agent → Unity 애니메이션 데이터 수신 |
| `useTrackVolume` | 마이크 볼륨 실시간 추적 |
| `useAudioContext` | iOS Safari 오디오 컨텍스트 unlock |

## 개발 가이드라인

### 코드 스타일

- TypeScript strict 모드 사용
- 함수형 컴포넌트 + Hooks 패턴
- Tailwind CSS 클래스 사용 (인라인 스타일 최소화)

### 이미지 에셋

- **WebP 포맷** 사용 (PNG 대비 70-90% 용량 감소)
- `src/assets/`: 컴포넌트에서 import하는 이미지
- `public/images/`: 정적 경로로 참조하는 이미지

### LiveKit 통신

```typescript
// RPC 등록 (Agent → Client)
localParticipant.registerRpcMethod('agent_state_changed', handler);

// RPC 호출 (Client → Agent)
localParticipant.performRpc({
  destinationIdentity: agentIdentity,
  method: 'start_conversation',
  payload: '',
});

// Transcription 스트림 등록
room.registerTextStreamHandler('lk.transcription', handler);
```

### Unity 통신

```typescript
// React → Unity 메시지
sendMessage('ReactBridge', 'OnReactMessage', JSON.stringify({ action, data }));
sendMessage('ReactBridge', 'OnAnimationData', frameData);
```

## 라우팅

| 경로 | 페이지 |
|------|--------|
| `/` | 홈 |
| `/health-check` | 건강 체크 시작 |
| `/health-check/warning` | 주의사항 |
| `/health-check/recording` | 음성 녹음 |
| `/health-check/complete` | 건강 체크 완료 |
| `/consent/checkbox` | 동의서 체크박스 |
| `/consent/signature` | 동의서 서명 |
| `/consent/voice` | 동의서 음성 |
| `/consent/complete` | 동의서 완료 |
| `/consultation/ai` | AI 상담 |

## 빌드 및 배포

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npx tsc --noEmit
```

### Vercel 환경 변수

```
LIVEKIT_API_KEY=xxx
LIVEKIT_API_SECRET=xxx
LIVEKIT_URL=wss://xxx.livekit.cloud
```

## 알려진 이슈 및 해결책

### 1. iOS Safari 오디오 재생
- `useAudioContext` 훅으로 사용자 인터랙션 시 AudioContext unlock

### 2. Unity WebGL 메모리
- 장시간 사용 시 메모리 증가 가능
- 페이지 이탈 시 Unity 인스턴스 정리 필요

### 3. LiveKit 핸들러 중복 등록
- `SessionManager`가 리마운트될 때 핸들러 중복 등록 방지
- `visibility: hidden`으로 컴포넌트 유지, 언마운트 방지

---

**업데이트**: 2024-12-10
