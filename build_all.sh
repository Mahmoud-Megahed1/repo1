#!/bin/bash
set -e

echo "Building Backend..."
cd backend
npm install
npm run build
cd ..

echo "Building Admin Panel..."
cd frontend/admin-englishom
npm install --legacy-peer-deps
npm run build
cd ../..

echo "Building User App..."
cd frontend/english-home-vite
npm install
npm run build
cd ../..

echo "All builds completed successfully!"
