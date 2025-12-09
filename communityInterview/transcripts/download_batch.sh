#!/bin/bash
# Download captions from YouTube using yt-dlp (adapted from transcript-explorer)
# Processes list of URLs from text file

INPUT_FILE="../The Wellbeing Youtube Video - Voices of Wellbeing.txt"
OUTPUT_DIR="."

if [ ! -f "$INPUT_FILE" ]; then
  echo "❌ Input file not found: $INPUT_FILE"
  exit 1
fi

# Check if yt-dlp is installed
if ! command -v yt-dlp &> /dev/null; then
  echo "❌ yt-dlp not found"
  echo "Install with: brew install yt-dlp"
  exit 1
fi

echo "Processing videos from: $INPUT_FILE"
echo "Output directory: $OUTPUT_DIR"
echo ""

count=0
success=0

while IFS= read -r line; do
    # Extract URL from the line
    url=$(echo "$line" | grep -o 'https://[^ ]*')

    if [ -n "$url" ]; then
        count=$((count + 1))

        # Extract video ID for output naming
        video_id=$(echo "$url" | sed -n 's/.*[?&]v=\([^&]*\).*/\1/p')
        if [ -z "$video_id" ]; then
            video_id=$(echo "$url" | sed -n 's|.*/\([^?]*\).*|\1|p')
        fi

        echo "[$count] Processing: $video_id"
        echo "    URL: $url"

        # Check if already downloaded
        existing=$(ls -t ${OUTPUT_DIR}/${video_id}*.srt 2>/dev/null | head -n 1)
        if [ -f "$existing" ]; then
            echo "    ⏭  Already downloaded: $existing"
            success=$((success + 1))
        else
            # Download using the working flags from transcript-explorer
            yt-dlp \
                --write-auto-subs \
                --write-subs \
                --sub-langs "en.*" \
                --skip-download \
                --output "${OUTPUT_DIR}/${video_id}" \
                "$url"

            # Find the downloaded SRT file
            SRT_FILE=$(ls -t ${OUTPUT_DIR}/${video_id}*.srt 2>/dev/null | head -n 1)

            if [ -f "$SRT_FILE" ]; then
                echo "    ✅ Success: $SRT_FILE"
                success=$((success + 1))
            else
                echo "    ✗ No captions available"
            fi
        fi

        echo ""
    fi
done < "$INPUT_FILE"

echo "====================================="
echo "Complete! Downloaded $success/$count transcripts"
echo ""
