#!/bin/sh

# Build package
npm run pkg:build

# Build app
npm run build

# Building production image
docker build -f docker/Dockerfile -t ghcr.io/alexxnb/doconv:latest .