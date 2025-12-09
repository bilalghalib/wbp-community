#!/usr/bin/env python3
"""
Scrape YouTube transcripts directly from the HTML
Since the official APIs aren't working, we'll scrape the page
"""

import re
import json
import time
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# Check dependencies
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing dependencies...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4"])
    import requests
    from bs4 import BeautifulSoup

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

def get_transcript_from_html(video_id):
    """
    Scrape transcript data from YouTube page HTML
    YouTube embeds transcript data in the page source
    """
    url = f"https://www.youtube.com/watch?v={video_id}"

    try:
        # Fetch the page
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        # Look for transcript data in the page source
        # YouTube includes it in JSON within script tags
        html = response.text

        # Find the ytInitialPlayerResponse object
        match = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});', html)
        if not match:
            return None

        player_response = json.loads(match.group(1))

        # Try to find captions
        captions = player_response.get('captions', {})
        caption_tracks = captions.get('playerCaptionsTracklistRenderer', {}).get('captionTracks', [])

        if not caption_tracks:
            return None

        # Get the first English caption track
        caption_url = None
        for track in caption_tracks:
            if track.get('languageCode', '').startswith('en'):
                caption_url = track.get('baseUrl')
                break

        if not caption_url:
            caption_url = caption_tracks[0].get('baseUrl')

        if not caption_url:
            return None

        # Fetch the actual transcript
        transcript_response = requests.get(caption_url, headers=headers, timeout=10)
        transcript_response.raise_for_status()

        # Parse the XML transcript
        soup = BeautifulSoup(transcript_response.text, 'html.parser')
        texts = soup.find_all('text')

        transcript = []
        for text in texts:
            start = float(text.get('start', 0))
            content = text.get_text()
            transcript.append({
                'start': start,
                'text': content
            })

        return transcript

    except Exception as e:
        print(f"    Error: {str(e)[:50]}")
        return None

def format_time(seconds):
    """Format seconds to MM:SS"""
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}:{secs:02d}"

def save_transcript(video_id, url, transcript, output_dir):
    """Save transcript to file"""
    output_file = output_dir / f"{video_id}_transcript.txt"

    lines = [
        f"Video ID: {video_id}",
        f"URL: {url}",
        f"Fetched: {time.strftime('%Y-%m-%d %H:%M:%S')}",
        f"Segments: {len(transcript)}",
        "=" * 80,
        "",
        "TRANSCRIPT:",
        ""
    ]

    for item in transcript:
        timestamp = format_time(item['start'])
        lines.append(f"[{timestamp}] {item['text']}")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    return output_file

def main():
    script_dir = Path(__file__).parent
    input_file = script_dir.parent / "The Wellbeing Youtube Video - Voices of Wellbeing.txt"
    output_dir = script_dir

    if not input_file.exists():
        print(f"Input file not found: {input_file}")
        return

    print(f"""
╔══════════════════════════════════════════════════════════╗
║  WBP Transcript Scraper (HTML Method)                   ║
║  Scrapes transcripts directly from YouTube pages        ║
╚══════════════════════════════════════════════════════════╝

Input: {input_file.name}
Output: {output_dir}/
""")

    # Read URLs
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    urls = []
    for line in lines:
        match = re.search(r'https?://[^\s]+', line)
        if match:
            urls.append(match.group(0))

    # Remove duplicates
    urls = list(dict.fromkeys(urls))

    print(f"Found {len(urls)} unique videos\n")
    print("=" * 60)

    success_count = 0
    for i, url in enumerate(urls, 1):
        video_id = extract_video_id(url)

        print(f"\n[{i}/{len(urls)}] {video_id}")
        print(f"  {url}")

        # Check if already exists
        output_file = output_dir / f"{video_id}_transcript.txt"
        if output_file.exists():
            print(f"  ⏭  Already downloaded")
            success_count += 1
            continue

        # Fetch transcript
        print(f"  📥 Fetching transcript...")
        transcript = get_transcript_from_html(video_id)

        if transcript and len(transcript) > 0:
            saved_file = save_transcript(video_id, url, transcript, output_dir)
            print(f"  ✅ Saved: {len(transcript)} segments → {saved_file.name}")
            success_count += 1
        else:
            print(f"  ✗ No transcript found")

        # Be nice - small delay
        if i < len(urls):
            time.sleep(2)

    print(f"\n{'=' * 60}")
    print(f"Complete! Downloaded {success_count}/{len(urls)} transcripts")
    print(f"Transcripts saved to: {output_dir}/")

if __name__ == "__main__":
    main()
