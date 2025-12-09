#!/usr/bin/env node
/**
 * WBP Community Interview Transcript Downloader
 * Uses the same youtube-transcript library as transcript-explorer
 * Standalone version - no database, just saves to files
 */

const fs = require('fs');
const path = require('path');

// Check if youtube-transcript is installed
let YoutubeTranscript;
try {
  YoutubeTranscript = require('youtube-transcript').YoutubeTranscript;
} catch (e) {
  console.error('youtube-transcript not installed. Installing now...');
  require('child_process').execSync('npm install youtube-transcript', { stdio: 'inherit' });
  YoutubeTranscript = require('youtube-transcript').YoutubeTranscript;
}

function extractVideoId(urlOrId) {
  // Same logic as transcript-explorer
  const m = urlOrId.match(/(?:v=|youtu\.be\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
  return urlOrId;
}

async function downloadTranscript(url, outputDir) {
  const videoId = extractVideoId(url);
  const outputFile = path.join(outputDir, `${videoId}_transcript.txt`);

  // Check if already downloaded
  if (fs.existsSync(outputFile)) {
    console.log(`  ⏭  Already downloaded`);
    return true;
  }

  // Try a few sensible fallbacks (same as transcript-explorer)
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
    console.log(`  ✗ No transcript available`);
    return false;
  }

  // Format transcript
  const lines = [
    `Video ID: ${videoId}`,
    `URL: ${url}`,
    `Fetched: ${new Date().toISOString()}`,
    `Segments: ${items.length}`,
    '='.repeat(80),
    '',
    'TRANSCRIPT:',
    ''
  ];

  // Add timestamped text
  for (const item of items) {
    const start = item.offset || 0;
    const minutes = Math.floor(start / 60);
    const seconds = Math.floor(start % 60);
    const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    lines.push(`[${timestamp}] ${item.text}`);
  }

  // Save to file
  fs.writeFileSync(outputFile, lines.join('\n'), 'utf-8');
  console.log(`  ✅ Saved: ${items.length} segments`);
  return true;
}

async function main() {
  const inputFile = path.join(__dirname, '..', 'The Wellbeing Youtube Video - Voices of Wellbeing.txt');
  const outputDir = __dirname;

  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  WBP Community Interview Transcript Downloader          ║
║  Using youtube-transcript (from transcript-explorer)    ║
╚══════════════════════════════════════════════════════════╝

Input: ${path.basename(inputFile)}
Output: ${outputDir}/
  `);

  // Read URLs
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split('\n');

  // Extract URLs
  const urls = [];
  for (const line of lines) {
    const match = line.match(/https?:\/\/[^\s]+/);
    if (match) {
      urls.push(match[0]);
    }
  }

  // Remove duplicates
  const uniqueUrls = [...new Set(urls)];

  console.log(`Found ${uniqueUrls.length} unique videos\n`);
  console.log('='.repeat(60));

  // Download transcripts
  let successCount = 0;
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const videoId = extractVideoId(url);

    console.log(`\n[${i + 1}/${uniqueUrls.length}] ${videoId}`);
    console.log(`  ${url}`);

    try {
      if (await downloadTranscript(url, outputDir)) {
        successCount++;
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }

    // Small delay to be nice
    if (i < uniqueUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Complete! Downloaded ${successCount}/${uniqueUrls.length} transcripts`);
  console.log(`Transcripts saved to: ${outputDir}/`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
