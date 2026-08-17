#!/bin/bash
# Emitir certificado Let's Encrypt para hairyelbicho.com en el VPS.
# Requisito: DNS A de @ y www ya apuntan a este servidor (72.60.127.160).
# No toca taxidriver.conf.
set -euo pipefail

if ! command -v certbot >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y certbot python3-certbot-nginx
fi

nginx -t
systemctl reload nginx

certbot --nginx \
  -d hairyelbicho.com \
  -d www.hairyelbicho.com \
  --non-interactive \
  --agree-tos \
  --email ark88@arkadium88holdingssl.com \
  --redirect \
  --keep-until-expiring

nginx -t
curl -sI -o /dev/null -w "https_apex:%{http_code}\n" --max-time 15 https://hairyelbicho.com/
curl -sI -o /dev/null -w "https_www:%{http_code}\n" --max-time 15 https://www.hairyelbicho.com/
echo | openssl s_client -connect hairyelbicho.com:443 -servername hairyelbicho.com 2>/dev/null \
  | openssl x509 -noout -subject -ext subjectAltName
