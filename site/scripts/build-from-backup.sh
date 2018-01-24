#!/bin/bash


echo "Defaults are mapped for development machine"

read -r -p "Backup current database? [y/N] (default: yes): " RESP
read -r -p "Enter machine [prod/stage/dev] (default: dev): " MACHINE

if $(wp "@$MACHINE" core is-installed); then
  echo "wp core installed"
else
  echo "wp core not installed"
  read -r -p "Sync from another machine? (default: no): " SYNC
  SYNC=${SYNC:-no}

  if [[ "$SYNC" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    source ./scripts/sync-machines.sh
    exit 0
  fi
fi

read -r -p "Enter site (enter ip or domain, default: example.local): " SITE
read -r -p "Enter title (default: example): " TITLE
read -r -p "Enter user name (default: admin): " USER
read -r -p "Enter email (default: aperson@example.com): " EMAIL
read -r -p "Enter password (default: P@%%W0RD!): " PASSWORD
read -r -p "Enter theme (default: dist): " THEME
read -r -p "Enter SQL backup file (default: ./dev-backup.sql): " SQL_BACKUP

RESP=${RESP:-yes}
MACHINE=${MACHINE:-dev}
USER=${USER:-admin}
EMAIL=${EMAIL:-example@example.com}
PASSWORD=${PASSWORD:-P@%%W0RD!}
THEME=${THEME:-dist}
SITE=${SITE:-example.local}
TITLE=${TITLE:-example}
SQL_BACKUP=${SQL_BACKUP:-./$MACHINE-backup.sql}
NOW=`date +"%m_%d_%Y"`

# install routine
initWP() {
  echo "Installing core and theme..."
  wp "@$MACHINE" db reset --yes
  wp "@$MACHINE" core install --url=$SITE --title=$TITLE --admin_user=$USER --admin_email=$EMAIL --admin_password=$PASSWORD
  wp "@$MACHINE" theme install $THEME --activate
}

# Create timestamp backup
if [[ "$RESP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  wp "@$MACHINE" db export $MACHINE-backup_$NOW.sql
  echo "Database backup exported as $MACHINE-backup_$NOW.sql in site root directory"
fi

# REMOTE
if [ $MACHINE = "prod" ] || [ $MACHINE = "stage" ]; then
  echo "check sql backup $SQL_BACKUP"
  ssh "web@$SITE" "test -e /srv/www/kaa/current/$SQL_BACKUP"
  if [ $? -eq 0 ]; then
    # your file exists
    initWP

    if [[ "$RESP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      ssh "web@$SITE" "cp /srv/www/kaa/current/$MACHINE-backup_$NOW.sql /srv/www/kaa/current/$MACHINE-backup.sql"
      echo "Database backup copied as $MACHINE-backup.sql in site root directory"
    fi

  else
    echo "No backup sql file found to copy over to remote machine"
  fi

  exit 0
fi

# LOCAL
initWP

if [ -f $SQL_BACKUP ]; then
  wp "@$MACHINE" db import $SQL_BACKUP
  echo "Database backup imported"
else
  echo "Database backup not found! Either setup up WordPress manually if no other database exists, or sync from existing database"
fi

if [[ "$RESP" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  cp $MACHINE-backup_$NOW.sql $MACHINE-backup.sql
  echo "Database backup copied as $MACHINE-backup.sql in site root directory"
fi
