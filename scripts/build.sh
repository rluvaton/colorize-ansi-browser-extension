#!/usr/bin/env bash

ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
echo "Script dir: $SCRIPT_DIR"

(
  cd "$ROOT_DIR" && \
  ( rm "./extension.zip" || true) && \
  zip \
    -r extension.zip . \
    -x scripts/\* \
    -x images/before.png \
    -x images/after.png \
    -x .idea/\* \
    -x .gitignore \
    -x .git/\* \
    -x README.md \
    -x .DS_Store
)
