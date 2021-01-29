#!/bin/sh

# Build app before creting images
npm run build

# Building production image
docker build -f docker/Dockerfile -t doconvert:latest .