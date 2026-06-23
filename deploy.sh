#!/usr/bin/env bash
# Deploy del sito Giochi VLE su GitHub Pages.
# Uso:  ./deploy.sh "messaggio di commit"
#       ./deploy.sh            (usa un messaggio con data/ora)
set -euo pipefail

REPO="umbertoschiano07/giochi-vle"
URL="https://umbertoschiano07.github.io/giochi-vle/"

# Lavora sempre nella cartella dello script
cd "$(dirname "$0")"

MSG="${1:-Aggiornamento sito $(date '+%Y-%m-%d %H:%M')}"

# 1) Commit (solo se ci sono modifiche)
if [[ -n "$(git status --porcelain)" ]]; then
  git add -A
  git commit -q -m "$MSG"
  echo "✅ Commit: $MSG"
else
  echo "ℹ️  Nessuna modifica da committare."
fi

# 2) Push
git push -q
echo "✅ Push su origin/main"

# 3) Forza la build di Pages (a volte non parte da sola dopo il push)
gh api -X POST "repos/$REPO/pages/builds" >/dev/null
echo "⏳ Build avviata, attendo il completamento..."

# 4) Attendi che la build sia 'built' sul commit appena pushato
SHA="$(git rev-parse HEAD)"
for i in $(seq 1 20); do
  read -r STATUS BUILT_SHA < <(gh api "repos/$REPO/pages/builds/latest" --jq '.status+" "+.commit' 2>/dev/null || echo "unknown ")
  if [[ "$STATUS" == "built" && "$BUILT_SHA" == "$SHA" ]]; then
    echo "✅ Sito pubblicato: $URL"
    echo "   (fai un hard refresh: Cmd+Shift+R)"
    exit 0
  fi
  sleep 10
done

echo "⚠️  Build non confermata entro il tempo previsto. Controlla: https://github.com/$REPO/deployments"
exit 1
