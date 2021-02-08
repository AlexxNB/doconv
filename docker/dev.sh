#!/bin/sh

#Remove running container if exists
docker rm --force Doconv || true

# Run package dev mode
npm run pkg:dev &

#Create new container with mounted project directory
docker run --name Doconv -p 3000:3000 -v $(pwd):/app ghcr.io/alexxnb/doconv:latest npm run dev