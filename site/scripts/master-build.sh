#!/bin/bash

# Backup check
read -r -p "Build from backup database? [y/N] (Default: no)" BACKUP_RESP
BACKUP_RESP=${BACKUP_RESP:-no}

if [[ "$BACKUP_RESP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  source ./scripts/build-from-backup.sh
  exit 0
fi

read -r -p "Sync from another database? [y/N] (Default: no)" SYNC_RESP
SYNC_RESP=${SYNC_RESP:-no}

if [[ "$SYNC_RESP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  source ./scripts/sync-machines.sh
  exit 0
fi
