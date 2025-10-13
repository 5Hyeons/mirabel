# LiveKit + WebGL 통합 가이드

## 🎯 개요

본 문서는 **Unity WebGL** 기반 3D 아바타와 **LiveKit Agents**를 활용한 실시간 AI 상담 시스템의 통합 방법을 상세하게 설명합니다.

---

## 🏗 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────────────┐
│                      React Web Application                       │
│  ┌─────────────────────┐           ┌────────────────────────┐    │
│  │  UI Components      │           │  Unity WebGL           │    │
│  │  (상태, 버튼 등)      │◄─────────►│  (3D Avatar)           │    │
│  └─────────────────────┘           └────────────┬───────────┘    │
│                                                 │                │
│                                                 │ jslib Bridge   │
└─────────────────────────────────────────────────┼────────────────┘
                                                  │
                           WebSocket (LiveKit)    │
                                                  ▼
                        ┌────────────────────────────────────┐
                        │      LiveKit Server (SFU)          │
                        │  - Audio Routing                   │
                        │  - RPC Handling                    │
                        └────────────┬───────────────────────┘
                                     │
                                     │ Audio Stream + RPC
                                     ▼
                        ┌────────────────────────────────┐
                        │    Python Agent                │
                        │  - STT (Whisper/Google)        │
                        │  - LLM (GPT-4/Claude)          │
                        │  - TTS (OpenAI/ElevenLabs)     │
                        │  - Face Animation (TalkMotion) │
                        └────────────────────────────────┘
```

---

## 🎮 Unity WebGL 통합

### 1. Unity 프로젝트 설정

#### 1.1 프로젝트 구조

```
unity-webgl/
├── Assets/
│   ├── LiveKit/                    # LiveKit Unity SDK
│   ├── Plugins/
│   │   └── WebGL/
│   │       └── BridgeToReact.jslib # React ↔ Unity 통신
│   ├── Scenes/
│   │   └── AIConsultation.unity    # 상담 씬
│   ├── Scripts/
│   │   ├── LiveKitManager.cs       # LiveKit 연결 관리
│   │   ├── AvatarController.cs     # 아바타 제어
│   │   ├── LipSyncController.cs    # 립싱크 제어
│   │   └── ReactBridge.cs          # React 브릿지
│   └── Models/
│       └── DoctorAvatar.vrm        # VRM 아바타
├── Packages/
│   └── manifest.json
└── ProjectSettings/
    └── ProjectSettings.asset
```

---

#### 1.2 Build Settings

**File → Build Settings → WebGL**

```
Platform: WebGL
Compression Format: Gzip
Code Optimization: Master
Enable Exceptions: None
Strip Engine Code: Yes
Managed Stripping Level: High

Player Settings:
- Resolution:
  - Default Canvas Width: 800
  - Default Canvas Height: 600
  - Run In Background: Yes

- Publishing Settings:
  - Compression Format: Gzip
  - Data caching: Yes
  - WebGL Memory Size: 512 MB (조정 가능)

- Other Settings:
  - Api Compatibility Level: .NET Standard 2.1
  - Managed Stripping Level: High
```

---

### 2. LiveKit Unity SDK 통합

#### 2.1 Package 설치

```json
// Packages/manifest.json
{
  "dependencies": {
    "com.livekit.livekit-unity": "https://github.com/livekit/client-sdk-unity.git#v0.3.0",
    "com.vrmc.univrm": "0.108.0",
    "com.unity.nuget.newtonsoft-json": "3.2.1"
  }
}
```

---

#### 2.2 LiveKitManager.cs

```csharp
using UnityEngine;
using LiveKit;
using System;
using System.Threading.Tasks;

public class LiveKitManager : MonoBehaviour
{
    [SerializeField] private string livekitUrl;
    [SerializeField] private AvatarController avatarController;

    private Room room;
    private bool isConnected = false;

    // React로부터 호출됨
    public async void ConnectToRoom(string token)
    {
        try
        {
            Debug.Log($"Connecting to LiveKit: {livekitUrl}");

            room = new Room();

            // Room 이벤트 리스너
            room.Connected += OnRoomConnected;
            room.Disconnected += OnRoomDisconnected;
            room.TrackSubscribed += OnTrackSubscribed;
            room.DataReceived += OnDataReceived;

            await room.Connect(livekitUrl, token);
        }
        catch (Exception ex)
        {
            Debug.LogError($"LiveKit connection error: {ex.Message}");
            SendToReact("onConnectionError", ex.Message);
        }
    }

    private void OnRoomConnected(Room room)
    {
        Debug.Log("Connected to LiveKit room");
        isConnected = true;
        SendToReact("onConnected", "success");
    }

    private void OnRoomDisconnected(Room room)
    {
        Debug.Log("Disconnected from LiveKit room");
        isConnected = false;
        SendToReact("onDisconnected", "");
    }

    private void OnTrackSubscribed(IRemoteTrack track, RemoteTrackPublication publication, RemoteParticipant participant)
    {
        Debug.Log($"Track subscribed: {track.Kind} from {participant.Identity}");

        if (track.Kind == TrackKind.Audio && participant.Identity.StartsWith("agent"))
        {
            // Agent의 오디오 트랙
            var audioTrack = track as RemoteAudioTrack;
            if (audioTrack != null)
            {
                // 오디오 재생 (Unity AudioSource에 연결)
                PlayAudioTrack(audioTrack);
            }
        }
    }

    private void OnDataReceived(byte[] data, RemoteParticipant participant)
    {
        // Agent로부터 데이터 수신 (립싱크 정보 등)
        string jsonData = System.Text.Encoding.UTF8.GetString(data);
        Debug.Log($"Data received: {jsonData}");

        var message = JsonUtility.FromJson<AgentMessage>(jsonData);

        if (message.type == "lipSync")
        {
            // 립싱크 데이터 적용
            avatarController.ApplyLipSync(message.blendShapes);
        }
    }

    // Agent에게 RPC 호출 (답변 중단)
    public async void SendInterrupt()
    {
        if (!isConnected) return;

        try
        {
            var response = await room.LocalParticipant.PerformRpc(
                destinationIdentity: "agent",
                method: "interrupt",
                payload: ""
            );

            Debug.Log("Interrupt signal sent to agent");
            SendToReact("onInterruptSent", "success");
        }
        catch (Exception ex)
        {
            Debug.LogError($"Failed to send interrupt: {ex.Message}");
        }
    }

    private void PlayAudioTrack(RemoteAudioTrack audioTrack)
    {
        // Unity AudioSource에 오디오 스트림 연결
        AudioSource audioSource = gameObject.AddComponent<AudioSource>();
        audioSource.clip = AudioClip.Create(
            "AgentAudio",
            audioTrack.SampleRate * 10, // 10초 버퍼
            audioTrack.Channels,
            audioTrack.SampleRate,
            true
        );
        audioSource.Play();

        // 오디오 데이터 스트리밍
        audioTrack.AudioFrameReceived += (frame) =>
        {
            // 오디오 프레임을 AudioSource에 전달
            // 립싱크 컨트롤러에도 전달
            if (avatarController != null)
            {
                avatarController.ProcessAudioFrame(frame.Data);
            }
        };
    }

    // React로 메시지 전송
    private void SendToReact(string eventName, string data)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        ReactBridge.SendMessage(eventName, data);
        #endif
    }

    public void Disconnect()
    {
        if (room != null)
        {
            room.Disconnect();
            room = null;
        }
    }

    private void OnDestroy()
    {
        Disconnect();
    }
}

[Serializable]
public class AgentMessage
{
    public string type;
    public float[] blendShapes;
}
```

---

### 3. 아바타 제어 (VRM + Lip Sync)

#### 3.1 AvatarController.cs

```csharp
using UnityEngine;
using UniVRM10;

public class AvatarController : MonoBehaviour
{
    [SerializeField] private Vrm10Instance vrmInstance;
    private LipSyncController lipSyncController;

    private void Start()
    {
        lipSyncController = GetComponent<LipSyncController>();

        if (vrmInstance == null)
        {
            Debug.LogError("VRM Instance not assigned!");
        }
    }

    // 립싱크 블렌드셰이프 적용 (Agent로부터 수신)
    public void ApplyLipSync(float[] blendShapes)
    {
        if (vrmInstance == null || blendShapes == null) return;

        // blendShapes 배열: [A, I, U, E, O, Blink]
        var blendShapeProxy = vrmInstance.Runtime.Expression;

        blendShapeProxy.SetWeight(ExpressionKey.Aa, blendShapes[0]);   // A
        blendShapeProxy.SetWeight(ExpressionKey.Ih, blendShapes[1]);   // I
        blendShapeProxy.SetWeight(ExpressionKey.Ou, blendShapes[2]);   // U
        blendShapeProxy.SetWeight(ExpressionKey.Ee, blendShapes[3]);   // E
        blendShapeProxy.SetWeight(ExpressionKey.Oh, blendShapes[4]);   // O
        blendShapeProxy.SetWeight(ExpressionKey.Blink, blendShapes[5]); // Blink
    }

    // 오디오 프레임으로 립싱크 생성 (로컬 처리)
    public void ProcessAudioFrame(float[] audioData)
    {
        if (lipSyncController != null)
        {
            lipSyncController.ProcessAudio(audioData);
        }
    }

    // 아바타 애니메이션 (Idle, Speaking 등)
    public void SetAnimationState(string state)
    {
        // Animator 파라미터 설정
        var animator = GetComponent<Animator>();
        if (animator != null)
        {
            animator.SetTrigger(state);
        }
    }
}
```

---

#### 3.2 LipSyncController.cs

```csharp
using UnityEngine;

public class LipSyncController : MonoBehaviour
{
    [SerializeField] private float sensitivity = 1.5f;
    [SerializeField] private float smoothing = 10f;

    private float[] currentBlendShapes = new float[6]; // A, I, U, E, O, Blink
    private float[] targetBlendShapes = new float[6];

    // 오디오 데이터로부터 립싱크 계산
    public void ProcessAudio(float[] audioData)
    {
        // 간단한 볼륨 기반 립싱크 (실제로는 더 정교한 알고리즘 필요)
        float volume = CalculateVolume(audioData);

        // 볼륨에 따라 입 모양 설정
        if (volume > 0.1f)
        {
            // 말하는 중: A와 I 블렌드셰이프 사용
            targetBlendShapes[0] = Mathf.Clamp01(volume * sensitivity * 0.8f); // A
            targetBlendShapes[1] = Mathf.Clamp01(volume * sensitivity * 0.5f); // I
        }
        else
        {
            // 침묵: 입 닫기
            targetBlendShapes[0] = 0f;
            targetBlendShapes[1] = 0f;
        }

        // 자연스러운 깜박임
        if (Random.value < 0.01f) // 1% 확률로 깜박임
        {
            targetBlendShapes[5] = 1f; // Blink
        }
        else
        {
            targetBlendShapes[5] = 0f;
        }
    }

    private void Update()
    {
        // 부드러운 전환 (Lerp)
        for (int i = 0; i < currentBlendShapes.Length; i++)
        {
            currentBlendShapes[i] = Mathf.Lerp(
                currentBlendShapes[i],
                targetBlendShapes[i],
                smoothing * Time.deltaTime
            );
        }

        // AvatarController에 적용
        GetComponent<AvatarController>().ApplyLipSync(currentBlendShapes);
    }

    private float CalculateVolume(float[] audioData)
    {
        float sum = 0f;
        for (int i = 0; i < audioData.Length; i++)
        {
            sum += Mathf.Abs(audioData[i]);
        }
        return sum / audioData.Length;
    }
}
```

---

### 4. React ↔ Unity 통신

#### 4.1 BridgeToReact.jslib

```javascript
// Assets/Plugins/WebGL/BridgeToReact.jslib

var ReactBridge = {
    $bridgeState: {
        reactCallbacks: {}
    },

    // React에 메시지 전송
    SendMessage: function(eventName, data) {
        var event = UTF8ToString(eventName);
        var payload = UTF8ToString(data);

        console.log("[Unity → React]", event, payload);

        // React의 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('UnityMessage', {
            detail: {
                event: event,
                data: payload
            }
        }));
    },

    // React로부터 호출 등록
    RegisterCallback: function(eventName, callback) {
        var event = UTF8ToString(eventName);
        bridgeState.reactCallbacks[event] = callback;
        console.log("[React → Unity] Callback registered:", event);
    }
};

autoAddDeps(ReactBridge, '$bridgeState');
mergeInto(LibraryManager.library, ReactBridge);
```

---

#### 4.2 ReactBridge.cs

```csharp
using System.Runtime.InteropServices;
using UnityEngine;

public class ReactBridge : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void SendMessage(string eventName, string data);

    // Unity → React
    public static void SendToReact(string eventName, string data)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        SendMessage(eventName, data);
        #else
        Debug.Log($"[Mock] Unity → React: {eventName}, {data}");
        #endif
    }

    // React → Unity (Unity 함수 직접 호출)
    public void OnReactMessage(string message)
    {
        Debug.Log($"[React → Unity] Message received: {message}");

        // JSON 파싱 후 처리
        var data = JsonUtility.FromJson<ReactMessage>(message);

        switch (data.action)
        {
            case "connect":
                FindObjectOfType<LiveKitManager>().ConnectToRoom(data.token);
                break;

            case "interrupt":
                FindObjectOfType<LiveKitManager>().SendInterrupt();
                break;

            case "disconnect":
                FindObjectOfType<LiveKitManager>().Disconnect();
                break;
        }
    }
}

[System.Serializable]
public class ReactMessage
{
    public string action;
    public string token;
}
```

---

### 5. React 통합

#### 5.1 UnityWebGL 컴포넌트

```typescript
// components/UnityWebGL.tsx
import React, { useEffect, useRef } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

interface UnityWebGLProps {
  livekitToken: string;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: string) => void;
}

export default function UnityWebGL({ livekitToken, onConnected, onDisconnected, onError }: UnityWebGLProps) {
  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
    loaderUrl: '/unity/Build.loader.js',
    dataUrl: '/unity/Build.data',
    frameworkUrl: '/unity/Build.framework.js',
    codeUrl: '/unity/Build.wasm'
  });

  // Unity로부터 이벤트 수신
  useEffect(() => {
    addEventListener('UnityMessage', handleUnityMessage);

    return () => {
      removeEventListener('UnityMessage', handleUnityMessage);
    };
  }, [addEventListener, removeEventListener]);

  function handleUnityMessage(event: CustomEvent) {
    const { event: eventName, data } = event.detail;

    console.log('[React ← Unity]', eventName, data);

    switch (eventName) {
      case 'onConnected':
        onConnected();
        break;
      case 'onDisconnected':
        onDisconnected();
        break;
      case 'onConnectionError':
        onError(data);
        break;
    }
  }

  // Unity 로드 완료 시 LiveKit 연결
  useEffect(() => {
    if (isLoaded && livekitToken) {
      connectToLiveKit();
    }
  }, [isLoaded, livekitToken]);

  function connectToLiveKit() {
    sendMessage('LiveKitManager', 'ConnectToRoom', livekitToken);
  }

  function handleInterrupt() {
    sendMessage('LiveKitManager', 'SendInterrupt', '');
  }

  function handleDisconnect() {
    sendMessage('LiveKitManager', 'Disconnect', '');
  }

  return (
    <div className="unity-container">
      <Unity
        unityProvider={unityProvider}
        style={{ width: '100%', height: '100%' }}
      />

      {/* 디버그 컨트롤 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-controls">
          <button onClick={connectToLiveKit}>Connect</button>
          <button onClick={handleInterrupt}>Interrupt</button>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

---

## 🐍 Python Agent 구현

### 1. Agent 프로젝트 구조

```
agent/
├── main.py                 # 메인 진입점
├── agent.py                # Agent 로직
├── requirements.txt
└── config.py               # 설정
```

---

### 2. requirements.txt

```txt
livekit==0.10.0
livekit-agents==0.8.0
openai==1.12.0
anthropic==0.18.0
google-cloud-speech==2.20.0
python-dotenv==1.0.0
```

---

### 3. main.py

```python
import asyncio
import logging
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from agent import EndoscopyConsultationAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def entrypoint(ctx: JobContext):
    """Agent 진입점"""
    logger.info(f"Starting agent for room: {ctx.room.name}")

    # Agent 인스턴스 생성
    agent = EndoscopyConsultationAgent(ctx)

    # Room 연결
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Agent 시작
    await agent.start()

    logger.info("Agent started successfully")


if __name__ == "__main__":
    # Worker 실행
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

---

### 4. agent.py

```python
import asyncio
import json
from typing import Optional
from livekit import rtc
from livekit.agents import JobContext, llm, stt, tts, metrics
import openai


class EndoscopyConsultationAgent:
    """내시경 검사 상담 Agent"""

    def __init__(self, ctx: JobContext):
        self.ctx = ctx
        self.room = ctx.room
        self.participant: Optional[rtc.RemoteParticipant] = None

        # AI 서비스 초기화
        self.stt_service = stt.STT(provider="openai")  # Whisper
        self.llm_service = llm.LLM(provider="openai", model="gpt-4")
        self.tts_service = tts.TTS(provider="openai", voice="alloy")

        # 대화 컨텍스트
        self.conversation_history = []

        # 내시경 검사 관련 지식 베이스
        self.knowledge_base = self._load_knowledge_base()

        # RPC 핸들러 등록
        self.room.local_participant.register_rpc_method("interrupt", self.handle_interrupt)

    def _load_knowledge_base(self) -> dict:
        """내시경 검사 FAQ 로드"""
        return {
            "questions": [
                {
                    "question": "수면 내시경도 고통을 느낄 수 있나요?",
                    "answer": "수면 내시경은 진정제를 사용하여 환자가 편안한 상태에서 검사를 받도록 합니다. "
                             "대부분의 환자는 검사 중 불편함을 거의 느끼지 못하며, 검사 후에도 통증이 경미합니다. "
                             "다만, 개인차가 있어 일부 환자는 약간의 불편함을 느낄 수 있습니다."
                },
                {
                    "question": "검사 전 금식은 얼마나 해야 하나요?",
                    "answer": "위내시경의 경우 검사 8시간 전부터 금식이 필요합니다. "
                             "물은 검사 2시간 전까지 소량 섭취 가능하며, 당일 아침 약은 의사와 상담 후 복용 여부를 결정하셔야 합니다."
                },
                {
                    "question": "검사 후 운전이 가능한가요?",
                    "answer": "수면 내시경의 경우 진정제 영향으로 검사 당일 운전은 금지됩니다. "
                             "보호자 동반이 필요하며, 대중교통이나 택시 이용을 권장합니다. "
                             "일반 내시경의 경우 운전이 가능합니다."
                }
            ]
        }

    async def start(self):
        """Agent 시작"""
        # 참여자 대기
        self.participant = await self._wait_for_participant()

        if not self.participant:
            logger.error("No participant found")
            return

        logger.info(f"Patient connected: {self.participant.identity}")

        # 환영 메시지
        await self._speak("안녕하세요. AI 의사입니다. 내시경 검사에 대해 궁금하신 점을 편하게 물어보세요.")

        # 오디오 트랙 구독
        await self._subscribe_to_audio()

    async def _wait_for_participant(self, timeout: int = 30) -> Optional[rtc.RemoteParticipant]:
        """환자 참여 대기"""
        start_time = asyncio.get_event_loop().time()

        while asyncio.get_event_loop().time() - start_time < timeout:
            for participant in self.room.remote_participants.values():
                if not participant.identity.startswith("agent"):
                    return participant
            await asyncio.sleep(0.5)

        return None

    async def _subscribe_to_audio(self):
        """환자 오디오 트랙 구독"""
        for publication in self.participant.track_publications.values():
            if publication.kind == rtc.TrackKind.KIND_AUDIO:
                await publication.set_subscribed(True)
                publication.track.on("frame_received", self._on_audio_frame)

    async def _on_audio_frame(self, frame: rtc.AudioFrame):
        """오디오 프레임 수신 (음성 인식)"""
        # STT 처리
        text = await self.stt_service.recognize(frame.data)

        if text:
            logger.info(f"Patient said: {text}")

            # 대화 기록 저장
            self.conversation_history.append({
                "role": "user",
                "content": text
            })

            # LLM 응답 생성
            response = await self._generate_response(text)

            # TTS 변환 및 전송
            await self._speak(response)

    async def _generate_response(self, user_input: str) -> str:
        """LLM 응답 생성"""
        # 시스템 프롬프트
        system_prompt = """
        당신은 내시경 검사 전문 의료 상담 AI입니다.
        환자의 질문에 친절하고 정확하게 답변하세요.
        의학적 조언은 일반적인 정보만 제공하고, 구체적인 진단이나 치료는 의사와 상담하도록 안내하세요.
        """

        # FAQ에서 유사 질문 검색
        similar_answer = self._search_faq(user_input)
        if similar_answer:
            context = f"[FAQ 참고]: {similar_answer}"
        else:
            context = ""

        # LLM 호출
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": context},
            *self.conversation_history
        ]

        response = await self.llm_service.generate(messages)

        # 대화 기록 저장
        self.conversation_history.append({
            "role": "assistant",
            "content": response
        })

        return response

    def _search_faq(self, query: str) -> Optional[str]:
        """FAQ 검색 (간단한 키워드 매칭)"""
        query_lower = query.lower()

        for item in self.knowledge_base["questions"]:
            if any(keyword in query_lower for keyword in ["고통", "아픔", "통증"]):
                return item["answer"]
            elif any(keyword in query_lower for keyword in ["금식", "먹", "음식"]):
                return item["answer"]
            elif any(keyword in query_lower for keyword in ["운전", "차"]):
                return item["answer"]

        return None

    async def _speak(self, text: str):
        """TTS 음성 전송"""
        logger.info(f"Agent speaking: {text}")

        # TTS 변환
        audio_data = await self.tts_service.synthesize(text)

        # 오디오 트랙으로 전송
        audio_source = rtc.AudioSource(sample_rate=24000, num_channels=1)
        track = rtc.LocalAudioTrack.create_audio_track("agent-audio", audio_source)

        # 트랙 발행
        await self.room.local_participant.publish_track(track)

        # 오디오 데이터 스트리밍
        await audio_source.capture_frame(audio_data)

        # 립싱크 데이터 전송 (블렌드셰이프)
        lip_sync_data = self._generate_lip_sync(audio_data)
        await self._send_lip_sync_data(lip_sync_data)

    def _generate_lip_sync(self, audio_data: bytes) -> list:
        """립싱크 블렌드셰이프 생성"""
        # 실제로는 Fluentt TalkMotion API 또는 Oculus LipSync 사용
        # 여기서는 간단한 더미 데이터 반환

        # 오디오 볼륨 기반 간단한 립싱크
        volume = sum(abs(sample) for sample in audio_data) / len(audio_data)

        return [
            volume * 0.8,  # A
            volume * 0.5,  # I
            volume * 0.3,  # U
            volume * 0.4,  # E
            volume * 0.6,  # O
            0.0            # Blink
        ]

    async def _send_lip_sync_data(self, blend_shapes: list):
        """립싱크 데이터를 Unity로 전송"""
        data = json.dumps({
            "type": "lipSync",
            "blendShapes": blend_shapes
        }).encode('utf-8')

        # Data Channel로 전송
        await self.room.local_participant.publish_data(
            data,
            kind=rtc.DataPacketKind.KIND_RELIABLE
        )

    async def handle_interrupt(self, data: rtc.RpcInvocationData) -> str:
        """RPC: 답변 중단"""
        logger.info("Interrupt signal received from patient")

        # TTS 중단
        # (실제 구현에서는 TTS 스트리밍 중단 로직 필요)

        return json.dumps({"success": True})
```

---

### 5. config.py

```python
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # LiveKit
    LIVEKIT_URL = os.getenv("LIVEKIT_URL", "ws://localhost:7880")
    LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
    LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

    # OpenAI
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    # Anthropic
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

    # Agent Settings
    AGENT_NAME = "EndoscopyConsultationAgent"
    AGENT_VERSION = "1.0.0"
```

---

## 🚀 배포 및 실행

### 1. Unity WebGL 빌드

```bash
# Unity Editor에서 빌드
File → Build Settings → WebGL → Build

# 빌드 결과물
unity-webgl/Build/
├── Build.data
├── Build.framework.js
├── Build.loader.js
└── Build.wasm

# React public 폴더로 복사
cp -r unity-webgl/Build/* web/public/unity/
```

---

### 2. Python Agent 실행

```bash
# 의존성 설치
cd agent
pip install -r requirements.txt

# 환경 변수 설정
export LIVEKIT_URL=wss://livekit.mirabel.com
export LIVEKIT_API_KEY=your_api_key
export LIVEKIT_API_SECRET=your_api_secret
export OPENAI_API_KEY=your_openai_key

# Agent 실행
python main.py start
```

---

### 3. 전체 시스템 Docker Compose

```yaml
version: '3.8'

services:
  # LiveKit Server
  livekit:
    image: livekit/livekit-server:latest
    ports:
      - "7880:7880"   # WebSocket
      - "7881:7881"   # HTTP
    environment:
      - LIVEKIT_KEYS=${LIVEKIT_API_KEY}:${LIVEKIT_API_SECRET}
    volumes:
      - ./livekit.yaml:/etc/livekit.yaml

  # Python Agent
  agent:
    build: ./agent
    environment:
      - LIVEKIT_URL=ws://livekit:7880
      - LIVEKIT_API_KEY=${LIVEKIT_API_KEY}
      - LIVEKIT_API_SECRET=${LIVEKIT_API_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - livekit

  # React Web App
  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_LIVEKIT_URL=wss://livekit.mirabel.com
    depends_on:
      - livekit
```

---

## 📊 모니터링 및 디버깅

### 1. Unity 콘솔 로그

```csharp
// Debug.Log를 브라우저 콘솔로 출력
Debug.Log("LiveKit connected");
// → 브라우저 Console에서 확인 가능
```

### 2. LiveKit Inspector

```
http://localhost:7881/inspector
```

LiveKit Inspector에서 다음을 확인 가능:
- Room 상태
- Participant 목록
- Track 정보
- 네트워크 품질

### 3. Performance Profiler

```typescript
// React에서 성능 측정
import { performance } from 'perf_hooks';

const startTime = performance.now();
// ... Unity 로딩
const loadTime = performance.now() - startTime;
console.log(`Unity loaded in ${loadTime}ms`);
```

---

## 🐛 트러블슈팅

### 1. Unity WebGL 로딩 실패

**증상**: Unity가 로딩되지 않음

**해결책**:
```typescript
// 브라우저 호환성 확인
const isWebGLSupported = (() => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
})();

if (!isWebGLSupported) {
  alert('이 브라우저는 WebGL을 지원하지 않습니다.');
}
```

---

### 2. 마이크 권한 거부

**증상**: 음성 입력이 안 됨

**해결책**:
```typescript
async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    alert('마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해주세요.');
    return false;
  }
}
```

---

### 3. 립싱크 지연

**증상**: 아바타 입 모양과 오디오 싱크 안 맞음

**해결책**:
```csharp
// Unity에서 오디오 지연 보상
[SerializeField] private float lipSyncDelay = 0.1f; // 100ms 지연

private IEnumerator ApplyLipSyncWithDelay(float[] blendShapes)
{
    yield return new WaitForSeconds(lipSyncDelay);
    avatarController.ApplyLipSync(blendShapes);
}
```

---

## 📚 참고 자료

- **LiveKit Documentation**: https://docs.livekit.io/
- **LiveKit Unity SDK**: https://github.com/livekit/client-sdk-unity
- **UniVRM**: https://github.com/vrm-c/UniVRM
- **Oculus LipSync**: https://developer.oculus.com/downloads/package/oculus-lipsync-unity/

---

## 📞 문의

LiveKit 통합 관련 문의사항은 다음으로 연락 주시기 바랍니다:
- **Unity Developer**: unity@example.com
- **AI Engineer**: ai@example.com
- **Slack**: #mirabel-livekit
