#!/bin/bash
# Replays a repository's recent commits and shows what GitHint would have suggested.
# Works on a throwaway clone in /tmp — your repository is never modified.
set -e
REPO="$(cd "${1:-.}" && git rev-parse --show-toplevel)"
COUNT="${2:-20}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

git clone -q "$REPO" "$WORK/replay"
cd "$WORK/replay"
TIP="$(git rev-parse HEAD)"

printf '\n%-50s | %s\n' "WHAT YOU WROTE" "WHAT GITHINT SUGGESTS"
printf -- '-%.0s' {1..100}; printf '\n'

for C in $(git log --no-merges --pretty=format:%H "$TIP" | head -"$COUNT"); do
  SUBJECT="$(git log -1 --pretty=format:%s "$C")"
  git checkout -q --force --detach "$C~1" 2>/dev/null || continue
  git diff "$C~1" "$C" | git apply --cached --whitespace=nowarn 2>/dev/null || continue
  printf '%-50s | %s\n' "${SUBJECT:0:50}" "$(githint suggest --plain 2>&1 | head -1)"
done
printf '\n'
