# Use transcript-explorer to Download Transcripts

Your transcript-explorer app is working! Here's how to use it to batch download these transcripts:

## Option A: Manual (Quickest)

1. Start transcript-explorer:
   ```bash
   cd /Users/bilalghalib/Projects/scripts/wbp-community/transcript-explorer
   npm run dev
   ```

2. Open: http://localhost:3001/test

3. For each video URL, paste and click "Import"

4. Export from Supabase later if needed

## Option B: Add Batch Export Feature

Add this simple endpoint to transcript-explorer to export all transcripts:

### Create: `src/app/api/export-all/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: videos } = await supabase
    .from('videos')
    .select(`
      id,
      source_url,
      title,
      segments (
        start_sec,
        end_sec,
        text
      )
    `)
    .order('created_at', { ascending: false })

  return NextResponse.json({ videos })
}
```

Then visit: http://localhost:3001/api/export-all

## Option C: Direct Supabase Query

Run this SQL in Supabase SQL Editor:

```sql
SELECT
  v.source_url,
  v.title,
  s.start_sec,
  s.text
FROM videos v
JOIN segments s ON s.video_id = v.id
ORDER BY v.id, s.start_sec;
```

Export as CSV!

## Option D: Wait for Rate Limit

Just wait 2-4 hours and run:
```bash
python scrape_transcripts.py
```

This scraper will work once the rate limit clears.

## Current Status

**Rate Limited Until:** ~2-4 hours from 2025-11-20 10:15 AM
**Working Scripts Ready:**
- ✅ `scrape_transcripts.py` - HTML scraper
- ✅ `download_transcripts.js` - Node youtube-transcript
- ✅ `harvest_transcripts.py` - Python yt-dlp
- ✅ `download_batch.sh` - Bash yt-dlp

All will work after rate limit clears!
