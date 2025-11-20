#!/usr/bin/env python3
"""
Download YouTube transcripts from a list of video URLs.
Requires: pip install youtube-transcript-api
"""

import re
import os
from pathlib import Path
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


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


def download_transcript(video_id, output_dir):
    """Download transcript for a single video."""
    try:
        # Get transcript (tries to get English first, then any available)
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try to find English transcript first
        try:
            transcript = transcript_list.find_transcript(['en'])
        except:
            # If no English, get the first available
            transcript = transcript_list.find_generated_transcript(['en'])

        # Fetch the actual transcript
        transcript_data = transcript.fetch()

        # Format transcript as readable text
        full_text = "\n".join([entry['text'] for entry in transcript_data])

        # Save to file
        output_file = output_dir / f"{video_id}.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Video ID: {video_id}\n")
            f.write(f"URL: https://www.youtube.com/watch?v={video_id}\n")
            f.write("-" * 80 + "\n\n")
            f.write(full_text)

        print(f"✓ Downloaded: {video_id}")
        return True

    except TranscriptsDisabled:
        print(f"✗ Transcripts disabled: {video_id}")
        return False
    except NoTranscriptFound:
        print(f"✗ No transcript found: {video_id}")
        return False
    except Exception as e:
        print(f"✗ Error for {video_id}: {str(e)}")
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
        print(f"[{i}/{len(video_ids)}] Processing {video_id}...", end=" ")
        if download_transcript(video_id, output_dir):
            success_count += 1

    # Summary
    print(f"\n{'='*80}")
    print(f"Complete! Successfully downloaded {success_count}/{len(video_ids)} transcripts")
    print(f"Transcripts saved to: {output_dir}")


if __name__ == "__main__":
    main()
