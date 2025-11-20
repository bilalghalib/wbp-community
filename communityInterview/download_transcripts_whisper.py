#!/usr/bin/env python3
"""
Download and transcribe YouTube videos using Whisper (OpenAI).
This method has no rate limits!

Requires:
  pip install yt-dlp openai-whisper

First time will download ~2.9GB Whisper model.
"""

import re
import subprocess
from pathlib import Path
import whisper


def extract_video_id(url):
    """Extract video ID from YouTube URL."""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11})',
        r'^([0-9A-Za-z_-]{11})$'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def download_audio(video_id, output_dir):
    """Download audio from YouTube video."""
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    audio_file = output_dir / f"{video_id}.mp3"

    if audio_file.exists():
        return audio_file

    try:
        cmd = [
            'yt-dlp',
            '-x',  # Extract audio
            '--audio-format', 'mp3',
            '--audio-quality', '0',  # Best quality
            '--output', str(output_dir / f"{video_id}.%(ext)s"),
            '--no-warnings',
            video_url
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

        if audio_file.exists():
            return audio_file
        else:
            print(f"    ✗ Failed to download audio")
            return None

    except Exception as e:
        print(f"    ✗ Error downloading: {str(e)[:50]}")
        return None


def transcribe_audio(audio_file, model):
    """Transcribe audio using Whisper."""
    try:
        result = model.transcribe(str(audio_file), language='en')
        return result['text']
    except Exception as e:
        print(f"    ✗ Transcription error: {str(e)[:50]}")
        return None


def main():
    script_dir = Path(__file__).parent
    input_file = script_dir / "The Wellbeing Youtube Video - Voices of Wellbeing.txt"
    output_dir = script_dir / "transcripts"
    audio_dir = script_dir / "audio_temp"

    output_dir.mkdir(exist_ok=True)
    audio_dir.mkdir(exist_ok=True)

    print("Loading Whisper model (first time takes a while)...")
    print("This will download ~2.9GB model if not already downloaded")
    model = whisper.load_model("base")  # Options: tiny, base, small, medium, large
    print("✓ Model loaded!\n")

    # Read video URLs
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Extract video IDs
    video_ids = []
    for line in lines:
        url_match = re.search(r'https?://[^\s]+', line)
        if url_match:
            url = url_match.group(0)
            video_id = extract_video_id(url)
            if video_id:
                video_ids.append(video_id)

    video_ids = list(dict.fromkeys(video_ids))

    print(f"Found {len(video_ids)} unique videos\n")
    print("="*80)

    success_count = 0

    for i, video_id in enumerate(video_ids, 1):
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        output_file = output_dir / f"{video_id}_transcript.txt"

        print(f"\n[{i}/{len(video_ids)}] Processing: {video_id}")

        if output_file.exists():
            print("    ⏭  Already transcribed, skipping...")
            success_count += 1
            continue

        # Download audio
        print("    📥 Downloading audio...")
        audio_file = download_audio(video_id, audio_dir)

        if not audio_file:
            continue

        # Transcribe
        print("    🎙  Transcribing (this may take a minute)...")
        transcript = transcribe_audio(audio_file, model)

        if transcript:
            # Save transcript
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(f"Video ID: {video_id}\n")
                f.write(f"URL: {video_url}\n")
                f.write("="*80 + "\n\n")
                f.write("TRANSCRIPT (via Whisper):\n\n")
                f.write(transcript)

            print(f"    ✓ Success! Saved to: {output_file.name}")
            success_count += 1

            # Clean up audio file
            audio_file.unlink()
        else:
            print("    ✗ Transcription failed")

    print(f"\n{'='*80}")
    print(f"Complete! Transcribed {success_count}/{len(video_ids)} videos")
    print(f"Transcripts saved to: {output_dir}")


if __name__ == "__main__":
    main()
