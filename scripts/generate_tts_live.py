import asyncio
import contextlib
import wave
import os

from google import genai
from google.genai import types

# API 키 설정
API_KEY = "AIzaSyBmyMAod0TljmIXTuiYP7-MvLMr7_ySwcE"

GENAI = genai.Client(api_key=API_KEY)
MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025'
CONFIG = types.LiveConnectConfig(
    response_modalities=['AUDIO'],
    speech_config=types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name='Puck',
            )
        )
    ),
)

PROMPT = """다음 문장을 자연스럽게 읽어주세요:

이상으로 수면내시경 설명 및 동의서 작성이 끝났습니다.

검사에 대해 궁금한 점이 있으시다면 하단 좌측 "AI상담사"를 통해 상담 받으시고,

부족한 설명이 있다면 내방 병원의 의료진에게 전달하여 현장에서 추가 답변 드릴 수 있도록 하겠습니다.

수고 많으셨습니다. 오늘도 즐거운 하루되세요."""

FILENAME = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'greeting_6.wav')

@contextlib.contextmanager
def wave_file(filename, channels=1, rate=24000, sample_width=2):
    'set up .wav file writer'
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        yield wf

async def request_audio(prompt=PROMPT, filename=FILENAME):
    'request LLM generate audio file given prompt'
    print(f'\n** Using model: {MODEL}')
    print(f'** Voice: Puck')
    print(f'** Generating audio...')

    async with GENAI.aio.live.connect(model=MODEL, config=CONFIG) as session:
        with wave_file(filename) as f:
            # Content 형식으로 변환
            content = types.Content(
                role="user",
                parts=[types.Part(text=prompt)]
            )
            await session.send_client_content(turns=[content], turn_complete=True)
            async for response in session.receive():
                if response.data:
                    f.writeframes(response.data)

    print(f'** Saved audio to "{filename}"')

if __name__ == '__main__':
    asyncio.run(request_audio())
