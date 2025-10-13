# 필요한 이미지 목록

## 📸 다운로드 방법

### Option 1: Figma Desktop App에서 직접 Export (추천)
```
1. Figma Desktop App 실행
2. TalkMotion_UI_v2.0 파일 열기
3. 각 화면에서 이미지 레이어 선택
4. 우클릭 → Export → PNG/SVG
5. public/images/ 폴더에 저장
```

### Option 2: Figma localhost에서 다운로드
```
1. Figma Desktop App 실행 상태로 유지
2. 브라우저에서 아래 URL 접속
3. 우클릭 → 다른 이름으로 저장
4. public/images/에 저장
```

---

## 🖼️ 이미지 파일 목록 (21개)

### 의사 아바타 이미지 (PNG - 4개)
| 파일명 | 용도 | Figma URL |
|--------|------|-----------|
| `doctor-avatar.png` | 진입화면 배경 | http://localhost:3845/assets/566b019bcb330bf030c5ac5b85b794bf9e73309a.png |
| `doctor-photo.png` | 의사 소개 사진 | http://localhost:3845/assets/42110cd6ee54bf38104263f451746d2cd5091405.png |
| `doctor-avatar-complete.png` | 동의서 완료 화면 | http://localhost:3845/assets/b609b97adb2ce89b2f6f0b31110e73c5610d087f.png |
| `doctor-avatar-ai.png` | AI 상담 화면 | http://localhost:3845/assets/4b72ba26f4b0c8b601fe90b5a1fcedc2925e2c67.png |

### 아이콘 (PNG - 3개)
| 파일명 | 용도 | Figma URL |
|--------|------|-----------|
| `icon-document.png` | 동의서 아이콘 | http://localhost:3845/assets/aa318136e91cda850efce3185146c3439cb2ebec.png |
| `icon-pen.png` | 전자 서명 아이콘 | http://localhost:3845/assets/0ecfcbcb1533e4e9b19ea6125e0f70c5ac432826.png |
| `icon-mic-large.png` | 음성 녹음 아이콘 | http://localhost:3845/assets/650d683f0fb93f3e7591dbbb4ff3cc3fd0aca79c.png |

### 네비게이션 아이콘 (SVG - 4개)
| 파일명 | 용도 | Figma URL |
|--------|------|-----------|
| `icon-arrow-left.svg` | 뒤로가기 | http://localhost:3845/assets/77b621c6591a28930e3f80610e44541056d18b10.svg |
| `icon-arrow-right.svg` | 다음 | http://localhost:3845/assets/31b2bd24af4b6793ef9d988f3eca3c6b13f307e1.svg |
| `icon-home.svg` | 홈 | http://localhost:3845/assets/0f466c9b3e849494cccc274f54cee555ada26e5c.svg |
| `icon-globe.svg` | 언어 변경 | http://localhost:3845/assets/0147c8eb845ff42ae8172d7d5bb3bfc957437bfc.svg |

### 기능 아이콘 (SVG - 10개)
| 파일명 | 용도 | Figma URL |
|--------|------|-----------|
| `icon-check.svg` | 체크 마크 | http://localhost:3845/assets/ae0da2373926501542ddd4a244c76169a3c57d5e.svg |
| `icon-check-circle.svg` | 완료 체크 | http://localhost:3845/assets/4597f96e9d3bdae811ab0fceb0525a299caf06aa.svg |
| `icon-mic.svg` | 마이크 | http://localhost:3845/assets/35c719555cadc6c4cd65871b3b137bc976947d9a.svg |
| `icon-bin.svg` | 삭제/지우기 | http://localhost:3845/assets/a7be57f757d722d30075e688ddd53da1155c6dcd.svg |
| `icon-refresh.svg` | 새로고침 | http://localhost:3845/assets/2d445e7d5260924b2aacea26dc24e9c7807ecf9c.svg |
| `icon-play.svg` | 재생 | http://localhost:3845/assets/8fd7a076c5ed902bba6b812ed4465c48753f1bbe.svg |
| `icon-loudspeaker.svg` | 스피커/음소거 | http://localhost:3845/assets/078f8d0f45b691a965e42e807cfcb023a2c6f151.svg |
| `icon-listening.svg` | 듣기 상태 | http://localhost:3845/assets/b02ec3f52cc90ab3d0084232f783e93ca70a8be6.svg |
| `dotted-line.svg` | 서명 점선 | http://localhost:3845/assets/0899078d91b36ae786392c0575a63609cbd9e099.svg |
| `speech-bubble.svg` | 말풍선 | http://localhost:3845/assets/c4a129aec504dd5452745679006d55b60fd73e1f.svg |

---

## 🚀 빠른 다운로드 스크립트

이미지를 한 번에 다운로드하려면:

```bash
# Figma Desktop App 실행 후
cd public/images

# 각 URL을 브라우저에서 열어 다운로드
# 또는 curl 사용 (Figma Desktop App 실행 중일 때만)
curl -o doctor-avatar.png "http://localhost:3845/assets/566b019bcb330bf030c5ac5b85b794bf9e73309a.png"
curl -o doctor-photo.png "http://localhost:3845/assets/42110cd6ee54bf38104263f451746d2cd5091405.png"
# ... (나머지도 동일)
```

---

## 📝 진행 상황

- [x] 이미지 경로 코드에서 수정 완료
- [ ] 21개 이미지 파일 다운로드 필요
- [ ] public/images/ 폴더에 저장

---

## 💡 임시 대안 (플레이스홀더)

이미지 다운로드 전에 임시로 구조를 확인하려면:
- 빈 PNG/SVG 파일을 생성하거나
- 텍스트로 대체하여 레이아웃 먼저 확인 가능

실제 이미지는 Figma에서 Export 후 교체하세요.
