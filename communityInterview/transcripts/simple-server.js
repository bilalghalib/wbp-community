#!/usr/bin/env node
/**
 * Simple transcript server - no database, no auth
 * Uses youtube-transcript (same as transcript-explorer)
 */

const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

function extractVideoId(urlOrId) {
  const m = urlOrId.match(/(?:v=|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  return urlOrId;
}

app.post('/transcript', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing URL' });
    }

    const videoId = extractVideoId(url);
    console.log(`Fetching transcript for: ${videoId}`);

    // Try multiple fallbacks (same as transcript-explorer)
    let items = [];
    const tries = [
      async () => YoutubeTranscript.fetchTranscript(videoId),
      async () => YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }),
      async () => YoutubeTranscript.fetchTranscript(videoId, { lang: 'en-US' }),
    ];

    for (const t of tries) {
      try {
        items = await t();
        if (items?.length) break;
      } catch (err) {
        // Try next fallback
      }
    }

    if (!items?.length) {
      return res.status(404).json({
        error: 'No transcript available',
        videoId
      });
    }

    console.log(`✓ Found ${items.length} segments for ${videoId}`);

    res.json({
      videoId,
      url,
      segments: items.length,
      transcript: items
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transcript-server' });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Simple Transcript Server                               ║
║  http://localhost:${PORT}                                    ║
╚══════════════════════════════════════════════════════════╝

Ready to fetch transcripts!

Test with:
  curl -X POST http://localhost:${PORT}/transcript \\
    -H "Content-Type: application/json" \\
    -d '{"url":"https://www.youtube.com/watch?v=VIDEO_ID"}'
  `);
});
