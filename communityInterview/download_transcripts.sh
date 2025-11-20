#!/bin/bash

# Simple bash script to download YouTube transcripts
# Requires: yt-dlp

INPUT_FILE="The Wellbeing Youtube Video - Voices of Wellbeing.txt"
OUTPUT_DIR="transcripts"

mkdir -p "$OUTPUT_DIR"

echo "Starting transcript downloads..."
echo "Output directory: $OUTPUT_DIR"
echo "Waiting 30 seconds for YouTube rate limit to clear..."
sleep 30
echo "====================================="
echo

count=0
success=0

# Read each line from the file
while IFS= read -r line; do
    # Extract URL from the line
    url=$(echo "$line" | grep -o 'https://[^ ]*')

    if [ -n "$url" ]; then
        count=$((count + 1))

        # Extract video ID
        video_id=$(echo "$url" | sed -n 's/.*[?&]v=\([^&]*\).*/\1/p')

        if [ -z "$video_id" ]; then
            video_id=$(echo "$url" | sed -n 's|.*/\([^?]*\).*|\1|p')
        fi

        echo "[$count] Processing: $video_id"
        echo "    URL: $url"

        # Check if already downloaded
        if [ -f "$OUTPUT_DIR/${video_id}_transcript.txt" ]; then
            echo "    ⏭  Already downloaded, skipping..."
            success=$((success + 1))
        else
            # Download subtitles
            yt-dlp \
                --skip-download \
                --write-auto-subs \
                --sub-lang en \
                --sub-format srt \
                --output "$OUTPUT_DIR/${video_id}" \
                --no-warnings \
                --quiet \
                --socket-timeout 10 \
                "$url" 2>&1

            # Check if subtitle file was created
            if [ -f "$OUTPUT_DIR/${video_id}.en.srt" ]; then
                # Convert SRT to plain text
                grep -v '^[0-9]*$' "$OUTPUT_DIR/${video_id}.en.srt" | \
                grep -v -- '-->' | \
                grep -v '^$' > "$OUTPUT_DIR/${video_id}_transcript.txt"

                # Add header
                sed -i '' "1i\\
Video ID: $video_id\\
URL: $url\\
================================================================================\\
\\
" "$OUTPUT_DIR/${video_id}_transcript.txt"

                # Clean up SRT file
                rm "$OUTPUT_DIR/${video_id}.en.srt"

                echo "    ✓ Success!"
                success=$((success + 1))
            else
                echo "    ✗ No subtitles available"
            fi

            # Wait to avoid rate limiting (longer delay)
            echo "    ⏸  Waiting 10s to avoid rate limits..."
            sleep 10
        fi

        echo
    fi
done < "$INPUT_FILE"

echo "====================================="
echo "Complete! Downloaded $success/$count transcripts"
echo "Transcripts saved to: $OUTPUT_DIR/"
