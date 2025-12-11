from google import genai
from google.genai import types
import wave
import os

def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm)

# API 키 설정
os.environ["GOOGLE_API_KEY"] = "AIzaSyBmyMAod0TljmIXTuiYP7-MvLMr7_ySwcE"

client = genai.Client()

text = """
홍길동님 안녕하세요.
수면내시경 안내를 도와드릴 AI의사입니다.

본 교육과 설명은 환자 본인만 들을 수 있습니다.
보호자가 대신 교육을 듣거나 진행할 수 없습니다.

아래 예약 정보를 확인해주세요.

이번 검진을 담당하실 의료진은 박기호 원장님이십니다.
"""

response = client.models.generate_content(
    model="gemini-2.5-flash-preview-tts",
    contents=text,
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name='Puck',
                )
            )
        ),
    )
)

data = response.candidates[0].content.parts[0].inline_data.data
output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'greeting.wav')
wave_file(output_path, data)
print(f"Audio file generated: {output_path}")
