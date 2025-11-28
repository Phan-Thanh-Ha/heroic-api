#!/bin/bash

# Script để chạy docker-compose với file env đúng theo NODE_ENV

NODE_ENV=${NODE_ENV:-development}
ENV_FILE=".env.${NODE_ENV}"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: File $ENV_FILE not found!"
    exit 1
fi

echo "Using environment file: $ENV_FILE"
docker-compose --env-file "$ENV_FILE" "$@"

