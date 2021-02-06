#!/bin/sh

#Remove running container if exists
docker rm --force Doconv || true

#Create new container with mounted project directory
docker run --name Doconv -p 3000:3000 -v $(pwd):/app doconv:latest npm run dev