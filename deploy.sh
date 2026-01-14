#!/bin/bash
set -e

aws ecr get-login-password --region ap-south-1 \
| docker login --username AWS --password-stdin 308855860105.dkr.ecr.ap-south-1.amazonaws.com

docker stop backend || true
docker rm backend || true

docker pull 308855860105.dkr.ecr.ap-south-1.amazonaws.com/backend-app:latest

docker run -d \
  -p 5000:8080 \
  --name backend \
  308855860105.dkr.ecr.ap-south-1.amazonaws.com/backend-app:latest
