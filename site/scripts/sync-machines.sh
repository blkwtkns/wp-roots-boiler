#!/bin/bash

DEVDIR="web/app/uploads/"
DEVSITE="example.local"

PRODDIR="web@example.com:/srv/www/example/current/web/app/uploads/"
PRODSITE="example.com"

STAGDIR="web@example.com:/srv/www/example/current/web/app/uploads/"
STAGSITE="example.com"

if [ $# -eq 0 ]; then
  read -r -p "Which database do you want to reset? [dev/stage/prod] " DB_RESP
  read -r -p "Which database do you want to sync from? [dev/stage/prod] " SYNC_RESP
  TO=$DB_RESP
  FROM=$SYNC_RESP
else
  TO=$2
  FROM=$1
fi

case "$TO-$FROM" in
  dev-prod) DIR="up";  FROMSITE=$DEVSITE;  FROMDIR=$DEVDIR;  TOSITE=$PRODSITE; TODIR=$PRODDIR; ;;
  dev-stage)    DIR="up"   FROMSITE=$DEVSITE;  FROMDIR=$DEVDIR;  TOSITE=$STAGSITE; TODIR=$STAGDIR; ;;
  prod-dev) DIR="down" FROMSITE=$PRODSITE; FROMDIR=$PRODDIR; TOSITE=$DEVSITE;  TODIR=$DEVDIR; ;;
  stage-dev)    DIR="down" FROMSITE=$STAGSITE; FROMDIR=$STAGDIR; TOSITE=$DEVSITE;  TODIR=$DEVDIR; ;;
  *) echo "usage: $0 dev prod | dev stage | prod dev | prod stage" && exit 1 ;;
esac

read -r -p "Reset the $TO database and sync $DIR from $FROM? [y/N] " response
read -r -p "Sync the uploads folder? [y/N] " uploads


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

# cd ../ &&
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  wp "@$TO" db export $TO-backup.sql &&
  wp "@$TO" db reset --yes &&
  wp "@$FROM" db export -> $FROM-backup.sql &&
  wp "@$TO" core install --url=$SITE --title=$TITLE --admin_user=$USER --admin_email=$EMAIL --admin_password=$PASSWORD &&
  wp "@$TO" theme install $THEME --activate

  if $(wp "@$FROM" core is-installed --network); then
    wp "@$FROM" search-replace --url=$FROMSITE $FROMSITE $TOSITE --skip-columns=guid --network --export | wp "@$TO" db import -
  else
    wp "@$FROM" search-replace --url=$FROMSITE $FROMSITE $TOSITE --skip-columns=guid --export | wp "@$TO" db import -
  fi

fi

if [[ "$uploads" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  rsync -az --progress "$FROMDIR" "$TODIR"
fi
