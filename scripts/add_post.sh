#!/bin/bash

# STRICT MODE
set -euo pipefail

# This will be the blog post number: (total posts + 1)
postcount="$(jq '. | length' posts.json)"
entrynum="$((postcount + 1))"

# Capture formatted entry_num (1 -> 001, 10 -> 010)
entrynumf="$(printf "%03d" "$entrynum")"

# User input slug
echo Enter the slug
read slug

echo Enter post title
read posttitle

# Create the file
filename="$HOME/Projects/esciafardini_website/posts/${entrynumf}-${slug}.md"
touch "$filename"


today="$(date +%Y-%m-%d)"

jq "[{
      \"slug\": \"${slug}\",
      \"title\": \"${posttitle}\",
      \"date\": \"${today}\",
      \"tags\": [],
      \"file\": \"posts/${entrynumf}-${slug}.md\"
}] + ." posts.json > new.json

echo "Your posts directory, sir:"
ls posts

rm posts.json
mv new.json posts.json
