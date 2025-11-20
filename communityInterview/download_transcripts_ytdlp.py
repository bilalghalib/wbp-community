#!/usr/bin/env python3
"""
Download YouTube transcripts using yt-dlp (more robust).
Requires: pip install yt-dlp
"""

import re
import json
from pathlib import Path
import subprocess


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


def download_transcript_ytdlp(video_id, output_dir):
    """Download transcript using yt-dlp."""
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        # First, get video metadata
        metadata_cmd = [
            'yt-dlp',
            '--skip-download',
            '--write-info-json',
            '--output', str(output_dir / f"{video_id}"),
            video_url
        ]

        subprocess.run(metadata_cmd, check=True, capture_output=True)

        # Try to download subtitles/transcripts
        subtitle_cmd = [
            'yt-dlp',
            '--skip-download',
            '--write-auto-subs',  # Auto-generated subtitles (note the 's')
            '--sub-lang', 'en',
            '--sub-format', 'srt',
            '--output', str(output_dir / f"{video_id}"),
            video_url
        ]

        result = subprocess.run(subtitle_cmd, capture_output=True, text=True)

        # Check if we got any subtitle files
        subtitle_files = list(output_dir.glob(f"{video_id}*.srt"))
        vtt_files = list(output_dir.glob(f"{video_id}*.vtt"))

        if subtitle_files or vtt_files:
            # Read and format the subtitle file
            sub_file = subtitle_files[0] if subtitle_files else vtt_files[0]

            with open(sub_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Parse SRT/VTT and extract just the text
            lines = content.split('\n')
            text_lines = []

            for line in lines:
                # Skip timestamp lines and empty lines
                if '-->' not in line and line.strip() and not line.strip().isdigit():
                    # Skip VTT header
                    if not line.startswith('WEBVTT') and not line.startswith('Kind:'):
                        text_lines.append(line.strip())

            full_text = '\n'.join(text_lines)

            # Load metadata if available
            metadata_file = output_dir / f"{video_id}.info.json"
            title = "Unknown"
            uploader = "Unknown"

            if metadata_file.exists():
                with open(metadata_file, 'r', encoding='utf-8') as f:
                    metadata = json.load(f)
                    title = metadata.get('title', 'Unknown')
                    uploader = metadata.get('uploader', 'Unknown')

            # Save cleaned transcript
            output_file = output_dir / f"{video_id}_transcript.txt"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(f"Video ID: {video_id}\n")
                f.write(f"URL: {video_url}\n")
                f.write(f"Title: {title}\n")
                f.write(f"Uploader: {uploader}\n")
                f.write("=" * 80 + "\n\n")
                f.write(full_text)

            print(f"✓ Downloaded: {video_id} - {title[:50]}")

            # Clean up subtitle file
            sub_file.unlink()
            if metadata_file.exists():
                metadata_file.unlink()

            return True
        else:
            print(f"✗ No subtitles available: {video_id}")
            return False

    except subprocess.CalledProcessError as e:
        print(f"✗ Error for {video_id}: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error for {video_id}: {str(e)}")
        return False


def main():
    # Setup paths
    script_dir = Path(__file__).parent
    input_file = script_dir / "The Wellbeing Youtube Video - Voices of Wellbeing.txt"
    output_dir = script_dir / "transcripts"

    # Create output directory
    output_dir.mkdir(exist_ok=True)

    # Read video URLs
    print(f"Reading video list from: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Extract video IDs
    video_ids = []
    for line in lines:
        # Extract URL (skip the numbering)
        url_match = re.search(r'https?://[^\s]+', line)
        if url_match:
            url = url_match.group(0)
            video_id = extract_video_id(url)
            if video_id:
                video_ids.append(video_id)

    # Remove duplicates while preserving order
    video_ids = list(dict.fromkeys(video_ids))

    print(f"\nFound {len(video_ids)} unique videos")
    print(f"Output directory: {output_dir}\n")

    # Download transcripts
    success_count = 0
    for i, video_id in enumerate(video_ids, 1):
        print(f"[{i}/{len(video_ids)}] ", end="")
        if download_transcript_ytdlp(video_id, output_dir):
            success_count += 1

    # Summary
    print(f"\n{'='*80}")
    print(f"Complete! Successfully downloaded {success_count}/{len(video_ids)} transcripts")
    print(f"Transcripts saved to: {output_dir}")


if __name__ == "__main__":
    main()
