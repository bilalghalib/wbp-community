#!/usr/bin/env python3
"""
Download YouTube transcripts using yt-dlp with rate limit handling.
Requires: pip install yt-dlp
"""

import re
import json
import time
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


def download_transcript_ytdlp(video_id, output_dir, retry_count=3, delay=5):
    """Download transcript using yt-dlp with retry logic."""
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    output_file = output_dir / f"{video_id}_transcript.txt"

    # Skip if already downloaded
    if output_file.exists():
        print(f"⏭  Already downloaded: {video_id}")
        return True

    for attempt in range(retry_count):
        try:
            # Download subtitles with timeout and ignore errors
            subtitle_cmd = [
                'yt-dlp',
                '--skip-download',
                '--write-auto-subs',
                '--sub-lang', 'en',
                '--sub-format', 'srt',
                '--output', str(output_dir / f"{video_id}"),
                '--no-warnings',
                '--ignore-errors',
                video_url
            ]

            result = subprocess.run(
                subtitle_cmd,
                capture_output=True,
                text=True,
                timeout=30
            )

            # Wait to avoid rate limiting
            time.sleep(delay)

            # Check if we got subtitle files
            subtitle_files = list(output_dir.glob(f"{video_id}*.srt"))

            if subtitle_files:
                # Read and format the subtitle file
                sub_file = subtitle_files[0]

                with open(sub_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Parse SRT and extract just the text
                lines = content.split('\n')
                text_lines = []

                for line in lines:
                    # Skip timestamp lines, numbers, and empty lines
                    if '-->' not in line and line.strip() and not line.strip().isdigit():
                        text_lines.append(line.strip())

                full_text = '\n'.join(text_lines)

                # Try to load metadata
                metadata_file = output_dir / f"{video_id}.info.json"
                title = "Unknown"
                uploader = "Unknown"
                description = ""

                if metadata_file.exists():
                    try:
                        with open(metadata_file, 'r', encoding='utf-8') as f:
                            metadata = json.load(f)
                            title = metadata.get('title', 'Unknown')
                            uploader = metadata.get('uploader', 'Unknown')
                            description = metadata.get('description', '')[:500]  # First 500 chars
                    except:
                        pass

                # Save cleaned transcript
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(f"Video ID: {video_id}\n")
                    f.write(f"URL: {video_url}\n")
                    f.write(f"Title: {title}\n")
                    f.write(f"Uploader: {uploader}\n")
                    if description:
                        f.write(f"\nDescription: {description}\n")
                    f.write("=" * 80 + "\n\n")
                    f.write("TRANSCRIPT:\n\n")
                    f.write(full_text)

                print(f"✓ Downloaded: {video_id}")
                print(f"  Title: {title[:60]}")

                # Clean up subtitle and metadata files
                sub_file.unlink()
                if metadata_file.exists():
                    metadata_file.unlink()

                return True
            else:
                # Check if we hit rate limiting
                if '429' in result.stderr or 'Too Many Requests' in result.stderr:
                    if attempt < retry_count - 1:
                        wait_time = delay * (2 ** attempt)  # Exponential backoff
                        print(f"  ⚠ Rate limited, waiting {wait_time}s before retry...")
                        time.sleep(wait_time)
                        continue
                    else:
                        print(f"✗ Rate limited (max retries): {video_id}")
                        return False
                else:
                    print(f"✗ No subtitles available: {video_id}")
                    return False

        except subprocess.TimeoutExpired:
            print(f"✗ Timeout: {video_id}")
            return False
        except Exception as e:
            if attempt < retry_count - 1:
                print(f"  ⚠ Error (retrying): {str(e)[:50]}")
                time.sleep(delay)
                continue
            else:
                print(f"✗ Error: {video_id} - {str(e)[:50]}")
                return False

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
    print(f"Output directory: {output_dir}")
    print(f"Using 5 second delay between downloads to avoid rate limiting\n")
    print("="*80)

    # Download transcripts
    success_count = 0
    start_time = time.time()

    for i, video_id in enumerate(video_ids, 1):
        print(f"\n[{i}/{len(video_ids)}] Processing {video_id}...")
        if download_transcript_ytdlp(video_id, output_dir):
            success_count += 1

        # Progress update
        if i % 5 == 0:
            elapsed = time.time() - start_time
            rate = i / elapsed
            remaining = (len(video_ids) - i) / rate if rate > 0 else 0
            print(f"\nProgress: {i}/{len(video_ids)} ({success_count} successful) - ETA: {remaining/60:.1f} min")

    # Summary
    elapsed = time.time() - start_time
    print(f"\n{'='*80}")
    print(f"Complete! Successfully downloaded {success_count}/{len(video_ids)} transcripts")
    print(f"Time taken: {elapsed/60:.1f} minutes")
    print(f"Transcripts saved to: {output_dir}")


if __name__ == "__main__":
    main()
