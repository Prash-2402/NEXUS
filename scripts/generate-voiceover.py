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
RATE = "-8%"
PITCH = "-4Hz"

LINES = [
    "Last year, we built something.",
    "A stage. A crowd. A feeling.",
    "You remember the nights.",
    "The noise. The wins.",
    "It never really ended.",
    "Nexus... is back.",
    "Hosted at Christ, Deemed to be University.",
    "The Department of A.I. and Data Science Engineering.",
    # (text, rate) to speed up a line that must fit a short card
    ("Christ-ites Association of A.I. and Data Science, presents.", "+4%"),
    "World one. Technical. Build, break, and decode.",
    "World two. Non-technical. Think fast, play smart.",
    "World three. Cultural. Take the stage.",
    "Different worlds.",
    "One universe.",
    "Fifteen days. Starting twenty-first November.",
    "Nexus twenty twenty-six. Where worlds converge.",
]

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "launch" / "vo"


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for i, line in enumerate(LINES):
        text, rate = line if isinstance(line, tuple) else (line, RATE)
        path = OUT / f"{i:02d}.mp3"
        # The service drops requests now and then, so retry a few times.
        for attempt in range(6):
            try:
                await edge_tts.Communicate(text, VOICE, rate=rate, pitch=PITCH).save(str(path))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if attempt == 5:
                    raise
                await asyncio.sleep(2 + attempt * 2)
        print(path.name, text)


asyncio.run(main())
