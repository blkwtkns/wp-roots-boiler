#!/bin/bash
echo "BEWARE: Defaults are mapped for development machine"

# Machine input
read -r -p "Enter machine [prod/stage/dev/redev] (default: dev): " MACHINE
# Machine default
MACHINE=${MACHINE:-dev}

# current timestamp
NOW=`date +"%m_%d_%Y_%H_%M_%S"`

# Cases
if $(wp "@$MACHINE" core is-installed); then
  echo "wp core installed, exporting database backup as $MACHINE-backup_$NOW.sql in site root directory"
  wp "@$MACHINE" db export $MACHINE-backup_$NOW.sql
  wp "@$MACHINE" db export - > $MACHINE-backup_$NOW.sql
  INSTALLED=true
else
  echo "wp core not installed"
  read -r -p "Sync from another machine? [y/N]: " SYNC
  SYNC=${SYNC:-no}

  if [[ "$SYNC" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    source ./scripts/sync-machines.sh
    exit 0
  else
    read -r -p "Continue building WordPress? [y/N]: " BUILD_CONFIRM
    BUILD_CONFIRM=${BUILD_CONFIRM:-no}
    if [[ "$BUILD_CONFIRM" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      echo "Continuing build process..."
    else
      exit 0
    fi
  fi
fi

# Inputs
read -r -p "Enter site (enter ip or domain, default: example.local): " SITE
read -r -p "Enter title (default: example): " TITLE
read -r -p "Enter user name (default: admin): " USER
read -r -p "Enter email (default: example@example.com): " EMAIL
read -r -p "Enter password (default: example): " PASSWORD
read -r -p "Enter theme (default: dist): " THEME
read -r -p "Enter SQL backup file (if no backup file input, then default is to create a backup and just reinitialize with it: $MACHINE-backup_$NOW.sql): " SQL_BACKUP

# Defaults
RESP=${RESP:-yes}
MACHINE=${MACHINE:-dev}
USER=${USER:-admin}
EMAIL=${EMAIL:-example@example.com}
PASSWORD=${PASSWORD:-example}
THEME=${THEME:-dist}
SITE=${SITE:-example.local}
TITLE=${TITLE:-example}
SQL_BACKUP=${SQL_BACKUP:-$MACHINE-backup_$NOW.sql}
INSTALLED=${INSTALLED:-false}

# install routine
initWP() {
  echo "Installing core and theme..."
  wp "@$MACHINE" db reset --yes
  if [[ "$INSTALLED" = true ]]; then
    read -r -p "WordPress already installed, reinitialize? [y/N]: " REINIT
    REINIT=${REINIT:-no}

    if [[ "$REINIT" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      wp "@$MACHINE" core install --url=$SITE --title=$TITLE --admin_user=$USER --admin_email=$EMAIL --admin_password=$PASSWORD
      wp "@$MACHINE" theme install $THEME --activate
      wp "@$MACHINE" plugin activate --all
    fi
  fi
}

if [ -f $SQL_BACKUP ] && [ $SQL_BACKUP != "$MACHINE-backup_$NOW.sql" ]; then
  echo "Initializing WordPress..."
  initWP
  echo "WordPress initialized."
  echo "Importing database backup..."

  if [ $MACHINE = "prod" ] || [ $MACHINE = "stage" ] || [ $MACHINE = "redev" ]; then

    read -r -p "Sync the uploads folder? [y/N] " uploads
    uploads=${uploads:-no}
    if [[ "$uploads" =~ ^([yY][eE][sS]|[yY])$ ]]; then
      rsync -az --progress web/app/uploads/ web@$SITE:/srv/www/kaa/current/web/app/uploads/
    fi
  fi
  # rsync -az --progress $SQL_BACKUP web@$SITE:/srv/www/kaa/current
  # wp "@$MACHINE" db import $SQL_BACKUP
  cat $SQL_BACKUP | wp "@$MACHINE" db import -
else
  read -r -p "Distinct database backup not found! Continue with WordPress initialization? [y/N]: " WORD_INIT
  WORD_INIT=${WORD_INIT:-no}
  if [[ "$WORD_INIT" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    initWP
  else
    echo "Routine terminated."
    exit 0
  fi
fi
