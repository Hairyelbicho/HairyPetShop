# HairyPetShop — punto de secuencia (17 ago 2026)

Ábrelo **mañana antes de tocar código**. Este archivo es el mapa de hoy; el README de marketing está en `README.md`.

## En 30 segundos

- Carpeta: `H:\HairyPetShop`
- Repo: https://github.com/Hairyelbicho/HairyPetShop (`main`, actualizado hoy)
- Stack propio: API Node `:8787` + Postgres (Docker en VPS). Ya no depende de Supabase/n8n/Readdy para el backend.
- **hairyelbicho.com sigue en Vercel** (Readdy viejo, `76.76.21.21`) hasta que Hostinger apunte el DNS al VPS.
- Preview VPS (Docker, no toca TaxiDriver): http://72.60.127.160:8090
- Preview Pi (nginx `:8090`): http://192.168.1.167:8090

Arranque local (PC):

```bash
cd H:\HairyPetShop
npm run dev
```

API local (otra terminal): `cd backend && node server.mjs` (puerto 8787).

No commitear `.env` ni `backend/.env`.

---

## Qué se hizo hoy (17 ago)

1. **Docker en el VPS actual** (`72.60.127.160`), aislado de TaxiDriver:
   - Carpeta `/opt/HairyPetShop`
   - Contenedores: `hairypetshop-web` (:8090), `hairypetshop-api`, `hairypetshop-db`
   - Red Docker `hairypetshop`. Postgres **no** se publica al host.
   - Nginx del VPS: vhost `hairyelbicho.com` → `127.0.0.1:8090` (sin tocar `taxidriver.conf`).
   - Disco VPS tras el stack: **29 GB usados / 19 GB libres** de 48 GB (antes 28/21). RAM ~3,8 GB, ~2,7 disponibles.

2. **Autoridad de holding y canal B2B**
   - `/sobre-nosotros` — texto corporativo + visión retail alimentación animal en España.
   - Pie: *HairyPetShop | Una marca de **Arkadium88 Holdings SL*** + copyright de la SL.
   - Menú **Partners / Proveedores** (`/partners`) — formulario B2B (empresa, CIF, propuesta) → `/api/leads` origen `partners`.
   - Ficha técnica línea propia Delmocán: `/producto/hairy-nutrition-adulto-pollo-arroz`
   - Logo propio `/hairypetshop-logo.png` (sin CDN Readdy).

3. **Printify** ya no va por Supabase. Token en `backend/.env` como `PRINTIFY_API_TOKEN` (y opcional `PRINTIFY_SHOP_ID`). En el VPS:
   ```bash
   nano /opt/HairyPetShop/backend/.env
   cd /opt/HairyPetShop && docker compose -f deploy/docker-compose.yml --env-file deploy/.env restart hairypetshop-api
   curl -s http://127.0.0.1:8090/api/health   # debe printify:true
   ```
   Si el token se pegó hoy, comprobar health mañana. **No pegar el token en el chat.**

4. **Pi** sincronizada y build OK (`/home/hairy/apps/HairyPetShop`). AutomaDrive en la Pi **no se tocó** (`:80`).

5. **GitHub** `main` con API propia, Docker, Partners y fichas.

---

## Tres orígenes (no mezclar)

| Sitio | Qué es ahora |
|---|---|
| hairyelbicho.com | Sigue Vercel/Readdy hasta cambiar DNS en Hostinger |
| VPS Docker `:8090` | Código de hoy (holding, partners, fichas) |
| Pi `:8090` | Misma línea de código; también corre AutomaDrive en `:80` |
| GitHub `main` | Alineado con el trabajo de hoy |

TaxiDriver: `/root/arkadium_matriz` en el **mismo VPS**, red y puertos distintos. No mezclar carpetas.

---

## DNS Hostinger (pendiente — lo hace él a mano)

Borrar A/CNAME de Vercel. Dejar:

| Tipo | Nombre | Destino |
|------|--------|---------|
| A | `@` | `72.60.127.160` |
| A | `www` | `72.60.127.160` |

Cuando resuelva al VPS: `certbot --nginx -d hairyelbicho.com -d www.hairyelbicho.com`

Detalle: `deploy/HOSTINGER-DNS.md`

---

## Mañana, por orden

1. Leer este archivo.
2. **Printify:** si anoche se pegó el token, `curl -s http://127.0.0.1:8090/api/health` en el VPS y probar Hairy Tools → Imprimir con Printify.
3. **Hostinger DNS** → VPS. Luego HTTPS (certbot). Hasta entonces el dominio público sigue siendo Readdy.
4. Reconstruir Docker del VPS si hace falta (Sobre nosotros / pie de esta noche):
   ```bash
   cd /opt/HairyPetShop
   docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
   ```
   (O subir el tar como hoy y rebuild.)
5. **n8n en Render:** Hostinger → borrar CNAME `n8n`. Render → Delete `n8n-hairypetshop` (+ `hairy-utils` y crons). `render.yaml` del repo ya no lo redepliega. Ahorra el plan de Render; **no** libera GB del VPS.
6. Completar Groq / Stripe / PayPal en `/opt/HairyPetShop/backend/.env` si health sigue en `false`.
7. Seguir **Arkadium88 TaxiDriver** (proyecto aparte: `H:\Arkadium_TaxiDriver`) cuando HairyPetShop quede con DNS.
8. AutomaDrive: más adelante, carpeta/puertos/compose propios. No mezclar con HairyPetShop.

---

## Apagar al cerrar el día

| Qué | ¿Se puede apagar? |
|---|---|
| **Raspberry Pi** | Sí para HairyPetShop (el origen 24/7 previsto es el VPS). **No** si quieres que AutomaDrive siga en línea esta noche. |
| **Docker Desktop (PC)** | Sí. El stack de producción está en el VPS, no en el PC. |
| **VPS** | **No.** Ahí están TaxiDriver y HairyPetShop Docker. |
| **Este chat** | Sí, cuando Git esté guardado. Mañana abre `CONTINUAR.md`. |

SSH VPS: `root@72.60.127.160` (clave `arkadium_vps_ed25519`).  
SSH Pi: `hairy@192.168.1.167` — app en `/home/hairy/apps/HairyPetShop`.
