# HairyPetShop — punto de secuencia (18 ago 2026, 16:55)

Ábrelo **antes de tocar código**. Este archivo es el mapa. El README de marketing (HairyWallet) está en `README.md`.

## Chequeo 18 ago 16:55

- **https://hairyelbicho.com está en línea.** Certificado Let’s Encrypt propio (`hairyelbicho.com` + `www`, caduca **16 nov 2026**). HTTP → HTTPS 301.
- Postgres de la API: **true**.
- **Producción NO tiene el código de esta tarde.** Home Last-Modified **17 ago**. Health sin `mundosms`/`voice_from`. `GET /api/voice/mundosms` → **404**. Groq/Printify/Stripe/PayPal → **false**.
- Rutas locales que en prod dan 404 del React: `/sobre-nosotros`, `/partners`, ficha Delmocán.
- PC: commit `4ca84372`, `main` 2 commits por delante de GitHub (sin push). No hay `backend/.env` en el PC.
- SSH al VPS no contestó en esta sesión: el rebuild sigue pendiente.

## En 30 segundos

- Carpeta: `H:\HairyPetShop`
- Repo: https://github.com/Hairyelbicho/HairyPetShop (`main`)
- **https://hairyelbicho.com está en línea** (Let’s Encrypt, SAN `hairyelbicho.com` + `www`, caduca 16 nov 2026).
- DNS `@` y `www` → VPS `72.60.127.160`. Docker: web `:8090`, API, Postgres.
- Motor IA: **siempre Groq**. Telefonía: **siempre MundoSMS**. **Nunca Twilio.**
- Número de salida: **+34 848 681 101** (`34848681101`).
- El bot de voz **cierra la venta** (SMS de pago). No pasa a comercial.

Arranque local (PC):

```bash
cd H:\HairyPetShop
npm run dev
```

API local: `cd backend && node server.mjs` (puerto 8787).

No commitear `.env` ni `backend/.env`.

---

## Qué se hizo el 18 ago

1. **HTTPS.** Certbot en el VPS. Certificado en `/etc/letsencrypt/live/hairyelbicho.com/`. Nginx `hairyelbicho.conf` tiene 443. **No se tocó `taxidriver.conf`.** Hay warnings de nombres duplicados por `taxidriver.conf.bak-pwa-2026-08-14` (no urgente).
2. **Cerrador de voz (estilo WorldCars, sin comercial):**
   - Formulario + consentimiento → MundoSMS llama desde 848 681 101 → Groq habla → si cierra, SMS con enlace de pago.
   - HairyPetShop: home «Te llamamos» + botón en Hairy IA.
   - API: `POST /api/leads` con `consent_call: true`; webhook `GET|POST /api/voice/mundosms`.
   - Código: `backend/mundosms.mjs`, `backend/voiceCloser.mjs`, `src/components/chat/CallMeBack.tsx`.
3. **TaxiDriver** (`H:\Arkadium_TaxiDriver`): mismo núcleo. IVR de viajes **no se toca**. Cerrador de altas: `POST /api/v1/centralita/closer/callback` y `/api/v1/centralita/closer/turn`.
4. Regla Cursor: `.cursor/rules/telefonía-mundosms.mdc`.

Pendiente para que la llamada salga de verdad: `MUNDOSMS_USER` y `MUNDOSMS_PASSWORD` en `backend/.env` (y en el `.env` de TaxiDriver). **No pegar la clave en el chat.**

```
MUNDOSMS_USER=
MUNDOSMS_PASSWORD=
MUNDOSMS_NUMBER=34848681101
MUNDOSMS_VOICE_WEBHOOK=https://hairyelbicho.com/api/voice/mundosms
```

En TaxiDriver: `MUNDOSMS_VOICE_WEBHOOK=https://taxidriver.arkadium88holdingssl.com/api/v1/centralita/closer/turn`

---

## Al volver

1. Leer este archivo (y el canvas de chequeo si está abierto).
2. SSH VPS `root@72.60.127.160` y rebuild:
   ```bash
   cd /opt/HairyPetShop
   git pull
   docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
   ```
   Antes hace falta **push** desde el PC (`main` va 2 commits por delante).
3. En `backend/.env` del VPS (no en el chat): `GROQ_API_KEY`, `MUNDOSMS_USER`, `MUNDOSMS_PASSWORD`, `MUNDOSMS_NUMBER=34848681101`, `MUNDOSMS_VOICE_WEBHOOK=https://hairyelbicho.com/api/voice/mundosms`. Recrear el contenedor API.
4. Health esperado: `groq: true`, `mundosms: true`, `voice_from` con el 848.
5. Panel MundoSMS: HTTP VozPush → ese webhook. Variable: `texto_voz`.
6. Probar «Llámame ahora» en el home.
7. Printify / Stripe / PayPal si siguen en `false`.
8. n8n Render: borrar CNAME `n8n` y el servicio.
9. TaxiDriver: cerrador de altas cuando Hairy llame bien.

Detalle DNS: `deploy/HOSTINGER-DNS.md`

---

## Tres orígenes (no mezclar)

| Sitio | Estado 18 ago tarde |
|---|---|
| https://hairyelbicho.com | VPS Docker HairyPetShop, HTTPS propio |
| http://hairyelbicho.com | Redirige a HTTPS (certbot --redirect) |
| VPS `:8090` | Mismo stack, sin DNS |
| TaxiDriver | Mismo VPS, vhost aparte. IVR MundoSMS intacto + cerrador nuevo |
| Pi `:8090` | Copia; AutomaDrive en `:80` |

---

## Apagar al cerrar ahora

| Qué | ¿Se puede apagar? |
|---|---|
| **Este chat** | Sí. Al volver: este archivo. |
| **Cursor / Docker Desktop (PC)** | Sí. Producción está en el VPS. |
| **Raspberry Pi** | Sí para HairyPetShop. **No** si AutomaDrive debe seguir en línea. |
| **VPS** | **No.** TaxiDriver + HairyPetShop + el certificado. |

SSH VPS: `root@72.60.127.160` (clave `arkadium_vps_ed25519`).  
SSH Pi: `hairy@192.168.1.167`.
