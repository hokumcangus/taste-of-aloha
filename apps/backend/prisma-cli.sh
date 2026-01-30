#!/usr/bin/env bash
# Prisma CLI wrapper to automatically set DATABASE_URL from .env

set -a
source .env
set +a

npx prisma "$@" --url "$DATABASE_URL"
