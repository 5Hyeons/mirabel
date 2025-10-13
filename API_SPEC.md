# API 명세서

## 📡 개요

본 문서는 **내시경 환자 AI 상담 플랫폼**의 RESTful API 엔드포인트, 데이터 스키마, 인증 방식, 에러 코드를 상세하게 정의합니다.

---

## 🔑 인증 (Authentication)

### JWT Token 기반 인증

**환자 접근 토큰 (Patient Access Token)**
- 병원 관리자가 환자별로 생성하는 일회성 토큰
- 유효 기간: 24시간 (설정 가능)
- 사용처: 환자 웹 애플리케이션 접근

**구조:**
```json
{
  "patientId": "P20251124001",
  "appointmentId": "A20251124001",
  "hospitalId": "H001",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**사용 방법:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📍 Base URL

```
Development: http://localhost:4000/api
Staging: https://staging-api.mirabel.com/api
Production: https://api.mirabel.com/api
```

---

## 🌐 API 엔드포인트

### 1. 환자 관리 (Patient Management)

#### 1.1 환자 정보 조회

**GET** `/patient/verify-token/:token`

환자 URL 토큰을 검증하고 환자 정보를 반환합니다.

**Request:**
```http
GET /api/patient/verify-token/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patientId": "P20251124001",
    "name": "홍길동",
    "birthDate": "1990.01.01",
    "phoneNumber": "010-1234-5678",
    "appointment": {
      "appointmentId": "A20251124001",
      "hospitalName": "시흥 마음속 내과",
      "hospitalLogo": "https://cdn.mirabel.com/hospitals/H001/logo.png",
      "doctorName": "박기호",
      "doctorPhoto": "https://cdn.mirabel.com/doctors/D001/photo.png",
      "doctorSpecialty": "소화기내과 전문의",
      "examinationDate": "2025. 11.24 (목) 오전 11시",
      "examinationType": "수면 마취수 내과"
    }
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized - 토큰 만료
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "링크가 만료되었습니다. 병원에 문의하여 새로운 링크를 받아주세요."
  }
}

// 401 Unauthorized - 유효하지 않은 토큰
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "유효하지 않은 토큰입니다."
  }
}

// 404 Not Found - 환자 정보 없음
{
  "success": false,
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "환자 정보를 찾을 수 없습니다."
  }
}
```

---

#### 1.2 환자 완료 기록

**POST** `/patient/complete`

환자가 모든 절차를 완료했음을 기록합니다.

**Request:**
```http
POST /api/patient/complete
Authorization: Bearer {patient_token}
Content-Type: application/json

{
  "patientId": "P20251124001",
  "completedAt": "2025-11-24T10:35:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "completionId": "C20251124001",
    "completedAt": "2025-11-24T10:35:00.000Z"
  }
}
```

---

### 2. 동의서 관리 (Consent Management)

#### 2.1 체크박스 동의 저장

**POST** `/consent/checkbox`

추가 검사 및 비용 발생에 대한 체크박스 동의를 저장합니다.

**Request:**
```http
POST /api/consent/checkbox
Authorization: Bearer {patient_token}
Content-Type: application/json

{
  "patientId": "P20251124001",
  "agreed": true,
  "consentText": "내시경 검사에서 이상이 발견되면...",
  "timestamp": "2025-11-24T10:15:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "consentId": "CONSENT_CB_20251124001",
    "type": "checkbox",
    "agreed": true,
    "createdAt": "2025-11-24T10:15:00.000Z"
  }
}
```

---

#### 2.2 전자 서명 저장

**POST** `/consent/signature`

전자 서명 이미지를 저장합니다.

**Request:**
```http
POST /api/consent/signature
Authorization: Bearer {patient_token}
Content-Type: application/json

{
  "patientId": "P20251124001",
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "timestamp": "2025-11-24T10:20:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "consentId": "CONSENT_SIG_20251124001",
    "type": "signature",
    "signatureUrl": "https://s3.amazonaws.com/mirabel-signatures/P20251124001_signature.png",
    "createdAt": "2025-11-24T10:20:00.000Z"
  }
}
```

**Note:**
- 서명 이미지는 Base64 PNG 형식으로 전송
- 서버에서 S3에 업로드 후 암호화 저장
- 최대 파일 크기: 5MB

---

#### 2.3 음성 녹음 저장

**POST** `/consent/voice`

음성 동의 녹음 파일을 저장합니다.

**Request:**
```http
POST /api/consent/voice
Authorization: Bearer {patient_token}
Content-Type: multipart/form-data

{
  "patientId": "P20251124001",
  "voiceFile": [Binary Audio Data],
  "duration": 35,
  "timestamp": "2025-11-24T10:25:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "consentId": "CONSENT_VOICE_20251124001",
    "type": "voice",
    "voiceUrl": "https://s3.amazonaws.com/mirabel-voices/P20251124001_voice.webm",
    "duration": 35,
    "createdAt": "2025-11-24T10:25:00.000Z"
  }
}
```

**Note:**
- 음성 파일 형식: WebM, MP3, WAV
- 최대 파일 크기: 10MB
- 최소 길이: 5초
- 최대 길이: 2분

---

#### 2.4 동의서 조회

**GET** `/consent/:patientId`

특정 환자의 모든 동의서를 조회합니다. (병원 관리자용)

**Request:**
```http
GET /api/consent/P20251124001
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patientId": "P20251124001",
    "consents": [
      {
        "consentId": "CONSENT_CB_20251124001",
        "type": "checkbox",
        "agreed": true,
        "createdAt": "2025-11-24T10:15:00.000Z"
      },
      {
        "consentId": "CONSENT_SIG_20251124001",
        "type": "signature",
        "signatureUrl": "https://s3.amazonaws.com/mirabel-signatures/P20251124001_signature.png",
        "createdAt": "2025-11-24T10:20:00.000Z"
      },
      {
        "consentId": "CONSENT_VOICE_20251124001",
        "type": "voice",
        "voiceUrl": "https://s3.amazonaws.com/mirabel-voices/P20251124001_voice.webm",
        "duration": 35,
        "createdAt": "2025-11-24T10:25:00.000Z"
      }
    ]
  }
}
```

---

### 3. LiveKit 토큰 생성 (LiveKit Token Generation)

#### 3.1 LiveKit 접속 토큰 발급

**POST** `/livekit/token`

AI 상담을 위한 LiveKit Room 접속 토큰을 발급합니다.

**Request:**
```http
POST /api/livekit/token
Authorization: Bearer {patient_token}
Content-Type: application/json

{
  "roomName": "consultation-P20251124001",
  "identity": "P20251124001",
  "metadata": {
    "patientName": "홍길동",
    "examinationType": "내시경 검사"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "url": "wss://livekit.mirabel.com",
    "roomName": "consultation-P20251124001",
    "expiresAt": "2025-11-24T12:00:00.000Z"
  }
}
```

**LiveKit Token Payload:**
```json
{
  "sub": "P20251124001",
  "name": "홍길동",
  "video": {
    "room": "consultation-P20251124001",
    "roomJoin": true,
    "canPublish": true,
    "canSubscribe": true
  },
  "exp": 1700089600
}
```

---

### 4. AI 상담 관리 (AI Consultation Management)

#### 4.1 상담 기록 저장

**POST** `/consultation/save-log`

AI 상담 내역을 저장합니다.

**Request:**
```http
POST /api/consultation/save-log
Authorization: Bearer {patient_token}
Content-Type: application/json

{
  "patientId": "P20251124001",
  "conversationLog": [
    {
      "role": "user",
      "content": "수면 내시경도 고통을 느낄 수 있나요?",
      "timestamp": 1700000000
    },
    {
      "role": "agent",
      "content": "수면 내시경은 진정제를 사용하여...",
      "timestamp": 1700000015
    }
  ],
  "startedAt": "2025-11-24T10:30:00.000Z",
  "endedAt": "2025-11-24T10:35:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "consultationId": "CONSULT_20251124001",
    "patientId": "P20251124001",
    "duration": 300,
    "messageCount": 8,
    "createdAt": "2025-11-24T10:35:00.000Z"
  }
}
```

---

#### 4.2 상담 기록 조회

**GET** `/consultation/:patientId`

특정 환자의 AI 상담 기록을 조회합니다. (병원 관리자용)

**Request:**
```http
GET /api/consultation/P20251124001
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patientId": "P20251124001",
    "consultations": [
      {
        "consultationId": "CONSULT_20251124001",
        "startedAt": "2025-11-24T10:30:00.000Z",
        "endedAt": "2025-11-24T10:35:00.000Z",
        "duration": 300,
        "messageCount": 8,
        "conversationLog": [
          {
            "role": "user",
            "content": "수면 내시경도 고통을 느낄 수 있나요?",
            "timestamp": 1700000000
          },
          {
            "role": "agent",
            "content": "수면 내시경은 진정제를 사용하여...",
            "timestamp": 1700000015
          }
        ]
      }
    ]
  }
}
```

---

### 5. 병원 관리자 API (Admin API)

#### 5.1 환자 링크 생성

**POST** `/admin/create-patient-link`

새로운 환자에 대한 개인화 URL을 생성합니다.

**Request:**
```http
POST /api/admin/create-patient-link
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "hospitalId": "H001",
  "patientName": "홍길동",
  "birthDate": "1990-01-01",
  "phoneNumber": "010-1234-5678",
  "examinationDate": "2025-11-24T11:00:00.000Z",
  "examinationType": "내시경 검사",
  "doctorId": "D001",
  "expiresInHours": 24
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "patientId": "P20251124001",
    "appointmentId": "A20251124001",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "url": "https://mirabel.com/p/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-11-25T11:00:00.000Z"
  }
}
```

---

#### 5.2 환자 목록 조회

**GET** `/admin/patients`

병원의 모든 환자 목록을 조회합니다.

**Request:**
```http
GET /api/admin/patients?hospitalId=H001&page=1&limit=20
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "patientId": "P20251124001",
        "name": "홍길동",
        "birthDate": "1990-01-01",
        "examinationDate": "2025-11-24T11:00:00.000Z",
        "status": "completed",
        "consentCompleted": true,
        "consultationCompleted": true,
        "createdAt": "2025-11-23T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8
    }
  }
}
```

---

## 📊 데이터 스키마 (TypeScript Interfaces)

### Patient

```typescript
interface Patient {
  patientId: string;          // Primary Key
  hospitalId: string;         // Foreign Key
  name: string;
  birthDate: string;          // YYYY-MM-DD
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Appointment

```typescript
interface Appointment {
  appointmentId: string;      // Primary Key
  patientId: string;          // Foreign Key
  hospitalId: string;
  doctorId: string;
  examinationDate: Date;
  examinationType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Consent

```typescript
interface Consent {
  consentId: string;          // Primary Key
  patientId: string;          // Foreign Key
  type: 'checkbox' | 'signature' | 'voice';
  agreed?: boolean;           // checkbox만 해당
  signatureUrl?: string;      // signature만 해당
  voiceUrl?: string;          // voice만 해당
  duration?: number;          // voice만 해당 (초)
  consentText?: string;
  createdAt: Date;
}
```

### Consultation

```typescript
interface Consultation {
  consultationId: string;     // Primary Key
  patientId: string;          // Foreign Key
  conversationLog: Message[];
  startedAt: Date;
  endedAt: Date;
  duration: number;           // 초
  messageCount: number;
  createdAt: Date;
}

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: number;          // Unix timestamp
}
```

### URLToken

```typescript
interface URLToken {
  tokenId: string;            // Primary Key
  patientId: string;          // Foreign Key
  token: string;              // JWT
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}
```

### Hospital

```typescript
interface Hospital {
  hospitalId: string;         // Primary Key
  name: string;
  logo: string;               // URL
  address: string;
  phoneNumber: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Doctor

```typescript
interface Doctor {
  doctorId: string;           // Primary Key
  hospitalId: string;         // Foreign Key
  name: string;
  photo: string;              // URL
  specialty: string;
  licenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🚨 에러 코드 정의

### 인증 에러 (4xx)

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 401 | `TOKEN_EXPIRED` | 토큰이 만료됨 |
| 401 | `INVALID_TOKEN` | 유효하지 않은 토큰 |
| 401 | `UNAUTHORIZED` | 인증 필요 |
| 403 | `FORBIDDEN` | 권한 없음 |

### 클라이언트 에러 (4xx)

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | `INVALID_REQUEST` | 잘못된 요청 형식 |
| 400 | `VALIDATION_ERROR` | 유효성 검증 실패 |
| 404 | `PATIENT_NOT_FOUND` | 환자 정보 없음 |
| 404 | `CONSENT_NOT_FOUND` | 동의서 없음 |
| 404 | `CONSULTATION_NOT_FOUND` | 상담 기록 없음 |
| 409 | `CONSENT_ALREADY_EXISTS` | 동의서 이미 존재 |
| 413 | `FILE_TOO_LARGE` | 파일 크기 초과 |
| 415 | `UNSUPPORTED_FILE_TYPE` | 지원하지 않는 파일 형식 |
| 429 | `RATE_LIMIT_EXCEEDED` | 요청 한도 초과 |

### 서버 에러 (5xx)

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |
| 502 | `BAD_GATEWAY` | 게이트웨이 오류 |
| 503 | `SERVICE_UNAVAILABLE` | 서비스 이용 불가 |

---

## 📝 에러 응답 형식

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자에게 표시할 에러 메시지",
    "details": {
      "field": "fieldName",
      "reason": "추가 설명"
    }
  }
}
```

**예시:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력 데이터가 유효하지 않습니다.",
    "details": {
      "field": "phoneNumber",
      "reason": "전화번호 형식이 올바르지 않습니다."
    }
  }
}
```

---

## 🔒 보안 고려사항

### 1. Rate Limiting

```typescript
// 환자 API: 분당 60 요청
// 관리자 API: 분당 300 요청

const rateLimits = {
  patient: { windowMs: 60000, max: 60 },
  admin: { windowMs: 60000, max: 300 }
};
```

### 2. CORS 설정

```typescript
const corsOptions = {
  origin: [
    'https://mirabel.com',
    'https://admin.mirabel.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 3. 입력 검증 (Zod)

```typescript
import { z } from 'zod';

const createPatientLinkSchema = z.object({
  hospitalId: z.string().min(1),
  patientName: z.string().min(2).max(50),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phoneNumber: z.string().regex(/^010-\d{4}-\d{4}$/),
  examinationDate: z.string().datetime(),
  examinationType: z.string(),
  doctorId: z.string(),
  expiresInHours: z.number().min(1).max(168) // 최대 1주일
});
```

### 4. 민감 정보 로깅 제외

```typescript
// 로그에서 제외할 필드
const sensitiveFields = [
  'signature',
  'voiceFile',
  'phoneNumber',
  'birthDate'
];

function sanitizeLog(data: any) {
  const sanitized = { ...data };
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  return sanitized;
}
```

---

## 📞 API 테스팅

### Postman Collection

프로젝트 루트의 `postman/` 디렉토리에 Postman Collection이 포함되어 있습니다.

```bash
postman/
├── Mirabel_API.postman_collection.json
└── Mirabel_Environments.postman_environment.json
```

### cURL 예시

```bash
# 환자 정보 조회
curl -X GET \
  'https://api.mirabel.com/api/patient/verify-token/YOUR_TOKEN' \
  -H 'Content-Type: application/json'

# 체크박스 동의 저장
curl -X POST \
  'https://api.mirabel.com/api/consent/checkbox' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "patientId": "P20251124001",
    "agreed": true,
    "consentText": "내시경 검사에서...",
    "timestamp": "2025-11-24T10:15:00.000Z"
  }'
```

---

## 📚 참고 문서

- [Prisma Schema](./prisma/schema.prisma)
- [API Routes](./api/src/routes/)
- [Validation Schemas](./api/src/validation/)

---

## 📞 문의

API 관련 문의사항은 다음으로 연락 주시기 바랍니다:
- **Backend Team**: backend@example.com
- **Slack**: #mirabel-backend
