# 시스템 아키텍처 명세서

## 📐 개요

본 문서는 **내시경 환자 AI 상담 플랫폼 (Mirabel)**의 기술 스택, 시스템 아키텍처, 데이터 플로우, 배포 전략을 상세하게 설명합니다.

---

## 🛠 기술 스택

### Frontend

#### Web Application
```json
{
  "framework": "Next.js 14.x (App Router)",
  "language": "TypeScript 5.x",
  "styling": "Tailwind CSS 3.x",
  "stateManagement": "React Context API + Zustand",
  "formValidation": "React Hook Form + Zod",
  "networking": "Axios / Fetch API",
  "webGL": "Unity WebGL 2022.3.x"
}
```

**주요 라이브러리:**
- `react-signature-canvas`: 전자 서명 캔버스
- `react-audio-recorder`: 음성 녹음 기능
- `framer-motion`: 애니메이션 효과
- `@livekit/components-react`: LiveKit React 통합
- `react-query (TanStack Query)`: 서버 상태 관리

#### WebGL (Unity)
```json
{
  "engine": "Unity 2022.3.62f1 LTS",
  "sdk": "LiveKit Unity SDK",
  "avatarSystem": "VRM 1.0 / VSFAvatar",
  "lipSync": "Fluentt TalkMotion",
  "buildTarget": "WebGL"
}
```

---

### Backend

#### API Server
```json
{
  "runtime": "Node.js 20.x LTS",
  "framework": "Express.js 4.x",
  "language": "TypeScript 5.x",
  "orm": "Prisma 5.x",
  "validation": "Zod",
  "authentication": "JWT (jsonwebtoken)"
}
```

#### AI Agent Server
```json
{
  "language": "Python 3.11+",
  "framework": "LiveKit Agents SDK",
  "stt": "OpenAI Whisper / Google STT",
  "llm": "OpenAI GPT-4 / Anthropic Claude",
  "tts": "OpenAI TTS / ElevenLabs",
  "faceAnimation": "Fluentt TalkMotion API"
}
```

---

### Database & Storage

```json
{
  "primaryDB": "PostgreSQL 15.x",
  "cache": "Redis 7.x",
  "fileStorage": "AWS S3 / Azure Blob Storage",
  "cdn": "CloudFlare / AWS CloudFront"
}
```

**데이터베이스 구조:**
- **patients**: 환자 정보 (이름, 생년월일, 연락처)
- **appointments**: 예약 정보 (병원, 의사, 검사 일시)
- **consents**: 동의서 데이터 (체크박스, 서명, 음성)
- **consultations**: AI 상담 기록 (대화 로그, 음성 파일)
- **url_tokens**: 개인화 URL 토큰 관리

---

### Infrastructure & DevOps

```json
{
  "hosting": "AWS EC2 / Azure App Service",
  "container": "Docker + Docker Compose",
  "orchestration": "Kubernetes (Optional for scale)",
  "ci/cd": "GitHub Actions / GitLab CI",
  "monitoring": "DataDog / New Relic",
  "errorTracking": "Sentry",
  "logging": "Winston (Node.js) + CloudWatch"
}
```

---

## 🏗 시스템 아키텍처

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Client Layer                             │
│  ┌────────────────────┐           ┌──────────────────────────────┐  │
│  │  Mobile Browser    │           │  Unity WebGL (AI 상담)        │  │
│  │  (React/Next.js)   │◄─────────►│  + LiveKit Unity SDK         │  │
│  └────────────────────┘           └──────────────────────────────┘  │
└────────────────┬────────────────────────────────┬───────────────────┘
                 │                                 │
                 │ HTTPS/REST                      │ WebSocket (LiveKit)
                 ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Application Layer                           │
│  ┌──────────────────────┐           ┌───────────────────────────┐   │
│  │  API Server          │           │  LiveKit Server           │   │
│  │  (Node.js/Express)   │◄─────────►│  (Media Router)           │   │
│  └──────────┬───────────┘           └─────────┬─────────────────┘   │
│             │                                  │                    │
│             │ Prisma ORM                       │ RPC                │
│             ▼                                  ▼                    │
│  ┌──────────────────────┐           ┌───────────────────────────┐   │
│  │  PostgreSQL DB       │           │  Python Agent Server      │   │
│  │  (환자/동의서/상담)    │           │  (STT/LLM/TTS)            │   │
│  └──────────────────────┘           └───────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ S3 API
                                 ▼
                    ┌──────────────────────────┐
                    │  File Storage (S3)       │
                    │  (서명/음성/상담 기록)      │
                    └──────────────────────────┘
```

---

## 🔄 데이터 플로우

### 1. 환자 링크 생성 및 접근

```
┌──────────────┐
│  병원 관리자   │
└──────┬───────┘
       │ 1. 환자 정보 입력 (이름, 생년월일, 검사 일시)
       ▼
┌────────────────────────┐
│  API: POST /api/admin  │
│  /create-patient-link  │
└───────┬────────────────┘
        │ 2. JWT 토큰 생성 (payload: patientId, expiresAt)
        │    URL: https://mirabel.com/p/{token}
        ▼
┌──────────────────────┐
│  DB: url_tokens 저장 │
└───────┬──────────────┘
        │ 3. SMS/Email 발송
        ▼
┌──────────────┐
│  환자        │
└──────┬───────┘
       │ 4. 링크 클릭
       ▼
┌────────────────────────┐
│  API: GET /api/patient │
│  /verify-token/{token} │
└───────┬────────────────┘
        │ 5. 토큰 검증 (만료 확인, 서명 확인)
        │    → 성공 시 환자 정보 반환
        ▼
┌──────────────────┐
│  진입화면 렌더링 │
└──────────────────┘
```

---

### 2. 동의서 작성 및 저장

```
┌───────────────┐
│  환자 (웹)    │
└───────┬───────┘
        │ 1. 체크박스 동의 선택
        ▼
┌──────────────────────────┐
│  API: POST /api/consent  │
│  /checkbox                │
└───────┬──────────────────┘
        │ 2. DB 저장 (consents 테이블)
        │    { type: 'checkbox', agreed: true, timestamp }
        ▼
        │ 3. 전자 서명 입력 (Canvas → Base64 PNG)
        ▼
┌──────────────────────────┐
│  API: POST /api/consent  │
│  /signature               │
└───────┬──────────────────┘
        │ 4. S3 업로드 (서명 이미지)
        │    DB 저장 (signatureUrl, timestamp)
        ▼
        │ 5. 음성 녹음 (WebAudioAPI → Blob)
        ▼
┌──────────────────────────┐
│  API: POST /api/consent  │
│  /voice                   │
└───────┬──────────────────┘
        │ 6. S3 업로드 (음성 파일)
        │    DB 저장 (voiceUrl, duration, timestamp)
        ▼
┌──────────────────────┐
│  동의서 완료 화면    │
└──────────────────────┘
```

---

### 3. AI 상담 플로우

```
┌───────────────┐
│  환자 (웹)    │
└───────┬───────┘
        │ 1. "추가 문의하기" 버튼 클릭
        ▼
┌──────────────────────────┐
│  API: POST /api/livekit  │
│  /token                   │
└───────┬──────────────────┘
        │ 2. LiveKit JWT 생성
        │    { roomName, identity: patientId, grants }
        ▼
┌──────────────────────────┐
│  Unity WebGL 초기화      │
└───────┬──────────────────┘
        │ 3. LiveKit Room 접속
        ▼
┌──────────────────────────┐
│  LiveKit Server          │
└───────┬──────────────────┘
        │ 4. Python Agent 자동 접속
        ▼
┌──────────────────────────┐
│  Python Agent            │
│  - STT: 음성 → 텍스트   │
│  - LLM: 질문 분석/응답   │
│  - TTS: 텍스트 → 음성   │
│  - FaceAnim: 립싱크 생성 │
└───────┬──────────────────┘
        │ 5. 오디오 스트림 반환
        ▼
┌──────────────────────────┐
│  Unity WebGL             │
│  - 오디오 재생           │
│  - 아바타 립싱크 적용    │
└───────┬──────────────────┘
        │ 6. 사용자 "답변 멈추기" 클릭
        │    → RPC: agent.interrupt()
        ▼
┌──────────────────────────┐
│  Python Agent            │
│  - TTS 중단              │
│  - 대기 상태로 전환      │
└──────────────────────────┘
        │ 7. "끝내기" 클릭
        ▼
┌──────────────────────────┐
│  API: POST /api/consult  │
│  /save-log                │
└───────┬──────────────────┘
        │ 8. 상담 기록 DB 저장
        │    대화 로그, 음성 파일 S3 업로드
        ▼
┌──────────────────────┐
│  완료 → 화면 종료    │
└──────────────────────┘
```

---

## 🔐 보안 아키텍처

### 1. 환자 인증 (URL Token)

```typescript
// JWT Payload 구조
interface PatientToken {
  patientId: string;          // 환자 고유 ID
  appointmentId: string;      // 예약 ID
  iat: number;                // 발급 시간 (Issued At)
  exp: number;                // 만료 시간 (Expiration Time, 24시간)
}

// JWT 생성 (병원 관리자 API)
const token = jwt.sign(
  { patientId, appointmentId },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// JWT 검증 (환자 접근 시)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
if (Date.now() >= decoded.exp * 1000) {
  throw new Error('Token expired');
}
```

---

### 2. 데이터 암호화

#### 전송 중 암호화
- **HTTPS/TLS 1.3**: 모든 API 통신
- **WSS (WebSocket Secure)**: LiveKit 실시간 통신

#### 저장 시 암호화
```typescript
// 전자 서명 및 음성 파일 암호화 (AES-256)
import { createCipheriv, createDecipheriv } from 'crypto';

function encryptFile(buffer: Buffer): Buffer {
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
}

function decryptFile(encryptedBuffer: Buffer): Buffer {
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}
```

---

### 3. 접근 제어

#### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,                  // 최대 100 요청
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

#### CORS 설정
```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://mirabel.com', 'https://admin.mirabel.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

---

## 🎯 성능 최적화

### 1. Frontend 최적화

#### Code Splitting
```typescript
// Next.js 동적 import
import dynamic from 'next/dynamic';

const UnityWebGL = dynamic(() => import('@/components/UnityWebGL'), {
  ssr: false,  // 서버사이드 렌더링 비활성화
  loading: () => <LoadingSpinner />
});
```

#### Image Optimization
```typescript
// Next.js Image 컴포넌트 사용
import Image from 'next/image';

<Image
  src="/doctor-avatar.png"
  width={300}
  height={400}
  alt="Doctor"
  quality={80}
  priority
/>
```

#### Lazy Loading
```typescript
// React Suspense + lazy
import { lazy, Suspense } from 'react';

const ConsentSignature = lazy(() => import('./ConsentSignature'));

<Suspense fallback={<Skeleton />}>
  <ConsentSignature />
</Suspense>
```

---

### 2. Backend 최적화

#### Database Query Optimization
```typescript
// Prisma: 필요한 필드만 선택
const patient = await prisma.patient.findUnique({
  where: { id: patientId },
  select: {
    id: true,
    name: true,
    birthDate: true,
    appointment: {
      select: {
        hospitalName: true,
        doctorName: true,
        examinationDate: true
      }
    }
  }
});
```

#### Caching (Redis)
```typescript
import Redis from 'ioredis';
const redis = new Redis();

async function getPatientInfo(patientId: string) {
  // 1. 캐시 확인
  const cached = await redis.get(`patient:${patientId}`);
  if (cached) return JSON.parse(cached);

  // 2. DB 조회
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });

  // 3. 캐시 저장 (TTL: 1시간)
  await redis.setex(`patient:${patientId}`, 3600, JSON.stringify(patient));

  return patient;
}
```

---

### 3. Unity WebGL 최적화

#### Build Settings
```
- Compression Format: Gzip (최고 압축률)
- Code Optimization: Master (최적화)
- Strip Engine Code: Enabled
- Managed Stripping Level: High
- Target Build Size: < 15MB
```

#### Avatar Optimization
- **폴리곤 수**: < 30,000 triangles
- **텍스처 크기**: 1024x1024 (압축)
- **애니메이션**: Blend Tree 최적화
- **립싱크**: 블렌드셰이프 12개 (A, I, U, E, O 기본 음소)

---

## 🚀 배포 전략

### 1. Docker Compose (Development/Staging)

```yaml
version: '3.8'

services:
  # Next.js Frontend
  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:4000
      - NEXT_PUBLIC_LIVEKIT_URL=ws://livekit:7880
    depends_on:
      - api

  # Node.js API Server
  api:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/mirabel
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  # PostgreSQL
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mirabel
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7
    ports:
      - "6379:6379"

  # LiveKit Server
  livekit:
    image: livekit/livekit-server:latest
    ports:
      - "7880:7880"
      - "7881:7881"
    environment:
      - LIVEKIT_KEYS=${LIVEKIT_API_KEY}:${LIVEKIT_API_SECRET}

  # Python Agent
  agent:
    build: ./agent
    environment:
      - LIVEKIT_URL=ws://livekit:7880
      - LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - livekit

volumes:
  postgres_data:
```

---

### 2. Production Deployment (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                        CloudFlare CDN                        │
│         (Static Assets: Images, Unity WebGL Build)          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS Application Load Balancer              │
└───────┬──────────────────────────────┬──────────────────────┘
        │                              │
        ▼                              ▼
┌───────────────────┐          ┌───────────────────┐
│  EC2 Auto Scaling │          │  EC2 Auto Scaling │
│  (Next.js)        │          │  (Node.js API)    │
│  - Min: 2         │          │  - Min: 2         │
│  - Max: 10        │          │  - Max: 10        │
└───────────────────┘          └────────┬──────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
              ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
              │  RDS         │  │  ElastiCache │  │  S3 Bucket   │
              │  PostgreSQL  │  │  Redis       │  │  (Files)     │
              └─────────────┘  └──────────────┘  └──────────────┘
```

---

### 3. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Images
        run: |
          docker build -t mirabel-web:${{ github.sha }} ./web
          docker build -t mirabel-api:${{ github.sha }} ./api

      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin
          docker push mirabel-web:${{ github.sha }}
          docker push mirabel-api:${{ github.sha }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster mirabel --service web --force-new-deployment
          aws ecs update-service --cluster mirabel --service api --force-new-deployment
```

---

## 📊 모니터링 및 로깅

### 1. Application Monitoring (DataDog)

```typescript
// DataDog APM 통합
import tracer from 'dd-trace';
tracer.init({
  service: 'mirabel-api',
  env: process.env.NODE_ENV,
  version: process.env.APP_VERSION
});

// Custom Metrics
import { StatsD } from 'node-dogstatsd';
const metrics = new StatsD();

// 예: 동의서 작성 완료 메트릭
metrics.increment('consent.completed', 1, [`type:${consentType}`]);
```

---

### 2. Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // PII 정보 필터링
    if (event.request?.data) {
      delete event.request.data.signature;
      delete event.request.data.voiceFile;
    }
    return event;
  }
});
```

---

### 3. Logging (Winston + CloudWatch)

```typescript
import winston from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: 'mirabel-api',
      logStreamName: `${process.env.NODE_ENV}-${new Date().toISOString().split('T')[0]}`
    })
  ]
});

// 사용 예
logger.info('Patient consent completed', {
  patientId: 'P123',
  consentType: 'signature',
  timestamp: new Date().toISOString()
});
```

---

## 🧪 테스트 전략

### 1. Frontend Testing

```typescript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import ConsentCheckbox from './ConsentCheckbox';

test('should enable submit button when checkbox is checked', () => {
  render(<ConsentCheckbox />);
  const checkbox = screen.getByRole('checkbox');
  const submitButton = screen.getByText('필수 동의하기');

  expect(submitButton).toBeDisabled();

  fireEvent.click(checkbox);

  expect(submitButton).toBeEnabled();
});
```

---

### 2. API Testing

```typescript
// Jest + Supertest
import request from 'supertest';
import app from '../app';

describe('POST /api/consent/checkbox', () => {
  it('should save checkbox consent', async () => {
    const response = await request(app)
      .post('/api/consent/checkbox')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ agreed: true })
      .expect(201);

    expect(response.body).toHaveProperty('consentId');
  });
});
```

---

### 3. E2E Testing

```typescript
// Playwright
import { test, expect } from '@playwright/test';

test('complete consent flow', async ({ page }) => {
  // 1. 진입화면 접속
  await page.goto('https://mirabel.com/p/test-token');
  await expect(page.locator('text=안녕하세요')).toBeVisible();

  // 2. 검사 설명 보기
  await page.click('text=검사 설명 보기');

  // 3. 동의서 작성
  await page.click('text=예(필수)');
  await page.click('text=필수 동의하기');

  // 4. 전자 서명
  const canvas = page.locator('canvas');
  await canvas.hover();
  await page.mouse.down();
  await page.mouse.move(100, 100);
  await page.mouse.up();
  await page.click('text=다음');

  // 5. 완료 확인
  await expect(page.locator('text=동의서 작성이 모두 마무리 되었습니다')).toBeVisible();
});
```

---

## 📈 확장성 고려사항

### 1. Horizontal Scaling
- **Web/API 서버**: 로드 밸런서를 통한 인스턴스 추가
- **데이터베이스**: Read Replica (읽기 전용 복제본) 추가
- **LiveKit**: Distributed Mode (여러 노드로 분산)

### 2. Caching Strategy
- **페이지 캐싱**: Next.js ISR (Incremental Static Regeneration)
- **API 캐싱**: Redis를 통한 자주 조회되는 데이터 캐싱
- **CDN 캐싱**: Static Assets (이미지, Unity 빌드)

### 3. Database Optimization
- **인덱싱**: 자주 조회되는 컬럼에 Index 추가
- **파티셔닝**: 날짜별 테이블 파티셔닝 (상담 기록)
- **Archiving**: 6개월 이상 된 데이터 아카이빙

---

## 🔧 개발 환경 셋업

### 1. Prerequisites
```bash
# Node.js 20.x 설치
nvm install 20
nvm use 20

# Python 3.11+ 설치
pyenv install 3.11
pyenv local 3.11

# Docker & Docker Compose 설치
# https://docs.docker.com/get-docker/
```

---

### 2. 로컬 개발 환경 실행

```bash
# 1. 레포지토리 클론
git clone https://github.com/your-org/mirabel.git
cd mirabel

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일 편집 (DB, API Keys 등)

# 3. Docker Compose로 인프라 실행
docker-compose up -d postgres redis livekit

# 4. API 서버 실행
cd api
npm install
npx prisma migrate dev
npm run dev

# 5. Web 서버 실행 (새 터미널)
cd web
npm install
npm run dev

# 6. Python Agent 실행 (새 터미널)
cd agent
pip install -r requirements.txt
python main.py
```

---

## 📝 참고 문서

- **LiveKit Documentation**: https://docs.livekit.io/
- **Unity WebGL**: https://docs.unity3d.com/Manual/webgl.html
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs

---

## 📞 기술 지원

기술적 문의사항은 다음으로 연락 주시기 바랍니다:
- **Tech Lead**: [tech-lead@example.com]
- **Slack**: #mirabel-dev
- **위키**: [Confluence/Notion URL]
