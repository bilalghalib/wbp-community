# WBP Community Interview Transcript Tools

Tools to download transcripts from YouTube videos.

## The Problem

Currently getting **HTTP 429: Too Many Requests** from YouTube due to earlier download attempts.
**Solution**: Wait 1-2 hours, then try again.

## Available Tools

### 1. Python Harvester (Recommended)
Adapted from your working `transcript-explorer` code.

```bash
python harvest_transcripts.py
```

**Features:**
- Uses yt-dlp Python API
- Clean logging
- Auto-detects already downloaded files
- Based on your proven `harvest_youtube_videos.py`

### 2. Bash Script
Simple bash wrapper around yt-dlp.

```bash
./download_batch.sh
```

### 3. Original Python Scripts
Other attempts in the parent directory:
- `download_transcripts.py` - youtube-transcript-api
- `download_transcripts_ytdlp.py` - yt-dlp wrapper
- `download_transcripts_robust.py` - with retry logic
- `download_transcripts_whisper.py` - local Whisper transcription

## When to Run

**Wait 1-2 hours** from 2025-11-20 09:00 AM, then run:

```bash
python harvest_transcripts.py
```

## What It Does

1. Reads: `../The Wellbeing Youtube Video - Voices of Wellbeing.txt`
2. Extracts 18 unique YouTube URLs
3. Downloads English captions (auto-generated or manual)
4. Saves as `.srt` or `.vtt` files in this directory

## Output Files

For each video, you'll get files like:
- `3lfgsjTF0kE.en.srt` - SubRip format (timestamped text)
- `3lfgsjTF0kE.en.vtt` - WebVTT format (timestamped text)

## Troubleshooting

**Rate Limit Error (429)?**
Wait 1-2 hours and try again.

**No captions available?**
Some videos may not have transcripts. Check manually on YouTube.

**Missing dependencies?**
```bash
pip install yt-dlp
```

## Alternative: Whisper (No Rate Limits)

If still blocked, use local transcription:

```bash
pip install openai-whisper
python ../download_transcripts_whisper.py
```

This downloads audio and transcribes locally (slower but no rate limits).

## Source

Adapted from: `/Users/bilalghalib/Projects/scripts/wbp-community/transcript-explorer/`
- `harvest_youtube_videos.py`
- `download-captions.sh`
