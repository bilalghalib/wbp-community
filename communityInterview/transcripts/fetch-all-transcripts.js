#!/usr/bin/env node
/**
 * Batch fetch all transcripts from the video list
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3002/transcript';
const INPUT_FILE = path.join(__dirname, '..', 'The Wellbeing Youtube Video - Voices of Wellbeing.txt');
const OUTPUT_DIR = path.join(__dirname, 'output');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractVideoId(url) {
  const patterns = [
    /(?:v=|\/)([0-9A-Za-z_-]{11}).*/,
    /(?:embed\/)([0-9A-Za-z_-]{11})/,
    /^([0-9A-Za-z_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function fetchTranscript(url) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Unknown error' };
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

function saveTranscript(videoId, url, transcript) {
  // Save as JSON
  const jsonFile = path.join(OUTPUT_DIR, `${videoId}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify({
    videoId,
    url,
    fetched: new Date().toISOString(),
    segments: transcript.length,
    transcript
  }, null, 2));

  // Save as readable text
  const txtFile = path.join(OUTPUT_DIR, `${videoId}.txt`);
  const lines = [
    `Video ID: ${videoId}`,
    `URL: ${url}`,
    `Fetched: ${new Date().toISOString()}`,
    `Segments: ${transcript.length}`,
    '='.repeat(80),
    '',
    'TRANSCRIPT:',
    ''
  ];

  transcript.forEach(item => {
    const timestamp = formatTime(item.offset || 0);
    lines.push(`[${timestamp}] ${item.text}`);
  });

  fs.writeFileSync(txtFile, lines.join('\n'));

  return { jsonFile, txtFile };
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Batch Transcript Fetcher                               ║
╚══════════════════════════════════════════════════════════╝

Input: ${path.basename(INPUT_FILE)}
Output: ${OUTPUT_DIR}/
API: ${API_URL}
  `);

  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3002/health');
    if (!healthCheck.ok) throw new Error('Server not responding');
    console.log('✓ Server is running\n');
  } catch (error) {
    console.error('✗ Server not running!');
    console.error('\nPlease start the server first:');
    console.error('  node simple-server.js\n');
    process.exit(1);
  }

  // Read video URLs
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(INPUT_FILE, 'utf-8');
  const lines = content.split('\n');

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

  // Fetch transcripts
  let successCount = 0;
  const results = [];

  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const videoId = extractVideoId(url);

    console.log(`\n[${i + 1}/${uniqueUrls.length}] ${videoId}`);
    console.log(`  ${url}`);

    // Check if already downloaded
    const existingJson = path.join(OUTPUT_DIR, `${videoId}.json`);
    if (fs.existsSync(existingJson)) {
      console.log('  ⏭  Already downloaded');
      successCount++;
      results.push({ videoId, status: 'skipped' });
      continue;
    }

    console.log('  📥 Fetching...');
    const result = await fetchTranscript(url);

    if (result.success) {
      const { jsonFile, txtFile } = saveTranscript(
        videoId,
        url,
        result.data.transcript
      );
      console.log(`  ✅ Saved: ${result.data.segments} segments`);
      console.log(`     JSON: ${path.basename(jsonFile)}`);
      console.log(`     TXT:  ${path.basename(txtFile)}`);
      successCount++;
      results.push({ videoId, status: 'success', segments: result.data.segments });
    } else {
      console.log(`  ✗ Failed: ${result.error}`);
      results.push({ videoId, status: 'failed', error: result.error });
    }

    // Small delay to be nice
    if (i < uniqueUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Complete! Downloaded ${successCount}/${uniqueUrls.length} transcripts`);
  console.log(`Output directory: ${OUTPUT_DIR}/`);

  // Save summary
  const summaryFile = path.join(OUTPUT_DIR, '_summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify({
    fetched: new Date().toISOString(),
    total: uniqueUrls.length,
    successful: successCount,
    results
  }, null, 2));

  console.log(`\nSummary saved to: ${path.basename(summaryFile)}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
