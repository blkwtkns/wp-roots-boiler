#!/bin/bash

# Machine input
read -r -p "Enter machine [prod/stage/dev/redev] (default: dev): " MACHINE
# Machine default
MACHINE=${MACHINE:-dev}

# current timestamp
NOW=`date +"%m_%d_%Y_%H_%M_%S"`

# Cases
if $(wp "@$MACHINE" core is-installed); then
  echo "Database exported"

  if [ $MACHINE = "prod" ] || [ $MACHINE = "stage" ] || [ $MACHINE = "redev" ]; then
    wp "@$MACHINE" db export $MACHINE-backup_$NOW.sql
  fi
  wp "@$MACHINE" db export - > $MACHINE-backup_$NOW.sql
else
  echo "WordPress core not installed, no database to back up"
fi
