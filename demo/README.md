# 내시경 환자 AI 상담 플랫폼 - 데모

## 📋 개요

이 폴더는 **내시경 환자 AI 상담 플랫폼**의 프론트엔드 데모 프로젝트입니다. 백엔드/LiveKit 없이 순수 프론트엔드만으로 UI/UX를 검증할 수 있습니다.

---

## 📂 폴더 구조

```
demo/
├── mirabel-demo/              # Next.js 데모 프로젝트 (실행 가능)
│   ├── app/                   # 8개 화면 구현
│   ├── lib/                   # Mock API, Store
│   ├── public/                # 이미지, Mock 데이터
│   └── package.json
│
├── figma-extracted/           # Figma 추출 원본 코드
│   ├── Home.tsx               # 진입화면
│   ├── DoctorIntro.tsx        # 의사 소개
│   ├── ExaminationInfo.tsx    # 검사 설명
│   ├── ConsentCheckbox.tsx    # 체크박스 동의
│   ├── ConsentSignature.tsx   # 전자 서명
│   ├── ConsentVoice.tsx       # 음성 녹음
│   ├── ConsentComplete.tsx    # 동의서 완료
│   ├── AIConsultation.tsx     # AI 상담
│   └── README_FIGMA_CODE.md   # 상세 사용 가이드
│
├── DEMO_SPEC.md               # 데모 명세서 (전략)
├── DEMO_SETUP.md              # 셋업 가이드 (Quick Start)
├── mock-data.json             # Mock 데이터 샘플
└── README.md                  # 이 파일
```

---

## 🚀 빠른 시작

```bash
# 1. 디렉토리 이동
cd demo/mirabel-demo

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 접속
# http://localhost:3000
```

---

## ✨ 구현된 기능

### 화면 (8개)
- ✅ 진입화면 (예약 확인)
- ✅ 검사 안내 - 의사 소개
- ✅ 검사 안내 - 검사 설명 (페이지네이션)
- ✅ 동의서 - 체크박스 동의
- ✅ 동의서 - 전자 서명 (react-signature-canvas)
- ✅ 동의서 - 음성 녹음 (MediaRecorder API + Waveform 애니메이션)
- ✅ 동의서 완료
- ✅ AI 상담 (2D 이미지 Mock)

### 기술 스택
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State**: Zustand 4.x
- **Signature**: react-signature-canvas

### 특징
- ✅ Figma 디자인 픽셀 퍼펙트 재현
- ✅ Mock API (localStorage 기반)
- ✅ 실제 Figma 이미지 21개 포함
- ✅ 확장 가능한 구조 (실제 API 전환 용이)

---

## 📚 문서

### 시작하기
- **`DEMO_SETUP.md`** - 5분 Quick Start 가이드

### 상세 가이드
- **`DEMO_SPEC.md`** - 데모 전략 및 아키텍처
- **`figma-extracted/README_FIGMA_CODE.md`** - Figma 코드 사용 가이드
