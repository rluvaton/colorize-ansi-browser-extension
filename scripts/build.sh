#!/usr/bin/env bash

zip \
  -r extension.zip . \
  -x scripts/\* \
  -x images/before.png \
  -x images/after.png \
  -x .idea/\* \
  -x .gitignore \
  -x .git/\* \
  -x README.md
