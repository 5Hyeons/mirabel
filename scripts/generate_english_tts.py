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

# 영어 대본 목록
SCRIPTS = [
    {
        "filename": "home_intro.en.wav",
        "prompt": """Please read the following text naturally:

Hello. I'm an AI doctor here to guide you through your sedated endoscopy.

This education can only be received by the patient. A guardian cannot take the education on your behalf.

Please confirm your appointment information below.

Your attending physician will be Dr. Lee."""
    },
    {
        "filename": "exam_explanation.en.wav",
        "prompt": """Please read the following text naturally:

According to medical regulations, we are obtaining consent for the examination.

A colonoscopy is a procedure where an endoscope is inserted through the anus to examine the rectum, sigmoid colon, colon, cecum, and terminal ileum.

You may experience discomfort during or after the procedure due to continuous air injection.

Colon polyps are growths that protrude into the colon, present in 15 to 20 percent of adults.

While not life-threatening, they can develop into cancer if left untreated.

If abnormalities are found, a biopsy or polypectomy may be performed, which may incur additional costs.

Please select Yes or No below if you consent."""
    },
    {
        "filename": "health_check_intro.en.wav",
        "prompt": """Please read the following text naturally:

We will now conduct a pre-examination questionnaire for your safety.

Please check any items that apply to you.

For safe sedated endoscopy, medical staff will verify your responses at the hospital.

Please note that you are responsible for any risks during examination if you do not disclose your medical conditions.

Please inform medical staff of your medical history.

If you're unsure about anything, please check "Request Consultation." Our medical professionals will assist you."""
    },
    {
        "filename": "warning_notice.en.wav",
        "prompt": """Please read the following text naturally:

Based on your questionnaire responses, you require professional medical consultation.

Due to potential risks with sedation, please note that sedated endoscopy may not be possible depending on the consultation results.

Please press the confirm button if you understand."""
    },
    {
        "filename": "recording_danger.en.wav",
        "prompt": """Please read the following text naturally:

If you agree to the examination after receiving all explanations about the purpose, method, and precautions, please press the record button and read the text aloud.

This recording will be kept for one year and may be used as legal documentation.

As a high-risk patient, you need to consult with medical staff upon your visit.

Please inform them of your health conditions."""
    },
    {
        "filename": "recording_normal.en.wav",
        "prompt": """Please read the following text naturally:

If you agree to the examination after receiving all explanations, please press the record button and read the text aloud.

This recording will be kept for one year and may be used as legal documentation.

You have no reported medical conditions. Please note that you are responsible for any medical incidents if you do not disclose health issues.

Please confirm again and proceed with voice recording."""
    },
    {
        "filename": "complete_outro.en.wav",
        "prompt": """Please read the following text naturally:

This concludes the sedated endoscopy explanation and consent process.

If you have any questions about the examination, please consult with the AI Consultant on the bottom left.

If you need additional explanations, we will relay your request to the medical staff at the hospital.

Thank you for your patience. Have a great day!"""
    }
]

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')

@contextlib.contextmanager
def wave_file(filename, channels=1, rate=24000, sample_width=2):
    'set up .wav file writer'
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        yield wf

async def generate_audio(prompt, filename):
    'generate audio file for a single prompt'
    output_path = os.path.join(OUTPUT_DIR, filename)
    print(f'\n** Generating: {filename}')

    async with GENAI.aio.live.connect(model=MODEL, config=CONFIG) as session:
        with wave_file(output_path) as f:
            content = types.Content(
                role="user",
                parts=[types.Part(text=prompt)]
            )
            await session.send_client_content(turns=[content], turn_complete=True)
            async for response in session.receive():
                if response.data:
                    f.writeframes(response.data)

    print(f'** Saved: {output_path}')

async def main():
    print(f'** Using model: {MODEL}')
    print(f'** Voice: Puck')
    print(f'** Output directory: {OUTPUT_DIR}')
    print(f'** Total files to generate: {len(SCRIPTS)}')

    for i, script in enumerate(SCRIPTS, 1):
        print(f'\n[{i}/{len(SCRIPTS)}] Processing...')
        await generate_audio(script['prompt'], script['filename'])
        # Rate limiting - wait between requests
        if i < len(SCRIPTS):
            await asyncio.sleep(2)

    print('\n** All English TTS files generated successfully!')

if __name__ == '__main__':
    asyncio.run(main())
