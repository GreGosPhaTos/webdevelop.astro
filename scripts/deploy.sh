#!/bin/bash

# --- CONFIGURATION ---
PROJECT_ID="webdevelop-v2"
BUCKET_NAME="gs://webdevelop.fr"
DIST_DIR="./dist"

# Terminal Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment for $BUCKET_NAME...${NC}"

# 1. Ensure we are using the correct GCP Project
echo -e "${BLUE}🎯 Switching to project: $PROJECT_ID...${NC}"
gcloud config set project $PROJECT_ID --quiet

# Double check if the switch was successful
CURRENT_PROJECT=$(gcloud config get-value project)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Failed to switch to the correct project. Aborting.${NC}"
    exit 1
fi

# 2. Build the Astro project
echo -e "${BLUE}🔄 Cleaning dist directory...${NC}"
npm run clean

echo -e "${BLUE}📦 Building Astro project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Deployment cancelled.${NC}"
    exit 1
fi

# 3. Sync files to GCS
# --delete-unmatched-destination ensures old files are removed from the bucket
echo -e "${BLUE}🔄 Syncing files to bucket...${NC}"
gcloud storage rsync "$DIST_DIR" "$BUCKET_NAME" --recursive --delete-unmatched-destination-objects

# 4. Set Cache-Control for HTML files (Freshness is key)
echo -e "${BLUE}🔒 Setting Cache-Control: HTML (no-cache)...${NC}"
gcloud storage objects update "$BUCKET_NAME/**/*.html" --cache-control="no-cache, no-store, max-age=0, must-revalidate"

# 5. Set Cache-Control for Assets (Performance/Hashed files)
echo -e "${BLUE}💎 Setting Cache-Control: Assets (immutable)...${NC}"
gcloud storage objects update "$BUCKET_NAME/_astro/*" --cache-control="public, max-age=31536000, immutable"

echo -e "${GREEN}✅ Deployment successful!"