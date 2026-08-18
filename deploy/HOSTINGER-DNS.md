# DNS Hostinger — hairyelbicho.com → VPS actual (Docker)

VPS: `72.60.127.160` (mismo que TaxiDriver; HairyPetShop va en contenedores propios).

En el panel de Hostinger (Dominios → DNS), **borra** los registros que apuntan a Vercel (`76.76.21.21`, `vercel-dns`, `vercel-dns-017.com`) y deja:

| Tipo | Nombre | Destino / valor  | TTL |
|------|--------|------------------|-----|
| A    | @      | 72.60.127.160    | 300 |
| A    | www    | 72.60.127.160    | 300 |

No toques los DNS de AutomaDrive ni de TaxiDriver.

**n8n (Render), si lo vas a cerrar:** borra el CNAME `n8n` → `n8n-hairypetshop.onrender.com`. Luego en Render: Delete service `n8n-hairypetshop` (y `hairy-utils` / crons si existen). Eso ahorra el plan de Render (5 GB allí), no disco del VPS.

**Estado 18 ago tarde:** `@` y `www` → `72.60.127.160`. **HTTPS listo** (Let’s Encrypt, caduca 16 nov 2026). `https://hairyelbicho.com` y `www` sirven HairyPetShop. HTTP redirige a HTTPS.

- http://hairyelbicho.com → 301 → HTTPS
- `/api/*` → API propia en Docker (`hairypetshop-api`)
- https://hairyelbicho.com → nginx del VPS → `hairypetshop-web` (`:8090`)

Preview sin DNS: `http://72.60.127.160:8090`
