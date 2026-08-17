# HairyPetShop — punto de secuencia (17 ago 2026, noche)

Ábrelo **antes de tocar código**. Este archivo es el mapa; el README de marketing está en `README.md`.

## En 30 segundos

- Carpeta: `H:\HairyPetShop`
- Repo: https://github.com/Hairyelbicho/HairyPetShop (`main`)
- Stack: API Node `:8787` + Postgres (Docker en el VPS). Sin Supabase/n8n/Readdy de backend.
- **DNS ya apunta al VPS** (`72.60.127.160`). HTTP sirve HairyPetShop.
- **HTTPS está roto:** el 443 del VPS enseña el certificado de TaxiDriver → `NET::ERR_CERT_COMMON_NAME_INVALID`.
- **Primera tarea de mañana:** emitir Let’s Encrypt (certbot). SSH desde este PC quedó bloqueado esta noche.

Arranque local (PC):

```bash
cd H:\HairyPetShop
npm run dev
```

API local (otra terminal): `cd backend && node server.mjs` (puerto 8787).

No commitear `.env` ni `backend/.env`.

---

## Bloqueo de ahora: certificado HTTPS

El usuario abrió `https://hairyelbicho.com` y Brave mostró **La conexión no es privada** / `NET::ERR_CERT_COMMON_NAME_INVALID`.

| Comprobación | Resultado |
|---|---|
| DNS `@` y `www` | `72.60.127.160` (VPS). Ya no es Vercel. |
| `http://hairyelbicho.com` | 200, título HairyPetShop |
| `https://hairyelbicho.com` | Certificado **CN=`taxidriver.arkadium88holdingssl.com`** (Let’s Encrypt, caduca 3 nov 2026) |
| Causa | Nginx :443 default es TaxiDriver. Hairy solo tiene vhost HTTP (:80 → `:8090`). |
| SSH esta noche | Puerto 22 **timeout / reset** desde el PC (fail2ban o firewall Hostinger). No reintentar en bucle: alarga el ban. |

**Arreglo (una de estas dos, mañana):**

1. Hostinger → VPS → **Console** (navegador, no SSH) y pegar:

```bash
certbot --nginx -d hairyelbicho.com -d www.hairyelbicho.com --non-interactive --agree-tos --email ark88@arkadium88holdingssl.com --redirect
```

Si no hay certbot: `apt-get update && apt-get install -y certbot python3-certbot-nginx`

2. O desbloquear SSH (`fail2ban-client set sshd unbanip IP_DEL_PC` o firewall de Hostinger) y desde el PC:

```bash
ssh -i %USERPROFILE%\.ssh\arkadium_vps_ed25519 root@72.60.127.160
bash /opt/HairyPetShop/deploy/issue-letsencrypt.sh
```

El script local está en `deploy/issue-letsencrypt.sh` (aún no está copiado al VPS si no se subió esta noche). **No toca `taxidriver.conf`.**

Comprobar después:

```bash
echo | openssl s_client -connect hairyelbicho.com:443 -servername hairyelbicho.com 2>/dev/null | openssl x509 -noout -subject -ext subjectAltName
```

Debe listar `hairyelbicho.com` y `www.hairyelbicho.com`. Luego recargar Brave (ventana privada si cachea el aviso).

HTTP de respaldo mientras tanto: `http://hairyelbicho.com` o `http://72.60.127.160:8090`. Si Chrome/Brave fuerza HTTPS, es HSTS de cuando el dominio estaba en Vercel.

---

## Qué se hizo el 17 ago

1. **Docker en el VPS** (`72.60.127.160`), aislado de TaxiDriver:
   - `/opt/HairyPetShop` — `hairypetshop-web` (:8090), `hairypetshop-api`, `hairypetshop-db`
   - Red `hairypetshop`. Postgres no se publica al host.
   - Nginx host: vhost HTTP `hairyelbicho.com` → `127.0.0.1:8090` (sin tocar `taxidriver.conf`).
2. Holding / Partners / ficha Delmocán / logo propio (ver commits de hoy).
3. Printify por API propia (`PRINTIFY_API_TOKEN` en `backend/.env` del VPS).
4. Pi sincronizada (`/home/hairy/apps/HairyPetShop`). AutomaDrive `:80` no se tocó.
5. **Hostinger DNS** cambiado a mano: `@` y `www` → `72.60.127.160` (hecho).
6. Diagnóstico SSL de esta noche (arriba). Script `deploy/issue-letsencrypt.sh`.

---

## Tres orígenes (no mezclar)

| Sitio | Qué es ahora |
|---|---|
| http://hairyelbicho.com | VPS / Docker de hoy (HairyPetShop) |
| https://hairyelbicho.com | **Roto** hasta certbot (cert de TaxiDriver) |
| VPS `:8090` | Mismo stack, sin DNS |
| Pi `:8090` | Copia; AutomaDrive en `:80`. IP LAN `192.168.1.167` no respondía esta noche |
| GitHub `main` | Código de hoy; este handoff va en el commit de cierre |

TaxiDriver: `/root/arkadium_matriz` en el **mismo VPS**. No mezclar carpetas ni certificados.

---

## Mañana, por orden

1. Leer este archivo.
2. **HTTPS (primero).** Console Hostinger o SSH desbloqueado → certbot (bloque de arriba). Verificar SAN del certificado.
3. **Printify:** `curl -s http://127.0.0.1:8090/api/health` en el VPS; probar Hairy Tools → Imprimir. **No pegar el token en el chat.**
4. Si el front del VPS está viejo respecto a disco: rebuild Docker:
   ```bash
   cd /opt/HairyPetShop
   docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
   ```
5. **n8n en Render:** Hostinger → borrar CNAME `n8n`. Render → Delete `n8n-hairypetshop` (+ `hairy-utils` y crons). Ahorra Render; **no** libera GB del VPS.
6. Completar Groq / Stripe / PayPal en `/opt/HairyPetShop/backend/.env` si health sigue en `false`.
7. TaxiDriver (`H:\Arkadium_TaxiDriver`) cuando Hairy tenga HTTPS verde.
8. AutomaDrive: más adelante, stack propio. No mezclar.

Detalle DNS: `deploy/HOSTINGER-DNS.md`

---

## Apagar al cerrar el día

| Qué | ¿Se puede apagar? |
|---|---|
| **Raspberry Pi** | Sí para HairyPetShop. **No** si AutomaDrive debe seguir en línea. |
| **Docker Desktop (PC)** | Sí. Producción está en el VPS. |
| **VPS** | **No.** TaxiDriver + HairyPetShop Docker. |
| **Este chat** | Sí. Mañana abre **este archivo**. |

SSH VPS: `root@72.60.127.160` (clave `arkadium_vps_ed25519`). Esta noche el 22 no contestaba desde el PC.  
SSH Pi: `hairy@192.168.1.167` — app en `/home/hairy/apps/HairyPetShop`.
