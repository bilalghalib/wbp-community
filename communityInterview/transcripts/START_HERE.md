# Quick Start Guide - Transcript Fetcher

Simple standalone tool to fetch YouTube transcripts without databases or authentication.

## How to Use

### Step 1: Start the Server

Open Terminal 1:
```bash
cd /Users/bilalghalib/Projects/scripts/wbp-community/communityInterview/transcripts
node simple-server.js
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║  Simple Transcript Server                               ║
║  http://localhost:3002                                   ║
╚══════════════════════════════════════════════════════════╝

Ready to fetch transcripts!
```

Leave this running!

### Step 2: Fetch All Transcripts

Open Terminal 2:
```bash
cd /Users/bilalghalib/Projects/scripts/wbp-community/communityInterview/transcripts
node fetch-all-transcripts.js
```

This will:
- Read all 18 video URLs from your list
- Fetch each transcript
- Save as both `.json` and `.txt` files in `output/`
- Show progress for each video

### Output

After completion, check the `output/` folder:
```
output/
├── 3lfgsjTF0kE.json          # JSON with full data
├── 3lfgsjTF0kE.txt           # Human-readable transcript
├── Rx-h3_eKhbQ.json
├── Rx-h3_eKhbQ.txt
├── ...
└── _summary.json             # Overall summary
```

## Test with One Video

Before fetching all, test with a single video:

```bash
curl -X POST http://localhost:3002/transcript \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=3lfgsjTF0kE"}'
```

## Troubleshooting

**"Server not running" error?**
- Make sure Terminal 1 with `simple-server.js` is still running

**No transcripts found?**
- These videos might not have captions
- Or we're still rate-limited (wait 2-4 hours)

**Port 3002 in use?**
- Edit `simple-server.js` and change `PORT = 3002` to another number
- Also update `API_URL` in `fetch-all-transcripts.js`

## Why This Works

- Uses same `youtube-transcript` library as your working transcript-explorer
- No Supabase/database needed
- No authentication needed
- Simple HTTP API
- Different method than yt-dlp (may bypass rate limits)

## What You Get

Each transcript includes:
- Video ID and URL
- Timestamp for each line
- Full text content
- Both JSON (for processing) and TXT (for reading)

## Next Steps

After fetching:
1. Check `output/` folder for all transcripts
2. Open any `.txt` file to read transcripts
3. Use `.json` files if you need to process them programmatically
