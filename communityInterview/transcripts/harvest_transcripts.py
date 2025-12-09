#!/usr/bin/env python3
"""
WBP Community Interview Transcript Downloader
Adapted from transcript-explorer/harvest_youtube_videos.py
Downloads transcripts from a list of YouTube URLs
"""

import os
import sys
import re
import logging
from pathlib import Path
from datetime import datetime

# Check for yt-dlp
try:
    import yt_dlp
except ImportError:
    print("yt-dlp not installed. Installing now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "yt-dlp"])
    import yt_dlp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)
logger = logging.getLogger(__name__)

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
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

def download_transcript(video_url, output_dir):
    """Download transcript for a single video"""
    video_id = extract_video_id(video_url)
    if not video_id:
        logger.error(f"  ✗ Could not extract video ID from: {video_url}")
        return False

    output_path = output_dir / video_id
    srt_file = output_dir / f"{video_id}.en.srt"
    vtt_file = output_dir / f"{video_id}.en.vtt"

    # Check if already downloaded
    if srt_file.exists() or vtt_file.exists():
        logger.info(f"  ⏭  Already downloaded")
        return True

    ydl_opts = {
        'writeautomaticsub': True,  # Auto-generated subtitles
        'writesubtitles': True,      # Manual subtitles
        'subtitleslangs': ['en'],
        'skip_download': True,
        'outtmpl': str(output_path),
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        # Check if subtitle was downloaded
        if srt_file.exists() or vtt_file.exists():
            logger.info(f"  ✅ Downloaded: {srt_file.name if srt_file.exists() else vtt_file.name}")
            return True
        else:
            logger.info(f"  ✗ No captions available")
            return False

    except Exception as e:
        logger.error(f"  ✗ Error: {str(e)[:50]}")
        return False

def main():
    # Setup paths
    script_dir = Path(__file__).parent
    input_file = script_dir.parent / "The Wellbeing Youtube Video - Voices of Wellbeing.txt"
    output_dir = script_dir

    if not input_file.exists():
        logger.error(f"Input file not found: {input_file}")
        sys.exit(1)

    logger.info(f"""
╔══════════════════════════════════════════════════════════╗
║  WBP Community Interview Transcript Downloader          ║
╚══════════════════════════════════════════════════════════╝

Input: {input_file.name}
Output: {output_dir}/
    """)

    # Read URLs
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Extract URLs
    urls = []
    for line in lines:
        url_match = re.search(r'https?://[^\s]+', line)
        if url_match:
            urls.append(url_match.group(0))

    # Remove duplicates while preserving order
    urls = list(dict.fromkeys(urls))

    logger.info(f"Found {len(urls)} unique videos\n")
    logger.info("="*60)

    # Download transcripts
    success_count = 0
    for i, url in enumerate(urls, 1):
        video_id = extract_video_id(url)
        logger.info(f"\n[{i}/{len(urls)}] {video_id}")
        logger.info(f"  {url}")

        if download_transcript(url, output_dir):
            success_count += 1

    # Summary
    logger.info(f"\n{'='*60}")
    logger.info(f"Complete! Downloaded {success_count}/{len(urls)} transcripts")
    logger.info(f"Transcripts saved to: {output_dir}/")

if __name__ == "__main__":
    main()
