## 진입 화면
1. 초기 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-6188&m=dev
- 검사 설명 보기 버튼을 클릭하면 다음으로 넘어감

## 검사 안내 화면
1. 의사 소개 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9033&m=dev
- 확인 버튼을 클릭하면 다음으로 넘어감
2. 내시경 검사 설명 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9114&m=dev
- 다음 버튼을 누르면 다음으로 넘어감

## 사용자 동의서 작성 화면
1. 검사 동의서를 체크박스로 받는 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9190&m=dev
- '예' 체크박스와 '필수 동의하기' 버튼을 클릭하면 다음으로 넘어감
2. 검사 동의를 서명으로 받는 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-10030&m=dev
- '전자 서명 입력' 칸에 사용자가 손으로 서명을 입력하면 '다음' 버튼 활성화 --> https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-10113&m=dev
- 다음 버튼 선택하면 다음 화면으로 넘어감
3. 검사 동의를 음성 녹음으로 받는 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=77-9266&m=dev
- '녹음 시작' 버튼을 선택하면 녹음 시작되고 [이 화면](https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-5995&m=dev)으로 UI가 변함
- 녹음 진행 중에 '녹음중' 버튼을 선택하면 [이 화면](https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6061&m=dev)으로 UI가 변함
- 다음 버튼을 선택하면 다음으로 넘어감
4. 동의서 작성 완료 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6350&m=dev
- '추가 문의하기' 버튼을 선택하면 다음 AI 상담 화면으로 넘어감
- '완료 버튼을 선택하면 종료됨

## AI 상담 화면
1. [livekit agent WebGL SDK](https://github.com/livekit/client-sdk-unity-web)와 연동된 AI 아바타와의 상담 페이지
- https://www.figma.com/design/NJnfnki91NVls4ef06Mokn/TalkMotion_UI_v2.0--2025-?node-id=89-6570&m=dev
- 기본적으로 livekit room에 접속하여 Agent와 음성으로 소통이 가능하며 3d 아바타와 WebGL을 통해 실시간으로 상호작용 가능함
- '답변 멈추기' 버튼을 선택하면 Agent에게 interrupt를 발생시키는 rpc 전달
- '끝내기' 버튼을 선택하면 종료됨