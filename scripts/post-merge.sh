#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Database migrations require a separately reviewed, owner-approved release step.
