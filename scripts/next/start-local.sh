#!/usr/bin/env bash
# Starts only a localhost synthetic-data test. No installs, no SMTP, no Hostinger operations.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
for cmd in node npm php; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Ontbreekt: $cmd. Er is niets geïnstalleerd. Zie docs/next/TESTEN.md."
    exit 1
  fi
done
php -r 'exit(PHP_VERSION_ID>=80200 && extension_loaded("sodium") && extension_loaded("fileinfo") ? 0 : 1);' || {
  echo 'PHP 8.2+ met sodium en fileinfo is nodig. Er is niets gewijzigd.'; exit 1;
}
PORT=8187
if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
 echo "Poort $PORT is bezet. Stop uitsluitend je eerdere SubsidieReady-testserver of volg de handleiding voor een andere poort."
 exit 1
fi
npm run build
PRIVATE="${HOME}/subsidieready-next-local-test-private"
if [ ! -f "$PRIVATE/config.php" ]; then
 php scripts/next/setup.php --local --dir="$PRIVATE" --origin="http://127.0.0.1:$PORT"
fi
export SR_NEXT_CONFIG="$PRIVATE/config.php"
php -r 'require "server/next/service.php"; $c=srn_config(); exit($c["mode"]==="local" && $c["origin"]==="http://127.0.0.1:8187" && $c["transport"]==="spool" ? 0 : 1);' || {
 echo 'Bestaande configuratie past niet bij de veilige lokale test; niets overschreven.'; exit 1;
}
echo
echo 'SubsidieReady lokale test — uitsluitend fictieve gegevens.'
echo 'Er worden GEEN echte e-mails of leads verstuurd.'
echo "Private testdata staat buiten de website in $PRIVATE. Deel die map nooit."
echo "Mijn plan: http://127.0.0.1:$PORT/mijn-plan/"
echo "Advies:    http://127.0.0.1:$PORT/advies/"
echo "Sales:     http://127.0.0.1:$PORT/sales/"
echo 'Testverkoper: manager@example.invalid of verkoper@example.invalid.'
echo 'Eenmalige codes verschijnen hieronder zodra je ze aanvraagt. Stop met Ctrl+C.'
SERVER='';INBOX=''
cleanup(){ [ -z "$SERVER" ] || kill "$SERVER" 2>/dev/null || true; [ -z "$INBOX" ] || kill "$INBOX" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
php -d upload_max_filesize=10M -d post_max_size=12M -S "127.0.0.1:$PORT" -t "$ROOT" scripts/next/router.php &
SERVER=$!
(
 while kill -0 "$SERVER" 2>/dev/null; do
  MESSAGES="$(php scripts/next/mail-worker.php --local-inbox)" || exit 1
  if [ "$MESSAGES" != '[]' ]; then printf '\nLOKALE TESTPOSTBUS (geen echte verzending)\n%s\n' "$MESSAGES"; fi
  sleep 3
 done
) &
INBOX=$!
if command -v open >/dev/null 2>&1; then (sleep 1; open "http://127.0.0.1:$PORT/mijn-plan/") & fi
wait "$SERVER"
