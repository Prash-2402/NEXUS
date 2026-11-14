"""
Generate the launch film's voiceover clips into public/launch/vo/.

    pip install edge-tts
    python scripts/generate-voiceover.py

The lines must stay in the same order as VOICE_LINES in src/launch/timeline.ts:
clip N is played for line N. Text here is written the way it should be spoken.
"""

import asyncio
import pathlib

import edge_tts

VOICE = "en-US-AndrewNeural"
RATE = "-6%"
PITCH = "-4Hz"

LINES = [
    "Everything begins with a spark.",
    "It gathers others.",
    "Until worlds collide.",
    "Hosted at Christ University.",
    "The Department of A.I. and Data Science.",
    "Cads presents.",
    "World one. Technical. Build, break, and decode.",
    "World two. Non-technical. Think fast, play smart.",
    "World three. Cultural. Take the stage.",
    "Different worlds.",
    "One universe.",
    "Twenty-first of November, to the fifth of December, twenty twenty-six.",
    "Nexus. Where worlds converge.",
]

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "launch" / "vo"


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, text in enumerate(LINES):
        path = OUT / f"{i:02d}.mp3"
        # The service drops requests now and then, so retry a few times.
        for attempt in range(6):
            try:
                await edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(str(path))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if attempt == 5:
                    raise
                await asyncio.sleep(2 + attempt * 2)
        print(path.name, text)


asyncio.run(main())
