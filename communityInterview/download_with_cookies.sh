#!/bin/bash
# Download transcripts using browser cookies (bypasses rate limits)
# Usage: ./download_with_cookies.sh [chrome|firefox|safari]

BROWSER=${1:-chrome}  # Default to chrome
INPUT_FILE="The Wellbeing Youtube Video - Voices of Wellbeing.txt"
OUTPUT_DIR="transcripts"

mkdir -p "$OUTPUT_DIR"

echo "Using cookies from: $BROWSER"
echo "Output directory: $OUTPUT_DIR"
echo "====================================="
echo

count=0
success=0

while IFS= read -r line; do
    url=$(echo "$line" | grep -o 'https://[^ ]*')

    if [ -n "$url" ]; then
        count=$((count + 1))
        video_id=$(echo "$url" | sed -n 's/.*[?&]v=\([^&]*\).*/\1/p')

        if [ -z "$video_id" ]; then
            video_id=$(echo "$url" | sed -n 's|.*/\([^?]*\).*|\1|p')
        fi

        echo "[$count] Processing: $video_id"

        if [ -f "$OUTPUT_DIR/${video_id}_transcript.txt" ]; then
            echo "    ⏭  Already downloaded"
            success=$((success + 1))
        else
            # Download with browser cookies
            yt-dlp \
                --skip-download \
                --write-auto-subs \
                --sub-lang en \
                --sub-format srt \
                --output "$OUTPUT_DIR/${video_id}" \
                --cookies-from-browser "$BROWSER" \
                --no-warnings \
                --quiet \
                "$url" 2>&1

            if [ -f "$OUTPUT_DIR/${video_id}.en.srt" ]; then
                grep -v '^[0-9]*$' "$OUTPUT_DIR/${video_id}.en.srt" | \
                grep -v -- '-->' | \
                grep -v '^$' > "$OUTPUT_DIR/${video_id}_transcript.txt"

                sed -i '' "1i\\
Video ID: $video_id\\
URL: $url\\
================================================================================\\
\\
" "$OUTPUT_DIR/${video_id}_transcript.txt"

                rm "$OUTPUT_DIR/${video_id}.en.srt"
                echo "    ✓ Success!"
                success=$((success + 1))
            else
                echo "    ✗ Failed"
            fi

            sleep 2  # Shorter delay with cookies
        fi
        echo
    fi
done < "$INPUT_FILE"

echo "====================================="
echo "Complete! Downloaded $success/$count transcripts"
