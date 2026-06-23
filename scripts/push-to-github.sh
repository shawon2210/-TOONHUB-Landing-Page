#!/bin/bash
# push-to-github.sh — Trigger n8n workflow to create GitHub repo and push code
# Usage: ./push-to-github.sh <project-name> <description> [project-path]

PROJECT_NAME="${1:?Usage: $0 <project-name> <description> [project-path]}"
DESCRIPTION="${2:-Auto-created project}"
PROJECT_PATH="${3:-/mnt/d/allfiles/Project}"
N8N_WEBHOOK_URL="${N8N_WEBHOOK_URL:-http://localhost:5678/webhook/create-repo}"

echo "Triggering n8n workflow to create repo: ${PROJECT_NAME}"
echo "Description: ${DESCRIPTION}"
echo "Path: ${PROJECT_PATH}/${PROJECT_NAME}"
echo ""

RESPONSE=$(curl -s -X POST "${N8N_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d "{
    \"projectName\": \"${PROJECT_NAME}\",
    \"description\": \"${DESCRIPTION}\",
    \"projectPath\": \"${PROJECT_PATH}\",
    \"isPrivate\": false,
    \"pushCode\": true
  }")

echo "Response: ${RESPONSE}"
