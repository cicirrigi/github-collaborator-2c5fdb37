#!/bin/bash

# 🚀 Sentry Release Management Script pentru Vantage Lane
# Usage: ./scripts/sentry-release.sh [version]

VERSION=${1:-${VERCEL_GIT_COMMIT_SHA:-"1.0.0"}}
ORG="datatrack-iq"
PROJECT_FRONTEND="vantage-lane-frontendai"
PROJECT_BACKEND="vantage-lane-backend"

echo "🚀 Creating Sentry release: $VERSION"

# Create release for frontend
echo "📱 Creating frontend release..."
npx sentry-cli releases new "$VERSION" --org "$ORG" --project "$PROJECT_FRONTEND"

# Create release for backend  
echo "🚀 Creating backend release..."
npx sentry-cli releases new "$VERSION" --org "$ORG" --project "$PROJECT_BACKEND"

# Set commits (if in git repo)
if [ -d ".git" ]; then
  echo "📝 Linking commits to releases..."
  npx sentry-cli releases set-commits --auto "$VERSION" --org "$ORG" --project "$PROJECT_FRONTEND"
  npx sentry-cli releases set-commits --auto "$VERSION" --org "$ORG" --project "$PROJECT_BACKEND"
fi

# Finalize releases
echo "✅ Finalizing releases..."
npx sentry-cli releases finalize "$VERSION" --org "$ORG" --project "$PROJECT_FRONTEND"
npx sentry-cli releases finalize "$VERSION" --org "$ORG" --project "$PROJECT_BACKEND"

echo "🎉 Sentry releases created successfully!"
echo "Frontend: https://sentry.io/organizations/$ORG/projects/$PROJECT_FRONTEND/releases/$VERSION/"
echo "Backend: https://sentry.io/organizations/$ORG/projects/$PROJECT_BACKEND/releases/$VERSION/"
