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
├── api/livekit/token.ts          # LiveKit 토큰 생성 API
├── public/
│   ├── audio/                    # TTS 음성 안내 파일 (WAV)
│   ├── images/                   # 정적 이미지
│   └── unity/doctor/Build/       # Unity WebGL 빌드
├── src/
│   ├── assets/                   # 이미지 에셋 (WebP)
│   ├── components/
│   │   ├── health-check/         # 건강 체크 UI
│   │   ├── home/                 # 홈 화면 UI
│   │   └── shared/               # 공통 (BottomButton, ScrollableContainer)
│   ├── lib/
│   │   ├── hooks/                # useLiveKit, useAnimationData, useTrackVolume
│   │   ├── i18n/                 # 다국어 (ko, en)
│   │   ├── store/                # Zustand 스토어
│   │   └── types/                # TypeScript 타입
│   └── pages/
│       ├── consent/              # 동의서 플로우
│       ├── consultation/ai/      # AI 상담 (핵심)
│       └── examination/          # 건강 체크 플로우
└── vercel.json
```

## 레이아웃 시스템

### App 컨테이너 (`App.tsx`)
```tsx
<div className="w-full max-w-[480px] h-screen max-h-[980px] ...">
```
- 모바일 최적화: 최대 480px 너비, 980px 높이

### 푸터 패턴
```tsx
<div className="bg-[#f0f3ff] flex h-[70px] items-end justify-center px-[16px] py-[8px]"
     style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
```
- 높이 70px, 버튼은 하단 정렬
- safe-area 자동 처리

### Flexbox 레이아웃
- 컨테이너: `h-full flex flex-col`
- 상단 고정: `shrink-0`
- 하단 고정: `mt-auto shrink-0`

## AI 상담 아키텍처

### 컴포넌트 계층
```
AIConsultation (Unity 로드, LiveKit 연결)
  └─ LiveKitRoom (Context Provider)
       └─ SessionManager (비즈니스 로직)
            └─ AvatarView (UI)
```

### SessionManager 역할
- RPC 핸들러: `agent_state_changed` (Agent 상태 수신)
- Transcription 핸들러: `lk.transcription` (STT 텍스트 수신)
- RPC 호출: `start_conversation`, `interrupt_agent`

### AvatarView 역할
- Unity 통신: `sendMessage('ReactBridge', 'OnAnimationData', frameData)`
- 마이크 제어, 볼륨 시각화
- Agent 상태 기반 UI

## 애니메이션 파이프라인

```
Agent (60fps) → LiveKit DataChannel
      ↓
useAnimationData (3:1 다운샘플링 → 20fps 큐)
      ↓
AvatarView (16.67ms 간격 디큐)
      ↓
Unity ReactBridge → FluentTAvatar (립싱크)
```

**프레임 형식:**
- 208 bytes = 52 floats (blendshape)
- Control: `"final"` (큐 경유), `"interrupted"` (즉시 클리어)

## z-index 레이어 (AvatarView)

```
z-90: 버튼 (최상단, 항상 클릭 가능)
z-60: Volume gradient (푸터 기준 absolute, 스크롤과 함께 이동)
z-55: 푸터 배경 (볼륨 오버레이에 가려짐)
z-50: 그라데이션 오버레이 (Unity→푸터 페이드)
z-45: Unity Canvas (flex 흐름에 포함, mt-auto로 푸터 위에 배치)
```

## Zustand 스토어

| 스토어 | 용도 |
|--------|------|
| `consultation-store` | 상담 메시지 (messages[]) |
| `font-size-store` | 글꼴 크기 (`--font-scale` CSS 변수) |
| `patient-store` | 환자 정보, 건강 체크 상태 |
| `language-store` | 언어 설정 (ko/en) |

## 공통 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `BottomButton` | 그라데이션 + safe-area 푸터 버튼 |
| `ScrollableContainer` | flex-1 스크롤 영역, 스크롤바 숨김 |
| `HealthCheckHeader` | 건강 체크 헤더 (뒤로가기, 크기 조절) |

## 라우팅

| 경로 | 페이지 |
|------|--------|
| `/` | 홈 |
| `/health-check` | 건강 체크 |
| `/health-check/warning` | 주의사항 |
| `/health-check/recording` | 음성 녹음 |
| `/health-check/complete` | 완료 |
| `/consent/checkbox` | 동의서 체크 |
| `/consent/signature` | 서명 |
| `/consent/voice` | 음성 동의 |
| `/consent/complete` | 완료 |
| `/consultation/ai` | AI 상담 |

## 음성 안내 파일 (public/audio/)

| 파일명 | 용도 | 재생 위치 |
|--------|------|-----------|
| `home_intro.wav` | 홈 화면 인트로 | Home.tsx |
| `exam_explanation.wav` | 검사 설명 | ExaminationContent.tsx |
| `health_check_intro.wav` | 건강 체크 시작 | HealthCheck.tsx |
| `warning_notice.wav` | 주의사항 안내 | HealthWarning.tsx |
| `recording_danger.wav` | 위험군 녹음 안내 | HealthRecording.tsx |
| `recording_normal.wav` | 일반 녹음 안내 | HealthRecording.tsx |
| `complete_outro.wav` | 완료 안내 | HealthComplete.tsx |

## 개발 가이드라인

- **이미지**: WebP 포맷 사용
- **오디오**: WAV 포맷, 페이지 진입 시 자동 재생
- **스타일**: Tailwind 클래스 우선, 인라인 스타일은 동적 값만
- **타입**: TypeScript strict 모드

## 환경 변수 (Vercel)

```
LIVEKIT_API_KEY=xxx
LIVEKIT_API_SECRET=xxx
LIVEKIT_URL=wss://xxx.livekit.cloud
```

---

**업데이트**: 2025-12-11
