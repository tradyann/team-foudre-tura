#!/bin/bash

SRC="/mnt/d/DEVELOPMENTS/TEAM_FOUDRE/TURA_APP/my-app/dist/my-app/browser/"
DEST="foudreapp:/var/www/my-app/"

echo "🚀 Déploiement de $SRC vers $DEST"

rsync -avz --delete --rsync-path="sudo rsync" "$SRC" "$DEST"

echo "✅ Déploiement terminé."