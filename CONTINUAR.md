# HairyPetShop — punto de secuencia (19 ago 2026, al abrir)

Ábrelo **antes de tocar código**. Este archivo es el mapa. El README de marketing está en `README.md`. Diario de ayer: `SESSION-2026-08-18.md` y el txt en Escritorio (`Readmes, listado trabajos diarios\18 Agosto Trabajos realizados hoy.txt`).

## Chequeo 19 ago ~12:15 (antes de abrir TaxiDriver)

- **https://hairyelbicho.com** en línea: home, catálogo, «Llámame ahora», Sobre nosotros. HTTP → HTTPS 301.
- Health: `ok`, `postgres: true`, `groq: true`, `mundosms: false`, Printify/Stripe/PayPal `false`. Número de voz `34848681101`.
- Docker VPS: `hairypetshop-web` (~17 h), `hairypetshop-api` (~16 h), `hairypetshop-db` healthy (~42 h).
- TaxiDriver en el mismo VPS: **https://taxidriver.arkadium88holdingssl.com** responde 200. Se puede abrir en otra ventana de Cursor.
- Matriz `arkadium88holdingssl.com` sigue en Hostinger (no en el VPS). MundoSMS sigue sin USER/PASSWORD: el formulario no llama de verdad.
- Este chat de Hairy se puede cerrar. **No apagar el VPS.**

## 19 ago ~12:35 — menú Automatización

El botón del header abría contabilidad interna (`/automation-dashboard`). **Fuera del menú.** Queda «Acceso interno» en letra pequeña al pie (`MatrizBar`). Código local; **producción no cambia hasta sync VPS** (GitHub `main` + `deploy/vps-sync-rebuild.sh`).

Diario: `SESSION-2026-08-19.md` y el txt del 19 ago en Escritorio.

## Qué quedó cerrado el 18 ago (noche)

- **https://hairyelbicho.com** en línea, Let’s Encrypt (caduca 16 nov 2026).
- Groq en producción **vivo** (modelo nuevo en `backend/groq.mjs`; el 70b se apagó el 16 ago). Health última lectura: `postgres: true`, `groq: true`, **`mundosms: false`**.
- Escritura Arkadium88 leída (notaría 857, RM Navarra NA 45629, BORME 370135, Hacienda 2026/918307).
- **Veredicto corporativo:** la SL sirve para plataforma / SaaS / intermediación digital. **No** para ser concesionario ni importador de campers con el objeto y CNAE actuales. Detalle: canvas `arkadium88-capacidad-distribuidor`.
- El Toyota “Beach Edition 2027” del vídeo **no existe**. No hay plaza que pedir.

## En 30 segundos

- Carpeta: `H:\HairyPetShop`
- Repo: https://github.com/Hairyelbicho/HairyPetShop (`main`)
- VPS: `root@72.60.127.160` (clave `arkadium_vps_ed25519`). **No es git clone.**
- Motor IA: **siempre Groq**. Telefonía: **siempre MundoSMS**. **Nunca Twilio. Nunca Supabase.**
- Número: **+34 848 681 101** (`34848681101`). El bot de voz **cierra** (SMS de pago). Sin nombres de proveedores en la web pública.

Arranque local (PC):

```bash
cd H:\HairyPetShop
npm run dev
```

API local: `cd backend && node server.mjs` (puerto 8787).

No commitear `.env` ni `backend/.env`.

---

## Mañana — orden (no improvisar)

1. **MundoSMS en el VPS** (sin pegar claves en el chat). En `/opt/HairyPetShop/backend/.env`:
   `MUNDOSMS_USER`, `MUNDOSMS_PASSWORD`, `MUNDOSMS_NUMBER=34848681101`,
   `MUNDOSMS_VOICE_WEBHOOK=https://hairyelbicho.com/api/voice/mundosms`
   Luego recrear solo la API:

```bash
docker compose -f /opt/HairyPetShop/deploy/docker-compose.yml --env-file /opt/HairyPetShop/deploy/.env up -d hairypetshop-api
```

   Health esperado: `groq: true`, `mundosms: true`, `voice_from` 848.
   Panel MundoSMS: HTTP VozPush → esa URL (variable `texto_voz`).
   Probar «Llámame ahora» en el home.

2. **Matriz.** Si `https://arkadium88holdingssl.com` sigue en login Hostinger: DNS A `@` y `www` → `72.60.127.160` (no tocar `taxidriver`). Preview `http://72.60.127.160:8091`. Certbot cuando el DNS ya apunte al VPS (`deploy/HOSTINGER-DNS.md`). La landing está en `matriz/`; la subida del 18 se interrumpió.

3. Printify / Stripe / PayPal en el `.env` del VPS cuando 1 y 2 estén.

4. **No** retomar concesionario Toyota del vídeo. Si hay negocio camper: ofrecer la plataforma a un transformador real (Tinkervan / marca europea), no cambiar el objeto social hasta que lo pida un notario.

El VPS `/opt/HairyPetShop` se actualiza con `deploy/vps-sync-rebuild.sh` (tarball + rsync), **sin** pisar `backend/.env`.

---

## Corporativo (no reabrir el debate)

| Pregunta | Respuesta 18 ago |
|---|---|
| ¿La plataforma cabe en la escritura? | Sí. Art. 2: consultoría, plataformas digitales, software. CNAE 70.10 + 62.x + 73.11. |
| ¿Vender / importar campers como distribuidor? | No. Sin CNAE 45, capital 1.000 €, cláusula de mero intermediario. |
| “Y otros” del BORME | Recorte del boletín, no un comodín. |
| Camino limpio si un día hay stock | Filial o cambio de objeto en notaría + IAE Hacienda Navarra. |

CIF **B71563258**. Domicilio: C/ La Estación 3, Zubielqui (Allín). No copiar DNI ni escrituras al repo.

---

## Tres orígenes (no mezclar)

| Sitio | Estado al cierre 18 ago |
|---|---|
| https://hairyelbicho.com | VPS Docker, HTTPS propio |
| http://hairyelbicho.com | Redirige a HTTPS |
| VPS `:8090` | Mismo stack Hairy, sin DNS |
| VPS `:8091` | Matriz (subida no confirmada) |
| TaxiDriver | Mismo VPS, vhost aparte. IVR intacto |
| Pi `:8090` / AutomaDrive `:80` | Copia local; no tocar si AutomaDrive debe seguir |

---

## Apagar

| Qué | ¿Se puede apagar? |
|---|---|
| **Chat de Cursor** | Sí. Al volver: este archivo. |
| **Cursor / Docker Desktop (PC)** | Sí. Producción está en el VPS. |
| **Raspberry Pi** | Sí para HairyPetShop. **No** si AutomaDrive debe seguir en línea. |
| **VPS** | **No.** TaxiDriver + HairyPetShop + certificados. |

SSH Pi: `hairy@192.168.1.167`.
